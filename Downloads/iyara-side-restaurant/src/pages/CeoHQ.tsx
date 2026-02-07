import React, { useEffect, useMemo, useState } from "react";
import { useCarssAuth } from "../carss/CarssContext";
import { isCEO } from "../carss/guards";
import {
    CARSS_EVENT_STAFF,
    CARSS_EVENT_TX,
    CarssEvents,
    listStaff,
    listTransactions,
    voidTransaction,
} from "../carss/storage";

export default function CeoHQ() {
    const { staff, logoutNow } = useCarssAuth();
    const [tick, setTick] = useState(0);

    useEffect(() => {
        const bump = () => setTick((t) => t + 1);
        CarssEvents.addEventListener(CARSS_EVENT_TX, bump);
        CarssEvents.addEventListener(CARSS_EVENT_STAFF, bump);
        return () => {
            CarssEvents.removeEventListener(CARSS_EVENT_TX, bump);
            CarssEvents.removeEventListener(CARSS_EVENT_STAFF, bump);
        };
    }, []);

    if (!isCEO(staff)) return <div style={{ padding: 16 }}>Access denied.</div>;

    const tx = useMemo(() => listTransactions(), [tick]);
    const staffList = useMemo(() => listStaff(), [tick]);

    const today = new Date().toISOString().slice(0, 10);
    const txToday = tx.filter((t) => t.created_at.slice(0, 10) === today && t.status !== "VOIDED");
    const revenueToday = txToday.reduce((s, t) => s + t.total_amount, 0);

    return (
        <div style={{ padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2>CEO HQ</h2>
                <button onClick={logoutNow}>Logout</button>
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Stat label="Revenue today" value={`₦${revenueToday.toLocaleString()}`} />
                <Stat label="Transactions today" value={`${txToday.length}`} />
                <Stat label="Total staff" value={`${staffList.length}`} />
            </div>

            <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                    <h3>Latest Transactions</h3>
                    <div style={{ border: "1px solid #ddd", borderRadius: 8, overflow: "hidden" }}>
                        {tx.slice(0, 12).map((t) => (
                            <div key={t.id} style={{ padding: 10, borderBottom: "1px solid #eee" }}>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <b>{t.department.toUpperCase()}</b>
                                    <span>{new Date(t.created_at).toLocaleString()}</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                                    <span>{t.payment_method}</span>
                                    <span>₦{t.total_amount.toLocaleString()}</span>
                                </div>
                                <div style={{ marginTop: 6, display: "flex", gap: 8, alignItems: "center" }}>
                                    <span style={{ opacity: 0.7 }}>Status: {t.status}</span>
                                    {t.status !== "VOIDED" && <button onClick={() => voidTransaction(t.id)}>Void</button>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h3>Staff</h3>
                    <a href="/dashboard/staff-admin">Create staff</a>
                    <div style={{ border: "1px solid #ddd", borderRadius: 8, overflow: "hidden", marginTop: 8 }}>
                        {staffList.slice(0, 12).map((s) => (
                            <div key={s.id} style={{ padding: 10, borderBottom: "1px solid #eee" }}>
                                <b>{s.full_name}</b> <span style={{ opacity: 0.7 }}>({s.role})</span>
                                <div style={{ opacity: 0.7 }}>{s.department ?? "all"} · Active: {String(s.is_active)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function Stat({ label, value }: { label: string; value: string }) {
    return (
        <div style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12, minWidth: 220 }}>
            <div style={{ opacity: 0.7 }}>{label}</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{value}</div>
        </div>
    );
}
