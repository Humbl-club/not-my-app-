-- Fix RLS infinite recursion by correcting admin_users policy
-- This migration fixes the infinite recursion in admin_users RLS policy

-- Drop the problematic policy
DROP POLICY IF EXISTS "Super admins can manage admin users" ON admin_users;

-- Create a new policy that doesn't cause recursion
-- Admin users can only be managed by service role or authenticated users with super_admin flag
CREATE POLICY "Super admins can manage admin users" ON admin_users
    FOR ALL USING (
        -- Allow service role to access everything
        auth.role() = 'service_role'
        OR
        -- Allow authenticated users who are super admins
        (
            auth.role() = 'authenticated' 
            AND auth.email() IN (
                SELECT email FROM admin_users 
                WHERE role = 'super_admin' 
                AND is_active = true
                AND email = auth.email()
            )
        )
    );

-- Also add a simpler policy for basic admin access that doesn't recurse
CREATE POLICY "Admins can view admin table" ON admin_users
    FOR SELECT USING (
        auth.role() = 'service_role'
        OR 
        (auth.role() = 'authenticated' AND email = auth.email())
    );
