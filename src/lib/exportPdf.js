import { jsPDF } from 'jspdf';

/**
 * Load an image from a URL and return a base64 data URL.
 */
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
 * Generate a PDF report with real text in two columns using the provided report data.
 *
 * @param {Object}   data         - Report metadata (titulo, subtitulo, secretaria, etc.)
 * @param {Array}    indicadores  - Gauge indicators
 * @param {Array}    estadisticas - Statistics cards
 * @param {Array}    riesgos      - Risk items
 * @param {HTMLElement} contentEl - (unused) element reference kept for API compatibility
 * @returns {Promise<string>} Blob URL of the generated PDF
 */
export async function generateReportPdf(data, indicadores, estadisticas, riesgos, contentEl) {
  // Load logos
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
  const marginX = 12;
  const marginY = 15;
  const usableWidth = pageWidth - 2 * marginX;
  const footerY = pageHeight - 8;
  const colGap = 10;
  const colWidth = (usableWidth - colGap) / 2;
  const col1X = marginX;
  const col2X = marginX + colWidth + colGap;

  let currentPage = 1;
  let y = marginY + 5;

  // Hex to RGB
  const hexToRgb = hex => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  };

  // ── Decorations ──
  const addDecorations = () => {
    // Logo GAMEA (esquina superior izquierda, sin deformar)
    if (gameaLogo) {
      const ip = pdf.getImageProperties(gameaLogo);
      const h = 12;
      const w = h * (ip.width / ip.height);
      pdf.addImage(gameaLogo, 'PNG', marginX, 5, w, h);
    }
    // Logo ELISER (esquina superior derecha, sin deformar)
    if (eliserLogo) {
      const ip = pdf.getImageProperties(eliserLogo);
      const h = 8;
      const w = h * (ip.width / ip.height);
      pdf.addImage(eliserLogo, 'PNG', pageWidth - marginX - w, 5, w, h);
    }
    pdf.setFontSize(14);
    pdf.setTextColor(40, 40, 40);
    pdf.text('REPORTE ESTRATÉGICO DE TRANSICIÓN', pageWidth / 2, marginY, { align: 'center' });
  };

  const addFooter = () => {
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text('Gobierno Autónomo Municipal de El Alto', marginX, footerY);
    pdf.text(`Página ${currentPage}`, pageWidth - marginX, footerY, { align: 'right' });
  };

  const newPage = () => {
    pdf.addPage();
    currentPage++;
    y = marginY + 5;
    addDecorations();
    addFooter();
  };

  const ensureSpace = (needed = 12) => {
    if (y + needed > pageHeight - marginY - 10) newPage();
  };

  // Init first page
  addDecorations();
  addFooter();

  // ═══════════════════ HEADER ═══════════════════
  y += 2;
  pdf.setFontSize(18);
  pdf.setTextColor(30, 30, 30);
  pdf.setFont('helvetica', 'bold');
  const titleLines = pdf.splitTextToSize(data.titulo || 'REPORTE ESTRATÉGICO', usableWidth);
  pdf.text(titleLines, pageWidth / 2, y, { align: 'center' });
  y += titleLines.length * 6 + 3;

  if (data.subtitulo) {
    pdf.setFontSize(10);
    pdf.setTextColor(80, 80, 80);
    pdf.setFont('helvetica', 'normal');
    const subLines = pdf.splitTextToSize(data.subtitulo, usableWidth);
    pdf.text(subLines, pageWidth / 2, y, { align: 'center' });
    y += subLines.length * 4 + 4;
  }

  const infoChips = [data.secretaria, data.direccion, data.unidad].filter(Boolean);
  if (infoChips.length > 0) {
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.setFont('helvetica', 'normal');
    pdf.text(infoChips.join('  •  '), pageWidth / 2, y, { align: 'center' });
    y += 5;
  }

  if (data.fecha) {
    pdf.setFontSize(8);
    pdf.setTextColor(120, 120, 120);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Fecha: ${data.fecha}`, pageWidth / 2, y, { align: 'center' });
    y += 4;
  }
  if (data.acreditado) {
    pdf.setFontSize(8);
    pdf.setTextColor(120, 120, 120);
    pdf.text(`Responsable: ${data.acreditado}`, pageWidth / 2, y, { align: 'center' });
    y += 6;
  }

  // ═══════════════════ INDICADORES (dos columnas) ═══════════════════
  if (indicadores.length > 0) {
    ensureSpace(10);
    pdf.setFontSize(12);
    pdf.setTextColor(30, 30, 30);
    pdf.setFont('helvetica', 'bold');
    pdf.text('MÉTRICAS CRÍTICAS', pageWidth / 2, y, { align: 'center' });
    y += 7;

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

      const [r, g, b] = hexToRgb(ind.color || '#0ea5e9');
      pdf.setFillColor(r, g, b);
      pdf.roundedRect(xPos, yPos, colWidth, 12, 2, 2, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.text(ind.label.substring(0, 30), xPos + 3, yPos + 5);
      pdf.setFontSize(10);
      pdf.text(`${ind.value}%`, xPos + colWidth - 6, yPos + 9, { align: 'right' });
    });

    y += Math.ceil(indicadores.length / 2) * 14 + 6;
  }

  // ═══════════════════ ESTADÍSTICAS (dos columnas) ═══════════════════
  if (estadisticas.length > 0) {
    ensureSpace(10);
    pdf.setFontSize(12);
    pdf.setTextColor(30, 30, 30);
    pdf.setFont('helvetica', 'bold');
    pdf.text('ESTADÍSTICAS', pageWidth / 2, y, { align: 'center' });
    y += 7;

    estadisticas.forEach((stat, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const xPos = col === 0 ? col1X : col2X;
      const yPos = y + row * 16;

      if (yPos + 16 > pageHeight - marginY - 10) {
        newPage();
        y = marginY + 5 + row * 16;
        return;
      }

      pdf.setDrawColor(200, 200, 200);
      pdf.setFillColor(248, 248, 248);
      pdf.roundedRect(xPos, yPos, colWidth, 14, 2, 2, 'FD');
      pdf.setTextColor(80, 80, 80);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text((stat.label || '').substring(0, 28), xPos + 3, yPos + 4);
      pdf.setTextColor(30, 30, 30);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      const trendSym = stat.trend === 'up' ? '↗' : stat.trend === 'down' ? '↘' : '→';
      pdf.text(`${stat.val}${trendSym}`, xPos + colWidth - 6, yPos + 10, { align: 'right' });
    });

    y += Math.ceil(estadisticas.length / 2) * 16 + 6;
  }

  // ═══════════════════ RIESGOS (dos columnas) ═══════════════════
  if (riesgos.length > 0) {
    ensureSpace(10);
    pdf.setFontSize(12);
    pdf.setTextColor(30, 30, 30);
    pdf.setFont('helvetica', 'bold');
    pdf.text('RIESGOS IDENTIFICADOS', pageWidth / 2, y, { align: 'center' });
    y += 7;

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

      pdf.setDrawColor(200, 180, 180);
      pdf.setFillColor(255, 245, 245);
      pdf.roundedRect(xPos, yPos, colWidth, 14, 2, 2, 'FD');
      pdf.setTextColor(180, 60, 60);
      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'bold');
      pdf.text((riesgo.cat || 'RIESGO').substring(0, 20), xPos + 3, yPos + 4);
      pdf.setTextColor(100, 40, 40);
      pdf.setFontSize(6);
      pdf.setFont('helvetica', 'normal');
      pdf.text((riesgo.title || '').substring(0, 50), xPos + 3, yPos + 9);

      const impColors = ['#10b981', '#f59e0b', '#ef4444'];
      const impColor = impColors[riesgo.imp - 1] || '#f59e0b';
      const [ri, gi, bi] = hexToRgb(impColor);
      pdf.setTextColor(ri, gi, bi);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`P${riesgo.imp}`, xPos + colWidth - 6, yPos + 10, { align: 'right' });
    });

    y += Math.ceil(riesgos.length / 2) * 16 + 6;
  }

  // ═══════════════════ ALERTA ═══════════════════
  if (data.alerta) {
    ensureSpace(10);
    pdf.setFontSize(9);
    pdf.setTextColor(180, 80, 0);
    pdf.setFont('helvetica', 'bold');
    pdf.text('ALERTA', marginX, y);
    y += 5;
    pdf.setFontSize(8);
    pdf.setTextColor(120, 60, 0);
    pdf.setFont('helvetica', 'normal');
    const alertLines = pdf.splitTextToSize(data.alerta, usableWidth);
    pdf.text(alertLines, marginX, y);
    y += alertLines.length * 4 + 6;
  }

  // ═══════════════════ OBSERVACIONES ═══════════════════
  if (data.observaciones) {
    ensureSpace(10);
    pdf.setFontSize(9);
    pdf.setTextColor(30, 30, 30);
    pdf.setFont('helvetica', 'bold');
    pdf.text('OBSERVACIONES', marginX, y);
    y += 5;
    pdf.setFontSize(8);
    pdf.setTextColor(80, 80, 80);
    pdf.setFont('helvetica', 'normal');
    const obsLines = pdf.splitTextToSize(data.observaciones, usableWidth);
    pdf.text(obsLines, marginX, y);
    y += obsLines.length * 4 + 6;
  }

  // ═══════════════════ FINAL: Números de página correctos ═══════════════════
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text(`Página ${i} de ${totalPages}`, pageWidth - marginX, footerY, { align: 'right' });
    pdf.text('Gobierno Autónomo Municipal de El Alto', marginX, footerY);
  }

  const blob = pdf.output('blob');
  return URL.createObjectURL(blob);
}
