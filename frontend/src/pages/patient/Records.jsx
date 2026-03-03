import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { Upload, Download, FileText } from 'lucide-react';

export default function MedicalRecords() {
  const [records] = useState([
    {
      id: 1,
      title: 'Blood Test Report',
      date: '2024-03-01',
      type: 'Lab Report',
      file: 'blood_test_2024.pdf',
    },
    {
      id: 2,
      title: 'X-Ray Scan',
      date: '2024-02-15',
      type: 'Imaging',
      file: 'xray_chest.pdf',
    },
    {
      id: 3,
      title: 'Vaccination Record',
      date: '2024-01-10',
      type: 'Vaccination',
      file: 'vaccination_record.pdf',
    },
  ]);

  const handleUpload = () => {
    alert('File upload feature would open file picker');
  };

  const handleDownload = (fileName) => {
    alert(`Downloading ${fileName}...`);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 w-full">
        <Navbar title="Medical Records" />
        <main className="mt-20 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-neutral-900">Medical Records</h2>
            <button
              onClick={handleUpload}
              className="btn-primary flex items-center gap-2"
            >
              <Upload size={20} />
              Upload Document
            </button>
          </div>

          <div className="space-y-4">
            {records.map((record) => (
              <div key={record.id} className="card">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 flex-1">
                    <FileText className="text-blue-500 flex-shrink-0 mt-1" size={24} />
                    <div>
                      <h3 className="text-lg font-bold text-neutral-900">{record.title}</h3>
                      <p className="text-neutral-600 text-sm mt-1">{record.type}</p>
                      <p className="text-neutral-500 text-xs mt-2">Uploaded: {record.date}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownload(record.file)}
                    className="flex items-center gap-2 btn-secondary text-sm whitespace-nowrap"
                  >
                    <Download size={16} />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>

          {records.length === 0 && (
            <div className="card text-center py-12">
              <FileText className="mx-auto text-neutral-300 mb-4" size={48} />
              <p className="text-neutral-600">No medical records found</p>
              <p className="text-neutral-500 text-sm mt-2">Upload your first document to get started</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
