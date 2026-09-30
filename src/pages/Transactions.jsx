import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, Search, Upload, Image as ImageIcon } from 'lucide-react';

export default function Transactions({ transactions, deleteTransaction, importTransactions }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  
  // Date Range State
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const fileInputRef = useRef(null);

  const filtered = transactions.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || t.type === filterType;
    
    // Date Range Logic
    let matchesDate = true;
    const tDate = new Date(t.date);
    if (startDate) {
      matchesDate = matchesDate && tDate >= new Date(startDate);
    }
    if (endDate) {
      matchesDate = matchesDate && tDate <= new Date(endDate);
    }

    return matchesSearch && matchesType && matchesDate;
  });

  const formatMoney = (amount) => '₹' + parseFloat(amount).toLocaleString('en-IN', { maximumFractionDigits: 0 });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split('\n');
      const newTransactions = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const [date, title, amount, type, category] = line.split(',');
        if (date && title && amount && type && category) {
          newTransactions.push({
            id: Date.now().toString() + i,
            date: date.trim(),
            title: title.trim(),
            amount: parseFloat(amount.trim()),
            type: type.trim().toLowerCase(),
            category: category.trim(),
            receipt: null // CSV won't have receipts
          });
        }
      }

      if (newTransactions.length > 0) {
        importTransactions(newTransactions);
        alert(`Successfully imported ${newTransactions.length} transactions!`);
      } else {
        alert("No valid transactions found.");
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ margin: 0 }}>All Transactions</h2>
        <button 
          onClick={() => fileInputRef.current.click()} 
          className="btn-secondary" 
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Upload size={16} /> Import CSV
        </button>
        <input type="file" accept=".csv" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileUpload} />
      </div>
      
      {/* Filters Row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '24px', background: 'var(--paper)', padding: '16px', borderRadius: '4px', border: '1px solid var(--line)' }}>
        
        {/* Search */}
        <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
          <Search size={16} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--ink-soft)' }} />
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '36px', marginBottom: 0 }}
          />
        </div>
        
        {/* Type Filter */}
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} style={{ marginBottom: 0, width: '130px' }}>
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        {/* Date Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink-soft)' }}>FROM:</span>
          <input 
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)} 
            style={{ marginBottom: 0, width: '130px' }} 
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink-soft)' }}>TO:</span>
          <input 
            type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)} 
            style={{ marginBottom: 0, width: '130px' }} 
          />
        </div>
        
        {/* Clear Dates Button */}
        {(startDate || endDate) && (
          <button 
            className="btn-secondary" 
            onClick={() => { setStartDate(''); setEndDate(''); }}
            style={{ marginBottom: 0 }}
          >
            Clear Dates
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-msg">No transactions found matching your criteria.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map(t => (
            <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--paper-raised)', border: '1px solid var(--line)', borderRadius: '4px' }}>
              
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flex: 1 }}>
                {/* Thumbnail Preview */}
                {t.receipt ? (
                  <img src={t.receipt} alt="Receipt" style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--line)' }} />
                ) : (
                  <div style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--paper)', borderRadius: '4px', border: '1px solid var(--line)' }}>
                    <ImageIcon size={20} color="var(--line)" />
                  </div>
                )}

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 600 }}>{t.title}</span>
                    <span className={`badge ${t.type === 'income' ? 'badge-income' : 'badge-expense'}`}>
                      {t.type}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--ink-soft)', marginTop: '4px' }}>
                    {t.date} • {t.category}
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontWeight: 600, fontSize: '18px', color: t.type === 'income' ? 'var(--forest)' : 'var(--rust)' }}>
                  {t.type === 'income' ? '+' : '-'}{formatMoney(t.amount)}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link to={`/edit/${t.id}`} className="btn-secondary" style={{ padding: '6px', display: 'flex' }}>
                    <Edit2 size={16} color="var(--forest)" />
                  </Link>
                  <button onClick={() => deleteTransaction(t.id)} className="btn-secondary" style={{ padding: '6px', display: 'flex' }}>
                    <Trash2 size={16} color="var(--rust)" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
