import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  AlertCircle,
  BarChart3,
  FileText,
  Stethoscope,
  LogOut,
} from 'lucide-react';

const adminMenu = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { label: 'Doctors', icon: Stethoscope, path: '/admin/doctors' },
  { label: 'Patients', icon: Users, path: '/admin/patients' },
  { label: 'Appointments', icon: Calendar, path: '/admin/appointments' },
  { label: 'Emergency Cases', icon: AlertCircle, path: '/admin/emergency' },
  { label: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
];

const doctorMenu = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/doctor/dashboard' },
  { label: 'My Appointments', icon: Calendar, path: '/doctor/appointments' },
  { label: 'Emergency Requests', icon: AlertCircle, path: '/doctor/emergency' },
  { label: 'Write Prescription', icon: FileText, path: '/doctor/prescription' },
];

const patientMenu = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/patient/dashboard' },
  { label: 'Book Appointment', icon: Calendar, path: '/patient/book' },
  { label: 'My Appointments', icon: Calendar, path: '/patient/appointments' },
  { label: 'Prescriptions', icon: FileText, path: '/patient/prescriptions' },
  { label: 'Medical Records', icon: FileText, path: '/patient/records' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem('role');

  let menuItems = [];
  if (role === 'admin') menuItems = adminMenu;
  else if (role === 'doctor') menuItems = doctorMenu;
  else if (role === 'patient') menuItems = patientMenu;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-gradient-to-b from-blue-900 to-blue-800 text-white p-6 overflow-y-auto">
      <h2 className="text-2xl font-bold mb-8 text-center">MedCare</h2>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-white text-blue-900 font-medium'
                  : 'text-blue-100 hover:bg-blue-700'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="absolute bottom-6 left-6 right-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 transition-colors text-white font-medium"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
