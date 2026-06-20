import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import axios from "axios";

export async function GET() {
  try {
    // 1. Read JSON
    const filePath = path.join(process.cwd(), "public", "latest-gospel.json");
    const fileContent = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(fileContent);

    const englishImage = data.english;
    const tamilImage = data.tamil;

    // 2. Instagram Config
    const IG_USER_ID = process.env.INSTAGRAM_USER_ID;
    const IG_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;

    // 3. Create caption (simple now, Gemini we will add next step)
    const caption =
      "🙏 GospelToons Daily Reflection\n\nStay blessed ✨\n\n#GospelToons #Jesus #BibleVerse #Faith";

    // 4. Step A - Create Media Container (carousel)
    const mediaResponse = await axios.post(
      `https://graph.facebook.com/v19.0/${IG_USER_ID}/media`,
      null,
      {
        params: {
          image_url: englishImage,
          caption: caption,
          access_token: IG_TOKEN,
        },
      }
    );

    const creationId = mediaResponse.data.id;

    // 5. Step B - Publish Post
    const publishResponse = await axios.post(
      `https://graph.facebook.com/v19.0/${IG_USER_ID}/media_publish`,
      null,
      {
        params: {
          creation_id: creationId,
          access_token: IG_TOKEN,
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: "Posted to Instagram",
      creationId,
      publishId: publishResponse.data.id,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.response?.data || error.message,
    });
  }
}