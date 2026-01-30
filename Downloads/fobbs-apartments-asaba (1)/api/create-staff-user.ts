import { createClient } from '@supabase/supabase-js';

export const config = {
    runtime: 'edge',
};

interface CreateStaffRequest {
    name: string;
    email: string;
    role: 'Restaurant' | 'Bar' | 'Reception' | 'Housekeeping';
}

export default async function handler(request: Request) {
    // 1. Method Check
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }

    // 2. Auth Header Check
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
        return new Response(JSON.stringify({ error: 'Missing Authorization header' }), { status: 401 });
    }
    const token = authHeader.replace('Bearer ', '');

    // 3. Env Vars Check
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        return new Response(JSON.stringify({ error: 'Server configuration error' }), { status: 500 });
    }

    // 4. Init Supabase Clients
    // Admin client for user management
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });

    // 5. Verify Caller (Auth & Role)
    try {
        // Get caller user from token
        const { data: { user: callerUser }, error: userError } = await supabaseAdmin.auth.getUser(token);

        if (userError || !callerUser) {
            return new Response(JSON.stringify({ error: 'Invalid auth token' }), { status: 401 });
        }

        // Check caller profile for role and business_id
        const { data: callerProfile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('role, business_id')
            .eq('user_id', callerUser.id)
            .single();

        if (profileError || !callerProfile) {
            return new Response(JSON.stringify({ error: 'Caller profile not found' }), { status: 403 });
        }

        // Enforce role permissions
        const allowedRoles = ['owner', 'ceo', 'manager'];
        if (!allowedRoles.includes(callerProfile.role)) {
            return new Response(JSON.stringify({ error: 'Unauthorized: Insufficient permissions' }), { status: 403 });
        }

        // 6. Parse & Validate Body
        const body: CreateStaffRequest = await request.json();
        const { name, email, role } = body;

        if (!name || !email || !role) {
            return new Response(JSON.stringify({ error: 'Missing name, email, or role' }), { status: 400 });
        }

        // Map role to department (lowercase)
        const validRoles = ['Restaurant', 'Bar', 'Reception', 'Housekeeping'];
        if (!validRoles.includes(role)) {
            return new Response(JSON.stringify({ error: 'Invalid role selection' }), { status: 400 });
        }
        const department = role.toLowerCase();

        // 7. Invite User via Supabase Admin
        const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
            data: { full_name: name }
        });

        if (inviteError) {
            return new Response(JSON.stringify({ error: `Invite failed: ${inviteError.message}` }), { status: 400 });
        }

        if (!inviteData.user) {
            return new Response(JSON.stringify({ error: 'Invite failed: No user returned' }), { status: 500 });
        }

        // 8. Upsert Profile
        // We use upsert in case a profile row already exists (e.g. from previous attempts or triggers)
        const { error: upsertError } = await supabaseAdmin
            .from('profiles')
            .upsert({
                user_id: inviteData.user.id,
                business_id: callerProfile.business_id, // Link to caller's business
                full_name: name,
                role: 'staff',
                department: department,
                is_active: true,
                // email: email // Uncomment if you have an email column in profiles
            });

        if (upsertError) {
            // Note: We don't delete the auth user here as they might already exist.
            // We just report the profile error.
            return new Response(JSON.stringify({ error: `Profile creation failed: ${upsertError.message}` }), { status: 500 });
        }

        // 9. Success Response
        return new Response(
            JSON.stringify({
                success: true,
                user_id: inviteData.user.id,
                email: inviteData.user.email,
                department: department,
                business_id: callerProfile.business_id,
                message: 'Invitation sent successfully'
            }),
            { status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } }
        );

    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), { status: 500 });
    }
}
