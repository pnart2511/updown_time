"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Crown, Shield, User as UserIcon } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface UserRow {
  id: number;
  email: string;
  full_name: string;
  role: string;
  plan: string;
  monitor_count: number;
  created_at: string;
}

const PLAN_OPTIONS = ["free", "pro", "enterprise"];
const ROLE_OPTIONS = ["user", "admin"];

const PLAN_COLORS: Record<string, string> = {
  free: "bg-gray-100 text-gray-600",
  pro: "bg-blue-50 text-blue-700 border border-blue-200",
  enterprise: "bg-purple-50 text-purple-700 border border-purple-200",
};

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);

  const fetchUsers = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    const res = await fetch(`${API_URL}/api/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setUsers(data || []);
    setLoading(false);
  }, [router]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const updateUser = async (id: number, field: "role" | "plan", value: string) => {
    setSaving(id);
    const token = localStorage.getItem("token");
    await fetch(`${API_URL}/api/admin/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ [field]: value }),
    });
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, [field]: value } : u));
    setSaving(null);
  };

  const deleteUser = async (id: number, email: string) => {
    if (!confirm(`Xóa user "${email}"? Tất cả dữ liệu liên quan sẽ bị mất.`)) return;
    const token = localStorage.getItem("token");
    await fetch(`${API_URL}/api/admin/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1D3557]">Quản lý Người dùng</h1>
        <p className="text-gray-500 mt-1 text-sm">Xem, chỉnh sửa plan, role, và xóa user.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <p className="font-bold text-[#1D3557] text-sm">
            {users.length} người dùng
          </p>
        </div>
        {loading ? (
          <div className="p-12 flex justify-center">
            <div className="h-8 w-8 border-4 border-[#F6821F] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-400 uppercase font-semibold">
                <tr>
                  <th className="px-5 py-3 text-left">Người dùng</th>
                  <th className="px-5 py-3 text-left">Plan</th>
                  <th className="px-5 py-3 text-left">Role</th>
                  <th className="px-5 py-3 text-left">Monitors</th>
                  <th className="px-5 py-3 text-left">Ngày tạo</th>
                  <th className="px-5 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((u) => (
                  <tr key={u.id} className={`hover:bg-gray-50/50 transition-colors ${saving === u.id ? "opacity-60" : ""}`}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F6821F] to-orange-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {u.email[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-[#1D3557]">{u.email}</p>
                          <p className="text-xs text-gray-400">{u.full_name || "—"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={u.plan}
                        onChange={(e) => updateUser(u.id, "plan", e.target.value)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg border-none outline-none cursor-pointer ${PLAN_COLORS[u.plan] || "bg-gray-100"}`}
                      >
                        {PLAN_OPTIONS.map((p) => (
                          <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={u.role}
                        onChange={(e) => updateUser(u.id, "role", e.target.value)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg border-none outline-none cursor-pointer ${
                          u.role === "admin" ? "bg-orange-50 text-orange-700" : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {ROLE_OPTIONS.map((r) => (
                          <option key={r} value={r}>{r === "admin" ? "Admin" : "User"}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#1D3557]">
                        <UserIcon className="h-3 w-3 text-gray-400" />
                        {u.monitor_count}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-400 text-xs">{u.created_at}</td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => deleteUser(u.id, u.email)}
                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa user"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
