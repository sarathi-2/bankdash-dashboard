import { useState } from 'react';
import { useMoney, useStore } from '../store.jsx';
import { Page, Panel, Section, StatTile, Modal, Field } from '../components/ui.jsx';

const installment = (l) => Math.round((l.amount * (1 + l.rate / 100)) / l.months);

export default function Loans() {
  const { state, dispatch, showToast } = useStore();
  const money = useMoney();
  const [repay, setRepay] = useState(null);
  const [repayAmt, setRepayAmt] = useState('');
  const [apply, setApply] = useState(null);
  const [form, setForm] = useState({ amount: '', months: '12' });
  const [error, setError] = useState('');

  const totals = state.loans.reduce(
    (t, l) => ({ amount: t.amount + l.amount, left: t.left + l.left, inst: t.inst + (l.left > 0 ? installment(l) : 0) }),
    { amount: 0, left: 0, inst: 0 },
  );

  const openRepay = (l) => { setRepay(l); setRepayAmt(String(Math.min(installment(l), l.left))); setError(''); };
  const submitRepay = (e) => {
    e.preventDefault();
    const n = Number(repayAmt);
    if (!(n > 0)) return setError('Enter an amount greater than 0');
    if (n > repay.left) return setError(`Maximum is ${money(repay.left)}`);
    dispatch({ type: 'repayLoan', id: repay.id, amount: n });
    showToast(n === repay.left ? 'Loan fully repaid' : `Repaid ${money(n)}`);
    setRepay(null);
  };

  const products = [
    { key: 'Personal', icon: 'user', tone: 'teal', amount: 50000, rate: 12 },
    { key: 'Corporate', icon: 'briefcase', tone: 'amber', amount: 100000, rate: 10 },
    { key: 'Business', icon: 'chart', tone: 'rose', amount: 500000, rate: 9 },
    { key: 'Custom', icon: 'service', tone: 'sky', amount: null, rate: 11 },
  ];

  const openApply = (p) => { setApply(p); setForm({ amount: p.amount ? String(p.amount) : '', months: '12' }); setError(''); };
  const submitApply = (e) => {
    e.preventDefault();
    const amount = Number(form.amount);
    if (!(amount >= 1000)) return setError('Minimum loan is 1,000');
    dispatch({ type: 'applyLoan', amount, months: Number(form.months), rate: apply.rate });
    showToast(`${apply.key} loan of ${money(amount)} approved`);
    setApply(null);
  };

  return (
    <Page>
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 md:gap-4">
  {products.map((p, index) => {
    const loanImages = [
      "/image24.png",
      "/image25.png",
      "/image26.png",
      "/image27.png",
    ];

    return (
      <StatTile
        key={p.key}
        image={loanImages[index]}
        tone={p.tone}
        label={`${p.key} Loans`}
        value={p.amount ? money(p.amount) : "Choose Money"}
        onClick={() => openApply(p)}
      />
    );
  })}
</div>

      <Section title="Active Loans Overview">
        <Panel className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs md:text-sm divide-y divide-line">
              <thead className="bg-surface-2 text-muted text-[11px] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-3.5 py-2.5">SL No</th>
                  <th className="px-3.5 py-2.5">Loan Money</th>
                  <th className="px-3.5 py-2.5">Left to repay</th>
                  <th className="px-3.5 py-2.5">Duration</th>
                  <th className="px-3.5 py-2.5">Interest rate</th>
                  <th className="px-3.5 py-2.5">Installment</th>
                  <th className="px-3.5 py-2.5">Repay</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {state.loans.map((l, i) => (
                  <tr key={l.id} className="hover:bg-surface-2/60 transition-colors">
                    <td className="px-3.5 py-2.5 text-muted text-xs">{String(i + 1).padStart(2, '0')}.</td>
                    <td className="px-3.5 py-2.5 font-semibold text-text tabular-nums">{money(l.amount)}</td>
                    <td className="px-3.5 py-2.5 font-semibold text-text tabular-nums">{money(l.left)}</td>
                    <td className="px-3.5 py-2.5 text-muted text-xs">{l.months} Months</td>
                    <td className="px-3.5 py-2.5 text-muted text-xs">{l.rate}%</td>
                    <td className="px-3.5 py-2.5 text-muted text-xs tabular-nums">{l.left > 0 ? `${money(installment(l))} / mo` : '—'}</td>
                    <td className="px-3.5 py-2.5">
                      {l.left > 0 ? (
                        <button className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-field text-ink hover:border-primary hover:text-primary hover:bg-primary-soft text-[11px] font-semibold transition-all cursor-pointer" onClick={() => openRepay(l)}>
                          Repay
                        </button>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-pos-soft text-pos">Paid</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-surface-2/80 font-semibold text-neg border-t border-line text-xs">
                <tr>
                  <td className="px-3.5 py-2.5">Total</td>
                  <td className="px-3.5 py-2.5 tabular-nums">{money(totals.amount)}</td>
                  <td className="px-3.5 py-2.5 tabular-nums">{money(totals.left)}</td>
                  <td className="px-3.5 py-2.5" />
                  <td className="px-3.5 py-2.5" />
                  <td className="px-3.5 py-2.5 tabular-nums">{money(totals.inst)} / mo</td>
                  <td className="px-3.5 py-2.5" />
                </tr>
              </tfoot>
            </table>
          </div>
        </Panel>
      </Section>

      {repay && (
        <Modal title="Repay loan" onClose={() => setRepay(null)}>
          <form className="flex flex-col gap-4" onSubmit={submitRepay} noValidate>
            <p className="text-sm text-muted">Left to repay: <strong className="text-ink">{money(repay.left)}</strong>. Monthly installment: {money(installment(repay))}.</p>
            <Field id="repay-amt" label="Amount" inputMode="decimal" value={repayAmt} error={error}
              onChange={(e) => setRepayAmt(e.target.value.replace(/[^\d.]/g, ''))} autoFocus />
            <div className="flex gap-3 justify-end pt-2 flex-wrap">
              <button type="button" className="px-4 py-2 rounded-xl border border-field text-ink hover:border-primary text-sm font-medium" onClick={() => setRepayAmt(String(repay.left))}>
                Pay full amount
              </button>
              <button type="submit" className="px-6 py-2 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-dark shadow-sm">
                Repay
              </button>
            </div>
          </form>
        </Modal>
      )}

      {apply && (
        <Modal title={`Apply for a ${apply.key} Loan`} onClose={() => setApply(null)}>
          <form className="flex flex-col gap-4" onSubmit={submitApply} noValidate>
            <Field id="loan-amt" label="Loan amount" inputMode="numeric" value={form.amount} error={error}
              onChange={(e) => setForm({ ...form, amount: e.target.value.replace(/\D/g, '') })} autoFocus />
            <Field id="loan-months" label="Duration">
              <select
                id="loan-months"
                value={form.months}
                onChange={(e) => setForm({ ...form, months: e.target.value })}
                className="h-11 md:h-12 px-4 rounded-xl border border-field bg-surface text-text text-sm md:text-base outline-none focus:border-primary"
              >
                {[6, 12, 24, 36, 48, 60].map((m) => <option key={m} value={m}>{m} Months</option>)}
              </select>
            </Field>
            <p className="text-xs text-muted">Interest rate {apply.rate}% · Estimated installment{' '}
              <strong className="text-ink">{money(Math.round((Number(form.amount || 0) * (1 + apply.rate / 100)) / Number(form.months)))}</strong> / month
            </p>
            <button type="submit" className="self-start px-8 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-dark shadow-sm">
              Apply
            </button>
          </form>
        </Modal>
      )}
    </Page>
  );
}
