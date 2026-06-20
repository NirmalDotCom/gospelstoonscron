import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json({
      success: true,

      instagramBusinessAccountId:
        process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID || null,

      tokenExists: !!process.env.INSTAGRAM_ACCESS_TOKEN,

      tokenLength:
        process.env.INSTAGRAM_ACCESS_TOKEN?.length || 0,

      tokenPrefix:
        process.env.INSTAGRAM_ACCESS_TOKEN?.substring(0, 10) || null,

      geminiExists: !!process.env.GEMINI_API_KEY,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}