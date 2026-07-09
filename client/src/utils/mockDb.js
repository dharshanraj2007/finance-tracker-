// Mock Database for client-side storage
const DB_PREFIX = 'smartfinance_';

const defaultIncomes = [
  { _id: 'inc_1', userId: 'usr_demo', title: 'Monthly Salary', amount: 5200, category: 'Salary', date: '2026-06-01', description: 'Tech Corp software engineer salary' },
  { _id: 'inc_2', userId: 'usr_demo', title: 'Freelance Design', amount: 1500, category: 'Freelance', date: '2026-06-15', description: 'Landing page design work' },
  { _id: 'inc_3', userId: 'usr_demo', title: 'Dividends Pay', amount: 320, category: 'Investment', date: '2026-06-28', description: 'Quarterly dividends' },
  { _id: 'inc_4', userId: 'usr_demo', title: 'Salary July', amount: 5200, category: 'Salary', date: '2026-07-01', description: 'Tech Corp salary' },
  { _id: 'inc_5', userId: 'usr_demo', title: 'Consulting Project', amount: 800, category: 'Freelance', date: '2026-07-05', description: 'UI audit consulting' },
];

const defaultExpenses = [
  { _id: 'exp_1', userId: 'usr_demo', title: 'Organic Groceries', amount: 180.50, category: 'Food', date: '2026-06-03', description: 'Whole Foods grocery run' },
  { _id: 'exp_2', userId: 'usr_demo', title: 'Electricity Bill', amount: 95.00, category: 'Bills', date: '2026-06-10', description: 'Monthly electricity bill' },
  { _id: 'exp_3', userId: 'usr_demo', title: 'Netflix Subscription', amount: 15.99, category: 'Entertainment', date: '2026-06-15', description: 'Premium ultra HD subscription' },
  { _id: 'exp_4', userId: 'usr_demo', title: 'Airport Uber Ride', amount: 45.00, category: 'Travel', date: '2026-06-20', description: 'Taxi to airport' },
  { _id: 'exp_5', userId: 'usr_demo', title: 'Premium Sneakers', amount: 120.00, category: 'Shopping', date: '2026-06-25', description: 'Sneakers purchase' },
  { _id: 'exp_6', userId: 'usr_demo', title: 'Rent payment June', amount: 1500, category: 'Bills', date: '2026-06-01', description: 'Monthly apartment rent' },
  { _id: 'exp_7', userId: 'usr_demo', title: 'Rent payment July', amount: 1500, category: 'Bills', date: '2026-07-01', description: 'Monthly rent' },
  { _id: 'exp_8', userId: 'usr_demo', title: 'Medicines', amount: 65.00, category: 'Medical', date: '2026-07-03', description: 'Pharmacy prescription' },
  { _id: 'exp_9', userId: 'usr_demo', title: 'Weekly Groceries', amount: 210.00, category: 'Food', date: '2026-07-06', description: 'Supermarket shopping' },
  { _id: 'exp_10', userId: 'usr_demo', title: 'Fine Dining', amount: 150.00, category: 'Food', date: '2026-07-08', description: 'Dinner with friends' },
];

const defaultUsers = [
  {
    id: 'usr_demo',
    name: 'Demo User',
    email: 'demo@smartfinance.com',
    password: 'password123',
    settings: {
      darkMode: true,
      notifications: true,
      currency: 'USD',
    }
  }
];

const getStorageItem = (key, defaultValue) => {
  const data = localStorage.getItem(DB_PREFIX + key);
  return data ? JSON.parse(data) : defaultValue;
};

const setStorageItem = (key, data) => {
  localStorage.setItem(DB_PREFIX + key, JSON.stringify(data));
};

export const initDb = () => {
  if (!localStorage.getItem(DB_PREFIX + 'users')) {
    setStorageItem('users', defaultUsers);
  }
  if (!localStorage.getItem(DB_PREFIX + 'incomes')) {
    setStorageItem('incomes', defaultIncomes);
  }
  if (!localStorage.getItem(DB_PREFIX + 'expenses')) {
    setStorageItem('expenses', defaultExpenses);
  }
};

export const findUserByEmail = (email) => {
  initDb();
  const users = getStorageItem('users', []);
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
};

export const createUser = (name, email, password) => {
  initDb();
  const users = getStorageItem('users', []);
  if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('User already exists');
  }
  const newUser = {
    id: 'usr_' + Math.random().toString(36).substr(2, 9),
    name,
    email,
    password,
    settings: {
      darkMode: true,
      notifications: true,
      currency: 'USD',
    }
  };
  users.push(newUser);
  setStorageItem('users', users);
  return newUser;
};

export const updateUserProfile = (userId, updateData) => {
  initDb();
  const users = getStorageItem('users', []);
  const index = users.findIndex(u => u.id === userId);
  if (index === -1) throw new Error('User not found');
  
  if (updateData.password) {
    users[index].password = updateData.password;
  }
  
  if (updateData.name) users[index].name = updateData.name;
  if (updateData.email) users[index].email = updateData.email;
  
  if (updateData.settings) {
    users[index].settings = { ...users[index].settings, ...updateData.settings };
  }
  
  setStorageItem('users', users);
  return users[index];
};

export const dbGetIncomes = (userId) => {
  initDb();
  const incomes = getStorageItem('incomes', []);
  return incomes.filter(inc => inc.userId === userId).sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const dbAddIncome = (userId, income) => {
  initDb();
  const incomes = getStorageItem('incomes', []);
  const newIncome = {
    _id: 'inc_' + Math.random().toString(36).substr(2, 9),
    userId,
    ...income,
    date: income.date || new Date().toISOString()
  };
  incomes.push(newIncome);
  setStorageItem('incomes', incomes);
  return newIncome;
};

export const dbUpdateIncome = (userId, id, incomeData) => {
  initDb();
  const incomes = getStorageItem('incomes', []);
  const index = incomes.findIndex(inc => inc._id === id && inc.userId === userId);
  if (index === -1) throw new Error('Income record not found');
  
  incomes[index] = { ...incomes[index], ...incomeData };
  setStorageItem('incomes', incomes);
  return incomes[index];
};

export const dbDeleteIncome = (userId, id) => {
  initDb();
  const incomes = getStorageItem('incomes', []);
  const filtered = incomes.filter(inc => !(inc._id === id && inc.userId === userId));
  setStorageItem('incomes', filtered);
  return { message: 'Income record deleted' };
};

export const dbGetExpenses = (userId) => {
  initDb();
  const expenses = getStorageItem('expenses', []);
  return expenses.filter(exp => exp.userId === userId).sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const dbAddExpense = (userId, expense) => {
  initDb();
  const expenses = getStorageItem('expenses', []);
  const newExpense = {
    _id: 'exp_' + Math.random().toString(36).substr(2, 9),
    userId,
    ...expense,
    date: expense.date || new Date().toISOString()
  };
  expenses.push(newExpense);
  setStorageItem('expenses', expenses);
  return newExpense;
};

export const dbUpdateExpense = (userId, id, expenseData) => {
  initDb();
  const expenses = getStorageItem('expenses', []);
  const index = expenses.findIndex(exp => exp._id === id && exp.userId === userId);
  if (index === -1) throw new Error('Expense record not found');
  
  expenses[index] = { ...expenses[index], ...expenseData };
  setStorageItem('expenses', expenses);
  return expenses[index];
};

export const dbDeleteExpense = (userId, id) => {
  initDb();
  const expenses = getStorageItem('expenses', []);
  const filtered = expenses.filter(exp => !(exp._id === id && exp.userId === userId));
  setStorageItem('expenses', filtered);
  return { message: 'Expense record deleted' };
};

export const dbGetAnalytics = (userId) => {
  initDb();
  const incomes = dbGetIncomes(userId);
  const expenses = dbGetExpenses(userId);
  
  const totalIncome = incomes.reduce((sum, inc) => sum + Number(inc.amount), 0);
  const totalExpense = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  const totalBalance = totalIncome - totalExpense;
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentYear = new Date().getFullYear();
  
  const monthlyDataMap = {};
  months.forEach(m => {
    monthlyDataMap[m] = { month: m, income: 0, expense: 0 };
  });
  
  incomes.forEach(inc => {
    const incDate = new Date(inc.date);
    if (incDate.getFullYear() === currentYear) {
      const monthName = months[incDate.getMonth()];
      monthlyDataMap[monthName].income += Number(inc.amount);
    }
  });
  
  expenses.forEach(exp => {
    const expDate = new Date(exp.date);
    if (expDate.getFullYear() === currentYear) {
      const monthName = months[expDate.getMonth()];
      monthlyDataMap[monthName].expense += Number(exp.amount);
    }
  });
  
  const monthlyData = months.map(m => monthlyDataMap[m]);
  
  const categoryMap = {};
  expenses.forEach(exp => {
    const cat = exp.category;
    categoryMap[cat] = (categoryMap[cat] || 0) + Number(exp.amount);
  });
  
  const expenseCategories = Object.keys(categoryMap).map(cat => ({
    name: cat,
    value: categoryMap[cat]
  }));
  
  const recentIncomes = incomes.map(i => ({ ...i, type: 'income' }));
  const recentExpenses = expenses.map(e => ({ ...e, type: 'expense' }));
  const recentTransactions = [...recentIncomes, ...recentExpenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);
  
  return {
    totalIncome,
    totalExpense,
    totalBalance,
    monthlyData,
    expenseCategories,
    recentTransactions
  };
};
