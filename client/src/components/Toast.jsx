import { useEffect } from 'react';
import { CheckCircle, AlertTriangle, X } from 'lucide-react';
import clsx from 'clsx';

const Toast = ({ message, type = 'success', onClose }) => {
  // Auto close trigger helper
  useEffect(() => {
    return () => {};
  }, []);

  return (
    <div
      className={clsx(
        "flex items-center space-x-3 p-4 rounded-xl border shadow-2xl backdrop-blur-md transition-all duration-300 transform translate-y-0 opacity-100 animate-slide-in pointer-events-auto max-w-sm w-80",
        type === 'success'
          ? "bg-fintech-card/90 border-fintech-green/30 text-fintech-text"
          : "bg-fintech-card/90 border-fintech-red/30 text-fintech-text"
      )}
    >
      <div className="shrink-0">
        {type === 'success' ? (
          <CheckCircle className="w-5 h-5 text-fintech-green" />
        ) : (
          <AlertTriangle className="w-5 h-5 text-fintech-red" />
        )}
      </div>
      <div className="flex-1 text-sm font-medium">{message}</div>
      <button
        onClick={onClose}
        className="shrink-0 p-1 text-fintech-textMuted hover:text-fintech-text rounded-md hover:bg-fintech-dark transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
