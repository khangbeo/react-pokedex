export default function Pagination({ gotoNextPage, gotoPrevPage }) {
    return (
        <div className="flex justify-center text-2xl my-5">
            {gotoPrevPage && <button className="mx-3 bg-red-400 hover:bg-red-600 px-3 py-1 rounded-3xl" onClick={gotoPrevPage}>Previous</button>}
            {gotoNextPage && <button className="mx-3 bg-red-400 hover:bg-red-600 px-3 py-1 rounded-3xl" onClick={gotoNextPage}>Next</button>}
        </div>
    )
}