export type PaymentMethod = "POS" | "TRANSFER" | "CASH";
export type Department = "bar" | "kitchen" | "reception" | "housekeeping";
export type Role = "ceo" | "manager" | "staff";
export type TxStatus = "PENDING" | "CONFIRMED" | "VOIDED";

export type Staff = {
    id: string;
    full_name: string;
    phone?: string;
    email?: string;
    role: Role;
    department?: Department; // CEO may be undefined
    pin: string; // demo auth
    created_at: string; // ISO
    is_active: boolean;
};

export type TxLineItem = {
    name: string;
    qty: number;
    unit_price: number;
};

export type Transaction = {
    id: string;
    created_at: string;
    created_by_staff_id: string;
    department: Department;
    payment_method: PaymentMethod;
    status: TxStatus;
    line_items: TxLineItem[];
    total_amount: number;
    notes?: string;
};

type CarssDB = {
    staff: Staff[];
    transactions: Transaction[];
    session: { staff_id: string } | null;
};

const KEY = "carss_db_v1";

function nowISO() {
    return new Date().toISOString();
}

function uid(prefix: string) {
    return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

export function loadDB(): CarssDB {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
        const seedCEO: Staff = {
            id: uid("staff"),
            full_name: "CEO",
            role: "ceo",
            pin: "1234",
            created_at: nowISO(),
            is_active: true,
        };
        const db: CarssDB = { staff: [seedCEO], transactions: [], session: null };
        localStorage.setItem(KEY, JSON.stringify(db));
        return db;
    }
    return JSON.parse(raw);
}

export function saveDB(db: CarssDB) {
    localStorage.setItem(KEY, JSON.stringify(db));
}

export function withDB<T>(fn: (db: CarssDB) => T): T {
    const db = loadDB();
    const result = fn(db);
    saveDB(db);
    return result;
}

export function seedIfNeeded() {
    loadDB();
}

export const CarssEvents = new EventTarget();
export const CARSS_EVENT_TX = "carss:tx";
export const CARSS_EVENT_STAFF = "carss:staff";
export const CARSS_EVENT_SESSION = "carss:session";

function emit(type: string) {
    CarssEvents.dispatchEvent(new CustomEvent(type, { detail: { at: nowISO() } }));
}

// Auth (demo)
export function loginByPin(pin: string): Staff | null {
    return withDB((db) => {
        const staff = db.staff.find((s) => s.pin === pin && s.is_active);
        if (!staff) return null;
        db.session = { staff_id: staff.id };
        emit(CARSS_EVENT_SESSION);
        return staff;
    });
}

export function logout() {
    withDB((db) => {
        db.session = null;
        emit(CARSS_EVENT_SESSION);
    });
}

export function getSessionStaff(): Staff | null {
    const db = loadDB();
    const staffId = db.session?.staff_id;
    if (!staffId) return null;
    return db.staff.find((s) => s.id === staffId) ?? null;
}

// Staff
export function listStaff(): Staff[] {
    return loadDB().staff.slice().sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function createStaff(input: Omit<Staff, "id" | "created_at" | "is_active">): Staff {
    return withDB((db) => {
        const staff: Staff = {
            ...input,
            id: uid("staff"),
            created_at: nowISO(),
            is_active: true,
        };
        db.staff.push(staff);
        emit(CARSS_EVENT_STAFF);
        return staff;
    });
}

export function toggleStaffActive(staff_id: string, is_active: boolean) {
    withDB((db) => {
        const s = db.staff.find((x) => x.id === staff_id);
        if (s) s.is_active = is_active;
        emit(CARSS_EVENT_STAFF);
    });
}

// Transactions
export function listTransactions(): Transaction[] {
    return loadDB().transactions.slice().sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function createTransaction(input: Omit<Transaction, "id" | "created_at" | "status" | "total_amount">): Transaction {
    const total = input.line_items.reduce((sum, li) => sum + li.qty * li.unit_price, 0);
    return withDB((db) => {
        const tx: Transaction = {
            ...input,
            id: uid("tx"),
            created_at: nowISO(),
            status: "CONFIRMED",
            total_amount: total,
        };
        db.transactions.push(tx);
        emit(CARSS_EVENT_TX);
        return tx;
    });
}

export function voidTransaction(tx_id: string) {
    withDB((db) => {
        const tx = db.transactions.find((t) => t.id === tx_id);
        if (tx) tx.status = "VOIDED";
        emit(CARSS_EVENT_TX);
    });
}
