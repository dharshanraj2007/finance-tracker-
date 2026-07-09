import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, TrendingUp, AlertCircle, Calendar } from 'lucide-react';
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

const Income = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [incomes, setIncomes] = useState([]);
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
    fetchIncomes();
  }, []);

  const fetchIncomes = async () => {
    try {
      const data = await apiService.getIncomes();
      setIncomes(data);
    } catch (error) {
      console.error('Failed to fetch incomes', error);
      showToast('Could not load incomes. Fallback triggered.', 'error');
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

  const handleEditClick = (income) => {
    setEditId(income._id);
    // Parse ISO date to YYYY-MM-DD for date input
    const parsedDate = income.date ? income.date.substring(0, 10) : '';
    setFormData({
      title: income.title,
      amount: income.amount.toString(),
      category: income.category,
      date: parsedDate,
      description: income.description || ''
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
        await apiService.updateIncome(editId, transactionData);
        showToast('Income updated successfully!', 'success');
      } else {
        // Create flow
        await apiService.addIncome(transactionData);
        showToast('Income recorded successfully!', 'success');
      }
      
      setShowModal(false);
      setFormData({ title: '', amount: '', category: '', date: '', description: '' });
      fetchIncomes();
    } catch (error) {
      console.error('Failed to save income', error);
      showToast('Failed to save income. Check inputs.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this income?')) {
      try {
        await apiService.deleteIncome(id);
        showToast('Income deleted successfully.', 'success');
        fetchIncomes();
      } catch (error) {
        console.error('Failed to delete income', error);
        showToast('Could not delete selected income.', 'error');
      }
    }
  };

  // Search filter
  const filteredIncomes = incomes.filter(inc => 
    inc.title.toLowerCase().includes(search.toLowerCase()) || 
    inc.category.toLowerCase().includes(search.toLowerCase()) ||
    (inc.description && inc.description.toLowerCase().includes(search.toLowerCase()))
  );

  // Pagination bounds
  const paginatedIncomes = filteredIncomes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns = [
    {
      header: 'Title & Source',
      render: (row) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-fintech-green/10 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 text-fintech-green" />
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
        <span className="text-sm font-bold text-fintech-green">
          +{formatCurrency(row.amount, currency)}
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
          <h1 className="text-2xl font-bold text-fintech-text tracking-wide">Income Sources</h1>
          <p className="text-fintech-textMuted text-sm mt-1">Review, log, and audit your inflows.</p>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="btn-primary flex items-center space-x-2 shadow-lg shadow-fintech-green/10"
        >
          <Plus className="w-5 h-5" />
          <span>Add Income</span>
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
            placeholder="Search income by title, category, remarks..." 
          />
        </div>

        {/* Content Body */}
        {loading ? (
          <div className="py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredIncomes.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-fintech-dark rounded-2xl flex items-center justify-center mb-4 border border-fintech-border">
              <AlertCircle className="w-8 h-8 text-fintech-textMuted" />
            </div>
            <h3 className="text-lg font-bold text-fintech-text mb-1">No income entries found</h3>
            <p className="text-fintech-textMuted text-sm max-w-sm mb-6">Create your first logged asset to begin tracking.</p>
            <button onClick={handleOpenAddModal} className="btn-primary">Add New Income</button>
          </div>
        ) : (
          <>
            <Table 
              columns={columns} 
              data={paginatedIncomes} 
              emptyMessage="No search results matching filter query." 
            />
            <Pagination 
              currentPage={currentPage}
              totalItems={filteredIncomes.length}
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
        title={editId ? "Update Inflow" : "Record New Inflow"}
      >
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label htmlFor="title">Source Title</Form.Label>
            <Form.Input 
              required 
              id="title" 
              name="title" 
              value={formData.title} 
              onChange={handleInputChange} 
              placeholder="e.g. Salary, Stock Dividends" 
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
              <option value="Salary">Salary</option>
              <option value="Freelance">Freelance</option>
              <option value="Investment">Investment</option>
              <option value="Gift">Gift</option>
              <option value="Other">Other</option>
            </Form.Select>
          </Form.Group>

          <Form.Group>
            <Form.Label htmlFor="description">Remarks / Description</Form.Label>
            <Form.Textarea 
              id="description" 
              name="description" 
              value={formData.description} 
              onChange={handleInputChange} 
              placeholder="e.g. Bank transfer, project milestone details..."
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
              className="btn-primary flex-1 bg-fintech-green hover:bg-fintech-greenHover"
            >
              Save Inflow
            </button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Income;
