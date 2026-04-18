import { useState } from "react";
import {
  FiUser, FiLock, FiBell, FiGlobe, FiShield,
  FiCheck, FiAlertCircle, FiEye, FiEyeOff, FiSave
} from "react-icons/fi";
import api from "../api/axios";

function Section({ title, description, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
        <h3 className="font-bold text-gray-800">{title}</h3>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function Toggle({ enabled, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-gray-50 last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-800">{label}</p>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0
          ${enabled ? "bg-indigo-600" : "bg-gray-200"}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200
            ${enabled ? "translate-x-5" : "translate-x-0"}`}
        />
      </button>
    </div>
  );
}

export default function Settings() {
  const [profile, setProfile] = useState({ name: "Admin", email: "admin@guptastore.com" });
  const [passwords, setPasswords] = useState({ current: "", newPw: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [notifications, setNotifications] = useState({
    newOrder: true, lowStock: true, newCustomer: false, weeklyReport: true,
  });
  const [store, setStore] = useState({
    storeName: "GuptaStore", currency: "INR", timezone: "Asia/Kolkata",
    maintenanceMode: false, guestCheckout: true,
  });
  const [toast, setToast] = useState(null);
  const [pwError, setPwError] = useState("");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      // await api.put("/auth/profile", profile);
      showToast("Profile updated successfully");
    } catch {
      showToast("Failed to update profile", "error");
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    setPwError("");
    if (!passwords.current) { setPwError("Current password is required"); return; }
    if (passwords.newPw.length < 6) { setPwError("New password must be at least 6 characters"); return; }
    if (passwords.newPw !== passwords.confirm) { setPwError("Passwords don't match"); return; }
    try {
      // await api.put("/auth/password", { currentPassword: passwords.current, newPassword: passwords.newPw });
      setPasswords({ current: "", newPw: "", confirm: "" });
      showToast("Password changed successfully");
    } catch {
      showToast("Failed to change password", "error");
    }
  };

  return (
    <div className="space-y-5 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your store and account preferences</p>
      </div>

      {/* Profile */}
      <Section title="Profile Information" description="Update your admin account details">
        <form onSubmit={saveProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
            <div className="flex items-center rounded-xl border border-gray-200
              focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
              <FiUser className="ml-3.5 text-gray-400 flex-shrink-0" />
              <input
                value={profile.name}
                onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                className="w-full pl-3 pr-4 py-3 text-sm focus:outline-none bg-transparent"
                placeholder="Admin Name"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
            <div className="flex items-center rounded-xl border border-gray-200
              focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
              <FiUser className="ml-3.5 text-gray-400 flex-shrink-0" />
              <input
                type="email"
                value={profile.email}
                onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
                className="w-full pl-3 pr-4 py-3 text-sm focus:outline-none bg-transparent"
                placeholder="admin@example.com"
              />
            </div>
          </div>
          <button type="submit"
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700
              text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-200 transition">
            <FiSave /> Save Profile
          </button>
        </form>
      </Section>

      {/* Password */}
      <Section title="Change Password" description="Keep your account secure with a strong password">
        <form onSubmit={savePassword} className="space-y-4">
          {pwError && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
              <FiAlertCircle className="flex-shrink-0" /> {pwError}
            </div>
          )}
          {[
            { key: "current", label: "Current Password", placeholder: "Enter current password" },
            { key: "newPw", label: "New Password", placeholder: "Min. 6 characters" },
            { key: "confirm", label: "Confirm New Password", placeholder: "Repeat new password" },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
              <div className="relative flex items-center rounded-xl border border-gray-200
                focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                <FiLock className="absolute left-3.5 text-gray-400" />
                <input
                  type={showPw ? "text" : "password"}
                  value={passwords[key]}
                  onChange={e => setPasswords(p => ({ ...p, [key]: e.target.value }))}
                  className="w-full pl-10 pr-10 py-3 text-sm focus:outline-none bg-transparent"
                  placeholder={placeholder}
                />
                {key === "current" && (
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3.5 text-gray-400 hover:text-gray-600 transition">
                    {showPw ? <FiEyeOff /> : <FiEye />}
                  </button>
                )}
              </div>
            </div>
          ))}
          <button type="submit"
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700
              text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-200 transition">
            <FiShield /> Change Password
          </button>
        </form>
      </Section>

      {/* Notifications */}
      <Section title="Notifications" description="Choose what alerts you want to receive">
        <div>
          <Toggle
            enabled={notifications.newOrder}
            onChange={v => setNotifications(n => ({ ...n, newOrder: v }))}
            label="New Order Alerts"
            description="Get notified when a customer places an order"
          />
          <Toggle
            enabled={notifications.lowStock}
            onChange={v => setNotifications(n => ({ ...n, lowStock: v }))}
            label="Low Stock Warnings"
            description="Alert when product stock falls below 5 units"
          />
          <Toggle
            enabled={notifications.newCustomer}
            onChange={v => setNotifications(n => ({ ...n, newCustomer: v }))}
            label="New Customer Registration"
            description="Get notified when a new user signs up"
          />
          <Toggle
            enabled={notifications.weeklyReport}
            onChange={v => setNotifications(n => ({ ...n, weeklyReport: v }))}
            label="Weekly Sales Report"
            description="Receive a summary every Monday morning"
          />
        </div>
        <button onClick={() => showToast("Notification preferences saved")}
          className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700
            text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-200 transition">
          <FiSave /> Save Preferences
        </button>
      </Section>

      {/* Store Settings */}
      <Section title="Store Settings" description="Configure your store's general settings">
        <div className="space-y-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Store Name</label>
            <div className="flex items-center rounded-xl border border-gray-200
              focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
              <FiGlobe className="ml-3.5 text-gray-400 flex-shrink-0" />
              <input
                value={store.storeName}
                onChange={e => setStore(s => ({ ...s, storeName: e.target.value }))}
                className="w-full pl-3 pr-4 py-3 text-sm focus:outline-none bg-transparent"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Currency</label>
              <select value={store.currency} onChange={e => setStore(s => ({ ...s, currency: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm
                  focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white text-gray-700">
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Timezone</label>
              <select value={store.timezone} onChange={e => setStore(s => ({ ...s, timezone: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm
                  focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white text-gray-700">
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">US Eastern</option>
              </select>
            </div>
          </div>
        </div>
        <Toggle
          enabled={store.guestCheckout}
          onChange={v => setStore(s => ({ ...s, guestCheckout: v }))}
          label="Guest Checkout"
          description="Allow customers to checkout without an account"
        />
        <Toggle
          enabled={store.maintenanceMode}
          onChange={v => setStore(s => ({ ...s, maintenanceMode: v }))}
          label="Maintenance Mode"
          description="Temporarily disable the storefront for customers"
        />
        <button onClick={() => showToast("Store settings saved")}
          className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700
            text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-200 transition">
          <FiSave /> Save Settings
        </button>
      </Section>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-[60] flex items-center gap-3 px-4 py-3
          rounded-xl shadow-2xl text-white text-sm font-medium
          ${toast.type === "error" ? "bg-red-600" : "bg-emerald-600"}`}>
          {toast.type === "error"
            ? <FiAlertCircle className="text-lg" />
            : <FiCheck className="text-lg" />}
          {toast.msg}
        </div>
      )}
    </div>
  );
}
