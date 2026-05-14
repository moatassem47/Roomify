const SpecBadge = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-sans font-medium border transition-all duration-200 cursor-pointer
      ${
        active
          ? 'bg-brand-cedar text-white border-brand-cedar shadow-ambient'
          : 'bg-white text-brand-text border-brand-surface-dim hover:border-brand-cedar hover:text-brand-cedar'
      }`}
  >
    <Icon className="w-3.5 h-3.5" />
    {label}
  </button>
);

export default SpecBadge