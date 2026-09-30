import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Paperclip, X } from 'lucide-react';

export default function AddTransaction({ addTransaction, transactions, editTransaction }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'expense',
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    receipt: null // For storing image Data URL
  });
  
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing && transactions) {
      const transactionToEdit = transactions.find(t => t.id === id);
      if (transactionToEdit) {
        setFormData(transactionToEdit);
      } else {
        navigate('/transactions');
      }
    }
  }, [id, isEditing, transactions, navigate]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, receipt: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.title.trim()) {
      return setError('Title is required');
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      return setError('Amount must be greater than 0');
    }

    const payload = {
      ...formData,
      id: isEditing ? id : Date.now().toString(),
    };

    if (isEditing) {
      editTransaction(payload);
    } else {
      addTransaction(payload);
    }

    navigate('/transactions');
  };

  const categories = formData.type === 'expense' 
    ? ['Food', 'Travel', 'Entertainment', 'Shopping', 'Bills', 'Other']
    : ['Salary', 'Freelance', 'Investments', 'Gift', 'Other'];

  return (
    <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>{isEditing ? 'Edit Transaction' : 'Add New Transaction'}</h2>
      
      {error && <div style={{ color: 'var(--rust)', marginBottom: '16px', fontSize: '14px', fontWeight: 600 }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label>Type</label>
            <select value={formData.type} onChange={(e) => {
                const newType = e.target.value;
                setFormData({...formData, type: newType, category: newType === 'expense' ? 'Food' : 'Salary'});
            }}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <div>
            <label>Date</label>
            <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
          </div>
        </div>

        <label>Title</label>
        <input type="text" placeholder="e.g., Lunch at cafe" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label>Amount (₹)</label>
            <input type="number" step="0.01" min="0" placeholder="e.g., 250" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} />
          </div>
          <div>
            <label>Category</label>
            <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <label>Notes (Optional)</label>
        <textarea rows="3" placeholder="Additional details..." value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})}></textarea>

        {/* Receipt Upload Section */}
        <div style={{ marginBottom: '16px' }}>
          <label>Attach Receipt (Optional)</label>
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            style={{ display: 'none' }} 
          />
          {formData.receipt ? (
            <div style={{ position: 'relative', display: 'inline-block', marginTop: '8px' }}>
              <img src={formData.receipt} alt="Receipt preview" style={{ height: '80px', borderRadius: '4px', border: '1px solid var(--line)' }} />
              <button 
                type="button" 
                onClick={() => setFormData({...formData, receipt: null})} 
                style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--rust)', color: 'white', border: 'none', borderRadius: '50%', padding: '4px', cursor: 'pointer', display: 'flex' }}
                title="Remove Receipt"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <button 
              type="button" 
              onClick={() => fileInputRef.current.click()} 
              className="btn-secondary" 
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', width: 'fit-content' }}
            >
              <Paperclip size={16} /> Upload Photo
            </button>
          )}
        </div>

        <button type="submit" className="btn-primary">
          {isEditing ? 'Save Changes' : 'Record Transaction'}
        </button>
      </form>
    </div>
  );
}
