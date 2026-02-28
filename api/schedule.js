import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();
const REDIS_KEY = "schedule_2026_0323";

export async function GET(request) {
  try {
    const data = await redis.get(REDIS_KEY);
    return Response.json({
      success: true,
      data: data || null
    });
  } catch (error) {
    console.error("GET /api/schedule error:", error);
    return Response.json(
      { success: false, error: "Failed to load data" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body || !body.ng) {
      return Response.json(
        { success: false, error: "Invalid data format" },
        { status: 400 }
      );
    }
    await redis.set(REDIS_KEY, body);
    return Response.json({ success: true });
  } catch (error) {
    console.error("POST /api/schedule error:", error);
    return Response.json(
      { success: false, error: "Failed to save data" },
      { status: 500 }
    );
  }
}
