import { useEffect, useRef, useState } from 'react';
import Icon from '../Icons.jsx';
import { navItems } from '../data.js';
import { useStore } from '../store.jsx';
import { go, initials } from '../utils.js';

export function Sidebar({ active, open, onClose }) {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-xs transition-opacity duration-300 md:hidden ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[210px] bg-surface border-r border-line py-4 overflow-y-auto transition-transform duration-300 ease-out md:translate-x-0 ${open ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}
      >
        <div className="flex items-center gap-2.5 px-4 pb-5 text-blue-700 text-lg font-black text-ink tracking-tight select-none">
          <img src="/bankdash-logo.png" alt="BankDash Logo" className="w-8 h-8 rounded-lg object-cover shadow-sm transition-transform hover:scale-105" />
          <span>BankDash.</span>
          <button className="md:hidden ml-auto grid place-items-center w-7 h-7 rounded-lg text-muted hover:text-ink hover:bg-surface-2" onClick={onClose} aria-label="Close menu">
            <Icon name="close" size={16} />
          </button>
        </div>
        <nav className="flex flex-col gap-1 px-2.5">
          {navItems.map((item) => {
            const isActive = active === item.key;
            return (
              <a
                key={item.key}
                href={`#${item.key}`}
                className={`relative flex items-center gap-3 px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${
                  isActive
                    ? 'text-primary bg-primary/10 font-semibold'
                    : 'text-muted hover:text-primary hover:bg-primary/10'
                }`}
                onClick={onClose}
              >
                {isActive && <span className="absolute left-0 top-1 bottom-1 w-1 bg-primary rounded-r-full shadow-sm" />}
                <Icon name={item.icon} className={isActive ? 'text-primary' : 'text-current'} size={18} />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

function Notifications() {
  const { state, dispatch } = useStore();
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const unread = state.notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const close = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        className="relative w-8 h-8 md:w-9 md:h-9 rounded-full grid place-items-center bg-bg text-muted hover:text-primary hover:bg-primary-soft transition-all active:scale-95 cursor-pointer"
        aria-label={`Notifications, ${unread} unread`}
        onClick={() => setOpen((o) => !o)}
      >
    <img
  src="/notification.png"
  alt="Notifications"
  className="w-9 h-9 object-contain"
/>


        
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-72 max-w-[calc(100vw-32px)] bg-surface border border-line rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex justify-between items-center px-3.5 py-2.5 border-b border-line text-ink">
            <strong className="text-xs font-semibold">Notifications</strong>
            {unread > 0 && (
              <button className="text-[11px] text-primary font-medium hover:underline cursor-pointer" onClick={() => dispatch({ type: 'readAll' })}>
                Mark all read
              </button>
            )}
          </div>
          <ul className="max-h-72 overflow-y-auto divide-y divide-line">
            {state.notifications.map((n) => (
              <li key={n.id} className={`flex flex-col gap-0.5 p-3 text-xs transition-colors ${n.read ? 'text-muted' : 'bg-primary-soft/40 font-medium text-ink'}`}>
                <span className="leading-snug">{n.text}</span>
                <small className="text-[10px] text-muted-2">{n.time}</small>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function Header({ title, onMenu }) {
  const { state, query, setQuery, theme, toggleTheme } = useStore();
  const [text, setText] = useState(query);
  const [mobileSearch, setMobileSearch] = useState(false);
  useEffect(() => setText(query), [query]);

  const submit = (e) => {
    e.preventDefault();
    setQuery(text.trim());
    go('transactions');
    setMobileSearch(false);
  };

  return (
    <header className="sticky top-0 z-30 flex flex-col justify-center px-4 md:px-6 bg-surface/85 backdrop-blur-md border-b border-line transition-colors min-h-[56px]">
      <div className="flex items-center gap-3 md:gap-5 py-2">
        <button className="md:hidden grid place-items-center w-8 h-8 rounded-lg text-ink hover:bg-bg transition-colors cursor-pointer" onClick={onMenu} aria-label="Open menu">
          <Icon name="menu" size={20} />
        </button>
        <h1 className="text-base md:text-lg font-bold text-ink whitespace-nowrap tracking-tight">{title}</h1>
        <div className="ml-auto flex items-center gap-1.5 md:gap-3">
          <form className="hidden md:flex items-center gap-2.5 w-44 lg:w-60 h-8.5 px-3 bg-bg rounded-full border border-transparent focus-within:border-primary focus-within:bg-surface focus-within:ring-2 focus-within:ring-primary/20 text-muted text-xs transition-all" onSubmit={submit} role="search">
            <Icon name="search" size={15} />
            <input
              id="search"
              placeholder="Search for something"
              className="w-full bg-transparent border-none outline-none text-text placeholder:text-muted text-xs"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </form>

          {/* Mobile search toggle */}
          <button
            type="button"
            className="md:hidden w-8 h-8 rounded-full grid place-items-center bg-bg text-muted hover:text-primary transition-all active:scale-95 cursor-pointer"
            aria-label="Toggle mobile search"
            onClick={() => setMobileSearch((s) => !s)}
          >
            <Icon name="search" size={16} />
          </button>

          <button
            type="button"
            className="w-8 h-8 md:w-8.5 md:h-8.5 rounded-full grid place-items-center bg-bg text-muted hover:text-accent hover:bg-accent-soft/40 transition-all active:scale-95 cursor-pointer"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            onClick={toggleTheme}
          >
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={17} />
          </button>

          <button className="hidden sm:grid place-items-center w-8 h-8 md:w-8.5 md:h-8.5 rounded-full bg-bg text-muted hover:text-primary hover:bg-primary-soft transition-all active:scale-95 cursor-pointer" aria-label="Settings" onClick={() => go('settings')}>
            <Icon name="settings" size={17} />
          </button>

          <Notifications />

          <button
  type="button"
  className="w-8 h-8 md:w-8.5 md:h-8.5 rounded-full overflow-hidden flex-none bg-surface-2 hover:ring-2 hover:ring-primary/40 transition-all font-semibold text-ink grid place-items-center cursor-pointer shadow-sm"
  aria-label="Edit profile"
  onClick={() => go("settings")}
>
  <img
    src={state.profile.avatar || "/profile.png"}
    alt={state.profile.name || "Profile"}
    className="w-full h-full object-cover"
    onError={(e) => {
      e.currentTarget.onerror = null;
      e.currentTarget.src = "/profile.png";
    }}
  />
</button>
        </div>
      </div>

      {/* Expandable search bar on mobile */}
      {mobileSearch && (
        <form className="md:hidden pb-3 pt-1" onSubmit={submit} role="search">
          <div className="flex items-center gap-3 w-full h-10 px-4 bg-bg rounded-full border border-primary text-muted text-sm">
            <Icon name="search" size={16} />
            <input
              placeholder="Search for something"
              className="w-full bg-transparent border-none outline-none text-text placeholder:text-muted text-sm"
              value={text}
              onChange={(e) => setText(e.target.value)}
              autoFocus
            />
          </div>
        </form>
      )}
    </header>
  );
}
