import { jsonResponse } from "./_shared";

export default async function handler() {
  return jsonResponse(200, { status: "ok", app: "AI Prompt Master Framework" });
}