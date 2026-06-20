import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Gemini setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

async function generateCaption() {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const prompt = `
You are a Christian Gospel content creator.

Create an Instagram caption for GospelToons.

Rules:
- Inspirational message
- Simple English
- Add Bible reflection
- Add short prayer
- 5 hashtags
- Max 60 words
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return text || "🙏 Stay blessed #GospelToons #Jesus";
  } catch (err) {
    return "🙏 Stay blessed in faith #GospelToons #Jesus";
  }
}

export async function GET() {
  try {
    // 1. Read JSON file
    const filePath = path.join(
      process.cwd(),
      "public",
      "latest-gospel.json"
    );

    const fileContent = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(fileContent);

    const englishImage = data.english;
    const tamilImage = data.tamil;

    if (!englishImage || !tamilImage) {
      throw new Error("Images missing in latest-gospel.json");
    }

    const IG_USER_ID = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
    const IG_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;

    if (!IG_USER_ID || !IG_TOKEN) {
      throw new Error("Missing Instagram credentials");
    }

    // 2. Generate AI caption
    const caption = await generateCaption();

    // 3. Create English media (carousel item)
    const engMedia = await axios.post(
      `https://graph.facebook.com/v19.0/${IG_USER_ID}/media`,
      null,
      {
        params: {
          image_url: englishImage,
          is_carousel_item: true,
          access_token: IG_TOKEN,
        },
      }
    );

    const engId = engMedia.data.id;

    // 4. Create Tamil media (carousel item)
    const tamilMedia = await axios.post(
      `https://graph.facebook.com/v19.0/${IG_USER_ID}/media`,
      null,
      {
        params: {
          image_url: tamilImage,
          is_carousel_item: true,
          access_token: IG_TOKEN,
        },
      }
    );

    const tamilId = tamilMedia.data.id;

    // 5. Create carousel container
    const carousel = await axios.post(
      `https://graph.facebook.com/v19.0/${IG_USER_ID}/media`,
      null,
      {
        params: {
          media_type: "CAROUSEL",
          children: `${engId},${tamilId}`,
          caption: caption,
          access_token: IG_TOKEN,
        },
      }
    );

    const carouselId = carousel.data.id;

    // 6. Publish post
    const publish = await axios.post(
      `https://graph.facebook.com/v19.0/${IG_USER_ID}/media_publish`,
      null,
      {
        params: {
          creation_id: carouselId,
          access_token: IG_TOKEN,
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: "Instagram post published successfully",
      carouselId,
      publishId: publish.data.id,
      caption,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error?.response?.data || error.message,
    });
  }
}