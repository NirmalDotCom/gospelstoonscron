import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    // Optional: Protect the endpoint so only Vercel Cron can call it.
    // Set CRON_SECRET in your Vercel Environment Variables.
    if (process.env.CRON_SECRET) {
      const auth = request.headers.get("authorization");

      if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json(
          {
            success: false,
            message: "Unauthorized",
          },
          { status: 401 }
        );
      }
    }

    const IG_USER_ID = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
    const IG_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;

    if (!IG_USER_ID || !IG_TOKEN) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing environment variables",
        },
        { status: 500 }
      );
    }

    console.log("Cron started:", new Date().toISOString());

    const response = await axios.get(
      `https://graph.facebook.com/v23.0/${IG_USER_ID}`,
      {
        params: {
          fields: "id,username",
          access_token: IG_TOKEN,
        },
      }
    );

    console.log("Cron completed successfully");

    return NextResponse.json({
      success: true,
      instagram: response.data,
      executedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: error?.response?.data || error.message,
      },
      { status: 500 }
    );
  }
}
