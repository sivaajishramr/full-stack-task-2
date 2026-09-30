import { BarChart3, CalendarDays } from 'lucide-react';

export default function Analytics({ transactions }) {
  const expenses = transactions.filter(t => t.type === 'expense');
  const formatMoney = (amount) => '₹' + amount.toLocaleString('en-IN', { maximumFractionDigits: 0 });

  // 1. Group by category
  const categoryTotals = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + parseFloat(curr.amount);
    return acc;
  }, {});
  const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
  const totalExpense = sortedCategories.reduce((acc, curr) => acc + curr[1], 0);

  // 2. Group by date (Daily Usage)
  const dailyTotals = expenses.reduce((acc, curr) => {
    acc[curr.date] = (acc[curr.date] || 0) + parseFloat(curr.amount);
    return acc;
  }, {});
  // Sort chronologically
  const sortedDays = Object.entries(dailyTotals).sort((a, b) => new Date(a[0]) - new Date(b[0]));
  const maxDailyExpense = Math.max(...sortedDays.map(d => d[1]), 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Daily Usage Bar Graph (Vertical) */}
      <div className="card">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <CalendarDays size={24} color="var(--forest)" /> Daily Usage
        </h2>

        {sortedDays.length === 0 ? (
          <div className="empty-msg">No daily usage found yet.</div>
        ) : (
          <div style={{ 
            display: 'flex', 
            alignItems: 'flex-end', 
            gap: '12px', 
            height: '250px', 
            paddingTop: '20px',
            borderBottom: '1px solid var(--line)',
            overflowX: 'auto',
            paddingBottom: '10px'
          }}>
            {sortedDays.map(([date, amount]) => {
              const heightPercent = (amount / maxDailyExpense) * 100;
              const dateObj = new Date(date);
              const shortDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              
              return (
                <div key={date} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', flex: '1', minWidth: '60px', height: '100%' }}>
                  <span style={{ fontSize: '11px', fontFamily: '"IBM Plex Mono", monospace', color: 'var(--ink-soft)' }}>
                    {formatMoney(amount)}
                  </span>
                  <div style={{ 
                    width: '100%', 
                    maxWidth: '40px', 
                    height: `${Math.max(heightPercent, 2)}%`, 
                    background: 'var(--forest)', 
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 0.5s ease'
                  }}></div>
                  <span style={{ fontSize: '11px', color: 'var(--ink)', fontWeight: 600, marginTop: '4px', textAlign: 'center' }}>
                    {shortDate}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Category Breakdown (Horizontal) */}
      <div className="card">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BarChart3 size={24} color="var(--forest)" /> Category Breakdown
        </h2>
        
        {sortedCategories.length === 0 ? (
          <div className="empty-msg">No expenses found yet to display a graph.</div>
        ) : (
          <div style={{ marginTop: '24px' }}>
            <div style={{ marginBottom: '24px', fontSize: '14px', color: 'var(--ink-soft)' }}>
              Total Recorded Expenses: <span style={{ fontWeight: 600, color: 'var(--rust)', fontFamily: '"IBM Plex Mono", monospace', fontSize: '16px' }}>{formatMoney(totalExpense)}</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {sortedCategories.map(([category, amount]) => {
                const percentage = ((amount / totalExpense) * 100).toFixed(1);
                return (
                  <div key={category}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{category}</span>
                      <span style={{ fontFamily: '"IBM Plex Mono", monospace', color: 'var(--ink-soft)' }}>
                        {formatMoney(amount)} <span style={{ fontSize: '12px', opacity: 0.7 }}>({percentage}%)</span>
                      </span>
                    </div>
                    <div style={{ height: '10px', background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: '10px', overflow: 'hidden' }}>
                      <div style={{ 
                        height: '100%', 
                        width: `${percentage}%`, 
                        background: 'var(--brass)', 
                        borderRadius: '10px',
                        transition: 'width 0.5s ease-in-out'
                      }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
