/**
 * Messaging Configuration for WhatsApp and Telegram Routing
 * Frontend-only deployment configuration
 */

export const MESSAGING_CONFIG = {
    whatsapp: {
        phone: "2347048033575", // Restaurant WhatsApp number
        baseUrl: "https://wa.me/",
    },
    telegram: {
        botToken: "", // Leave empty for frontend-only (user can configure)
        chatId: "", // Staff group chat ID
        botUrl: "https://api.telegram.org/bot",
    },
    notifications: {
        enableWhatsApp: true,
        enableTelegram: true, // Will fallback to web.telegram if no bot configured
        enableLiveDashboard: true,
    },
} as const;

export type PaymentMethodType = "POS" | "CASH" | "TRANSFER";

export interface OrderNotification {
    orderId: string;
    tableNumber: string;
    items: Array<{ name: string; quantity: number; price: number }>;
    totalAmount: number;
    paymentMethod: PaymentMethodType;
    timestamp: string;
}

/**
 * Format order for WhatsApp message
 */
export function formatWhatsAppMessage(order: OrderNotification): string {
    const methodMap = {
        POS: "💳 POS Terminal",
        CASH: "💵 Cash",
        TRANSFER: "📱 Bank Transfer",
    };

    const tableHeader = order.tableNumber
        ? `*TABLE NUMBER: ${order.tableNumber}*%0A%0A`
        : "";
    const itemsText = order.items
        .map(
            (item) =>
                `- ${item.quantity}x ${item.name} (₦${(
                    item.price * item.quantity
                ).toLocaleString()})`
        )
        .join("%0A");
    const totalText = `*Total: ₦${order.totalAmount.toLocaleString()}*`;
    const paymentText = `Payment: ${methodMap[order.paymentMethod]}`;
    const timestamp = `Time: ${new Date(order.timestamp).toLocaleTimeString()}`;

    return `${tableHeader}🔔 *NEW ORDER* (${order.orderId}):%0A%0A${itemsText}%0A%0A${totalText}%0A${paymentText}%0A${timestamp}%0A%0APlease confirm receipt.`;
}

/**
 * Format order for Telegram message
 */
export function formatTelegramMessage(order: OrderNotification): string {
    const methodMap = {
        POS: "💳 POS Terminal",
        CASH: "💵 Cash",
        TRANSFER: "📱 Bank Transfer",
    };

    const tableHeader = order.tableNumber
        ? `**TABLE NUMBER: ${order.tableNumber}**\n\n`
        : "";
    const itemsText = order.items
        .map(
            (item) =>
                `• ${item.quantity}x ${item.name} (₦${(
                    item.price * item.quantity
                ).toLocaleString()})`
        )
        .join("\n");
    const totalText = `**Total: ₦${order.totalAmount.toLocaleString()}**`;
    const paymentText = `Payment: ${methodMap[order.paymentMethod]}`;
    const timestamp = `⏰ ${new Date(order.timestamp).toLocaleTimeString()}`;

    return `${tableHeader}🔔 **NEW ORDER** (${order.orderId})\n\n${itemsText}\n\n${totalText}\n${paymentText}\n${timestamp}\n\nPlease confirm receipt.`;
}

/**
 * Send order notification via WhatsApp
 */
export function sendWhatsAppNotification(order: OrderNotification): void {
    const message = formatWhatsAppMessage(order);
    const url = `${MESSAGING_CONFIG.whatsapp.baseUrl}${MESSAGING_CONFIG.whatsapp.phone}?text=${message}`;
    window.open(url, "_blank");
}

/**
 * Send order notification via Telegram (opens web.telegram.org with pre-filled message)
 */
export function sendTelegramNotification(order: OrderNotification): void {
    const message = formatTelegramMessage(order);

    // If bot is configured, attempt to send via bot API (requires CORS proxy or backend)
    if (MESSAGING_CONFIG.telegram.botToken && MESSAGING_CONFIG.telegram.chatId) {
        // For frontend-only, we'll open Telegram Web instead
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://web.telegram.org/`, "_blank");

        // Copy message to clipboard for easy pasting
        navigator.clipboard.writeText(message).catch(() => {
            console.warn("Failed to copy to clipboard");
        });

        alert("Telegram message copied to clipboard. Please paste it in your staff group.");
    } else {
        // Fallback: Open Telegram Web
        navigator.clipboard.writeText(message).catch(() => {
            console.warn("Failed to copy to clipboard");
        });
        window.open(`https://web.telegram.org/`, "_blank");
        alert("Telegram message copied to clipboard. Please paste it in your staff group.");
    }
}

/**
 * Send notifications via all enabled channels
 */
export function sendOrderNotifications(order: OrderNotification): void {
    if (MESSAGING_CONFIG.notifications.enableWhatsApp) {
        sendWhatsAppNotification(order);
    }

    // Telegram is optional - only send if explicitly requested
    // if (MESSAGING_CONFIG.notifications.enableTelegram) {
    //   sendTelegramNotification(order);
    // }
}
