import { Search as SearchIcon, X } from 'lucide-react';

const Search = ({ value, onChange, placeholder = "Search..." }) => {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <SearchIcon className="h-5 w-5 text-fintech-textMuted" />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-10 py-2.5 bg-fintech-dark border border-fintech-border rounded-xl focus:outline-none focus:border-fintech-green focus:ring-1 focus:ring-fintech-green text-fintech-text transition-colors placeholder-fintech-textMuted text-sm"
      />
      {value && (
        <button
          onClick={() => onChange({ target: { value: '' } })}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-fintech-textMuted hover:text-fintech-text transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Search;
