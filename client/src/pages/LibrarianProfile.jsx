import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Pencil } from "lucide-react";

const API = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";

export default function LibrarianProfile() {
  const navigate = useNavigate();
  const { token, login, user: authUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Edit info modal
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState({ name: "", email: "", phone: "" });
  const [editError, setEditError] = useState("");
  const [saving, setSaving] = useState(false);

  // Avatar modal
  const [picOpen, setPicOpen] = useState(false);
  const [newImageFile, setNewImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [avatarSaving, setAvatarSaving] = useState(false);
  const fileInputRef = useRef();

  // ── Fetch profile ────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load profile");
        const data = await res.json();
        setProfile(data.user);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchProfile();
  }, [token]);

  // ── Save info ────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setEditError("");
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/auth/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");
      setProfile(data.user);
      login(data.user, token); // keep auth context in sync
      setEditOpen(false);
    } catch (err) {
      setEditError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Save avatar ──────────────────────────────────────────────────────────────
  const handleSaveAvatar = async () => {
    if (!newImageFile) return;
    setAvatarSaving(true);
    try {
      const formData = new FormData();
      formData.append("avatar", newImageFile);
      const res = await fetch(`${API}/api/auth/me`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");
      setProfile(data.user);
      login(data.user, token);
      setPicOpen(false);
      setNewImageFile(null);
      setPreviewUrl(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setAvatarSaving(false);
    }
  };

  const avatarSrc = previewUrl
    ? previewUrl
    : profile?.avatar
    ? `${API}${profile.avatar}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name || "L")}&background=16a34a&color=fff&size=160`;

  if (loading) return <div className="p-8 text-gray-500">Loading profile...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="p-8 flex flex-col gap-6 max-w-3xl mx-auto w-full">
        <h2 className="text-2xl font-bold">Profile</h2>

        <div className="flex gap-10 flex-wrap">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <img
                src={avatarSrc}
                alt="Profile"
                className="w-40 h-40 rounded-lg object-cover shadow"
              />
              <button
                onClick={() => setPicOpen(true)}
                className="absolute bottom-2 right-2 bg-white p-1 rounded-full shadow hover:bg-gray-100"
                title="Change photo"
              >
                <Pencil size={14} />
              </button>
            </div>
            <button
              onClick={() => setPicOpen(true)}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
            >
              Edit Profile Picture
            </button>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-4 w-80">
            <div className="border-b pb-2">
              <p className="text-gray-500 text-sm">Name</p>
              <p className="font-medium">{profile.name}</p>
            </div>
            <div className="border-b pb-2">
              <p className="text-gray-500 text-sm">Email</p>
              <p className="font-medium">{profile.email}</p>
            </div>
            <div className="border-b pb-2">
              <p className="text-gray-500 text-sm">Phone</p>
              <p className="font-medium">{profile.phone || "—"}</p>
            </div>
            <div className="border-b pb-2">
              <p className="text-gray-500 text-sm">Role</p>
              <p className="font-medium capitalize">{profile.role}</p>
            </div>
            <div className="border-b pb-2">
              <p className="text-gray-500 text-sm">Status</p>
              <span
                className={`px-2 py-0.5 rounded text-xs font-medium ${
                  profile.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {profile.status}
              </span>
            </div>
            <button
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-fit"
              onClick={() => {
                setEditData({ name: profile.name, email: profile.email, phone: profile.phone || "" });
                setEditError("");
                setEditOpen(true);
              }}
            >
              Edit Info
            </button>
          </div>
        </div>

        <button
          onClick={() => navigate("/librarian/dashboard")}
          className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 w-fit"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Edit Info Modal */}
      {editOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">Edit Info</h3>
            {editError && <p className="text-red-500 text-sm mb-3">{editError}</p>}
            <div className="flex flex-col gap-3">
              <label className="flex flex-col">
                <span className="text-sm text-gray-600">Name</span>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="border p-2 rounded"
                />
              </label>
              <label className="flex flex-col">
                <span className="text-sm text-gray-600">Email</span>
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  className="border p-2 rounded"
                />
              </label>
              <label className="flex flex-col">
                <span className="text-sm text-gray-600">Phone</span>
                <input
                  type="text"
                  value={editData.phone}
                  onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                  className="border p-2 rounded"
                />
              </label>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Avatar Modal */}
      {picOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
            <h3 className="text-lg font-bold mb-4">Update Profile Picture</h3>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="mb-4"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setNewImageFile(file);
                  setPreviewUrl(URL.createObjectURL(file));
                }
              }}
            />
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-32 h-32 rounded-lg object-cover mx-auto mb-4"
              />
            )}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => { setPicOpen(false); setNewImageFile(null); setPreviewUrl(null); }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAvatar}
                disabled={!newImageFile || avatarSaving}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-60"
              >
                {avatarSaving ? "Uploading..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
