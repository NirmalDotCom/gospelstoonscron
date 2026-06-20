
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      "http://localhost:3000/latest-gospel.json",
      {
        cache: "no-store",
      }
    );

    const data = await response.json();

    const englishImage = data.english;
    const tamilImage = data.tamil;
    const date = data.date;

    return NextResponse.json({
      success: true,
      date,
      englishImage,
      tamilImage,
      geminiConfigured: !!process.env.GEMINI_API_KEY,
      instagramConfigured: !!process.env.INSTAGRAM_ACCESS_TOKEN,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: String(error),
      },
      { status: 500 }
    );
  }
}
