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
// Clone the element and apply two‑column layout for PDF capture.
// This clone is used only for PDF rendering and does not affect the visible page.
const clone = element.cloneNode(true);
// Preserve the original width so the column layout matches the on‑screen size.
clone.style.width = `${element.clientWidth}px`;
// Preserve full height to capture all scrollable content.
clone.style.height = `${element.scrollHeight}px`;
// Apply CSS columns – two columns with a comfortable gap for readability.
clone.style.columnCount = '2';
clone.style.columnGap = '24px'; // slightly larger gap for a more spacious look
// Hide the clone off‑screen.
clone.style.position = 'absolute';
clone.style.left = '-9999px';
clone.style.top = '0';
  // Elimina reglas CSS que usen la función oklch y las reemplaza por valores RGB.
  const replaceOklch = css =>
    css.replace(/oklch\([^)]*\)/g, match => {
      const dummy = document.createElement('div');
      dummy.style.color = match;
      document.body.appendChild(dummy);
      const rgb = getComputedStyle(dummy).color;
      document.body.removeChild(dummy);
      return rgb;
    });

  // 1️⃣ Procesar los <style> internos del clon
  clone.querySelectorAll('style').forEach(st => {
    if (st.textContent.includes('oklch(')) {
      st.textContent = replaceOklch(st.textContent);
    }
  });

  // 2️⃣ Procesar atributos inline que contengan oklch
  clone.querySelectorAll('[style]').forEach(el => {
    const s = el.getAttribute('style');
    if (s && s.includes('oklch(')) {
      el.setAttribute('style', replaceOklch(s));
    }
  });


// Wait for the browser to render the clone before capturing.
await new Promise(r => requestAnimationFrame(r));

// Load background and logo images (from the dist folder). If they fail, continue without them.
let backgroundData = null;
let logoData = null;
try {
  [backgroundData, logoData] = await Promise.all([
    loadImageAsBase64('/dist/gamea.png'),
    loadImageAsBase64('/dist/eliser.png'),
  ]);
} catch (e) {
  console.warn('PDF export: could not load background/logo images – proceeding without decorations.', e);
}

// Capture the **clone** (with two‑column layout) as a high‑resolution canvas.
const canvas = await html2canvas(clone, {
  scale: 2,
  useCORS: true,
  logging: false,
  allowTaint: true,
});

// Clean up the temporary clone now that we have the canvas.
document.body.removeChild(clone);

const imgData = canvas.toDataURL('image/png');

// Initialize PDF in portrait A4.
const pdf = new jsPDF('p', 'mm', 'a4');
const pageWidth = pdf.internal.pageSize.getWidth();
const pageHeight = pdf.internal.pageSize.getHeight();
// Define margins for a cleaner, more professional layout.
const marginX = 10; // left/right margin (mm)
const marginY = 15; // top margin for header (mm)
// Available drawing area after margins.
const usableWidth = pageWidth - 2 * marginX;
const usableHeight = pageHeight - 2 * marginY;

// Compute the size of the captured image while preserving aspect ratio, fitting it inside the usable area.
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

// Horizontal centering.
const x = marginX + (usableWidth - imgWidth) / 2;
// Initial vertical position (below header area).
let y = marginY + 10; // additional gap after header

// Helper to add background, logo, header and footer to each page.
function addPageDecorations(currentPage, totalPages) {
  if (backgroundData) {
    pdf.addImage(backgroundData, 'PNG', 0, 0, pageWidth, pageHeight);
  }
  if (logoData) {
    const logoWidth = 30; // mm
    const logoHeight = logoWidth * 0.33; // approximate aspect ratio
    pdf.addImage(logoData, 'PNG', pageWidth - logoWidth - 5, 5, logoWidth, logoHeight);
  }
  // Header – display filename (or a generic title) centered.
  pdf.setFontSize(14);
  pdf.setTextColor(40, 40, 40);
  pdf.text(filename, pageWidth / 2, marginY, { align: 'center' });
  // Footer – page number.
  pdf.setFontSize(10);
  pdf.text(`Página ${currentPage} de ${totalPages}`, pageWidth - marginX, pageHeight - 5, { align: 'right' });
}

// First page.
let totalPages = 1; // we will update this as we add pages
addPageDecorations(1, totalPages);
pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);

// Determine if the image exceeds the usable height; if so, create additional pages.
let remainingHeight = imgHeight - (usableHeight - 10); // subtract the space already used for the first slice
while (remainingHeight > 0) {
  pdf.addPage();
  totalPages++;
  // Re‑calculate the vertical offset for the next slice of the image.
  const pageIndex = pdf.getNumberOfPages(); // current page number
  // y offset such that each page shows the next portion of the tall image.
  const offsetY = -usableHeight * (pageIndex - 1) + marginY + 10;
  addPageDecorations(pageIndex, totalPages);
  pdf.addImage(imgData, 'PNG', x, offsetY, imgWidth, imgHeight);
  remainingHeight -= usableHeight;
}

// After all pages are added, update footers with the final page count.
for (let i = 1; i <= totalPages; i++) {
  pdf.setPage(i);
  // Redraw footer with correct total page count (already drawn, but ensures consistency).
  pdf.setFontSize(10);
  pdf.text(`Página ${i} de ${totalPages}`, pageWidth - marginX, pageHeight - 5, { align: 'right' });
}

pdf.save(`${filename}.pdf`);
}



