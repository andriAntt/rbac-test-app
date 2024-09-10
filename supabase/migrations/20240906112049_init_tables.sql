-- Create a user_role table
CREATE TABLE public.user_role (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(255) NOT NULL
);

ALTER TABLE public.user_role ENABLE ROW LEVEL SECURITY;

-- Allows admins to do all operations
CREATE POLICY admin_all_operations ON public.user_role
FOR ALL
TO authenticated
USING (public.is_auth_user_admin());

-- Any user can SELECT any data
CREATE POLICY user_select ON public.user_role
FOR SELECT
TO authenticated
USING (true);

-- Allow service_role to do all operations
CREATE POLICY service_role_all_operations ON public.user_role
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Fill the user_role table
INSERT INTO public.user_role (role_id, role_name) VALUES
    (1, 'admin'),
    (2, 'dealer'),
    (3, 'customer');

-- Create an app_user table
CREATE TABLE public.app_user (
    id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,                        
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255),
    role_id INT NOT NULL REFERENCES public.user_role(role_id),
    creator_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.app_user ENABLE ROW LEVEL SECURITY;

-- Allow service_tole to do all operations
CREATE POLICY service_role_all_operations ON public.app_user
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);


CREATE POLICY admin_full_access
    ON public.app_user
    FOR ALL
    USING (current_setting('request.jwt.claims', true)::JSONB -> 'app_metadata' ->> 'user_role' = 'admin')
    WITH CHECK (current_setting('request.jwt.claims', true)::JSONB -> 'app_metadata' ->> 'user_role' = 'admin');

CREATE POLICY dealer_insert
    ON public.app_user
    FOR INSERT
    WITH CHECK (
        current_setting('request.jwt.claims', true)::JSONB -> 'app_metadata' ->> 'user_role' = 'dealer'
        AND role_id = 3
    );

CREATE POLICY dealer_select_own_users
    ON public.app_user
    FOR SELECT
    USING (
        (current_setting('request.jwt.claims', true)::JSONB -> 'app_metadata' ->> 'user_role' = 'dealer')
        AND (creator_id = (current_setting('request.jwt.claims', true)::JSONB ->> 'sub')::UUID)
    );

CREATE POLICY dealer_delete_own_users
    ON public.app_user
    FOR DELETE
    USING (
        (current_setting('request.jwt.claims', true)::JSONB -> 'app_metadata' ->> 'user_role' = 'dealer')
        AND (creator_id = (current_setting('request.jwt.claims', true)::JSONB ->> 'sub')::UUID)
    );

CREATE POLICY dealer_update_own_users
    ON public.app_user
    FOR UPDATE
    USING (
        (current_setting('request.jwt.claims', true)::JSONB -> 'app_metadata' ->> 'user_role' = 'dealer')
        AND (creator_id = (current_setting('request.jwt.claims', true)::JSONB ->> 'sub')::UUID)
    );

CREATE POLICY customer_select_own_users
    ON public.app_user
    FOR SELECT
    USING (
        (current_setting('request.jwt.claims', true)::JSONB -> 'app_metadata' ->> 'user_role' = 'customer')
        AND (auth.uid() = id)
    );
