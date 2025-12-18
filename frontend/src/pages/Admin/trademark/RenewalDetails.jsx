import React, { useEffect, useState } from "react";
import api from "../../../api/api";

import { toast } from "react-toastify";

const RenewalDetails = () => {
  const [applicationNumber, setApplicationNumber] = useState("");
  const [applicationId, setApplicationId] = useState("");
  const [appData, setAppData] = useState(null);

  const [renewedUpto, setRenewedUpto] = useState("");
  const [remark, setRemark] = useState("");

  const [renewal, setRenewal] = useState({ entries: [] });

  // ✅ SEARCH APPLICATION BY NUMBER
  const searchApplication = async () => {
    if (!applicationNumber.trim()) {
      toast.warning("Enter Application Number");
      return;
    }

    try {
      const res = await api.get(
        `/applications?applicationNumber=${applicationNumber}`
      );

      if (!res.data.data.length) {
        toast.error("Application not found");
        return;
      }

      const app = res.data.data[0];

      setAppData(app);
      setApplicationId(app._id); // ✅ CORRECT ID
      loadRenewals(app._id);     // ✅ LOAD RENEWALS

      toast.success("Application Loaded");

    } catch (err) {
      toast.error("Search Failed");
    }
  };

  // ✅ LOAD RENEWALS USING REAL OBJECT ID
  const loadRenewals = async (appId) => {
    try {
      const res = await api.get(`/renewals/${appId}`);
      setRenewal(res.data || { entries: [] });
    } catch {
      setRenewal({ entries: [] });
    }
  };

  // ✅ ADD RENEWAL ENTRY
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!applicationId || !renewedUpto) {
      toast.warning("Application & Renew Date required");
      return;
    }

    try {
      await api.post("/renewals", {
        applicationId,
        renewedUpto,
        remark,
      });

      toast.success("✅ Renewal Entry Added");

      setRenewedUpto("");
      setRemark("");

      loadRenewals(applicationId);

    } catch (err) {
      toast.error(err.response?.data?.message || "Save Failed");
    }
  };

  // ✅ DELETE ENTRY
  const deleteEntry = (renewalId, entryId) => {
    toast.info(
      ({ closeToast }) => (
        <div className="flex flex-col gap-3">
          <p className="font-semibold text-sm">Delete this Renewal Entry?</p>

          <div className="flex justify-end gap-3">
            <button
              onClick={async () => {
                try {
                  await api.delete(`/renewals/${renewalId}/entry/${entryId}`);
                  toast.success("Entry Deleted");
                  loadRenewals(applicationId);
                } catch {
                  toast.error("Delete Failed");
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

  return (
    <div className="bg-white p-8 rounded-xl shadow max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Renewal Details</h2>

      {/* ✅ SEARCH */}
      <div className="flex gap-4 mb-6">
        <input
          value={applicationNumber}
          onChange={(e) => setApplicationNumber(e.target.value)}
          placeholder="Enter Application Number"
          className="p-3 border rounded w-72"
        />

        <button
          onClick={searchApplication}
          className="bg-gray-800 text-white px-6 rounded"
        >
          Search
        </button>
      </div>

      {/* ✅ APPLICATION INFO */}
      {appData && (
        <div className="grid grid-cols-2 gap-4 bg-gray-100 p-4 rounded mb-6 text-sm">
          <div><b>Application #:</b> {appData.applicationNumber}</div>
          <div><b>File #:</b> {appData.fileNumber}</div>
          <div><b>Trademark:</b> {appData.trademark}</div>
          <div><b>Goods:</b> {appData.goods}</div>
        </div>
      )}

      {/* ✅ FORM */}
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-8">
        <input
          type="date"
          value={renewedUpto}
          onChange={(e) => setRenewedUpto(e.target.value)}
          className="p-3 border rounded"
          required
        />

        <input
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          placeholder="Remark"
          className="p-3 border rounded"
        />

        <button className="bg-gray-800 text-white px-6 py-2 rounded col-span-2 mt-4">
          Save Renewal
        </button>
      </form>

      {/* ✅ GRID */}
      <table className="w-full border-collapse text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">#</th>
            <th className="border p-2">Renewed Upto</th>
            <th className="border p-2">Remark</th>
            <th className="border p-2">Delete</th>
          </tr>
        </thead>

        <tbody>
          {renewal.entries?.map((item, i) => (
            <tr key={item._id}>
              <td className="border p-2">{i + 1}</td>

              <td className="border p-2">
                {new Date(item.renewedUpto).toLocaleDateString()}
              </td>

              <td className="border p-2">{item.remark}</td>

              <td
                className="border p-2 text-red-600 cursor-pointer"
                onClick={() => deleteEntry(renewal._id, item._id)}
              >
                Delete
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RenewalDetails;
