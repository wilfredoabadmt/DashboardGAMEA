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

export async function generateReportPdf(data, indicadores, estadisticas, riesgos, contentEl) {
  let gameaLogo = null, eliserLogo = null;
  try {
    [gameaLogo, eliserLogo] = await Promise.all([
      loadImageAsBase64('/dist/gamea.png'),
      loadImageAsBase64('/dist/eliser.png'),
    ]);
  } catch (e) {}

  const pdf = new jsPDF('p', 'mm', 'letter');
  const PW = pdf.internal.pageSize.getWidth();
  const PH = pdf.internal.pageSize.getHeight();
  const M = 20;
  const UW = PW - 2 * M;
  const FY = PH - 12;
  let page = 1;
  let y = 34;

  const hexRgb = h => {
    const c = h.replace('#','');
    return [parseInt(c.slice(0,2),16), parseInt(c.slice(2,4),16), parseInt(c.slice(4,6),16)];
  };

  // ── Page setup ──
  const header = () => {
    pdf.setDrawColor(14, 165, 233); pdf.setLineWidth(0.5); pdf.line(M, 12, PW-M, 12);
    if (gameaLogo) { const ip = pdf.getImageProperties(gameaLogo); const h=13; const w=h*ip.width/ip.height; pdf.addImage(gameaLogo, 'PNG', M, 15, w, h); }
    if (eliserLogo) { const ip = pdf.getImageProperties(eliserLogo); const h=9; const w=h*ip.width/ip.height; pdf.addImage(eliserLogo, 'PNG', PW-M-w, 16, w, h); }
    pdf.setFontSize(15); pdf.setTextColor(14, 37, 64); pdf.setFont('helvetica', 'bold'); pdf.text('REPORTE ESTRATÉGICO', PW/2, 20, {align:'center'});
    pdf.setFontSize(7); pdf.setTextColor(71,85,105); pdf.setFont('helvetica', 'normal'); pdf.text('GOBIERNO AUTÓNOMO MUNICIPAL DE EL ALTO · TRANSICIÓN MUNICIPAL', PW/2, 25, {align:'center'});
    pdf.setDrawColor(200,205,215); pdf.setLineWidth(0.3); pdf.line(M, 29, PW-M, 29);
  };
  const footer = () => {
    pdf.setDrawColor(200,205,215); pdf.setLineWidth(0.3); pdf.line(M, PH-11, PW-M, PH-11);
    pdf.setFontSize(7); pdf.setTextColor(150,150,170); pdf.setFont('helvetica','normal');
    pdf.text('Gobierno Autónomo Municipal de El Alto · Sistema de Control de Transición', M, FY);
    pdf.text(`Página ${page}`, PW-M, FY, {align:'right'});
  };
  const newPage = () => { pdf.addPage(); page++; y=34; header(); footer(); };
  const check = (n=12) => { if (y+n > PH-M-10) newPage(); };

  header(); footer();

  // ── TITLE ──
  y += 2;
  pdf.setFontSize(20); pdf.setTextColor(14,37,64); pdf.setFont('helvetica','bold');
  const tl = pdf.splitTextToSize(data.titulo||'REPORTE ESTRATÉGICO DE TRANSICIÓN', UW);
  pdf.text(tl, PW/2, y, {align:'center'}); y += tl.length*7 + 3;
  if (data.subtitulo) {
    pdf.setFontSize(9); pdf.setTextColor(71,85,105); pdf.setFont('helvetica','normal');
    const sl = pdf.splitTextToSize(data.subtitulo, UW);
    pdf.text(sl, PW/2, y, {align:'center'}); y += sl.length*4 + 4;
  }
  // Info card
  const chips = [data.secretaria, data.direccion, data.unidad].filter(Boolean);
  check(20);
  pdf.setFillColor(241,245,249); pdf.roundedRect(M, y, UW, chips.length?16:12, 3,3, 'F');
  if (chips.length) {
    pdf.setFontSize(8); pdf.setTextColor(71,85,105); pdf.setFont('helvetica','bold');
    pdf.text(chips.join('  ·  '), PW/2, y+6, {align:'center'}); y+=10;
  }
  if (data.fecha) { pdf.setFontSize(7); pdf.setTextColor(150,150,170); pdf.text(`Fecha: ${data.fecha}`, PW/2, y+3, {align:'center'}); y+=5; }
  if (data.acreditado) { pdf.setFontSize(7); pdf.setTextColor(150,150,170); pdf.text(`Responsable: ${data.acreditado}`, PW/2, y+3, {align:'center'}); y+=3; }
  y += 6;

  // ── SECTION TITLE ──
  const sec = (text) => {
    check(14);
    pdf.setDrawColor(14,165,233); pdf.setFillColor(14,165,233); pdf.rect(M, y, 3, 9, 'F');
    pdf.setFontSize(11); pdf.setTextColor(14,37,64); pdf.setFont('helvetica','bold');
    pdf.text(text, M+7, y+7); y += 12;
  };

  // ── INDICADORES ──
  if (indicadores.length) {
    sec('MÉTRICAS CRÍTICAS');
    indicadores.forEach(ind => {
      check(16);
      const [cr,cg,cb] = hexRgb(ind.color||'#0ea5e9');
      // bar track
      pdf.setFillColor(238,242,246); pdf.roundedRect(M, y, UW, 8, 2, 2, 'F');
      // bar fill
      const fw = (ind.value/100)*(UW-2);
      if (fw>0) { pdf.setFillColor(cr,cg,cb); pdf.roundedRect(M+1, y+1, fw, 6, 1.5,1.5, 'F'); }
      // label
      pdf.setTextColor(55,65,81); pdf.setFontSize(7); pdf.setFont('helvetica','bold');
      pdf.text(ind.label.substring(0, 40), M+3, y+12);
      // value
      pdf.setTextColor(14,37,64); pdf.setFontSize(10); pdf.setFont('helvetica','bold');
      pdf.text(`${ind.value}%`, PW-M-3, y+12, {align:'right'});
      y += 16;
    });
    y += 4;
  }

  // ── ESTADÍSTICAS ──
  if (estadisticas.length) {
    sec('ESTADÍSTICAS');
    estadisticas.forEach(st => {
      check(16);
      const tcol = st.trend==='up' ? '#10b981' : st.trend==='down' ? '#ef4444' : '#f59e0b';
      pdf.setFillColor(249,250,251); pdf.setDrawColor(229,231,235); pdf.roundedRect(M, y, UW, 13, 3,3, 'FD');
      pdf.setTextColor(75,85,99); pdf.setFontSize(8); pdf.setFont('helvetica','bold');
      pdf.text(st.label.substring(0, 40), M+4, y+5);
      pdf.setTextColor(...hexRgb(tcol)); pdf.setFontSize(14); pdf.setFont('helvetica','bold');
      const sym = st.trend==='up' ? '↗' : st.trend==='down' ? '↘' : '→';
      pdf.text(`${st.val} ${sym}`, PW-M-4, y+11, {align:'right'});
      y += 16;
    });
    y += 4;
  }

  // ── RIESGOS ──
  if (riesgos.length) {
    sec('RIESGOS IDENTIFICADOS');
    riesgos.forEach(r => {
      check(14);
      const ic = {1:'#10b981',2:'#f59e0b',3:'#ef4444'};
      const ci = ic[r.imp]||'#f59e0b';
      pdf.setFillColor(...hexRgb(ci)); pdf.roundedRect(M, y, 3, 10, 1,1, 'F');
      pdf.setFillColor(255,255,255); pdf.setDrawColor(243,244,246); pdf.roundedRect(M+3, y, UW-3, 10, 3,3, 'FD');
      pdf.setTextColor(107,114,128); pdf.setFontSize(6); pdf.setFont('helvetica','bold');
      pdf.text((r.cat||'RX').substring(0,8), M+8, y+4);
      pdf.setTextColor(75,85,99); pdf.setFontSize(7); pdf.setFont('helvetica','normal');
      pdf.text(r.title.substring(0, 55), M+8, y+9);
      pdf.setTextColor(...hexRgb(ci)); pdf.setFontSize(9); pdf.setFont('helvetica','bold');
      pdf.text(`P${r.imp}`, PW-M-5, y+8, {align:'right'});
      y += 14;
    });
    y += 4;
  }

  // ── ALERTA ──
  if (data.alerta) {
    check(8);
    pdf.setFillColor(255,247,237); pdf.setDrawColor(251,191,36); pdf.roundedRect(M, y, UW, 5, 3,3, 'F'); y+=3;
    pdf.setTextColor(146,64,14); pdf.setFontSize(8); pdf.setFont('helvetica','bold'); pdf.text('⚠ ALERTA', M+4, y+1); y+=6;
    pdf.setFontSize(7); pdf.setTextColor(120,53,15); pdf.setFont('helvetica','normal');
    const al = pdf.splitTextToSize(data.alerta, UW-16); pdf.text(al, M+8, y); y += al.length*3.5+6;
  }

  // ── OBSERVACIONES ──
  if (data.observaciones) {
    sec('OBSERVACIONES');
    pdf.setFontSize(7); pdf.setTextColor(55,65,81); pdf.setFont('helvetica','normal');
    const ol = pdf.splitTextToSize(data.observaciones, UW); pdf.text(ol, M, y); y += ol.length*3.5+4;
  }

  // ── FINAL FOOTERS ──
  const tp = pdf.getNumberOfPages();
  for (let i=1; i<=tp; i++) {
    pdf.setPage(i);
    pdf.setDrawColor(200,205,215); pdf.setLineWidth(0.3); pdf.line(M, PH-11, PW-M, PH-11);
    pdf.setFontSize(7); pdf.setTextColor(150,150,170); pdf.setFont('helvetica','normal');
    pdf.text('Gobierno Autónomo Municipal de El Alto · Sistema de Control de Transición', M, FY);
    pdf.text(`Página ${i} de ${tp}`, PW-M, FY, {align:'right'});
  }

  return URL.createObjectURL(pdf.output('blob'));
}
