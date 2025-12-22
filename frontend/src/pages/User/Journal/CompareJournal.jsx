import React, { useState } from "react";
import api from "../../../api/api";

const CompareJournal = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const [journalNumber, setJournalNumber] = useState("");
  const [searchType, setSearchType] = useState("equal");
  const [charCount, setCharCount] = useState(3);
  const [compareClass, setCompareClass] = useState(false);

  const handleCompare = async () => {
    setLoading(true);
    try {
      const res = await api.post("/journal-compare", {
        journalNumber: journalNumber || undefined,
        searchType,
        charCount,
        clientId: "all", // USER compares all his apps
        compareClass
      });

      setResults(res.data.results || []);
    } catch (err) {
      console.error("Comparison failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Compare Trademark with Journal
        </h1>
        <p className="text-sm text-gray-500">
          Match customer trademarks with published journal trademarks
        </p>
      </div>

      {/* FILTER PANEL */}
      <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

          <input
            type="text"
            placeholder="Journal Number (optional)"
            value={journalNumber}
            onChange={(e) => setJournalNumber(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          />

          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="equal">Exact Match</option>
            <option value="prefix">Prefix Match</option>
            <option value="suffix">Suffix Match</option>
            <option value="contains">Contains</option>
          </select>

          {(searchType === "prefix" || searchType === "suffix") && (
            <input
              type="number"
              min="1"
              placeholder="Character Count"
              value={charCount}
              onChange={(e) => setCharCount(Number(e.target.value))}
              className="border rounded px-3 py-2 text-sm"
            />
          )}

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={compareClass}
              onChange={(e) => setCompareClass(e.target.checked)}
            />
            Match Class
          </label>

          <button
            onClick={handleCompare}
            className="bg-gray-700 text-white rounded px-4 py-2 text-sm hover:bg-gray-800 transition"
          >
            Compare
          </button>

        </div>
      </div>

      {/* RESULT TABLE */}
      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">Customer Trademark</th>
              <th className="px-4 py-3 text-left">Customer Class</th>
              <th className="px-4 py-3 text-left">Journal Trademark</th>
              <th className="px-4 py-3 text-left">Journal Class</th>
              <th className="px-4 py-3 text-left">Journal No</th>
              <th className="px-4 py-3 text-left">Application No</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  Comparing...
                </td>
              </tr>
            ) : results.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No matches found
                </td>
              </tr>
            ) : (
              results.map((row, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">
                    {row.customerTrademark}
                  </td>
                  <td className="px-4 py-3">
                    {row.customerClass?.join(", ")}
                  </td>
                  <td className="px-4 py-3">
                    {row.journalTrademark}
                  </td>
                  <td className="px-4 py-3">
                    {row.journalClass}
                  </td>
                  <td className="px-4 py-3">
                    {row.journalNumber}
                  </td>
                  <td className="px-4 py-3">
                    {row.applicationNo}
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

export default CompareJournal;
