CREATE OR REPLACE FUNCTION public.create_user(
    p_email TEXT,
    p_password TEXT
) 
RETURNS UUID
AS $$
DECLARE
  v_user_id UUID;
  encrypted_pw TEXT;
BEGIN
  v_user_id := gen_random_uuid();
  encrypted_pw := crypt(p_password, gen_salt('bf'));
  
  INSERT INTO auth.users (
      instance_id, 
      id, 
      aud, 
      role, 
      email, 
      encrypted_password, 
      email_confirmed_at, 
      recovery_sent_at, 
      last_sign_in_at, 
      raw_app_meta_data, 
      raw_user_meta_data, 
      created_at, 
      updated_at, 
      confirmation_token, 
      email_change, 
      email_change_token_new, 
      recovery_token
  )
  VALUES (
    '00000000-0000-0000-0000-000000000000', 
    v_user_id, 
    'authenticated', 
    'authenticated', 
    p_email, 
    encrypted_pw, 
    '2024-09-06 19:41:43.585805+00', 
    '2024-09-05 13:10:03.275387+00', 
    '2024-09-05 13:10:31.458239+00', 
    '{"provider":"email","providers":["email"]}', 
    '{}', 
    '2024-09-06 19:41:43.580424+00', 
    '2024-09-06 19:41:43.585948+00', 
    '', 
    '', 
    '', 
    ''
  );
  
  INSERT INTO auth.identities (
    provider_id,
    user_id, 
    identity_data, 
    provider, 
    last_sign_in_at, 
    created_at, 
    updated_at
  )
  VALUES (
    gen_random_uuid(), 
    v_user_id, 
    format('{"sub":"%s","email":"%s"}', v_user_id::TEXT, p_email)::JSONB, 
    'email', 
    '2024-09-06 19:41:43.582456+00', 
    '2024-09-06 19:41:43.582497+00', 
    '2024-09-06 19:41:43.582497+00'
  );

  RETURN v_user_id;
END;
$$ LANGUAGE plpgsql;


DO $$
DECLARE
    v_user_id UUID;
    v_customer_user_id UUID;
    v_dealer_user_id UUID;
BEGIN
    v_user_id := public.create_user('admin@test.com', '12345');
    PERFORM public.admin_set_user_claims(v_user_id, '[{"claim": "user_role", "value": "admin"}]');
    PERFORM public.insert_new_user_info(v_user_id, 'Owner', v_user_id);
END $$;