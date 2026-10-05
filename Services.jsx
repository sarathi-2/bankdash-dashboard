import { useState } from "react";
import { services } from "../data.js";
import { useStore } from "../store.jsx";
import {
  Page,
  Panel,
  Section,
  StatTile,
  IconBadge,
  Modal,
} from "../components/ui.jsx";

const featured = [
  {
    key: "life",
    icon: "heart",
    image: "/image28.png",
    tone: "teal",
    label: "Life Insurance",
    value: "Unlimited protection",
    service: 5,
  },
  {
    key: "shop",
    icon: "bag",
    image: "/image29.png",
    tone: "amber",
    label: "Shopping",
    value: "Buy. Think. Grow.",
    service: 4,
  },
  {
    key: "safe",
    icon: "shield",
    image: "/image30.png",
    tone: "sky",
    label: "Safety",
    value: "We are your allies",
    service: 2,
  },
];

export default function Services() {
  const { showToast } = useStore();
  const [open, setOpen] = useState(null);

  const serviceImages = [
    "/image31.png",
    "/image32.png",
    "/image33.png",
    "/image34.png",
    "/image35.png",
    "/image36.png",
  ];

  return (
    <Page>
      {/* =====================================================
          FEATURED SERVICES
      ====================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 md:gap-4">
        {featured.map((f) => (
          <StatTile
            key={f.key}
            icon={f.icon}
            image={f.image}
            tone={f.tone}
            label={f.label}
            value={f.value}
            onClick={() =>
              setOpen(services.find((s) => s.id === f.service))
            }
          />
        ))}
      </div>
{/* =====================================================
    BANK SERVICES LIST
====================================================== */}
<Section title="Bank Services List">
  <Panel className="p-0 overflow-hidden">

    {/* Header */}
    <div className="hidden lg:grid grid-cols-[minmax(240px,1.5fr)_1fr_1fr_1fr_110px] items-center gap-4 px-4 py-3 bg-surface-2 border-b border-line">
      <div className="text-[11px] font-semibold text-muted">
        SERVICE
      </div>

      <div className="text-[11px] font-semibold text-muted">
        DETAILS
      </div>

      <div className="text-[11px] font-semibold text-muted">
        INFORMATION
      </div>

      <div className="text-[11px] font-semibold text-muted">
        STATUS
      </div>

      <div></div>
    </div>

    {/* Rows */}
    <div className="divide-y divide-line">
      {services.map((s, index) => (
        <div
          key={s.id}
          className="
            grid
            grid-cols-1
            sm:grid-cols-[minmax(220px,1fr)_auto]
            lg:grid-cols-[minmax(240px,1.5fr)_1fr_1fr_1fr_110px]
            items-center
            gap-3
            lg:gap-4
            px-3
            md:px-4
            py-3
            md:py-3.5
            hover:bg-surface-2/60
            transition-colors
          "
        >
          {/* SERVICE */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex-none w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden">
              <img
                src={serviceImages[index]}
                alt=""
                className="w-full h-full object-contain"
              />
            </div>

            <div className="min-w-0">
              <div className="text-xs md:text-sm font-semibold text-text truncate">
                {s.name}
              </div>

              <div className="text-[10px] md:text-xs text-muted truncate">
                {s.sub}
              </div>
            </div>
          </div>

          {/* DATA COLUMNS */}
          {s.cols.slice(0, 3).map(([a, b], i) => (
            <div
              key={i}
              className="
                hidden
                lg:block
                min-w-0
              "
            >
              <div className="text-[11px] font-semibold text-text truncate">
                {a}
              </div>

              <div className="text-[10px] text-muted truncate mt-0.5">
                {b}
              </div>
            </div>
          ))}

          {/* VIEW DETAILS */}
          <div className="sm:justify-self-end lg:justify-self-end">
            <button
              className="
                inline-flex
                items-center
                justify-center
                min-w-[100px]
                px-3.5
                py-1.5
                rounded-full
                border
                border-primary
                text-primary
                hover:bg-primary-soft
                text-[11px]
                font-semibold
                transition-all
                cursor-pointer
              "
              onClick={() => setOpen(s)}
            >
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  </Panel>
</Section>
      {/* =====================================================
          SERVICE DETAILS MODAL
      ====================================================== */}
      {open && (
        <Modal
          title={open.name}
          onClose={() => setOpen(null)}
          footer={
            <button
              className="px-6 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-dark shadow-sm transition-all"
              onClick={() => {
                showToast(
                  `Request sent for ${open.name}. We'll contact you shortly.`
                );
                setOpen(null);
              }}
            >
              Request this service
            </button>
          }
        >
          <p className="text-sm text-muted leading-relaxed">
            {open.detail}
          </p>

          <dl className="flex flex-col divide-y divide-line text-sm mt-2">
            {open.cols.map(([a, b], i) => (
              <div
                key={i}
                className="flex justify-between py-2"
              >
                <dt className="text-muted">{a}</dt>

                <dd className="font-semibold text-ink">
                  {b}
                </dd>
              </div>
            ))}
          </dl>
        </Modal>
      )}
    </Page>
  );
}