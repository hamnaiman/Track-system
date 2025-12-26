import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const CustomerRegistration = () => {
  const [form, setForm] = useState({
    partyType: "Local",
    customerName: "",
    address: "",
    city: "",
    country: "",
    phone: "",
    fax: "",
    email: "",
    web: "",
    businessType: "",
    agent: "",
    userName: "",
    password: "",
  });

  const [contactPersons, setContactPersons] = useState([
    { name: "", designation: "", email: "", mobile: "" },
  ]);

  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [businessTypes, setBusinessTypes] = useState([]);
  const [agents, setAgents] = useState([]);

  /* ================= LOAD DROPDOWNS ================= */
  useEffect(() => {
    api.get("/countries").then(res => setCountries(res.data || []));
    api.get("/business-types").then(res => setBusinessTypes(res.data || []));
    api.get("/agents").then(res => setAgents(res.data || []));
  }, []);

  /* ================= LOAD CITIES ================= */
  useEffect(() => {
    if (!form.country) {
      setCities([]);
      return;
    }

    api
      .get(`/cities?countryId=${form.country}`)
      .then(res => setCities(res.data || []))
      .catch(() => setCities([]));
  }, [form.country]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleContactChange = (index, e) => {
    const updated = [...contactPersons];
    updated[index][e.target.name] = e.target.value;
    setContactPersons(updated);
  };

  const addContactPerson = () => {
    setContactPersons([
      ...contactPersons,
      { name: "", designation: "", email: "", mobile: "" },
    ]);
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/customers", { ...form, contactPersons });
      toast.success("Customer Registered Successfully");

      setForm({
        partyType: "Local",
        customerName: "",
        address: "",
        city: "",
        country: "",
        phone: "",
        fax: "",
        email: "",
        web: "",
        businessType: "",
        agent: "",
        userName: "",
        password: "",
      });

      setContactPersons([{ name: "", designation: "", email: "", mobile: "" }]);
      setCities([]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Customer creation failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      {/* ================= HEADER ================= */}
      <div>
        <h2 className="text-2xl font-bold text-[#3E4A8A]">
          Customer Registration
        </h2>
        <p className="text-sm text-gray-500">
          Register new trademark customers in the system
        </p>
      </div>

      {/* ================= FORM CARD ================= */}
      <div className="bg-white rounded-2xl shadow-md border p-6">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >

          {/* PARTY TYPE */}
          <Select
            name="partyType"
            value={form.partyType}
            onChange={handleChange}
          >
            <option value="Local">Local</option>
            <option value="Foreign">Foreign</option>
          </Select>

          <Input
            name="customerName"
            value={form.customerName}
            onChange={handleChange}
            placeholder="Customer Name"
            required
          />

          <Textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Address"
            required
            className="md:col-span-2"
          />

          <Select
            name="country"
            value={form.country}
            onChange={handleChange}
            required
          >
            <option value="">Select Country</option>
            {countries.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </Select>

          <Select
            name="city"
            value={form.city}
            onChange={handleChange}
            required
          >
            <option value="">Select City</option>
            {cities.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </Select>

          <Input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" />
          <Input name="fax" value={form.fax} onChange={handleChange} placeholder="Fax" />
          <Input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
          <Input name="web" value={form.web} onChange={handleChange} placeholder="Website" />

          <Select
            name="businessType"
            value={form.businessType}
            onChange={handleChange}
            required
          >
            <option value="">Select Business Type</option>
            {businessTypes.map(bt => (
              <option key={bt._id} value={bt._id}>{bt.name}</option>
            ))}
          </Select>

          <Select
            name="agent"
            value={form.agent}
            onChange={handleChange}
          >
            <option value="">Select Agent</option>
            {agents.map(a => (
              <option key={a._id} value={a._id}>{a.agentName}</option>
            ))}
          </Select>

          <Input
            name="userName"
            value={form.userName}
            onChange={handleChange}
            placeholder="Username"
            required
          />

          <Input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />

          {/* ================= CONTACT PERSONS ================= */}
          <div className="md:col-span-2 mt-4">
            <h3 className="font-semibold text-[#3E4A8A] mb-2">
              Contact Persons
            </h3>

            {contactPersons.map((cp, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3"
              >
                <Input name="name" value={cp.name} onChange={(e) => handleContactChange(index, e)} placeholder="Name" />
                <Input name="designation" value={cp.designation} onChange={(e) => handleContactChange(index, e)} placeholder="Designation" />
                <Input name="email" value={cp.email} onChange={(e) => handleContactChange(index, e)} placeholder="Email" />
                <Input name="mobile" value={cp.mobile} onChange={(e) => handleContactChange(index, e)} placeholder="Mobile" />
              </div>
            ))}

            <button
              type="button"
              onClick={addContactPerson}
              className="text-sm text-[#3E4A8A] font-medium"
            >
              + Add Contact Person
            </button>
          </div>

          {/* SUBMIT */}
          <div className="md:col-span-2 text-right mt-6">
            <button
              className="bg-[#3E4A8A] hover:bg-[#2f3970]
                         text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              Save Customer
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};

export default CustomerRegistration;

/* ================= UI HELPERS ================= */

const Input = ({ className = "", ...props }) => (
  <input
    {...props}
    className={`px-4 py-3 rounded-lg bg-gray-100 border
                focus:outline-none focus:ring-2 focus:ring-blue-200 ${className}`}
  />
);

const Textarea = ({ className = "", ...props }) => (
  <textarea
    {...props}
    className={`px-4 py-3 rounded-lg bg-gray-100 border
                focus:outline-none focus:ring-2 focus:ring-blue-200 ${className}`}
  />
);

const Select = ({ className = "", children, ...props }) => (
  <select
    {...props}
    className={`px-4 py-3 rounded-lg bg-gray-100 border
                focus:outline-none focus:ring-2 focus:ring-blue-200 ${className}`}
  >
    {children}
  </select>
);
