import { createClient } from "@/utils/supabase/server";
import { NextResponse, type NextRequest } from "next/server";
import { apiErrorHandler } from "@/lib/utils";
import { ApiError, ErrorType, ErrorStatus } from '@/lib/exceptions';

export const dynamic = 'force-dynamic';

export const PATCH = apiErrorHandler(async (req: NextRequest, { params }: { params: { id: string } }) => {
  const userInput = await req.json();

  const { email, name } = userInput;

  const supabase = createClient(true);

  const { data, error } = await supabase
    .from('app_user')
    .update({ name })
    .eq('id', params.id);

  if (!!error) {
    throw new ApiError({
      type: ErrorType.API_ERROR,
      message: error!.message,
      status: ErrorStatus.INTERNAL_SERVER_ERROR,
    });
  }

  if (email) {
    const { error } = await supabase.auth.admin.updateUserById(params.id, { email });

    if (!!error) {
      throw new ApiError({
        type: ErrorType.API_ERROR,
        message: error!.message,
        status: ErrorStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  return NextResponse.json(
    { message: "Update success" },
    { status: 200 },
  );
});
