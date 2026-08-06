import { useState } from "react";
import useTheme from "../../hooks/useThem";
import {
  Building2,
  User,
  Palette,
  Lock,
  Save,
  Moon,
  Sun,
} from "lucide-react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from "../../components/Topbar/Topbar";
import apiClient from "../../api/client";
import "./Settings.css";

const TABS = [
  { id: "hospital", label: "Hospital Info", icon: Building2 },
  { id: "profile", label: "Profile", icon: User },
  { id: "theme", label: "Theme", icon: Palette },
  { id: "password", label: "Password", icon: Lock },
];

function Settings() {
  const [activeTab, setActiveTab] = useState("hospital");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const [hospitalForm, setHospitalForm] = useState({
    name: "ArchZen Hospital",
    address: "",
    phone: "",
    email: "",
  });

  const [profileForm, setProfileForm] = useState({
    full_name: "",
    email: "",
    role: "Administrator",
  });

  const [theme, setTheme] = useTheme();

  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleHospitalChange = (e) =>
    setHospitalForm({ ...hospitalForm, [e.target.name]: e.target.value });

  const handleProfileChange = (e) =>
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });

  const handlePasswordChange = (e) =>
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });

  const saveHospitalInfo = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Requires a PUT /settings/hospital endpoint on the backend.
      await apiClient.put("/settings/hospital", hospitalForm);
      showMessage("Hospital info updated.");
    } catch (err) {
      showMessage("Failed to update hospital info.", "error");
    } finally {
      setSaving(false);
    }
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Requires a PUT /admin/profile endpoint on the backend.
      await apiClient.put("/admin/profile", profileForm);
      showMessage("Profile updated.");
    } catch (err) {
      showMessage("Failed to update profile.", "error");
    } finally {
      setSaving(false);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      showMessage("New passwords do not match.", "error");
      return;
    }
    setSaving(true);
    try {
      // Requires a PUT /admin/password endpoint on the backend.
      await apiClient.put("/admin/password", {
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password,
      });
      setPasswordForm({ current_password: "", new_password: "", confirm_password: "" });
      showMessage("Password updated.");
    } catch (err) {
      showMessage("Failed to update password.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-main">
        <Topbar />

        <div className="settings-content">
          <div className="settings-header">
            <h1>Settings</h1>
            <p>Manage hospital info, your profile, theme, and password</p>
          </div>

          {message && (
            <div className={`settings-message settings-message-${message.type}`}>
              {message.text}
            </div>
          )}

          <div className="settings-layout">
            <div className="settings-tabs">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  className={`settings-tab ${activeTab === id ? "active" : ""}`}
                  onClick={() => setActiveTab(id)}
                >
                  <Icon size={17} />
                  {label}
                </button>
              ))}
            </div>

            <div className="settings-panel">
              {activeTab === "hospital" && (
                <form className="settings-form" onSubmit={saveHospitalInfo}>
                  <h2>Hospital Information</h2>
                  <div className="form-group">
                    <label>Hospital Name</label>
                    <input
                      name="name"
                      value={hospitalForm.name}
                      onChange={handleHospitalChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Address</label>
                    <input
                      name="address"
                      placeholder="Street, City, State"
                      value={hospitalForm.address}
                      onChange={handleHospitalChange}
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Phone</label>
                      <input
                        name="phone"
                        value={hospitalForm.phone}
                        onChange={handleHospitalChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={hospitalForm.email}
                        onChange={handleHospitalChange}
                      />
                    </div>
                  </div>
                  <div className="settings-actions">
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                      <Save size={16} /> {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              )}

              {activeTab === "profile" && (
                <form className="settings-form" onSubmit={saveProfile}>
                  <h2>Admin Profile</h2>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      name="full_name"
                      value={profileForm.full_name}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={profileForm.email}
                        onChange={handleProfileChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Role</label>
                      <input name="role" value={profileForm.role} disabled />
                    </div>
                  </div>
                  <div className="settings-actions">
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                      <Save size={16} /> {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              )}

              {activeTab === "theme" && (
                <div className="settings-form">
                  <h2>Theme</h2>
                  <p className="settings-subtext">
                    Choose how the dashboard looks. Your preference is saved on this device.
                  </p>
                  <div className="theme-options">
                    <button
                      className={`theme-option ${theme === "dark" ? "active" : ""}`}
                      onClick={() => setTheme("dark")}
                    >
                      <Moon size={20} />
                      <span>Dark</span>
                    </button>
                    <button
                      className={`theme-option ${theme === "light" ? "active" : ""}`}
                      onClick={() => setTheme("light")}
                    >
                      <Sun size={20} />
                      <span>Light</span>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "password" && (
                <form className="settings-form" onSubmit={savePassword}>
                  <h2>Change Password</h2>
                  <div className="form-group">
                    <label>Current Password</label>
                    <input
                      type="password"
                      name="current_password"
                      value={passwordForm.current_password}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>New Password</label>
                      <input
                        type="password"
                        name="new_password"
                        value={passwordForm.new_password}
                        onChange={handlePasswordChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Confirm New Password</label>
                      <input
                        type="password"
                        name="confirm_password"
                        value={passwordForm.confirm_password}
                        onChange={handlePasswordChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="settings-actions">
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                      <Save size={16} /> {saving ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;