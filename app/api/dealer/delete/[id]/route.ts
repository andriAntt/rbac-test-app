import { createClient } from "@/utils/supabase/server";
import { NextResponse, type NextRequest } from "next/server";
import { apiErrorHandler } from "@/lib/utils";
import { ApiError, ErrorType, ErrorStatus } from '@/lib/exceptions';

export const dynamic = 'force-dynamic';

export const DELETE = apiErrorHandler(async (req: NextRequest, { params }: { params: { id: string } }) => {
  const supabase = createClient(true);

  const { error } = await supabase.auth.admin.deleteUser(params.id);

  if (!!error) {
    throw new ApiError({
      type: ErrorType.API_ERROR,
      message: error!.message,
      status: ErrorStatus.INTERNAL_SERVER_ERROR,
    });
  }

  return NextResponse.json(
    { message: "Delete success" },
    { status: 200 },
  );
});
