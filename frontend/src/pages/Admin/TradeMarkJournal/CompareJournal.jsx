import React, { useEffect, useState } from "react";
import api from "../../../api/api";

import { toast } from "react-toastify";

const CompareJournal = () => {
  const [journalNo, setJournalNo] = useState("");
  const [charCount, setCharCount] = useState("");
  const [searchType, setSearchType] = useState("equal");
  const [clientId, setClientId] = useState("all");
  const [compareClass, setCompareClass] = useState(false);

  const [clients, setClients] = useState([]);
  const [results, setResults] = useState([]);

  // Load clients
  const loadClients = async () => {
    try {
      const res = await api.get("/customers");
      setClients(res.data?.data || []);
    } catch {
      toast.error("Failed to load clients");
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const generateReport = async () => {
    if (!searchType) {
      toast.warning("Select a search type");
      return;
    }

    try {
      const res = await api.post("/compare-journal", {
        journalNumber: journalNo,
        searchType,
        charCount: Number(charCount),
        clientId,
        compareClass,
      });

      setResults(res.data.results || []);
      toast.success("Match results generated");

    } catch (err) {
      toast.error(err.response?.data?.message || "Search failed");
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Compare Trademark With Journal</h2>

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
          <label className="font-semibold text-sm">No. of Characters</label>
          <select
            value={charCount}
            onChange={(e) => setCharCount(e.target.value)}
            className="border px-3 py-2 rounded w-full"
          >
            <option value="">Select No. of Characters</option>
            <option value="3">3 Characters</option>
            <option value="4">4 Characters</option>
            <option value="5">5 Characters</option>
            <option value="6">6 Characters</option>
          </select>
        </div>

        <div>
          <label className="font-semibold text-sm">Search Type</label>
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="border px-3 py-2 rounded w-full"
          >
            <option value="equal">Equal</option>
            <option value="prefix">Prefix</option>
            <option value="suffix">Suffix</option>
            <option value="contains">Contains</option>
          </select>
        </div>

        <div>
          <label className="font-semibold text-sm">Client</label>
          <select
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="border px-3 py-2 rounded w-full"
          >
            <option value="all">All Clients</option>
            {clients.map((c) => (
              <option value={c._id} key={c._id}>
                {c.customerName}
              </option>
            ))}
          </select>
        </div>

        {/* Compare Class */}
        <div className="col-span-2 flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            checked={compareClass}
            onChange={(e) => setCompareClass(e.target.checked)}
          />
          <label>Compare Class</label>
        </div>

        <button
          onClick={generateReport}
          className="bg-gray-800 text-white px-6 py-2 rounded mt-4 col-span-2"
        >
          Generate
        </button>
      </div>

      {/* RESULTS */}
      {results.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">
            Matched Results ({results.length})
          </h3>

          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2">Customer TM</th>
                <th className="border p-2">Class</th>
                <th className="border p-2">Journal TM</th>
                <th className="border p-2">Journal Class</th>
                <th className="border p-2">Journal #</th>
                <th className="border p-2">App #</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => (
                <tr key={i}>
                  <td className="border p-2">{r.customerTrademark}</td>
                  <td className="border p-2">
                    {(r.customerClass || []).join(", ")}
                  </td>
                  <td className="border p-2">{r.journalTrademark}</td>
                  <td className="border p-2">{r.journalClass}</td>
                  <td className="border p-2">{r.journalNumber}</td>
                  <td className="border p-2">{r.applicationNo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};

export default CompareJournal;
