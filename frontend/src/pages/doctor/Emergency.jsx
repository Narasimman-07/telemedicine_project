import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { AlertTriangle, CheckCircle, Phone } from 'lucide-react';

export default function DoctorEmergency() {
  const [emergencies] = useState([
    {
      id: 1,
      patientName: 'John Doe',
      severity: 'high',
      reason: 'Chest Pain',
      status: 'assigned',
      timestamp: '2024-03-10 15:30',
      phone: '+1-234-567-8900',
    },
    {
      id: 2,
      patientName: 'Jane Smith',
      severity: 'critical',
      reason: 'Respiratory Distress',
      status: 'in-consultation',
      timestamp: '2024-03-10 16:00',
      phone: '+1-234-567-8901',
    },
  ]);

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 w-full">
        <Navbar title="Emergency Requests" />
        <main className="mt-20 p-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Emergency Consultations</h2>

          <div className="space-y-4">
            {emergencies.map((emergency) => (
              <div key={emergency.id} className="card border-2 border-red-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <AlertTriangle className="text-red-600 mt-1" size={24} />
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-neutral-900">{emergency.patientName}</h3>
                      <p className="text-sm text-neutral-600 mt-1">Issue: {emergency.reason}</p>
                      <p className="text-xs text-neutral-500 mt-2">Reported: {emergency.timestamp}</p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col gap-3">
                    <span
                      className={`inline-block px-4 py-2 rounded-lg font-medium text-sm text-white ${
                        emergency.severity === 'critical' ? 'bg-red-600' : 'bg-orange-600'
                      }`}
                    >
                      {emergency.severity.toUpperCase()}
                    </span>
                    {emergency.status === 'assigned' && (
                      <span className="inline-block px-4 py-2 rounded-lg font-medium text-sm bg-blue-100 text-blue-800">
                        Assigned to You
                      </span>
                    )}
                    {emergency.status === 'in-consultation' && (
                      <span className="inline-block px-4 py-2 rounded-lg font-medium text-sm bg-green-100 text-green-800 flex items-center gap-2">
                        <CheckCircle size={14} />
                        In Progress
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-neutral-200 flex gap-3">
                  <button className="flex items-center gap-2 btn-primary text-sm">
                    <Phone size={16} />
                    Call Patient
                  </button>
                  <button className="btn-secondary text-sm">
                    Start Video Call
                  </button>
                  <button className="btn-secondary text-sm">
                    View Medical History
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
