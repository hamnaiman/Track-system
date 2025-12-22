import React, { useState } from "react";
import api from "../../../api/api";

const ManualSearch = () => {
  const [journalNumber, setJournalNumber] = useState("");
  const [applicationNumber, setApplicationNumber] = useState("");
  const [text, setText] = useState("");

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= SEARCH ================= */
  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await api.post("/monthly-journals/search", {
        journalNumber,
        applicationNumber,
        text
      });

      setResults(res.data.data || []);
    } catch (error) {
      console.error("Manual journal search failed", error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= RESET ================= */
  const handleReset = () => {
    setJournalNumber("");
    setApplicationNumber("");
    setText("");
    setResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Manual Journal Search
        </h1>
        <p className="text-sm text-gray-500">
          Search trademarks manually from monthly journal records
        </p>
      </div>

      {/* SEARCH PANEL */}
      <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          <input
            type="text"
            placeholder="Journal Number (optional)"
            value={journalNumber}
            onChange={(e) => setJournalNumber(e.target.value)}
            className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
          />

          <input
            type="text"
            placeholder="Application Number"
            value={applicationNumber}
            onChange={(e) => setApplicationNumber(e.target.value)}
            className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
          />

          <input
            type="text"
            placeholder="Trademark Text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
          />

          <div className="flex gap-2">
            <button
              onClick={handleSearch}
              className="w-full bg-gray-700 text-white rounded px-4 py-2 text-sm hover:bg-gray-800 transition"
            >
              Search
            </button>

            <button
              onClick={handleReset}
              className="w-full border border-gray-300 rounded px-4 py-2 text-sm hover:bg-gray-100 transition"
            >
              Reset
            </button>
          </div>

        </div>
      </div>

      {/* RESULTS TABLE */}
      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">Journal Date</th>
              <th className="px-4 py-3 text-left">Journal No</th>
              <th className="px-4 py-3 text-left">Application No</th>
              <th className="px-4 py-3 text-left">Trademark</th>
              <th className="px-4 py-3 text-left">Class</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  Searching...
                </td>
              </tr>
            ) : results.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No records found
                </td>
              </tr>
            ) : (
              results.map((item) => (
                <tr
                  key={item._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3">
                    {new Date(item.journalDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">{item.journalNumber}</td>
                  <td className="px-4 py-3">{item.applicationNumber}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {item.trademark}
                  </td>
                  <td className="px-4 py-3">{item.class}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default ManualSearch;
