import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, requiredRole }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-neutral-900">403</h1>
          <p className="text-xl text-neutral-600 mt-2">Access Denied</p>
          <p className="text-neutral-500 mt-4">You do not have permission to access this page.</p>
          <a href="/" className="btn-primary mt-6 inline-block">
            Go Home
          </a>
        </div>
      </div>
    );
  }

  return children;
}
