import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  CalendarDays,
  FileText,
  Receipt,
  BarChart3,
  Settings,
  LogOut,
  HeartPulse,
} from "lucide-react";
import "./Sidebar.css";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Patients", icon: Users, path: "/patients" },
  { label: "Doctors", icon: Stethoscope, path: "/doctors" },
  { label: "Appointments", icon: CalendarDays, path: "/appointments" },
  { label: "Medical Records", icon: FileText, path: "/medical-records" },
  { label: "Billing", icon: Receipt, path: "/billing" },
  { label: "Reports", icon: BarChart3, path: "/reports" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // No auth backend yet — just send back to landing.
    navigate("/");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <HeartPulse size={24} />
        <span>ArchZen</span>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <Icon size={19} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <button className="sidebar-logout" onClick={handleLogout}>
        <LogOut size={19} />
        <span>Logout</span>
      </button>
    </aside>
  );
}

export default Sidebar;