import { Bell, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar({ title = 'Dashboard' }) {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 right-0 left-64 bg-white border-b border-neutral-200 px-8 py-4 flex items-center justify-between shadow-sm">
      <h1 className="text-2xl font-bold text-neutral-900">{title}</h1>
      
      <div className="flex items-center gap-6">
        <button className="relative text-neutral-600 hover:text-neutral-900 transition-colors">
          <Bell size={24} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 hover:bg-neutral-100 px-3 py-2 rounded-lg transition-colors"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
            <span className="text-sm font-medium text-neutral-900 capitalize">{role}</span>
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 z-50">
              <a href="#profile" className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 text-neutral-700 text-sm">
                <User size={16} />
                Profile
              </a>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 text-red-600 text-sm"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
