import { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const Hearings = () => {
  const [hearings, setHearings] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD HEARINGS ================= */
  useEffect(() => {
    api
      .get("/agent/hearings")
      .then((res) => {
        setHearings(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => toast.error("Failed to load hearings"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">

      {/* ===== HEADER ===== */}
      <div>
        <h2 className="text-2xl font-bold text-[#3E4A8A]">
          Hearing Details
        </h2>
        <p className="text-sm text-gray-500">
          Hearing history for assigned applications (read-only)
        </p>
      </div>

      {/* ===== TABLE ===== */}
      <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">

        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading hearing records...
          </div>
        ) : hearings.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            No hearing records found
          </div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 sticky top-0">
              <tr>
                <th className="p-4 border-b text-left">Application #</th>
                <th className="p-4 border-b text-left">Hearing Date</th>
                <th className="p-4 border-b text-left">Before</th>
                <th className="p-4 border-b text-left">Remarks</th>
              </tr>
            </thead>

            <tbody>
              {hearings.map((h, idx) =>
                Array.isArray(h.hearings) &&
                h.hearings.map((e, i) => (
                  <tr
                    key={`${idx}-${i}`}
                    className={`transition ${
                      i % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-blue-50`}
                  >
                    <td className="p-4 border-b font-medium text-[#3E4A8A]">
                      {h.application?.applicationNumber || "—"}
                    </td>

                    <td className="p-4 border-b">
                      {e.hearingDate
                        ? new Date(e.hearingDate).toLocaleDateString()
                        : "—"}
                    </td>

                    <td className="p-4 border-b">
                      {e.before || "—"}
                    </td>

                    <td className="p-4 border-b text-gray-600">
                      {e.remark || "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

      </div>
    </div>
  );
};

export default Hearings;
