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

      setResults(res.data?.data || []);
    } catch (error) {
      console.error("Manual journal search failed", error);
      setResults([]);
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
    <div className="flex flex-col gap-6">

      {/* ===== HEADER ===== */}
      <div>
        <h2 className="text-2xl font-semibold text-[#3E4A8A]">
          Manual Journal Search
        </h2>
        <p className="text-sm text-gray-500">
          Search trademarks manually from monthly journal records
        </p>
      </div>

      {/* ===== SEARCH FILTER CARD ===== */}
      <div className="bg-white border rounded-lg shadow-sm p-5">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">

          <div>
            <label className="text-sm font-medium text-gray-700">
              Journal Number
            </label>
            <input
              type="text"
              value={journalNumber}
              onChange={(e) => setJournalNumber(e.target.value)}
              placeholder="Optional"
              className="mt-1 w-full border rounded px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Application Number
            </label>
            <input
              type="text"
              value={applicationNumber}
              onChange={(e) => setApplicationNumber(e.target.value)}
              className="mt-1 w-full border rounded px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Trademark Text
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="mt-1 w-full border rounded px-3 py-2 text-sm"
            />
          </div>

          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-[#3E4A8A] text-white px-5 py-2 rounded hover:bg-[#2f3a72] transition text-sm"
          >
            {loading ? "Searching..." : "Search"}
          </button>

          <button
            onClick={handleReset}
            className="border border-gray-300 px-5 py-2 rounded text-sm hover:bg-gray-100 transition"
          >
            Reset
          </button>

        </div>
      </div>

      {/* ===== RESULTS TABLE ===== */}
      <div className="bg-white border rounded-lg shadow-sm overflow-x-auto">
        <table className="min-w-full text-sm border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="border px-4 py-3 text-left">Journal Date</th>
              <th className="border px-4 py-3 text-left">Journal No</th>
              <th className="border px-4 py-3 text-left">Application No</th>
              <th className="border px-4 py-3 text-left">Trademark</th>
              <th className="border px-4 py-3 text-left">Class</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-500">
                  Searching journal records...
                </td>
              </tr>
            ) : results.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-500">
                  No records found
                </td>
              </tr>
            ) : (
              results.map((item) => (
                <tr
                  key={item._id}
                  className="hover:bg-blue-50 transition"
                >
                  <td className="border px-4 py-2">
                    {new Date(item.journalDate).toLocaleDateString()}
                  </td>
                  <td className="border px-4 py-2">
                    {item.journalNumber}
                  </td>
                  <td className="border px-4 py-2">
                    {item.applicationNumber}
                  </td>
                  <td className="border px-4 py-2 font-medium">
                    {item.trademark}
                  </td>
                  <td className="border px-4 py-2">
                    {item.class}
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

export default ManualSearch;
