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

  // ─────────────── Helpers de gráficos ───────────────

  // Barra de progreso horizontal con track
  const progressBar = (x, y, w, h, pct, color, label, value) => {
    pdf.setFillColor(238, 242, 246);
    pdf.roundedRect(x, y, w, h, 2, 2, 'F');
    const fillW = (pct / 100) * (w - 2);
    if (fillW > 0) {
      pdf.setFillColor(...hexToRgb(color));
      pdf.roundedRect(x + 1, y + 1, fillW, h - 2, 1.5, 1.5, 'F');
    }
    pdf.setTextColor(...C.slate);
    pdf.setFontSize(6);
    pdf.setFont('helvetica', 'bold');
    pdf.text(label, x + 2, y + h + 3);
    pdf.setTextColor(...C.primary);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${value}%`, x + w - 2, y + h + 3, { align: 'right' });
  };

  // Gráfico de barras para estadísticas
  const statBar = (x, y, w, label, val, trend, maxVal) => {
    const pct = maxVal > 0 ? val / maxVal : 0;
    // fondo tarjeta
    pdf.setFillColor(248, 250, 252);
    pdf.setDrawColor(226, 232, 240);
    pdf.roundedRect(x, y, w, 20, 3, 3, 'FD');
    // label
    pdf.setTextColor(...C.slate);
    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'bold');
    pdf.text((label || '').substring(0, 22), x + 3, y + 4);
    // track barra
    pdf.setFillColor(226, 232, 240);
    pdf.roundedRect(x + 3, y + 8, w - 6, 4, 2, 2, 'F');
    // fill
    const fillW = pct * (w - 6);
    const trendColor = trend === 'up' ? '#10b981' : trend === 'down' ? '#ef4444' : '#f59e0b';
    pdf.setFillColor(...hexToRgb(trendColor));
    pdf.roundedRect(x + 3, y + 8, Math.max(fillW, 0), 4, 2, 2, 'F');
    // valor
    pdf.setTextColor(...C.primary);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    const sym = trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→';
    pdf.text(`${val} ${sym}`, x + w - 4, y + 18, { align: 'right' });
  };

  // Círculo de prioridad para riesgos
  const riskDot = (x, y, r, label, cat, priority) => {
    const colors = { 1: '#10b981', 2: '#f59e0b', 3: '#ef4444' };
    const col = colors[priority] || '#f59e0b';
    pdf.setFillColor(...hexToRgb(col));
    pdf.circle(x, y, r, 'F');
    pdf.setTextColor(...C.white);
    pdf.setFontSize(5);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${priority}`, x, y + 1, { align: 'center' });
    // Label a la derecha
    pdf.setTextColor(100, 40, 40);
    pdf.setFontSize(5);
    pdf.setFont('helvetica', 'normal');
    pdf.text((label || '').substring(0, 40), x + r + 2, y + 1);
    // Categoría en gris
    pdf.setTextColor(150, 120, 120);
    pdf.setFontSize(4);
    pdf.setFont('helvetica', 'italic');
    pdf.text((cat || '').substring(0, 8), x + r + 2, y + 5);
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

    // Gauge de resumen (promedio de indicadores)
    const avg = Math.round(indicadores.reduce((s, ind) => s + ind.value, 0) / indicadores.length);
    const gaugeCx = pageWidth / 2;
    const gaugeCy = y + 18;
    const gaugeR = 18;
    drawGauge(gaugeCx, gaugeCy, gaugeR, avg, 'PROMEDIO GENERAL', '#0ea5e9');
    y += 40;

    // Indicadores en dos columnas con progressBar
    indicadores.forEach((ind, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const xPos = col === 0 ? col1X : col2X;
      const yPos = y + row * 22;

      if (yPos + 22 > pageHeight - marginY - 10) {
        newPage();
        y = marginY + 5 + row * 22;
        return;
      }

      progressBar(xPos, yPos, colWidth, 8, ind.value, ind.color || '#0ea5e9', ind.label, ind.value);
    });

    y += Math.ceil(indicadores.length / 2) * 22 + 8;
  }

  // ═══════════════════ ESTADÍSTICAS ═══════════════════
  if (estadisticas.length > 0) {
    y = sectionTitle('ESTADÍSTICAS', y);
    y += 2;

    const maxVal = Math.max(...estadisticas.map(s => s.val));
    estadisticas.forEach((stat, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const xPos = col === 0 ? col1X : col2X;
      const yPos = y + row * 24;

      if (yPos + 24 > pageHeight - marginY - 10) {
        newPage();
        y = marginY + 5 + row * 24;
        return;
      }

      statBar(xPos, yPos, colWidth, stat.label, stat.val, stat.trend, maxVal);
    });

    y += Math.ceil(estadisticas.length / 2) * 24 + 8;
  }

  // ═══════════════════ RIESGOS ═══════════════════
  if (riesgos.length > 0) {
    y = sectionTitle('RIESGOS IDENTIFICADOS', y);
    y += 2;

    riesgos.forEach((riesgo, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const xPos = col === 0 ? col1X : col2X;
      const yPos = y + row * 10;

      if (yPos + 10 > pageHeight - marginY - 10) {
        newPage();
        y = marginY + 5 + row * 10;
        return;
      }

      riskDot(xPos + 4, yPos + 5, 4, riesgo.title || '', riesgo.cat || 'RX', riesgo.imp || 2);
    });

    y += Math.ceil(riesgos.length / 2) * 10 + 10;
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
