import { NextResponse } from "next/server";

export async function GET() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN || "";

  return NextResponse.json({
    tokenLength: token.length,
    first20: token.substring(0, 20),
    last20: token.substring(token.length - 20),
  });
}