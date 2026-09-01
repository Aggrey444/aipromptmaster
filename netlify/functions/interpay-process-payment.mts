import {
  getInterpayConfig,
  sha1,
  jsonResponse,
  errorResponse,
  parseRequest,
} from "./_shared.mts";

export default async function handler(req: Request): Promise<Response> {
  try {
    const cfg = getInterpayConfig();

    const body = await parseRequest(req);
    const {
      name,
      email,
      mobile,
      mobile_network = "MTN",
      voucher_code = "",
      amount = "1.00",
      currency = "GHS",
      order_id,
      order_desc = "AI Prompt Master - One-Time Lifetime Access Fee",
    } = body;

    if (!order_id) {
      return errorResponse(400, "order_id is required.");
    }

    if (!cfg.live) {
      return errorResponse(
        400,
        "Live Interpay credentials are not configured in Netlify env vars. Use the Instant Sandbox Demo button to test the flow."
      );
    }

    const clientTimestamp = new Date().toISOString().replace("T", " ").slice(0, 23);
    const signature = sha1(`${cfg.appId}${cfg.appKey}${clientTimestamp}${order_id}${amount}`);

    const payload = {
      app_id: cfg.appId,
      app_key: cfg.appKey,
      client_timestamp: clientTimestamp,
      name: name || "Valued Customer",
      mobile: mobile || "0241234567",
      mobile_network,
      email: email || "customer@example.com",
      FeeTypeCode: "GENERALPAYMENT",
      currency,
      amount,
      voucher_code,
      order_id,
      order_desc,
      signature,
    };

    console.log("Interpay CreateMMPayment Request Initiated:", order_id, email, amount);

    const response = await fetch(`${cfg.baseUrl}/CreateMMPayment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const rawText = await response.text();
    let data: any = {};
    try {
      data = rawText ? JSON.parse(rawText) : {};
    } catch {
      data = {};
    }

    if (data && Object.keys(data).length > 0) {
      const transRefNo = data.trans_ref_no || data.transaction_no || "";
      return jsonResponse(response.status, {
        ...data,
        trans_ref_no: transRefNo,
        is_live: true,
      });
    }

    console.warn("Interpay returned non-JSON response:", rawText.substring(0, 200));
    return errorResponse(502, "Interpay returned an unexpected response. Please try again.");
  } catch (err: any) {
    console.error("Error in process-payment:", err);
    return errorResponse(500, err.message || "Failed to initiate Interpay payment.");
  }
}