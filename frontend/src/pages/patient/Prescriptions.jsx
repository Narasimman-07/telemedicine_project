import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { FileText, Download } from 'lucide-react';

export default function Prescriptions() {
  const [prescriptions] = useState([
    {
      id: 1,
      doctorName: 'Dr. Smith',
      date: '2024-03-10',
      medications: ['Amoxicillin 500mg - 3 times daily for 5 days', 'Ibuprofen 200mg - as needed'],
      status: 'active',
    },
    {
      id: 2,
      doctorName: 'Dr. Johnson',
      date: '2024-02-28',
      medications: ['Aspirin 100mg - once daily', 'Metformin 500mg - twice daily'],
      status: 'expired',
    },
  ]);

  const handleDownload = (id) => {
    alert(`Downloading prescription ${id}...`);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 w-full">
        <Navbar title="Prescriptions" />
        <main className="mt-20 p-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">My Prescriptions</h2>

          <div className="space-y-4">
            {prescriptions.map((prescription) => (
              <div key={prescription.id} className="card">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 flex-1">
                    <FileText className="text-blue-500 flex-shrink-0 mt-1" size={24} />
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-neutral-900">
                        Prescription from {prescription.doctorName}
                      </h3>
                      <p className="text-neutral-600 text-sm mt-1">Date: {prescription.date}</p>

                      <div className="mt-4">
                        <p className="text-sm font-medium text-neutral-700 mb-2">Medications:</p>
                        <ul className="space-y-1">
                          {prescription.medications.map((med, idx) => (
                            <li
                              key={idx}
                              className="text-sm text-neutral-600 ml-4 flex items-start"
                            >
                              <span className="mr-2">•</span>
                              <span>{med}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        prescription.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {prescription.status === 'active' ? 'Active' : 'Expired'}
                    </span>
                    <button
                      onClick={() => handleDownload(prescription.id)}
                      className="flex items-center gap-2 btn-secondary text-sm"
                    >
                      <Download size={16} />
                      PDF
                    </button>
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
