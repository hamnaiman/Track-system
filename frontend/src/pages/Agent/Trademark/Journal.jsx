import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const Journal = () => {
  const [applications, setApplications] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD AGENT APPLICATIONS ================= */
  useEffect(() => {
    const loadApplications = async () => {
      try {
        const res = await api.get("/applications");
        setApplications(res.data?.data || []);
      } catch {
        toast.error("Failed to load applications");
      }
    };

    loadApplications();
  }, []);

  /* ================= LOAD JOURNALS FOR AGENT APPLICATIONS ================= */
  useEffect(() => {
    const loadJournals = async () => {
      setLoading(true);
      const journalRows = [];

      if (applications.length === 0) {
        setRows([]);
        setLoading(false);
        return;
      }

      for (const app of applications) {
        try {
          const res = await api.get(`/journals/${app._id}`);
          const entries = res.data?.data?.entries || [];

          entries.forEach((e) => {
            journalRows.push({
              applicationNumber: app.applicationNumber,
              trademark: app.trademark,
              jNo: e.jNo,
              pageNo: e.pageNo,
              journalDate: e.journalDate,
              publishedDate: e.publishedDate,
              remark: e.remark
            });
          });
        } catch {
          // ✔ journal not created for this application (normal case)
        }
      }

      setRows(journalRows);
      setLoading(false);
    };

    loadJournals();
  }, [applications]);

  return (
    <div className="space-y-6">

      {/* ===== HEADER ===== */}
      <div>
        <h2 className="text-2xl font-bold text-[#3E4A8A]">
          Journal Details
        </h2>
        <p className="text-sm text-gray-500">
          Published journal entries (read-only)
        </p>
      </div>

      {/* ===== TABLE ===== */}
      <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">

        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading journal records...
          </div>
        ) : rows.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            No journal records found
          </div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <Th>Application #</Th>
                <Th>Trademark</Th>
                <Th>Journal #</Th>
                <Th>Page #</Th>
                <Th>Journal Date</Th>
                <Th>Published Date</Th>
                <Th>Remark</Th>
              </tr>
            </thead>

            <tbody>
              {rows.map((j, i) => (
                <tr
                  key={i}
                  className="hover:bg-blue-50 transition"
                >
                  <Td bold>{j.applicationNumber}</Td>
                  <Td>{j.trademark || "—"}</Td>
                  <Td>{j.jNo || "—"}</Td>
                  <Td>{j.pageNo || "—"}</Td>
                  <Td>
                    {j.journalDate
                      ? new Date(j.journalDate).toLocaleDateString()
                      : "—"}
                  </Td>
                  <Td>
                    {j.publishedDate
                      ? new Date(j.publishedDate).toLocaleDateString()
                      : "—"}
                  </Td>
                  <Td>{j.remark || "—"}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>
    </div>
  );
};

export default Journal;

/* ================= UI HELPERS ================= */
const Th = ({ children }) => (
  <th className="p-4 border-b text-left font-semibold text-gray-600">
    {children}
  </th>
);

const Td = ({ children, bold }) => (
  <td
    className={`p-4 border-b ${
      bold ? "font-medium text-[#3E4A8A]" : "text-gray-700"
    }`}
  >
    {children}
  </td>
);
