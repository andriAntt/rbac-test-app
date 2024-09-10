import { createClient } from "@/utils/supabase/server";
import { NextResponse, type NextRequest } from "next/server";
import { apiErrorHandler } from "@/lib/utils";
import { ApiError, ErrorType, ErrorStatus } from '@/lib/exceptions';

export const dynamic = 'force-dynamic';

export const GET = apiErrorHandler(async (req: NextRequest, { params }: { params: { id: string } }) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('app_user')
    .select('*')
    .eq('id', params.id)
    .maybeSingle();

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