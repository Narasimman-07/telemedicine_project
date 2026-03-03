import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import Modal from '../../components/Modal';
import { Plus } from 'lucide-react';

export default function WritePrescription() {
  const [prescriptions, setPrescriptions] = useState([
    {
      id: 1,
      patientName: 'John Doe',
      medications: ['Amoxicillin 500mg - 3 times daily', 'Ibuprofen 200mg - as needed'],
      date: '2024-03-10',
      status: 'active',
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '',
    medications: [''],
    notes: '',
  });

  const handleAddMedication = () => {
    setFormData((prev) => ({
      ...prev,
      medications: [...prev.medications, ''],
    }));
  };

  const handleMedicationChange = (index, value) => {
    const newMeds = [...formData.medications];
    newMeds[index] = value;
    setFormData((prev) => ({
      ...prev,
      medications: newMeds,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPrescription = {
      id: prescriptions.length + 1,
      patientName: formData.patientName,
      medications: formData.medications.filter((m) => m),
      date: new Date().toISOString().split('T')[0],
      status: 'active',
    };
    setPrescriptions([...prescriptions, newPrescription]);
    setFormData({ patientName: '', medications: [''], notes: '' });
    setShowForm(false);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 w-full">
        <Navbar title="Write Prescription" />
        <main className="mt-20 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-neutral-900">Prescriptions</h2>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={20} />
              New Prescription
            </button>
          </div>

          <div className="space-y-4">
            {prescriptions.map((prescription) => (
              <div key={prescription.id} className="card">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-neutral-900">{prescription.patientName}</h3>
                    <p className="text-sm text-neutral-600 mt-2">Date: {prescription.date}</p>
                    <div className="mt-3">
                      <p className="text-sm font-medium text-neutral-700 mb-2">Medications:</p>
                      <ul className="space-y-1">
                        {prescription.medications.map((med, idx) => (
                          <li key={idx} className="text-sm text-neutral-600 ml-4 flex items-start">
                            <span className="mr-2">•</span>
                            <span>{med}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <button className="btn-secondary text-sm">Download PDF</button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

        <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Write New Prescription">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Patient Name
            </label>
            <input
              type="text"
              required
              value={formData.patientName}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  patientName: e.target.value,
                }))
              }
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter patient name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Medications
            </label>
            <div className="space-y-2">
              {formData.medications.map((med, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={med}
                  onChange={(e) => handleMedicationChange(idx, e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g., Amoxicillin 500mg - 3 times daily"
                />
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddMedication}
              className="mt-2 btn-secondary text-sm"
            >
              + Add Medication
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  notes: e.target.value,
                }))
              }
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Additional notes"
              rows="3"
            ></textarea>
          </div>

          <div className="flex gap-3">
            <button type="submit" className="flex-1 btn-primary">
              Save Prescription
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
