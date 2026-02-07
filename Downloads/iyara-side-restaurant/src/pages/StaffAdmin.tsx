import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useCarssAuth } from "../carss/CarssContext";
import { createStaff, Department, Role } from "../carss/storage";
import { isCEO } from "../carss/guards";

export default function StaffAdmin() {
    const { staff } = useCarssAuth();
    const [full_name, setName] = useState("");
    const [pin, setPin] = useState("");
    const [role, setRole] = useState<Role>("staff");
    const [department, setDept] = useState<Department>("bar");
    const [msg, setMsg] = useState<string | null>(null);

    if (!staff) return <Navigate to="/staff/login" replace />;
    if (!isCEO(staff)) return <div style={{ padding: 16 }}>Access denied.</div>;

    return (
        <div style={{ maxWidth: 520, margin: "20px auto", padding: 16 }}>
            <h2>Create Staff (CEO Only)</h2>

            <label>Full name</label>
            <input value={full_name} onChange={(e) => setName(e.target.value)} style={{ width: "100%", padding: 10 }} />

            <label style={{ marginTop: 10, display: "block" }}>PIN</label>
            <input value={pin} onChange={(e) => setPin(e.target.value)} style={{ width: "100%", padding: 10 }} />

            <label style={{ marginTop: 10, display: "block" }}>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value as Role)} style={{ width: "100%", padding: 10 }}>
                <option value="staff">staff</option>
                <option value="manager">manager</option>
                <option value="ceo">ceo</option>
            </select>

            <label style={{ marginTop: 10, display: "block" }}>Department</label>
            <select
                value={department}
                onChange={(e) => setDept(e.target.value as Department)}
                style={{ width: "100%", padding: 10 }}
                disabled={role === "ceo"}
            >
                <option value="bar">bar</option>
                <option value="kitchen">kitchen</option>
                <option value="reception">reception</option>
                <option value="housekeeping">housekeeping</option>
            </select>

            <button
                style={{ marginTop: 12, padding: 12, width: "100%" }}
                onClick={() => {
                    setMsg(null);
                    if (!full_name.trim() || !pin.trim()) return setMsg("Name and PIN are required.");
                    const created = createStaff({
                        full_name: full_name.trim(),
                        pin: pin.trim(),
                        role,
                        department: role === "ceo" ? undefined : department,
                        phone: "",
                        email: "",
                    });
                    setMsg(`Created: ${created.full_name} (${created.role}) PIN=${created.pin}`);
                    setName("");
                    setPin("");
                }}
            >
                Create staff
            </button>

            {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
            <p style={{ opacity: 0.7, marginTop: 10 }}>
                Standard CARSS note: PIN login is demo. Backend will replace with secure auth + invitations.
            </p>
        </div>
    );
}
