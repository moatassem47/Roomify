import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Filter, FunnelX, Search, SlidersHorizontal,  X } from "lucide-react";
import useDebounce from "../../../hooks/useDebounce";
import useFilters from "../../../hooks/useFilters";

const categories = ["Living Room", "Bedroom", "Office", "Hallway", "Kitchen"];

const Filters = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { currentFilters, setFilters, clearFilters } = useFilters([
    "search",
    "sort",
    "category",
    "minPrice",
    "maxPrice",
    "available",
    "rating",
    "page",
  ]);
  const [localSearch, setLocalSearch] = useState(currentFilters.search || "");
  const debouncedSearch = useDebounce(localSearch);
  const [availableOnly, setAvailableOnly] = useState(currentFilters.available === "true");
  

  const maxPrice = currentFilters.maxPrice || "5000";
  const hasFilters = useMemo(
    () => ["search", "sort", "category", "minPrice", "maxPrice", "available", "rating"].some((key) => currentFilters[key]),
    [currentFilters]
  );

  const updateFilter = useCallback((key, value) => {
    setFilters({ [key]: value, page: "1" });
  }, [setFilters]);

  const resetFilters = () => {
    setLocalSearch("");
   
    setAvailableOnly(false);
   
    clearFilters();
  };

  useEffect(() => {
    if (debouncedSearch === (currentFilters.search || "")) return;

    updateFilter("search", debouncedSearch);
  }, [debouncedSearch, currentFilters.search, updateFilter]);

  const filterFields = (
    <>
      <label className="relative min-w-0 flex-1 md:min-w-62">
        <span className="sr-only">Search collection</span>
        <Search className="absolute left-4 top-1/2 h-4 w-4  -translate-y-1/2 text-brand-text/45" />
        <input
          type="search"
          placeholder="Search collection"
          value={localSearch}
          className="h-12 w-full rounded-2xl border border-white/70 bg-white/85 pl-11 pr-4 text-sm text-brand-charcoal shadow-inset-soft outline-none transition focus:border-brand-cedar focus:ring-2 focus:ring-brand-cedar/20"
          onChange={(e) => setLocalSearch(e.target.value)}
        />
      </label>

      <label className="relative min-w-0 md:w-44">
        <span className="sr-only">Category</span>
        <select
          className="h-12 w-full appearance-none rounded-2xl border border-white/70 bg-white/85 px-4 pr-10 text-sm font-medium text-brand-charcoal outline-none transition focus:border-brand-cedar focus:ring-2 focus:ring-brand-cedar/20"
          value={currentFilters.category || ""}
          onChange={(e) => updateFilter("category", e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-text/45" />
      </label>

      <div className="min-w-0 md:w-56">
        <div className="mb-2 flex items-center justify-between text-xs font-semibold text-brand-text/70">
          <span>Price Range</span>
          <span>${Number(maxPrice).toLocaleString()}</span>
        </div>
        <input
          type="range"
          min="25"
          max="100200"
          step="250"
          value={maxPrice}
          className="h-2 w-full cursor-pointer accent-brand-cedar"
          aria-label="Maximum price"
          onChange={(e) => updateFilter("maxPrice", e.target.value)}
        />
      </div>

    

      <button
        type="button"
        aria-pressed={availableOnly}
        onClick={() => {
          const next = !availableOnly;
          setAvailableOnly(next);
          updateFilter("available", next ? "true" : "");
        }}
        className={`flex h-12 items-center justify-between gap-3 rounded-2xl border px-4 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cedar/30 ${
          availableOnly ? "border-brand-sage bg-brand-sage text-white" : "border-white/70 bg-white/85 text-brand-charcoal"
        }`}
      >
        <span>Available</span>
        <span className={`h-5 w-9 rounded-full p-0.5 transition ${availableOnly ? "bg-white/30" : "bg-brand-surface-dim"}`}>
          <span className={`block h-4 w-4 rounded-full bg-white shadow-sm transition ${availableOnly ? "translate-x-4" : ""}`} />
        </span>
      </button>

      

      <button
        type="button"
        onClick={resetFilters}
        disabled={!hasFilters}
        className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-brand-cedar/15 bg-white/70 px-4 text-sm font-semibold text-brand-cedar transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-45 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cedar/30"
      >
        <FunnelX className="h-4 w-4" />
        Reset
      </button>
    </>
  );

  return (
    <div className="sticky top-20 z-30 -mx-4 mb-8 px-4   md:static md:mx-0 md:px-0 md:py-0">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="hidden rounded-b-[20px] border border-white bg-white p-4 shadow-b-ambient backdrop-blur-xl md:flex md:flex-wrap md:items-end md:gap-4"
      >
        {filterFields}
      </motion.div>

      <div className="flex items-center gap-3 rounded-[20px] border border-white bg-white  shadow-ambient backdrop-blur-xl md:hidden">
        <label className="relative flex-1 bg-white">
          <span className="sr-only">Search collection</span>
          <Search className="absolute left-4  top-1/2 h-4 w-4 -translate-y-1/2 text-brand-text/45" />
          <input
            type="search"
            placeholder="Search"
            value={localSearch}
            className="h-11 w-full rounded-2xl border border-brand-surface-container bg-white pl-11 pr-4 text-sm outline-none focus:border-brand-cedar focus:ring-2 focus:ring-brand-cedar/20"
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </label>
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-charcoal text-white transition hover:bg-brand-cedar focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cedar/30"
          aria-label="Open filters"
        >
          <SlidersHorizontal className="h-5 w-5" />
        </button>
      </div>

      <AnimatePresence>
        {drawerOpen && (
          <motion.div className="fixed inset-0  z-50 md:hidden  md:mx-0 md:px-0 md:py-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button className="absolute inset-0 " aria-label="Close filters" onClick={() => setDrawerOpen(false)} />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="absolute right-0 z-2000 top-0 flex h-fit w-full max-w-sm flex-col gap-5 bg-brand-cream p-5 shadow-ambient-hover"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-brand-cedar" />
                  <h2 className="font-serif text-2xl">Filters</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand-charcoal shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cedar/30"
                  aria-label="Close filters"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex flex-col gap-4">{filterFields}</div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Filters;
