import { useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ totalPages }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = Number(searchParams.get("page") || 1);

    const goToPage = (page) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set("page", page);
        setSearchParams(newParams);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

   
    const getVisiblePages = () => {
        if (totalPages <= 5) {
          
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const delta = 1; 
        const range = [];

        for (
            let i = Math.max(2, currentPage - delta);
            i <= Math.min(totalPages - 1, currentPage + delta);
            i++
        ) {
            range.push(i);
        }

       
        if (currentPage - delta > 2) range.unshift("...");
        range.unshift(1); 

        
        if (currentPage + delta < totalPages - 1) range.push("...");
        range.push(totalPages); 

        return range;
    };

    if (totalPages <= 1) return null;

    const visiblePages = getVisiblePages();

    const btnBase = "flex h-11 min-w-11 items-center justify-center rounded-full border px-4 font-semibold text-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cedar/30";
    const btnDefault = "bg-white border-brand-surface-container hover:border-brand-cedar/30 hover:bg-brand-cream text-brand-charcoal shadow-sm";
    const btnActive = "bg-brand-charcoal text-white border-brand-charcoal shadow-ambient";
    const btnNav = "bg-white border-brand-surface-container hover:border-brand-cedar/30 hover:bg-brand-cream disabled:opacity-40 disabled:cursor-not-allowed shadow-sm";

    return (
        <nav aria-label="Page navigation" className="flex justify-center mt-10">
            <ul className="flex flex-wrap items-center justify-center gap-2 text-sm">

                
                <li>
                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`${btnBase} ${btnNav}`}
                        aria-label="Previous page"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">Previous</span>
                    </button>
                </li>

                
                {visiblePages.map((page, i) =>
                    page === "..." ? (
                        <li key={`dots-${i}`}>
                            <span className="flex h-11 min-w-11 items-center justify-center rounded-full px-2 text-brand-surface-dim select-none">
                                &hellip;
                            </span>
                        </li>
                    ) : (
                        <li key={page}>
                            <button
                                onClick={() => goToPage(page)}
                                className={`${btnBase} ${currentPage === page ? btnActive : btnDefault}`}
                                aria-current={currentPage === page ? "page" : undefined}
                            >
                                {page}
                            </button>
                        </li>
                    )
                )}

              
                <li>
                    <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`${btnBase} ${btnNav}`}
                        aria-label="Next page"
                    >
                        <span className="hidden sm:inline">Next</span>
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </li>

            </ul>
        </nav>
    );
}
