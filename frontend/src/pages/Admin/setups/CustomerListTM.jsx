import React, { useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const CustomerListTM = () => {
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      toast.info("Generating customer list...");

      const res = await api.get("/customers");

      if (!res.data || res.data.data?.length === 0) {
        toast.warning("No registered customers found");
        setCustomers([]);
        return;
      }

      setCustomers(res.data.data);
      toast.success("Customer list generated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate customer list");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      {/* ===== HEADER ===== */}
      <div>
        <h2 className="text-2xl font-bold text-[#3E4A8A]">
          Customer List – TM
        </h2>
        <p className="text-sm text-gray-500">
          View all registered trademark customers
        </p>
      </div>

      {/* ===== ACTION CARD ===== */}
      <div className="bg-white rounded-2xl shadow-md border p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="font-semibold text-gray-700">
            Registered Customers
          </h3>
          <p className="text-sm text-gray-500">
            Generate and view the customer list
          </p>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-[#3E4A8A] hover:bg-[#2f3970]
                     text-white px-6 py-3 rounded-lg font-semibold
                     transition disabled:opacity-60"
        >
          {loading ? "Generating..." : "Generate List"}
        </button>
      </div>

      {/* ===== TABLE ===== */}
      {customers.length > 0 && (
        <div className="bg-white rounded-2xl shadow-md border p-6">
          <h3 className="text-xl font-bold text-[#3E4A8A] mb-4">
            Customer Records
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-blue-50 text-[#3E4A8A]">
                <tr>
                  <Th>Customer Code</Th>
                  <Th>Customer Name</Th>
                  <Th>Email</Th>
                  <Th>Phone</Th>
                </tr>
              </thead>

              <tbody>
                {customers.map((c, i) => (
                  <tr
                    key={i}
                    className="border-b hover:bg-gray-50"
                  >
                    <Td>{c.customerCode || "-"}</Td>
                    <Td>{c.customerName || c.name || "-"}</Td>
                    <Td className="truncate max-w-[220px]">
                      {c.email || "-"}
                    </Td>
                    <Td>{c.phone || "-"}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default CustomerListTM;

/* ===== UI HELPERS ===== */

const Th = ({ children }) => (
  <th className="p-3 border text-left font-semibold">
    {children}
  </th>
);

const Td = ({ children, className = "" }) => (
  <td className={`p-3 border ${className}`}>
    {children}
  </td>
);
