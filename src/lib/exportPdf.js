import { jsPDF } from 'jspdf';

async function loadImageAsBase64(url) {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

/**
 * Generate a professional PDF report with text in two columns.
 */
export async function generateReportPdf(data, indicadores, estadisticas, riesgos, contentEl) {
  let gameaLogo = null;
  let eliserLogo = null;
  try {
    [gameaLogo, eliserLogo] = await Promise.all([
      loadImageAsBase64('/dist/gamea.png'),
      loadImageAsBase64('/dist/eliser.png'),
    ]);
  } catch (e) {
    console.warn('Could not load logo images – proceeding without logos.', e);
  }

  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const marginX = 14;
  const marginY = 18;
  const usableWidth = pageWidth - 2 * marginX;
  const footerY = pageHeight - 10;
  const colGap = 12;
  const colWidth = (usableWidth - colGap) / 2;
  const col1X = marginX;
  const col2X = marginX + colWidth + colGap;
  const headerY = marginY + 4;

  let currentPage = 1;
  let y = headerY;

  // Color palette
  const C = {
    primary: [10, 37, 64],       // deep blue
    accent: [14, 165, 233],       // brand blue
    dark: [30, 30, 46],           // slate-900
    slate: [71, 85, 105],         // slate-500
    light: [248, 250, 252],       // slate-50
    white: [255, 255, 255],
    gray: [150, 150, 170],
    muted: [200, 205, 215],
  };

  const hexToRgb = hex => {
    const c = hex.replace('#', '');
    return [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)];
  };

  // ─────────────── Decorations ───────────────
  const addHeader = () => {
    // Top accent line
    pdf.setDrawColor(...C.accent);
    pdf.setLineWidth(0.6);
    pdf.line(marginX, 5, pageWidth - marginX, 5);

    // Logos
    if (gameaLogo) {
      const ip = pdf.getImageProperties(gameaLogo);
      const h = 14;
      const w = h * (ip.width / ip.height);
      pdf.addImage(gameaLogo, 'PNG', marginX, 8, w, h);
    }
    if (eliserLogo) {
      const ip = pdf.getImageProperties(eliserLogo);
      const h = 10;
      const w = h * (ip.width / ip.height);
      pdf.addImage(eliserLogo, 'PNG', pageWidth - marginX - w, 10, w, h);
    }

    // Centered title
    pdf.setFontSize(16);
    pdf.setTextColor(...C.primary);
    pdf.setFont('helvetica', 'bold');
    pdf.text('REPORTE ESTRATÉGICO', pageWidth / 2, 16, { align: 'center' });
    pdf.setFontSize(7);
    pdf.setTextColor(...C.slate);
    pdf.setFont('helvetica', 'normal');
    pdf.text('GOBIERNO AUTÓNOMO MUNICIPAL DE EL ALTO  ·  TRANSICIÓN MUNICIPAL', pageWidth / 2, 21, { align: 'center' });

    // Header bottom line
    pdf.setDrawColor(...C.muted);
    pdf.setLineWidth(0.3);
    pdf.line(marginX, 25, pageWidth - marginX, 25);
  };

  const addFooter = () => {
    pdf.setDrawColor(...C.muted);
    pdf.setLineWidth(0.3);
    pdf.line(marginX, pageHeight - 11, pageWidth - marginX, pageHeight - 11);
    pdf.setFontSize(7);
    pdf.setTextColor(...C.gray);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Gobierno Autónomo Municipal de El Alto · Sistema de Control de Transición', marginX, footerY);
    pdf.text(`Página ${currentPage}`, pageWidth - marginX, footerY, { align: 'right' });
  };

  const newPage = () => {
    pdf.addPage();
    currentPage++;
    y = headerY;
    addHeader();
    addFooter();
  };

  const ensureSpace = (needed = 15) => {
    if (y + needed > pageHeight - marginY - 10) newPage();
  };

  // Draw a section title with left accent bar
  const sectionTitle = (text, top) => {
    ensureSpace(12);
    pdf.setDrawColor(...C.accent);
    pdf.setFillColor(...C.accent);
    pdf.rect(marginX, top, 3, 10, 'F');
    pdf.setFontSize(11);
    pdf.setTextColor(...C.primary);
    pdf.setFont('helvetica', 'bold');
    pdf.text(text, marginX + 8, top + 8);
    return top + 12;
  };

  // Draw a colored metric bar
  const metricBar = (x, y, w, label, value, color) => {
    const barH = 10;
    const gap = 3;
    pdf.setFillColor(...hexToRgb(color));
    pdf.roundedRect(x, y, w, barH, 2, 2, 'F');
    pdf.setTextColor(...C.white);
    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'bold');
    pdf.text(label.substring(0, 28), x + gap, y + 4);
    pdf.setFontSize(10);
    pdf.text(`${value}%`, x + w - gap, y + barH - gap, { align: 'right' });
  };

  // Init first page
  addHeader();
  addFooter();

  // ═══════════════════ MAIN HEADER ═══════════════════
  y += 6;
  // Big title
  pdf.setFontSize(22);
  pdf.setTextColor(...C.primary);
  pdf.setFont('helvetica', 'bold');
  const tLines = pdf.splitTextToSize(data.titulo || 'REPORTE ESTRATÉGICO DE TRANSICIÓN', usableWidth);
  pdf.text(tLines, pageWidth / 2, y, { align: 'center' });
  y += tLines.length * 8 + 4;

  // Subtitle with background stripe
  if (data.subtitulo) {
    pdf.setFontSize(9);
    pdf.setTextColor(...C.slate);
    pdf.setFont('helvetica', 'normal');
    const subLines = pdf.splitTextToSize(data.subtitulo, usableWidth);
    pdf.text(subLines, pageWidth / 2, y, { align: 'center' });
    y += subLines.length * 5 + 5;
  }

  // Info row: secretaria · direccion · unidad · fecha · responsable
  const infoChips = [data.secretaria, data.direccion, data.unidad].filter(Boolean);
  pdf.setFillColor(241, 245, 249);
  pdf.roundedRect(marginX, y - 2, usableWidth, infoChips.length > 0 ? 18 : 14, 3, 3, 'F');
  if (infoChips.length > 0) {
    pdf.setFontSize(8);
    pdf.setTextColor(...C.slate);
    pdf.setFont('helvetica', 'bold');
    pdf.text(infoChips.join('  ·  '), pageWidth / 2, y + 3, { align: 'center' });
    y += 7;
  }
  if (data.fecha) {
    pdf.setFontSize(7);
    pdf.setTextColor(...C.gray);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Fecha: ${data.fecha}`, pageWidth / 2, y + 3, { align: 'center' });
    y += 5;
  }
  if (data.acreditado) {
    pdf.setFontSize(7);
    pdf.setTextColor(...C.gray);
    pdf.text(`Responsable: ${data.acreditado}`, pageWidth / 2, y + 3, { align: 'center' });
    y += 3;
  }
  y += 6;

  // ═══════════════════ INDICADORES ═══════════════════
  if (indicadores.length > 0) {
    y = sectionTitle('MÉTRICAS CRÍTICAS DE TRANSICIÓN', y);
    y += 2;

    indicadores.forEach((ind, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const xPos = col === 0 ? col1X : col2X;
      const yPos = y + row * 14;

      if (yPos + 14 > pageHeight - marginY - 10) {
        newPage();
        y = marginY + 5 + row * 14;
        return;
      }

      metricBar(xPos, yPos, colWidth, ind.label, ind.value, ind.color || '#0ea5e9');
    });

    y += Math.ceil(indicadores.length / 2) * 14 + 8;
  }

  // ═══════════════════ ESTADÍSTICAS ═══════════════════
  if (estadisticas.length > 0) {
    y = sectionTitle('ESTADÍSTICAS', y);
    y += 2;

    estadisticas.forEach((stat, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const xPos = col === 0 ? col1X : col2X;
      const yPos = y + row * 17;

      if (yPos + 17 > pageHeight - marginY - 10) {
        newPage();
        y = marginY + 5 + row * 17;
        return;
      }

      // Card background
      pdf.setFillColor(248, 250, 252);
      pdf.setDrawColor(226, 232, 240);
      pdf.roundedRect(xPos, yPos, colWidth, 15, 3, 3, 'FD');
      // Label
      pdf.setTextColor(...C.slate);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text((stat.label || '').substring(0, 25), xPos + 4, yPos + 5);
      // Value
      pdf.setTextColor(...C.primary);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      const trendSym = stat.trend === 'up' ? '↗' : stat.trend === 'down' ? '↘' : '→';
      pdf.text(`${stat.val} ${trendSym}`, xPos + colWidth - 5, yPos + 12, { align: 'right' });
      // Trend indicator dot
      pdf.setFillColor(stat.trend === 'up' ? 16 : 185, 185, 185);
      pdf.circle(xPos + colWidth - 16, yPos + 4, 1.5, 'F');
    });

    y += Math.ceil(estadisticas.length / 2) * 17 + 8;
  }

  // ═══════════════════ RIESGOS ═══════════════════
  if (riesgos.length > 0) {
    y = sectionTitle('RIESGOS IDENTIFICADOS', y);
    y += 2;

    riesgos.forEach((riesgo, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const xPos = col === 0 ? col1X : col2X;
      const yPos = y + row * 16;

      if (yPos + 16 > pageHeight - marginY - 10) {
        newPage();
        y = marginY + 5 + row * 16;
        return;
      }

      // Card background with red tint
      pdf.setFillColor(254, 242, 242);
      pdf.setDrawColor(220, 38, 38, 0.3);
      pdf.roundedRect(xPos, yPos, colWidth, 14, 3, 3, 'FD');
      // Category tag
      pdf.setFillColor(239, 68, 68);
      pdf.roundedRect(xPos + 3, yPos + 2, 16, 5, 2, 2, 'F');
      pdf.setTextColor(...C.white);
      pdf.setFontSize(5);
      pdf.setFont('helvetica', 'bold');
      pdf.text((riesgo.cat || 'RX').substring(0, 3), xPos + 11, yPos + 5.5, { align: 'center' });
      // Title
      pdf.setTextColor(127, 29, 29);
      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'normal');
      pdf.text((riesgo.title || '').substring(0, 42), xPos + 22, yPos + 5);
      // Priority badge
      const impColors = { 1: '#10b981', 2: '#f59e0b', 3: '#ef4444' };
      const impColor = impColors[riesgo.imp] || '#f59e0b';
      pdf.setFillColor(...hexToRgb(impColor));
      pdf.roundedRect(xPos + colWidth - 12, yPos + 2, 9, 5, 2, 2, 'F');
      pdf.setTextColor(...C.white);
      pdf.setFontSize(6);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`P${riesgo.imp}`, xPos + colWidth - 7, yPos + 5.5, { align: 'center' });
    });

    y += Math.ceil(riesgos.length / 2) * 16 + 8;
  }

  // ═══════════════════ ALERTA ═══════════════════
  if (data.alerta) {
    ensureSpace(10);
    pdf.setFillColor(255, 247, 237);
    pdf.setDrawColor(251, 191, 36);
    pdf.roundedRect(marginX, y, usableWidth, 6, 3, 3, 'F');
    y += 4;
    pdf.setTextColor(146, 64, 14);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.text('⚠ ALERTA', marginX + 4, y + 1);
    y += 7;
    pdf.setFontSize(8);
    pdf.setTextColor(120, 53, 15);
    pdf.setFont('helvetica', 'normal');
    const alertLines = pdf.splitTextToSize(data.alerta, usableWidth - 16);
    pdf.text(alertLines, marginX + 8, y);
    y += alertLines.length * 4 + 10;
  }

  // ═══════════════════ OBSERVACIONES ═══════════════════
  if (data.observaciones) {
    y = sectionTitle('OBSERVACIONES', y);
    y += 2;
    pdf.setFontSize(8);
    pdf.setTextColor(55, 65, 81);
    pdf.setFont('helvetica', 'normal');
    const obsLines = pdf.splitTextToSize(data.observaciones, usableWidth);
    pdf.text(obsLines, marginX, y);
    y += obsLines.length * 4 + 6;
  }

  // ═══════════════════ FINAL: footers ═══════════════════
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setDrawColor(...C.muted);
    pdf.setLineWidth(0.3);
    pdf.line(marginX, pageHeight - 11, pageWidth - marginX, pageHeight - 11);
    pdf.setFontSize(7);
    pdf.setTextColor(...C.gray);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Gobierno Autónomo Municipal de El Alto · Sistema de Control de Transición', marginX, footerY);
    pdf.text(`Página ${i} de ${totalPages}`, pageWidth - marginX, footerY, { align: 'right' });
  }

  const blob = pdf.output('blob');
  return URL.createObjectURL(blob);
}
