import React, { useState } from "react";
import api from "../../../api/api"
import { toast } from "react-toastify";

const CustomerListTM = () => {
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      toast.info("Generating customer list...");

      const res = await api.get("/customers");

      if (!res.data || res.data.length === 0) {
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
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Page Title */}
    <h2 className="text-2xl font-semibold mb-2">
        Customer List – TM
      </h2>
     

      {/* Legacy Style Box */}
      <div className="bg-white border border-gray-300 rounded-md">
        <div className="bg-green-100 px-4 py-3 border-b border-gray-300 rounded-t-lg">
         <h3 className="font-semibold text-gray-800">
            List of Registered Customers
          </h3>
        </div>

        <div className="p-4">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-4 py-1 bg-gray-300 hover:bg-gray-400 border border-gray-500 text-sm"
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>
      </div>

      {/* Results */}
      {customers.length > 0 && (
        <div className="mt-6 bg-white border border-gray-300 rounded-md p-4">
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-3 py-2 text-left">Customer Code</th>
                  <th className="border px-3 py-2 text-left">Customer Name</th>
                  <th className="border px-3 py-2 text-left">Email</th>
                  <th className="border px-3 py-2 text-left">Phone</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="border px-3 py-2">
                      {c.customerCode || "-"}
                    </td>
                    <td className="border px-3 py-2">
                      {c.customerName || c.name || "-"}
                    </td>
                    <td className="border px-3 py-2">
                      {c.email || "-"}
                    </td>
                    <td className="border px-3 py-2">
                      {c.phone || "-"}
                    </td>
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
