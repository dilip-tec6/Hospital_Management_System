import { useEffect, useState } from "react";
import { Plus, Search, Trash2, Pencil, X, User } from "lucide-react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from "../../components/Topbar/Topbar";
import apiClient from "../../api/client";
import "./Patients.css";

const EMPTY_FORM = {
  first_name: "",
  last_name: "",
  gender: "",
  phone: "",
  blood_group: "",
};

function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState(null);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/patients/");
      setPatients(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load patients. Is the API running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const filtered = patients.filter((p) =>
    `${p.first_name} ${p.last_name}`.toLowerCase().includes(search.toLowerCase())
  );

  const openAddModal = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowModal(true);
  };

  const openEditModal = (patient) => {
    setForm({
      first_name: patient.first_name || "",
      last_name: patient.last_name || "",
      gender: patient.gender || "",
      phone: patient.phone || "",
      blood_group: patient.blood_group || "",
    });
    setEditingId(patient.patient_id);
    setShowModal(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      first_name: form.first_name,
      last_name: form.last_name,
      gender: form.gender || null,
      phone: form.phone || null,
      blood_group: form.blood_group || null,
    };

    try {
      if (editingId) {
        // Requires a PUT /patients/{id} endpoint on the backend.
        await apiClient.put(`/patients/${editingId}`, payload);
      } else {
        await apiClient.post("/patients/", payload);
      }
      setShowModal(false);
      setForm(EMPTY_FORM);
      setEditingId(null);
      fetchPatients();
    } catch (err) {
      setError(editingId ? "Failed to update patient." : "Failed to create patient.");
    }
  };

  const confirmDelete = async () => {
    try {
      await apiClient.delete(`/patients/${deleteId}`);
      setDeleteId(null);
      fetchPatients();
    } catch (err) {
      setError("Failed to delete patient.");
      setDeleteId(null);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-main">
        <Topbar />

        <div className="patients-content">
          <div className="patients-header">
            <div>
              <h1>Patients</h1>
              <p>Manage patient records and details</p>
            </div>
            <button className="btn btn-primary" onClick={openAddModal}>
              <Plus size={18} /> Add Patient
            </button>
          </div>

          <div className="patients-toolbar">
            <div className="patients-search">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search patients by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <span className="patients-count">{filtered.length} patients</span>
          </div>

          {error && <p className="patients-error">{error}</p>}

          <div className="patients-table-wrapper">
            <table className="patients-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Gender</th>
                  <th>Phone</th>
                  <th>Blood Group</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="patients-empty">
                      Loading patients...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="patients-empty">
                      No patients found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((p) => (
                    <tr key={p.patient_id}>
                      <td>
                        <div className="patient-cell">
                          <span className="patient-avatar">
                            <User size={16} />
                          </span>
                          <div>
                            <span className="patient-name">
                              {p.first_name} {p.last_name}
                            </span>
                            <span className="patient-email">ID: {p.patient_id}</span>
                          </div>
                        </div>
                      </td>
                      <td>{p.gender || "—"}</td>
                      <td>{p.phone || "—"}</td>
                      <td>
                        <span className="blood-badge">{p.blood_group || "—"}</span>
                      </td>
                      <td>
                        <div className="row-actions">
                          <button className="icon-btn" onClick={() => openEditModal(p)} aria-label="Edit">
                            <Pencil size={16} />
                          </button>
                          <button
                            className="icon-btn icon-btn-danger"
                            onClick={() => setDeleteId(p.patient_id)}
                            aria-label="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingId ? "Edit Patient" : "Add Patient"}</h2>
              <button className="icon-btn" onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    name="first_name"
                    value={form.first_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    name="last_name"
                    value={form.last_name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Gender</label>
                  <select name="gender" value={form.gender} onChange={handleChange}>
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Blood Group</label>
                  <input
                    name="blood_group"
                    placeholder="e.g. O+"
                    value={form.blood_group}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingId ? "Save Changes" : "Add Patient"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal-card modal-card-sm" onClick={(e) => e.stopPropagation()}>
            <h2>Delete Patient?</h2>
            <p className="modal-warning-text">
              This will permanently remove the patient record. This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Patients;