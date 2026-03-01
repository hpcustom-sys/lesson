import { put, list } from "@vercel/blob";

const BLOB_NAME = "schedule_2026_0323.json";

export async function GET(request) {
  try {
    // Blob一覧からschedule.jsonを探す
    const { blobs } = await list({ prefix: BLOB_NAME });
    if (blobs.length === 0) {
      return Response.json({ success: true, data: null });
    }
    // 最新のBlobを取得
    const res = await fetch(blobs[0].url);
    const data = await res.json();
    return Response.json({ success: true, data });
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
    // JSONをBlobとして保存（同名で上書き）
    await put(BLOB_NAME, JSON.stringify(body), {
      contentType: "application/json",
      access: "public",
      addRandomSuffix: false,
    });
    return Response.json({ success: true });
  } catch (error) {
    console.error("POST /api/schedule error:", error);
    return Response.json(
      { success: false, error: "Failed to save data" },
      { status: 500 }
    );
  }
}
