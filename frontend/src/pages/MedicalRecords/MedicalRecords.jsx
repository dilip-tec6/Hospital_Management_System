import { useEffect, useState } from "react";
import { Plus, Search, Trash2, Pencil, X, FileText } from "lucide-react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from "../../components/Topbar/Topbar";
import apiClient from "../../api/client";
import "./MedicalRecords.css";

const EMPTY_FORM = {
  patient_id: "",
  doctor_id: "",
  diagnosis: "",
  prescription: "",
  notes: "",
};

function MedicalRecords() {
  const [records, setRecords] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState(null);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/medical-records/");
      setRecords(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load medical records. Is the API running?");
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await apiClient.get("/patients/");
      setPatients(response.data);
    } catch (err) {
      setError("Failed to load patients.");
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await apiClient.get("/doctors/");
      setDoctors(response.data);
    } catch (err) {
      setError("Failed to load doctors.");
    }
  };

  useEffect(() => {
    fetchRecords();
    fetchPatients();
    fetchDoctors();
  }, []);

  const patientName = (id) => {
    const p = patients.find((p) => p.patient_id === id);
    return p ? `${p.first_name} ${p.last_name}` : "Unknown Patient";
  };

  const doctorName = (id) => {
    const d = doctors.find((d) => d.doctor_id === id);
    return d ? `Dr. ${d.first_name} ${d.last_name}` : "Unknown Doctor";
  };

  const filtered = records.filter((r) =>
    `${r.patient_name || patientName(r.patient_id)} ${
      r.doctor_name || doctorName(r.doctor_id)
    } ${r.diagnosis || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const openAddModal = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowModal(true);
  };

  const openEditModal = (record) => {
    setForm({
      patient_id: record.patient_id || "",
      doctor_id: record.doctor_id || "",
      diagnosis: record.diagnosis || "",
      prescription: record.prescription || "",
      notes: record.notes || "",
    });
    setEditingId(record.record_id);
    setShowModal(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      patient_id: Number(form.patient_id),
      doctor_id: Number(form.doctor_id),
      diagnosis: form.diagnosis,
      prescription: form.prescription || null,
      notes: form.notes || null,
    };

    try {
      if (editingId) {
        // Requires a PUT /medical-records/{id} endpoint on the backend.
        await apiClient.put(`/medical-records/${editingId}`, payload);
      } else {
        await apiClient.post("/medical-records/", payload);
      }
      setShowModal(false);
      setForm(EMPTY_FORM);
      setEditingId(null);
      fetchRecords();
    } catch (err) {
      setError(editingId ? "Failed to update record." : "Failed to create record.");
    }
  };

  const confirmDelete = async () => {
    try {
      await apiClient.delete(`/medical-records/${deleteId}`);
      setDeleteId(null);
      fetchRecords();
    } catch (err) {
      setError("Failed to delete record.");
      setDeleteId(null);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-main">
        <Topbar />

        <div className="records-content">
          <div className="records-header">
            <div>
              <h1>Medical Records</h1>
              <p>Diagnosis, prescriptions, and notes for every patient visit</p>
            </div>
            <button className="btn btn-primary" onClick={openAddModal}>
              <Plus size={18} /> Add Record
            </button>
          </div>

          <div className="records-toolbar">
            <div className="records-search">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search by patient, doctor, or diagnosis..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <span className="records-count">{filtered.length} records</span>
          </div>

          {error && <p className="records-error">{error}</p>}

          <div className="records-table-wrapper">
            <table className="records-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Diagnosis</th>
                  <th>Prescription</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="records-empty">
                      Loading medical records...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="records-empty">
                      No medical records found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((r) => (
                    <tr key={r.record_id}>
                      <td>
                        <div className="record-cell">
                          <span className="record-avatar">
                            <FileText size={16} />
                          </span>
                          <div>
                            <span className="record-title">
                              {r.patient_name || patientName(r.patient_id)}
                            </span>
                            <span className="record-subtext">ID: {r.record_id}</span>
                          </div>
                        </div>
                      </td>
                      <td>{r.doctor_name || doctorName(r.doctor_id)}</td>
                      <td className="truncate-cell">{r.diagnosis || "—"}</td>
                      <td className="truncate-cell">{r.prescription || "—"}</td>
                      <td className="truncate-cell">{r.notes || "—"}</td>
                      <td>
                        <div className="row-actions">
                          <button className="icon-btn" onClick={() => openEditModal(r)} aria-label="Edit">
                            <Pencil size={16} />
                          </button>
                          <button
                            className="icon-btn icon-btn-danger"
                            onClick={() => setDeleteId(r.record_id)}
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
              <h2>{editingId ? "Edit Medical Record" : "Add Medical Record"}</h2>
              <button className="icon-btn" onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Patient</label>
                  <select
                    name="patient_id"
                    value={form.patient_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select patient</option>
                    {patients.map((p) => (
                      <option key={p.patient_id} value={p.patient_id}>
                        {p.first_name} {p.last_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Doctor</label>
                  <select
                    name="doctor_id"
                    value={form.doctor_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select doctor</option>
                    {doctors.map((d) => (
                      <option key={d.doctor_id} value={d.doctor_id}>
                        Dr. {d.first_name} {d.last_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Diagnosis</label>
                <input
                  name="diagnosis"
                  placeholder="e.g. Acute bronchitis"
                  value={form.diagnosis}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Prescription</label>
                <input
                  name="prescription"
                  placeholder="e.g. Amoxicillin 500mg, 3x daily"
                  value={form.prescription}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Notes</label>
                <input
                  name="notes"
                  placeholder="Additional doctor notes"
                  value={form.notes}
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
                  {editingId ? "Save Changes" : "Add Record"}
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
            <h2>Delete Medical Record?</h2>
            <p className="modal-warning-text">
              This will permanently remove this medical record. This action cannot be undone.
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

export default MedicalRecords;