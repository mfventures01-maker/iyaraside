
import React, { useState } from 'react';
import { X, CreditCard, Banknote, Smartphone, CheckCircle } from '@/components/EmergencyLucideWrapper';
import { useCart } from '../context/CartContext';
import { useOperations } from '../context/OperationsContext';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
    const { cart, totalPrice, tableNumber, setTableNumber, clearCart } = useCart();
    const { addOrder } = useOperations();

    const [localTable, setLocalTable] = useState(tableNumber || '');
    const [paymentMethod, setPaymentMethod] = useState<'POS' | 'CASH' | 'TRANSFER' | ''>('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!paymentMethod) return;

        setIsProcessing(true);

        // 1. Update Global Table Number
        if (localTable) setTableNumber(localTable);

        // 2. Create Order Object
        const orderId = `ORD-${Math.floor(Math.random() * 10000)}`;
        const newOrder = {
            id: orderId,
            tableNumber: localTable || 'Unknown',
            items: cart,
            totalAmount: totalPrice,
            paymentMethod: paymentMethod as any,
            timestamp: new Date().toISOString(),
            status: 'PENDING' as const
        };

        // 3. Emit to Live Dashboard (Mock Backend)
        addOrder(newOrder);

        // 4. Send to WhatsApp (User Notification / Fallback)
        const phone = "2347048033575";
        const methodMap = { POS: 'POS Terminal', CASH: 'Cash', TRANSFER: 'Bank Transfer' };
        const methodText = methodMap[paymentMethod];

        const tableHeader = localTable ? `*TABLE NUMBER: ${localTable}*%0A%0A` : '';
        const itemsText = cart.map(item => `- ${item.quantity}x ${item.name} (₦${(item.price * item.quantity).toLocaleString()})`).join('%0A');
        const totalText = `Total: ₦${totalPrice.toLocaleString()}`;
        const paymentText = `Payment Method: ${methodText}`;

        const message = `${tableHeader}NEW ORDER (${orderId}):%0A%0A${itemsText}%0A%0A${totalText}%0A${paymentText}%0A%0APlease confirm.`;

        // Simulate network delay
        setTimeout(() => {
            window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
            setIsProcessing(false);
            setIsSuccess(true);
            clearCart();
            setTimeout(() => {
                onClose();
                setIsSuccess(false);
            }, 2000);
        }, 1500);
    };

    if (isSuccess) {
        return (
            <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                <div className="bg-white rounded-3xl p-10 text-center max-w-sm w-full animate-bounce-in">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="text-green-600" size={40} />
                    </div>
                    <h2 className="text-2xl font-black text-brand-green mb-2">Order Sent!</h2>
                    <p className="text-gray-500">The kitchen has received your order.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-[2rem] max-w-md w-full overflow-hidden shadow-2xl">
                <div className="bg-brand-green p-6 flex justify-between items-center text-white">
                    <h2 className="text-xl font-serif font-bold">Checkout</h2>
                    <button onClick={onClose}><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-8">
                    {/* Table Number Section */}
                    <div className="mb-8">
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Table Number</label>
                        <input
                            type="text"
                            value={localTable}
                            onChange={(e) => setLocalTable(e.target.value)}
                            placeholder="E.g. 5"
                            required
                            className="w-full bg-gray-100 border-2 border-transparent focus:border-brand-gold rounded-xl px-4 py-3 text-lg font-bold text-brand-green outline-none transition-all"
                        />
                    </div>

                    {/* Payment Method Section */}
                    <div className="mb-8">
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Payment Method</label>
                        <div className="grid grid-cols-3 gap-3">
                            <button
                                type="button"
                                onClick={() => setPaymentMethod('POS')}
                                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${paymentMethod === 'POS' ? 'border-brand-gold bg-brand-gold/10 text-brand-dark' : 'border-gray-200 text-gray-400 hover:border-brand-gold/50'}`}
                            >
                                <CreditCard size={24} className="mb-2" />
                                <span className="text-[10px] font-bold uppercase">POS</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setPaymentMethod('CASH')}
                                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${paymentMethod === 'CASH' ? 'border-brand-gold bg-brand-gold/10 text-brand-dark' : 'border-gray-200 text-gray-400 hover:border-brand-gold/50'}`}
                            >
                                <Banknote size={24} className="mb-2" />
                                <span className="text-[10px] font-bold uppercase">Cash</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setPaymentMethod('TRANSFER')}
                                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${paymentMethod === 'TRANSFER' ? 'border-brand-gold bg-brand-gold/10 text-brand-dark' : 'border-gray-200 text-gray-400 hover:border-brand-gold/50'}`}
                            >
                                <Smartphone size={24} className="mb-2" />
                                <span className="text-[10px] font-bold uppercase">Transfer</span>
                            </button>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-brand-cream p-4 rounded-xl mb-8 flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Total to Pay</span>
                        <span className="text-2xl font-black text-brand-green">₦{totalPrice.toLocaleString()}</span>
                    </div>

                    <button
                        type="submit"
                        disabled={isProcessing || !paymentMethod || !localTable}
                        className={`w-full py-4 rounded-xl font-black text-lg flex items-center justify-center transition-all ${isProcessing || !paymentMethod || !localTable ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-brand-gold text-brand-green hover:bg-brand-dark hover:text-white shadow-lg'}`}
                    >
                        {isProcessing ? 'Processing...' : 'CONFIRM ORDER'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CheckoutModal;
