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
    remark: "",
  });

  /* ================= LOAD APPLICATIONS ================= */
  useEffect(() => {
    api.get("/applications").then((res) => {
      setApplications(res.data.data || []);
    });
  }, []);

  /* ================= LOAD JOURNAL ================= */
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

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !selectedApp ||
      !form.jNo ||
      !form.pageNo ||
      !form.journalDate ||
      !form.publishedDate
    ) {
      toast.warning("All required fields are mandatory");
      return;
    }

    try {
      await api.post("/journals", {
        applicationId: selectedApp,
        ...form,
      });

      toast.success("Journal entry added");

      setForm({
        jNo: "",
        pageNo: "",
        journalDate: "",
        publishedDate: "",
        remark: "",
      });

      loadJournal(selectedApp);
    } catch (err) {
      toast.error(err.response?.data?.message || "Journal save failed");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = (entryId) => {
    toast.info(
      ({ closeToast }) => (
        <div className="space-y-3">
          <p className="font-semibold text-sm">
            Delete this journal entry?
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={async () => {
                await api.delete(`/journals/${selectedApp}/${entryId}`);
                toast.success("Deleted successfully");
                loadJournal(selectedApp);
                closeToast();
              }}
              className="bg-red-600 text-white px-4 py-1 rounded"
            >
              Yes
            </button>
            <button
              onClick={closeToast}
              className="bg-gray-300 px-4 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { autoClose: false }
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      {/* ================= HEADER ================= */}
      <div>
        <h2 className="text-2xl font-bold text-[#3E4A8A]">
          Journal Details
        </h2>
        <p className="text-sm text-gray-500">
          Manage trademark journal publications
        </p>
      </div>

      {/* ================= APPLICATION SELECT ================= */}
      <div className="bg-white p-6 rounded-2xl shadow border">
        <select
          value={selectedApp}
          onChange={(e) => {
            setSelectedApp(e.target.value);
            loadJournal(e.target.value);
          }}
          className="w-full md:w-1/2 px-4 py-3 rounded-lg bg-gray-100 border
                     focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <option value="">Search by Application</option>
          {applications.map((app) => (
            <option key={app._id} value={app._id}>
              {app.applicationNumber} — {app.trademark}
            </option>
          ))}
        </select>

        {applicationInfo && (
          <div className="mt-4 text-sm text-gray-700 space-y-1">
            <p><b>Trademark:</b> {applicationInfo.trademark}</p>
            <p><b>Goods:</b> {applicationInfo.goods}</p>
          </div>
        )}
      </div>

      {/* ================= FORM ================= */}
      <div className="bg-white p-6 rounded-2xl shadow border">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <Input name="jNo" value={form.jNo} onChange={handleChange} placeholder="Journal No" />
          <Input name="pageNo" value={form.pageNo} onChange={handleChange} placeholder="Page No" />

          <Input type="date" name="journalDate" value={form.journalDate} onChange={handleChange} />
          <Input type="date" name="publishedDate" value={form.publishedDate} onChange={handleChange} />

          <Input
            name="remark"
            value={form.remark}
            onChange={handleChange}
            placeholder="Remark"
            className="md:col-span-2"
          />

          <div className="md:col-span-2 text-right">
            <button className="bg-[#3E4A8A] hover:bg-[#2f3970]
                               text-white px-8 py-3 rounded-lg font-semibold">
              Save Journal Entry
            </button>
          </div>
        </form>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-2xl shadow border overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3 border">Journal #</th>
              <th className="p-3 border">Page #</th>
              <th className="p-3 border">Journal Date</th>
              <th className="p-3 border">Published Date</th>
              <th className="p-3 border">Remark</th>
              <th className="p-3 border text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-500">
                  No journal entries found
                </td>
              </tr>
            ) : (
              entries.map((e) => (
                <tr key={e._id} className="hover:bg-gray-50">
                  <td className="p-3 border">{e.jNo}</td>
                  <td className="p-3 border">{e.pageNo}</td>
                  <td className="p-3 border">{e.journalDate.slice(0, 10)}</td>
                  <td className="p-3 border">{e.publishedDate.slice(0, 10)}</td>
                  <td className="p-3 border">{e.remark || "-"}</td>
                  <td className="p-3 border text-center">
                    <button
                      onClick={() => handleDelete(e._id)}
                      className="text-red-600 font-semibold"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default JournalDetails;

/* ================= INPUT ================= */
const Input = ({ className = "", ...props }) => (
  <input
    {...props}
    className={`px-4 py-3 rounded-lg bg-gray-100 border
                focus:outline-none focus:ring-2 focus:ring-blue-200 ${className}`}
  />
);
