import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import AddTransaction from './pages/AddTransaction';
import Analytics from './pages/Analytics';
import './index.css';

function App() {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('ledger_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('ledger_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (transaction) => {
    setTransactions([transaction, ...transactions]);
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const editTransaction = (updatedTransaction) => {
    setTransactions(transactions.map(t => t.id === updatedTransaction.id ? updatedTransaction : t));
  };

  const importTransactions = (newTransactions) => {
    setTransactions([...newTransactions, ...transactions]);
  };

  return (
    <Router>
      <div className="container">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard transactions={transactions} />} />
          <Route path="/transactions" element={<Transactions transactions={transactions} deleteTransaction={deleteTransaction} importTransactions={importTransactions} />} />
          <Route path="/analytics" element={<Analytics transactions={transactions} />} />
          <Route path="/add" element={<AddTransaction addTransaction={addTransaction} />} />
          <Route path="/edit/:id" element={<AddTransaction transactions={transactions} editTransaction={editTransaction} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
