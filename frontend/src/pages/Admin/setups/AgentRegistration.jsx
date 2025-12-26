import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const AgentRegistration = () => {
  const [form, setForm] = useState({
    agentName: "",
    address: "",
    city: "",
    country: "",
    phone: "",
    fax: "",
    email: "",
    web: "",
  });

  const [contact, setContact] = useState({
    name: "",
    designation: "",
    email: "",
    mobile: "",
  });

  const [contactPersons, setContactPersons] = useState([]);
  const [agents, setAgents] = useState([]);
  const [editId, setEditId] = useState(null);

  /* ===== FETCH ===== */
  const fetchAgents = async () => {
    try {
      const res = await api.get("/agents");
      setAgents(res.data || []);
    } catch {
      toast.error("Failed to load agents");
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  /* ===== HANDLERS ===== */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleContactChange = (e) =>
    setContact({ ...contact, [e.target.name]: e.target.value });

  /* ===== ADD CONTACT ===== */
  const addContactPerson = () => {
    if (!contact.name || !contact.designation || !contact.email || !contact.mobile) {
      toast.warning("All contact person fields required");
      return;
    }

    setContactPersons([...contactPersons, contact]);
    setContact({ name: "", designation: "", email: "", mobile: "" });
  };

  const removeContact = (index) => {
    setContactPersons(contactPersons.filter((_, i) => i !== index));
  };

  /* ===== SUBMIT ===== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.agentName || !form.address || !form.city || !form.country) {
      toast.warning("Required fields are missing");
      return;
    }

    try {
      if (editId) {
        await api.put(`/agents/${editId}`, {
          ...form,
          contactPersons,
        });
        toast.success("Agent updated successfully");
      } else {
        await api.post("/agents", {
          ...form,
          contactPersons,
        });
        toast.success("Agent registered successfully");
      }

      setForm({
        agentName: "",
        address: "",
        city: "",
        country: "",
        phone: "",
        fax: "",
        email: "",
        web: "",
      });
      setContactPersons([]);
      setEditId(null);
      fetchAgents();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  /* ===== EDIT ===== */
  const handleEdit = (agent) => {
    setForm({ ...agent });
    setContactPersons(agent.contactPersons || []);
    setEditId(agent._id);
  };

  /* ===== DELETE ===== */
  const handleDelete = (id) => {
    toast.info(
      ({ closeToast }) => (
        <div className="flex flex-col gap-3">
          <p className="font-semibold text-sm">Delete this agent permanently?</p>
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
    <div className="max-w-6xl mx-auto space-y-10">

      {/* ===== FORM CARD ===== */}
      <div className="bg-white rounded-2xl shadow-md border p-8">
        <h2 className="text-2xl font-bold text-[#3E4A8A] mb-6">
          Agent Registration
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {[
            ["agentName", "Agent Name"],
            ["city", "City"],
            ["country", "Country"],
            ["phone", "Phone"],
            ["fax", "Fax"],
            ["email", "Email"],
            ["web", "Website"],
          ].map(([name, label]) => (
            <Input
              key={name}
              name={name}
              label={label}
              value={form[name]}
              onChange={handleChange}
            />
          ))}

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Address
            </label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-gray-300
                         focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* CONTACT PERSON */}
          <div className="md:col-span-2 mt-4">
            <h3 className="font-semibold text-gray-700 mb-3">
              Contact Person
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {["name", "designation", "email", "mobile"].map((field) => (
                <Input
                  key={field}
                  name={field}
                  label={field.toUpperCase()}
                  value={contact[field]}
                  onChange={handleContactChange}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={addContactPerson}
              className="mt-4 bg-[#3E4A8A] hover:bg-[#2f3970]
                         text-white px-5 py-2 rounded-lg font-semibold"
            >
              Add Contact Person
            </button>

            {/* CONTACT LIST */}
            {contactPersons.map((c, i) => (
              <div
                key={i}
                className="mt-3 flex justify-between items-center
                           border rounded-lg px-4 py-2 bg-gray-50"
              >
                <span className="text-sm">
                  {c.name} — {c.mobile}
                </span>
                <button
                  type="button"
                  onClick={() => removeContact(i)}
                  className="text-red-600 text-sm hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-[#3E4A8A] hover:bg-[#2f3970]
                         text-white py-3 rounded-lg font-semibold transition"
            >
              {editId ? "Update Agent" : "Save Agent"}
            </button>
          </div>
        </form>
      </div>

      {/* ===== AGENTS TABLE ===== */}
      <div className="bg-white rounded-2xl shadow-md border p-6">
        <h3 className="text-xl font-bold text-[#3E4A8A] mb-4">
          Registered Agents
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-blue-50 text-[#3E4A8A]">
              <tr>
                <Th>#</Th>
                <Th>Agent</Th>
                <Th>City</Th>
                <Th>Phone</Th>
                <Th className="text-center">Edit</Th>
                <Th className="text-center">Delete</Th>
              </tr>
            </thead>

            <tbody>
              {agents.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center p-4 text-gray-500"
                  >
                    No agents found
                  </td>
                </tr>
              ) : (
                agents.map((a, i) => (
                  <tr
                    key={a._id}
                    className="border-b hover:bg-gray-50"
                  >
                    <Td>{i + 1}</Td>
                    <Td>{a.agentName}</Td>
                    <Td>{a.city}</Td>
                    <Td>{a.phone}</Td>

                    <Td className="text-center">
                      <button
                        onClick={() => handleEdit(a)}
                        className="text-[#3E4A8A] hover:underline"
                      >
                        Edit
                      </button>
                    </Td>

                    <Td className="text-center">
                      <button
                        onClick={() => handleDelete(a._id)}
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
      </div>

    </div>
  );
};

export default AgentRegistration;

/* ===== UI HELPERS ===== */

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">
      {label}
    </label>
    <input
      {...props}
      className="w-full px-4 py-3 rounded-lg border border-gray-300
                 focus:outline-none focus:ring-2 focus:ring-blue-200"
    />
  </div>
);

const Th = ({ children, className = "" }) => (
  <th className={`p-3 border text-left font-semibold ${className}`}>
    {children}
  </th>
);

const Td = ({ children, className = "" }) => (
  <td className={`p-3 border ${className}`}>{children}</td>
);
