import clsx from 'clsx';

const LoadingSpinner = ({ size = 'md', className }) => {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
  };

  return (
    <div className="flex justify-center items-center py-6 w-full">
      <div
        className={clsx(
          "animate-spin rounded-full border-t-transparent border-fintech-green",
          sizes[size] || sizes.md,
          className
        )}
      />
    </div>
  );
};

export default LoadingSpinner;
