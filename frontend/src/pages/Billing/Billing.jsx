import { useEffect, useState } from "react";
import { Plus, Search, Trash2, Pencil, X, Receipt } from "lucide-react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from "../../components/Topbar/Topbar";
import apiClient from "../../api/client";
import "./Billing.css";

const EMPTY_FORM = {
  patient_id: "",
  amount: "",
  payment_status: "Pending",
  payment_date: "",
};

const STATUS_FILTERS = ["All", "Paid", "Pending", "Overdue"];

function Billing() {
  const [bills, setBills] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState(null);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/billing/");
      setBills(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load billing records. Is the API running?");
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

  useEffect(() => {
    fetchBills();
    fetchPatients();
  }, []);

  const patientName = (id) => {
    const p = patients.find((p) => p.patient_id === id);
    return p ? `${p.first_name} ${p.last_name}` : "Unknown Patient";
  };

  const filtered = bills.filter((b) => {
    const matchesStatus =
      statusFilter === "All" ? true : b.payment_status === statusFilter;
    const matchesSearch = `${b.patient_name || patientName(b.patient_id)}`
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const outstandingTotal = bills
    .filter((b) => b.payment_status !== "Paid")
    .reduce((sum, b) => sum + Number(b.amount || 0), 0);

  const openAddModal = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowModal(true);
  };

  const openEditModal = (bill) => {
    setForm({
      patient_id: bill.patient_id || "",
      amount: bill.amount ?? "",
      payment_status: bill.payment_status || "Pending",
      payment_date: bill.payment_date ? bill.payment_date.slice(0, 10) : "",
    });
    setEditingId(bill.bill_id);
    setShowModal(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      patient_id: Number(form.patient_id),
      amount: Number(form.amount),
      payment_status: form.payment_status,
      payment_date: form.payment_date || null,
    };

    try {
      if (editingId) {
        // Requires a PUT /billing/{id} endpoint on the backend.
        await apiClient.put(`/billing/${editingId}`, payload);
      } else {
        await apiClient.post("/billing/", payload);
      }
      setShowModal(false);
      setForm(EMPTY_FORM);
      setEditingId(null);
      fetchBills();
    } catch (err) {
      setError(editingId ? "Failed to update bill." : "Failed to create bill.");
    }
  };

  const confirmDelete = async () => {
    try {
      await apiClient.delete(`/billing/${deleteId}`);
      setDeleteId(null);
      fetchBills();
    } catch (err) {
      setError("Failed to delete bill.");
      setDeleteId(null);
    }
  };

  const formatCurrency = (value) =>
    Number(value || 0).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const statusClass = (status) => {
    if (status === "Paid") return "status-paid";
    if (status === "Overdue") return "status-overdue";
    return "status-pending";
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-main">
        <Topbar />

        <div className="billing-content">
          <div className="billing-header">
            <div>
              <h1>Billing</h1>
              <p>Invoices, payments, and outstanding balances</p>
            </div>
            <button className="btn btn-primary" onClick={openAddModal}>
              <Plus size={18} /> Add Bill
            </button>
          </div>

          <div className="billing-summary">
            <span className="billing-summary-label">Outstanding Balance</span>
            <span className="billing-summary-value">
              {formatCurrency(outstandingTotal)}
            </span>
          </div>

          <div className="billing-toolbar">
            <div className="billing-search">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search by patient..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="status-filters">
              {STATUS_FILTERS.map((status) => (
                <button
                  key={status}
                  className={`status-filter-btn ${
                    statusFilter === status ? "active" : ""
                  }`}
                  onClick={() => setStatusFilter(status)}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="billing-error">{error}</p>}

          <div className="billing-table-wrapper">
            <table className="billing-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Payment Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="billing-empty">
                      Loading billing records...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="billing-empty">
                      No billing records found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((b) => (
                    <tr key={b.bill_id}>
                      <td>
                        <div className="bill-cell">
                          <span className="bill-icon">
                            <Receipt size={16} />
                          </span>
                          <div>
                            <span className="bill-title">
                              {b.patient_name || patientName(b.patient_id)}
                            </span>
                            <span className="bill-subtext">Bill ID: {b.bill_id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="bill-amount">{formatCurrency(b.amount)}</td>
                      <td>
                        <span className={`status-badge ${statusClass(b.payment_status)}`}>
                          {b.payment_status}
                        </span>
                      </td>
                      <td>{formatDate(b.payment_date)}</td>
                      <td>
                        <div className="row-actions">
                          <button className="icon-btn" onClick={() => openEditModal(b)} aria-label="Edit">
                            <Pencil size={16} />
                          </button>
                          <button
                            className="icon-btn icon-btn-danger"
                            onClick={() => setDeleteId(b.bill_id)}
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
              <h2>{editingId ? "Edit Bill" : "Add Bill"}</h2>
              <button className="icon-btn" onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form className="modal-form" onSubmit={handleSubmit}>
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

              <div className="form-row">
                <div className="form-group">
                  <label>Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="amount"
                    placeholder="0.00"
                    value={form.amount}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="payment_status"
                    value={form.payment_status}
                    onChange={handleChange}
                  >
                    <option>Paid</option>
                    <option>Pending</option>
                    <option>Overdue</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Payment Date</label>
                <input
                  type="date"
                  name="payment_date"
                  value={form.payment_date}
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
                  {editingId ? "Save Changes" : "Add Bill"}
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
            <h2>Delete Bill?</h2>
            <p className="modal-warning-text">
              This will permanently remove this billing record. This action cannot be undone.
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

export default Billing;