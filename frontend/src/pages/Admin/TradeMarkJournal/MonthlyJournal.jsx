import React, { useEffect, useState } from "react";
import api from "../../../api/api";

import { toast } from "react-toastify";

const MonthlyJournal = () => {
  const [journalDate, setJournalDate] = useState("");
  const [journalNumber, setJournalNumber] = useState("");
  const [applicationNumber, setApplicationNumber] = useState("");
  const [trademark, setTrademark] = useState("");
  const [classNo, setClassNo] = useState("");

  const [entries, setEntries] = useState([]);
  const [searchText, setSearchText] = useState("");

  // ---------------------------
  //  LOAD ALL ENTRIES
  // ---------------------------
  const loadEntries = async () => {
    try {
      const res = await api.get("/monthly-journals");
      setEntries(res.data.data || []);
    } catch {
      toast.error("Failed to load journal entries");
    }
  };

  useEffect(() => {
    loadEntries();
  }, []);

  // ---------------------------
  //  ADD JOURNAL ENTRY
  // ---------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!journalDate || !journalNumber || !applicationNumber || !trademark || !classNo) {
      toast.warning("Please fill all fields");
      return;
    }

    try {
      await api.post("/monthly-journal", {
        journalDate,
        journalNumber,
        applicationNumber,
        trademark,
        class: classNo,
      });

      toast.success("Entry Added Successfully");

      // Reset fields
      setJournalDate("");
      setJournalNumber("");
      setApplicationNumber("");
      setTrademark("");
      setClassNo("");

      loadEntries();

    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add entry");
    }
  };

  // ---------------------------
  //  DELETE ENTRY
  // ---------------------------
  const deleteEntry = (id) => {
    toast.info(
      ({ closeToast }) => (
        <div className="flex flex-col gap-3">
          <p className="font-semibold">Delete this Journal Entry?</p>

          <div className="flex justify-end gap-3">
            <button
              onClick={async () => {
                try {
                  await api.delete(`/monthly-journal/${id}`);
                  toast.success("Entry deleted");
                  loadEntries();
                } catch {
                  toast.error("Delete failed");
                }
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

  // ---------------------------
  //  SEARCH JOURNAL
  // ---------------------------
  const handleSearch = async () => {
    try {
      const res = await api.post("/monthly-journal/search", {
        journalNumber,
        applicationNumber,
        text: searchText,
      });

      setEntries(res.data.data || []);
      toast.success("Search Completed");

    } catch {
      toast.error("Search failed");
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow max-w-6xl mx-auto">

      <h2 className="text-2xl font-semibold mb-6">Monthly Journal Entries</h2>

      {/* ------------------ ADD FORM ------------------ */}
      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4 mb-10">

        <input type="date"
          className="p-3 border rounded"
          value={journalDate}
          onChange={(e) => setJournalDate(e.target.value)}
          required
        />

        <input
          className="p-3 border rounded"
          placeholder="Journal Number"
          value={journalNumber}
          onChange={(e) => setJournalNumber(e.target.value)}
        />

        <input
          className="p-3 border rounded"
          placeholder="Application Number"
          value={applicationNumber}
          onChange={(e) => setApplicationNumber(e.target.value)}
        />

        <input
          className="p-3 border rounded col-span-2"
          placeholder="Trademark"
          value={trademark}
          onChange={(e) => setTrademark(e.target.value)}
        />

        <input
          className="p-3 border rounded"
          placeholder="Class"
          type="number"
          min="1"
          max="45"
          value={classNo}
          onChange={(e) => setClassNo(e.target.value)}
        />

        <button className="bg-gray-800 text-white px-6 py-2 rounded col-span-3">
          Add Entry
        </button>

      </form>

      {/* ------------------ SEARCH AREA ------------------ */}
      <div className="bg-gray-100 p-4 rounded mb-6 grid grid-cols-4 gap-4">
        <input
          className="p-2 border rounded"
          placeholder="Search Journal Number"
          value={journalNumber}
          onChange={(e) => setJournalNumber(e.target.value)}
        />

        <input
          className="p-2 border rounded"
          placeholder="Search Application Number"
          value={applicationNumber}
          onChange={(e) => setApplicationNumber(e.target.value)}
        />

        <input
          className="p-2 border rounded"
          placeholder="Search Trademark Text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <button
          onClick={handleSearch}
          className="bg-gray-700 text-white px-6 py-2 rounded"
        >
          Search
        </button>
      </div>

      {/* ------------------ TABLE ------------------ */}
      <table className="w-full border-collapse text-sm mt-4">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">#</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Journal #</th>
            <th className="border p-2">Application #</th>
            <th className="border p-2">Trademark</th>
            <th className="border p-2">Class</th>
            <th className="border p-2">Delete</th>
          </tr>
        </thead>

        <tbody>
          {entries.map((e, i) => (
            <tr key={e._id}>
              <td className="border p-2">{i + 1}</td>
              <td className="border p-2">
                {new Date(e.journalDate).toLocaleDateString()}
              </td>
              <td className="border p-2">{e.journalNumber}</td>
              <td className="border p-2">{e.applicationNumber}</td>
              <td className="border p-2">{e.trademark}</td>
              <td className="border p-2">{e.class}</td>

              <td
                className="border p-2 text-red-600 cursor-pointer"
                onClick={() => deleteEntry(e._id)}
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

export default MonthlyJournal;
