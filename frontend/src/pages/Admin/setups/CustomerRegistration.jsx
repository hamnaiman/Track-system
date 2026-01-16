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
    password: ""
  });

  const [contactPersons, setContactPersons] = useState([
    { name: "", designation: "", email: "", mobile: "" }
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

  useEffect(() => {
    if (!form.country) return setCities([]);
    api.get(`/cities?countryId=${form.country}`)
      .then(res => setCities(res.data || []))
      .catch(() => setCities([]));
  }, [form.country]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleContactChange = (index, e) => {
    const updated = [...contactPersons];
    updated[index][e.target.name] = e.target.value;
    setContactPersons(updated);
  };

  const addContactPerson = () => {
    setContactPersons([
      ...contactPersons,
      { name: "", designation: "", email: "", mobile: "" }
    ]);
  };

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
        password: ""
      });
      setContactPersons([{ name: "", designation: "", email: "", mobile: "" }]);
      setCities([]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Customer creation failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6">

      {/* ===== HEADER ===== */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#3E4A8A]">
          Customer Registration
        </h2>
        <p className="text-sm text-gray-500">
          Register a new customer and create login credentials
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded-2xl shadow-md p-6 space-y-8"
      >

        {/* ===== BASIC DETAILS ===== */}
        <section className="bg-gray-50 border border-gray-200 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            Basic Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select name="partyType" value={form.partyType} onChange={handleChange} className="input">
              <option value="Local">Local</option>
              <option value="Foreign">Foreign</option>
            </select>

            <input name="customerName" value={form.customerName} onChange={handleChange} placeholder="Customer Name" className="input" required />

            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Address"
              rows={3}
              className="input md:col-span-2"
              required
            />

            <select name="country" value={form.country} onChange={handleChange} className="input" required>
              <option value="">Select Country</option>
              {countries.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>

            <select name="city" value={form.city} onChange={handleChange} className="input" required>
              <option value="">Select City</option>
              {cities.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
        </section>

        {/* ===== CONTACT INFO ===== */}
        <section className="bg-gray-50 border border-gray-200 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            Contact Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="input" />
            <input name="fax" value={form.fax} onChange={handleChange} placeholder="Fax" className="input" />
            <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="input" />
            <input name="web" value={form.web} onChange={handleChange} placeholder="Website" className="input" />
          </div>
        </section>

        {/* ===== BUSINESS / AGENT ===== */}
        <section className="bg-gray-50 border border-gray-200 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            Business Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select name="businessType" value={form.businessType} onChange={handleChange} className="input" required>
              <option value="">Select Business Type</option>
              {businessTypes.map(bt => (
                <option key={bt._id} value={bt._id}>{bt.name}</option>
              ))}
            </select>

            <select name="agent" value={form.agent} onChange={handleChange} className="input">
              <option value="">Select Agent</option>
              {agents.map(a => (
                <option key={a._id} value={a._id}>{a.agentName}</option>
              ))}
            </select>
          </div>
        </section>

        {/* ===== LOGIN DETAILS ===== */}
        <section className="bg-gray-50 border border-gray-200 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            Login Credentials
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="userName" value={form.userName} onChange={handleChange} placeholder="Username" className="input" required />
            <input name="password" value={form.password} onChange={handleChange} placeholder="Password" type="password" className="input" required />
          </div>
        </section>

        {/* ===== CONTACT PERSONS ===== */}
        <section className="bg-gray-50 border border-gray-200 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            Contact Persons
          </h3>

          <div className="space-y-3">
            {contactPersons.map((cp, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <input name="name" value={cp.name} onChange={(e) => handleContactChange(index, e)} placeholder="Name" className="input" />
                <input name="designation" value={cp.designation} onChange={(e) => handleContactChange(index, e)} placeholder="Designation" className="input" />
                <input name="email" value={cp.email} onChange={(e) => handleContactChange(index, e)} placeholder="Email" className="input" />
                <input name="mobile" value={cp.mobile} onChange={(e) => handleContactChange(index, e)} placeholder="Mobile" className="input" />
              </div>
            ))}
          </div>

          <button type="button" onClick={addContactPerson} className="mt-3 text-sm text-[#3E4A8A] hover:underline">
            + Add Contact Person
          </button>
        </section>

        {/* ===== ACTION ===== */}
        <div className="text-right pt-4">
          <button className="bg-[#3E4A8A] text-white px-10 py-2.5 rounded-lg shadow-sm hover:shadow-md hover:bg-[#2f3970] transition">
            Save Customer
          </button>
        </div>

      </form>

      {/* ===== INPUT STYLE ===== */}
      <style>
        {`
          .input {
            @apply w-full px-4 py-2.5 
            bg-gray-100 
            border border-gray-300 
            rounded-lg 
            text-sm text-gray-800
            placeholder-gray-400
            transition-all duration-200
            focus:bg-white
            focus:border-[#3E4A8A]
            focus:ring-2 focus:ring-[#3E4A8A]/20
            hover:border-[#3E4A8A]/70;
          }
        `}
      </style>

    </div>
  );
};

export default CustomerRegistration;
