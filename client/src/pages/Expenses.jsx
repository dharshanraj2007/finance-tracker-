import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, TrendingDown, AlertCircle, Calendar } from 'lucide-react';
import * as apiService from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import { formatCurrency, formatDate } from '../utils/formatters';

// Reusable UI Imports
import Card from '../components/Card';
import Table from '../components/Table';
import Modal from '../components/Modal';
import Form from '../components/Form';
import Search from '../components/Search';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';

const Expenses = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null); // track if editing or creating
  
  const [formData, setFormData] = useState({ 
    title: '', 
    amount: '', 
    category: '', 
    date: '', 
    description: '' 
  });
  
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const currency = user?.settings?.currency || 'USD';

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const data = await apiService.getExpenses();
      setExpenses(data);
    } catch (error) {
      console.error('Failed to fetch expenses', error);
      showToast('Could not load expenses. Fallback triggered.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOpenAddModal = () => {
    setEditId(null);
    setFormData({ title: '', amount: '', category: '', date: '', description: '' });
    setShowModal(true);
  };

  const handleEditClick = (expense) => {
    setEditId(expense._id);
    const parsedDate = expense.date ? expense.date.substring(0, 10) : '';
    setFormData({
      title: expense.title,
      amount: expense.amount.toString(),
      category: expense.category,
      date: parsedDate,
      description: expense.description || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const transactionData = { 
        ...formData, 
        amount: Number(formData.amount) 
      };

      if (editId) {
        // Edit flow
        await apiService.updateExpense(editId, transactionData);
        showToast('Expense updated successfully!', 'success');
      } else {
        // Create flow
        await apiService.addExpense(transactionData);
        showToast('Expense recorded successfully!', 'success');
      }
      
      setShowModal(false);
      setFormData({ title: '', amount: '', category: '', date: '', description: '' });
      fetchExpenses();
    } catch (error) {
      console.error('Failed to save expense', error);
      showToast('Failed to save expense. Check inputs.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await apiService.deleteExpense(id);
        showToast('Expense deleted successfully.', 'success');
        fetchExpenses();
      } catch (error) {
        console.error('Failed to delete expense', error);
        showToast('Could not delete selected expense.', 'error');
      }
    }
  };

  // Search filter
  const filteredExpenses = expenses.filter(exp => 
    exp.title.toLowerCase().includes(search.toLowerCase()) || 
    exp.category.toLowerCase().includes(search.toLowerCase()) ||
    (exp.description && exp.description.toLowerCase().includes(search.toLowerCase()))
  );

  // Pagination bounds
  const paginatedExpenses = filteredExpenses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns = [
    {
      header: 'Title & Vendor',
      render: (row) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-fintech-red/10 flex items-center justify-center shrink-0">
            <TrendingDown className="w-5 h-5 text-fintech-red" />
          </div>
          <div className="truncate max-w-[200px]">
            <p className="text-sm font-semibold text-fintech-text truncate">{row.title}</p>
            <p className="text-xs text-fintech-textMuted truncate">{row.description || 'No remarks'}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Category',
      render: (row) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-fintech-dark border border-fintech-border text-fintech-textMuted uppercase tracking-wider">
          {row.category}
        </span>
      )
    },
    {
      header: 'Date',
      render: (row) => (
        <span className="text-xs text-fintech-textMuted font-medium flex items-center space-x-1">
          <Calendar className="w-3.5 h-3.5 text-fintech-textMuted" />
          <span>{formatDate(row.date)}</span>
        </span>
      )
    },
    {
      header: 'Amount',
      align: 'right',
      render: (row) => (
        <span className="text-sm font-bold text-fintech-red">
          -{formatCurrency(row.amount, currency)}
        </span>
      )
    },
    {
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end space-x-2">
          <button 
            onClick={() => handleEditClick(row)}
            className="p-2 text-fintech-textMuted hover:text-fintech-text hover:bg-fintech-dark rounded-xl transition-all"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleDelete(row._id)}
            className="p-2 text-fintech-textMuted hover:text-fintech-red hover:bg-fintech-red/10 rounded-xl transition-all"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-fintech-text tracking-wide">Expenses</h1>
          <p className="text-fintech-textMuted text-sm mt-1">Review, log, and audit your outflows.</p>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="btn-primary flex items-center space-x-2 bg-fintech-red hover:bg-fintech-red/80 focus:ring-fintech-red shadow-lg shadow-fintech-red/10 animate-fade-in"
        >
          <Plus className="w-5 h-5" />
          <span>Add Expense</span>
        </button>
      </div>

      {/* Table Card Container */}
      <div className="card p-0 overflow-hidden">
        {/* Filter Bar */}
        <div className="p-4 border-b border-fintech-border bg-fintech-darker/30 flex items-center">
          <Search 
            value={search} 
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }} 
            placeholder="Search expense by title, category, description..." 
          />
        </div>

        {/* Content Body */}
        {loading ? (
          <div className="py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredExpenses.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-fintech-dark rounded-2xl flex items-center justify-center mb-4 border border-fintech-border">
              <AlertCircle className="w-8 h-8 text-fintech-textMuted" />
            </div>
            <h3 className="text-lg font-bold text-fintech-text mb-1">No expense entries found</h3>
            <p className="text-fintech-textMuted text-sm max-w-sm mb-6">Create your first expense log to begin tracking cash flows.</p>
            <button onClick={handleOpenAddModal} className="btn-primary bg-fintech-red hover:bg-fintech-red/80">Add New Expense</button>
          </div>
        ) : (
          <>
            <Table 
              columns={columns} 
              data={paginatedExpenses} 
              emptyMessage="No search results matching filter query." 
            />
            <Pagination 
              currentPage={currentPage}
              totalItems={filteredExpenses.length}
              itemsPerPage={itemsPerPage}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </>
        )}
      </div>

      {/* Modal Dialog */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editId ? "Update Outflow" : "Record New Outflow"}
      >
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label htmlFor="title">Expense Title</Form.Label>
            <Form.Input 
              required 
              id="title" 
              name="title" 
              value={formData.title} 
              onChange={handleInputChange} 
              placeholder="e.g. Groceries, Electricity Bill" 
            />
          </Form.Group>

          <Form.Group>
            <Form.Label htmlFor="amount">Amount</Form.Label>
            <Form.Input 
              required 
              type="number" 
              step="0.01" 
              id="amount" 
              name="amount" 
              value={formData.amount} 
              onChange={handleInputChange} 
              placeholder="0.00" 
            />
          </Form.Group>

          <Form.Group>
            <Form.Label htmlFor="date">Date Logged</Form.Label>
            <Form.Input 
              required 
              type="date" 
              id="date" 
              name="date" 
              value={formData.date} 
              onChange={handleInputChange} 
            />
          </Form.Group>

          <Form.Group>
            <Form.Label htmlFor="category">Category</Form.Label>
            <Form.Select 
              required 
              id="category" 
              name="category" 
              value={formData.category} 
              onChange={handleInputChange}
            >
              <option value="">Choose category...</option>
              <option value="Food">Food</option>
              <option value="Shopping">Shopping</option>
              <option value="Medical">Medical</option>
              <option value="Bills">Bills</option>
              <option value="Education">Education</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Travel">Travel</option>
              <option value="Others">Others</option>
            </Form.Select>
          </Form.Group>

          <Form.Group>
            <Form.Label htmlFor="description">Remarks / Description</Form.Label>
            <Form.Textarea 
              id="description" 
              name="description" 
              value={formData.description} 
              onChange={handleInputChange} 
              placeholder="e.g. Uber trip details, itemized shop purchases..."
            />
          </Form.Group>

          <div className="pt-4 flex space-x-3">
            <button 
              type="button" 
              onClick={() => setShowModal(false)} 
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary flex-1 bg-fintech-red hover:bg-fintech-red/80"
            >
              Save Outflow
            </button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Expenses;
