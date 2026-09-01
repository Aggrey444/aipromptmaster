import express from "express";
import path from "path";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  // Parses URL-encoded / form-data bodies used by Interpay IPN callbacks
  app.use(express.urlencoded({ extended: true }));

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "AI Prompt Master Framework" });
  });

  // Optional AI Prompt Enhancement route using Gemini SDK
  app.post("/api/ai-enhance", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({
          error: "GEMINI_API_KEY is not configured on the server. You can still manually edit and build prompts!",
        });
      }

      const { prompt, framework } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt text is required." });
      }

      // Lazy import GoogleGenAI to prevent crash if unneeded
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey });

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          `You are an expert AI Prompt Engineer specializing in the ${framework || "CLEAR/SAEALD/SCENE"} framework. 
Enhance and refine the following user-generated prompt to make it even clearer, more precise, and highly effective for AI models, while strictly preserving all facts, requirements, negative constraints, and core intent.
Output ONLY the enhanced prompt text directly without conversational filler.

User Prompt:
${prompt}`,
        ],
      });

      const enhancedText = response.text?.trim() || prompt;
      res.json({ enhancedPrompt: enhancedText });
    } catch (err: any) {
      console.error("Error in /api/ai-enhance:", err);
      res.status(500).json({ error: err.message || "Failed to enhance prompt with AI." });
    }
  });

  // Optional AI Template Generation route
  app.post("/api/ai-template", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({
          error: "GEMINI_API_KEY is not configured. Built-in standard templates remain fully accessible!",
        });
      }

      const { contentType, topic } = req.body;
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey });

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          `Generate a clean structural template outline for a "${contentType}" on the topic "${topic || "General"}".
Return valid JSON array of objects with the structure:
[
  { "id": "sec-1", "title": "Section Title", "placeholder": "Placeholder or instruction text for this section" },
  ...
]
Provide 5 to 8 logically structured sections. Return ONLY valid JSON with no markdown backticks.`,
        ],
      });

      let rawText = response.text?.trim() || "[]";
      if (rawText.startsWith("```json")) {
        rawText = rawText.replace(/^```json/, "").replace(/```$/, "").trim();
      } else if (rawText.startsWith("```")) {
        rawText = rawText.replace(/^```/, "").replace(/```$/, "").trim();
      }

      const sections = JSON.parse(rawText);
      res.json({ sections });
    } catch (err: any) {
      console.error("Error in /api/ai-template:", err);
      res.status(500).json({ error: err.message || "Failed to generate AI template." });
    }
  });

  // ------------------------------------------------------------------
  // Interpay API Integration (per official Interpay Africa spec)
  // Docs: CreateInvoice / CreateMMPayment / GetInvoiceStatus /
  //       GetInvoiceStatusV4 / ReverseInvoicePayment / Callback (IPN)
  // ------------------------------------------------------------------

  function isLiveInterpayConfigured(): boolean {
    return Boolean(
      process.env.INTERPAY_APP_ID &&
        process.env.INTERPAY_APP_KEY &&
        process.env.INTERPAY_APP_ID !== "DENNEL_INTERPAY_APP_ID"
    );
  }

  function sha1(value: string): string {
    return crypto.createHash("sha1").update(value, "utf8").digest("hex");
  }

  // 1.2 CreateMMPayment - initiates Mobile Money USSD prompt
  app.post("/api/interpay/process-payment", async (req, res) => {
    try {
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
      } = req.body;

      if (!order_id) {
        return res
          .status(400)
          .json({ status_code: 0, status_message: "order_id is required." });
      }

      if (!isLiveInterpayConfigured()) {
        console.warn("Interpay live credentials missing; refusing process-payment.");
        return res.status(400).json({
          status_code: 0,
          status_message:
            "Live Interpay credentials are not configured in .env. Use the Instant Sandbox Demo button to test the flow.",
          sandbox_only: true,
        });
      }

      const appId = process.env.INTERPAY_APP_ID as string;
      const appKey = process.env.INTERPAY_APP_KEY as string;
      const clientTimestamp = new Date()
        .toISOString()
        .replace("T", " ")
        .slice(0, 23);
      // sinature: sha1 checksum of app_id + app_key + Client_timestamp + order_id + Amount (optional)
      const signature = sha1(`${appId}${appKey}${clientTimestamp}${order_id}${amount}`);

      const payload = {
        app_id: appId,
        app_key: appKey,
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

      const liveBaseUrl =
        process.env.INTERPAY_BASE_URL || "https://api.interpayafrica.com/v3/interapi.svc";
      const response = await fetch(`${liveBaseUrl}/CreateMMPayment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get("content-type") || "";
      const rawText = await response.text();
      let data: any = {};
      if (rawText) {
        try {
          data = JSON.parse(rawText);
        } catch {
          data = {};
        }
      }

      if (contentType.includes("application/json") && data && Object.keys(data).length > 0) {
        // Interpay returns the reference as trans_ref_no or transaction_no
        const transRefNo = data.trans_ref_no || data.transaction_no || "";
        return res.json({
          ...data,
          trans_ref_no: transRefNo,
          is_live: true,
        });
      }

      console.warn("Interpay upstream returned non-JSON response:", rawText.substring(0, 200));
      return res.status(502).json({
        status_code: 0,
        status_message: "Interpay returned an unexpected response. Please try again.",
      });
    } catch (err: any) {
      console.error("Error in /api/interpay/process-payment:", err);
      res.status(500).json({
        status_code: 0,
        status_message: err.message || "Failed to initiate Interpay payment.",
      });
    }
  });

  // 1.4/1.5 GetInvoiceStatus (+ GetInvoiceStatusV4 fallback) - verify by order_id
  app.post("/api/interpay/verify-payment", async (req, res) => {
    try {
      const { order_id } = req.body;
      if (!order_id) {
        return res
          .status(400)
          .json({ status_code: 0, status_message: "order_id is required." });
      }

      if (!isLiveInterpayConfigured()) {
        return res.status(400).json({
          status_code: 0,
          status_message: "Live Interpay credentials are not configured in .env.",
          sandbox_only: true,
        });
      }

      const appId = process.env.INTERPAY_APP_ID as string;
      const appKey = process.env.INTERPAY_APP_KEY as string;
      const liveBaseUrl =
        process.env.INTERPAY_BASE_URL || "https://api.interpayafrica.com/v3/interapi.svc";

      const body = JSON.stringify({ app_id: appId, app_key: appKey, order_id });

      // Prefer GetInvoiceStatusV4 (richer response incl. trans_ref_no), fallback to GetInvoiceStatus
      let data: any = null;
      for (const fn of ["GetInvoiceStatusV4", "GetInvoiceStatus"]) {
        try {
          const response = await fetch(`${liveBaseUrl}/${fn}`, {
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
        return res
          .status(502)
          .json({ status_code: 0, status_message: "Interpay status check failed." });
      }

      const transStatus = String(
        data.trans_status || data.status_desc || data.status_message || ""
      );
      const transRefNo = data.trans_ref_no || data.TRANS_REF_NO || "";
      // PAID BY CLIENT (1) => paid
      const isPaid =
        transStatus.toUpperCase() === "PAID BY CLIENT" ||
        (data.status_code === 1 && transStatus.toUpperCase().includes("PAID"));

      return res.json({
        ...data,
        trans_ref_no: transRefNo,
        trans_status: transStatus,
        is_paid: isPaid,
        is_live: true,
      });
    } catch (err: any) {
      res.status(500).json({
        status_code: 0,
        status_message: err.message || "Failed to verify transaction status.",
      });
    }
  });

  // 1.7 Callback / IPN - Interpay pushes form-data notification to this URL
  app.post("/api/interpay/callback", (req, res) => {
    try {
      console.log("Interpay Callback Received:", req.body);
      const { status_code, status_message, trans_ref_no, order_id, name, mobile, email, signature } = req.body;

      if (isLiveInterpayConfigured()) {
        const appId = process.env.INTERPAY_APP_ID as string;
        const appKey = process.env.INTERPAY_APP_KEY as string;
        // sha1 checksum of app_id + app_key + status_code + order_id + trans_ref_no
        const expectedSignature = sha1(`${appId}${appKey}${status_code}${order_id}${trans_ref_no}`);
        if (signature && String(signature).toLowerCase() !== expectedSignature.toLowerCase()) {
          console.warn("Interpay callback signature mismatch (rejected):", { order_id, trans_ref_no });
          return res.status(400).json({ status: "error", message: "Invalid signature" });
        }
        console.log("Interpay callback signature verified for order:", order_id);
      }

      res
        .status(200)
        .json({ status: "success", message: "Callback received", order_id, trans_ref_no });
    } catch (err: any) {
      console.error("Error in Interpay callback:", err);
      res.status(500).json({ status: "error", message: err.message });
    }
  });

  // Vite middleware for development or static serving for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
