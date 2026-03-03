import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { Calendar, Clock, User, CheckCircle, Clock3 } from 'lucide-react';

export default function Appointments() {
  const [appointments] = useState([
    {
      id: 1,
      doctorName: 'Dr. Smith',
      patientName: 'John Doe',
      date: '2024-03-10',
      time: '10:00 AM',
      status: 'completed',
      type: 'General Checkup',
    },
    {
      id: 2,
      doctorName: 'Dr. Johnson',
      patientName: 'Jane Smith',
      date: '2024-03-15',
      time: '2:00 PM',
      status: 'scheduled',
      type: 'Consultation',
    },
  ]);

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 w-full">
        <Navbar title="Appointments" />
        <main className="mt-20 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-neutral-900">All Appointments</h2>
          </div>

          <div className="card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Doctor</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Patient</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Time</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((apt) => (
                    <tr key={apt.id} className="border-b border-neutral-200 hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-4 text-neutral-900 font-medium">{apt.doctorName}</td>
                      <td className="px-6 py-4 text-neutral-600">{apt.patientName}</td>
                      <td className="px-6 py-4 text-neutral-600 flex items-center gap-2">
                        <Calendar size={16} />
                        {apt.date}
                      </td>
                      <td className="px-6 py-4 text-neutral-600 flex items-center gap-2">
                        <Clock size={16} />
                        {apt.time}
                      </td>
                      <td className="px-6 py-4 text-neutral-600">{apt.type}</td>
                      <td className="px-6 py-4">
                        {apt.status === 'completed' ? (
                          <span className="badge-success flex items-center gap-2 w-fit">
                            <CheckCircle size={14} />
                            Completed
                          </span>
                        ) : (
                          <span className="badge-pending flex items-center gap-2 w-fit">
                            <Clock3 size={14} />
                            Scheduled
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
