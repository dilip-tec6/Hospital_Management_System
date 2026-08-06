import { useEffect, useState } from "react";
import { Plus, Search, Trash2, Pencil, X, Stethoscope } from "lucide-react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from "../../components/Topbar/Topbar";
import apiClient from "../../api/client";
import "./Doctors.css";

const EMPTY_FORM = {
  first_name: "",
  last_name: "",
  specialization: "",
  department: "",
  phone: "",
  email: "",
};

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState(null);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/doctors/");
      setDoctors(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load doctors. Is the API running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const filtered = doctors.filter((d) =>
    `${d.first_name} ${d.last_name} ${d.specialization || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const openAddModal = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowModal(true);
  };

  const openEditModal = (doctor) => {
    setForm({
      first_name: doctor.first_name || "",
      last_name: doctor.last_name || "",
      specialization: doctor.specialization || "",
      department: doctor.department || "",
      phone: doctor.phone || "",
      email: doctor.email || "",
    });
    setEditingId(doctor.doctor_id);
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
      specialization: form.specialization || null,
      department: form.department || null,
      phone: form.phone || null,
      email: form.email || null,
    };

    try {
      if (editingId) {
        // Requires a PUT /doctors/{id} endpoint on the backend.
        await apiClient.put(`/doctors/${editingId}`, payload);
      } else {
        await apiClient.post("/doctors/", payload);
      }
      setShowModal(false);
      setForm(EMPTY_FORM);
      setEditingId(null);
      fetchDoctors();
    } catch (err) {
      setError(editingId ? "Failed to update doctor." : "Failed to create doctor.");
    }
  };

  const confirmDelete = async () => {
    try {
      await apiClient.delete(`/doctors/${deleteId}`);
      setDeleteId(null);
      fetchDoctors();
    } catch (err) {
      setError("Failed to delete doctor.");
      setDeleteId(null);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-main">
        <Topbar />

        <div className="doctors-content">
          <div className="doctors-header">
            <div>
              <h1>Doctors</h1>
              <p>Manage specialist profiles and departments</p>
            </div>
            <button className="btn btn-primary" onClick={openAddModal}>
              <Plus size={18} /> Add Doctor
            </button>
          </div>

          <div className="doctors-toolbar">
            <div className="doctors-search">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search by name or specialization..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <span className="doctors-count">{filtered.length} doctors</span>
          </div>

          {error && <p className="doctors-error">{error}</p>}

          <div className="doctors-grid">
            {loading ? (
              <p className="doctors-empty">Loading doctors...</p>
            ) : filtered.length === 0 ? (
              <p className="doctors-empty">No doctors found.</p>
            ) : (
              filtered.map((d) => (
                <div className="doctor-card" key={d.doctor_id}>
                  <div className="doctor-card-top">
                    <span className="doctor-avatar">
                      <Stethoscope size={18} />
                    </span>
                    <div className="row-actions">
                      <button className="icon-btn" onClick={() => openEditModal(d)} aria-label="Edit">
                        <Pencil size={16} />
                      </button>
                      <button
                        className="icon-btn icon-btn-danger"
                        onClick={() => setDeleteId(d.doctor_id)}
                        aria-label="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <h3 className="doctor-name">
                    Dr. {d.first_name} {d.last_name}
                  </h3>
                  <span className="doctor-specialization">
                    {d.specialization || "General Practice"}
                  </span>

                  <div className="doctor-meta">
                    <span className="dept-badge">{d.department || "Unassigned"}</span>
                  </div>

                  <div className="doctor-contact">
                    <span>{d.phone || "—"}</span>
                    <span>{d.email || "—"}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingId ? "Edit Doctor" : "Add Doctor"}</h2>
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
                  <label>Specialization</label>
                  <input
                    name="specialization"
                    placeholder="e.g. Cardiology"
                    value={form.specialization}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <input
                    name="department"
                    placeholder="e.g. OPD"
                    value={form.department}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>
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
                  {editingId ? "Save Changes" : "Add Doctor"}
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
            <h2>Delete Doctor?</h2>
            <p className="modal-warning-text">
              This will permanently remove the doctor profile. This action cannot be undone.
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

export default Doctors;