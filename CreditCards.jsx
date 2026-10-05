import { useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import Icon from '../Icons.jsx';
import { cardExpense } from '../data.js';
import { maskCard, useMoney, useStore } from '../store.jsx';
import { Page, Panel, Section, CreditCard, IconBadge, Modal, Field } from '../components/ui.jsx';
import { useChartTheme } from '../useChartTheme.js';
import { useBreakpoint, pick } from '../useBreakpoint.js';

const variants = ['primary', 'light', 'dark'];
const rowColors = ['teal', 'rose', 'amber', 'sky'];
const emptyForm = { type: 'Classic', holder: '', number: '', validThru: '', bank: 'DBL Bank' };

export default function CreditCards() {
  const { state, dispatch, showToast } = useStore();
  const money = useMoney();
  const bp = useBreakpoint();
  const { tooltipProps, chart } = useChartTheme();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [detail, setDetail] = useState(null);
  const [pinFor, setPinFor] = useState(null);
  const [pin, setPin] = useState('');
  const [selectedId, setSelectedId] = useState(state.cards[0]?.id);
  const selected = state.cards.find((c) => c.id === selectedId) || state.cards[0];

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const addCard = (e) => {
    e.preventDefault();
    const digits = form.number.replace(/\D/g, '');
    const err = {};
    if (!form.holder.trim()) err.holder = 'Enter the name on the card';
    if (digits.length !== 16) err.number = 'Card number must be 16 digits';
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.validThru)) err.validThru = 'Use MM/YY, e.g. 08/28';
    setErrors(err);
    if (Object.keys(err).length) return;
    dispatch({
      type: 'addCard',
      card: {
        variant: variants[state.cards.length % variants.length],
        bank: form.bank, type: form.type, holder: form.holder.trim(),
        number: digits.replace(/(\d{4})(?=\d)/g, '$1 '), validThru: form.validThru,
      },
    });
    showToast('Card added');
    setForm(emptyForm);
  };

  const formatNumber = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
  const formatExpiry = (v) => {
    const d = v.replace(/\D/g, '').slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  const settingAction = (key) => {
    if (!selected) return showToast('Add a card first', 'err');
    const last4 = selected.number.slice(-4);
    if (key === 'block') {
      dispatch({ type: 'toggleBlock', id: selected.id });
      showToast(selected.blocked ? `Card ${last4} unblocked` : `Card ${last4} blocked`);
    } else if (key === 'pin') {
      setPin(''); setPinFor(selected);
    } else {
      showToast(`Card ${last4} added to ${key}`);
    }
  };

  const savePin = (e) => {
    e.preventDefault();
    if (!/^\d{4}$/.test(pin)) return showToast('PIN must be 4 digits', 'err');
    showToast(`PIN changed for card ${pinFor.number.slice(-4)}`);
    setPinFor(null);
  };

  const settings = [
    { key: 'block', icon: 'lock', tone: 'amber', title: selected?.blocked ? 'Unblock Card' : 'Block Card', sub: 'Instantly block your card' },
    { key: 'pin', icon: 'key', tone: 'teal', title: 'Change Pin Code', sub: 'Choose another pin code' },
    { key: 'Google Pay', icon: 'google', tone: 'rose', title: 'Add to Google Pay', sub: 'Withdraw without any card' },
    { key: 'Apple Pay', icon: 'apple', tone: 'sky', title: 'Add to Apple Pay', sub: 'Withdraw without any card' },
    { key: 'Apple Store', icon: 'apple', tone: 'sky', title: 'Add to Apple Store', sub: 'Withdraw without any card' },
  ];

  return (
    <Page>
      <Section title="My Cards">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 md:gap-4 w-full">
          {state.cards.map((c) => (
            <div
              key={c.id}
              className={`w-full rounded-2xl transition-all ${c.id === selected?.id ? 'ring-2 ring-primary ring-offset-2' : ''}`}
            >
              <CreditCard card={c} className="h-full" onClick={() => setSelectedId(c.id)} />
            </div>
          ))}
        </div>
      </Section>

 <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-4 md:gap-5 items-stretch">

 {/* ===================================================
    CARD EXPENSE STATISTICS
=================================================== */}

<Section
  title="Card Expense Statistics"
  className="h-full flex flex-col"
>
  <Panel className="p-3.5 md:p-4 flex-1 flex flex-col h-full">

    {/* =================================================
        EXPENSE COLORS
    ================================================= */}
    {(() => {
      const expenseColors = [
        "#771706",
        "#67f13d",
        "#f5204e",
        "#1cd8e6",
      ];

      return (
        <>
          {/* =================================================
              HEADER
          ================================================= */}
          <div className="flex items-center justify-between mb-1">

            <div>
              <p className="text-sm font-semibold text-text">
                Expense Overview
              </p>

              <p className="text-[10px] text-muted mt-0.5">
                Your card spending breakdown
              </p>
            </div>

            <span
              className="
                px-2.5 py-1
                rounded-full
                text-[10px]
                font-semibold
                bg-[#1cd8e6]/10
                text-[#1cd8e6]
              "
            >
              Monthly
            </span>

          </div>

          {/* =================================================
              DONUT CHART
          ================================================= */}
          <div className="relative flex-1 min-h-[190px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>

                <Pie
                  data={cardExpense}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius="55%"
                  outerRadius="78%"
                  paddingAngle={4}
                  cornerRadius={7}
                  stroke="none"
                >

                  {cardExpense.map((entry, idx) => (
                    <Cell
                      key={entry.name}
                      fill={
                        expenseColors[
                          idx % expenseColors.length
                        ]
                      }
                    />
                  ))}

                </Pie>

                <Tooltip
                  {...tooltipProps}
                  formatter={(value) => `${value}%`}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid var(--line)",
                    background: "var(--surface)",
                    fontSize: "11px",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                  }}
                />

              </PieChart>
            </ResponsiveContainer>

            {/* =================================================
                CENTER CONTENT
            ================================================= */}
            <div
              className="
                absolute
                inset-0
                flex
                flex-col
                items-center
                justify-center
                pointer-events-none
              "
            >

              <span className="text-[10px] text-muted">
                Total Expense
              </span>

              <span className="text-2xl md:text-3xl font-bold text-text leading-tight">
                100%
              </span>

              <span
                className="
                  text-[9px]
                  font-semibold
                  mt-0.5
                  text-[#67f13d]
                "
              >
                This Month
              </span>

            </div>

          </div>

          {/* =================================================
              EXPENSE CATEGORY CARDS
          ================================================= */}
          <div className="grid grid-cols-2 gap-2 mt-2">

            {cardExpense.map((item, idx) => {

              const color =
                expenseColors[
                  idx % expenseColors.length
                ];

              return (
                <div
                  key={item.name}
                  className="
                    flex
                    items-center
                    gap-2
                    px-2.5
                    py-2
                    rounded-xl
                    bg-surface-2
                    border
                    border-transparent
                    hover:border-line
                    transition-all
                  "
                >

                  {/* COLOR DOT */}
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-none"
                    style={{
                      backgroundColor: color,
                      boxShadow: `0 0 8px ${color}55`,
                    }}
                  />

                  {/* DETAILS */}
                  <div className="min-w-0 flex-1">

                    <p className="text-[10px] text-muted truncate">
                      {item.name}
                    </p>

                    <p
                      className="text-xs font-bold"
                      style={{ color }}
                    >
                      {item.value}%
                    </p>

                  </div>

                </div>
              );
            })}

          </div>

        </>
      );
    })()}

  </Panel>
</Section>
<Section
  title="Card List"
  className="h-full flex flex-col"
>
  <Panel
    className="p-0 overflow-hidden flex-1 flex flex-col justify-around divide-y divide-line h-full"
  >
    {state.cards.map((c, i) => {
      const tone =
        rowColors[i % rowColors.length];

      return (
        <div
          key={c.id}
          className="p-3 md:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface-2/60 transition-colors"
        >
          {/* CARD ICON + BANK */}
          <div className="flex items-center gap-3">

            {/* image23.png */}
            <div
              className={`flex-none w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center ${tone.bg}`}
            >
              <img
                src="/image23.png"
                alt="Card"
                className="w-full h-full object-contain"
              />
            </div>

            {/* BANK + TYPE */}
            <div>
              <div className="text-xs md:text-sm font-semibold text-text">
                {c.bank}
              </div>

              <div className="text-[10px] md:text-xs text-muted">
                {c.type}
              </div>
            </div>
          </div>

          {/* CARD NUMBER */}
          <div className="hidden sm:block">
            <div className="text-[10px] text-muted uppercase">
              Number
            </div>

            <div className="text-xs md:text-sm font-medium text-text tabular-nums">
              **** **** {c.number.slice(-4)}
            </div>
          </div>

          {/* HOLDER */}
          <div className="hidden md:block">
            <div className="text-[10px] text-muted uppercase">
              Holder
            </div>

            <div className="text-xs md:text-sm font-medium text-text">
              {c.holder}
            </div>
          </div>

          {/* VIEW DETAILS */}
          <button
            type="button"
            className="text-xs md:text-sm font-semibold text-primary hover:underline self-end sm:self-center cursor-pointer"
            onClick={() => setDetail(c)}
          >
            View Details
          </button>
        </div>
      );
    })}
  </Panel>
</Section>
</div>

     
        <Section title="Add New Card" className="h-full flex flex-col">
          <Panel className="flex flex-col justify-between gap-3 p-3.5 md:p-4 flex-1 h-full">
            <p className="text-xs text-muted leading-relaxed">
              Credit Card generally means a payment card with an approved limit issued by Scheduled Commercial Banks to purchase goods or withdraw cash.
            </p>
            <form onSubmit={addCard} noValidate className="flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field id="card-type" label="Card Type">
                  <select
                    id="card-type"
                    value={form.type}
                    onChange={set('type')}
                    className="h-9 md:h-10 px-3 rounded-xl border border-field bg-surface text-text text-xs md:text-sm outline-none focus:border-primary"
                  >
                    <option>Classic</option><option>Primary</option><option>Secondary</option><option>Platinum</option>
                  </select>
                </Field>
                <Field id="card-holder" label="Name On Card" placeholder="My Cards" value={form.holder} onChange={set('holder')} error={errors.holder} />
                <Field id="card-number" label="Card Number" placeholder="**** **** **** ****" inputMode="numeric" value={form.number}
                  onChange={(e) => setForm({ ...form, number: formatNumber(e.target.value) })} error={errors.number} />
                <Field id="card-exp" label="Expiration Date" placeholder="MM/YY" inputMode="numeric" value={form.validThru}
                  onChange={(e) => setForm({ ...form, validThru: formatExpiry(e.target.value) })} error={errors.validThru} />
                <Field id="card-bank" label="Bank">
                  <select
                    id="card-bank"
                    value={form.bank}
                    onChange={set('bank')}
                    className="h-9 md:h-10 px-3 rounded-xl border border-field bg-surface text-text text-xs md:text-sm outline-none focus:border-primary"
                  >
                    <option>DBL Bank</option><option>BRC Bank</option><option>ABM Bank</option><option>MCP Bank</option>
                  </select>
                </Field>
              </div>
              <button type="submit" className="self-start inline-flex items-center justify-center px-6 py-2 rounded-xl bg-primary text-white text-xs md:text-sm font-semibold shadow-sm hover:bg-primary-dark transition-all active:scale-95 cursor-pointer">
                Add Card
              </button>
            </form>
          </Panel>
        </Section>

       {/* ===================================================
    CARD SETTING
=================================================== */}

<Section
  title="Card Setting"
  className="h-full flex flex-col"
>
  <Panel className="flex flex-col justify-between gap-1.5 p-3.5 md:p-4 flex-1 h-full">

    {selected && (
      <p className="text-[11px] text-muted mb-1">
        Applies to card ending{" "}
        <strong className="text-ink font-semibold">
          {selected.number.slice(-4)}
        </strong>
      </p>
    )}

    <div className="flex-1 flex flex-col justify-between divide-y divide-line">

      {/* BLOCK CARD */}
      <button
        type="button"
        className="flex items-center gap-3 py-2 px-1.5 rounded-lg hover:bg-surface-2 transition-all text-left w-full group cursor-pointer"
        onClick={() => settingAction("block")}
      >
        <div className="flex-none w-[34px] h-[34px] rounded-xl overflow-hidden flex items-center justify-center">
          <img
            src="/image18.png"
            alt="Block Card"
            className="w-full h-full object-contain"
          />
        </div>

        <div className="min-w-0">
          <div className="text-xs md:text-sm font-semibold text-text group-hover:text-primary transition-colors">
            {selected?.blocked
              ? "Unblock Card"
              : "Block Card"}
          </div>

          <div className="text-[10px] md:text-xs text-muted truncate">
            Instantly block your card
          </div>
        </div>
      </button>

      {/* CHANGE PIN */}
      <button
        type="button"
        className="flex items-center gap-3 py-2 px-1.5 rounded-lg hover:bg-surface-2 transition-all text-left w-full group cursor-pointer"
        onClick={() => settingAction("pin")}
      >
        <div className="flex-none w-[34px] h-[34px] rounded-xl overflow-hidden flex items-center justify-center">
          <img
            src="/image19.png"
            alt="Change PIN"
            className="w-full h-full object-contain"
          />
        </div>

        <div className="min-w-0">
          <div className="text-xs md:text-sm font-semibold text-text group-hover:text-primary transition-colors">
            Change Pin Code
          </div>

          <div className="text-[10px] md:text-xs text-muted truncate">
            Choose another pin code
          </div>
        </div>
      </button>

      {/* GOOGLE PAY */}
      <button
        type="button"
        className="flex items-center gap-3 py-2 px-1.5 rounded-lg hover:bg-surface-2 transition-all text-left w-full group cursor-pointer"
        onClick={() => settingAction("Google Pay")}
      >
        <div className="flex-none w-[34px] h-[34px] rounded-xl overflow-hidden flex items-center justify-center">
          <img
            src="/image20.png"
            alt="Google Pay"
            className="w-full h-full object-contain"
          />
        </div>

        <div className="min-w-0">
          <div className="text-xs md:text-sm font-semibold text-text group-hover:text-primary transition-colors">
            Add to Google Pay
          </div>

          <div className="text-[10px] md:text-xs text-muted truncate">
            Withdraw without any card
          </div>
        </div>
      </button>

      {/* APPLE PAY */}
      <button
        type="button"
        className="flex items-center gap-3 py-2 px-1.5 rounded-lg hover:bg-surface-2 transition-all text-left w-full group cursor-pointer"
        onClick={() => settingAction("Apple Pay")}
      >
        <div className="flex-none w-[34px] h-[34px] rounded-xl overflow-hidden flex items-center justify-center">
          <img
            src="/image21.png"
            alt="Apple Pay"
            className="w-full h-full object-contain"
          />
        </div>

        <div className="min-w-0">
          <div className="text-xs md:text-sm font-semibold text-text group-hover:text-primary transition-colors">
            Add to Apple Pay
          </div>

          <div className="text-[10px] md:text-xs text-muted truncate">
            Withdraw without any card
          </div>
        </div>
      </button>

      {/* APPLE STORE */}
      <button
        type="button"
        className="flex items-center gap-3 py-2 px-1.5 rounded-lg hover:bg-surface-2 transition-all text-left w-full group cursor-pointer"
        onClick={() => settingAction("Apple Store")}
      >
        <div className="flex-none w-[34px] h-[34px] rounded-xl overflow-hidden flex items-center justify-center">
          <img
            src="/image22.png"
            alt="Apple Store"
            className="w-full h-full object-contain"
          />
        </div>

        <div className="min-w-0">
          <div className="text-xs md:text-sm font-semibold text-text group-hover:text-primary transition-colors">
            Add to Apple Store
          </div>

          <div className="text-[10px] md:text-xs text-muted truncate">
            Withdraw without any card
          </div>
        </div>
      </button>

    </div>
  </Panel>
</Section>

      {detail && (
        <Modal
          title="Card Details"
          onClose={() => setDetail(null)}
          footer={(
            <>
              <button
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-neg text-neg hover:bg-neg-soft text-sm font-medium transition-colors"
                onClick={() => {
                  dispatch({ type: 'removeCard', id: detail.id }); showToast('Card removed'); setDetail(null);
                }}
              >
                <Icon name="trash" size={16} /> Remove
              </button>
              <button
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark shadow-sm transition-all"
                onClick={() => {
                  dispatch({ type: 'toggleBlock', id: detail.id });
                  showToast(detail.blocked ? 'Card unblocked' : 'Card blocked'); setDetail(null);
                }}
              >
                {state.cards.find((c) => c.id === detail.id)?.blocked ? 'Unblock Card' : 'Block Card'}
              </button>
            </>
          )}
        >
          <dl className="flex flex-col divide-y divide-line text-sm">
            <div className="flex justify-between py-2.5"><dt className="text-muted">Bank</dt><dd className="font-semibold text-ink">{detail.bank}</dd></div>
            <div className="flex justify-between py-2.5"><dt className="text-muted">Card Type</dt><dd className="font-semibold text-ink">{detail.type}</dd></div>
            <div className="flex justify-between py-2.5"><dt className="text-muted">Card Number</dt><dd className="font-semibold text-ink">{maskCard(detail.number)}</dd></div>
            <div className="flex justify-between py-2.5"><dt className="text-muted">Name on Card</dt><dd className="font-semibold text-ink">{detail.holder}</dd></div>
            <div className="flex justify-between py-2.5"><dt className="text-muted">Valid Thru</dt><dd className="font-semibold text-ink">{detail.validThru}</dd></div>
            <div className="flex justify-between py-2.5"><dt className="text-muted">Balance</dt><dd className="font-semibold text-ink">{money(detail.balance)}</dd></div>
            <div className="flex justify-between py-2.5"><dt className="text-muted">Status</dt><dd>{detail.blocked ? <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-neg-soft text-neg">Blocked</span> : <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-pos-soft text-pos">Active</span>}</dd></div>
          </dl>
        </Modal>
      )}

      {pinFor && (
        <Modal title={`Change PIN · card ${pinFor.number.slice(-4)}`} onClose={() => setPinFor(null)}>
          <form className="flex flex-col gap-4" onSubmit={savePin}>
            <Field id="new-pin" label="New 4-digit PIN" type="password" inputMode="numeric" maxLength={4} value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))} autoFocus />
            <button type="submit" className="inline-flex justify-center px-6 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition-all">
              Save PIN
            </button>
          </form>
        </Modal>
      )}
    </Page>
  );
}
