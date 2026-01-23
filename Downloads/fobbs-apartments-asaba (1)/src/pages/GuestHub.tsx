
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout'; // Wait, layout is default export?
import { HOTEL_CONFIG } from '@/config/cars.config';
import { RoomNumberGate, ChangeRoomButton } from '@/components/RoomNumberGate';
import { ConfirmSendPanel } from '@/components/ConfirmSendPanel';
import { generateRequestId } from '@/lib/ids';
import { logGuestHubEvent } from '@/lib/logging';
import {
    getWhatsAppTargetNumber, openWhatsApp, openTelegram,
    buildRoomServiceMessage, buildHousekeepingMessage, buildIssueMessage, buildAddonMessage
} from '@/lib/channelRouting';
import {
    Utensils, Sparkles, AlertTriangle, PlusCircle, CreditCard,
    ChevronDown, ChevronUp, ShoppingCart, Info, Clock, Check
} from 'lucide-react';

// Re-using Layout logic but maybe simplifying header?
// Actually we can use the main Layout but just render content differently.
// Let's create a specialized container or just put it in the page.
import MainLayout from '@/components/Layout';

const GuestHub: React.FC = () => {
    const [roomNumber, setRoomNumber] = useState<string>('');
    const [activeModule, setActiveModule] = useState<'hub' | 'room_service' | 'housekeeping' | 'issues' | 'addons'>('hub');
    const [showPaymentInfo, setShowPaymentInfo] = useState(false);

    // Module States
    const [cart, setCart] = useState<{ item: any, quantity: number }[]>([]);
    const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
    const [issueCategory, setIssueCategory] = useState<string>('');
    const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
    const [notes, setNotes] = useState('');
    const [viewHelper, setViewHelper] = useState<'input' | 'confirm'>('input');
    const [requestId, setRequestId] = useState('');

    const handleGatePassed = (room: string) => {
        setRoomNumber(room);
    };

    const resetModule = () => {
        setActiveModule('hub');
        setViewHelper('input');
        setCart([]);
        setSelectedRequests([]);
        setIssueCategory('');
        setSelectedAddons([]);
        setNotes('');
        setRequestId('');
    };

    // --- GENERIC SEND HANDLER ---
    const handleProceedToConfirm = (prefix: "RS" | "HK" | "IS" | "AD") => {
        const newId = generateRequestId(prefix, HOTEL_CONFIG.business_code);
        setRequestId(newId);
        setViewHelper('confirm');
    };

    const handleSend = (channel: 'whatsapp' | 'telegram') => {
        let payload: any = {};
        let message = '';
        let targetKey = 'frontdesk';
        let subtotal = 0;
        let typeLabel = '';

        if (activeModule === 'room_service') {
            typeLabel = 'Room Service';
            targetKey = HOTEL_CONFIG.hotel.room_service.routing;
            subtotal = cart.reduce((sum, i) => sum + (i.item.price * i.quantity), 0);

            payload = {
                type: 'room_service',
                request_id: requestId,
                room_number: roomNumber,
                routing_target: targetKey,
                channel,
                subtotal,
                details: cart.map(c => ({ id: c.item.id, name: c.item.name, quantity: c.quantity, price: c.item.price })),
                notes
            };
            message = buildRoomServiceMessage(payload);
        }
        else if (activeModule === 'housekeeping') {
            typeLabel = 'Housekeeping';
            targetKey = HOTEL_CONFIG.hotel.housekeeping.routing;
            const reqLabels = HOTEL_CONFIG.hotel.housekeeping.requests.filter(r => selectedRequests.includes(r.id)).map(r => r.label);

            payload = {
                type: 'housekeeping',
                request_id: requestId,
                room_number: roomNumber,
                routing_target: targetKey,
                channel,
                subtotal: 0,
                details: reqLabels,
                requests: reqLabels, // for message builder
                notes
            };
            message = buildHousekeepingMessage(payload);
        }
        else if (activeModule === 'issues') {
            typeLabel = 'Issue Report';
            const cat = HOTEL_CONFIG.hotel.issues.categories.find(c => c.id === issueCategory);
            targetKey = cat?.routing || 'frontdesk';

            payload = {
                type: 'issue',
                request_id: requestId,
                room_number: roomNumber,
                routing_target: targetKey,
                channel,
                subtotal: 0,
                details: { category: cat?.label },
                category_label: cat?.label, // for builder
                notes
            };
            message = buildIssueMessage(payload);
        }
        else if (activeModule === 'addons') {
            typeLabel = 'Add-ons';
            // Routing might vary per item, but we need single target for message. 
            // We default to frontdesk if mixed, or first item's routing. 
            // Simple logic: default 'frontdesk' or 'manager' if sensitive. 
            // Let's use 'frontdesk' as primary coordinator for multi-addons.
            targetKey = 'frontdesk';

            const items = HOTEL_CONFIG.hotel.addons.items.filter(i => selectedAddons.includes(i.id));
            subtotal = items.reduce((sum, i) => sum + i.price, 0);

            payload = {
                type: 'addon',
                request_id: requestId,
                room_number: roomNumber,
                routing_target: targetKey,
                channel,
                subtotal,
                details: items.map(i => ({ label: i.label, price: i.price })),
                items: items.map(i => ({ label: i.label, price: i.price })), // for builder
                notes
            };
            message = buildAddonMessage(payload);
        }

        // Log it
        logGuestHubEvent(payload);

        // Open Channel
        if (channel === 'whatsapp') {
            const num = getWhatsAppTargetNumber(targetKey);
            openWhatsApp(num, message);
        } else {
            // Telegram always to Captlee77 as per request
            const handle = HOTEL_CONFIG.channels.telegram_handle || HOTEL_CONFIG.channels.telegram_url || '';
            openTelegram(handle, message);
        }

        // Optional: Reset? or stay? Staying often better in case user comes back to fix.
    };


    // --- RENDERING ---

    if (!roomNumber) {
        return (
            <MainLayout simpleHeader>
                <div className="max-w-md mx-auto px-4 py-12">
                    <RoomNumberGate onGatePassed={handleGatePassed} />
                </div>
            </MainLayout>
        );
    }

    // --- MAIN HUB VIEW ---
    if (activeModule === 'hub') {
        return (
            <MainLayout simpleHeader>
                <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-serif font-bold text-gray-900">Guest Hub</h2>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-bold text-xs uppercase">Room {roomNumber}</span>
                                <ChangeRoomButton onReset={() => setRoomNumber('')} />
                            </div>
                        </div>
                        <div className="text-right text-xs text-gray-400">
                            <Clock className="w-3 h-3 inline mr-1" />
                            ~5-10m Response
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => setActiveModule('room_service')} className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center space-y-3 hover:shadow-md transition-all active:scale-95">
                            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
                                <Utensils className="w-6 h-6" />
                            </div>
                            <span className="font-bold text-gray-900">Room Service</span>
                        </button>

                        <button onClick={() => setActiveModule('housekeeping')} className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center space-y-3 hover:shadow-md transition-all active:scale-95">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <span className="font-bold text-gray-900">Housekeeping</span>
                        </button>

                        <button onClick={() => setActiveModule('issues')} className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center space-y-3 hover:shadow-md transition-all active:scale-95">
                            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <span className="font-bold text-gray-900">Report Issue</span>
                        </button>

                        <button onClick={() => setActiveModule('addons')} className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center space-y-3 hover:shadow-md transition-all active:scale-95">
                            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                                <PlusCircle className="w-6 h-6" />
                            </div>
                            <span className="font-bold text-gray-900">Add-ons</span>
                        </button>
                    </div>

                    {/* Payment Info Toggle */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <button onClick={() => setShowPaymentInfo(!showPaymentInfo)} className="w-full flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center space-x-3">
                                <CreditCard className="w-5 h-5 text-gray-400" />
                                <span className="font-bold text-gray-700">Payment Information</span>
                            </div>
                            {showPaymentInfo ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                        </button>

                        {showPaymentInfo && (
                            <div className="p-4 bg-white space-y-4 text-sm text-gray-600 animate-slide-down">
                                <p className="italic text-xs text-gray-400">{HOTEL_CONFIG.hotel.payments.note}</p>
                                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <p className="font-bold text-gray-900 mb-1">Bank Transfer</p>
                                    <p>{HOTEL_CONFIG.hotel.payments.transfer.bank}</p>
                                    <p className="font-mono text-lg text-gray-900">{HOTEL_CONFIG.hotel.payments.transfer.account_number}</p>
                                    <p className="text-xs uppercase">{HOTEL_CONFIG.hotel.payments.transfer.account_name}</p>
                                </div>
                                <div className="flex gap-2">
                                    <span className="px-2 py-1 bg-gray-100 rounded text-xs font-bold text-gray-500">POS Available</span>
                                    <span className="px-2 py-1 bg-gray-100 rounded text-xs font-bold text-gray-500">USSD</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </MainLayout>
        );
    }

    // --- MODULE SUB-PAGES ---

    // Header for sub-pages
    const SubHeader = ({ title, icon: Icon }: any) => (
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
            <div className="flex items-center space-x-3">
                <button onClick={resetModule} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ChevronDown className="w-5 h-5 rotate-90" />
                </button>
                <div className="flex items-center space-x-2">
                    <Icon className="w-5 h-5 text-emerald-900" />
                    <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                </div>
            </div>
            <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-bold text-xs uppercase">Room {roomNumber}</span>
        </div>
    );

    // Confirmation Logic Helper
    const renderConfirmation = (typeLabel: string, summary: string[], subtotal?: number) => (
        <ConfirmSendPanel
            typeLabel={typeLabel}
            requestId={requestId}
            roomNumber={roomNumber}
            summaryLines={summary}
            subtotal={subtotal}
            notes={notes}
            onEdit={() => setViewHelper('input')}
            onSendWhatsApp={() => handleSend('whatsapp')}
            onSendTelegram={() => handleSend('telegram')}
        />
    );


    // --- ROOM SERVICE ---
    if (activeModule === 'room_service') {
        const categories = [...new Set(HOTEL_CONFIG.hotel.room_service.menu.map(i => i.category))];
        const currentTotal = cart.reduce((sum, i) => sum + (i.item.price * i.quantity), 0);

        if (viewHelper === 'confirm') {
            return (
                <MainLayout simpleHeader>
                    <div className="max-w-lg mx-auto px-4 py-8">
                        <SubHeader title="Confirm Order" icon={ShoppingCart} />
                        {renderConfirmation(
                            'Room Service Order',
                            cart.map(c => `${c.item.name} (x${c.quantity})`),
                            currentTotal
                        )}
                    </div>
                </MainLayout>
            )
        }

        return (
            <MainLayout simpleHeader>
                <div className="max-w-lg mx-auto px-4 py-8 pb-32">
                    <SubHeader title="Room Service" icon={Utensils} />

                    <div className="space-y-8">
                        {categories.map(cat => (
                            <div key={cat}>
                                <h3 className="font-bold text-gray-400 uppercase text-xs tracking-widest mb-3">{cat}</h3>
                                <div className="space-y-4">
                                    {HOTEL_CONFIG.hotel.room_service.menu.filter(i => i.category === cat).map(item => {
                                        const inCart = cart.find(c => c.item.id === item.id);
                                        const qty = inCart ? inCart.quantity : 0;

                                        const updateQty = (d: number) => {
                                            const newQty = qty + d;
                                            if (newQty <= 0) {
                                                setCart(cart.filter(c => c.item.id !== item.id));
                                            } else {
                                                if (inCart) {
                                                    setCart(cart.map(c => c.item.id === item.id ? { ...c, quantity: newQty } : c));
                                                } else {
                                                    setCart([...cart, { item, quantity: 1 }]);
                                                }
                                            }
                                        }

                                        return (
                                            <div key={item.id} className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                                <div>
                                                    <p className="font-bold text-gray-900">{item.name}</p>
                                                    <p className="text-sm text-emerald-700 font-medium">₦{item.price.toLocaleString()}</p>
                                                </div>
                                                <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-1">
                                                    <button onClick={() => updateQty(-1)} className={`w-8 h-8 flex items-center justify-center rounded-md font-bold ${qty > 0 ? 'bg-white shadow text-gray-900' : 'text-gray-300'}`}>-</button>
                                                    <span className="w-4 text-center font-bold text-sm">{qty}</span>
                                                    <button onClick={() => updateQty(1)} className="w-8 h-8 flex items-center justify-center rounded-md font-bold bg-emerald-900 text-white shadow">+</button>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom Bar */}
                    {cart.length > 0 && (
                        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
                            <div className="max-w-lg mx-auto">
                                <div className="mb-4">
                                    <textarea
                                        placeholder={HOTEL_CONFIG.hotel.room_service.notes_hint}
                                        className="w-full bg-gray-50 rounded-xl border-none text-sm p-3 focus:ring-1 focus:ring-emerald-500 max-h-20"
                                        rows={2}
                                        value={notes}
                                        onChange={e => setNotes(e.target.value)}
                                    />
                                </div>
                                <button onClick={() => handleProceedToConfirm('RS')} className="w-full py-4 bg-emerald-900 text-white rounded-xl font-bold shadow-lg flex items-center justify-between px-6">
                                    <span className="flex items-center"><ShoppingCart className="w-5 h-5 mr-2" /> {cart.reduce((s, i) => s + i.quantity, 0)} Items</span>
                                    <span>₦{currentTotal.toLocaleString()} &rarr;</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </MainLayout>
        );
    }

    // --- HOUSEKEEPING ---
    if (activeModule === 'housekeeping') {
        if (viewHelper === 'confirm') {
            return (
                <MainLayout simpleHeader>
                    <div className="max-w-lg mx-auto px-4 py-8">
                        <SubHeader title="Confirm Request" icon={Sparkles} />
                        {renderConfirmation(
                            'Housekeeping Request',
                            HOTEL_CONFIG.hotel.housekeeping.requests.filter(r => selectedRequests.includes(r.id)).map(r => r.label),
                            0
                        )}
                    </div>
                </MainLayout>
            )
        }

        return (
            <MainLayout simpleHeader>
                <div className="max-w-lg mx-auto px-4 py-8 pb-24">
                    <SubHeader title="Housekeeping" icon={Sparkles} />

                    <div className="grid grid-cols-1 gap-3">
                        {HOTEL_CONFIG.hotel.housekeeping.requests.map(req => {
                            const isSelected = selectedRequests.includes(req.id);
                            return (
                                <button
                                    key={req.id}
                                    onClick={() => {
                                        if (isSelected) setSelectedRequests(selectedRequests.filter(id => id !== req.id));
                                        else setSelectedRequests([...selectedRequests, req.id]);
                                    }}
                                    className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all ${isSelected ? 'bg-emerald-50 border-emerald-500 shadow-md ring-1 ring-emerald-500' : 'bg-white border-gray-100 hover:border-emerald-200'}`}
                                >
                                    <span className={`font-medium ${isSelected ? 'text-emerald-900 font-bold' : 'text-gray-700'}`}>{req.label}</span>
                                    {isSelected && <Check className="w-5 h-5 text-emerald-600" />}
                                </button>
                            )
                        })}
                    </div>

                    <div className="mt-6 space-y-4">
                        <textarea
                            placeholder={HOTEL_CONFIG.hotel.housekeeping.notes_hint}
                            className="w-full bg-white rounded-xl border border-gray-200 text-sm p-3 focus:ring-2 focus:ring-emerald-500"
                            rows={3}
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                        />
                        <button
                            disabled={selectedRequests.length === 0}
                            onClick={() => handleProceedToConfirm('HK')}
                            className="w-full py-4 bg-emerald-900 disabled:bg-gray-300 disabled:text-gray-500 text-white rounded-xl font-bold shadow-lg transition-all"
                        >
                            Proceed
                        </button>
                    </div>
                </div>
            </MainLayout>
        );
    }

    // --- ISSUES ---
    if (activeModule === 'issues') {
        if (viewHelper === 'confirm') {
            const catLabel = HOTEL_CONFIG.hotel.issues.categories.find(c => c.id === issueCategory)?.label || 'Issue';
            return (
                <MainLayout simpleHeader>
                    <div className="max-w-lg mx-auto px-4 py-8">
                        <SubHeader title="Confirm Report" icon={AlertTriangle} />
                        {renderConfirmation(
                            'Issue Report',
                            [`Category: ${catLabel}`],
                            0
                        )}
                    </div>
                </MainLayout>
            )
        }

        return (
            <MainLayout simpleHeader>
                <div className="max-w-lg mx-auto px-4 py-8 pb-24">
                    <SubHeader title="Report Issue" icon={AlertTriangle} />

                    <div className="space-y-2 mb-6">
                        <label className="text-xs font-bold text-gray-500 uppercase">Issue Category</label>
                        <select
                            className="w-full p-4 bg-white rounded-xl border border-gray-200 font-medium focus:ring-2 focus:ring-emerald-500"
                            value={issueCategory}
                            onChange={e => setIssueCategory(e.target.value)}
                        >
                            <option value="">Select Category...</option>
                            {HOTEL_CONFIG.hotel.issues.categories.map(c => (
                                <option key={c.id} value={c.id}>{c.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-4">
                        <label className="text-xs font-bold text-gray-500 uppercase">Description / Details</label>
                        <textarea
                            placeholder={HOTEL_CONFIG.hotel.issues.notes_hint}
                            className="w-full bg-white rounded-xl border border-gray-200 text-sm p-3 focus:ring-2 focus:ring-emerald-500"
                            rows={4}
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                        />
                        <button
                            disabled={!issueCategory}
                            onClick={() => handleProceedToConfirm('IS')}
                            className="w-full py-4 bg-emerald-900 disabled:bg-gray-300 disabled:text-gray-500 text-white rounded-xl font-bold shadow-lg transition-all"
                        >
                            Proceed
                        </button>
                    </div>
                </div>
            </MainLayout>
        );
    }

    // --- ADDONS ---
    if (activeModule === 'addons') {
        const items = HOTEL_CONFIG.hotel.addons.items.filter(i => selectedAddons.includes(i.id));
        const subtotal = items.reduce((s, i) => s + i.price, 0);

        if (viewHelper === 'confirm') {
            return (
                <MainLayout simpleHeader>
                    <div className="max-w-lg mx-auto px-4 py-8">
                        <SubHeader title="Confirm Add-ons" icon={PlusCircle} />
                        {renderConfirmation(
                            'Add-on Request',
                            items.map(i => i.label),
                            subtotal
                        )}
                    </div>
                </MainLayout>
            )
        }

        return (
            <MainLayout simpleHeader>
                <div className="max-w-lg mx-auto px-4 py-8 pb-24">
                    <SubHeader title="Add-ons & Extras" icon={PlusCircle} />

                    <div className="space-y-3">
                        {HOTEL_CONFIG.hotel.addons.items.map(item => {
                            const isSelected = selectedAddons.includes(item.id);
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        if (isSelected) setSelectedAddons(selectedAddons.filter(id => id !== item.id));
                                        else setSelectedAddons([...selectedAddons, item.id]);
                                    }}
                                    className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all ${isSelected ? 'bg-emerald-50 border-emerald-500 shadow-md ring-1 ring-emerald-500' : 'bg-white border-gray-100 hover:border-emerald-200'}`}
                                >
                                    <div>
                                        <p className={`font-medium ${isSelected ? 'text-emerald-900 font-bold' : 'text-gray-700'}`}>{item.label}</p>
                                        {item.price > 0 && <p className="text-xs text-emerald-600 font-bold mt-1">+{item.price.toLocaleString()}</p>}
                                    </div>
                                    {isSelected && <Check className="w-5 h-5 text-emerald-600" />}
                                </button>
                            )
                        })}
                    </div>

                    <div className="mt-6 space-y-4">
                        <textarea
                            placeholder={HOTEL_CONFIG.hotel.addons.notes_hint}
                            className="w-full bg-white rounded-xl border border-gray-200 text-sm p-3 focus:ring-2 focus:ring-emerald-500"
                            rows={3}
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                        />
                        <button
                            disabled={selectedAddons.length === 0}
                            onClick={() => handleProceedToConfirm('AD')}
                            className="w-full py-4 bg-emerald-900 disabled:bg-gray-300 disabled:text-gray-500 text-white rounded-xl font-bold shadow-lg transition-all"
                        >
                            Proceed {subtotal > 0 && `(₦${subtotal.toLocaleString()})`}
                        </button>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return null; // Should not happen
};

export default GuestHub;
