import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { Mail, Phone, Calendar } from 'lucide-react';

export default function Patients() {
  const [patients] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1-234-567-8900',
      joinDate: '2024-01-15',
      lastVisit: '2024-03-01',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1-234-567-8901',
      joinDate: '2024-02-10',
      lastVisit: '2024-02-28',
    },
  ]);

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 w-full">
        <Navbar title="Patients Management" />
        <main className="mt-20 p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-neutral-900">All Patients</h2>
            <button className="btn-primary">Add Patient</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {patients.map((patient) => (
              <div key={patient.id} className="card">
                <h3 className="text-lg font-bold text-neutral-900">{patient.name}</h3>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-3 text-neutral-600">
                    <Mail size={16} />
                    <span className="text-sm">{patient.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-neutral-600">
                    <Phone size={16} />
                    <span className="text-sm">{patient.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-neutral-600">
                    <Calendar size={16} />
                    <span className="text-sm">Joined: {patient.joinDate}</span>
                  </div>
                </div>
                <button className="w-full btn-secondary mt-4">View Details</button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
