import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import Modal from '../../components/Modal';
import { AlertCircle, Calendar } from 'lucide-react';

export default function BookAppointment() {
  const [doctors] = useState([
    { id: 1, name: 'Dr. Smith', specialty: 'Cardiology', rating: 4.8, availability: ['10:00 AM', '2:00 PM', '4:00 PM'] },
    { id: 2, name: 'Dr. Johnson', specialty: 'Neurology', rating: 4.6, availability: ['9:00 AM', '11:00 AM', '3:00 PM'] },
    { id: 3, name: 'Dr. Williams', specialty: 'Orthopedics', rating: 4.7, availability: ['1:00 PM', '3:00 PM', '5:00 PM'] },
  ]);

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isEmergency, setIsEmergency] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const handleBookAppointment = () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      alert('Please fill all fields');
      return;
    }
    setShowPayment(true);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 w-full">
        <Navbar title="Book Appointment" />
        <main className="mt-20 p-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Find & Book a Doctor</h2>

          <div className="mb-6 flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
            <input
              type="checkbox"
              id="emergency"
              checked={isEmergency}
              onChange={(e) => setIsEmergency(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded"
            />
            <label htmlFor="emergency" className="flex items-center gap-2 cursor-pointer">
              <AlertCircle size={20} className="text-red-600" />
              <span className="font-medium text-neutral-900">Emergency Booking</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                onClick={() => setSelectedDoctor(doctor)}
                className={`card cursor-pointer transition-all ${
                  selectedDoctor?.id === doctor.id
                    ? 'ring-2 ring-blue-600 shadow-card-hover'
                    : 'hover:shadow-card-hover'
                }`}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg font-bold text-center text-neutral-900">{doctor.name}</h3>
                <p className="text-sm text-center text-neutral-600 mt-1">{doctor.specialty}</p>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <span className="text-yellow-400">★</span>
                  <span className="text-sm font-medium text-neutral-900">{doctor.rating}</span>
                </div>
              </div>
            ))}
          </div>

          {selectedDoctor && (
            <div className="card">
              <h3 className="text-xl font-bold text-neutral-900 mb-6">
                Booking with {selectedDoctor.name}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Select Time
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Choose a time slot</option>
                    {selectedDoctor.availability.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Reason for Visit
                </label>
                <textarea
                  placeholder="Brief description of your symptoms or reason for visit"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  rows="4"
                ></textarea>
              </div>

              <button
                onClick={handleBookAppointment}
                className="btn-primary w-full mt-6"
              >
                Continue to Payment
              </button>
            </div>
          )}

          <Modal
            isOpen={showPayment}
            onClose={() => setShowPayment(false)}
            title="Payment"
          >
            <div className="space-y-4">
              <div className="p-4 bg-neutral-50 rounded-lg">
                <p className="text-sm text-neutral-600">Appointment Fee</p>
                <p className="text-2xl font-bold text-neutral-900 mt-1">$50.00</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <button className="w-full btn-primary">
                Pay $50.00
              </button>
            </div>
          </Modal>
        </main>
      </div>
    </div>
  );
}
