import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const AgentListTM = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ===== FETCH ===== */
  const fetchAgents = async () => {
    try {
      setLoading(true);
      const res = await api.get("/agents");
      setAgents(res.data || []);
    } catch {
      toast.error("Failed to load agents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  /* ===== DELETE ===== */
  const handleDelete = (id) => {
    toast.info(
      ({ closeToast }) => (
        <div className="flex flex-col gap-3">
          <p className="font-semibold text-sm">
            Delete this agent permanently?
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={async () => {
                try {
                  await api.delete(`/agents/${id}`);
                  toast.success("Agent deleted successfully");
                  fetchAgents();
                } catch {
                  toast.error("Delete failed");
                }
                closeToast();
              }}
              className="bg-red-600 text-white px-4 py-1 rounded"
            >
              Yes, Delete
            </button>

            <button
              onClick={closeToast}
              className="bg-gray-200 px-4 py-1 rounded"
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
    <div className="max-w-6xl mx-auto px-3 sm:px-6 space-y-6">

      <div className="bg-white rounded-2xl shadow-md border p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-[#3E4A8A] mb-4">
          Agent List – TM
        </h2>

        {loading ? (
          <p className="text-center text-gray-500 py-10">
            Loading agents...
          </p>
        ) : (
          <>
            {/* ================= DESKTOP TABLE ================= */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-blue-50 text-[#3E4A8A]">
                  <tr>
                    <Th>#</Th>
                    <Th>Agent Name</Th>
                    <Th>City</Th>
                    <Th>Country</Th>
                    <Th>Phone</Th>
                    <Th>Email</Th>
                    <Th className="text-center">Delete</Th>
                  </tr>
                </thead>

                <tbody>
                  {agents.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center p-4 text-gray-500">
                        No agents found
                      </td>
                    </tr>
                  ) : (
                    agents.map((agent, index) => (
                      <tr
                        key={agent._id}
                        className="border-b hover:bg-gray-50"
                      >
                        <Td>{index + 1}</Td>
                        <Td>{agent.agentName}</Td>
                        <Td>{agent.city}</Td>
                        <Td>{agent.country}</Td>
                        <Td>{agent.phone}</Td>
                        <Td className="max-w-[180px] truncate">
                          {agent.email}
                        </Td>
                        <Td className="text-center">
                          <button
                            onClick={() => handleDelete(agent._id)}
                            className="text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </Td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* ================= MOBILE CARDS ================= */}
            <div className="md:hidden space-y-4">
              {agents.length === 0 ? (
                <p className="text-center text-gray-500 py-6">
                  No agents found
                </p>
              ) : (
                agents.map((agent, index) => (
                  <div
                    key={agent._id}
                    className="border rounded-xl p-4 shadow-sm space-y-2"
                  >
                    <div className="flex justify-between">
                      <span className="font-semibold text-[#3E4A8A]">
                        {index + 1}. {agent.agentName}
                      </span>
                      <button
                        onClick={() => handleDelete(agent._id)}
                        className="text-red-600 text-sm"
                      >
                        Delete
                      </button>
                    </div>

                    <div className="text-sm text-gray-600">
                      <p><strong>City:</strong> {agent.city}</p>
                      <p><strong>Country:</strong> {agent.country}</p>
                      <p><strong>Phone:</strong> {agent.phone}</p>
                      <p className="break-all">
                        <strong>Email:</strong> {agent.email}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AgentListTM;

/* ===== UI HELPERS ===== */
const Th = ({ children, className = "" }) => (
  <th className={`p-3 border text-left font-semibold ${className}`}>
    {children}
  </th>
);

const Td = ({ children, className = "" }) => (
  <td className={`p-3 border ${className}`}>{children}</td>
);
