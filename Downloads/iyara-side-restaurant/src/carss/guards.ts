import { Staff } from "./storage";

export function isCEO(staff: Staff | null) {
    return staff?.role === "ceo";
}

export function canSeeAllTx(staff: Staff | null) {
    return staff?.role === "ceo" || staff?.role === "manager";
}
