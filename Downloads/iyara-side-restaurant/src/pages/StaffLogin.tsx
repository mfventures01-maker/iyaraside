import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCarssAuth } from "../carss/CarssContext";

export default function StaffLogin() {
    const { login } = useCarssAuth();
    const [pin, setPin] = useState("");
    const [err, setErr] = useState<string | null>(null);
    const nav = useNavigate();

    return (
        <div style={{ maxWidth: 420, margin: "40px auto", padding: 16 }}>
            <h2>CARSS Staff Login</h2>
            <p>Enter your PIN</p>
            <input value={pin} onChange={(e) => setPin(e.target.value)} placeholder="PIN" style={{ width: "100%", padding: 10 }} />
            <button
                style={{ width: "100%", padding: 12, marginTop: 12 }}
                onClick={async () => {
                    setErr(null);
                    const ok = await login(pin.trim());
                    if (!ok) return setErr("Invalid PIN");
                    nav("/dashboard");
                }}
            >
                Login
            </button>
            {err && <p style={{ color: "crimson" }}>{err}</p>}
            <p style={{ opacity: 0.7, marginTop: 12 }}>Demo CEO PIN: 1234</p>
        </div>
    );
}
