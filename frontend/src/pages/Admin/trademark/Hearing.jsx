import React, { useEffect, useState } from "react";
import api from "../../../api/api";

import { toast } from "react-toastify";

const Hearing = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState("");

  const [applicationInfo, setApplicationInfo] = useState(null);
  const [hearings, setHearings] = useState([]);

  const [form, setForm] = useState({
    hearingDate: "",
    before: "",
    commentsArguments: "",
    advocateAppeared: ""
  });

  const [editId, setEditId] = useState(null);

  // ✅ LOAD APPLICATIONS
  useEffect(() => {
    api.get("/applications").then(res => {
      setApplications(res.data.data || []);
    });
  }, []);

  // ✅ LOAD HEARING BY APPLICATION
  const loadHearings = async (appId) => {
    try {
      const res = await api.get(`/hearings/${appId}`);
      setApplicationInfo(res.data);
      setHearings(res.data.hearings || []);
    } catch {
      setHearings([]);
      setApplicationInfo(null);
    }
  };

  // ✅ HANDLE INPUT
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ SAVE / UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedApp || !form.hearingDate || !form.before) {
      toast.warning("Hearing date & Before are required");
      return;
    }

    try {
      if (editId) {
        await api.put(`/hearings/entry/${editId}`, form);
        toast.success("✅ Hearing Updated");
      } else {
        await api.post("/hearings", {
          application: selectedApp,
          trademark: applicationInfo?.trademark,
          goods: applicationInfo?.goods,
          ...form
        });
        toast.success("✅ Hearing Added");
      }

      setForm({
        hearingDate: "",
        before: "",
        commentsArguments: "",
        advocateAppeared: ""
      });

      setEditId(null);
      loadHearings(selectedApp);

    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  // ✅ EDIT ROW
  const handleEdit = (row) => {
    setForm({
      hearingDate: row.hearingDate.slice(0, 10),
      before: row.before,
      commentsArguments: row.commentsArguments,
      advocateAppeared: row.advocateAppeared
    });
    setEditId(row._id);
  };

  // ✅ DELETE ROW
  const handleDelete = (id) => {
    toast.info(({ closeToast }) => (
      <div>
        <p className="font-semibold mb-2">Delete this hearing?</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={async () => {
              await api.delete(`/hearings/entry/${id}`);
              toast.success("Deleted Successfully");
              loadHearings(selectedApp);
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

      <h2 className="text-2xl font-semibold mb-6">Hearings</h2>

      {/* ✅ SEARCH APPLICATION */}
      <select
        value={selectedApp}
        onChange={(e) => {
          setSelectedApp(e.target.value);
          loadHearings(e.target.value);
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

        <input
          type="date"
          name="hearingDate"
          value={form.hearingDate}
          onChange={handleChange}
          className="p-2 border rounded"
          required
        />

        <input
          name="before"
          value={form.before}
          onChange={handleChange}
          placeholder="Before"
          className="p-2 border rounded"
          required
        />

        <input
          name="commentsArguments"
          value={form.commentsArguments}
          onChange={handleChange}
          placeholder="Comments / Arguments"
          className="p-2 border rounded"
        />

        <input
          name="advocateAppeared"
          value={form.advocateAppeared}
          onChange={handleChange}
          placeholder="Advocate Appeared"
          className="p-2 border rounded"
        />

        <div className="col-span-2 text-right">
          <button className="bg-gray-800 text-white px-8 py-2 rounded">
            {editId ? "Update" : "Save"}
          </button>
        </div>
      </form>

      {/* ✅ TABLE */}
      <table className="w-full border text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Date</th>
            <th className="border p-2">Before</th>
            <th className="border p-2">Arguments</th>
            <th className="border p-2">Advocate</th>
            <th className="border p-2">Edit</th>
            <th className="border p-2">Delete</th>
          </tr>
        </thead>

        <tbody>
          {hearings.map(h => (
            <tr key={h._id}>
              <td className="border p-2">{h.hearingDate.slice(0, 10)}</td>
              <td className="border p-2">{h.before}</td>
              <td className="border p-2">{h.commentsArguments}</td>
              <td className="border p-2">{h.advocateAppeared}</td>

              <td
                className="border p-2 text-blue-600 cursor-pointer"
                onClick={() => handleEdit(h)}
              >
                Edit
              </td>

              <td
                className="border p-2 text-red-600 cursor-pointer"
                onClick={() => handleDelete(h._id)}
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

export default Hearing;
