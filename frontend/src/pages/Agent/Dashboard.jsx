// src/pages/Agent/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import api from '../../api/api';

const Dashboard = () => {
  const [applications, setApplications] = useState([]);

  const fetchApplications = async () => {
    try {
      const res = await api.get('/tm-applications'); // fetch only assigned to agent if backend supports
      setApplications(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch applications');
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Agent Dashboard</h2>
      <p>Total Applications: {applications.length}</p>

      <table className="w-full border-collapse border border-gray-300 mt-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">#</th>
            <th className="border p-2">Customer Code</th>
            <th className="border p-2">Trademark</th>
            <th className="border p-2">Class</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app, i) => (
            <tr key={app._id}>
              <td className="border p-2">{i + 1}</td>
              <td className="border p-2">{app.customerCode}</td>
              <td className="border p-2">{app.trademark}</td>
              <td className="border p-2">{app.classNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
