import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import Modal from '../../components/Modal';
import Loader from '../../components/Loader';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import api from '../../api';

const DoctorTable = ({ doctors, onApprove, onReject }) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="border-b border-neutral-200 bg-neutral-50">
          <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Name</th>
          <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Email</th>
          <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Specialization</th>
          <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Status</th>
          <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Actions</th>
        </tr>
      </thead>
      <tbody>
        {doctors.map((doctor) => (
          <tr key={doctor.id} className="border-b border-neutral-200 hover:bg-neutral-50 transition-colors">
            <td className="px-6 py-4 text-neutral-900">{doctor.name}</td>
            <td className="px-6 py-4 text-neutral-600">{doctor.email}</td>
            <td className="px-6 py-4 text-neutral-600">{doctor.specialization || 'General'}</td>
            <td className="px-6 py-4">
              {doctor.status === 'approved' && <span className="badge-success">Approved</span>}
              {doctor.status === 'pending' && <span className="badge-pending">Pending</span>}
              {doctor.status === 'rejected' && <span className="badge-danger">Rejected</span>}
            </td>
            <td className="px-6 py-4 flex gap-2">
              {doctor.status === 'pending' && (
                <>
                  <button
                    onClick={() => onApprove(doctor.id)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    <CheckCircle size={20} />
                  </button>
                  <button
                    onClick={() => onReject(doctor.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <XCircle size={20} />
                  </button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default function Doctors() {
  const [doctors, setDoctors] = useState([
    {
      id: 1,
      name: 'Dr. Smith',
      email: 'smith@medcare.com',
      specialization: 'Cardiology',
      status: 'approved',
    },
    {
      id: 2,
      name: 'Dr. Johnson',
      email: 'johnson@medcare.com',
      specialization: 'Neurology',
      status: 'pending',
    },
  ]);
  const [loading, setLoading] = useState(false);

  const handleApprove = async (doctorId) => {
    try {
      // API call to approve doctor
      setDoctors((prev) =>
        prev.map((doc) => (doc.id === doctorId ? { ...doc, status: 'approved' } : doc))
      );
    } catch (error) {
      console.error('Error approving doctor:', error);
    }
  };

  const handleReject = async (doctorId) => {
    try {
      // API call to reject doctor
      setDoctors((prev) =>
        prev.map((doc) => (doc.id === doctorId ? { ...doc, status: 'rejected' } : doc))
      );
    } catch (error) {
      console.error('Error rejecting doctor:', error);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 w-full">
        <Navbar title="Doctors Management" />
        <main className="mt-20 p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-neutral-900">All Doctors</h2>
            <button className="btn-primary">Add Doctor</button>
          </div>

          <div className="card">
            {loading ? <Loader /> : <DoctorTable doctors={doctors} onApprove={handleApprove} onReject={handleReject} />}
          </div>
        </main>
      </div>
    </div>
  );
}
