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
    <div className="max-w-6xl mx-auto px-3 sm:px-6 space-y-8">

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
                     transition disabled:opacity-60 w-full sm:w-auto"
        >
          {loading ? "Generating..." : "Generate List"}
        </button>
      </div>

      {/* ===== DESKTOP TABLE ===== */}
      {customers.length > 0 && (
        <>
          <div className="hidden md:block bg-white rounded-2xl shadow-md border p-6">
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
                    <tr key={i} className="border-b hover:bg-gray-50">
                      <Td>{c.customerCode || "-"}</Td>
                      <Td>{c.customerName || c.name || "-"}</Td>
                      <Td className="truncate max-w-[260px]">
                        {c.email || "-"}
                      </Td>
                      <Td>{c.phone || "-"}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ===== MOBILE / TABLET CARDS ===== */}
          <div className="md:hidden space-y-4">
            {customers.map((c, i) => (
              <div
                key={i}
                className="bg-white border rounded-xl shadow-sm p-4 space-y-2"
              >
                <div>
                  <p className="text-xs text-gray-500">Customer Code</p>
                  <p className="font-semibold text-gray-800">
                    {c.customerCode || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Customer Name</p>
                  <p className="font-semibold text-gray-800">
                    {c.customerName || c.name || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm text-gray-700 break-all">
                    {c.email || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm text-gray-700">
                    {c.phone || "-"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

    </div>
  );
};

export default CustomerListTM;

/* ===== UI HELPERS ===== */

const Th = ({ children }) => (
  <th className="p-3 border text-left font-semibold whitespace-nowrap">
    {children}
  </th>
);

const Td = ({ children, className = "" }) => (
  <td className={`p-3 border ${className}`}>
    {children}
  </td>
);
