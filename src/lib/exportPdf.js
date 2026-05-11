import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Load an image from a URL and return a base64 data URL.
 * @param {string} url - Image URL
 * @returns {Promise<string>} Base64 data URL
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
 * Export the current page (or a specific element) to a PDF.
 * The PDF is styled for A4 size, preserving high resolution, handling multi‑page
 * content, adding a background image and the mayor's logo on each page.
 *
 * @param {HTMLElement} element - The DOM element to capture. Defaults to document.body.
 * @param {string} filename - Desired filename without extension.
 */
export async function exportPdf(element = document.body, filename = 'document') {
  // Ensure the element is fully rendered before capture.
  await new Promise(r => requestAnimationFrame(r));

  // Load background and logo images (from the dist folder).
  const [backgroundData, logoData] = await Promise.all([
    loadImageAsBase64('/dist/gamea.png'),
    loadImageAsBase64('/dist/eliser.png'),
  ]);

  // Capture the element as a high‑resolution canvas.
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    allowTaint: true,
  });

  const imgData = canvas.toDataURL('image/png');

  // Initialize PDF in portrait A4.
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Compute the size of the captured image while preserving aspect ratio.
  const imgProps = pdf.getImageProperties(imgData);
  const imgRatio = imgProps.width / imgProps.height;
  const pdfRatio = pageWidth / pageHeight;

  let imgWidth, imgHeight;
  if (imgRatio > pdfRatio) {
    imgWidth = pageWidth;
    imgHeight = pageWidth / imgRatio;
  } else {
    imgHeight = pageHeight;
    imgWidth = pageHeight * imgRatio;
  }

  // Position the image centered on the page.
  const x = (pageWidth - imgWidth) / 2;
  let y = (pageHeight - imgHeight) / 2;

  // Helper to add background and logo to the current page.
  function addPageDecorations() {
    // Background covering full page.
    pdf.addImage(backgroundData, 'PNG', 0, 0, pageWidth, pageHeight);
    // Mayor's logo positioned at top‑right corner.
    const logoWidth = 30; // mm
    const logoHeight = (logoWidth * 0.33); // approximate aspect ratio
    pdf.addImage(logoData, 'PNG', pageWidth - logoWidth - 5, 5, logoWidth, logoHeight);
  }

  // First page.
  addPageDecorations();
  pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);

  // If the captured image is taller than a page, create additional pages.
  let remainingHeight = imgHeight - pageHeight;
  // page index starts at 1 (first page already added).
  while (remainingHeight > 0) {
    pdf.addPage();
    addPageDecorations();
    // Compute vertical offset so that the next slice appears.
    const pageIndex = pdf.getNumberOfPages(); // 2 for first added page, etc.
    y = -pageHeight * (pageIndex - 1);
    pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
    remainingHeight -= pageHeight;
  }

  pdf.save(`${filename}.pdf`);
}
