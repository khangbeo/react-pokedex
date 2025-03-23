export default function Pagination({
    currentPage,
    totalPages,
    gotoNextPage,
    gotoPrevPage,
    gotoPage,
}) {
    const getPageNumbers = () => {
        const maxVisiblePages = 5;
        let startPage = Math.max(
            1,
            currentPage - Math.floor(maxVisiblePages / 2)
        );
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        // Adjust start page if we're near the end
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        // Create array of page numbers
        const pages = [];
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="flex justify-center items-center gap-2">
            <button
                onClick={gotoPrevPage}
                disabled={!gotoPrevPage}
                className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg font-medium
                    transition-all duration-200 transform hover:-translate-y-0.5
                    ${
                        gotoPrevPage
                            ? "bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }
                `}
                aria-label="Previous page"
            >
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                    />
                </svg>
            </button>

            {/* First page */}
            {currentPage > 2 && !pageNumbers.includes(1) && (
                <>
                    <button
                        onClick={() => gotoPage(1)}
                        className="px-4 py-2 rounded-lg font-medium bg-white text-gray-700 hover:bg-red-500 hover:text-white shadow-md hover:shadow-lg transition-all duration-200"
                    >
                        1
                    </button>
                    {currentPage > 3 && (
                        <span className="px-2 text-gray-500">...</span>
                    )}
                </>
            )}

            {/* Page numbers */}
            {pageNumbers.map((pageNum) => (
                <button
                    key={pageNum}
                    onClick={() => gotoPage(pageNum)}
                    className={`
                        px-4 py-2 rounded-lg font-medium transition-all duration-200
                        ${
                            pageNum === currentPage
                                ? "bg-red-500 text-white shadow-lg"
                                : "bg-white text-gray-700 hover:bg-red-500 hover:text-white shadow-md hover:shadow-lg"
                        }
                    `}
                >
                    {pageNum}
                </button>
            ))}

            {/* Last page */}
            {currentPage < totalPages - 1 &&
                !pageNumbers.includes(totalPages) && (
                    <>
                        {currentPage < totalPages - 2 && (
                            <span className="px-2 text-gray-500">...</span>
                        )}
                        <button
                            onClick={() => gotoPage(totalPages)}
                            className="px-4 py-2 rounded-lg font-medium bg-white text-gray-700 hover:bg-red-500 hover:text-white shadow-md hover:shadow-lg transition-all duration-200"
                        >
                            {totalPages}
                        </button>
                    </>
                )}

            <button
                onClick={gotoNextPage}
                disabled={!gotoNextPage}
                className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg font-medium
                    transition-all duration-200 transform hover:-translate-y-0.5
                    ${
                        gotoNextPage
                            ? "bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }
                `}
                aria-label="Next page"
            >
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                    />
                </svg>
            </button>
        </div>
    );
}
