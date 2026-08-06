import { Users, Stethoscope, CalendarCheck, DollarSign, Receipt } from "lucide-react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from "../../components/Topbar/Topbar";
import "./Dashboard.css";

const STATS = [
  { icon: Users, label: "Total Patients", value: "1,248", trend: "+4.2%", accent: "blue" },
  { icon: Stethoscope, label: "Doctors", value: "86", trend: "+1.1%", accent: "emerald" },
  { icon: CalendarCheck, label: "Today's Appointments", value: "34", trend: "+8 today", accent: "blue" },
  { icon: DollarSign, label: "Revenue", value: "$52,400", trend: "+12.6%", accent: "emerald" },
  { icon: Receipt, label: "Pending Bills", value: "17", trend: "-3 this week", accent: "amber" },
];

function Dashboard() {
  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-main">
        <Topbar />

        <div className="dashboard-content">
          <div className="dashboard-heading">
            <h1>Welcome back, Admin</h1>
            <p>Here's what's happening at ArchZen Hospital today.</p>
          </div>

          <div className="dashboard-stats">
            {STATS.map(({ icon: Icon, label, value, trend, accent }) => (
              <div className={`stat-card accent-${accent}`} key={label}>
                <div className="stat-icon">
                  <Icon size={20} />
                </div>
                <div className="stat-info">
                  <span className="stat-value">{value}</span>
                  <span className="stat-label">{label}</span>
                </div>
                <span className="stat-trend">{trend}</span>
              </div>
            ))}
          </div>

          <div className="dashboard-panels">
            <div className="panel">
              <h3>Recent Appointments</h3>
              <p className="panel-placeholder">
                Appointment list will connect to the FastAPI backend once the
                endpoint is ready.
              </p>
            </div>
            <div className="panel">
              <h3>Recent Patients</h3>
              <p className="panel-placeholder">
                Patient list will connect to the FastAPI backend once the
                endpoint is ready.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;