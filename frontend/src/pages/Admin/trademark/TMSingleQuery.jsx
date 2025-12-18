import React, { useState } from "react";
import api from "../../../api/api";

import { toast } from "react-toastify";

const TMSingleQuery = () => {
  const [searchBy, setSearchBy] = useState("applicationNumber");
  const [searchValue, setSearchValue] = useState("");
  const [appData, setAppData] = useState(null);

  // ------------------------------
  // SEARCH HANDLER
  // ------------------------------
  const handleSearch = async () => {
    if (!searchValue.trim()) {
      toast.warning("Please enter search value");
      return;
    }

    try {
      const res = await api.post("/reports/tm-single-query", {
        searchBy,
        value: searchValue.trim(),
      });

      if (!res.data?.data) {
        toast.info("No record found");
        setAppData(null);
        return;
      }

      setAppData(res.data.data);
      toast.success("Record loaded");

    } catch (err) {
      toast.error(err.response?.data?.message || "Search failed");
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">TM Single Query</h2>

      {/* SEARCH BAR */}
      <div className="flex gap-4 mb-6">
        <select
          value={searchBy}
          onChange={(e) => setSearchBy(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="applicationNumber">Application #</option>
          <option value="fileNumber">File #</option>
          <option value="trademark">Trademark</option>
        </select>

        <input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Enter search value"
          className="border px-3 py-2 rounded flex-1"
        />

        <button
          onClick={handleSearch}
          className="bg-gray-800 text-white px-6 py-2 rounded"
        >
          Search
        </button>
      </div>

      {/* RESULT VIEW */}
      {appData && (
        <div className="border rounded-lg p-6 bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">TM Single Query Result</h3>

          <div className="grid grid-cols-2 gap-4">

            <Field label="Application #" value={appData.applicationNumber} />
            <Field label="File #" value={appData.fileNumber} />

            <Field
              label="Date of Filing"
              value={new Date(appData.dateOfFiling).toLocaleDateString()}
            />

            <Field
              label="Take Over Date"
              value={
                appData.takeOverDate
                  ? new Date(appData.takeOverDate).toLocaleDateString()
                  : ""
              }
            />

            <Field label="Period of Use" value={appData.periodOfUse} />

            <Field label="Trademark" value={appData.trademark} />

            <Field
              label="Classes"
              value={(appData.classes || []).map((c) => c.classNumber).join(", ")}
            />

            <Field label="Goods" value={appData.goods} />

            <Field
              label="Client Name"
              value={appData.client?.customerName || ""}
            />

            <Field
              label="Show Cause Received"
              value={appData.showCauseReceived ? "Yes" : "No"}
            />

            <Field
              label="Evidence Sub. Date"
              value={
                appData.evidenceSubDate
                  ? new Date(appData.evidenceSubDate).toLocaleDateString()
                  : ""
              }
            />

            <Field
              label="Acceptance Received Date"
              value={
                appData.acceptanceReceivedDate
                  ? new Date(appData.acceptanceReceivedDate).toLocaleDateString()
                  : ""
              }
            />

            <Field
              label="Acceptance Sent To Client"
              value={appData.acceptanceSendToClient ? "Yes" : "No"}
            />

            <Field label="Opposition" value={appData.opposition ? "Yes" : "No"} />

            <Field
              label="Demand Note Rec. Date"
              value={
                appData.demandNoteRecDate
                  ? new Date(appData.demandNoteRecDate).toLocaleDateString()
                  : ""
              }
            />

            <Field
              label="Demand Note Sent To Client"
              value={appData.demandNoteSendToClient ? "Yes" : "No"}
            />

            <Field
              label="Certificate Issued"
              value={appData.certificateIssued ? "Yes" : "No"}
            />

            <Field
              label="Certificate Received Date"
              value={
                appData.certificateReceivedDate
                  ? new Date(appData.certificateReceivedDate).toLocaleDateString()
                  : ""
              }
            />

            <Field label="Remarks" value={appData.remarks || ""} />

            <Field label="Status" value={appData.status?.description || ""} />
          </div>
        </div>
      )}
    </div>
  );
};

// Controlled Readonly Field
const Field = ({ label, value }) => (
  <div>
    <p className="text-sm font-semibold">{label}:</p>
    <input
      readOnly
      value={value || ""}
      className="border px-3 py-2 rounded bg-gray-200 w-full"
    />
  </div>
);

export default TMSingleQuery;
