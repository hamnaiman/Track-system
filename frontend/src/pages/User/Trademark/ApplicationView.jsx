import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import api from "../../../api/api";
import { toast } from "react-toastify";
import PrintHeader from "../../../components/PrintHeader";

const ApplicationView = () => {
  const { id } = useParams();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const printRef = useRef();

  useEffect(() => {
    fetchApplication();
  }, []);

  const fetchApplication = async () => {
    try {
      const res = await api.get(`/applications/${id}`);
      setApp(res.data?.data);
    } catch (err) {
      console.error(err);
      toast.error("Unable to load application");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!app) {
    return (
      <div className="text-center py-10 text-red-500">
        No data found
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 shadow rounded">
      {/* SCREEN HEADER */}
      <div className="flex justify-between items-center mb-6 print:hidden">
        <h2 className="text-2xl font-semibold text-[#3E4A8A]">
          Trademark Application
        </h2>

        <button
          onClick={handlePrint}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Print
        </button>
      </div>

      {/* PRINT HEADER */}
      <div className="hidden print:block">
  <PrintHeader title="Trademark Application Report" />
</div>

      {/* PRINT CONTENT */}
      <div ref={printRef} className="space-y-4 text-sm">
        <Info label="Application No" value={app.applicationNumber} />
        <Info label="Trademark" value={app.trademark} />
        <Info label="File Number" value={app.fileNumber} />
        <Info label="Date of Filing" value={app.dateOfFiling} />
        <Info label="Classes" value={app.classes?.join(", ")} />
        <Info label="Status" value={app.status?.description} />
        <Info label="Client" value={app.client?.customerName} />
      </div>
    </div>
  );
};

const Info = ({ label, value }) => (
  <div className="grid grid-cols-3 border-b py-2">
    <span className="font-medium text-gray-600">
      {label}
    </span>
    <span className="col-span-2">
      {value || "-"}
    </span>
  </div>
);

export default ApplicationView;
