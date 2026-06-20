import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  try {
    const IG_USER_ID =
      process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;

    const IG_TOKEN =
      process.env.INSTAGRAM_ACCESS_TOKEN;

    if (!IG_USER_ID || !IG_TOKEN) {
      return NextResponse.json({
        success: false,
        error: "Missing environment variables",
      });
    }

    // Test token against Meta Graph API
    const meResponse = await axios.get(
      "https://graph.facebook.com/v23.0/me",
      {
        params: {
          access_token: IG_TOKEN,
        },
      }
    );

    return NextResponse.json({
      success: true,
      instagramBusinessAccountId: IG_USER_ID,
      tokenValid: true,
      me: meResponse.data,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      tokenValid: false,
      error:
        error?.response?.data ||
        error?.message ||
        "Unknown error",
    });
  }
}