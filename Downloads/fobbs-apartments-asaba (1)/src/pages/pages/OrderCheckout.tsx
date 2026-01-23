import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, User, Phone, MapPin, CreditCard, Banknote, CheckCircle2, ShoppingBag, MessageSquare, Loader2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { supabase } from '../lib/supabaseClient';
import { getOrCreateCustomer } from '../services/customers';
import { awardLoyaltyPoints } from '../services/loyalty';

const OrderCheckout: React.FC = () => {
  const navigate = useNavigate();
  const { cart, clearCart, orderLocation } = useStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'table' | 'transfer'>('table');
  const [details, setDetails] = useState({ name: '', phone: '' });
  const [orderId, setOrderId] = useState('');

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (cart.length === 0 && step !== 3) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <ShoppingBag className="w-16 h-16 text-gray-200 mb-4" />
        <h2 className="text-xl font-bold text-gray-900">Your cart is empty</h2>
        <button 
          onClick={() => navigate('/restaurant')}
          className="mt-4 px-8 py-3 bg-emerald-900 text-white rounded-full font-bold"
        >
          Back to Menu
        </button>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    setLoading(true);
    const orderRef = `FOBBS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setOrderId(orderRef);

    try {
      // Retrieve the current business ID
      const { data: busData } = await supabase.from('businesses').select('id').limit(1).maybeSingle();
      const busId = busData?.id;

      // Handle customer capture
      const customer = await getOrCreateCustomer(busId, details.name, details.phone);

      // Award loyalty points (non-blocking)
      if (customer?.id && busId) {
        awardLoyaltyPoints({
          customerId: customer.id,
          businessId: busId,
          amount: totalPrice
        });
      }

      // Record order in Supabase with customer_id link
      const { error } = await supabase.from('orders').insert({
        reference: orderRef,
        customer_id: customer?.id,
        customer_name: details.name,
        customer_phone: details.phone,
        location: orderLocation,
        items: cart.map(item => ({ id: item.id, name: item.name, quantity: item.quantity, price: item.price })),
        total_amount: totalPrice,
        payment_method: paymentMethod,
        status: 'pending'
      });

      if (error) {
        console.warn("Could not save order to database, but proceeding to payment...", error);
      }

      // Construct WhatsApp Message
      const itemsList = cart.map(i => `${i.quantity}x ${i.name}`).join('%0A');
      const message = `*FOBBS APARTMENTS - NEW ORDER*%0A---------------------------%0A*Ref:* ${orderRef}%0A*Customer:* ${details.name}%0A*Phone:* ${details.phone}%0A*Location:* ${orderLocation}%0A---------------------------%0A*Items:*%0A${itemsList}%0A---------------------------%0A*Total Amount:* ₦${totalPrice.toLocaleString()}%0A*Payment Method:* ${paymentMethod === 'card' ? 'Online Card' : paymentMethod === 'transfer' ? 'Bank Transfer' : 'Pay at Table'}%0A---------------------------%0APlease confirm my order. Thank you!`;
      
      const whatsappUrl = `https://wa.me/2347048033575?text=${message}`;
      
      // Navigate to success state
      setStep(3);
      clearCart();

      // Open WhatsApp after a brief delay to ensure UI updates
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 500);

    } catch (err) {
      console.error("Order processing error:", err);
      alert("There was an error processing your order. Please try again or contact us directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-24">
      <div className="max-w-3xl mx-auto px-4">
        {step < 3 && (
          <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-gray-500 font-bold mb-8 hover:text-emerald-900 transition-colors">
            <ChevronLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        )}

        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Your Details</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-2">Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                    <input 
                      type="text" 
                      placeholder="Your Name"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 font-medium" 
                      value={details.name}
                      onChange={(e) => setDetails({...details, name: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-2">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                    <input 
                      type="tel" 
                      placeholder="0803..."
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 font-medium" 
                      value={details.phone}
                      onChange={(e) => setDetails({...details, phone: e.target.value})}
                    />
                  </div>
                </div>
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="text-[10px] font-bold text-emerald-600 uppercase">Delivering to</p>
                    <p className="text-sm font-bold text-emerald-900">{orderLocation}</p>
                  </div>
                </div>
              </div>
              <button 
                disabled={!details.name || !details.phone}
                onClick={() => setStep(2)}
                className="w-full py-4 bg-emerald-900 text-white rounded-2xl font-bold shadow-xl shadow-emerald-900/20 hover:bg-emerald-800 disabled:opacity-50 transition-all active:scale-95"
              >
                Continue to Payment
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Payment Selection</h2>
              <div className="space-y-4">
                {[
                  { id: 'table', icon: Banknote, label: 'Pay at Counter / Table', sub: 'Cash or POS' },
                  { id: 'transfer', icon: MessageSquare, label: 'Pay via WhatsApp Transfer', sub: 'Instant receipt confirmation' },
                  { id: 'card', icon: CreditCard, label: 'Pay with Card', sub: 'Secure via Paystack' },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`w-full flex items-center justify-between p-6 rounded-[2rem] border-2 transition-all ${
                      paymentMethod === m.id ? 'bg-emerald-50 border-emerald-900' : 'bg-white border-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <m.icon className={`w-6 h-6 ${paymentMethod === m.id ? 'text-emerald-600' : 'text-gray-400'}`} />
                      </div>
                      <div className="text-left">
                        <p className={`font-bold ${paymentMethod === m.id ? 'text-emerald-900' : 'text-gray-900'}`}>{m.label}</p>
                        <p className="text-xs text-gray-400">{m.sub}</p>
                      </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === m.id ? 'border-emerald-900' : 'border-gray-200'
                    }`}>
                      {paymentMethod === m.id && <div className="w-2.5 h-2.5 bg-emerald-900 rounded-full"></div>}
                    </div>
                  </button>
                ))}
              </div>

              <div className="pt-6 border-t border-gray-50 space-y-4">
                <div className="flex justify-between font-bold text-lg text-emerald-900">
                  <span>Order Total</span>
                  <span>₦{totalPrice.toLocaleString()}</span>
                </div>
                <button 
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="w-full py-4 bg-emerald-900 text-white rounded-2xl font-bold shadow-xl shadow-emerald-900/20 hover:bg-emerald-800 transition-all flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      <span>Place Order & Pay</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-24 space-y-8 animate-fade-in">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-gray-900">Order Received!</h2>
              <p className="text-gray-500 font-medium">Ref: <span className="text-emerald-900 font-bold">{orderId}</span></p>
              <p className="text-gray-500 font-medium">Delivering to <span className="text-emerald-900 font-bold">{orderLocation}</span></p>
            </div>
            
            <div className="bg-emerald-50 rounded-[2rem] p-6 border border-emerald-100 max-w-sm mx-auto space-y-4">
              <p className="text-sm text-emerald-800">
                If your WhatsApp didn't open automatically, click the button below to confirm your payment with our staff.
              </p>
              <button 
                onClick={() => {
                  const message = `*FOBBS APARTMENTS*%0AConfirming Ref: ${orderId}%0AAmount: ₦${totalPrice.toLocaleString()}`;
                  window.open(`https://wa.me/2347048033575?text=${message}`, '_blank');
                }}
                className="w-full flex items-center justify-center space-x-2 py-3 bg-[#25D366] text-white rounded-xl font-bold shadow-lg shadow-green-500/20"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Confirm on WhatsApp</span>
              </button>
            </div>

            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Our kitchen staff has been notified. Estimated preparation time is 15-20 minutes.
            </p>
            
            <button 
              onClick={() => navigate('/')}
              className="px-12 py-4 bg-emerald-900 text-white rounded-full font-bold shadow-xl hover:bg-emerald-800 transition-all"
            >
              Return Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderCheckout;