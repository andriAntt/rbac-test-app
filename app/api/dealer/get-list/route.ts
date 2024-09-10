import { createClient } from "@/utils/supabase/server";
import { NextResponse, type NextRequest } from "next/server";
import { apiErrorHandler } from "@/lib/utils";
import { ApiError, ErrorType, ErrorStatus } from '@/lib/exceptions';
import { CUSTOMER_ROLE_ID } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export const GET = apiErrorHandler(async (req: NextRequest) => {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('app_user')
    .select('*')
    .eq('role_id', CUSTOMER_ROLE_ID)
    .eq('creator_id', user?.id)
    .order('created_at', { ascending: true });

  if (!!error) {
    throw new ApiError({
      type: ErrorType.API_ERROR,
      message: error!.message,
      status: ErrorStatus.INTERNAL_SERVER_ERROR,
    });
  }

  return NextResponse.json(
    {
      data,
    },
    { status: 200 },
  );
});