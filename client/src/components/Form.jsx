import clsx from 'clsx';

const Form = ({ children, onSubmit, ...props }) => {
  return (
    <form onSubmit={onSubmit} {...props} className="space-y-4">
      {children}
    </form>
  );
};

// Form Label Sub-component
Form.Label = ({ children, htmlFor, className }) => {
  return (
    <label 
      htmlFor={htmlFor} 
      className={clsx("block text-xs font-semibold uppercase tracking-wider text-fintech-textMuted mb-2", className)}
    >
      {children}
    </label>
  );
};

// Form Input Sub-component
Form.Input = ({ id, name, type = 'text', value, onChange, placeholder, required = false, icon: Icon, className, ...props }) => {
  return (
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-4.5 w-4.5 text-fintech-textMuted" />
        </div>
      )}
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={clsx(
          "w-full px-4 py-2.5 bg-fintech-dark border border-fintech-border rounded-xl text-sm focus:outline-none focus:border-fintech-green focus:ring-1 focus:ring-fintech-green text-fintech-text transition-all placeholder-fintech-textMuted/60",
          Icon ? "pl-10" : "",
          className
        )}
        {...props}
      />
    </div>
  );
};

// Form Select Sub-component
Form.Select = ({ id, name, value, onChange, children, required = false, className, ...props }) => {
  return (
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className={clsx(
        "w-full px-4 py-2.5 bg-fintech-dark border border-fintech-border rounded-xl text-sm focus:outline-none focus:border-fintech-green focus:ring-1 focus:ring-fintech-green text-fintech-text transition-all",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
};

// Form Textarea Sub-component
Form.Textarea = ({ id, name, value, onChange, placeholder, rows = 3, required = false, className, ...props }) => {
  return (
    <textarea
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      required={required}
      className={clsx(
        "w-full px-4 py-2.5 bg-fintech-dark border border-fintech-border rounded-xl text-sm focus:outline-none focus:border-fintech-green focus:ring-1 focus:ring-fintech-green text-fintech-text transition-all placeholder-fintech-textMuted/60",
        className
      )}
      {...props}
    />
  );
};

// Form Group Wrapper
Form.Group = ({ children, className }) => {
  return (
    <div className={clsx("flex flex-col space-y-1.5", className)}>
      {children}
    </div>
  );
};

export default Form;
