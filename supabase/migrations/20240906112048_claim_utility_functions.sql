CREATE OR REPLACE FUNCTION public.is_auth_user_admin()
RETURNS BOOLEAN
AS $$
BEGIN
    IF session_user = 'authenticator' THEN
        IF EXTRACT(EPOCH FROM NOW()) > COALESCE((current_setting('request.jwt.claims', true)::JSONB) ->> 'exp', '0')::NUMERIC THEN
            RAISE EXCEPTION '_@ NO ADMIN ACCESS, JWT EXPIRED.';
        END IF;
        
        IF current_setting('request.jwt.claims', true)::JSONB ->> 'role' = 'service_role' THEN
            RETURN true; -- Service role users have admin rights
        END IF;
        
        IF current_setting('request.jwt.claims', true)::JSONB -> 'app_metadata' ->> 'user_role' = 'admin'
            OR current_setting('request.jwt.claims', true)::JSONB -> 'app_metadata' ->> 'user_role' = 'dealer' THEN
            RETURN true; -- User has user_role set to "admin"
        ELSE
            RAISE EXCEPTION '_@ NO ADMIN ACCESS GRANTED TO AUTH';
        END IF;
    ELSE
        -- Not a user session, probably being called from a trigger or something
        RETURN true;
    END IF;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION public.is_auth_user_dealer()
RETURNS BOOLEAN
AS $$
BEGIN
    IF session_user = 'authenticator' THEN
        IF EXTRACT(EPOCH FROM NOW()) > COALESCE((current_setting('request.jwt.claims', true)::JSONB) ->> 'exp', '0')::NUMERIC THEN
            RAISE EXCEPTION '_@ NO DEALER ACCESS, JWT EXPIRED.';
        END IF;
        
        IF current_setting('request.jwt.claims', true)::JSONB ->> 'role' = 'service_role' THEN
            RETURN true; -- Service role users have admin rights
        END IF;
        
        IF current_setting('request.jwt.claims', true)::JSONB -> 'app_metadata' ->> 'user_role' = 'dealer' THEN
            RETURN true; -- User has user_role set to "dealer"
        ELSE
            RETURN false; -- User is not a dealer, fail gracefully
        END IF;
    ELSE
        -- Not a user session, probably being called from a trigger or something
        RETURN true;
    END IF;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION public.admin_set_user_claims(
    uid UUID,
    claims JSONB
) 
RETURNS JSONB
SECURITY definer
VOLATILE
AS $$
DECLARE
    v_claim_obj JSONB;
    v_claim_name TEXT;
    v_claim_value JSONB;
BEGIN
    FOR v_claim_obj IN SELECT jsonb_array_elements(claims) LOOP
        v_claim_name := v_claim_obj ->> 'claim';
        v_claim_value := v_claim_obj -> 'value';
        
        UPDATE auth.users 
        SET raw_app_meta_data = raw_app_meta_data || jsonb_build_object(v_claim_name, v_claim_value)::JSONB
        WHERE id = uid;
    END LOOP;

    RETURN jsonb_build_object(
        'success', true,
        'message', 'User claims set successfully.',
        'user', jsonb_build_object(
            'id', uid
        )
    );
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION public.admin_get_user_claim(uid UUID, claim TEXT) 
RETURNS TEXT
SECURITY DEFINER
STABLE
AS $$
DECLARE 
    v_claim JSONB;
    v_claim_text TEXT;
BEGIN
    IF NOT public.is_auth_user_admin() THEN
        RAISE EXCEPTION '_@ Accessing user claim requires admin privileges.';
    END IF;

    SELECT COALESCE(raw_app_meta_data -> claim, NULL) 
    FROM auth.users 
    INTO v_claim 
    WHERE id = uid::UUID;

    v_claim_text := REPLACE(CAST(v_claim AS TEXT), '"', '');

    RETURN v_claim_text;
END;
$$ LANGUAGE plpgsql;
