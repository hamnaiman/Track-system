import { useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const SingleQuery = () => {
  const [searchBy, setSearchBy] = useState("applicationNumber");
  const [value, setValue] = useState("");
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!value.trim()) {
      toast.error("Enter search value");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/reports/tm-single-query", {
        searchBy,
        value
      });

      setRecord(res.data?.data || null);

      if (!res.data?.data) {
        toast.info("No record found");
      }

    } catch (err) {
      toast.error("Failed to load record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold text-[#3E4A8A]">
          Single Application Query
        </h2>
        <p className="text-sm text-gray-500">
          Search and view individual application (read-only)
        </p>
      </div>

      {/* SEARCH */}
      <div className="flex gap-3">
        <select
          value={searchBy}
          onChange={(e) => setSearchBy(e.target.value)}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="applicationNumber">Application #</option>
          <option value="fileNumber">File #</option>
          <option value="trademark">Trademark</option>
        </select>

        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter value"
          className="border rounded px-3 py-2 flex-1 text-sm"
        />

        <button
          onClick={handleSearch}
          className="bg-[#3E4A8A] text-white px-5 rounded"
        >
          Search
        </button>
      </div>

      {/* RESULT */}
      {loading ? (
        <div className="p-8 text-center text-gray-500">Loading...</div>
      ) : !record ? (
        <div className="p-8 text-center text-gray-400">
          No record
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <Info label="Application #" value={record.applicationNumber} />
            <Info label="Trademark" value={record.trademark} />
            <Info label="Client" value={record.client?.customerName} />
            <Info label="Status" value={record.status?.description} />
            <Info
              label="Filing Date"
              value={
                record.filingDate
                  ? new Date(record.filingDate).toLocaleDateString()
                  : "—"
              }
            />
            <Info
              label="Reminder Date"
              value={
                record.reminderDate
                  ? new Date(record.reminderDate).toLocaleDateString()
                  : "—"
              }
            />
          </div>

          <div className="text-sm">
            <span className="font-semibold text-gray-600">Remark:</span>
            <p className="mt-1 text-gray-700">
              {record.remark || "—"}
            </p>
          </div>

        </div>
      )}
    </div>
  );
};

export default SingleQuery;

const Info = ({ label, value }) => (
  <div>
    <p className="text-gray-500 text-xs">{label}</p>
    <p className="font-medium text-gray-800">
      {value || "—"}
    </p>
  </div>
);
