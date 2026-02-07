import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
    seedIfNeeded,
    getSessionStaff,
    loginByPin,
    logout,
    CarssEvents,
    CARSS_EVENT_SESSION,
    Staff,
} from "./storage";

type CarssAuth = {
    staff: Staff | null;
    login: (pin: string) => Promise<boolean>;
    logoutNow: () => void;
};

const Ctx = createContext<CarssAuth | null>(null);

export function CarssProvider({ children }: { children: React.ReactNode }) {
    const [staff, setStaff] = useState<Staff | null>(null);

    useEffect(() => {
        seedIfNeeded();
        setStaff(getSessionStaff());

        const onSession = () => setStaff(getSessionStaff());
        CarssEvents.addEventListener(CARSS_EVENT_SESSION, onSession);
        return () => CarssEvents.removeEventListener(CARSS_EVENT_SESSION, onSession);
    }, []);

    const value = useMemo<CarssAuth>(
        () => ({
            staff,
            login: async (pin) => {
                const s = loginByPin(pin);
                setStaff(s);
                return !!s;
            },
            logoutNow: () => {
                logout();
                setStaff(null);
            },
        }),
        [staff]
    );

    return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCarssAuth() {
    const v = useContext(Ctx);
    if (!v) throw new Error("useCarssAuth must be used within CarssProvider");
    return v;
}
