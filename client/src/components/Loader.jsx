const Loader = ({ fullScreen = false, label = 'Loading…' }) => {
  if (fullScreen) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-paper dark:bg-ink">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-500" />
          <p className="text-sm text-ink/60 dark:text-paper/60">{label}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center py-10">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-500" />
    </div>
  );
};

export const JobCardSkeleton = () => (
  <div className="card p-5">
    <div className="mb-4 flex items-center gap-3">
      <div className="skeleton h-12 w-12 rounded-xl" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-3 w-1/2" />
      </div>
    </div>
    <div className="space-y-2">
      <div className="skeleton h-3 w-full" />
      <div className="skeleton h-3 w-5/6" />
    </div>
    <div className="mt-4 flex gap-2">
      <div className="skeleton h-6 w-16 rounded-full" />
      <div className="skeleton h-6 w-16 rounded-full" />
    </div>
  </div>
);

export default Loader;
