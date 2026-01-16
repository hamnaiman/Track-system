import { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const TMForms = () => {
  const [forms, setForms] = useState([]);

  useEffect(() => {
    api.get("/agent/tm-forms")
      .then(res => setForms(res.data))
      .catch(() => toast.error("TM Forms load failed"));
  }, []);

  return (
    <div className="bg-white p-6 border rounded">
      <h2 className="text-xl font-semibold mb-4">TM Forms</h2>

      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Form No</th>
            <th className="border p-2">Description</th>
          </tr>
        </thead>
        <tbody>
          {forms.map(f => (
            <tr key={f._id}>
              <td className="border p-2">{f.formNumber}</td>
              <td className="border p-2">{f.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TMForms;
