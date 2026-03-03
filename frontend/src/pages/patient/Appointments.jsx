import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import Modal from '../../components/Modal';
import { Calendar, Clock, Star, MessageSquare } from 'lucide-react';

export default function PatientAppointments() {
  const [appointments] = useState([
    {
      id: 1,
      doctorName: 'Dr. Smith',
      specialty: 'Cardiology',
      date: '2024-03-10',
      time: '10:00 AM',
      status: 'completed',
      notes: 'General checkup completed. All good.',
      rating: 5,
    },
    {
      id: 2,
      doctorName: 'Dr. Johnson',
      specialty: 'Neurology',
      date: '2024-03-15',
      time: '2:00 PM',
      status: 'scheduled',
      notes: '',
      rating: 0,
    },
  ]);

  const [selectedApt, setSelectedApt] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const handleSubmitRating = () => {
    alert(`Thank you for rating Dr. ${selectedApt.doctorName}! Your feedback helps us improve.`);
    setRating(0);
    setFeedback('');
    setSelectedApt(null);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 w-full">
        <Navbar title="My Appointments" />
        <main className="mt-20 p-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">All Appointments</h2>

          <div className="grid grid-cols-1 gap-6">
            {appointments.map((apt) => (
              <div key={apt.id} className="card">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-neutral-900">{apt.doctorName}</h3>
                    <p className="text-neutral-600 text-sm mt-1">{apt.specialty}</p>
                    <div className="flex items-center gap-4 mt-3 text-neutral-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span className="text-sm">{apt.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} />
                        <span className="text-sm">{apt.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {apt.status === 'completed' ? (
                      <span className="badge-success">Completed</span>
                    ) : (
                      <span className="badge-pending">Scheduled</span>
                    )}
                    {apt.status === 'completed' && !apt.rating && (
                      <button
                        onClick={() => setSelectedApt(apt)}
                        className="btn-secondary text-sm flex items-center justify-center gap-2"
                      >
                        <Star size={16} />
                        Rate
                      </button>
                    )}
                    {apt.rating > 0 && (
                      <div className="flex items-center gap-1">
                        {[...Array(apt.rating)].map((_, i) => (
                          <Star key={i} size={16} fill="currentColor" className="text-yellow-400" />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {apt.notes && (
                  <div className="mt-4 p-4 bg-neutral-50 rounded-lg">
                    <p className="text-sm text-neutral-600">
                      <strong>Doctor's Notes:</strong> {apt.notes}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>

      <Modal
        isOpen={selectedApt !== null && !selectedApt.rating}
        onClose={() => setSelectedApt(null)}
        title={`Rate Your Appointment with ${selectedApt?.doctorName}`}
      >
        <div className="space-y-4">
          <p className="text-neutral-600 text-sm">How was your experience?</p>
          <div className="flex gap-2 justify-center mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`p-2 transition-colors ${
                  rating >= star ? 'text-yellow-400' : 'text-neutral-300'
                }`}
              >
                <Star size={32} fill="currentColor" />
              </button>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Your Feedback
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your experience..."
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              rows="3"
            ></textarea>
          </div>

          <button onClick={handleSubmitRating} className="w-full btn-primary">
            Submit Rating
          </button>
        </div>
      </Modal>
    </div>
  );
}
