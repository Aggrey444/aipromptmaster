import crypto from "crypto";

export interface LambdaEvent {
  httpMethod?: string;
  body?: string | null;
  headers?: Record<string, string | undefined>;
  queryStringParameters?: Record<string, string | undefined> | null;
  rawUrl?: string;
  path?: string;
}

export interface NetlifyResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

function isLiveInterpayConfigured(): boolean {
  return Boolean(
    process.env.INTERPAY_APP_ID &&
      process.env.INTERPAY_APP_KEY &&
      process.env.INTERPAY_APP_ID !== "DENNEL_INTERPAY_APP_ID"
  );
}

export function getInterpayConfig() {
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

export function jsonResponse(statusCode: number, payload: unknown): NetlifyResponse {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(payload),
  };
}

export function errorResponse(statusCode: number, message: string): NetlifyResponse {
  return jsonResponse(statusCode, {
    status_code: 0,
    status_message: message,
    error: message,
  });
}

// Parse an incoming lambda body into an object. Supports JSON and urlencoded/form-data.
export function parseBody(event: LambdaEvent): Record<string, any> {
  if (!event.body) return {};
  const contentType = (event.headers?.["content-type"] || "").toLowerCase();
  try {
    if (contentType.includes("application/json")) {
      return typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    }
    if (contentType.includes("application/x-www-form-urlencoded")) {
      const params = new URLSearchParams(event.body);
      const obj: Record<string, any> = {};
      params.forEach((value, key) => {
        obj[key] = value;
      });
      return obj;
    }
    // Try JSON as fallback
    return JSON.parse(event.body);
  } catch {
    return {};
  }
}