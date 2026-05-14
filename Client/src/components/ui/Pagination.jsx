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

    const btnBase = "flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-base border font-medium text-sm transition-colors";
    const btnDefault = "bg-white border-brand-surface-container hover:bg-brand-surface-container text-brand-charcoal";
    const btnActive = "bg-brand-cedar text-white border-brand-cedar";
    const btnNav = "bg-white border-brand-surface-container hover:bg-brand-surface-container disabled:opacity-40 disabled:cursor-not-allowed";

    return (
        <nav aria-label="Page navigation" className="flex justify-center mt-8">
            <ul className="flex items-center gap-1 text-sm">

                {/* Previous */}
                <li>
                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`${btnBase} ${btnNav}`}
                        aria-label="Previous page"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                </li>

                {/* Page Numbers with Ellipsis */}
                {visiblePages.map((page, i) =>
                    page === "..." ? (
                        <li key={`dots-${i}`}>
                            <span className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-brand-surface-dim select-none">
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

                {/* Next */}
                <li>
                    <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`${btnBase} ${btnNav}`}
                        aria-label="Next page"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </li>

            </ul>
        </nav>
    );
}
