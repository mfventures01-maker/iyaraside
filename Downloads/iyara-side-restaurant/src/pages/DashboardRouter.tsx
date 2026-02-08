import React from "react";
import { Navigate } from "react-router-dom";
import { useCarssAuth } from "../carss/CarssContext";

export default function DashboardRouter() {
    const { staff } = useCarssAuth();
    if (!staff) return <Navigate to="/staff/login" replace />;

    if (staff.role === "ceo") return <Navigate to="/dashboard/ceo" replace />;
    // staff/manager
    return <Navigate to="/dashboard/pos" replace />;
    // Wait, user request said "/dashboard/transactions (logs)" in Step 2.
    // And the user code scaffolding for router directs here.
    // I need to make sure I create a placeholder for transactions to avoid 404 infinite loop if not implemented.
    // The user didn't provide code for Transactions page in "Pages (minimal)" section but did mentioned in "Step 2".
    // I'll create a minimal placeholder for now if it's missing from the "Drop-in Code" section.
    // Actually, let's look at CeoHQ, it has the transactions list. 
    // Step 2 says "/dashboard/transactions (logs)".
    // I will create a simple placeholder for verify receipt.
}
