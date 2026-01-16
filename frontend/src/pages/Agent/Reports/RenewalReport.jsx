import { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const RenewalReport = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [applicant, setApplicant] = useState("");

  const [customers, setCustomers] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= LOAD CLIENTS ================= */
  useEffect(() => {
    api
      .get("/customers")
      .then((res) => setCustomers(res.data?.data || []))
      .catch(() => toast.error("Failed to load clients"));
  }, []);

  /* ================= GENERATE REPORT ================= */
  const generateReport = async () => {
    if (!fromDate || !toDate) {
      toast.warning("Renewal date range is required");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/reports/renewals", {
        fromDate,
        toDate,
        applicant
      });

      const data = res.data?.data || [];

      // 🔥 FLATTEN RENEWAL ENTRIES (BACKEND ALIGNED)
      const flattened = data.flatMap((r) =>
        r.entries.map((en) => ({
          applicationNumber: r.application?.applicationNumber,
          trademark: r.application?.trademark,
          client: r.application?.client,
          renewedUpto: en.renewedUpto,
          remark: en.remark
        }))
      );

      setRows(flattened);
      toast.success("Renewal report generated");

    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to generate renewal report"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= STATUS BADGE ================= */
  const getStatus = (date) => {
    if (!date) return { label: "—", cls: "bg-gray-100 text-gray-600" };

    const today = new Date();
    const d = new Date(date);
    const diff = Math.ceil((d - today) / (1000 * 60 * 60 * 24));

    if (diff < 0) return { label: "Expired", cls: "bg-red-100 text-red-700" };
    if (diff <= 90)
      return { label: "Due Soon", cls: "bg-yellow-100 text-yellow-700" };

    return { label: "Active", cls: "bg-green-100 text-green-700" };
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      {/* ================= HEADER ================= */}
      <div>
        <h2 className="text-2xl font-bold text-[#3E4A8A]">
          TM Renewal Report
        </h2>
        <p className="text-sm text-gray-500">
          Trademarks approaching renewal (read-only)
        </p>
      </div>

      {/* ================= FILTER CARD ================= */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <label className="text-sm font-semibold text-gray-600">
              Renewal From Date
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full mt-1 px-4 py-3 rounded-lg bg-gray-100 border"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600">
              Renewal To Date
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full mt-1 px-4 py-3 rounded-lg bg-gray-100 border"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-gray-600">
              Client (Optional)
            </label>
            <select
              value={applicant}
              onChange={(e) => setApplicant(e.target.value)}
              className="w-full mt-1 px-4 py-3 rounded-lg bg-gray-100 border"
            >
              <option value="">All Clients</option>
              {customers.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.customerName}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 text-right mt-2">
            <button
              onClick={generateReport}
              disabled={loading}
              className="bg-[#3E4A8A] hover:bg-[#2f3970]
                         text-white px-8 py-3 rounded-lg font-semibold
                         disabled:opacity-60"
            >
              {loading ? "Generating..." : "Generate Report"}
            </button>
          </div>
        </div>
      </div>

      {/* ================= RESULTS TABLE ================= */}
      <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading renewal report...
          </div>
        ) : rows.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            No renewal records found
          </div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <Th>Application #</Th>
                <Th>Trademark</Th>
                <Th>Client</Th>
                <Th>Renewal Date</Th>
                <Th>Status</Th>
                <Th>Remark</Th>
              </tr>
            </thead>

            <tbody>
              {rows.map((r, i) => {
                const status = getStatus(r.renewedUpto);

                return (
                  <tr key={i} className="hover:bg-gray-50">
                    <Td>{r.applicationNumber || "—"}</Td>
                    <Td>{r.trademark || "—"}</Td>
                    <Td>{r.client?.customerName || "—"}</Td>
                    <Td>
                      {r.renewedUpto
                        ? new Date(r.renewedUpto).toLocaleDateString()
                        : "—"}
                    </Td>
                    <Td>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${status.cls}`}
                      >
                        {status.label}
                      </span>
                    </Td>
                    <Td>{r.remark || "—"}</Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default RenewalReport;

/* ================= UI HELPERS ================= */
const Th = ({ children }) => (
  <th className="p-4 border-b text-left font-semibold">
    {children}
  </th>
);

const Td = ({ children }) => (
  <td className="p-4 border-b text-gray-700">
    {children}
  </td>
);
