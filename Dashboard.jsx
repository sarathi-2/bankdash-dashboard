import { useState } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, AreaChart,  Area,
} from 'recharts';
import Icon from '../Icons.jsx';
import { weeklyActivity, expenses, contacts, balanceHistory } from '../data.js';
import { formatDate, useMoney, useStore } from '../store.jsx';
import { Section, CreditCard, IconBadge, Panel, go } from '../components/ui.jsx';
import { initials, txStyle } from '../utils.js';
import { colors } from '../theme.js';
import { useChartTheme } from '../useChartTheme.js';
import { useBreakpoint, pick } from '../useBreakpoint.js';
export function TxList({ items }) {
  const money = useMoney();
  const bp = useBreakpoint();

  const transactionImages = [
    "/shopping.png",
    "/transfer.png",
    "/service.png",
  ];

  const transactionTones = [
    "amber",
    "sky",
    "teal",
  ];

  return (
    <Panel className="flex flex-col justify-around gap-1 flex-1 h-full p-3 md:p-3.5">
      {items.map((t, index) => {
        const image = transactionImages[index % transactionImages.length];
        const tone = transactionTones[index % transactionTones.length];

        return (
          <li
            key={t.id}
            className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-surface-2 transition-all list-none"
          >
            {/* Different image for each row */}
            <IconBadge
              image={image}
              tone={tone}
              size={34}
            />

            <div className="flex-1 min-w-0">
              <div className="text-xs md:text-sm font-semibold text-text truncate">
                {t.desc}
              </div>

              <div className="text-[10px] md:text-xs text-muted mt-0.5">
                {formatDate(
                  t.date,
                  bp === "tab" ? "medium" : "long"
                )}
              </div>
            </div>

            <span
              className={`text-xs md:text-sm font-semibold tabular-nums whitespace-nowrap ${
                t.amount < 0 ? "text-neg" : "text-pos"
              }`}
            >
              {money(t.amount, { sign: true })}
            </span>
          </li>
        );
      })}
    </Panel>
  );
}
// =========================================================
// EXPENSE STATISTICS
// =========================================================

const expenseData = [
  {
    name: "Entertainment",
    value: 30,
    color: "#1cd8e6",
  },
  {
    name: "Bill Expense",
    value: 15,
    color: "#67f13d",
  },
  {
    name: "Others",
    value: 35,
    color: "#f5204e",
  },
  {
    name: "Investment",
    value: 20,
    color: "#771706",
  },
];

function ExpensePie() {
  const cx = 150;
  const cy = 145;
  const r = 112;

  const gap = 7;
const slices = [
  {
    start: 310,
    end: 400,
    color: "#1cd8e6",
    percent: "30%",
    label: "Entertainment",
    offset: { x: 0, y: -5 },
     sliceOffset: 10,   
    radius: 112,
  },
  {
    start: 400,
    end: 445,
    color: "#67f13d",
    percent: "15%",
    label: "Bill Expense",
    offset: { x: 6, y: -2 },
    radius: 112,
  },
  {
    start: 85,
    end: 175,
    color: "#f5204e",
    percent: "35%",
    label: "Others",
    offset: { x: 5, y: 6 },
    sliceOffset: 7,
    radius: 112,
  },
  {
    start: 175,
    end: 310,
    color: "#771706",
    percent: "20%",
    label: "Investment",
    offset: { x: -5, y: 4 },
    sliceOffset: 7, 
    radius: 112,
  },
];

  const polar = (angle, radius = r) => {
    const rad = (angle - 90) * (Math.PI / 180);

    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad),
    };
  };

  const makePath = (startAngle, endAngle, offset) => {
    const midAngle = (startAngle + endAngle) / 2;
    const rad = (midAngle - 90) * (Math.PI / 180);

    const ox = Math.cos(rad) * offset;
    const oy = Math.sin(rad) * offset;

    const start = polar(startAngle);
    const end = polar(endAngle);

    const x1 = start.x + ox;
    const y1 = start.y + oy;

    const x2 = end.x + ox;
    const y2 = end.y + oy;

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return `
      M ${cx + ox} ${cy + oy}
      L ${x1} ${y1}
      A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}
      Z
    `;
  };

  return (
    <svg
      viewBox="0 0 300 290"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
    >
      {slices.map((slice, index) => {
        const mid =
          (slice.start + slice.end) / 2;

        const rad =
          (mid - 90) * (Math.PI / 180);

        const distance = gap;

        const ox =
          Math.cos(rad) * distance;

        const oy =
          Math.sin(rad) * distance;

        /*
          Label position
        */
        const labelRadius = 66;

        const labelX =
          cx +
          Math.cos(rad) * labelRadius +
          slice.offset.x;

        const labelY =
          cy +
          Math.sin(rad) * labelRadius +
          slice.offset.y;

        return (
          <g key={slice.label}>
            <path
              d={makePath(
                slice.start,
                slice.end,
                gap
              )}
              fill={slice.color}
              stroke="#ffffff"
              strokeWidth="4"
              strokeLinejoin="round"
            />

            <text
              x={labelX}
              y={labelY - 2}
              textAnchor="middle"
              fill="#ffffff"
              fontSize="16"
              fontWeight="700"
            >
              {slice.percent}
            </text>

            <text
              x={labelX}
              y={labelY + 16}
              textAnchor="middle"
              fill="#ffffff"
              fontSize="11"
              fontWeight="600"
            >
              {slice.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function QuickTransfer() {
  const { dispatch, showToast } = useStore();
  const [selected, setSelected] = useState(1);
  const [start, setStart] = useState(0);
  const [amount, setAmount] = useState('525.50');
  const visible = contacts.slice(start, start + 3);
  const person = contacts.find((c) => c.id === selected);

  const send = (e) => {
    e.preventDefault();
    const n = Number(amount);
    if (!n || n <= 0) return showToast('Enter an amount greater than 0', 'err');
    dispatch({ type: 'sendMoney', to: person.name, amount: n });
    showToast(`Sent $${n.toLocaleString()} to ${person.name}`);
  };

  return (
    <Section title="Quick Transfer" className="lg:col-span-1 h-full flex flex-col">
      <Panel className="flex flex-col justify-between gap-3 flex-1 h-full p-3.5 md:p-4">
        <form onSubmit={send} className="flex flex-col justify-between gap-3 flex-1">
          <div className="flex items-center justify-between gap-2">
            {visible.map((c) => (
              <button
                type="button"
                key={c.id}
                className={`flex-1 flex flex-col items-center gap-1 p-1 rounded-xl transition-all hover:bg-surface-2 hover:-translate-y-0.5 cursor-pointer ${selected === c.id ? 'ring-2 ring-primary bg-surface-2' : ''}`}
                onClick={() => setSelected(c.id)}
                aria-pressed={selected === c.id}
              >
                <span className="w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden flex-none text-[11px] font-semibold text-ink grid place-items-center shadow-xs" style={{ background: c.color }}>
                  {c.avatar ? <img src={c.avatar} alt={c.name} className="w-full h-full object-cover" /> : initials(c.name)}
                </span>
                <span className="text-[11px] font-medium text-text text-center line-clamp-1">{c.name}</span>
                <span className="text-[9px] text-muted">{c.role}</span>
              </button>
            ))}
            <button
              type="button"
              className="w-7 h-7 md:w-8 md:h-8 rounded-full grid place-items-center bg-surface border border-line shadow-xs text-primary hover:bg-primary-soft transition-all active:scale-95 flex-none cursor-pointer"
              aria-label="More contacts"
              onClick={() => setStart((s) => (s + 3 >= contacts.length ? 0 : s + 1))}
            >
              <Icon name="chevron" size={13} />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-1">
            <label htmlFor="amount" className="text-xs font-medium text-muted whitespace-nowrap">Write Amount</label>
            <div className="flex-1 flex items-center bg-bg rounded-full border border-transparent focus-within:border-primary focus-within:bg-surface pl-3 pr-1 py-0.5 transition-all">
              <input
                id="amount"
                inputMode="decimal"
                className="w-full bg-transparent border-none outline-none text-text text-xs md:text-sm tabular-nums"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ''))}
              />
              <button type="submit" className="flex items-center gap-1 h-7 px-3.5 rounded-full bg-primary text-white text-xs font-semibold shadow-xs hover:bg-primary-dark transition-all active:scale-95 flex-none cursor-pointer">
                Send <Icon name="send" size={13} />
              </button>
            </div>
          </div>
        </form>
      </Panel>
    </Section>
  );
}

export default function Dashboard() {
  const { state } = useStore();
  const bp = useBreakpoint();
  const money = useMoney();
  const { isDark, colors, chart, tooltipProps, axisTick } = useChartTheme();

  return (
    <main className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5 p-3 md:p-4 items-stretch animate-in fade-in duration-300">
      <Section
        title="My Cards"
        className="lg:col-span-2 h-full flex flex-col"
        action={<button className="text-xs md:text-sm  font-semibold text-primary hover:underline cursor-pointer" onClick={() => go('cards')}>See All</button>}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2  gap-4 flex-1 h-full">
          {state.cards.slice(0, 2).map((c) => <CreditCard key={c.id} card={c} className="h-full"  onClick={() => go('cards')} />)}
        </div>
      </Section>

      <Section
        title="Recent Transaction"
        className="lg:col-span-1 h-full flex flex-col"
        action={<button className="text-xs md:text-sm font-semibold text-primary hover:underline cursor-pointer" onClick={() => go('transactions')}>See All</button>}
      >
        <TxList items={state.transactions.slice(0, 3)} />
      </Section>

   <Section title="Weekly Activity" className="lg:col-span-2 h-full flex flex-col">
  <Panel className="p-3 md:p-3.5 flex-1 flex flex-col justify-center h-full">
    <ResponsiveContainer width="100%" height={250}>
    
      <BarChart
        data={weeklyActivity}
        barGap={pick(bp, 8, 5, 4)}
        margin={{ top: 6, right: 8, left: -16, bottom: 0 }}
      >
        <CartesianGrid
          vertical={false}
          stroke={chart.grid}
        />

        <XAxis
          dataKey="day"
          tick={axisTick}
          axisLine={false}
          tickLine={false}
        />

        <YAxis
          tick={axisTick}
          axisLine={false}
          tickLine={false}
          ticks={[0, 100, 200, 300, 400, 500]}
          domain={[0, 500]}
          interval={0}
        />

        <Tooltip
          {...tooltipProps}
          cursor={{ fill: chart.cursor }}
          formatter={(v) => money(v)}
        />

        <Legend
          verticalAlign="top"
          align="right"
          iconType="circle"
          iconSize={8}
          wrapperStyle={{
            paddingBottom: 6,
            fontSize: 11,
          }}
        />

        <Bar
          dataKey="deposit"
          name="Deposit"
          fill="#e46922"
          radius={20}
          maxBarSize={pick(bp, 14, 10, 8)}
        />

        <Bar
          dataKey="withdraw"
          name="Withdraw"
          fill={isDark ? "#09408d" : "#1b52ca"}
          radius={20}
          maxBarSize={pick(bp, 14, 10, 8)}
        />
      </BarChart>
    </ResponsiveContainer>
  </Panel>
</Section>
<Section
  title="Expense Statistics"
  className="lg:col-span-1 h-full flex flex-col"
>
  <Panel
    className="p-0 flex-1 flex flex-col h-full bg-white overflow-hidden"
    style={{
      borderRadius: "20px",
    }}
  >
    <div
      className="w-full flex-1"
      style={{
        minHeight: 0,
        padding: "8px 8px 4px 8px",
      }}
    >
      <ExpensePie />
    </div>
  </Panel>
</Section>

<QuickTransfer />

    <Section
  title="Balance History"
  className="lg:col-span-2 h-full flex flex-col"
>
  <Panel className="p-3 md:p-3.5 flex-1 flex flex-col justify-center h-full bg-white">
    <ResponsiveContainer
      width="100%"
      height={220}
    >
      <AreaChart
        data={balanceHistory}
        margin={{
          top: 6,
          right: 10,
          left: -14,
          bottom: 0,
        }}
      >
        <defs>
          <linearGradient
            id="balanceGradient"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="#3048ff"
              stopOpacity={0.22}
            />
            <stop
              offset="100%"
              stopColor="#3048ff"
              stopOpacity={0}
            />
          </linearGradient>
        </defs>

        <CartesianGrid
          strokeDasharray="4 4"
          stroke="#dbe4f0"
          vertical={true}
        />

        <XAxis
          type="number"
          dataKey="x"
          domain={[0, 7]}
          ticks={[0, 1, 2, 3, 4, 5, 6, 7]}
          tickFormatter={(value) => {
            const months = [
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
              "Jan",
              "",
            ];

            return months[value] || "";
          }}
          tick={{
            fontSize: 12,
            fill: "#6b84b5",
          }}
          axisLine={false}
          tickLine={false}
        />

        <YAxis
          ticks={[0, 200, 400, 600, 800]}
          domain={[0, 800]}
          interval={0}
          tick={{
            fontSize: 12,
            fill: "#6b84b5",
          }}
          axisLine={false}
          tickLine={false}
        />

        <Tooltip
          {...tooltipProps}
          formatter={(value) => money(value)}
        />

        <Area
          type="monotone"
          dataKey="balance"
          name="Balance"
          stroke="#f05ab6"
          strokeWidth={3}
          fill="url(#balanceGradient)"
          dot={false}
          activeDot={{
            r: 5,
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  </Panel>
</Section>
</main>
  );
}
