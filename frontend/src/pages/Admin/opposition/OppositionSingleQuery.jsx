import React, { useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const OppositionSingleQuery = () => {
  const [searchBy, setSearchBy] = useState("oppositionNumber");
  const [searchValue, setSearchValue] = useState("");
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchValue.trim()) {
      toast.warning("Please enter search value");
      return;
    }

    try {
      setLoading(true);
      const res = await api.get("/opposition/single-query", {
        params: {
          searchBy,
          value: searchValue
        }
      });

      if (!res.data) {
        toast.info("No record found");
        setRecord(null);
      } else {
        setRecord(res.data);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Search failed");
      setRecord(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 space-y-6">
      {/* PAGE TITLE */}
      <h1 className="text-2xl font-semibold text-gray-800">
        Opposition Single Query
      </h1>

      {/* SEARCH PANEL */}
      <div className="bg-white border rounded-lg p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={searchBy}
            onChange={(e) => setSearchBy(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="oppositionNumber">Opposition #</option>
            <option value="clientName">Client Name</option>
            <option value="trademark">Trademark</option>
            <option value="applicationNumber">Application #</option>
          </select>

          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Enter value"
            className="border rounded px-3 py-2 text-sm col-span-2"
          />

          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-gray-800 text-white rounded px-4 py-2 text-sm hover:bg-gray-700"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      {/* RESULT VIEW */}
      {record && (
        <div className="bg-white border rounded-lg shadow-sm p-6 space-y-6">
          {/* OPPOSITION DETAILS */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
              Opposition Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <Field label="Opposition #" value={record.oppositionNumber} />
              <Field label="File #" value={record.fileNumber} />
              <Field label="Opposition Date" value={record.oppositionDate} />
              <Field label="Opposition Type" value={record.oppositionType} />
              <Field label="Status" value={record.status} />
            </div>

            <div className="mt-3">
              <Field label="Remarks" value={record.remarks} multiline />
            </div>
          </div>

          {/* TRADEMARK DETAILS */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
              Trademark Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <Field label="Application #" value={record.applicationNumber} />
              <Field label="Client" value={record.clientName} />
              <Field label="Trademark" value={record.trademark} />
              <Field label="Journal #" value={record.journalNumber} />
            </div>

            <div className="mt-3">
              <Field label="Goods / Description" value={record.goods} multiline />
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 print:hidden">
            <button
              onClick={handlePrint}
              className="px-4 py-2 border rounded text-sm hover:bg-gray-100"
            >
              Print
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* REUSABLE FIELD */
const Field = ({ label, value, multiline }) => (
  <div className={multiline ? "col-span-full" : ""}>
    <label className="block text-xs text-gray-500 mb-1">{label}</label>
    <div className="border rounded px-3 py-2 bg-gray-50 text-gray-800 min-h-[36px]">
      {value || "-"}
    </div>
  </div>
);

export default OppositionSingleQuery;
