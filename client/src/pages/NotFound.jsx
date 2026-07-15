import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
    <p className="font-display text-6xl font-bold text-primary-500">404</p>
    <h1 className="mt-3 font-display text-2xl font-bold">Page not found</h1>
    <p className="mt-2 text-ink/60 dark:text-paper/60">The page you're looking for doesn't exist or has moved.</p>
    <Link to="/" className="btn-primary mt-6">Back to home</Link>
  </div>
);

export default NotFound;
