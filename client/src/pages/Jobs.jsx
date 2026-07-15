import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs, setFilters } from '../redux/slices/jobSlice';
import SearchFilters from '../components/SearchFilters';
import JobCard from '../components/JobCard';
import { JobCardSkeleton } from '../components/Loader';

const Jobs = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { items, pagination, filters, status } = useSelector((state) => state.jobs);

  useEffect(() => {
    const initial = Object.fromEntries(searchParams.entries());
    if (Object.keys(initial).length) dispatch(setFilters(initial));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const params = { ...filters, page: pagination.page };
    dispatch(fetchJobs(params));
    setSearchParams(Object.fromEntries(Object.entries(params).filter(([, v]) => v)));
  }, [filters, pagination.page]); // eslint-disable-line react-hooks/exhaustive-deps

  const goToPage = (page) => {
    dispatch(fetchJobs({ ...filters, page }));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold">Find your next role</h1>
        <p className="mt-1 text-ink/60 dark:text-paper/60">
          {pagination.total ? `${pagination.total} open roles` : 'Search across live and aggregated jobs'}
        </p>
      </div>

      <SearchFilters filters={filters} onChange={(f) => dispatch(setFilters({ ...f, page: undefined }))} />

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {status === 'loading'
          ? Array.from({ length: 6 }).map((_, i) => <JobCardSkeleton key={i} />)
          : items.map((job) => <JobCard key={job._id} job={job} />)}
      </div>

      {status === 'succeeded' && items.length === 0 && (
        <div className="card mt-8 p-10 text-center text-ink/60 dark:text-paper/60">
          No jobs match your filters. Try broadening your search.
        </div>
      )}

      {pagination.pages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          <button
            disabled={pagination.page <= 1}
            onClick={() => goToPage(pagination.page - 1)}
            className="btn-secondary px-3 py-2 text-sm disabled:opacity-40"
          >
            Prev
          </button>
          {Array.from({ length: pagination.pages }).map((_, i) => (
            <button
              key={i}
              onClick={() => goToPage(i + 1)}
              className={`h-9 w-9 rounded-lg text-sm font-medium transition ${
                pagination.page === i + 1
                  ? 'bg-primary-500 text-white'
                  : 'text-ink/70 hover:bg-black/5 dark:text-paper/70 dark:hover:bg-white/10'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={pagination.page >= pagination.pages}
            onClick={() => goToPage(pagination.page + 1)}
            className="btn-secondary px-3 py-2 text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Jobs;
