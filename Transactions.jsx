import { useEffect, useMemo, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell } from 'recharts';
import Icon from '../Icons.jsx';
import { monthlyExpense } from '../data.js';
import { formatDate, maskCard, useMoney, useStore } from '../store.jsx';
import { Page, Panel, Section, CreditCard, Tabs, Pagination, Modal, Empty, go } from '../components/ui.jsx';
import { useChartTheme } from '../useChartTheme.js';
import { useBreakpoint, pick } from '../useBreakpoint.js';

const PER_PAGE = 5;

export default function Transactions() {
  const { state, query, setQuery } = useStore();
  const money = useMoney();
  const { colors, chart, tooltipProps, axisTick } = useChartTheme();
  const [tab, setTab] = useState('all');
  const [page, setPage] = useState(1);
  const [active, setActive] = useState(monthlyExpense.length - 1);
  const [receipt, setReceipt] = useState(null);
  const bp = useBreakpoint();

  const rows = useMemo(() => {
    const q = query.toLowerCase();
    return state.transactions.filter((t) => {
      if (tab === 'income' && t.amount < 0) return false;
      if (tab === 'expense' && t.amount > 0) return false;
      if (!q) return true;
      return [t.desc, t.txId, t.type].some((v) => v.toLowerCase().includes(q));
    });
  }, [state.transactions, tab, query]);

  const pages = Math.max(1, Math.ceil(rows.length / PER_PAGE));
  useEffect(() => setPage(1), [tab, query]);
  const shown = rows.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const cardOf = (id) => state.cards.find((c) => c.id === id);

  return (
    <Page>
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 md:gap-5 items-stretch">
        <Section title="My Cards" className="h-full flex flex-col" action={<button className="text-xs md:text-sm font-semibold text-primary hover:underline cursor-pointer" onClick={() => go('cards')}>+ Add Card</button>}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 h-full">
            {state.cards.slice(0, 2).map((c) => <CreditCard key={c.id} card={c} className="h-full" />)}
          </div>
        </Section>

        <Section title="My Expense" className="h-full flex flex-col">
          <Panel className="p-3 md:p-3.5 flex-1 flex flex-col justify-center h-full">
            <ResponsiveContainer width="100%" height={pick(bp, 155, 140, 150)}>
              <BarChart data={monthlyExpense} margin={{ top: 16, right: 10, left: 10, bottom: 0 }}>
                <XAxis dataKey="month" tick={axisTick} axisLine={false} tickLine={false} />
                <Tooltip {...tooltipProps} cursor={false} formatter={(v) => money(v)} />
                <Bar
                  dataKey="value" name="Expense" radius={6} maxBarSize={36} isAnimationActive={false}
                  onMouseEnter={(_, i) => setActive(i)}
                  label={({ x, y, width, index, value }) => index === active
                    ? <text x={x + width / 2} y={y - 6} textAnchor="middle" fontSize={11} fontWeight={600} fill={colors.ink}>{money(value)}</text>
                    : null}
                >
                  {monthlyExpense.map((m, i) => <Cell key={m.month} fill={i === active ? chart.primary : chart.muted} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Panel>
        </Section>
      </div>

      <Section
        title="Recent Transactions"
        action={query && (
          <button className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-soft text-primary text-[11px] font-semibold cursor-pointer" onClick={() => setQuery('')}>
            Search: “{query}” <Icon name="close" size={12} />
          </button>
        )}
      >
        <Tabs
          value={tab} onChange={setTab}
          tabs={[{ key: 'all', label: 'All Transactions' }, { key: 'income', label: 'Income' }, { key: 'expense', label: 'Expense' }]}
        />
        <Panel className="p-0 overflow-hidden">
          {shown.length === 0 ? <Empty>No transactions match this filter.</Empty> : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs md:text-sm divide-y divide-line">
                <thead className="bg-surface-2 text-muted text-[11px] uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-3.5 py-2.5">Description</th>
                    <th className="px-3.5 py-2.5">Transaction ID</th>
                    <th className="px-3.5 py-2.5">Type</th>
                    <th className="px-3.5 py-2.5">Card</th>
                    <th className="px-3.5 py-2.5">Date</th>
                    <th className="px-3.5 py-2.5">Amount</th>
                    <th className="px-3.5 py-2.5">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {shown.map((t) => (
                    <tr key={t.id} className="hover:bg-surface-2/60 transition-colors">
                      <td className="px-3.5 py-2.5 whitespace-nowrap">
                        <span className="inline-flex items-center gap-2.5">
                          <span className={`w-7 h-7 rounded-full grid place-items-center flex-none ${t.amount < 0 ? 'bg-neg-soft text-neg' : 'bg-pos-soft text-pos'}`}>
                            <Icon name={t.amount < 0 ? 'arrowUp' : 'arrowDown'} size={14} />
                          </span>
                          <span className="font-semibold text-ink">{t.desc}</span>
                        </span>
                      </td>
                      <td className="px-3.5 py-2.5 whitespace-nowrap text-muted text-xs">{t.txId}</td>
                      <td className="px-3.5 py-2.5 whitespace-nowrap text-muted text-xs">{t.type}</td>
                      <td className="px-3.5 py-2.5 whitespace-nowrap text-muted text-xs">{cardOf(t.cardId) ? `${cardOf(t.cardId).number.slice(0, 4)} ****` : '—'}</td>
                      <td className="px-3.5 py-2.5 whitespace-nowrap text-muted text-xs">{formatDate(t.date)}</td>
                      <td className={`px-3.5 py-2.5 whitespace-nowrap tabular-nums font-semibold ${t.amount < 0 ? 'text-neg' : 'text-pos'}`}>{money(t.amount, { sign: true })}</td>
                      <td className="px-3.5 py-2.5 whitespace-nowrap">
                        <button className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-field text-ink hover:border-primary hover:text-primary hover:bg-primary-soft text-[11px] font-medium transition-all cursor-pointer" onClick={() => setReceipt(t)}>
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
        <Pagination page={page} pages={pages} onChange={setPage} />
      </Section>

      {receipt && (
        <Modal
          title="Receipt"
          onClose={() => setReceipt(null)}
          footer={<button className="inline-flex justify-center px-6 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition-all" onClick={() => setReceipt(null)}>Done</button>}
        >
          <dl className="flex flex-col divide-y divide-line text-sm">
            <div className="flex justify-between py-2.5"><dt className="text-muted">Description</dt><dd className="font-semibold text-ink">{receipt.desc}</dd></div>
            <div className="flex justify-between py-2.5"><dt className="text-muted">Transaction ID</dt><dd className="font-semibold text-ink">{receipt.txId}</dd></div>
            <div className="flex justify-between py-2.5"><dt className="text-muted">Type</dt><dd className="font-semibold text-ink">{receipt.type}</dd></div>
            <div className="flex justify-between py-2.5"><dt className="text-muted">Card</dt><dd className="font-semibold text-ink">{cardOf(receipt.cardId) ? maskCard(cardOf(receipt.cardId).number) : '—'}</dd></div>
            <div className="flex justify-between py-2.5"><dt className="text-muted">Date</dt><dd className="font-semibold text-ink">{formatDate(receipt.date)}</dd></div>
            <div className="flex justify-between py-2.5"><dt className="text-muted">Amount</dt><dd className={`font-semibold tabular-nums ${receipt.amount < 0 ? 'text-neg' : 'text-pos'}`}>{money(receipt.amount, { sign: true })}</dd></div>
            <div className="flex justify-between py-2.5"><dt className="text-muted">Status</dt><dd><span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-pos-soft text-pos">Completed</span></dd></div>
          </dl>
        </Modal>
      )}
    </Page>
  );
}
