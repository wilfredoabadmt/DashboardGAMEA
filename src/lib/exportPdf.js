import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Export the current page (or a specific element) to a PDF.
 * The PDF is styled for A4 size, with responsive scaling so that the content
 * remains crisp both on screen and on printed paper.
 *
 * @param {HTMLElement} element - The DOM element to capture. If omitted, the whole
 *   document.body will be used.
 * @param {string} filename - Desired filename (without extension).
 */
export async function exportPdf(element = document.body, filename = 'document') {
  // Ensure the element is fully rendered
  await new Promise(r => requestAnimationFrame(r));

  // Capture the element as a canvas. Use a higher scale for better print quality.
  const canvas = await html2canvas(element, {
    scale: 2, // 2x for high‑resolution PDF
    useCORS: true,
    logging: false,
  });

  // Convert canvas to image data
  const imgData = canvas.toDataURL('image/png');

  // Create PDF with A4 dimensions (210 × 297 mm) – jsPDF works in pt by default.
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Compute image dimensions while preserving aspect ratio.
  const imgProps = pdf.getImageProperties(imgData);
  const imgRatio = imgProps.width / imgProps.height;
  const pdfRatio = pageWidth / pageHeight;

  let imgWidth, imgHeight;
  if (imgRatio > pdfRatio) {
    // Image is wider relative to A4 – fit width.
    imgWidth = pageWidth;
    imgHeight = pageWidth / imgRatio;
  } else {
    // Image is taller – fit height.
    imgHeight = pageHeight;
    imgWidth = pageHeight * imgRatio;
  }

  // Center the image on the page.
  const x = (pageWidth - imgWidth) / 2;
  const y = (pageHeight - imgHeight) / 2;

  pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
  pdf.save(`${filename}.pdf`);
}
