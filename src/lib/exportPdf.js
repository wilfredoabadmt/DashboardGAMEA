import html2canvas from 'html2canvas';
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
 * Generate a PDF report that preserves the visual charts (gauges, stat cards, risk badges)
 * by capturing the content area with html2canvas, then embedding the image in a PDF.
 *
 * @param {Object}        data      - Report metadata
 * @param {Array}         indicadores
 * @param {Array}         estadisticas
 * @param {Array}         riesgos
 * @param {HTMLElement}   contentEl - DOM element to capture (the report content area)
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

  // ── Capture the content area as an image with two‑column layout ──
  const clone = contentEl.cloneNode(true);
  clone.style.width = `${contentEl.clientWidth}px`;
  clone.style.columnCount = '2';
  clone.style.columnGap = '24px';
  clone.style.position = 'absolute';
  clone.style.left = '0';
  clone.style.top = '0';
  clone.style.zIndex = '-1';
  clone.style.pointerEvents = 'none';
  clone.style.background = 'white';
  document.body.appendChild(clone);

  await new Promise(r => requestAnimationFrame(r));

  let canvas;
  try {
    canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      logging: false,
      allowTaint: true,
      foreignObjectRendering: true,
      backgroundColor: '#ffffff',
    });
  } catch (err) {
    console.error('ExportPDF: html2canvas failed', err);
    document.body.removeChild(clone);
    return;
  }
  document.body.removeChild(clone);

  const imgData = canvas.toDataURL('image/png');

  // ── Build the PDF ──
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const marginX = 10;
  const marginY = 15;
  const usableWidth = pageWidth - 2 * marginX;
  const usableHeight = pageHeight - 2 * marginY;
  const footerY = pageHeight - 8;

  // ── Page decoration ──
  let totalPages = 1;

  const addDecorations = (currentPage) => {
    // Logo GAMEA (esquina superior izquierda)
    if (gameaLogo) {
      const ip = pdf.getImageProperties(gameaLogo);
      const h = 12;
      const w = h * (ip.width / ip.height);
      pdf.addImage(gameaLogo, 'PNG', marginX, 5, w, h);
    }
    // Logo ELISER (esquina superior derecha)
    if (eliserLogo) {
      const ip = pdf.getImageProperties(eliserLogo);
      const h = 8;
      const w = h * (ip.width / ip.height);
      pdf.addImage(eliserLogo, 'PNG', pageWidth - marginX - w, 5, w, h);
    }
    // Header text
    pdf.setFontSize(14);
    pdf.setTextColor(40, 40, 40);
    pdf.text('REPORTE ESTRATÉGICO DE TRANSICIÓN', pageWidth / 2, marginY, { align: 'center' });
    // Footer text
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text('Gobierno Autónomo Municipal de El Alto', marginX, footerY);
    pdf.text(`Página ${currentPage} de ${totalPages}`, pageWidth - marginX, footerY, { align: 'right' });
  };

  // ── Image sizing ──
  const imgProps = pdf.getImageProperties(imgData);
  const imgRatio = imgProps.width / imgProps.height;
  const areaRatio = usableWidth / usableHeight;
  let imgWidth, imgHeight;
  if (imgRatio > areaRatio) {
    imgWidth = usableWidth;
    imgHeight = usableWidth / imgRatio;
  } else {
    imgHeight = usableHeight;
    imgWidth = usableHeight * imgRatio;
  }

  const x = marginX + (usableWidth - imgWidth) / 2;
  let y = marginY + 10;

  // First page
  addDecorations(1);
  pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);

  // Additional pages if the image exceeds the usable area
  let remainingHeight = imgHeight - (usableHeight - 10);
  while (remainingHeight > 0) {
    pdf.addPage();
    totalPages++;
    const pageIndex = pdf.getNumberOfPages();
    const offsetY = -usableHeight * (pageIndex - 1) + marginY + 10;
    addDecorations(pageIndex);
    pdf.addImage(imgData, 'PNG', x, offsetY, imgWidth, imgHeight);
    remainingHeight -= usableHeight;
  }

  // ── Final footers with correct page count ──
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
