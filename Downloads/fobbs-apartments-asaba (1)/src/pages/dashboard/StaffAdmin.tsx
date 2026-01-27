import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { UserPlus, Copy, Check, Users, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const DEPTS = ['restaurant', 'bar', 'reception', 'housekeeping'];

const StaffAdmin: React.FC = () => {
    const { profile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [generatedCreds, setGeneratedCreds] = useState<{ email: string, password: string } | null>(null);
    const [formData, setFormData] = useState({
        full_name: '',
        department: 'restaurant',
        role: 'staff' // hidden/fixed mostly
    });

    const generatePassword = () => {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#';
        let pass = '';
        for (let i = 0; i < 10; i++) {
            pass += chars[Math.floor(Math.random() * chars.length)];
        }
        return pass;
    };

    const handleCreate = async (dept?: string, roleOverride?: string) => {
        if (!profile?.business_id) {
            toast.error("Error: Admin business ID missing");
            return;
        }

        const deptToUse = dept || formData.department;
        const roleToUse = roleOverride || formData.role;
        const tempPassword = generatePassword();

        // Auto-email: staff.dept.random@fobbs.com
        const rand = Math.floor(Math.random() * 9000) + 1000;
        const email = `staff.${deptToUse || roleToUse}.${rand}@fobbs.com`;
        const name = formData.full_name || `${deptToUse ? deptToUse.charAt(0).toUpperCase() + deptToUse.slice(1) : 'Staff'} ${roleToUse === 'manager' ? 'Manager' : ''}`;

        setLoading(true);
        setGeneratedCreds(null);

        try {
            // Using Supabase Edge Function
            // Ensure you have deployed the function: supabase functions deploy create-staff-user
            const { data, error } = await supabase!.functions.invoke('create-staff-user', {
                body: {
                    email,
                    password: tempPassword,
                    full_name: name,
                    role: roleToUse,
                    department: deptToUse,
                    business_id: profile.business_id
                }
            });

            if (error) {
                console.error("Function error:", error);
                throw new Error(error.message || "Failed to invoke function");
            }

            if (data?.error) {
                throw new Error(data.error);
            }

            setGeneratedCreds({ email, password: tempPassword });
            toast.success("Staff account created!");
            setFormData({ ...formData, full_name: '' }); // reset name only

        } catch (error: any) {
            console.error("Creation error:", error);
            toast.error(`Failed: ${error.message}. Ensure Edge Function is deployed.`);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied!");
    };

    if (!['owner', 'ceo', 'manager'].includes(profile?.role || '')) {
        return <div className="p-8">Access Denied</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-emerald-100 rounded-lg text-emerald-700">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Staff Management</h2>
                        <p className="text-gray-500 text-sm">Create account credentials for your team.</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {DEPTS.map(dept => (
                        <button
                            key={dept}
                            onClick={() => handleCreate(dept, 'staff')}
                            disabled={loading}
                            className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
                        >
                            <UserPlus className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 mb-2" />
                            <span className="text-sm font-medium capitalize">{dept} Staff</span>
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <button
                        onClick={() => handleCreate(undefined, 'manager')}
                        disabled={loading}
                        className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all font-medium text-gray-600"
                    >
                        <UserPlus className="w-5 h-5 mr-2" />
                        Quick Create Manager
                    </button>
                </div>

                {/* Result Display */}
                {generatedCreds && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Check className="w-24 h-24 text-green-600" />
                        </div>
                        <h3 className="font-bold text-green-900 mb-4 flex items-center gap-2">
                            <Check className="w-5 h-5" /> Account Created Successfully
                        </h3>
                        <div className="space-y-3 max-w-md relative z-10">
                            <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-green-100">
                                <div>
                                    <span className="text-xs text-gray-500 block uppercase tracking-wider">Email</span>
                                    <span className="font-mono text-gray-900 font-medium">{generatedCreds.email}</span>
                                </div>
                                <button onClick={() => copyToClipboard(generatedCreds.email)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600">
                                    <Copy className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-green-100">
                                <div>
                                    <span className="text-xs text-gray-500 block uppercase tracking-wider">Password</span>
                                    <span className="font-mono text-gray-900 font-medium">{generatedCreds.password}</span>
                                </div>
                                <button onClick={() => copyToClipboard(generatedCreds.password)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600">
                                    <Copy className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <p className="mt-4 text-xs text-green-700 bg-green-100/50 p-2 rounded">
                            ⚠️ Copy these credentials now. The password cannot be viewed again.
                        </p>
                    </div>
                )}
            </div>

            <div className="text-center text-xs text-gray-400">
                Requires 'create-staff-user' Edge Function deployed.
            </div>
        </div>
    );
};

export default StaffAdmin;
