import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import { debitCredit, invoices } from "../data.js";
import { formatDate, useMoney, useStore } from "../store.jsx";

import {
  Page,
  Panel,
  Section,
  CreditCard,
  IconBadge,
  go,
} from "../components/ui.jsx";

import { txStyle } from "../utils.js";
import { useChartTheme } from "../useChartTheme.js";
import { useBreakpoint, pick } from "../useBreakpoint.js";

/* =========================================================
   ACCOUNT STAT TILE
   Uses PNG images from /public
========================================================= */

function AccountStatTile({
  image,
  label,
  value,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        w-full
        text-left
        rounded-2xl
        bg-white
        border
        border-line/60
        p-4
        md:p-5
        transition
        hover:shadow-sm
        cursor-pointer
      "
    >
      <div className="flex items-center gap-3">

        {/* PNG ICON */}
        <div
          className="
            flex-none
            w-11
            h-11
            rounded-xl
            flex
            items-center
            justify-center
            overflow-hidden
          "
        >
          <img
            src={`/${image}.png`}
            alt=""
            className="w-full h-full object-contain"
          />
        </div>

        {/* TEXT */}
        <div className="min-w-0 flex-1">
          <div className="text-xs md:text-sm text-muted mb-1">
            {label}
          </div>

          <div className="text-lg md:text-xl font-bold text-text tabular-nums truncate">
            {value}
          </div>
        </div>

      </div>
    </button>
  );
}


/* =========================================================
   ACCOUNTS PAGE
========================================================= */

export default function Accounts() {
  const { state } = useStore();
  const money = useMoney();
  const bp = useBreakpoint();

  const {
    isDark,
    chart,
    tooltipProps,
    axisTick,
  } = useChartTheme();

  /* =======================================================
     CALCULATIONS
  ======================================================= */

  const balance = state.cards.reduce(
    (s, c) => s + c.balance,
    0
  );

  const income = state.transactions
    .filter((t) => t.amount > 0)
    .reduce((s, t) => s + t.amount, 0);

  const expense = state.transactions
    .filter((t) => t.amount < 0)
    .reduce((s, t) => s - t.amount, 0);

  const saving = Math.max(
    0,
    income - expense
  );

  const card = state.cards[0];

  const debitTotal = debitCredit.reduce(
    (s, d) => s + d.debit,
    0
  );

  const creditTotal = debitCredit.reduce(
    (s, d) => s + d.credit,
    0
  );


  /* =======================================================
     RETURN
  ======================================================= */

  return (
    <Page>

      {/* ===================================================
          TOP ACCOUNT SUMMARY
      =================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 md:gap-4">

        {/* MY BALANCE */}
        <AccountStatTile
          image="image1"
          label="My Balance"
          value={money(balance)}
          onClick={() => go("cards")}
        />

        {/* INCOME */}
        <AccountStatTile
          image="image2"
          label="Income"
          value={money(income)}
          onClick={() => go("transactions")}
        />

        {/* EXPENSE */}
        <AccountStatTile
          image="image3"
          label="Expense"
          value={money(expense)}
          onClick={() => go("transactions")}
        />

        {/* TOTAL SAVING */}
        <AccountStatTile
          image="image4"
          label="Total Saving"
          value={money(saving)}
        />

      </div>


      {/* ===================================================
          LAST TRANSACTION + MY CARD
      =================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 md:gap-5 items-stretch">

        {/* =================================================
            LAST TRANSACTION
        ================================================= */}

        <Section
          title="Last Transaction"
          className="h-full flex flex-col"
          action={
            <button
              className="
                text-xs
                md:text-sm
                font-semibold
                text-primary
                hover:underline
                cursor-pointer
              "
              onClick={() => go("transactions")}
            >
              See All
            </button>
          }
        >

          <Panel
            className="
              flex
              flex-col
              justify-between
              gap-1.5
              p-3.5
              md:p-4
              divide-y
              divide-line
              flex-1
              h-full
            "
          >

            {state.transactions
              .slice(0, 3)
              .map((t, index) => {

                const s =
                  txStyle[t.type] ||
                  txStyle.Transfer;

                const c =
                  state.cards.find(
                    (x) => x.id === t.cardId
                  );

                return (
                  <div
                    key={t.id}
                    className="
                      pt-2
                      first:pt-0
                      flex
                      items-center
                      justify-between
                      gap-3
                    "
                  >

                    {/* LEFT */}
                    <div className="flex items-center gap-3 min-w-0">

                      {/* TRANSACTION PNG */}
                      <div
                        className="
                          flex-none
                          w-[34px]
                          h-[34px]
                          rounded-xl
                          flex
                          items-center
                          justify-center
                          overflow-hidden
                        "
                      >
                        <img
                          src={`/${[
                            "image5",
                            "image6",
                            "image7",
                          ][index]}.png`}
                          alt=""
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <div className="min-w-0">

                        <div
                          className="
                            text-xs
                            md:text-sm
                            font-semibold
                            text-text
                            truncate
                          "
                        >
                          {t.desc}
                        </div>

                        <div
                          className="
                            text-[10px]
                            md:text-xs
                            text-muted
                            mt-0.5
                          "
                        >
                          {formatDate(
                            t.date,
                            "long"
                          )}
                        </div>

                      </div>

                    </div>


                    {/* TYPE */}
                    <div
                      className="
                        hidden
                        sm:block
                        text-[11px]
                        text-muted
                      "
                    >
                      {t.type}
                    </div>


                    {/* CARD NUMBER */}
                    <div
                      className="
                        hidden
                        md:block
                        text-[11px]
                        text-muted
                        tabular-nums
                      "
                    >
                      {c
                        ? `${c.number.slice(
                            0,
                            4
                          )} ****`
                        : "—"}
                    </div>


                    {/* AMOUNT */}
                    <div
                      className={`
                        text-xs
                        md:text-sm
                        font-semibold
                        tabular-nums
                        whitespace-nowrap
                        ${
                          t.amount < 0
                            ? "text-neg"
                            : "text-pos"
                        }
                      `}
                    >
                      {money(t.amount, {
                        sign: true,
                      })}
                    </div>

                  </div>
                );
              })}

          </Panel>

        </Section>


        {/* =================================================
            MY CARD
        ================================================= */}

        <Section
          title="My Card"
          className="h-full flex flex-col"
          action={
            <button
              className="
                text-xs
                md:text-sm
                font-semibold
                text-primary
                hover:underline
                cursor-pointer
              "
              onClick={() => go("cards")}
            >
              See All
            </button>
          }
        >

          {card ? (
            <CreditCard
              card={card}
              className="h-full"
              onClick={() => go("cards")}
            />
          ) : (
            <Panel
              className="
                text-muted
                p-4
                text-center
                text-xs
                flex-1
                h-full
              "
            >
              No cards yet.
            </Panel>
          )}

        </Section>

      </div>


      {/* ===================================================
          DEBIT & CREDIT + INVOICES
      =================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 md:gap-5 items-stretch">

        {/* =================================================
            DEBIT & CREDIT OVERVIEW
        ================================================= */}

        <Section
          title="Debit & Credit Overview"
          className="h-full flex flex-col"
        >

          <Panel
            className="
              p-3.5
              md:p-4
              flex-1
              flex
              flex-col
              justify-between
              h-full
            "
          >

            <p
              className="
                text-[11px]
                md:text-xs
                text-muted
                mb-2
              "
            >
              <strong className="text-ink font-semibold">
                {money(debitTotal)}
              </strong>{" "}
              Debited &amp;{" "}
              <strong className="text-ink font-semibold">
                {money(creditTotal)}
              </strong>{" "}
              Credited in this week
            </p>


            <ResponsiveContainer
              width="100%"
              height={pick(
                bp,
                170,
                150,
                160
              )}
            >

              <BarChart
                data={debitCredit}
                barGap={6}
                margin={{
                  top: 6,
                  right: 8,
                  left: -14,
                  bottom: 0,
                }}
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
                />

                <Tooltip
                  {...tooltipProps}
                  cursor={{
                    fill: chart.cursor,
                  }}
                  formatter={(v) =>
                    money(v)
                  }
                />

                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="square"
                  iconSize={8}
                  wrapperStyle={{
                    paddingBottom: 6,
                    fontSize: 11,
                  }}
                />

                <Bar
                  dataKey="debit"
                  name="Debit"
                  fill={
                    isDark
                      ? "#aadd58"
                      : "#aadd58"
                  }
                  radius={4}
                  maxBarSize={pick(
                    bp,
                    22,
                    16,
                    12
                  )}
                />

                <Bar
                  dataKey="credit"
                  name="Credit"
                  fill={
                    isDark
                      ? "#db56a8"
                      : "#db56a8"
                  }
                  radius={4}
                  maxBarSize={pick(
                    bp,
                    22,
                    16,
                    12
                  )}
                />

              </BarChart>

            </ResponsiveContainer>

          </Panel>

        </Section>


        {/* =================================================
            INVOICES SENT
        ================================================= */}

        <Section
          title="Invoices Sent"
          className="h-full flex flex-col"
        >

          <Panel
            className="
              flex
              flex-col
              justify-between
              gap-1.5
              p-3.5
              md:p-4
              divide-y
              divide-line
              flex-1
              h-full
            "
          >

            {invoices.map((invoice, index) => (

              <div
                key={invoice.id}
                className="
                  pt-2
                  first:pt-0
                  flex
                  items-center
                  justify-between
                  gap-3
                "
              >

                {/* LEFT */}
                <div className="flex items-center gap-3 min-w-0">

                  {/* INVOICE PNG */}
<div
  className="
    relative
    flex-none
    w-[34px]
    h-[34px]
    rounded-xl
    flex
    items-center
    justify-center
    overflow-hidden
  "
>
  {/* image9 + user1 */}
  {index === 1 ? (
    <>
      <img
        src="/image9.png"
        alt=""
        className="absolute inset-0 w-full h-full object-contain"
      />
      <img
        src="/user1.png"
        alt=""
        className="
          absolute
          left-1/2
          top-1/2
          -translate-x-1/2
          -translate-y-1/2
          w-[18px]
          h-[18px]
          object-contain
          z-10
        "
      />
    </>
  ) : index === 2 ? (
    <>
      {/* image10 + user2 */}
      <img
        src="/image10.png"
        alt=""
        className="absolute inset-0 w-full h-full object-contain"
      />
      <img
        src="/user2.png"
        alt=""
        className="
          absolute
          left-1/2
          top-1/2
          -translate-x-1/2
          -translate-y-1/2
          w-[18px]
          h-[18px]
          object-contain
          z-10
        "
      />
    </>
  ) : (
    <img
      src={`/${
        [
          "image8",
          "image9",
          "image10",
          "image11",
        ][index] || "image8"
      }.png`}
      alt=""
      className="w-full h-full object-contain"
    />
  )}
</div>


                  {/* NAME + TIME */}
                  <div className="min-w-0">

                    <div
                      className="
                        text-xs
                        md:text-sm
                        font-semibold
                        text-text
                        truncate
                      "
                    >
                      {invoice.name}
                    </div>

                    <div
                      className="
                        text-[10px]
                        md:text-xs
                        text-muted
                        mt-0.5
                      "
                    >
                      {invoice.ago}
                    </div>

                  </div>

                </div>


                {/* AMOUNT */}
                <div
                  className="
                    text-xs
                    md:text-sm
                    font-semibold
                    text-text
                    tabular-nums
                  "
                >
                  {money(invoice.amount)}
                </div>

              </div>

            ))}

          </Panel>

        </Section>

      </div>

    </Page>
  );
}