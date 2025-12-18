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

  // ✅ FETCH AGENTS
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

  // ✅ INPUT HANDLERS
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleContactChange = (e) =>
    setContact({ ...contact, [e.target.name]: e.target.value });

  // ✅ ADD CONTACT PERSON
  const addContactPerson = () => {
    if (!contact.name || !contact.designation || !contact.email || !contact.mobile) {
      toast.warning("All contact person fields required");
      return;
    }

    setContactPersons([...contactPersons, contact]);
    setContact({ name: "", designation: "", email: "", mobile: "" });
  };

  // ✅ REMOVE CONTACT PERSON
  const removeContact = (index) => {
    setContactPersons(contactPersons.filter((_, i) => i !== index));
  };

  // ✅ CREATE / UPDATE AGENT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.agentName || !form.address || !form.city || !form.country) {
      toast.warning("Required fields are missing");
      return;
    }

    const payload = { ...form, contactPersons };

    try {
      if (editId) {
        await api.put(`/agents/${editId}`, payload);
        toast.success("Agent Updated Successfully");
      } else {
        await api.post("/agents", payload);
        toast.success("Agent Registered Successfully");
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

  // ✅ EDIT AGENT
  const handleEdit = (agent) => {
    setForm({ ...agent });
    setContactPersons(agent.contactPersons || []);
    setEditId(agent._id);
  };

  // ✅ DELETE AGENT WITH CONFIRM TOAST
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
      <h2 className="text-2xl font-semibold mb-6">Agent Registration</h2>

      {/* ✅ AGENT FORM */}
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

        {[
          ["agentName", "Agent Name"],
          ["city", "City"],
          ["country", "Country"],
          ["phone", "Phone"],
          ["fax", "Fax"],
          ["email", "Email"],
          ["web", "Website"],
        ].map(([name, placeholder]) => (
          <input
            key={name}
            name={name}
            value={form[name]}
            onChange={handleChange}
            placeholder={placeholder}
            className="p-3 border rounded"
          />
        ))}

        <textarea
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Address"
          className="p-3 border rounded col-span-2"
        />

        {/* ✅ CONTACT PERSON */}
        <h3 className="col-span-2 font-semibold mt-4">Contact Person</h3>

        {["name", "designation", "email", "mobile"].map((field) => (
          <input
            key={field}
            name={field}
            value={contact[field]}
            onChange={handleContactChange}
            placeholder={field.toUpperCase()}
            className="p-3 border rounded"
          />
        ))}

        <button
          type="button"
          onClick={addContactPerson}
          className="bg-gray-700 text-white px-4 py-2 rounded col-span-2"
        >
          Add Contact Person
        </button>

        {/* ✅ CONTACT LIST */}
        {contactPersons.map((c, i) => (
          <div key={i} className="col-span-2 flex justify-between border p-2 rounded">
            <span>{c.name} — {c.mobile}</span>
            <button
              onClick={() => removeContact(i)}
              className="text-red-600 text-sm"
            >
              Remove
            </button>
          </div>
        ))}

        <button className="bg-gray-800 text-white px-6 py-2 rounded col-span-2 mt-4">
          {editId ? "Update Agent" : "Save Agent"}
        </button>
      </form>

      {/* ✅ AGENTS TABLE */}
      <table className="w-full mt-8 border-collapse text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">#</th>
            <th className="border p-2">Agent</th>
            <th className="border p-2">City</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Edit</th>
            <th className="border p-2">Delete</th>
          </tr>
        </thead>
        <tbody>
          {agents.map((a, i) => (
            <tr key={a._id}>
              <td className="border p-2">{i + 1}</td>
              <td className="border p-2">{a.agentName}</td>
              <td className="border p-2">{a.city}</td>
              <td className="border p-2">{a.phone}</td>

              <td
                className="border p-2 text-blue-600 cursor-pointer"
                onClick={() => handleEdit(a)}
              >
                Edit
              </td>

              <td
                className="border p-2 text-red-600 cursor-pointer"
                onClick={() => handleDelete(a._id)}
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

export default AgentRegistration;
