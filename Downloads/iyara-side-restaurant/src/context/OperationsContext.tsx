
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from '../types';

export interface Order {
    id: string;
    tableNumber: string;
    items: CartItem[];
    totalAmount: number;
    paymentMethod: 'POS' | 'CASH' | 'TRANSFER';
    timestamp: string; // ISO
    status: 'PENDING' | 'PREPARING' | 'SERVED' | 'PAID';
    assignedStaff?: string;
}

interface OperationsContextType {
    orders: Order[];
    addOrder: (order: Order) => void;
    updateOrderStatus: (id: string, status: Order['status']) => void;
}

const OperationsContext = createContext<OperationsContextType | undefined>(undefined);

export const OperationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [orders, setOrders] = useState<Order[]>([]);

    const addOrder = (order: Order) => {
        // Auto-assign staff logic (Mock)
        const staffPool = ['Chioma', 'Tunde', 'Emeka'];
        const randomStaff = staffPool[Math.floor(Math.random() * staffPool.length)];

        const newOrder = {
            ...order,
            assignedStaff: randomStaff,
            timestamp: new Date().toISOString()
        };

        setOrders(prev => [newOrder, ...prev]);
        console.log("🚀 NEW ORDER RECEIVED:", newOrder);
    };

    const updateOrderStatus = (id: string, status: Order['status']) => {
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    };

    return (
        <OperationsContext.Provider value={{ orders, addOrder, updateOrderStatus }}>
            {children}
        </OperationsContext.Provider>
    );
};

export const useOperations = () => {
    const context = useContext(OperationsContext);
    if (context === undefined) {
        throw new Error('useOperations must be used within an OperationsProvider');
    }
    return context;
};
