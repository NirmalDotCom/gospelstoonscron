import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  try {
    const IG_USER_ID =
      process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;

    const IG_TOKEN =
      process.env.INSTAGRAM_ACCESS_TOKEN;

    const response = await axios.get(
      `https://graph.facebook.com/v23.0/${IG_USER_ID}`,
      {
        params: {
          fields: "id,username",
          access_token: IG_TOKEN,
        },
      }
    );

    return NextResponse.json({
      success: true,
      instagram: response.data,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error:
        error?.response?.data ||
        error.message,
    });
  }
}