import clsx from 'clsx';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const Card = ({ children, className, ...props }) => {
  return (
    <div 
      className={clsx(
        "bg-fintech-card rounded-2xl border border-fintech-border shadow-lg p-6 transition-all duration-200 hover:border-fintech-border/80",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// Stat Card Sub-component
Card.Stat = ({ title, amount = 0, icon: Icon, trend, trendUp, colorClass, currency = 'USD' }) => {
  const isPositive = trendUp;
  return (
    <Card className="flex flex-col relative overflow-hidden group">
      {/* Background soft glow indicator */}
      <div className={clsx(
        "absolute -right-10 -top-10 w-24 h-24 rounded-full blur-2xl opacity-10 transition-opacity group-hover:opacity-20",
        colorClass || 'bg-fintech-green'
      )} />
      
      <div className="flex justify-between items-start mb-4">
        <div className={clsx("p-3 rounded-xl", colorClass || 'bg-fintech-green/10')}>
          {Icon && <Icon className="w-6 h-6 text-white" />}
        </div>
        {trend && (
          <div className={clsx(
            "flex items-center space-x-0.5 text-xs font-semibold px-2 py-1 rounded-full",
            isPositive ? "text-fintech-green bg-fintech-green/10" : "text-fintech-red bg-fintech-red/10"
          )}>
            <span>{trend}</span>
            {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
          </div>
        )}
      </div>
      
      <h3 className="text-fintech-textMuted text-xs font-medium tracking-wider uppercase mb-1">{title}</h3>
      <h2 className="text-2xl font-bold text-fintech-text tracking-tight">
        {formatCurrency(amount, currency)}
      </h2>
    </Card>
  );
};

export default Card;
