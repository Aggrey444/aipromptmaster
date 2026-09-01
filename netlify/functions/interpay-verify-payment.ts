import {
  getInterpayConfig,
  jsonResponse,
  errorResponse,
  parseBody,
  LambdaEvent,
} from "./_shared";

export default async function handler(event: LambdaEvent) {
  try {
    const { order_id, trans_ref_no } = parseBody(event);

    if (!order_id) {
      return errorResponse(400, "order_id is required.");
    }

    const cfg = getInterpayConfig();
    if (!cfg.live) {
      return errorResponse(
        400,
        "Live Interpay credentials are not configured in Netlify env vars."
      );
    }

    const body = JSON.stringify({ app_id: cfg.appId, app_key: cfg.appKey, order_id });

    let data: any = null;
    for (const fn of ["GetInvoiceStatusV4", "GetInvoiceStatus"]) {
      try {
        const response = await fetch(`${cfg.baseUrl}/${fn}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
        });
        const contentType = response.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          data = await response.json();
          break;
        }
      } catch (err) {
        console.warn(`Interpay ${fn} failed:`, err);
      }
    }

    if (!data) {
      return errorResponse(502, "Interpay status check failed.");
    }

    const transStatus = String(data.trans_status || data.status_desc || data.status_message || "");
    const ref = data.trans_ref_no || transferKey(data) || "";
    const isPaid =
      transStatus.toUpperCase() === "PAID BY CLIENT" ||
      (data.status_code === 1 && transStatus.toUpperCase().includes("PAID"));

    return jsonResponse(200, {
      ...data,
      order_id,
      trans_ref_no: ref,
      trans_status: transStatus,
      is_paid: isPaid,
      is_live: true,
    });
  } catch (err: any) {
    console.error("Error in verify-payment:", err);
    return errorResponse(500, err.message || "Failed to verify transaction status.");
  }
}

// Normalize the various reference-key spellings Interpay may return.
function transferKey(data: any): string {
  const v = data.TRANS_REF_NO || data.Trans_Ref || data.transaction_no;
  if (v) return String(v);
  if (data.SYSTEM_TRANS_ID != null) return String(data.SYSTEM_TRANS_ID);
  return "";
}