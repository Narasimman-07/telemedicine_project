import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { AlertTriangle, CheckCircle } from 'lucide-react';

export default function Emergency() {
  const [emergencies] = useState([
    {
      id: 1,
      patientName: 'John Doe',
      severity: 'high',
      reason: 'Chest Pain',
      assignedDoctor: 'Dr. Smith',
      status: 'in-progress',
      timestamp: '2024-03-10 15:30',
    },
    {
      id: 2,
      patientName: 'Jane Smith',
      severity: 'critical',
      reason: 'Respiratory Distress',
      assignedDoctor: 'Dr. Johnson',
      status: 'in-progress',
      timestamp: '2024-03-10 16:00',
    },
  ]);

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 w-full">
        <Navbar title="Emergency Cases" />
        <main className="mt-20 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-neutral-900">Active Emergency Cases</h2>
          </div>

          <div className="space-y-4">
            {emergencies.map((emergency) => (
              <div key={emergency.id} className="card border-2 border-red-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <AlertTriangle className="text-red-600 mt-1" size={24} />
                    <div>
                      <h3 className="text-lg font-bold text-neutral-900">{emergency.patientName}</h3>
                      <p className="text-sm text-neutral-600 mt-1">Reason: {emergency.reason}</p>
                      <p className="text-sm text-neutral-600">Assigned: {emergency.assignedDoctor}</p>
                      <p className="text-xs text-neutral-500 mt-2">{emergency.timestamp}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-4 py-2 rounded-lg font-medium text-sm ${
                        emergency.severity === 'critical'
                          ? 'bg-red-600 text-white'
                          : 'bg-orange-600 text-white'
                      }`}
                    >
                      {emergency.severity.toUpperCase()}
                    </span>
                    <div className="mt-3 flex items-center gap-2 text-green-600">
                      <CheckCircle size={16} />
                      <span className="text-sm font-medium">In Progress</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
