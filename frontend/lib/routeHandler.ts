import { NextRequest, NextResponse } from "next/server";

/**
 * Wraps a route handler for consistent error handling.
 * Returns a standard async function that Next.js App Router accepts.
 */
export function routeHandler(
  handler: (req: NextRequest, ctx?: any) => Promise<NextResponse>
): (req: NextRequest, ctx?: any) => Promise<NextResponse> {
  return async function (req: NextRequest, ctx?: any): Promise<NextResponse> {
    try {
      return await handler(req, ctx);
    } catch (error: any) {
      console.error("[Route Error]", error);
      return NextResponse.json(
        {
          message: error?.message ?? "Internal server error",
          ...(process.env.NODE_ENV !== "production" && {
            stack: error?.stack,
          }),
        },
        { status: error?.status ?? 500 }
      );
    }
  };
}