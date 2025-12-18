import React, { useState } from "react";
import api from "../../../api/api";

import { toast } from "react-toastify";

const SearchManualJournal = () => {
  const [journalNo, setJournalNo] = useState("");
  const [textToSearch, setTextToSearch] = useState("");
  const [applicationNo, setApplicationNo] = useState("");
  const [results, setResults] = useState([]);

  // 🔍 SEARCH FUNCTION
  const handleSearch = async () => {
    if (!journalNo && !textToSearch && !applicationNo) {
      toast.warning("Enter at least one search criteria");
      return;
    }

    try {
      const res = await api.post("/monthly-journal/search", {
        journalNumber: journalNo,
        text: textToSearch,
        applicationNumber: applicationNo,
      });

      setResults(res.data.data || []);
      toast.success("Search completed");

    } catch (err) {
      toast.error(err.response?.data?.message || "Search failed");
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Search Manual TM in Journal</h2>

      {/* FORM */}
      <div className="grid grid-cols-2 gap-4">

        <div>
          <label className="font-semibold text-sm">Journal #</label>
          <input
            value={journalNo}
            onChange={(e) => setJournalNo(e.target.value)}
            className="border px-3 py-2 rounded w-full"
            placeholder="Journal Number"
          />
        </div>

        <div>
          <label className="font-semibold text-sm">Text to Search</label>
          <input
            value={textToSearch}
            onChange={(e) => setTextToSearch(e.target.value)}
            className="border px-3 py-2 rounded w-full"
            placeholder="Trademark keywords"
          />
        </div>

        <div className="col-span-2">
          <label className="font-semibold text-sm">Application #</label>
          <input
            value={applicationNo}
            onChange={(e) => setApplicationNo(e.target.value)}
            className="border px-3 py-2 rounded w-full"
            placeholder="Application Number"
          />
        </div>

        <button
          onClick={handleSearch}
          className="bg-gray-800 text-white px-6 py-2 rounded mt-4 col-span-2"
        >
          Generate
        </button>
      </div>

      {/* RESULTS TABLE */}
      {results.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">
            Results Found ({results.length})
          </h3>

          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2">Journal #</th>
                <th className="border p-2">Application #</th>
                <th className="border p-2">Trademark</th>
                <th className="border p-2">Class</th>
                <th className="border p-2">Journal Date</th>
              </tr>
            </thead>

            <tbody>
              {results.map((r, i) => (
                <tr key={i}>
                  <td className="border p-2">{r.journalNumber}</td>
                  <td className="border p-2">{r.applicationNumber}</td>
                  <td className="border p-2">{r.trademark}</td>
                  <td className="border p-2">{r.class}</td>
                  <td className="border p-2">
                    {new Date(r.journalDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};

export default SearchManualJournal;
