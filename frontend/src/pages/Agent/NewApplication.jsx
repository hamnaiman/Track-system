// src/pages/Agent/NewApplication.jsx
import React, { useState, useEffect } from 'react';
import api from '../../api/api';

const NewApplication = () => {
  const [customerCode, setCustomerCode] = useState('');
  const [trademark, setTrademark] = useState('');
  const [classNumber, setClassNumber] = useState('');
  const [classes, setClasses] = useState([]);

  const fetchClasses = async () => {
    try {
      const res = await api.get('/classes');
      setClasses(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch classes');
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerCode || !trademark || !classNumber) return alert('All fields required');

    try {
      await api.post('/tm-applications', { customerCode, trademark, classNumber });
      alert('Application submitted successfully');
      setCustomerCode('');
      setTrademark('');
      setClassNumber('');
    } catch (err) {
      console.error(err);
      alert('Failed to submit application');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">New Trademark Application</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md">
        <input
          type="text"
          value={customerCode}
          onChange={(e) => setCustomerCode(e.target.value)}
          placeholder="Customer Code"
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          value={trademark}
          onChange={(e) => setTrademark(e.target.value)}
          placeholder="Trademark Name"
          className="border p-2 rounded"
          required
        />
        <select
          value={classNumber}
          onChange={(e) => setClassNumber(e.target.value)}
          className="border p-2 rounded"
          required
        >
          <option value="">Select Class</option>
          {classes.map(c => (
            <option key={c._id} value={c.classNumber}>{c.classNumber} - {c.description}</option>
          ))}
        </select>
        <button type="submit" className="bg-yellow-500 text-white px-4 py-2 rounded">Add Application</button>
      </form>
    </div>
  );
};

export default NewApplication;
