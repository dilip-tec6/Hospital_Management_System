import { useEffect, useState } from "react";
import { Plus, Search, Trash2, Pencil, X, CalendarDays } from "lucide-react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from "../../components/Topbar/Topbar";
import apiClient from "../../api/client";
import "./Appointments.css";

const EMPTY_FORM = {
  patient_id: "",
  doctor_id: "",
  appointment_date: "",
  appointment_time: "",
  reason: "",
  status: "Scheduled",
};

const STATUS_OPTIONS = ["Scheduled", "Completed", "Cancelled"];

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState(null);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [apptRes, patientRes, doctorRes] = await Promise.all([
        apiClient.get("/appointments/"),
        apiClient.get("/patients/"),
        apiClient.get("/doctors/"),
      ]);
      setAppointments(apptRes.data);
      setPatients(patientRes.data);
      setDoctors(doctorRes.data);
      setError(null);
    } catch (err) {
      setError("Failed to load appointments. Is the API running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const patientName = (id) => {
    const p = patients.find((p) => p.patient_id === id);
    return p ? `${p.first_name} ${p.last_name}` : `#${id}`;
  };

  const doctorName = (id) => {
    const d = doctors.find((d) => d.doctor_id === id);
    return d ? `Dr. ${d.first_name} ${d.last_name}` : `#${id}`;
  };

  const filtered = appointments.filter((a) => {
    const matchesSearch =
      patientName(a.patient_id).toLowerCase().includes(search.toLowerCase()) ||
      doctorName(a.doctor_id).toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openAddModal = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowModal(true);
  };

  const openEditModal = (appt) => {
    setForm({
      patient_id: appt.patient_id || "",
      doctor_id: appt.doctor_id || "",
      appointment_date: appt.appointment_date || "",
      appointment_time: appt.appointment_time || "",
      reason: appt.reason || "",
      status: appt.status || "Scheduled",
    });
    setEditingId(appt.appointment_id);
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
      appointment_date: form.appointment_date,
      appointment_time: form.appointment_time,
      reason: form.reason || null,
      status: form.status,
    };

    try {
      if (editingId) {
        // Requires a PUT /appointments/{id} endpoint on the backend.
        await apiClient.put(`/appointments/${editingId}`, payload);
      } else {
        await apiClient.post("/appointments/", payload);
      }
      setShowModal(false);
      setForm(EMPTY_FORM);
      setEditingId(null);
      fetchAll();
    } catch (err) {
      setError(editingId ? "Failed to update appointment." : "Failed to create appointment.");
    }
  };

  const confirmDelete = async () => {
    try {
      await apiClient.delete(`/appointments/${deleteId}`);
      setDeleteId(null);
      fetchAll();
    } catch (err) {
      setError("Failed to delete appointment.");
      setDeleteId(null);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-main">
        <Topbar />

        <div className="appointments-content">
          <div className="appointments-header">
            <div>
              <h1>Appointments</h1>
              <p>Schedule and track patient visits</p>
            </div>
            <button className="btn btn-primary" onClick={openAddModal}>
              <Plus size={18} /> New Appointment
            </button>
          </div>

          <div className="appointments-toolbar">
            <div className="appointments-search">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search by patient or doctor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="status-filters">
              {["All", ...STATUS_OPTIONS].map((s) => (
                <button
                  key={s}
                  className={`status-filter-btn ${statusFilter === s ? "active" : ""}`}
                  onClick={() => setStatusFilter(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="appointments-error">{error}</p>}

          <div className="appointments-table-wrapper">
            <table className="appointments-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="appointments-empty">
                      Loading appointments...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="appointments-empty">
                      No appointments found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((a) => (
                    <tr key={a.appointment_id}>
                      <td>
                        <div className="appt-cell">
                          <span className="appt-icon">
                            <CalendarDays size={15} />
                          </span>
                          {patientName(a.patient_id)}
                        </div>
                      </td>
                      <td>{doctorName(a.doctor_id)}</td>
                      <td>{a.appointment_date}</td>
                      <td>{a.appointment_time}</td>
                      <td className="reason-cell">{a.reason || "—"}</td>
                      <td>
                        <span className={`status-badge status-${a.status?.toLowerCase()}`}>
                          {a.status}
                        </span>
                      </td>
                      <td>
                        <div className="row-actions">
                          <button className="icon-btn" onClick={() => openEditModal(a)} aria-label="Edit">
                            <Pencil size={16} />
                          </button>
                          <button
                            className="icon-btn icon-btn-danger"
                            onClick={() => setDeleteId(a.appointment_id)}
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
              <h2>{editingId ? "Edit Appointment" : "New Appointment"}</h2>
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

              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    name="appointment_date"
                    value={form.appointment_date}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <input
                    type="time"
                    name="appointment_time"
                    value={form.appointment_time}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Reason</label>
                <input
                  name="reason"
                  placeholder="e.g. Routine checkup"
                  value={form.reason}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select name="status" value={form.status} onChange={handleChange}>
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
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
                  {editingId ? "Save Changes" : "Book Appointment"}
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
            <h2>Cancel Appointment?</h2>
            <p className="modal-warning-text">
              This will permanently remove the appointment record. This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>
                Back
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

export default Appointments;