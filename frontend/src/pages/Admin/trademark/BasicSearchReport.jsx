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
    reportType: "summary",
  });

  const [customers, setCustomers] = useState([]);
  const [result, setResult] = useState([]);

  /* ================= LOAD APPLICANTS ================= */
  useEffect(() => {
    api
      .get("/customers")
      .then((res) => setCustomers(res.data.data || []))
      .catch(() => toast.error("Failed to load applicants"));
  }, []);

  const updateField = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  /* ================= SEARCH ================= */
  const search = async () => {
    try {
      const res = await api.post("/reports/basic-search", filters);
      setResult(res.data.data || []);
      toast.success("Report generated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Search failed");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = (id) => {
    toast.info(
      ({ closeToast }) => (
        <div className="space-y-3">
          <p className="font-semibold text-sm">
            Delete this application?
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={async () => {
                try {
                  await api.delete(`/applications/${id}`);
                  toast.success("Deleted successfully");
                  setResult(result.filter((r) => r._id !== id));
                } catch {
                  toast.error("Delete failed");
                }
                closeToast();
              }}
              className="bg-red-600 text-white px-4 py-1 rounded"
            >
              Yes
            </button>
            <button
              onClick={closeToast}
              className="bg-gray-300 px-4 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { autoClose: false }
    );
  };

  /* ================= EDIT ================= */
  const handleEdit = (id) => {
    // redirect to application edit page
    window.location.href = `/admin/application-details?edit=${id}`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      {/* ================= HEADER ================= */}
      <div>
        <h2 className="text-2xl font-bold text-[#3E4A8A]">
          TM Basic Search Report
        </h2>
        <p className="text-sm text-gray-500">
          Search trademark applications using filters
        </p>
      </div>

      {/* ================= FILTER CARD ================= */}
      <div className="bg-white p-6 rounded-2xl shadow border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <Select name="searchBy" onChange={updateField}>
            <option value="DateOfFiling">Date Of Filing</option>
            <option value="ApplicationNo">Application No</option>
          </Select>

          <Input type="date" name="startDate" onChange={updateField} />
          <Input type="date" name="endDate" onChange={updateField} />
          <Input name="trademark" placeholder="Trademark" onChange={updateField} />

          <Select name="applicant" onChange={updateField}>
            <option value="">Select Applicant</option>
            {customers.map((c) => (
              <option key={c._id} value={c._id}>
                {c.customerName}
              </option>
            ))}
          </Select>

          <Input name="applicationNo" placeholder="Application No" onChange={updateField} />
          <Input name="classFrom" placeholder="Class From" type="number" onChange={updateField} />
          <Input name="classTo" placeholder="Class To" type="number" onChange={updateField} />

          {/* REPORT TYPE */}
          <div className="md:col-span-2 flex gap-6 mt-2">
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" name="reportType" value="summary" defaultChecked onChange={updateField} />
              Summary
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" name="reportType" value="details" onChange={updateField} />
              Details
            </label>
          </div>

          <button
            onClick={search}
            className="md:col-span-2 bg-[#3E4A8A] hover:bg-[#2f3970]
                       text-white py-3 rounded-lg font-semibold transition"
          >
            Generate Report
          </button>
        </div>
      </div>

      {/* ================= RESULTS ================= */}
      <div className="space-y-4">
        {result.length === 0 && (
          <p className="text-gray-500 text-sm">No results found.</p>
        )}

        {result.map((item) => (
          <div
            key={item._id}
            className="bg-white border rounded-2xl shadow-sm p-5"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <h3 className="font-bold text-lg text-[#3E4A8A]">
                  {item.trademark}
                </h3>
                <p className="text-sm text-gray-600">
                  Application #: {item.applicationNumber}
                </p>
                <p className="text-sm">
                  Applicant: {item.client?.customerName}
                </p>
                <p className="text-sm">
                  Filing Date:{" "}
                  {new Date(item.dateOfFiling).toLocaleDateString()}
                </p>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleEdit(item._id)}
                  className="px-4 py-1 rounded bg-blue-100 text-[#3E4A8A] text-sm font-semibold"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="px-4 py-1 rounded bg-red-100 text-red-600 text-sm font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* DETAILS VIEW */}
            {filters.reportType === "details" && (
              <div className="mt-4 text-xs bg-gray-50 rounded-lg p-3 space-y-2">
                <Section title="Hearings" data={item.hearings?.hearings} />
                <Section title="Journals" data={item.journals?.entries} />
                <Section title="Renewals" data={item.renewals?.entries} />
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};

export default BasicSearchReport;

/* ================= UI HELPERS ================= */

const Input = ({ className = "", ...props }) => (
  <input
    {...props}
    className={`px-4 py-3 rounded-lg bg-gray-100 border
                focus:outline-none focus:ring-2 focus:ring-blue-200 ${className}`}
  />
);

const Select = ({ className = "", children, ...props }) => (
  <select
    {...props}
    className={`px-4 py-3 rounded-lg bg-gray-100 border
                focus:outline-none focus:ring-2 focus:ring-blue-200 ${className}`}
  >
    {children}
  </select>
);

const Section = ({ title, data }) => (
  <>
    <p className="font-semibold text-gray-600">{title}</p>
    <pre className="overflow-x-auto">
      {JSON.stringify(data || [], null, 2)}
    </pre>
  </>
);
