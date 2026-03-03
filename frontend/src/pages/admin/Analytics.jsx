import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const chartData = [
  { month: 'Jan', appointments: 120, revenue: 4000, patients: 24 },
  { month: 'Feb', appointments: 140, revenue: 3000, patients: 35 },
  { month: 'Mar', appointments: 98, revenue: 2000, patients: 21 },
  { month: 'Apr', appointments: 165, revenue: 2780, patients: 42 },
  { month: 'May', appointments: 130, revenue: 1890, patients: 30 },
];

const departmentData = [
  { name: 'Cardiology', value: 35 },
  { name: 'Neurology', value: 28 },
  { name: 'Orthopedics', value: 25 },
  { name: 'Pediatrics', value: 12 },
];

const COLORS = ['#0066cc', '#10b981', '#f59e0b', '#ef4444'];

export default function Analytics() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 w-full">
        <Navbar title="Analytics" />
        <main className="mt-20 p-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-8">System Analytics</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="card">
              <h3 className="text-lg font-bold text-neutral-900 mb-4">Appointments & Revenue Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="appointments" stroke="#0066cc" strokeWidth={2} />
                  <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <h3 className="text-lg font-bold text-neutral-900 mb-4">Patient Growth</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="patients" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="card">
              <h3 className="text-lg font-bold text-neutral-900 mb-4">Department Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="card col-span-2">
              <h3 className="text-lg font-bold text-neutral-900 mb-4">Key Metrics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                  <span className="text-neutral-700">Avg. Appointments per Day</span>
                  <span className="text-2xl font-bold text-blue-600">23.4</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                  <span className="text-neutral-700">Patient Satisfaction</span>
                  <span className="text-2xl font-bold text-green-600">4.7/5</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg">
                  <span className="text-neutral-700">Doctor Utilization</span>
                  <span className="text-2xl font-bold text-orange-600">85%</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                  <span className="text-neutral-700">System Uptime</span>
                  <span className="text-2xl font-bold text-purple-600">99.9%</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
