export const initials = (name) =>
  name ? name.split(' ').filter(Boolean).map((w) => w[0]).join('').slice(0, 2).toUpperCase() : '?';

export const txStyle = {
  Shopping: {
    image: "/shopping.png",
    tone: "amber",
  },

  Transfer: {
    image: "/transfer.png",
    tone: "sky",
  },

  Service: {
    image: "/service.png",
    tone: "teal",
  },
};
export const go = (page) => {
  window.location.hash = page;
};
