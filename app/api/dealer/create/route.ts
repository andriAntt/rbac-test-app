import { createClient } from "@/utils/supabase/server";
import { NextResponse, type NextRequest } from "next/server";
import { apiErrorHandler } from "@/lib/utils";
import { ApiError, ErrorType, ErrorStatus } from '@/lib/exceptions';
import { UserRole } from "@/lib/types/user";

export const dynamic = 'force-dynamic';

export const POST = apiErrorHandler(async (req: NextRequest) => {
  const userInput = await req.json();

  const { email, name } = userInput;

  const supabase = createClient(true);

  const { data: { user: creator } } = await supabase.auth.getUser();

  const {
    data: { user },
    error: createAuthUserError
  } = await supabase.auth.admin.createUser({ email, password: '12345', email_confirm: true });

  if (!!createAuthUserError) {
    throw new ApiError({
      type: ErrorType.API_ERROR,
      message: createAuthUserError!.message,
      status: ErrorStatus.INTERNAL_SERVER_ERROR,
    });
  }

  if (user?.id) {
    const { error: usersetClaimsError } = await supabase
      .rpc('admin_set_user_claims', {
        uid: user.id,
        claims: [
          { claim: 'user_role', value: UserRole.CUSTOMER },
        ],
      });

    if (!!usersetClaimsError) {
      throw new ApiError({
        type: ErrorType.API_ERROR,
        message: usersetClaimsError!.message,
        status: ErrorStatus.INTERNAL_SERVER_ERROR,
      });
    }

    const { error: userInitError } = await supabase
      .rpc('insert_new_user_info', {
        p_user_id: user.id,
        p_name: name,
        p_creator_id: creator?.id,
      });

    if (!!userInitError) {
      throw new ApiError({
        type: ErrorType.API_ERROR,
        message: userInitError!.message,
        status: ErrorStatus.INTERNAL_SERVER_ERROR,
      });
    }

    const { data } = await supabase
      .from('app_user')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    return NextResponse.json(
      { data },
      { status: 200 },
    );
  }

  return NextResponse.json(
    { message: 'Internal server error.' },
    { status: 500 },
  );
});
