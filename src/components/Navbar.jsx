import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, List, PlusCircle, BarChart3 } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const getLinkClass = (path) => {
    return location.pathname === path ? 'active-nav' : '';
  };

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
      <h1>Tracker</h1>
      <nav style={{ display: 'flex', gap: '12px' }}>
        <Link to="/" className={`btn-secondary ${getLinkClass('/')}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
          <LayoutDashboard size={18} /> Dashboard
        </Link>
        <Link to="/transactions" className={`btn-secondary ${getLinkClass('/transactions')}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
          <List size={18} /> Transactions
        </Link>
        <Link to="/analytics" className={`btn-secondary ${getLinkClass('/analytics')}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
          <BarChart3 size={18} /> Analytics
        </Link>
        <Link to="/add" className={`btn-secondary ${getLinkClass('/add')}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none', background: 'var(--forest)', color: 'white', borderColor: 'var(--forest)' }}>
          <PlusCircle size={18} /> Add
        </Link>
      </nav>
    </header>
  );
}
