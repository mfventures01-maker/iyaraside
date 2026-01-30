import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { Mail, User, Briefcase, Send, AlertCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const DEPARTMENTS = ['Restaurant', 'Bar', 'Reception', 'Housekeeping'];

const StaffAdmin: React.FC = () => {
    const { profile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'Restaurant' // Default
    });

    // Permission Check
    if (!profile || !['owner', 'ceo', 'manager'].includes(profile.role)) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[50vh] text-gray-500">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <h2 className="text-xl font-semibold text-gray-700">Access Denied</h2>
                    <p>Only Owners and Managers can access this page.</p>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMsg(null);
        setErrorMsg(null);

        try {
            // Get current session token for auth
            const { data: { session } } = await supabase!.auth.getSession();
            if (!session?.access_token) {
                throw new Error("No active session. Please login again.");
            }

            const response = await fetch('/api/create-staff-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    role: formData.role
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send invite');
            }

            setSuccessMsg(`Invite sent successfully to ${data.email}!`);
            toast.success("Invite sent!");
            setFormData({ name: '', email: '', role: 'Restaurant' }); // Reset form

        } catch (error: any) {
            console.error("Invite error:", error);
            setErrorMsg(error.message);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 sm:p-8 bg-gradient-to-br from-emerald-900 to-emerald-950 text-white">
                    <h2 className="text-2xl font-serif font-bold mb-2">Invite Staff Member</h2>
                    <p className="text-emerald-200">
                        Send an invitation email to add a new staff member to your team.
                        They will receive a link to set their password.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
                    {/* Name Input */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                id="name"
                                type="text"
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                                placeholder="e.g. John Doe"
                            />
                        </div>
                    </div>

                    {/* Email Input */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                id="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                                placeholder="staff@fobbs.com"
                            />
                        </div>
                    </div>

                    {/* Department Select */}
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                            Department / Role
                        </label>
                        <div className="relative">
                            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <select
                                id="role"
                                value={formData.role}
                                onChange={e => setFormData({ ...formData, role: e.target.value })}
                                className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors appearance-none"
                            >
                                {DEPARTMENTS.map(dept => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    {errorMsg && (
                        <div className="p-4 bg-red-50 text-red-700 rounded-xl flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                            <span className="text-sm font-medium">{errorMsg}</span>
                        </div>
                    )}

                    {successMsg && (
                        <div className="p-4 bg-green-50 text-green-700 rounded-xl flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                            <span className="text-sm font-medium">{successMsg}</span>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-900 text-white py-4 rounded-xl font-semibold hover:bg-emerald-800 transition-all shadow-lg active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <span className="animate-pulse">Sending Invite...</span>
                        ) : (
                            <>
                                <Send className="w-5 h-5" />
                                Send Invitation
                            </>
                        )}
                    </button>

                    <p className="text-center text-xs text-gray-400 mt-4">
                        Powered by Supabase Auth & Vercel Edge Functions
                    </p>
                </form>
            </div>
        </div>
    );
};

export default StaffAdmin;
