

const navLinkClass = ({ isActive }) =>
  `flex gap-3 items-center px-2 py-3 rounded-xl mr-2 transition-all ${
    isActive
      ? "bg-[#825032]/10 text-brand-cedar"
      : "text-stone-500 hover:bg-stone-100"
  }`;

  export default navLinkClass