import React, { useMemo, useState } from "react";
import { useCarssAuth } from "../carss/CarssContext";
import { listTransactions } from "../carss/storage";
import { Navigate } from "react-router-dom";

export default function TransactionsLog() {
    const { staff } = useCarssAuth();

    if (!staff) return <Navigate to="/staff/login" replace />;

    const tx = useMemo(() => listTransactions(), []);

    return (
        <div style={{ padding: 16 }}>
            <h2>Transactions Log</h2>
            <p>Log of all restaurant transactions.</p>
            <div style={{ border: "1px solid #ddd", borderRadius: 8, overflow: "hidden", marginTop: 16 }}>
                {tx.length === 0 ? <div style={{ padding: 10 }}>No transactions found.</div> :
                    tx.map((t) => (
                        <div key={t.id} style={{ padding: 10, borderBottom: "1px solid #eee" }}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <b>{t.department.toUpperCase()}</b>
                                <span>{new Date(t.created_at).toLocaleString()}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                                <span>{t.payment_method}</span>
                                <span>₦{t.total_amount.toLocaleString()}</span>
                            </div>
                            <div style={{ opacity: 0.7 }}>Status: {t.status}</div>
                        </div>
                    ))}
            </div>
        </div>
    );
}
