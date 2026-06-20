import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  try {
    const token = process.env.INSTAGRAM_ACCESS_TOKEN!;

    const response = await axios.get(
      "https://graph.facebook.com/v23.0/debug_token",
      {
        params: {
          input_token: token,
          access_token: token,
        },
      }
    );

    return NextResponse.json({
      success: true,
      data: response.data,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error?.response?.data || error.message,
    });
  }
}