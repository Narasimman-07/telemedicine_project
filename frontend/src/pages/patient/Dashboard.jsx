import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { Calendar, AlertCircle, FileText, DollarSign } from 'lucide-react';

export default function PatientDashboard() {
  const [stats] = useState({
    upcomingAppointments: 2,
    completedAppointments: 8,
    activePrescriptions: 1,
    totalSpent: 1250,
  });

  const [upcomingAppointments] = useState([
    {
      id: 1,
      doctorName: 'Dr. Smith',
      specialty: 'Cardiology',
      date: '2024-03-15',
      time: '2:00 PM',
      type: 'Follow-up',
    },
    {
      id: 2,
      doctorName: 'Dr. Johnson',
      specialty: 'Neurology',
      date: '2024-03-20',
      time: '10:00 AM',
      type: 'Consultation',
    },
  ]);

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-neutral-600 text-sm">{label}</p>
          <p className="text-3xl font-bold text-neutral-900 mt-2">{value}</p>
        </div>
        <div className={`p-4 rounded-lg ${color}`}>
          <Icon size={32} className="text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 w-full">
        <Navbar title="Patient Dashboard" />
        <main className="mt-20 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard icon={Calendar} label="Upcoming Appointments" value={stats.upcomingAppointments} color="bg-blue-500" />
            <StatCard icon={FileText} label="Completed Appointments" value={stats.completedAppointments} color="bg-green-500" />
            <StatCard icon={FileText} label="Active Prescriptions" value={stats.activePrescriptions} color="bg-purple-500" />
            <StatCard icon={DollarSign} label="Total Spent" value={`$${stats.totalSpent}`} color="bg-orange-500" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Upcoming Appointments</h2>
              <div className="space-y-4">
                {upcomingAppointments.map((apt) => (
                  <div key={apt.id} className="card">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-neutral-900">{apt.doctorName}</h3>
                        <p className="text-neutral-600 text-sm mt-1">{apt.specialty}</p>
                        <p className="text-neutral-600 text-sm mt-2">{apt.type}</p>
                        <div className="flex items-center gap-2 text-neutral-600 mt-3">
                          <Calendar size={16} />
                          <span className="text-sm">{apt.date} at {apt.time}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button className="btn-primary text-sm">Reschedule</button>
                        <button className="btn-secondary text-sm">Cancel</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full btn-primary flex items-center justify-center gap-2">
                  <Calendar size={18} />
                  Book Appointment
                </button>
                <button className="w-full btn-secondary flex items-center justify-center gap-2">
                  <FileText size={18} />
                  View Records
                </button>
                <button className="w-full btn-secondary flex items-center justify-center gap-2">
                  <AlertCircle size={18} />
                  Emergency Call
                </button>
              </div>

              <div className="card mt-4">
                <h3 className="font-bold text-neutral-900 mb-3">Health Tips</h3>
                <ul className="space-y-2 text-sm text-neutral-600">
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Stay hydrated - Drink at least 8 glasses of water daily</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Exercise regularly - Aim for 30 minutes daily</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Get adequate sleep - 7-9 hours per night</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
