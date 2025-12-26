import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const AddUser = () => {
  const [form, setForm] = useState({
    userId: "",
    fullName: "",
    email: "",
    password: "",
    roleId: "",
  });

  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);

  const [permissions, setPermissions] = useState({
    add: false,
    edit: false,
    delete: false,
    print: false,
    view: false,
    setup: false,
  });

  useEffect(() => {
    fetchRoles();
    fetchUsers();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await api.get("/roles");
      const allRoles = res.data.data || [];
      setRoles(allRoles);

      const userRole = allRoles.find(
        (r) => r.roleName.toLowerCase() === "user"
      );
      if (userRole) {
        setForm((prev) => ({ ...prev, roleId: userRole._id }));
      }
    } catch {
      toast.error("Failed to load roles");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data.data || []);
    } catch {
      toast.error("Failed to load users");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const togglePermission = (key) => {
    setPermissions({ ...permissions, [key]: !permissions[key] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/users", {
        ...form,
        permissionsOverride: permissions,
      });

      toast.success("User created successfully");

      setForm({
        userId: "",
        fullName: "",
        email: "",
        password: "",
        roleId: form.roleId,
      });

      setPermissions({
        add: false,
        edit: false,
        delete: false,
        print: false,
        view: false,
        setup: false,
      });

      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "User creation failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10">

      {/* ===== ADD USER FORM ===== */}
      <div className="bg-white rounded-2xl shadow-md border p-8">
        <h2 className="text-2xl font-bold text-[#3E4A8A] mb-6">
          Add New User
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <Input
            name="userId"
            value={form.userId}
            onChange={handleChange}
            label="User ID"
            required
          />

          <Input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            label="Full Name"
            required
          />

          <Input
            name="email"
            value={form.email}
            onChange={handleChange}
            label="Email (Optional)"
          />

          <Input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            label="Password"
            required
          />

          {/* PERMISSIONS */}
          <div className="md:col-span-2">
            <p className="text-sm font-semibold text-gray-600 mb-3">
              Permissions
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {Object.keys(permissions).map((p) => (
                <label
                  key={p}
                  className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border cursor-pointer text-sm
                    ${
                      permissions[p]
                        ? "bg-blue-50 border-[#3E4A8A] text-[#3E4A8A]"
                        : "bg-gray-50 border-gray-300 text-gray-600"
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={permissions[p]}
                    onChange={() => togglePermission(p)}
                    className="hidden"
                  />
                  {p.toUpperCase()}
                </label>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 text-right">
            <button
              type="submit"
              className="bg-[#3E4A8A] hover:bg-[#2f3970]
                         text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Create User
            </button>
          </div>
        </form>
      </div>

      {/* ===== USERS TABLE ===== */}
      <div className="bg-white rounded-2xl shadow-md border p-6">
        <h3 className="text-xl font-bold text-[#3E4A8A] mb-4">
          Existing Users
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-blue-50 text-[#3E4A8A]">
              <tr>
                <Th>User ID</Th>
                <Th>Full Name</Th>
                <Th>Role</Th>
                <Th>Permissions</Th>
                <Th>Status</Th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr
                  key={u._id}
                  className="border-b hover:bg-gray-50"
                >
                  <Td>{u.userId}</Td>
                  <Td>{u.fullName}</Td>
                  <Td>{u.role?.roleName}</Td>
                  <Td className="text-xs">
                    {Object.entries({
                      ...u.role?.permissions,
                      ...u.permissionsOverride,
                    })
                      .filter(([, v]) => v)
                      .map(([k]) => k.toUpperCase())
                      .join(", ") || "NONE"}
                  </Td>
                  <Td>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium
                        ${
                          u.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                    >
                      {u.isActive ? "Active" : "Inactive"}
                    </span>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AddUser;

/* ===== SMALL UI HELPERS ===== */

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">
      {label}
    </label>
    <input
      {...props}
      className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300
                 focus:outline-none focus:ring-2 focus:ring-blue-200"
    />
  </div>
);

const Th = ({ children }) => (
  <th className="p-3 text-left font-semibold">{children}</th>
);

const Td = ({ children, className = "" }) => (
  <td className={`p-3 ${className}`}>{children}</td>
);
