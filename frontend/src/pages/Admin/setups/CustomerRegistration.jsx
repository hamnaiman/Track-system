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

  // ---------------------------------------------------
  // LOAD STATIC DROPDOWNS (Countries, Business Types, Agents)
  // ---------------------------------------------------
  useEffect(() => {
    api.get("/countries").then(res => setCountries(res.data || []));
    api.get("/business-types").then(res => setBusinessTypes(res.data || []));
    api.get("/agents").then(res => setAgents(res.data || []));
  }, []);

  // ---------------------------------------------------
  // LOAD CITIES WHEN COUNTRY CHANGES
  // ---------------------------------------------------
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

  // ---------------------------------------------------
  // HANDLE INPUT CHANGE
  // ---------------------------------------------------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ---------------------------------------------------
  // HANDLE CONTACT PERSON CHANGE
  // ---------------------------------------------------
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

  // ---------------------------------------------------
  // SUBMIT FORM
  // ---------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/customers", {
        ...form,
        contactPersons
      });

      toast.success("Customer Registered Successfully");

      // Reset form
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

      setContactPersons([
        { name: "", designation: "", email: "", mobile: "" }
      ]);

      setCities([]);

    } catch (err) {
      toast.error(err.response?.data?.message || "Customer creation failed");
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Customer Registration</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

        {/* PARTY TYPE */}
        <select
          name="partyType"
          value={form.partyType}
          onChange={handleChange}
          className="p-2 border rounded"
        >
          <option value="Local">Local</option>
          <option value="Foreign">Foreign</option>
        </select>

        {/* CUSTOMER NAME */}
        <input
          name="customerName"
          value={form.customerName}
          onChange={handleChange}
          placeholder="Customer Name"
          className="p-2 border rounded"
          required
        />

        {/* ADDRESS */}
        <textarea
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Address"
          className="p-2 border rounded col-span-2"
          required
        />

        {/* CITY */}
        <select
          name="city"
          value={form.city}
          onChange={handleChange}
          className="p-2 border rounded"
          required
        >
          <option value="">Select City</option>
          {cities.map(c => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>

        {/* COUNTRY */}
        <select
          name="country"
          value={form.country}
          onChange={handleChange}
          className="p-2 border rounded"
          required
        >
          <option value="">Select Country</option>
          {countries.map(c => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>

        {/* CONTACT INFORMATION */}
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="p-2 border rounded"
        />

        <input
          name="fax"
          value={form.fax}
          onChange={handleChange}
          placeholder="Fax"
          className="p-2 border rounded"
        />

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="p-2 border rounded"
        />

        <input
          name="web"
          value={form.web}
          onChange={handleChange}
          placeholder="Website"
          className="p-2 border rounded"
        />

        {/* BUSINESS TYPE */}
        <select
          name="businessType"
          value={form.businessType}
          onChange={handleChange}
          className="p-2 border rounded"
          required
        >
          <option value="">Select Business Type</option>
          {businessTypes.map(bt => (
            <option key={bt._id} value={bt._id}>{bt.name}</option>
          ))}
        </select>

        {/* AGENT */}
        <select
          name="agent"
          value={form.agent}
          onChange={handleChange}
          className="p-2 border rounded"
        >
          <option value="">Select Agent</option>
          {agents.map(a => (
            <option key={a._id} value={a._id}>{a.agentName}</option>
          ))}
        </select>

        {/* USER LOGIN */}
        <input
          name="userName"
          value={form.userName}
          onChange={handleChange}
          placeholder="Username"
          className="p-2 border rounded"
          required
        />

        <input
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          type="password"
          className="p-2 border rounded"
          required
        />

        {/* CONTACT PERSONS SECTION */}
        <div className="col-span-2 mt-4">
          <h3 className="font-semibold mb-2">Contact Persons</h3>

          {contactPersons.map((cp, index) => (
            <div key={index} className="grid grid-cols-4 gap-3 mb-3">

              <input
                name="name"
                value={cp.name}
                onChange={(e) => handleContactChange(index, e)}
                placeholder="Name"
                className="p-2 border rounded"
              />

              <input
                name="designation"
                value={cp.designation}
                onChange={(e) => handleContactChange(index, e)}
                placeholder="Designation"
                className="p-2 border rounded"
              />

              <input
                name="email"
                value={cp.email}
                onChange={(e) => handleContactChange(index, e)}
                placeholder="Email"
                className="p-2 border rounded"
              />

              <input
                name="mobile"
                value={cp.mobile}
                onChange={(e) => handleContactChange(index, e)}
                placeholder="Mobile"
                className="p-2 border rounded"
              />

            </div>
          ))}

          <button
            type="button"
            onClick={addContactPerson}
            className="text-blue-600 text-sm"
          >
            + Add Contact Person
          </button>
        </div>

        <div className="col-span-2 text-right mt-6">
          <button className="bg-gray-800 text-white px-8 py-2 rounded">
            Save Customer
          </button>
        </div>

      </form>
    </div>
  );
};

export default CustomerRegistration;
