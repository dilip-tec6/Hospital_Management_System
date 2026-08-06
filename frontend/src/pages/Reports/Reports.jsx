import { useEffect, useState } from "react";
import {
  Users,
  Stethoscope,
  CalendarCheck,
  DollarSign,
  Receipt,
  TrendingUp,
} from "lucide-react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from "../../components/Topbar/Topbar";
import apiClient from "../../api/client";
import "./Reports.css";

function Reports() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [p, d, a, b] = await Promise.all([
        apiClient.get("/patients/"),
        apiClient.get("/doctors/"),
        apiClient.get("/appointments/"),
        apiClient.get("/billing/"),
      ]);
      setPatients(p.data);
      setDoctors(d.data);
      setAppointments(a.data);
      setBills(b.data);
      setError(null);
    } catch (err) {
      setError("Failed to load report data. Is the API running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const totalRevenue = bills
    .filter((b) => b.payment_status === "Paid")
    .reduce((sum, b) => sum + Number(b.amount || 0), 0);

  const outstanding = bills
    .filter((b) => b.payment_status !== "Paid")
    .reduce((sum, b) => sum + Number(b.amount || 0), 0);

  const STATS = [
    { icon: Users, label: "Total Patients", value: patients.length, accent: "blue" },
    { icon: Stethoscope, label: "Total Doctors", value: doctors.length, accent: "emerald" },
    { icon: CalendarCheck, label: "Total Appointments", value: appointments.length, accent: "blue" },
    {
      icon: DollarSign,
      label: "Total Revenue",
      value: totalRevenue.toLocaleString("en-US", { style: "currency", currency: "USD" }),
      accent: "emerald",
    },
    {
      icon: Receipt,
      label: "Outstanding",
      value: outstanding.toLocaleString("en-US", { style: "currency", currency: "USD" }),
      accent: "amber",
    },
  ];

  const appointmentStatusCounts = ["Scheduled", "Completed", "Cancelled"].map((status) => ({
    label: status,
    count: appointments.filter((a) => a.status === status).length,
  }));
  const maxApptCount = Math.max(1, ...appointmentStatusCounts.map((s) => s.count));

  const billingStatusTotals = ["Paid", "Pending", "Overdue"].map((status) => ({
    label: status,
    total: bills
      .filter((b) => b.payment_status === status)
      .reduce((sum, b) => sum + Number(b.amount || 0), 0),
  }));
  const maxBillingTotal = Math.max(1, ...billingStatusTotals.map((s) => s.total));

  const departmentCounts = doctors.reduce((acc, d) => {
    const dept = d.department || "Unassigned";
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});
  const departmentEntries = Object.entries(departmentCounts).sort((a, b) => b[1] - a[1]);
  const maxDeptCount = Math.max(1, ...departmentEntries.map(([, count]) => count));

  const statusBarClass = (status) => {
    if (status === "Completed" || status === "Paid") return "bar-emerald";
    if (status === "Cancelled" || status === "Overdue") return "bar-red";
    return "bar-blue";
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-main">
        <Topbar />

        <div className="reports-content">
          <div className="reports-header">
            <div>
              <h1>Reports</h1>
              <p>Hospital-wide statistics and performance overview</p>
            </div>
          </div>

          {error && <p className="reports-error">{error}</p>}

          <div className="reports-stats">
            {STATS.map(({ icon: Icon, label, value, accent }) => (
              <div className={`stat-card accent-${accent}`} key={label}>
                <div className="stat-icon">
                  <Icon size={20} />
                </div>
                <div className="stat-info">
                  <span className="stat-value">{loading ? "…" : value}</span>
                  <span className="stat-label">{label}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="reports-panels">
            <div className="panel">
              <h3>
                <CalendarCheck size={16} className="panel-icon" />
                Appointments by Status
              </h3>
              {loading ? (
                <p className="panel-placeholder">Loading...</p>
              ) : (
                <div className="bar-chart">
                  {appointmentStatusCounts.map(({ label, count }) => (
                    <div className="bar-row" key={label}>
                      <span className="bar-row-label">{label}</span>
                      <div className="bar-track">
                        <div
                          className={`bar-fill ${statusBarClass(label)}`}
                          style={{ width: `${(count / maxApptCount) * 100}%` }}
                        />
                      </div>
                      <span className="bar-row-value">{count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="panel">
              <h3>
                <TrendingUp size={16} className="panel-icon" />
                Revenue by Payment Status
              </h3>
              {loading ? (
                <p className="panel-placeholder">Loading...</p>
              ) : (
                <div className="bar-chart">
                  {billingStatusTotals.map(({ label, total }) => (
                    <div className="bar-row" key={label}>
                      <span className="bar-row-label">{label}</span>
                      <div className="bar-track">
                        <div
                          className={`bar-fill ${statusBarClass(label)}`}
                          style={{ width: `${(total / maxBillingTotal) * 100}%` }}
                        />
                      </div>
                      <span className="bar-row-value">
                        {total.toLocaleString("en-US", { style: "currency", currency: "USD" })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="panel panel-wide">
              <h3>
                <Stethoscope size={16} className="panel-icon" />
                Doctors by Department
              </h3>
              {loading ? (
                <p className="panel-placeholder">Loading...</p>
              ) : departmentEntries.length === 0 ? (
                <p className="panel-placeholder">No department data available.</p>
              ) : (
                <div className="bar-chart">
                  {departmentEntries.map(([dept, count]) => (
                    <div className="bar-row" key={dept}>
                      <span className="bar-row-label">{dept}</span>
                      <div className="bar-track">
                        <div
                          className="bar-fill bar-blue"
                          style={{ width: `${(count / maxDeptCount) * 100}%` }}
                        />
                      </div>
                      <span className="bar-row-value">{count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;