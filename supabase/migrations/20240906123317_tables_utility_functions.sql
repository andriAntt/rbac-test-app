CREATE OR REPLACE FUNCTION public.sync_auth_users_with_app_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY definer 
AS $$
DECLARE
    v_user_role TEXT;
    v_user_role_id INT;
BEGIN
    v_user_role := public.admin_get_user_claim(new.id, 'user_role');

    SELECT role_id 
    INTO v_user_role_id
    FROM public.user_role 
    WHERE role_name = COALESCE(v_user_role, 'customer');

    INSERT INTO public.app_user (id, email, role_id)
    VALUES (new.id, new.email, v_user_role_id)
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        role_id = EXCLUDED.role_id;
  RETURN new;
END;
$$;


CREATE OR REPLACE FUNCTION public.insert_new_user_info(
    p_user_id UUID,
    p_name TEXT,
    p_creator_id UUID
)
RETURNS VOID
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.app_user
    SET
        name = COALESCE(p_name, name),
        creator_id = COALESCE(p_creator_id, creator_id)
    WHERE id = p_user_id;
END; 
$$ LANGUAGE plpgsql;


-- Trigger for insert operation on auth.users
CREATE OR REPLACE TRIGGER on_auth_app_user_created
    AFTER INSERT ON auth.users
    FOR each ROW EXECUTE PROCEDURE public.sync_auth_users_with_app_user();

-- Trigger for update operation on auth.users
CREATE OR REPLACE TRIGGER on_auth_app_user_updated
    AFTER UPDATE ON auth.users
    FOR each ROW EXECUTE PROCEDURE public.sync_auth_users_with_app_user();
