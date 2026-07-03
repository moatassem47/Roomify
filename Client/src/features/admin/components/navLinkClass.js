

const navLinkClass = ({ isActive }) =>
  `flex gap-3 items-center px-2 py-3 rounded-xl mr-2 transition-all ${
    isActive
      ? "bg-primary/10 text-primary"
      : "text-on-surface-variant hover:bg-surface-container-low"
  }`;

  export default navLinkClass
