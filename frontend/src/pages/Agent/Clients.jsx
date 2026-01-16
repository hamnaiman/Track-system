import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await api.get("/customers");
      setClients(res.data?.data || res.data || []);
    } catch (err) {
      console.error("CLIENT FETCH ERROR:", err);
      toast.error("Failed to load clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <div className="space-y-6">

      {/* ===== HEADER ===== */}
      <div>
        <h2 className="text-2xl font-bold text-[#3E4A8A]">
          Clients
        </h2>
        <p className="text-sm text-gray-500">
          Trademark customers assigned in the system (read-only)
        </p>
      </div>

      {/* ===== TABLE CARD ===== */}
      <div className="bg-white rounded-2xl shadow border overflow-x-auto">

        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading clients...
          </div>
        ) : clients.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No clients found
          </div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 border text-left">Customer Name</th>
                <th className="p-3 border text-left">Email</th>
                <th className="p-3 border text-left">Phone</th>
                <th className="p-3 border text-left">City</th>
              </tr>
            </thead>

            <tbody>
              {clients.map((c, i) => (
                <tr
                  key={c._id}
                  className={`transition hover:bg-gray-50 ${
                    i % 2 === 0 ? "bg-white" : "bg-gray-50/40"
                  }`}
                >
                  <td className="p-3 border font-semibold text-[#3E4A8A]">
                    {c.customerName}
                  </td>

                  <td className="p-3 border text-gray-700">
                    {c.email || "-"}
                  </td>

                  <td className="p-3 border text-gray-700">
                    {c.phone || "-"}
                  </td>

                  <td className="p-3 border text-gray-700">
                    {c.city?.name || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>
    </div>
  );
};

export default Clients;
