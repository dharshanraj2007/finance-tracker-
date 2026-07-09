import clsx from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage = 1, totalItems = 0, itemsPerPage = 10, onPageChange }) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  // Generate range of page numbers
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  const startRange = (currentPage - 1) * itemsPerPage + 1;
  const endRange = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-fintech-border bg-fintech-darker/30">
      <div className="text-sm text-fintech-textMuted">
        Showing <span className="font-medium text-fintech-text">{totalItems > 0 ? startRange : 0}</span> to{' '}
        <span className="font-medium text-fintech-text">{endRange}</span> of{' '}
        <span className="font-medium text-fintech-text">{totalItems}</span> entries
      </div>
      
      {totalPages > 1 && (
        <div className="flex items-center space-x-1">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="p-2 rounded-lg bg-fintech-dark border border-fintech-border text-fintech-textMuted hover:text-fintech-text disabled:opacity-30 disabled:cursor-not-allowed hover:bg-fintech-card transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          {pageNumbers.map((num) => (
            <button
              key={num}
              onClick={() => onPageChange(num)}
              className={clsx(
                "px-3 py-1.5 rounded-lg border text-sm font-medium transition-all",
                currentPage === num
                  ? "bg-fintech-green border-fintech-green text-white shadow-lg shadow-fintech-green/10"
                  : "bg-fintech-dark border-fintech-border text-fintech-textMuted hover:text-fintech-text hover:bg-fintech-card"
              )}
            >
              {num}
            </button>
          ))}
          
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg bg-fintech-dark border border-fintech-border text-fintech-textMuted hover:text-fintech-text disabled:opacity-30 disabled:cursor-not-allowed hover:bg-fintech-card transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Pagination;
