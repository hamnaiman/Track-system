import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify"; // NEW

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

      const userRole = allRoles.find(r => r.roleName.toLowerCase() === "user");
      if (userRole) {
        setForm(prev => ({ ...prev, roleId: userRole._id }));
      }

    } catch (err) {
      console.error("Role fetch failed", err);
      toast.error("Failed to load roles");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data.data || []);
    } catch (err) {
      console.error("User list fetch failed", err);
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
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-6xl mx-auto">

      <h2 className="text-2xl font-semibold mb-6">Add New User</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
        
        <input
          name="userId"
          value={form.userId}
          onChange={handleChange}
          placeholder="User ID"
          className="p-3 border rounded"
          required
        />

        <input
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          placeholder="Full Name"
          className="p-3 border rounded"
          required
        />

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email (Optional)"
          className="p-3 border rounded"
        />

        <input
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          type="password"
          className="p-3 border rounded"
          required
        />

        {/* PERMISSIONS */}
        <div className="col-span-2 grid grid-cols-3 gap-4 mt-4">
          {["add", "edit", "delete", "print", "view", "setup"].map((p) => (
            <label key={p} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={permissions[p]}
                onChange={() => togglePermission(p)}
              />
              {p.toUpperCase()}
            </label>
          ))}
        </div>

        <div className="col-span-2 text-right mt-6">
          <button className="bg-gray-800 text-white px-6 py-3 rounded">
            Create User
          </button>
        </div>
      </form>

      {/* USERS TABLE */}
      <h3 className="text-xl font-semibold mt-10 mb-4">Existing Users</h3>

      <div className="overflow-auto border rounded">
        <table className="w-full border-collapse text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">User ID</th>
              <th className="p-3 border">Full Name</th>
              <th className="p-3 border">Role</th>
              <th className="p-3 border">Permissions</th>
              <th className="p-3 border">Status</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="hover:bg-gray-50">
                <td className="p-3 border">{u.userId}</td>
                <td className="p-3 border">{u.fullName}</td>
                <td className="p-3 border">{u.role?.roleName}</td>

                <td className="p-3 border text-sm">
                  {Object.entries({
                    ...u.role?.permissions,
                    ...u.permissionsOverride,
                  })
                    .filter(([k, v]) => v === true)
                    .map(([k]) => k.toUpperCase())
                    .join(", ") || "NONE"}
                </td>

                <td className="p-3 border">
                  {u.isActive ? "Active" : "Inactive"}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
};

export default AddUser;
