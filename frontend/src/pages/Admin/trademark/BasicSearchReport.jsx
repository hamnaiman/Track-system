import React, { useState, useEffect } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const BasicSearchReport = () => {
  const [filters, setFilters] = useState({
    searchBy: "DateOfFiling",
    startDate: "",
    endDate: "",
    trademark: "",
    applicant: "",
    applicationNo: "",
    classFrom: "",
    classTo: "",
    reportType: "summary"
  });

  const [customers, setCustomers] = useState([]);
  const [result, setResult] = useState([]);

  // Get applicants list
 useEffect(() => {
  api
    .get("/customers")
    .then((res) => {
      setCustomers(res.data.data || []);   // FIXED
    })
    .catch(() => toast.error("Failed to load applicants"));
}, []);

  const updateField = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const search = async () => {
    try {
      const res = await api.post("/reports/basic-search", filters);
      setResult(res.data.data);
      toast.success("Report generated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Search failed");
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow max-w-5xl mx-auto">

      <h2 className="text-2xl font-semibold mb-6">TM Basic Search Report</h2>

      {/* ===================== FORM ======================= */}
      <div className="grid grid-cols-2 gap-4">

        <select name="searchBy" onChange={updateField} className="border p-2 rounded">
          <option value="DateOfFiling">Date Of Filing</option>
          <option value="ApplicationNo">Application No</option>
        </select>

        <input type="date" name="startDate" onChange={updateField} className="border p-2 rounded" />

        <input type="date" name="endDate" onChange={updateField} className="border p-2 rounded" />

        <input
          name="trademark"
          placeholder="Trademark"
          onChange={updateField}
          className="border p-2 rounded"
        />

        <select name="applicant" onChange={updateField} className="border p-2 rounded">
          <option value="">Select Applicant</option>
          {customers.map((c) => (
            <option value={c._id} key={c._id}>
              {c.customerName}
            </option>
          ))}
        </select>

        <input
          name="applicationNo"
          placeholder="Application No"
          onChange={updateField}
          className="border p-2 rounded"
        />

        <input
          name="classFrom"
          placeholder="Class From"
          type="number"
          onChange={updateField}
          className="border p-2 rounded"
        />

        <input
          name="classTo"
          placeholder="Class To"
          type="number"
          onChange={updateField}
          className="border p-2 rounded"
        />

        {/* SUMMARY / DETAIL */}
        <div className="col-span-2 flex gap-6 mt-3">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="reportType"
              value="summary"
              onChange={updateField}
              defaultChecked
            />
            Summary
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="reportType"
              value="details"
              onChange={updateField}
            />
            Details
          </label>
        </div>

        <button
          onClick={search}
          className="col-span-2 bg-gray-800 text-white py-2 rounded hover:bg-gray-700 mt-3"
        >
          Generate
        </button>
      </div>

      {/* ===================== RESULTS ======================= */}
      <div className="mt-10">
        {result.length === 0 && <p className="text-gray-500">No results found.</p>}

        {result.map((item, i) => (
          <div key={i} className="border p-4 rounded mb-4 bg-gray-50">
            <h3 className="font-bold text-lg">{item.trademark}</h3>
            <p>Application No: {item.applicationNumber}</p>
            <p>Applicant: {item.client?.customerName}</p>
            <p>Date of Filing: {new Date(item.dateOfFiling).toLocaleDateString()}</p>

            {filters.reportType === "details" && (
              <>
                <hr className="my-3" />
                <p className="text-sm text-gray-600 font-semibold">Hearings:</p>
                <pre className="text-xs">
                  {JSON.stringify(item.hearings?.hearings || [], null, 2)}
                </pre>

                <p className="text-sm text-gray-600 font-semibold mt-3">Journals:</p>
                <pre className="text-xs">
                  {JSON.stringify(item.journals?.entries || [], null, 2)}
                </pre>

                <p className="text-sm text-gray-600 font-semibold mt-3">Renewals:</p>
                <pre className="text-xs">
                  {JSON.stringify(item.renewals?.entries || [], null, 2)}
                </pre>
              </>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};

export default BasicSearchReport;
