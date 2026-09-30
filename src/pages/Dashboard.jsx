import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';

export default function Dashboard({ transactions }) {
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
  const balance = totalIncome - totalExpense;

  const recentTransactions = transactions.slice(0, 5);

  const formatMoney = (amount) => '₹' + parseFloat(amount).toLocaleString('en-IN', { maximumFractionDigits: 0 });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '22px' }}>
      <div className="card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        
        <div style={{ background: 'var(--forest)', color: 'white', padding: '20px', borderRadius: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.9, marginBottom: '8px' }}>
            <Wallet size={20} /> <span style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Remaining Balance</span>
          </div>
          <div style={{ fontSize: '32px', fontFamily: '"IBM Plex Mono", monospace', fontWeight: 600 }}>{formatMoney(balance)}</div>
        </div>

        <div style={{ background: 'var(--paper)', border: '1px solid var(--line)', padding: '20px', borderRadius: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--forest)', marginBottom: '8px' }}>
            <ArrowUpRight size={20} /> <span style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ink-soft)' }}>Total Income</span>
          </div>
          <div style={{ fontSize: '24px', fontFamily: '"IBM Plex Mono", monospace', fontWeight: 600 }}>{formatMoney(totalIncome)}</div>
        </div>

        <div style={{ background: 'var(--paper)', border: '1px solid var(--line)', padding: '20px', borderRadius: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--rust)', marginBottom: '8px' }}>
            <ArrowDownRight size={20} /> <span style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ink-soft)' }}>Total Expenses</span>
          </div>
          <div style={{ fontSize: '24px', fontFamily: '"IBM Plex Mono", monospace', fontWeight: 600 }}>{formatMoney(totalExpense)}</div>
        </div>
      </div>

      <div className="card">
        <h2>Recent Transactions</h2>
        {recentTransactions.length === 0 ? (
          <div className="empty-msg">No transactions yet. Start by adding one!</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentTransactions.map(t => (
              <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px dashed var(--line)' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{t.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--ink-soft)' }}>{t.date} • {t.category}</div>
                </div>
                <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontWeight: 600, color: t.type === 'income' ? 'var(--forest)' : 'var(--rust)' }}>
                  {t.type === 'income' ? '+' : '-'}{formatMoney(t.amount)}
                </div>
              </div>
            ))}
          </div>
        )}
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <Link to="/transactions" style={{ fontSize: '14px', color: 'var(--forest)', fontWeight: 600, textDecoration: 'none' }}>View All Transactions →</Link>
        </div>
      </div>
    </div>
  );
}
