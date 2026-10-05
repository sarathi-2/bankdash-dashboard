// Simple stroke icons (24x24) used throughout the dashboard.
const paths = {
  home: <><path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></>,
  transfer: (
  <>
    <path d="M7 4H18L15 1" />
    <path d="M18 4L15 7" />
    <path d="M17 20H6L9 23" />
    <path d="M6 20L9 17" />
    <rect x="8" y="7" width="8" height="10" rx="1" />
  </>
),

  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></>,
  chart: (
    <>
      <path
        fill="currentColor"
        stroke="none"
        d="M4 19h2.8v-7H4v7Zm4.6 0h2.8V7H8.6v12Zm4.6 0H16v-9h-2.8v9Zm4.6 0h2.8V4h-2.8v15Z"
      />
      <path
        d="M3 21h19"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </>
  ),
  card: <><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /><path d="M6 15h4" /></>,
   user: (
    <>
      <circle
        cx="12"
        cy="7.5"
        r="4"
        fill="currentColor"
        stroke="none"
      />
      <path
        fill="currentColor"
        stroke="none"
        d="M4.2 20.8c.5-4.5 3.3-7 7.8-7s7.3 2.5 7.8 7c.1.7-.5 1.2-1.2 1.2H5.4c-.7 0-1.3-.5-1.2-1.2Z"
      />
    </>
  ),
  loan: (
  <>
    {/* Hand */}
    <path
      fill="currentColor"
      stroke="none"
      d="M3.2 15.8c.4-.9 1.5-1.3 2.4-.9l4.8 2.1c.5.2 1 .1 1.4-.2l1.1-.9c.7-.6 1.7-.7 2.5-.3l3.7 2.1c.9.5 1.2 1.6.7 2.5l-.8 1.4c-.4.7-1.1 1.1-1.9 1.1H9.3c-.7 0-1.4-.2-2-.6l-4.1-2.6c-.8-.5-1-1.6-.5-2.4l.5-1.2Z"
    />

    {/* Coin */}
    <circle
      cx="16.5"
      cy="8"
      r="5"
      fill="currentColor"
      stroke="none"
    />

    {/* Dollar */}
    <path
      d="M16.5 5.5v5M14.5 7.9h4"
      stroke="white"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </>
),
  service: (
  <>
    {/* Wrench */}
    <path
      fill="currentColor"
      stroke="none"
      d="M14.8 3.2a5.2 5.2 0 0 0-1.1 5.4L5 17.3a2.2 2.2 0 1 0 3.1 3.1l8.7-8.7a5.2 5.2 0 0 0 5.4-1.1l-3.6-1.1-1.1-3.6-1.1 3.6-3.6-1.1 1.1-3.6Z"
    />

    {/* Screwdriver / second tool */}
    <path
      fill="currentColor"
      stroke="none"
      d="M4.1 4.1a4.8 4.8 0 0 1 6.6 6.6l-2 2L20 24l-2 2L6.7 14.7l-2 2a4.8 4.8 0 0 1-6.6-6.6l3.2 1 2.8-2.8-1-3.2Z"
      transform="translate(1 -1) scale(.9)"
    />
  </>
),
  star: <><path d="M12 2l2.4 4.8 5.3.8-3.8 3.7.9 5.3L12 14.1 7.2 16.6l.9-5.3L4.3 7.6l5.3-.8z" /></>,
  bulb: <><path d="M9 18h6" /><path d="M10 22h4" /><path d="M12 2a7 7 0 00-4 12.7V16h8v-1.3A7 7 0 0012 2z" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></>,
  bell: <><path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 01-3.4 0" /></>,
  menu: <><path d="M3 6h18M3 12h18M3 18h18" /></>,
  close: <><path d="M6 6l12 12M18 6L6 18" /></>,
  send: <><path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4z" /></>,
  chevron: <><path d="M9 6l6 6-6 6" /></>,
  chevronLeft: <><path d="M15 6l-6 6 6 6" /></>,
  paypal: <><path d="M7 21l1.5-9h4a5 5 0 000-10H7L4 21" /><path d="M9.5 12h3a4 4 0 004-4" /></>,
  dollar: <><path d="M12 2v20" /><path d="M17 6H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></>,
  chip: <><rect x="5" y="6" width="14" height="12" rx="2" /><path d="M5 12h14M12 6v12" /></>,
  arrowUp: <><path d="M12 19V5" /><path d="M5 12l7-7 7 7" /></>,
  arrowDown: <><path d="M12 5v14" /><path d="M19 12l-7 7-7-7" /></>,
  wallet: <><path d="M20 7H5a2 2 0 010-4h13v4" /><path d="M3 5v14a2 2 0 002 2h15V7" /><circle cx="16" cy="14" r="1.2" /></>,
  piggy: <><path d="M19 11c0-3.9-3.6-7-8-7S3 7.1 3 11c0 2.2 1.1 4.1 2.8 5.4V20h3v-2h4.4v2h3v-3.6c1-.7 1.8-1.6 2.3-2.6H21v-3h-2z" /><circle cx="15" cy="10" r=".8" /></>,
  briefcase: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" /><path d="M3 13h18" /></>,
  shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></>,
  bag: <><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 01-8 0" /></>,
  heart: <><path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 00-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 000-7.8z" /></>,
  lock: <><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 018 0v4" /></>,
  key: <><circle cx="7.5" cy="15.5" r="4.5" /><path d="M10.7 12.3L21 2" /><path d="M16 7l3 3" /></>,
  google: <><path d="M21 12.2c0-.7-.1-1.4-.2-2H12v3.9h5a4.3 4.3 0 01-1.9 2.8v2.3h3c1.8-1.6 2.9-4.1 2.9-7z" /><path d="M12 21c2.5 0 4.6-.8 6.1-2.2l-3-2.3c-.8.6-1.9.9-3.1.9-2.4 0-4.4-1.6-5.1-3.8H3.8v2.4A9 9 0 0012 21z" /><path d="M6.9 13.6a5.4 5.4 0 010-3.4V7.8H3.8a9 9 0 000 8.1z" /><path d="M12 6.6c1.3 0 2.5.5 3.5 1.4l2.6-2.6A9 9 0 003.8 7.8l3.1 2.4C7.6 8.1 9.6 6.6 12 6.6z" /></>,
  apple: <><path d="M16.4 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9s-1.8-.8-3-.8C6.9 7.4 5.4 8.3 4.6 9.8c-1.6 2.8-.4 6.9 1.1 9.2.8 1.1 1.7 2.3 2.9 2.3 1.1 0 1.6-.7 3-.7s1.8.7 3 .7 2-1.1 2.8-2.2c.9-1.3 1.2-2.5 1.2-2.6 0 0-2.3-.9-2.2-3.9z" /><path d="M14.3 5.6c.6-.8 1.1-1.8.9-2.9-.9 0-2 .6-2.7 1.4-.6.7-1.1 1.8-1 2.8 1 .1 2.1-.5 2.8-1.3z" /></>,
  download: <><path d="M12 3v12" /><path d="M7 10l5 5 5-5" /><path d="M4 21h16" /></>,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  check: <><path d="M4 12l5 5L20 6" /></>,
  gift: <><rect x="3" y="8" width="18" height="4" /><path d="M5 12v9h14v-9" /><path d="M12 8v13" /><path d="M12 8S10.5 3 8 3a2.5 2.5 0 000 5M12 8s1.5-5 4-5a2.5 2.5 0 010 5" /></>,
  plane: <><path d="M17.8 19.2L16 11l3.5-3.5c1.5-1.5 2-3.5 1.5-4.5-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3a14 14 0 010 18M12 3a14 14 0 000 18" /></>,
  headset: <><path d="M3 18v-6a9 9 0 0118 0v6" /><path d="M21 19a2 2 0 01-2 2h-1v-6h3zM3 19a2 2 0 002 2h1v-6H3z" /></>,
  camera: <><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" /></>,
  pencil: <><path d="M17 3l4 4L7 21H3v-4z" /></>,
  trash: <><path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="M6 6l1 15h10l1-15" /></>,
  sun: <><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></>,
  moon: <><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></>,
};

export default function Icon({ name, size = 22, strokeWidth = 1.8, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}
