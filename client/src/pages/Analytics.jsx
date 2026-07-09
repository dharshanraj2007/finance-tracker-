import { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import * as apiService from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatters';
import { Activity, TrendingUp, TrendingDown, PiggyBank, Briefcase } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import Card from '../components/Card';

const COLORS = ['#28C76F', '#EA5455', '#FF9F43', '#00CFE8', '#7367F0', '#FFC085', '#8E94A4'];

const dummyMonthlyData = [
  { name: 'Jan', income: 4000, expense: 2400, savings: 1600 },
  { name: 'Feb', income: 3000, expense: 1398, savings: 1602 },
  { name: 'Mar', income: 2000, expense: 9800, savings: -7800 },
  { name: 'Apr', income: 2780, expense: 3908, savings: -1128 },
  { name: 'May', income: 1890, expense: 4800, savings: -2910 },
  { name: 'Jun', income: 2390, expense: 3800, savings: -1410 },
  { name: 'Jul', income: 3490, expense: 4300, savings: -810 },
];

const dummyCategoryData = [
  { name: 'Food', value: 400 },
  { name: 'Bills', value: 300 },
  { name: 'Shopping', value: 300 },
  { name: 'Transport', value: 200 },
];

const Analytics = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('6m');

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

  // Monthly data preparation
  const monthlyData = analytics?.monthlyData?.filter(m => m.income > 0 || m.expense > 0).length > 0 
    ? analytics.monthlyData.map(m => ({ 
        name: m.month, 
        income: m.income, 
        expense: m.expense,
        savings: m.income - m.expense
      })) 
    : dummyMonthlyData;
    
  const categoryData = analytics?.expenseCategories?.length > 0 
    ? analytics.expenseCategories 
    : dummyCategoryData;

  const displayData = timeRange === '6m' ? monthlyData.slice(-6) : monthlyData;

  // Analytics Metrics computation
  const totalInflows = displayData.reduce((sum, item) => sum + item.income, 0);
  const totalOutflows = displayData.reduce((sum, item) => sum + item.expense, 0);
  const averageIncome = displayData.length > 0 ? totalInflows / displayData.length : 0;
  const averageExpense = displayData.length > 0 ? totalOutflows / displayData.length : 0;
  
  const totalSavings = totalInflows - totalOutflows;
  const savingsRate = totalInflows > 0 ? (totalSavings / totalInflows) * 100 : 0;

  // Category sort
  const sortedCategories = [...categoryData].sort((a, b) => b.value - a.value);
  const topSpentCategory = sortedCategories[0]?.value > 0 ? sortedCategories[0] : { name: 'None', value: 0 };

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-fintech-text tracking-wide">Financial Insights</h1>
          <p className="text-fintech-textMuted text-sm mt-1">Audit curves, balances, and distributions.</p>
        </div>
        <div className="bg-fintech-dark p-1 rounded-xl border border-fintech-border inline-flex">
          <button 
            onClick={() => setTimeRange('6m')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${timeRange === '6m' ? 'bg-fintech-card text-fintech-text shadow-sm' : 'text-fintech-textMuted hover:text-fintech-text'}`}
          >
            6 Months
          </button>
          <button 
            onClick={() => setTimeRange('1y')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${timeRange === '1y' ? 'bg-fintech-card text-fintech-text shadow-sm' : 'text-fintech-textMuted hover:text-fintech-text'}`}
          >
            1 Year (YTD)
          </button>
        </div>
      </div>

      {/* KPI grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
        <Card className="flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-fintech-green/10 text-fintech-green">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-fintech-textMuted uppercase font-bold tracking-wider">Avg Inflow</p>
            <h4 className="text-lg font-bold text-fintech-text mt-0.5">{formatCurrency(averageIncome, currency)}</h4>
          </div>
        </Card>
        <Card className="flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-fintech-red/10 text-fintech-red">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-fintech-textMuted uppercase font-bold tracking-wider">Avg Outflow</p>
            <h4 className="text-lg font-bold text-fintech-text mt-0.5">{formatCurrency(averageExpense, currency)}</h4>
          </div>
        </Card>
        <Card className="flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
            <PiggyBank className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-fintech-textMuted uppercase font-bold tracking-wider">Savings Rate</p>
            <h4 className="text-lg font-bold text-fintech-text mt-0.5">{savingsRate.toFixed(1)}%</h4>
          </div>
        </Card>
        <Card className="flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-fintech-textMuted uppercase font-bold tracking-wider">Top Category</p>
            <h4 className="text-lg font-bold text-fintech-text mt-0.5 truncate max-w-[130px]" title={topSpentCategory.name}>
              {topSpentCategory.name}
            </h4>
          </div>
        </Card>
      </div>

      {/* Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cashflow Bar Chart */}
        <div className="card">
          <h3 className="text-sm font-bold uppercase tracking-wider text-fintech-text mb-6">Cashflow Curve</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={displayData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3A3A3C" vertical={false} />
                <XAxis dataKey="name" stroke="#A0A0A5" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#A0A0A5" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1C1C1E', borderColor: '#3A3A3C', borderRadius: '12px' }}
                  itemStyle={{ color: '#F5F5F7' }}
                  cursor={{ fill: '#3A3A3C', opacity: 0.2 }}
                />
                <Bar dataKey="income" fill="#28C76F" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="#EA5455" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Savings Growth Area Chart */}
        <div className="card">
          <h3 className="text-sm font-bold uppercase tracking-wider text-fintech-text mb-6">Savings Curve</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={displayData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00CFE8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00CFE8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#3A3A3C" vertical={false} />
                <XAxis dataKey="name" stroke="#A0A0A5" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#A0A0A5" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1C1C1E', borderColor: '#3A3A3C', borderRadius: '12px' }}
                  itemStyle={{ color: '#F5F5F7' }}
                />
                <Area type="monotone" dataKey="savings" stroke="#00CFE8" strokeWidth={3} fillOpacity={1} fill="url(#colorSavings)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Spending Distribution Pie Chart */}
        <div className="card lg:col-span-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-fintech-text mb-6">Distribution breakdown</h3>
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="h-80 w-full md:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                    label={({ name, percent }) => percent > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ''}
                    labelLine={false}
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
            </div>
            
            <div className="w-full md:w-1/2 mt-8 md:mt-0 grid grid-cols-2 gap-4">
              {categoryData.map((entry, index) => (
                <div key={entry.name} className="flex items-center p-3 bg-fintech-darker/30 rounded-xl border border-fintech-border hover:border-fintech-border/80 transition-all">
                  <div className="w-3.5 h-3.5 rounded-full mr-3 shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <div className="flex-1 truncate">
                    <p className="text-xs font-semibold text-fintech-text truncate">{entry.name}</p>
                    <p className="text-2xs text-fintech-textMuted mt-0.5">{formatCurrency(entry.value, currency)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
