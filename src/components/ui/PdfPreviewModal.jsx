import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Printer, Download } from 'lucide-react';

const PdfPreviewModal = ({ pdfUrl, onClose }) => (
  <AnimatePresence>
    {pdfUrl && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-[95vw] h-[90vh] max-w-[1000px] bg-slate-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <h3 className="text-lg font-black text-white font-display tracking-tight">
              Vista previa del PDF
            </h3>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  const a = document.createElement('a');
                  a.href = pdfUrl;
                  a.download = 'Reporte.pdf';
                  a.click();
                }}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all"
              >
                <Download size={16} /> Descargar
              </button>
              <button
                onClick={() => window.open(pdfUrl, '_blank')}
                className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all"
              >
                <Printer size={16} /> Imprimir
              </button>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Iframe PDF - el navegador muestra la barra de herramientas de PDF con su propio botón de imprimir */}
          <iframe
            src={pdfUrl}
            className="w-full h-[calc(100%-65px)] bg-white"
            title="Vista previa PDF"
          />
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default PdfPreviewModal;
