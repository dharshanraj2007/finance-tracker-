import { useState, useEffect } from 'react';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  PiggyBank, 
  ArrowUpRight, 
  ArrowDownRight,
  TrendingUp as TrendingUpIcon,
  Activity,
  Calendar,
  DollarSign
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import * as apiService from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';

const COLORS = ['#28C76F', '#EA5455', '#FF9F43', '#00CFE8', '#7367F0', '#FFC085', '#8E94A4'];

const dummyMonthlySavings = [
  { name: 'Jan', savings: 1600 },
  { name: 'Feb', savings: 1602 },
  { name: 'Mar', savings: -7800 },
  { name: 'Apr', savings: -1128 },
  { name: 'May', savings: -2910 },
  { name: 'Jun', savings: -1410 },
  { name: 'Jul', savings: -810 },
];

const Dashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const currency = user?.settings?.currency || 'USD';

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await apiService.getAnalytics();
        setAnalytics(data);
      } catch (error) {
        console.error('Failed to fetch analytics', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalytics();
  }, []);

  if (loading) {
    return <LoadingSpinner size="lg" className="mt-20" />;
  }

  const totalIncome = analytics?.totalIncome || 0;
  const totalExpense = analytics?.totalExpense || 0;
  const totalBalance = analytics?.totalBalance || 0;
  const savings = totalIncome - totalExpense;

  // Percentage calculations
  const savingsRate = totalIncome > 0 ? (savings / totalIncome) * 100 : 0;

  // Monthly data preparation
  const monthlyData = analytics?.monthlyData || [];
  const lineChartData = monthlyData.some(m => m.income > 0 || m.expense > 0)
    ? monthlyData.map(m => ({ name: m.month, savings: m.income - m.expense }))
    : dummyMonthlySavings;

  const categoryData = analytics?.expenseCategories?.length > 0 
    ? analytics.expenseCategories 
    : [{ name: 'No Expenses', value: 0 }];

  // Recent transactions list
  const recentTransactions = analytics?.recentTransactions || [];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-fintech-text tracking-wide">Dashboard</h1>
          <p className="text-fintech-textMuted text-sm mt-1">Real-time breakdown of your capital growth.</p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-semibold px-3 py-2 bg-fintech-card border border-fintech-border rounded-xl text-fintech-textMuted">
          <Calendar className="w-4 h-4 text-fintech-green" />
          <span>Active Period: FY {new Date().getFullYear()}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card.Stat 
          title="Total Balance" 
          amount={totalBalance} 
          icon={Wallet} 
          trend="+3.2%" 
          trendUp={totalBalance >= 0} 
          colorClass="bg-blue-600" 
          currency={currency}
        />
        <Card.Stat 
          title="Total Income" 
          amount={totalIncome} 
          icon={TrendingUp} 
          trend="+12.4%" 
          trendUp={true} 
          colorClass="bg-fintech-green" 
          currency={currency}
        />
        <Card.Stat 
          title="Total Expenses" 
          amount={totalExpense} 
          icon={TrendingDown} 
          trend="-2.1%" 
          trendUp={false} 
          colorClass="bg-fintech-red" 
          currency={currency}
        />
        <Card.Stat 
          title="Savings" 
          amount={savings} 
          icon={PiggyBank} 
          trend={`${savingsRate.toFixed(0)}% rate`} 
          trendUp={savings >= 0} 
          colorClass="bg-purple-600" 
          currency={currency}
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cashflow Bar Chart */}
        <div className="card lg:col-span-2 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-bold text-fintech-text tracking-wide uppercase">Income vs Expense</h3>
            <span className="text-xs text-fintech-textMuted font-medium">Monthly cashflow</span>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3A3A3C" vertical={false} />
                <XAxis dataKey="month" stroke="#A0A0A5" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#A0A0A5" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1C1C1E', borderColor: '#3A3A3C', borderRadius: '12px' }}
                  itemStyle={{ color: '#F5F5F7' }}
                  cursor={{ fill: '#3A3A3C', opacity: 0.2 }}
                />
                <Bar dataKey="income" fill="#28C76F" radius={[4, 4, 0, 0]} barSize={10} />
                <Bar dataKey="expense" fill="#EA5455" radius={[4, 4, 0, 0]} barSize={10} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expenses Pie Chart */}
        <div className="card flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-bold text-fintech-text tracking-wide uppercase">Expenses by Category</h3>
          </div>
          <div className="h-64 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1C1C1E', borderColor: '#3A3A3C', borderRadius: '12px' }}
                  itemStyle={{ color: '#F5F5F7' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <Activity className="w-5 h-5 text-fintech-green mb-1 animate-pulse" />
              <span className="text-xxs font-semibold uppercase tracking-wider text-fintech-textMuted">Spread</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {categoryData.slice(0, 4).map((entry, index) => (
              <div key={entry.name} className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="text-xs text-fintech-textMuted truncate">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Savings Trend Line Chart & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Savings Trend Line Chart */}
        <div className="card lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-bold text-fintech-text tracking-wide uppercase">Savings Curve</h3>
            <span className="text-xs text-fintech-textMuted font-medium">Monthly net savings</span>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3A3A3C" vertical={false} />
                <XAxis dataKey="name" stroke="#A0A0A5" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#A0A0A5" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1C1C1E', borderColor: '#3A3A3C', borderRadius: '12px' }}
                  itemStyle={{ color: '#F5F5F7' }}
                />
                <Line type="monotone" dataKey="savings" stroke="#00CFE8" strokeWidth={3} dot={{ fill: '#00CFE8', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions Widget */}
        <div className="card flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-fintech-text tracking-wide uppercase mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {recentTransactions.length === 0 ? (
                <div className="text-center py-10 text-xs text-fintech-textMuted">No recent actions recorded.</div>
              ) : (
                recentTransactions.map((tx) => (
                  <div key={tx._id} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-fintech-dark transition-colors">
                    <div className="flex items-center space-x-3 truncate">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${tx.type === 'income' ? 'bg-fintech-green/10' : 'bg-fintech-red/10'}`}>
                        {tx.type === 'income' ? (
                          <TrendingUpIcon className="w-4.5 h-4.5 text-fintech-green" />
                        ) : (
                          <TrendingDown className="w-4.5 h-4.5 text-fintech-red" />
                        )}
                      </div>
                      <div className="truncate">
                        <h4 className="text-xs font-semibold text-fintech-text truncate">{tx.title}</h4>
                        <p className="text-[10px] text-fintech-textMuted truncate">{tx.category} • {formatDate(tx.date)}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-bold shrink-0 ${tx.type === 'income' ? 'text-fintech-green' : 'text-fintech-text'}`}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount, currency)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
