import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { Calendar, Clock, FileText, Star } from 'lucide-react';
import Modal from '../../components/Modal';

export default function DoctorAppointments() {
  const [appointments] = useState([
    {
      id: 1,
      patientName: 'John Doe',
      date: '2024-03-10',
      time: '10:00 AM',
      status: 'completed',
      notes: 'General checkup completed',
    },
    {
      id: 2,
      patientName: 'Jane Smith',
      date: '2024-03-12',
      time: '2:00 PM',
      status: 'completed',
      notes: 'Follow-up consultation',
    },
    {
      id: 3,
      patientName: 'Mike Johnson',
      date: '2024-03-15',
      time: '3:00 PM',
      status: 'scheduled',
      notes: '',
    },
  ]);

  const [selectedApt, setSelectedApt] = useState(null);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 w-full">
        <Navbar title="My Appointments" />
        <main className="mt-20 p-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">All Appointments</h2>

          <div className="card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Patient</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Time</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((apt) => (
                    <tr key={apt.id} className="border-b border-neutral-200 hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-4 text-neutral-900 font-medium">{apt.patientName}</td>
                      <td className="px-6 py-4 text-neutral-600 flex items-center gap-2">
                        <Calendar size={16} />
                        {apt.date}
                      </td>
                      <td className="px-6 py-4 text-neutral-600 flex items-center gap-2">
                        <Clock size={16} />
                        {apt.time}
                      </td>
                      <td className="px-6 py-4">
                        {apt.status === 'completed' ? (
                          <span className="badge-success">Completed</span>
                        ) : (
                          <span className="badge-pending">Scheduled</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedApt(apt)}
                          className="text-blue-600 hover:underline text-sm font-medium"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      <Modal
        isOpen={selectedApt !== null}
        onClose={() => setSelectedApt(null)}
        title={`Appointment - ${selectedApt?.patientName}`}
      >
        {selectedApt && (
          <div className="space-y-4">
            <div className="p-4 bg-neutral-50 rounded-lg">
              <p className="text-sm text-neutral-600">Date & Time</p>
              <p className="text-lg font-semibold text-neutral-900 mt-1">
                {selectedApt.date} at {selectedApt.time}
              </p>
            </div>

            {selectedApt.status === 'completed' && (
              <>
                <div className="p-4 bg-neutral-50 rounded-lg">
                  <p className="text-sm text-neutral-600">Notes</p>
                  <p className="text-neutral-900 mt-2">{selectedApt.notes}</p>
                </div>

                {!showRating && (
                  <button
                    onClick={() => setShowRating(true)}
                    className="w-full btn-primary flex items-center justify-center gap-2"
                  >
                    <Star size={18} />
                    Rate Patient
                  </button>
                )}

                {showRating && (
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-neutral-600 mb-3">Patient Rating</p>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          className={`p-2 ${rating >= star ? 'text-yellow-400' : 'text-neutral-300'}`}
                        >
                          <Star size={24} fill="currentColor" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            <button onClick={() => setSelectedApt(null)} className="w-full btn-secondary">
              Close
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
