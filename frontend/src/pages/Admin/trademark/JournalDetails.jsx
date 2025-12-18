import React, { useEffect, useState } from "react";
import api from "../../../api/api";

import { toast } from "react-toastify";

const JournalDetails = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState("");
  const [applicationInfo, setApplicationInfo] = useState(null);

  const [entries, setEntries] = useState([]);

  const [form, setForm] = useState({
    jNo: "",
    pageNo: "",
    journalDate: "",
    publishedDate: "",
    remark: ""
  });

  // ✅ LOAD APPLICATIONS
  useEffect(() => {
    api.get("/applications").then(res => {
      setApplications(res.data.data || []);
    });
  }, []);

  // ✅ LOAD JOURNAL BY APPLICATION
  const loadJournal = async (appId) => {
    try {
      const res = await api.get(`/journals/${appId}`);
      setApplicationInfo(res.data.data.application);
      setEntries(res.data.data.entries || []);
    } catch {
      setApplicationInfo(null);
      setEntries([]);
    }
  };

  // ✅ HANDLE INPUT
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ SUBMIT JOURNAL ENTRY
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedApp || !form.jNo || !form.pageNo || !form.journalDate || !form.publishedDate) {
      toast.warning("All required journal fields are mandatory");
      return;
    }

    try {
      await api.post("/journals", {
        applicationId: selectedApp,
        ...form
      });

      toast.success("✅ Journal Entry Added");

      setForm({
        jNo: "",
        pageNo: "",
        journalDate: "",
        publishedDate: "",
        remark: ""
      });

      loadJournal(selectedApp);
    } catch (err) {
      toast.error(err.response?.data?.message || "Journal save failed");
    }
  };

  // ✅ DELETE ENTRY
  const handleDelete = (entryId) => {
    toast.info(({ closeToast }) => (
      <div>
        <p className="font-semibold mb-2">Delete this journal entry?</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={async () => {
              await api.delete(`/journals/${selectedApp}/${entryId}`);
              toast.success("Deleted Successfully");
              loadJournal(selectedApp);
              closeToast();
            }}
            className="bg-red-600 text-white px-4 py-1 rounded"
          >
            Yes
          </button>
          <button onClick={closeToast} className="bg-gray-300 px-4 py-1 rounded">
            Cancel
          </button>
        </div>
      </div>
    ), { autoClose: false });
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow max-w-6xl mx-auto">

      <h2 className="text-2xl font-semibold mb-6">Journal Details</h2>

      {/* ✅ APPLICATION SEARCH */}
      <select
        value={selectedApp}
        onChange={(e) => {
          setSelectedApp(e.target.value);
          loadJournal(e.target.value);
        }}
        className="p-2 border rounded mb-6"
      >
        <option value="">Search by Application</option>
        {applications.map(app => (
          <option key={app._id} value={app._id}>
            {app.applicationNumber} — {app.trademark}
          </option>
        ))}
      </select>

      {applicationInfo && (
        <div className="mb-6 text-sm">
          <p><b>Trademark:</b> {applicationInfo.trademark}</p>
          <p><b>Goods:</b> {applicationInfo.goods}</p>
        </div>
      )}

      {/* ✅ FORM */}
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-8">

        <input name="jNo" value={form.jNo} onChange={handleChange} placeholder="Journal No" className="p-2 border rounded" required />
        <input name="pageNo" value={form.pageNo} onChange={handleChange} placeholder="Page No" className="p-2 border rounded" required />

        <input type="date" name="journalDate" value={form.journalDate} onChange={handleChange} className="p-2 border rounded" required />
        <input type="date" name="publishedDate" value={form.publishedDate} onChange={handleChange} className="p-2 border rounded" required />

        <input name="remark" value={form.remark} onChange={handleChange} placeholder="Remark" className="p-2 border rounded col-span-2" />

        <div className="col-span-2 text-right">
          <button className="bg-gray-800 text-white px-8 py-2 rounded">
            Save
          </button>
        </div>
      </form>

      {/* ✅ TABLE */}
      <table className="w-full border text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Journal #</th>
            <th className="border p-2">Page #</th>
            <th className="border p-2">Journal Date</th>
            <th className="border p-2">Published Date</th>
            <th className="border p-2">Remark</th>
            <th className="border p-2">Delete</th>
          </tr>
        </thead>

        <tbody>
          {entries.map(e => (
            <tr key={e._id}>
              <td className="border p-2">{e.jNo}</td>
              <td className="border p-2">{e.pageNo}</td>
              <td className="border p-2">{e.journalDate.slice(0, 10)}</td>
              <td className="border p-2">{e.publishedDate.slice(0, 10)}</td>
              <td className="border p-2">{e.remark}</td>

              <td
                className="border p-2 text-red-600 cursor-pointer"
                onClick={() => handleDelete(e._id)}
              >
                Delete
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default JournalDetails;
