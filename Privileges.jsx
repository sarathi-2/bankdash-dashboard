import { useState } from "react";
import { perks } from "../data.js";
import { formatDate, useStore } from "../store.jsx";

import {
  Gift,
  ShoppingBag,
  Headphones,
  Plane,
  Crown,
  CreditCard,
  TrendingUp,
  X,
} from "lucide-react";

const tiers = [
  { name: "Silver", min: 0 },
  { name: "Gold", min: 10000 },
  { name: "Platinum", min: 25000 },
];

/* =========================================================
   REWARD ICONS
========================================================= */

const rewardIcons = [
  Gift,
  ShoppingBag,
  Headphones,
  Plane,
  Gift,
  Crown,
];

/* =========================================================
   REWARD COLORS
========================================================= */

const rewardStyles = [
  {
    bg: "bg-teal-50",
    iconBg: "bg-teal-500",
    text: "text-teal-600",
    button: "bg-teal-500 hover:bg-teal-600",
  },
  {
    bg: "bg-orange-50",
    iconBg: "bg-orange-500",
    text: "text-orange-600",
    button: "bg-orange-500 hover:bg-orange-600",
  },
  {
    bg: "bg-pink-50",
    iconBg: "bg-pink-500",
    text: "text-pink-600",
    button: "bg-pink-500 hover:bg-pink-600",
  },
  {
    bg: "bg-sky-50",
    iconBg: "bg-sky-500",
    text: "text-sky-600",
    button: "bg-sky-500 hover:bg-sky-600",
  },
  {
    bg: "bg-violet-50",
    iconBg: "bg-violet-500",
    text: "text-violet-600",
    button: "bg-violet-500 hover:bg-violet-600",
  },
  {
    bg: "bg-rose-50",
    iconBg: "bg-rose-500",
    text: "text-rose-600",
    button: "bg-rose-500 hover:bg-rose-600",
  },
];

/* =========================================================
   HOW TO EARN ICONS
========================================================= */

const earnItems = [
  {
    icon: CreditCard,
    title: "1 point",
    text: "for every $1 spent on cards",
    number: "1",
    color: "bg-teal-500",
    iconBg: "bg-teal-50",
    iconColor: "text-teal-500",
  },
  {
    icon: TrendingUp,
    title: "500 points",
    text: "for each new investment",
    number: "2",
    color: "bg-orange-500",
    iconBg: "bg-orange-50",
    iconColor: "text-orange-500",
  },
  {
    icon: Plane,
    title: "2× points",
    text: "on dining and travel",
    number: "3",
    color: "bg-sky-500",
    iconBg: "bg-sky-50",
    iconColor: "text-sky-500",
  },
];

export default function Privileges() {
  const { state, dispatch, showToast } = useStore();

  const [confirm, setConfirm] = useState(null);

  /* =======================================================
     MEMBERSHIP CALCULATION
  ======================================================= */

  const lifetime =
    state.points +
    state.redeemed.reduce(
      (sum, reward) => sum + reward.cost,
      0
    );

  const tierIdx = tiers.reduce(
    (index, tier, currentIndex) =>
      lifetime >= tier.min ? currentIndex : index,
    0
  );

  const tier = tiers[tierIdx];
  const next = tiers[tierIdx + 1];

  const progress = next
    ? Math.min(
        100,
        Math.max(
          0,
          ((lifetime - tier.min) /
            (next.min - tier.min)) *
            100
        )
      )
    : 100;

  /* =======================================================
     REDEEM
  ======================================================= */

  const redeem = () => {
    if (!confirm) return;

    dispatch({
      type: "redeem",
      perk: confirm,
    });

    showToast(`${confirm.title} redeemed`);

    setConfirm(null);
  };

  return (
    <div className="w-full min-h-full bg-[#f7fbfc] p-3 sm:p-4 md:p-5 lg:p-6">

      {/* =====================================================
          TOP SECTION
      ====================================================== */}

      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]
          gap-4
          md:gap-5
        "
      >

        {/* ===================================================
            MEMBERSHIP CARD
        ==================================================== */}

        <section
          className="
            relative
            min-h-[270px]
            sm:min-h-[290px]
            lg:min-h-[300px]
            overflow-hidden
            rounded-2xl
           bg-gradient-to-br
from-[#FCE4EC]
via-[#D65A8A]
to-[#881337]
            p-5
            sm:p-6
            md:p-7
            text-white
            shadow-sm
          "
        >

          {/* Background decoration */}
          <div
            className="
              absolute
              -right-24
              -top-24
              w-72
              h-72
              rounded-full
              bg-white/10
            "
          />

          <div
            className="
              absolute
              right-[-80px]
              bottom-[-100px]
              w-80
              h-80
              rounded-full
              bg-white/10
              blur-2xl
            "
          />

          {/* Card image */}
          <img
            src="/chipcard1.png"
            alt="Membership Card"
            className="
              absolute
              right-3
              bottom-3
              sm:right-6
              sm:bottom-5
              md:right-8
              md:bottom-6
              w-[130px]
              h-[130px]
              sm:w-[155px]
              sm:h-[155px]
              md:w-[180px]
              md:h-[180px]
              object-contain
              rotate-[-8deg]
              z-[2]
            "
          />

          {/* Content */}
          <div
            className="
              relative
              z-[5]
              max-w-[75%]
              sm:max-w-[70%]
              md:max-w-[65%]
            "
          >

            <div
              className="
                text-[10px]
                sm:text-xs
                uppercase
                tracking-[0.16em]
                text-white/70
              "
            >
              MEMBERSHIP
            </div>

            <h2
              className="
                mt-1
                text-2xl
                sm:text-3xl
                md:text-4xl
                font-bold
                tracking-tight
              "
            >
              {tier.name} Member
            </h2>

            <div className="mt-6">
              <div
                className="
                  text-[10px]
                  sm:text-xs
                  uppercase
                  tracking-[0.15em]
                  text-white/70
                "
              >
                AVAILABLE POINTS
              </div>

              <div
                className="
                  mt-1
                  text-3xl
                  sm:text-4xl
                  md:text-5xl
                  font-black
                  tracking-tight
                "
              >
                {state.points.toLocaleString()}
              </div>
            </div>

            {/* Progress */}
            <div className="mt-5 max-w-[420px]">
              <div
                className="
                  h-2.5
                  rounded-full
                  bg-white/25
                  overflow-hidden
                "
              >
                <div
                  className="
                    h-full
                    rounded-full
                    bg-cyan-300
                    transition-all
                    duration-500
                  "
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>

              <div
                className="
                  mt-2
                  text-[11px]
                  sm:text-xs
                  text-white/80
                "
              >
                {next
                  ? `${(
                      next.min - lifetime
                    ).toLocaleString()} more points to ${next.name}`
                  : "You have reached the top tier"}
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================
            HOW TO EARN
        ==================================================== */}

        <section
          className="
            rounded-2xl
            bg-white
            border
            border-slate-100
            shadow-sm
            p-4
            sm:p-5
            md:p-6
          "
        >
          <h2
            className="
              text-xl
              sm:text-2xl
              md:text-3xl
              font-bold
              text-slate-900
            "
          >
            How to earn
          </h2>

          <div className="mt-5 space-y-4">

            {earnItems.map((item) => {
              const EarnIcon = item.icon;

              return (
                <div
                  key={item.number}
                  className="
                    flex
                    items-center
                    gap-3
                    sm:gap-4
                  "
                >

                  {/* Number */}
                  <div
                    className={`
                      flex-none
                      w-8
                      h-8
                      sm:w-9
                      sm:h-9
                      rounded-full
                      ${item.color}
                      text-white
                      flex
                      items-center
                      justify-center
                      text-sm
                      font-bold
                    `}
                  >
                    {item.number}
                  </div>

                  {/* Icon */}
                  <div
                    className={`
                      flex-none
                      w-11
                      h-11
                      sm:w-12
                      sm:h-12
                      rounded-full
                      ${item.iconBg}
                      ${item.iconColor}
                      flex
                      items-center
                      justify-center
                    `}
                  >
                    <EarnIcon
                      size={21}
                      strokeWidth={2}
                    />
                  </div>

                  {/* Text */}
                  <div className="min-w-0">
                    <div
                      className="
                        text-sm
                        sm:text-base
                        font-bold
                        text-slate-900
                      "
                    >
                      {item.title}
                    </div>

                    <div
                      className="
                        text-xs
                        sm:text-sm
                        text-slate-500
                      "
                    >
                      {item.text}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* =====================================================
          REWARDS
      ====================================================== */}

      <section className="mt-5 rounded-2xl bg-white border border-slate-100 shadow-sm p-4 sm:p-5 md:p-6">

        <h2
          className="
            text-xl
            sm:text-2xl
            md:text-3xl
            font-bold
            text-slate-900
          "
        >
          Rewards
        </h2>

        <div
          className="
            mt-4
            grid
            grid-cols-1
            sm:grid-cols-2
            xl:grid-cols-3
            gap-4
          "
        >
          {perks.map((perk, index) => {
            const style =
              rewardStyles[
                index % rewardStyles.length
              ];

            const RewardIcon =
              rewardIcons[
                index % rewardIcons.length
              ];

            const afford =
              state.points >= perk.cost;

            return (
              <div
                key={perk.id}
                className={`
                  ${style.bg}
                  rounded-xl
                  p-4
                  sm:p-5
                  min-h-[175px]
                  flex
                  flex-col
                  justify-between
                  border
                  border-white
                `}
              >

                {/* Reward top */}
                <div className="flex items-start gap-4">

                  {/* Icon */}
                  <div
                    className={`
                      flex-none
                      w-14
                      h-14
                      sm:w-16
                      sm:h-16
                      rounded-full
                      ${style.iconBg}
                      text-white
                      flex
                      items-center
                      justify-center
                    `}
                  >
                    <RewardIcon
                      size={28}
                      strokeWidth={2}
                    />
                  </div>

                  {/* Text */}
                  <div className="min-w-0 pt-1">

                    <h3
                      className="
                        text-sm
                        sm:text-base
                        font-bold
                        text-slate-900
                      "
                    >
                      {perk.title}
                    </h3>

                    <p
                      className="
                        mt-1
                        text-xs
                        sm:text-sm
                        leading-relaxed
                        text-slate-600
                      "
                    >
                      {perk.desc}
                    </p>

                  </div>
                </div>

                {/* Bottom */}
                <div
                  className="
                    mt-5
                    flex
                    items-center
                    justify-between
                    gap-3
                  "
                >

                  <div
                    className={`
                      text-base
                      sm:text-lg
                      font-bold
                      ${style.text}
                    `}
                  >
                    {perk.cost.toLocaleString()} pts
                  </div>

                  <button
                    type="button"
                    disabled={!afford}
                    onClick={() =>
                      setConfirm(perk)
                    }
                    className={`
                      px-5
                      py-2
                      rounded-full
                      text-xs
                      sm:text-sm
                      font-semibold
                      text-white
                      transition-all
                      ${
                        afford
                          ? `${style.button} cursor-pointer`
                          : "bg-slate-300 cursor-not-allowed"
                      }
                    `}
                  >
                    {afford
                      ? "Redeem"
                      : "Not enough"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =====================================================
          REDEMPTION HISTORY
      ====================================================== */}

      <section className="mt-5 rounded-2xl bg-white border border-slate-100 shadow-sm p-4 sm:p-5 md:p-6">

        <h2
          className="
            text-xl
            sm:text-2xl
            md:text-3xl
            font-bold
            text-slate-900
          "
        >
          Redemption History
        </h2>

        {/* Desktop header */}
        <div
          className="
            hidden
            md:grid
            md:grid-cols-[1.5fr_1fr_1fr]
            gap-4
            mt-5
            px-4
            py-3
            rounded-lg
            bg-slate-50
            text-xs
            font-semibold
            text-slate-500
          "
        >
          <div>REWARD</div>
          <div>DATE</div>
          <div>POINTS USED</div>
        </div>

        {/* History */}
        {state.redeemed.length === 0 ? (
          <div className="py-10 text-center text-sm text-slate-500">
            You haven't redeemed any rewards yet.
          </div>
        ) : (
          <div className="mt-2 divide-y divide-slate-100">

            {state.redeemed.map((reward, index) => {
              const RewardIcon =
                rewardIcons[
                  index % rewardIcons.length
                ];

              return (
                <div
                  key={reward.id}
                  className="
                    grid
                    grid-cols-1
                    md:grid-cols-[1.5fr_1fr_1fr]
                    gap-3
                    md:gap-4
                    items-center
                    px-2
                    sm:px-4
                    py-3
                    sm:py-3.5
                  "
                >

                  {/* Reward */}
                  <div className="flex items-center gap-3 min-w-0">

                    <div
                      className="
                        flex-none
                        w-9
                        h-9
                        rounded-full
                        bg-sky-100
                        text-sky-600
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <RewardIcon
                        size={17}
                        strokeWidth={2}
                      />
                    </div>

                    <div className="min-w-0">
                      <div
                        className="
                          text-xs
                          sm:text-sm
                          font-semibold
                          text-slate-900
                          truncate
                        "
                      >
                        {reward.title}
                      </div>

                      {/* Mobile date */}
                      <div
                        className="
                          md:hidden
                          text-[10px]
                          text-slate-400
                          mt-0.5
                        "
                      >
                        {formatDate(reward.date)}
                      </div>
                    </div>
                  </div>

                  {/* Date */}
                  <div
                    className="
                      hidden
                      md:block
                      text-sm
                      text-slate-600
                    "
                  >
                    {formatDate(reward.date)}
                  </div>

                  {/* Points */}
                  <div
                    className="
                      text-xs
                      sm:text-sm
                      font-semibold
                      text-rose-500
                      md:text-left
                    "
                  >
                    -{reward.cost.toLocaleString()} pts
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* =====================================================
          REDEEM MODAL
      ====================================================== */}

      {confirm && (
        <div
          className="
            fixed
            inset-0
            z-50
            bg-black/40
            backdrop-blur-sm
            flex
            items-center
            justify-center
            p-4
          "
          onClick={() => setConfirm(null)}
        >
          <div
            className="
              w-full
              max-w-md
              rounded-2xl
              bg-white
              shadow-2xl
              p-5
              sm:p-6
            "
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="flex items-center justify-between gap-3">

              <h3
                className="
                  text-lg
                  sm:text-xl
                  font-bold
                  text-slate-900
                "
              >
                Redeem reward
              </h3>

              <button
                type="button"
                onClick={() =>
                  setConfirm(null)
                }
                className="
                  w-8
                  h-8
                  rounded-full
                  bg-slate-100
                  text-slate-500
                  flex
                  items-center
                  justify-center
                  hover:bg-slate-200
                "
              >
                <X size={17} />
              </button>

            </div>

            <p
              className="
                mt-5
                text-sm
                text-slate-600
                leading-relaxed
              "
            >
              Redeem{" "}
              <strong className="text-slate-900">
                {confirm.title}
              </strong>{" "}
              for{" "}
              <strong className="text-slate-900">
                {confirm.cost.toLocaleString()}{" "}
                points
              </strong>
              ?
              <br />
              You'll have{" "}
              <strong className="text-slate-900">
                {Math.max(
                  0,
                  state.points -
                    confirm.cost
                ).toLocaleString()}
              </strong>{" "}
              points left.
            </p>

            <div
              className="
                mt-6
                flex
                flex-col-reverse
                sm:flex-row
                sm:justify-end
                gap-2
              "
            >

              <button
                type="button"
                onClick={() =>
                  setConfirm(null)
                }
                className="
                  px-5
                  py-2.5
                  rounded-xl
                  border
                  border-slate-200
                  text-slate-700
                  text-sm
                  font-semibold
                  hover:bg-slate-50
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={redeem}
                className="
                  px-6
                  py-2.5
                  rounded-xl
                  bg-teal-500
                  hover:bg-teal-600
                  text-white
                  text-sm
                  font-semibold
                "
              >
                Redeem
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}