import { useEffect, useState } from 'react';
import { Sidebar, Header } from './components/Layout.jsx';
import { Toast } from './components/ui.jsx';
import { navItems } from './data.js';
import { StoreProvider } from './store.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Transactions from './pages/Transactions.jsx';
import Accounts from './pages/Accounts.jsx';
import Investments from './pages/Investments.jsx';
import CreditCards from './pages/CreditCards.jsx';
import Loans from './pages/Loans.jsx';
import Services from './pages/Services.jsx';
import Privileges from './pages/Privileges.jsx';
import Settings from './pages/Settings.jsx';

const pages = {
  dashboard: Dashboard,
  transactions: Transactions,
  accounts: Accounts,
  investments: Investments,
  cards: CreditCards,
  loans: Loans,
  services: Services,
  privileges: Privileges,
  settings: Settings,
};

// Hash routing (#transactions, #cards, ...) keeps the app a single static page.
const readHash = () => {
  const key = window.location.hash.replace('#', '');
  return pages[key] ? key : 'dashboard';
};

export default function App() {
  const [page, setPage] = useState(readHash);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onHash = () => { setPage(readHash()); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const item = navItems.find((n) => n.key === page);
  const title = item.title || item.label;
  const Page = pages[page];

  return (
    <StoreProvider>
      <div className="flex min-h-screen bg-bg text-text antialiased">
        <Sidebar active={page} open={menuOpen} onClose={() => setMenuOpen(false)} />
        <div className="flex-1 min-w-0 md:ml-[210px] transition-all">
          <Header title={title} onMenu={() => setMenuOpen(true)} />
          <Page key={page} />
        </div>
        <Toast />
      </div>
    </StoreProvider>
  );
}
