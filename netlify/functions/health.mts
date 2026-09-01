import { jsonResponse } from "./_shared.mts";

export default async function handler(): Promise<Response> {
  return jsonResponse(200, { status: "ok", app: "AI Prompt Master Framework" });
}