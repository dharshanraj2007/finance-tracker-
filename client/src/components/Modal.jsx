import { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  // Listen for Escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity animate-fade-in">
      <div 
        className="absolute inset-0" 
        onClick={onClose}
      />
      <div className="bg-fintech-card border border-fintech-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative z-10 transform scale-100 transition-all duration-300 animate-slide-up">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-fintech-border flex justify-between items-center bg-fintech-darker/30">
          <h3 className="text-lg font-bold text-fintech-text tracking-wide">{title}</h3>
          <button 
            onClick={onClose} 
            className="p-1 rounded-lg text-fintech-textMuted hover:text-fintech-text hover:bg-fintech-dark transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* Modal Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
