import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const AgentListTM = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ FETCH AGENTS
  const fetchAgents = async () => {
    try {
      setLoading(true);
      const res = await api.get("/agents");
      setAgents(res.data || []);
    } catch (err) {
      toast.error("Failed to load agents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  // ✅ DELETE WITH CONFIRM TOAST
  const handleDelete = (id) => {
    toast.info(
      ({ closeToast }) => (
        <div className="flex flex-col gap-3">
          <p className="font-semibold text-sm">Delete this Agent?</p>

          <div className="flex justify-end gap-3">
            <button
              onClick={async () => {
                try {
                  await api.delete(`/agents/${id}`);
                  toast.success("Agent Deleted Successfully");
                  fetchAgents();
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
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Agent List – TM</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading agents...</p>
      ) : (
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">#</th>
              <th className="border p-2">Agent Name</th>
              <th className="border p-2">City</th>
              <th className="border p-2">Country</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Delete</th>
            </tr>
          </thead>

          <tbody>
            {agents.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-4 text-gray-500">
                  No Agents Found
                </td>
              </tr>
            ) : (
              agents.map((agent, index) => (
                <tr key={agent._id} className="text-center">
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{agent.agentName}</td>
                  <td className="border p-2">{agent.city}</td>
                  <td className="border p-2">{agent.country}</td>
                  <td className="border p-2">{agent.phone}</td>
                  <td className="border p-2">{agent.email}</td>

                  <td
                    onClick={() => handleDelete(agent._id)}
                    className="border p-2 text-red-600 cursor-pointer"
                  >
                    Delete
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AgentListTM;
