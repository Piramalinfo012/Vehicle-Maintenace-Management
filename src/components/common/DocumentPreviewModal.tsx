import React from 'react';
import { Modal } from './Modal';
import { Download, ExternalLink, FileText } from 'lucide-react';

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
  documentUrl?: string;
  fileType?: string;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  isOpen,
  onClose,
  documentTitle,
  documentUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  fileType = 'pdf',
}) => {
  const isImage = fileType === 'jpg' || fileType === 'png' || documentUrl.match(/\.(jpg|jpeg|png|webp|gif)$/i);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Document Preview: ${documentTitle}`}
      maxWidth="4xl"
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            Close
          </button>
          <a
            href={documentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-sm font-medium text-white bg-[#1E3A8A] hover:bg-blue-800 rounded-lg inline-flex items-center gap-2 shadow-sm"
          >
            <Download className="w-4 h-4" /> Download Document
          </a>
        </>
      }
    >
      <div className="bg-slate-100 dark:bg-slate-950 rounded-xl p-4 min-h-[400px] flex items-center justify-center border border-slate-200 dark:border-slate-800">
        {isImage ? (
          <img src={documentUrl} alt={documentTitle} className="max-h-[500px] object-contain rounded-lg shadow-md" />
        ) : (
          <div className="w-full flex flex-col items-center justify-center p-8 text-center">
            <FileText className="w-16 h-16 text-[#1E3A8A] dark:text-blue-400 mb-4 animate-bounce" />
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">{documentTitle}</h4>
            <p className="text-xs text-slate-500 mt-1 mb-4">Official Transport Compliance Record File (.PDF)</p>
            <iframe
              src={documentUrl}
              title={documentTitle}
              className="w-full h-[450px] rounded-lg border border-slate-300 dark:border-slate-700 bg-white"
            />
          </div>
        )}
      </div>
    </Modal>
  );
};
