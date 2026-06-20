import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(
      process.cwd(),
      "public",
      "latest-gospel.json"
    );

    const fileContent = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(fileContent);

    return NextResponse.json({
      success: true,
      date: data.date,
      englishImage: data.english,
      tamilImage: data.tamil,
      geminiConfigured: !!process.env.GEMINI_API_KEY,
      instagramConfigured: !!process.env.INSTAGRAM_ACCESS_TOKEN,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}