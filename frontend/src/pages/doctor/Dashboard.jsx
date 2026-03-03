import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { Calendar, Clock, Star, Video } from 'lucide-react';

export default function DoctorDashboard() {
  const [todayAppointments] = useState([
    {
      id: 1,
      patientName: 'John Doe',
      time: '10:00 AM',
      type: 'General Checkup',
      status: 'upcoming',
    },
    {
      id: 2,
      patientName: 'Jane Smith',
      time: '11:30 AM',
      type: 'Consultation',
      status: 'upcoming',
    },
  ]);

  const [upcomingAppointments] = useState([
    {
      id: 3,
      patientName: 'Mike Johnson',
      date: '2024-03-15',
      time: '2:00 PM',
      type: 'Follow-up',
    },
    {
      id: 4,
      patientName: 'Sarah Williams',
      date: '2024-03-16',
      time: '3:00 PM',
      type: 'Initial Consultation',
    },
  ]);

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 w-full">
        <Navbar title="Doctor Dashboard" />
        <main className="mt-20 p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-neutral-600 text-sm">Today's Appointments</p>
                  <p className="text-3xl font-bold text-neutral-900 mt-2">5</p>
                </div>
                <Calendar className="text-blue-500" size={32} />
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-neutral-600 text-sm">Average Rating</p>
                  <p className="text-3xl font-bold text-neutral-900 mt-2 flex items-center gap-2">
                    4.8 <Star className="text-yellow-400" size={24} />
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-neutral-600 text-sm">Patients</p>
                  <p className="text-3xl font-bold text-neutral-900 mt-2">156</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Today's Appointments</h2>
              <div className="space-y-4">
                {todayAppointments.map((apt) => (
                  <div key={apt.id} className="card">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-neutral-900">{apt.patientName}</h3>
                        <p className="text-neutral-600 mt-1">{apt.type}</p>
                        <div className="flex items-center gap-2 text-neutral-600 mt-2">
                          <Clock size={16} />
                          <span className="text-sm">{apt.time}</span>
                        </div>
                      </div>
                      <button className="flex items-center gap-2 btn-primary text-sm">
                        <Video size={16} />
                        Join Call
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Upcoming Appointments</h2>
              <div className="space-y-4">
                {upcomingAppointments.map((apt) => (
                  <div key={apt.id} className="card">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-neutral-900">{apt.patientName}</h3>
                        <p className="text-neutral-600 mt-1">{apt.type}</p>
                        <div className="flex items-center gap-2 text-neutral-600 mt-2">
                          <Calendar size={16} />
                          <span className="text-sm">{apt.date} at {apt.time}</span>
                        </div>
                      </div>
                      <button className="btn-secondary text-sm">View</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
