import { useState } from "react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import {
  yearlyInvestment,
  monthlyRevenue,
  trendingStocks,
} from "../data.js";

import {
  useMoney,
  useStore,
} from "../store.jsx";

import {
  Page,
  Panel,
  Section,
  StatTile,
  Modal,
  Field,
} from "../components/ui.jsx";

import { toneAt } from "../theme.js";
import { useChartTheme } from "../useChartTheme.js";
import { useBreakpoint, pick } from "../useBreakpoint.js";


export default function Investments() {
  const { state, dispatch, showToast } = useStore();

  const money = useMoney();
  const bp = useBreakpoint();

  const {
    colors,
    chart,
    tooltipProps,
    axisTick,
  } = useChartTheme();

  const [adding, setAdding] = useState(false);

  const [form, setForm] = useState({
    name: "",
    category: "",
    value: "",
  });

  const [errors, setErrors] = useState({});


  /* =========================================================
     SUMMARY VALUES
  ========================================================= */

  const total =
    150000 +
    state.investments
      .slice(3)
      .reduce((s, i) => s + i.value, 0);

  const count =
    1250 +
    Math.max(0, state.investments.length - 3);

  const avgReturn =
    state.investments.reduce(
      (s, i) => s + i.ret,
      0
    ) /
    (state.investments.length || 1);


  /* =========================================================
     TOP STAT CARD IMAGES
  ========================================================= */

  const statImages = [
    "image12.png",
    "image13.png",
    "image14.png",
  ];


  /* =========================================================
     INVESTMENT LIST IMAGES
  ========================================================= */

  const investmentImages = [
    "image15.png",
    "image16.png",
    "image17.png",
  ];


  /* =========================================================
     ADD INVESTMENT
  ========================================================= */

  const submit = (e) => {
    e.preventDefault();

    const err = {};

    if (!form.name.trim()) {
      err.name = "Enter a company name";
    }

    if (!form.category.trim()) {
      err.category = "Enter a category";
    }

    if (!(Number(form.value) > 0)) {
      err.value = "Enter an amount greater than 0";
    }

    setErrors(err);

    if (Object.keys(err).length) {
      return;
    }

    dispatch({
      type: "addInvestment",
      inv: {
        name: form.name.trim(),
        category: form.category.trim(),
        value: Number(form.value),
        ret: 0,
        tone: toneAt(state.investments.length),
      },
    });

    showToast(
      `Invested ${money(Number(form.value))} in ${form.name.trim()}`
    );

    setForm({
      name: "",
      category: "",
      value: "",
    });

    setErrors({});

    setAdding(false);
  };


  /* =========================================================
     LINE CHART
  ========================================================= */

  const lineChart = (data, color, key) => (
    <Panel className="p-3.5 md:p-4 flex-1 flex flex-col justify-center h-full">

      <ResponsiveContainer
        width="100%"
        height={pick(bp, 175, 145, 160)}
      >

        <LineChart
          data={data}
          margin={{
            top: 8,
            right: 12,
            left: -10,
            bottom: 0,
          }}
        >

          <CartesianGrid
            strokeDasharray="4 4"
            stroke={chart.grid}
          />

          <XAxis
            dataKey="year"
            tick={axisTick}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={axisTick}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => money(v)}
          />

          <Tooltip
            {...tooltipProps}
            formatter={(v) => money(v)}
          />

          <Line
            type={
              key === "straight"
                ? "linear"
                : "monotone"
            }
            dataKey="value"
            name="Amount"
            stroke={color}
            strokeWidth={2.5}
            dot={
              key === "straight"
                ? {
                    r: 4,
                    fill: colors.surface,
                    stroke: color,
                    strokeWidth: 2.5,
                  }
                : false
            }
          />

        </LineChart>

      </ResponsiveContainer>

    </Panel>
  );


  return (
    <Page>


      {/* =====================================================
    TOP STAT CARDS
===================================================== */}

<div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 md:gap-4">

  {/* TOTAL INVESTED AMOUNT */}
  <div
    className="
      rounded-2xl
      bg-white
      border
      border-line
      p-4
      flex
      items-center
      gap-3
      shadow-sm
    "
  >
    <div
      className="
        flex-none
        w-[42px]
        h-[42px]
        rounded-xl
        flex
        items-center
        justify-center
        overflow-hidden
      "
    >
      <img
        src="/image12.png"
        alt=""
        className="w-full h-full object-contain"
      />
    </div>

    <div className="min-w-0">
      <div className="text-xs md:text-sm text-muted">
        Total Invested Amount
      </div>

      <div className="text-lg md:text-xl font-bold text-text tabular-nums mt-0.5">
        {money(total)}
      </div>
    </div>
  </div>


  {/* NUMBER OF INVESTMENTS */}
  <div
    className="
      rounded-2xl
      bg-white
      border
      border-line
      p-4
      flex
      items-center
      gap-3
      shadow-sm
    "
  >
    <div
      className="
        flex-none
        w-[42px]
        h-[42px]
        rounded-xl
        flex
        items-center
        justify-center
        overflow-hidden
      "
    >
      <img
        src="/image13.png"
        alt=""
        className="w-full h-full object-contain"
      />
    </div>

    <div className="min-w-0">
      <div className="text-xs md:text-sm text-muted">
        Number of Investments
      </div>

      <div className="text-lg md:text-xl font-bold text-text tabular-nums mt-0.5">
        {count.toLocaleString()}
      </div>
    </div>
  </div>


  {/* RATE OF RETURN */}
  <div
    className="
      rounded-2xl
      bg-white
      border
      border-line
      p-4
      flex
      items-center
      gap-3
      shadow-sm
    "
  >
    <div
      className="
        flex-none
        w-[42px]
        h-[42px]
        rounded-xl
        flex
        items-center
        justify-center
        overflow-hidden
      "
    >
      <img
        src="/image14.png"
        alt=""
        className="w-full h-full object-contain"
      />
    </div>

    <div className="min-w-0">
      <div className="text-xs md:text-sm text-muted">
        Rate of Return
      </div>

      <div className="text-lg md:text-xl font-bold text-text tabular-nums mt-0.5">
        {`${avgReturn >= 0 ? "+" : ""}${avgReturn.toFixed(2)}%`}
      </div>
    </div>
  </div>

</div>
      {/* =====================================================
          CHARTS
      ===================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5 items-stretch">

        {/* YEARLY TOTAL INVESTMENT */}

        <Section
          title="Yearly Total Investment"
          className="h-full flex flex-col"
        >
          {lineChart(
            yearlyInvestment,
            chart.secondary,
            "straight"
          )}
        </Section>


        {/* MONTHLY REVENUE */}

        <Section
          title="Monthly Revenue"
          className="h-full flex flex-col"
        >
          {lineChart(
            monthlyRevenue,
            chart.primary,
            "curve"
          )}
        </Section>

      </div>


      {/* =====================================================
          MY INVESTMENT + TRENDING STOCK
      ===================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-4 md:gap-5 items-stretch">


        {/* ===================================================
            MY INVESTMENT
        =================================================== */}

        <Section
          title="My Investment"
          className="h-full flex flex-col"
          action={
            <button
              type="button"
              className="
                text-xs
                md:text-sm
                font-semibold
                text-primary
                hover:underline
                cursor-pointer
              "
              onClick={() => setAdding(true)}
            >
              + New Investment
            </button>
          }
        >

          <Panel
            className="
              p-0
              overflow-hidden
              flex-1
              flex
              flex-col
              h-full
            "
          >

            {state.investments.map((i, index) => {

              /*
                First 3 investment rows use:
                image15
                image16
                image17

                If more investments are added,
                the images repeat safely.
              */

              const imageName =
                investmentImages[
                  index % investmentImages.length
                ];

              return (
                <div
                  key={i.id}
                  className="
                    flex
                    items-center
                    gap-3
                    md:gap-4
                    px-3.5
                    md:px-4
                    py-3.5
                    md:py-4
                    border-b
                    border-line
                    last:border-b-0
                    hover:bg-surface-2/60
                    transition-colors
                  "
                >

                  {/* -----------------------------------------
                      COMPANY + ICON
                  ----------------------------------------- */}

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                      min-w-0
                      flex-1
                    "
                  >

                    {/* INVESTMENT IMAGE */}

                    <div
                      className="
                        flex-none
                        w-[38px]
                        h-[38px]
                        rounded-xl
                        flex
                        items-center
                        justify-center
                        overflow-hidden
                      "
                    >

                      <img
                        src={`/${imageName}`}
                        alt=""
                        className="
                          w-full
                          h-full
                          object-contain
                        "
                      />

                    </div>


                    {/* COMPANY DETAILS */}

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
                        {i.name}
                      </div>

                      <div
                        className="
                          text-[10px]
                          md:text-xs
                          text-muted
                          mt-0.5
                        "
                      >
                        {i.category}
                      </div>

                    </div>

                  </div>


                  {/* -----------------------------------------
                      INVESTMENT VALUE
                  ----------------------------------------- */}

                  <div className="text-right min-w-[90px]">

                    <div
                      className="
                        text-xs
                        md:text-sm
                        font-semibold
                        text-text
                        tabular-nums
                      "
                    >
                      {money(i.value)}
                    </div>

                    <div
                      className="
                        text-[10px]
                        text-muted
                        mt-0.5
                      "
                    >
                      Investment Value
                    </div>

                  </div>


                  {/* -----------------------------------------
                      RETURN
                  ----------------------------------------- */}

                  <div className="text-right min-w-[65px]">

                    <div
                      className={`
                        text-xs
                        md:text-sm
                        font-semibold
                        tabular-nums
                        ${
                          i.ret < 0
                            ? "text-neg"
                            : "text-pos"
                        }
                      `}
                    >
                      {i.ret >= 0 ? "+" : ""}
                      {i.ret}%
                    </div>

                    <div
                      className="
                        text-[10px]
                        text-muted
                        mt-0.5
                      "
                    >
                      Return Value
                    </div>

                  </div>

                </div>
              );
            })}

          </Panel>

        </Section>


        {/* ===================================================
            TRENDING STOCK
        =================================================== */}

        <Section
          title="Trending Stock"
          className="h-full flex flex-col"
        >

          <Panel
            className="
              p-0
              overflow-hidden
              flex-1
              flex
              flex-col
              justify-around
              h-full
            "
          >

            <div className="overflow-x-auto">

              <table
                className="
                  w-full
                  text-left
                  text-xs
                  md:text-sm
                  divide-y
                  divide-line
                "
              >

                <thead
                  className="
                    bg-surface-2
                    text-muted
                    text-[11px]
                    uppercase
                    tracking-wider
                    font-semibold
                  "
                >

                  <tr>

                    <th className="px-3.5 py-2.5">
                      SL No
                    </th>

                    <th className="px-3.5 py-2.5">
                      Name
                    </th>

                    <th className="px-3.5 py-2.5">
                      Price
                    </th>

                    <th className="px-3.5 py-2.5">
                      Return
                    </th>

                  </tr>

                </thead>


                <tbody className="divide-y divide-line">

                  {trendingStocks.map((s) => (

                    <tr
                      key={s.id}
                      className="
                        hover:bg-surface-2/60
                        transition-colors
                      "
                    >

                      <td
                        className="
                          px-3.5
                          py-2.5
                          text-muted
                        "
                      >
                        {String(s.id).padStart(2, "0")}.
                      </td>

                      <td
                        className="
                          px-3.5
                          py-2.5
                          font-medium
                          text-text
                        "
                      >
                        {s.name}
                      </td>

                      <td
                        className="
                          px-3.5
                          py-2.5
                          font-semibold
                          text-text
                          tabular-nums
                        "
                      >
                        {money(s.price)}
                      </td>

                      <td
                        className={`
                          px-3.5
                          py-2.5
                          font-semibold
                          tabular-nums
                          ${
                            s.ret < 0
                              ? "text-neg"
                              : "text-pos"
                          }
                        `}
                      >
                        {s.ret >= 0 ? "+" : ""}
                        {s.ret}%
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </Panel>

        </Section>

      </div>


      {/* =====================================================
          NEW INVESTMENT MODAL
      ===================================================== */}

      {adding && (

        <Modal
          title="New Investment"
          onClose={() => {
            setAdding(false);
            setErrors({});
          }}
        >

          <form
            className="flex flex-col gap-4"
            onSubmit={submit}
            noValidate
          >

            <Field
              id="inv-name"
              label="Company"
              placeholder="e.g. Microsoft"
              value={form.name}
              error={errors.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
            />


            <Field
              id="inv-cat"
              label="Category"
              placeholder="e.g. Software"
              value={form.category}
              error={errors.category}
              onChange={(e) =>
                setForm({
                  ...form,
                  category: e.target.value,
                })
              }
            />


            <Field
              id="inv-val"
              label="Amount"
              inputMode="decimal"
              placeholder="5000"
              value={form.value}
              error={errors.value}
              onChange={(e) =>
                setForm({
                  ...form,
                  value: e.target.value.replace(
                    /[^\d.]/g,
                    ""
                  ),
                })
              }
            />


            <button
              type="submit"
              className="
                self-start
                inline-flex
                items-center
                justify-center
                px-8
                py-2.5
                rounded-xl
                bg-primary
                text-white
                font-semibold
                text-sm
                hover:bg-primary-dark
                transition-all
              "
            >
              Invest
            </button>

          </form>

        </Modal>

      )}

    </Page>
  );
}