import { useEffect } from 'react';
import Icon from '../Icons.jsx';
import { maskCard, useMoney, useStore } from '../store.jsx';
import { tones } from '../theme.js';
import { go } from '../utils.js';

export { go };

/* =========================================================
   PAGE
========================================================= */

export function Page({ className = '', children }) {
  return (
    <main
      className={`
        flex flex-col
        gap-3.5 md:gap-4
        p-3 md:p-4
        transition-all
        ${className}
      `}
    >
      {children}
    </main>
  );
}

/* =========================================================
   PANEL
   No outer border
========================================================= */

export function Panel({ className = '', children, ...props }) {
  return (
    <div
      className={`
        bg-surface
        rounded-xl
        p-3.5 md:p-4
        shadow-xs
        border-0
        transition-all
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

/* =========================================================
   SECTION
========================================================= */

export function Section({
  title,
  action,
  className = '',
  children,
}) {
  return (
    <section
      className={`
        flex flex-col
        gap-2
        min-w-0
        ${className}
      `}
    >
      {(title || action) && (
        <div className="flex justify-between items-center gap-2.5 min-h-[26px]">
          {title && (
            <h2 className="text-xs md:text-sm font-bold tracking-tight text-ink">
              {title}
            </h2>
          )}

          {action}
        </div>
      )}

      {children}
    </section>
  );
}

/* =========================================================
   ICON BADGE
========================================================= */
export function IconBadge({
  icon,
  image,
  tone = "teal",
  size = 36,
}) {
  const t = tones[tone] || tones.teal;

  return (
    <div
      className={`flex-none rounded-xl grid place-items-center ${t.bg}`}
      style={{
        width: size,
        height: size,
      }}
    >
      <img
        src={image}
        alt="icon"
        className="w-14 h-14 object-contain"
      />
    </div>
  );
}


/* =========================================================
   STAT TILE
   No outer border
========================================================= */

export function StatTile({
  icon,
  image,
  tone = "teal",
  label,
  value,
  onClick,
}) {
  const Tag = onClick ? 'button' : 'div';

  return (
    <Tag
      className={`
        flex items-center
        gap-3
        p-3 md:p-3.5
        bg-surface
        rounded-xl
        shadow-xs
        border-0
        hover:shadow-md
        hover:-translate-y-0.5
        transition-all
        text-left
        min-w-0
        ${onClick ? 'cursor-pointer active:scale-[0.99]' : ''}
      `}
      onClick={onClick}
    >
   {image ? (
  <div className="flex-none w-11 h-11 rounded-xl flex items-center justify-center overflow-hidden">
    <img
      src={image}
      alt=""
      className="w-full h-full object-contain"
    />
  </div>
) : (
  <IconBadge
    icon={icon}
    tone={tone}
    size={44}
  />
)}

      <div className="min-w-0 text-left">
        <div className="text-[10px] md:text-xs text-muted font-medium">
          {label}
        </div>

        <div className="text-sm md:text-base font-bold text-ink mt-0.5 truncate tracking-tight tabular-nums">
          {value}
        </div>
      </div>
    </Tag>
  );
}

/* =========================================================
   CREDIT CARD
   Blue / Indigo primary card
   Clean white secondary card
   No unwanted borders
========================================================= */

export function CreditCard({
  card,
  onClick,
  className = '',
}) {
  const money = useMoney();

  const isLight = card.variant === 'light';
  const isPrimary = card.variant === 'primary';

  const cardBase = `
    relative
    rounded-xl
    overflow-hidden
    h-full
    min-h-[155px]
    md:min-h-[165px]
    flex flex-col
    justify-between
    select-none
    transition-all
    duration-300
    hover:-translate-y-0.5
    hover:shadow-lg
    ${card.blocked ? 'grayscale opacity-70' : ''}
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `;

  /* -------------------------------------------------------
     LIGHT CARD
  ------------------------------------------------------- */

  if (isLight) {
    return (
      <div
        className={`
          ${cardBase}
          bg-green-500
          text-ink
          shadow-sm
          border-0
        `}
        onClick={onClick}
      >
        <div>
          <div className="flex justify-between items-start p-3.5 pb-0 relative z-10">
            <div>
              <div className="text-[9px] uppercase tracking-wider font-medium text-muted">
                Balance
              </div>

              <div className="text-sm md:text-base font-bold mt-0.5 tracking-tight tabular-nums">
                {money(card.balance)}
              </div>
            </div>

            {card.blocked ? (
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-neg-soft text-neg">
                Blocked
              </span>
            ) : (
                        <img
  src="/chipcard2.png"
  alt="Membership Card"
  style={{
    width: "18px",
    height: "18px",
    objectFit: "contain",
    display: "block",
    opacity: 1,
    visibility: "visible",
  }}
/>
            )}
          </div>

          <div className="flex gap-6 md:gap-8 px-3.5 pt-2.5 relative z-10">
            <div>
              <div className="text-[8px] uppercase tracking-wider font-medium text-muted">
                CARD HOLDER
              </div>

              <div className="text-[11px] md:text-xs font-semibold mt-0.5 whitespace-nowrap">
                {card.holder}
              </div>
            </div>

            <div>
              <div className="text-[8px] uppercase tracking-wider font-medium text-muted">
                VALID THRU
              </div>

              <div className="text-[11px] md:text-xs font-semibold mt-0.5 whitespace-nowrap">
                {card.validThru}
              </div>
            </div>
          </div>
        </div>

{/* Card number */}
<div className="mt-auto flex justify-between items-center px-4 py-3 relative z-10">

  <span className="text-[11px] md:text-xs font-semibold tracking-[0.18em] text-white">
    {maskCard(card.number)}
  </span>

  {/* Mastercard-style circles */}
  <span
    className="flex items-center -space-x-2 flex-none"
    aria-hidden="true"
  >
    <span className="w-5 h-5 rounded-full bg-white/45" />
    <span className="w-5 h-5 rounded-full bg-white/70" />
  </span>

</div>
      </div>
    );
  }

  /* -------------------------------------------------------
     PRIMARY BLUE CARD
  ------------------------------------------------------- */

  if (isPrimary) {
    return (
      <div
        className={`
          ${cardBase}
          text-white
          shadow-md
        `}
        style={{
          background:
            'linear-gradient(135deg, #e97344 0%, #ed2ff4 50%, #2020F5 100%)',
        }}
        onClick={onClick}
      >
        {/* Soft glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-indigo-300/10 rounded-full blur-2xl pointer-events-none" />

        <div>
          {/* Balance */}
          <div className="flex justify-between items-start p-3.5 pb-0 relative z-10">
            <div>
              <div className="text-[9px] uppercase tracking-wider font-medium text-white/75">
                Balance
              </div>

              <div className="text-sm md:text-base font-bold mt-0.5 tracking-tight tabular-nums">
                {money(card.balance)}
              </div>
            </div>

            {card.blocked ? (
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-white/20 text-white">
                Blocked
              </span>
            ) : (
            <img
  src="/chipcard1.png"
  alt="Membership Card"
  style={{
    width: "18px",
    height: "18px",
    objectFit: "contain",
    display: "block",
    opacity: 1,
    visibility: "visible",
  }}
/>
            )}
          </div>

          {/* Holder */}
          <div className="flex gap-6 md:gap-8 px-3.5 pt-2.5 relative z-10">
            <div>
              <div className="text-[8px] uppercase tracking-wider font-medium text-white/70">
                CARD HOLDER
              </div>

              <div className="text-[11px] md:text-xs font-semibold mt-0.5 whitespace-nowrap">
                {card.holder}
              </div>
            </div>

            <div>
              <div className="text-[8px] uppercase tracking-wider font-medium text-white/70">
                VALID THRU
              </div>

              <div className="text-[11px] md:text-xs font-semibold mt-0.5 whitespace-nowrap">
                {card.validThru}
              </div>
            </div>
          </div>
        </div>

        {/* Card number - NO BORDER */}
        <div className="mt-auto flex justify-between items-center px-3.5 py-2 text-xs font-medium tracking-wider relative z-10 bg-white/5 backdrop-blur-xs">
          <span className="tabular-nums tracking-wider text-[11px] md:text-xs font-semibold">
            {maskCard(card.number)}
          </span>

          {/* Mastercard style circles */}
          <span
            className="flex items-center -space-x-1.5 flex-none"
            aria-hidden="true"
          >
            <i className="inline-block w-4 h-4 rounded-full bg-white/40 backdrop-blur-xs" />
            <i className="inline-block w-4 h-4 rounded-full bg-white/60 backdrop-blur-xs" />
          </span>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------
     DEFAULT DARK CARD
  ------------------------------------------------------- */

  return (
    <div
      className={`
        ${cardBase}
      bg-gradient-to-br
from-[#F97316]
via-[#EA580C]
to-[#9A3412]
        text-white
        shadow-md
      `}
      onClick={onClick}
    >
      <div className="absolute -top-10 -right-10 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />

      <div>
        <div className="flex justify-between items-start p-3.5 pb-0 relative z-10">
          <div>
            <div className="text-[9px] uppercase tracking-wider font-medium text-white/75">
              Balance
            </div>

            <div className="text-sm md:text-base font-bold mt-0.5 tracking-tight tabular-nums">
              {money(card.balance)}
            </div>
          </div>

          {card.blocked ? (
            <span className="px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-neg-soft text-neg">
              Blocked
            </span>
          ) : (
                    <img
  src="/chipcard1.png"
  alt="Membership Card"
  style={{
    width: "18px",
    height: "18px",
    objectFit: "contain",
    display: "block",
    opacity: 1,
    visibility: "visible",
  }}
/>
          )}
        </div>

        <div className="flex gap-6 md:gap-8 px-3.5 pt-2.5 relative z-10">
          <div>
            <div className="text-[8px] uppercase tracking-wider font-medium text-white/70">
              CARD HOLDER
            </div>

            <div className="text-[11px] md:text-xs font-semibold mt-0.5 whitespace-nowrap">
              {card.holder}
            </div>
          </div>

          <div>
            <div className="text-[8px] uppercase tracking-wider font-medium text-white/70">
              VALID THRU
            </div>

            <div className="text-[11px] md:text-xs font-semibold mt-0.5 whitespace-nowrap">
              {card.validThru}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto flex justify-between items-center px-3.5 py-2 text-xs font-medium tracking-wider relative z-10 bg-white/5 backdrop-blur-xs">
        <span className="tabular-nums tracking-wider text-[11px] md:text-xs font-semibold">
          {maskCard(card.number)}
        </span>

        <span
          className="flex items-center -space-x-1.5 flex-none"
          aria-hidden="true"
        >
          <i className="inline-block w-4 h-4 rounded-full bg-white/40" />
          <i className="inline-block w-4 h-4 rounded-full bg-white/55" />
        </span>
      </div>
    </div>
  );
}

/* =========================================================
   MODAL
========================================================= */

export function Modal({
  title,
  onClose,
  children,
  footer,
}) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', onKey);

    return () => {
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div
      className="
        fixed inset-0
        z-50
        bg-black/60
        backdrop-blur-sm
        grid place-items-center
        p-3
        animate-in
        fade-in
        duration-200
      "
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="
          w-full
          max-w-lg
          max-h-[calc(100vh-32px)]
          overflow-y-auto
          bg-surface
          rounded-2xl
          shadow-2xl
          border-0
          p-5
          flex flex-col
          gap-4
          animate-in
          zoom-in-95
          duration-200
        "
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="flex justify-between items-center gap-3 pb-2.5">
          <h3 className="text-base md:text-lg font-bold text-ink">
            {title}
          </h3>

          <button
            className="
              grid place-items-center
              w-8 h-8
              rounded-lg
              text-muted
              hover:text-ink
              hover:bg-bg
              transition-colors
              cursor-pointer
            "
            onClick={onClose}
            aria-label="Close"
          >
            <Icon name="close" size={16} />
          </button>
        </div>

        <div className="flex flex-col gap-3 text-xs md:text-sm text-text">
          {children}
        </div>

        {footer && (
          <div className="flex justify-end gap-2.5 pt-2.5 flex-wrap">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   TABS
========================================================= */

export function Tabs({
  tabs,
  value,
  onChange,
}) {
  return (
    <div
      className="
        flex
        gap-4 md:gap-6
        border-b border-line
        overflow-x-auto
        scrollbar-none
      "
      role="tablist"
    >
      {tabs.map((t) => (
        <button
          key={t.key}
          role="tab"
          aria-selected={value === t.key}
          className={`
            pb-2
            text-xs md:text-sm
            whitespace-nowrap
            transition-all
            border-b-2
            font-medium
            cursor-pointer
            ${
              value === t.key
                ? 'text-primary border-primary font-semibold'
                : 'text-muted border-transparent hover:text-ink'
            }
          `}
          onClick={() => onChange(t.key)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

/* =========================================================
   TOGGLE
========================================================= */

export function Toggle({
  id,
  checked,
  onChange,
  label,
}) {
  return (
    <label
      className="
        inline-flex
        items-center
        gap-3
        cursor-pointer
        select-none
      "
      htmlFor={id}
    >
      <div className="relative">
        <input
          id={id}
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />

        <div className="w-12 h-6 bg-field rounded-full transition-colors peer-checked:bg-primary" />

        <div
          className="
            absolute
            left-0.5
            top-0.5
            w-5
            h-5
            bg-surface
            rounded-full
            shadow-md
            transition-transform
            peer-checked:translate-x-6
          "
        />
      </div>

      <span className="text-xs md:text-sm text-text font-medium">
        {label}
      </span>
    </label>
  );
}

/* =========================================================
   FIELD
========================================================= */

export function Field({
  id,
  label,
  error,
  children,
  ...inputProps
}) {
  return (
    <div className="flex flex-col gap-1.5 min-w-0">
      <label
        htmlFor={id}
        className="text-xs md:text-sm font-medium text-ink"
      >
        {label}
      </label>

      {children || (
        <input
          id={id}
          className={`
            h-9 md:h-10
            px-3
            rounded-xl
            border
            bg-surface
            text-text
            text-xs md:text-sm
            outline-none
            transition-all
            placeholder:text-muted-2
            focus:border-primary
            focus:ring-2
            focus:ring-primary/20
            ${
              error
                ? 'border-neg'
                : 'border-field'
            }
          `}
          {...inputProps}
        />
      )}

      {error && (
        <span className="text-[11px] text-neg font-medium">
          {error}
        </span>
      )}
    </div>
  );
}

/* =========================================================
   PAGINATION
========================================================= */

export function Pagination({
  page,
  pages,
  onChange,
}) {
  if (pages <= 1) {
    return null;
  }

  return (
    <nav
      className="
        flex
        justify-end
        items-center
        gap-1.5
        flex-wrap
        pt-2
      "
      aria-label="Pagination"
    >
      <button
        disabled={page === 1}
        className="
          inline-flex
          items-center
          gap-1
          px-2.5
          py-1.5
          rounded-lg
          text-primary
          text-xs
          font-medium
          hover:bg-primary-soft
          disabled:opacity-40
          disabled:cursor-not-allowed
          transition-colors
          cursor-pointer
        "
        onClick={() => onChange(page - 1)}
      >
        <Icon
          name="chevronLeft"
          size={14}
        />
        Previous
      </button>

      {Array.from(
        { length: pages },
        (_, i) => i + 1
      ).map((n) => (
        <button
          key={n}
          className={`
            w-7
            h-7
            rounded-lg
            text-xs
            font-medium
            grid
            place-items-center
            transition-colors
            cursor-pointer
            ${
              n === page
                ? 'bg-primary text-white font-semibold shadow-sm'
                : 'text-primary hover:bg-primary-soft'
            }
          `}
          onClick={() => onChange(n)}
        >
          {n}
        </button>
      ))}

      <button
        disabled={page === pages}
        className="
          inline-flex
          items-center
          gap-1
          px-2.5
          py-1.5
          rounded-lg
          text-primary
          text-xs
          font-medium
          hover:bg-primary-soft
          disabled:opacity-40
          disabled:cursor-not-allowed
          transition-colors
          cursor-pointer
        "
        onClick={() => onChange(page + 1)}
      >
        Next

        <Icon
          name="chevron"
          size={14}
        />
      </button>
    </nav>
  );
}

/* =========================================================
   TOAST
========================================================= */

export function Toast() {
  const { toast } = useStore();

  if (!toast) {
    return null;
  }

  return (
    <div
      className={`
        fixed
        left-1/2
        bottom-6
        -translate-x-1/2
        z-50
        px-6
        py-3
        rounded-2xl
        shadow-xl
        font-medium
        text-sm
        text-white
        flex
        items-center
        gap-2
        animate-in
        fade-in
        slide-in-from-bottom-3
        duration-200
        ${
          toast.kind === 'err'
            ? 'bg-neg'
            : 'bg-slate-900 dark:bg-slate-800'
        }
      `}
      role="status"
    >
      {toast.kind !== 'err' && (
        <span className="text-accent font-bold">
          ✓
        </span>
      )}

      {toast.text}
    </div>
  );
}

/* =========================================================
   EMPTY
========================================================= */

export function Empty({ children }) {
  return (
    <div className="p-8 text-center text-muted font-medium">
      {children}
    </div>
  );
}