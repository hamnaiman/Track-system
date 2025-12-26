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

  /* ================= LOAD CLIENTS ================= */
  useEffect(() => {
    api
      .get("/customers")
      .then((res) => setClients(res.data?.data || []))
      .catch(() => toast.error("Failed to load clients"));
  }, []);

  /* ================= GENERATE REPORT ================= */
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
    <div className="max-w-6xl mx-auto space-y-8">

      {/* ================= HEADER ================= */}
      <div>
        <h2 className="text-2xl font-bold text-[#3E4A8A]">
          Compare Trademark With Journal
        </h2>
        <p className="text-sm text-gray-500">
          Match client trademarks against journal trademarks
        </p>
      </div>

      {/* ================= FILTER CARD ================= */}
      <div className="bg-white rounded-2xl shadow border p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          <Field label="Journal Number">
            <input
              value={journalNo}
              onChange={(e) => setJournalNo(e.target.value)}
              placeholder="Journal Number"
              className="input"
            />
          </Field>

          <Field label="No. of Characters">
            <select
              value={charCount}
              onChange={(e) => setCharCount(e.target.value)}
              className="input"
            >
              <option value="">Select Characters</option>
              {[3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n} Characters
                </option>
              ))}
            </select>
          </Field>

          <Field label="Search Type">
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="input"
            >
              <option value="equal">Equal</option>
              <option value="prefix">Prefix</option>
              <option value="suffix">Suffix</option>
              <option value="contains">Contains</option>
            </select>
          </Field>

          <Field label="Client">
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="input"
            >
              <option value="all">All Clients</option>
              {clients.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.customerName}
                </option>
              ))}
            </select>
          </Field>

          {/* CHECKBOX */}
          <div className="flex items-center gap-3 mt-6">
            <input
              type="checkbox"
              checked={compareClass}
              onChange={(e) => setCompareClass(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium text-gray-700">
              Compare Class
            </span>
          </div>

          {/* BUTTON */}
          <div className="lg:col-span-3">
            <button
              onClick={generateReport}
              className="w-full bg-[#3E4A8A] hover:bg-[#2f3970]
                         text-white py-3 rounded-lg font-semibold mt-4"
            >
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* ================= RESULTS ================= */}
      {results.length > 0 && (
        <div className="bg-white rounded-2xl shadow border p-6">
          <h3 className="text-lg font-semibold mb-4">
            Matched Results ({results.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <Th>Customer TM</Th>
                  <Th>Class</Th>
                  <Th>Journal TM</Th>
                  <Th>Journal Class</Th>
                  <Th>Journal #</Th>
                  <Th>App #</Th>
                </tr>
              </thead>

              <tbody>
                {results.map((r, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <Td>{r.customerTrademark}</Td>
                    <Td>{(r.customerClass || []).join(", ")}</Td>
                    <Td>{r.journalTrademark}</Td>
                    <Td>{r.journalClass}</Td>
                    <Td>{r.journalNumber}</Td>
                    <Td>{r.applicationNo}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default CompareJournal;

/* ================= SMALL UI HELPERS ================= */

const Field = ({ label, children }) => (
  <div>
    <label className="text-sm font-semibold text-gray-600 mb-1 block">
      {label}
    </label>
    {children}
  </div>
);

const Th = ({ children }) => (
  <th className="border px-3 py-2 text-left font-semibold text-gray-700">
    {children}
  </th>
);

const Td = ({ children }) => (
  <td className="border px-3 py-2 text-gray-800">
    {children}
  </td>
);
