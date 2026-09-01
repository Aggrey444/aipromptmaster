import {
  getInterpayConfig,
  sha1,
  jsonResponse,
  parseRequest,
} from "./_shared.mts";

export default async function handler(req: Request): Promise<Response> {
  try {
    const body = await parseRequest(req);
    console.log("Interpay Callback Received:", body);

    const { status_code, signature, order_id, trans_ref_no } = body;

    const cfg = getInterpayConfig();
    if (cfg.live && signature && order_id && trans_ref_no) {
      // sha1 checksum of app_id + app_key + status_code + order_id + trans_ref_no
      const expectedSignature = sha1(
        `${cfg.appId}${cfg.appKey}${status_code}${order_id}${trans_ref_no}`
      );
      if (String(signature).toLowerCase() !== expectedSignature.toLowerCase()) {
        console.warn("Interpay callback signature mismatch (rejected):", {
          order_id,
          trans_ref_no,
        });
        return jsonResponse(400, { status: "error", message: "Invalid signature" });
      }
      console.log("Interpay callback signature verified for order:", order_id);
    }

    return jsonResponse(200, {
      status: "success",
      message: "Callback received",
      order_id,
      trans_ref_no,
    });
  } catch (err: any) {
    console.error("Error in Interpay callback:", err);
    return jsonResponse(500, { status: "error", message: err.message });
  }
}