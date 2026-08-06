import { Search, Bell, Calendar } from "lucide-react";
import "./Topbar.css";

function Topbar() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="topbar">
      <div className="topbar-search">
        <Search size={18} />
        <input type="text" placeholder="Search patients, doctors, records..." />
      </div>

      <div className="topbar-right">
        <div className="topbar-date">
          <Calendar size={16} />
          <span>{today}</span>
        </div>

        <button className="topbar-icon-btn" aria-label="Notifications">
          <Bell size={19} />
          <span className="notif-dot" />
        </button>

        <div className="topbar-profile">
          <div className="topbar-avatar">A</div>
          <div className="topbar-profile-text">
            <span className="topbar-profile-name">Admin</span>
            <span className="topbar-profile-role">Hospital Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;