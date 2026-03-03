import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';
import { Users, Stethoscope, Calendar, DollarSign, AlertCircle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../../api';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="card flex items-center justify-between">
    <div>
      <p className="text-neutral-600 text-sm">{label}</p>
      <p className="text-3xl font-bold text-neutral-900 mt-2">{value || 0}</p>
    </div>
    <div className={`p-4 rounded-lg ${color}`}>
      <Icon size={32} className="text-white" />
    </div>
  </div>
);

const chartData = [
  { month: 'Jan', revenue: 4000, appointments: 120 },
  { month: 'Feb', revenue: 3000, appointments: 140 },
  { month: 'Mar', revenue: 2000, appointments: 98 },
  { month: 'Apr', revenue: 2780, appointments: 165 },
  { month: 'May', revenue: 1890, appointments: 130 },
  { month: 'Jun', revenue: 2390, appointments: 160 },
];

const performanceData = [
  { name: 'Dr. Smith', value: 45 },
  { name: 'Dr. Johnson', value: 38 },
  { name: 'Dr. Williams', value: 32 },
];

const COLORS = ['#0066cc', '#10b981', '#f59e0b'];

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    totalRevenue: 0,
    emergencyCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Replace with actual API calls
        setStats({
          totalDoctors: 12,
          totalPatients: 156,
          totalAppointments: 324,
          totalRevenue: 45000,
          emergencyCount: 8,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 w-full">
        <Navbar title="Dashboard" />
        <main className="mt-20 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <StatCard icon={Stethoscope} label="Total Doctors" value={stats.totalDoctors} color="bg-blue-500" />
            <StatCard icon={Users} label="Total Patients" value={stats.totalPatients} color="bg-green-500" />
            <StatCard icon={Calendar} label="Appointments" value={stats.totalAppointments} color="bg-purple-500" />
            <StatCard icon={DollarSign} label="Revenue" value={`$${stats.totalRevenue}`} color="bg-orange-500" />
            <StatCard icon={AlertCircle} label="Emergency Cases" value={stats.emergencyCount} color="bg-red-500" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="card">
              <h3 className="text-lg font-bold text-neutral-900 mb-4">Revenue per Month</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#0066cc" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <h3 className="text-lg font-bold text-neutral-900 mb-4">Appointments per Day</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="appointments" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">Doctor Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={performanceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {performanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </main>
      </div>
    </div>
  );
}
