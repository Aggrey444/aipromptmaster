import crypto from "crypto";

export interface InterpayConfig {
  appId: string;
  appKey: string;
  live: boolean;
  baseUrl: string;
}

function isLiveInterpayConfigured(): boolean {
  return Boolean(
    process.env.INTERPAY_APP_ID &&
      process.env.INTERPAY_APP_KEY &&
      process.env.INTERPAY_APP_ID !== "DENNEL_INTERPAY_APP_ID"
  );
}

export function getInterpayConfig(): InterpayConfig {
  return {
    appId: (process.env.INTERPAY_APP_ID as string) || "",
    appKey: (process.env.INTERPAY_APP_KEY as string) || "",
    live: isLiveInterpayConfigured(),
    baseUrl:
      process.env.INTERPAY_BASE_URL || "https://api.interpayafrica.com/v3/interapi.svc",
  };
}

export function sha1(value: string): string {
  return crypto.createHash("sha1").update(value, "utf8").digest("hex");
}

export function jsonResponse(status: number, payload: unknown): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export function errorResponse(status: number, message: string): Response {
  return jsonResponse(status, {
    status_code: 0,
    status_message: message,
    error: message,
  });
}

// Parse a web Request body into an object. Supports JSON and urlencoded/form-data.
export async function parseRequest(req: Request): Promise<Record<string, any>> {
  const contentType = req.headers.get("content-type") || "";
  try {
    if (contentType.includes("application/json")) {
      return await req.json();
    }
    if (
      contentType.includes("application/x-www-form-urlencoded") ||
      contentType.includes("multipart/form-data")
    ) {
      const form = await req.formData();
      const obj: Record<string, any> = {};
      form.forEach((value, key) => {
        obj[key] = String(value);
      });
      return obj;
    }
    // Try JSON as fallback
    const text = await req.text();
    return text ? JSON.parse(text) : {};
  } catch {
    return {};
  }
}