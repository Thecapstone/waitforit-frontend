import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import {
  DEFAULT_EMAIL_TEMPLATE,
  INITIAL_SUBSCRIBERS,
  INITIAL_EMAIL_LOGS,
  INITIAL_ANALYTICS_EVENTS,
} from "./src/data/initialData.js";
import {
  WaitlistSubmission,
  EmailDeliveryLog,
  EmailTemplateConfig,
  AnalyticsEvent,
} from "./src/types.js";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const BACKEND_API_URL =
    process.env.BACKEND_API_URL || "http://127.0.0.1:8000";

  app.use("/api", async (req, res, next) => {
    try {
      const target = new URL(req.originalUrl, BACKEND_API_URL);
      const headers: Record<string, string> = {};

      for (const [key, value] of Object.entries(req.headers)) {
        if (
          !value ||
          ["host", "connection", "content-length"].includes(key.toLowerCase())
        ) {
          continue;
        }
        headers[key] = Array.isArray(value) ? value.join(", ") : value;
      }

      const response = await fetch(target, {
        method: req.method,
        headers,
        body: ["GET", "HEAD"].includes(req.method)
          ? undefined
          : JSON.stringify(req.body),
        redirect: "manual",
      });

      const setCookies = response.headers.getSetCookie?.() || [];
      if (setCookies.length > 0) {
        res.setHeader("set-cookie", setCookies);
      }

      response.headers.forEach((value, key) => {
        const normalizedKey = key.toLowerCase();
        if (
          ![
            "content-encoding",
            "transfer-encoding",
            "connection",
            "set-cookie",
          ].includes(normalizedKey)
        ) {
          res.setHeader(key, value);
        }
      });

      const body = Buffer.from(await response.arrayBuffer());
      res.status(response.status).send(body);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const cause =
        error instanceof Error && error.cause instanceof Error
          ? error.cause.message
          : undefined;

      console.error(`Backend proxy request failed for ${req.originalUrl}:`, {
        message,
        cause,
        backend: BACKEND_API_URL,
      });

      res.status(502).json({
        message: "The backend API is unavailable.",
        detail: cause ? `${message}: ${cause}` : message,
      });
    }
  });

  // In-memory data store with default seed
  let subscribers: WaitlistSubmission[] = [...INITIAL_SUBSCRIBERS];
  let emailLogs: EmailDeliveryLog[] = [...INITIAL_EMAIL_LOGS];
  let analyticsEvents: AnalyticsEvent[] = [...INITIAL_ANALYTICS_EVENTS];
  let emailTemplate: EmailTemplateConfig = { ...DEFAULT_EMAIL_TEMPLATE };
  let visitorCount = 142; // Seed baseline visitors

  // Helper to render email template mustache tags
  function renderTemplate(template: string, name: string): string {
    return template.replace(/\{\{\s*name\s*\}\}/g, name || "Developer");
  }

  // Helper to log analytics
  function trackEvent(
    name: AnalyticsEvent["event_name"],
    page: string = "home",
    metadata?: Record<string, any>,
  ) {
    analyticsEvents.unshift({
      id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      event_name: name,
      page,
      timestamp: new Date().toISOString(),
      metadata,
    });
  }

  // --- API ROUTES ---

  // POST /api/v1/waitlist - PRD Technical Specification Section 15
  app.post("/api/v1/waitlist", (req, res) => {
    try {
      const { name, email, is_developer, role, source } = req.body;

      if (!name || !email) {
        return res.status(400).json({
          success: false,
          message: "Full Name and Email Address are required.",
        });
      }

      const normalizedEmail = email.trim().toLowerCase();
      const existing = subscribers.find(
        (s) => s.email.toLowerCase() === normalizedEmail,
      );

      // Duplicate email check as specified in PRD Section 14
      if (existing) {
        trackEvent("waitlist_signup", "waitlist_form", {
          email: normalizedEmail,
          duplicate: true,
        });
        return res.json({
          success: true,
          duplicate: true,
          message:
            "You're already on the waitlist. We'll keep you updated as we get closer to launch.",
        });
      }

      const now = new Date().toISOString();
      const newSubscriber: WaitlistSubmission = {
        id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        name: name.trim(),
        email: normalizedEmail,
        is_developer: Boolean(is_developer),
        role: role ? String(role) : "Backend Engineer",
        created_at: now,
        status: "welcomed",
        welcome_email_sent: true,
        welcome_email_sent_at: now,
        source: source || "waitlist_form",
      };

      subscribers.unshift(newSubscriber);

      // Email Pipeline Trigger (PRD Section 17)
      const renderedBody = renderTemplate(
        emailTemplate.bodyTemplate,
        newSubscriber.name,
      );
      const emailLog: EmailDeliveryLog = {
        id: `log_${Date.now()}`,
        subscriber_id: newSubscriber.id,
        recipient_email: newSubscriber.email,
        recipient_name: newSubscriber.name,
        subject: emailTemplate.subject,
        body_rendered: renderedBody,
        status: "sent",
        sent_at: now,
        trigger_source: "auto_pipeline",
      };
      emailLogs.unshift(emailLog);

      // Track analytics
      trackEvent("waitlist_signup", source || "waitlist_form", {
        email: newSubscriber.email,
        role: newSubscriber.role,
      });

      return res.status(201).json({
        success: true,
        message: "You're on the list! Welcome to WaitForIt.",
        data: newSubscriber,
      });
    } catch (err: any) {
      console.error("Waitlist endpoint error:", err);
      res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  });

  // GET /api/v1/waitlist - Admin & Subscriber fetch
  app.get("/api/v1/waitlist", (req, res) => {
    const { search, role, status } = req.query;
    let filtered = [...subscribers];

    if (search) {
      const q = String(search).toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q),
      );
    }
    if (role && role !== "all") {
      filtered = filtered.filter((s) => s.role === role);
    }
    if (status && status !== "all") {
      filtered = filtered.filter((s) => s.status === status);
    }

    res.json({
      success: true,
      total: subscribers.length,
      count: filtered.length,
      subscribers: filtered,
    });
  });

  // PUT /api/v1/waitlist/:id - Update subscriber
  app.put("/api/v1/waitlist/:id", (req, res) => {
    const { id } = req.params;
    const { status, role, is_developer, name, email } = req.body;
    const sub = subscribers.find((s) => s.id === id);

    if (!sub) {
      return res
        .status(404)
        .json({ success: false, message: "Subscriber not found" });
    }

    if (status) sub.status = status;
    if (role) sub.role = role;
    if (is_developer !== undefined) sub.is_developer = is_developer;
    if (name) sub.name = name;
    if (email) sub.email = email;

    res.json({ success: true, subscriber: sub });
  });

  // DELETE /api/v1/waitlist/:id - Delete subscriber
  app.delete("/api/v1/waitlist/:id", (req, res) => {
    const { id } = req.params;
    subscribers = subscribers.filter((s) => s.id !== id);
    res.json({ success: true, message: "Subscriber removed" });
  });

  // POST /api/v1/waitlist/export - CSV Export
  app.post("/api/v1/waitlist/export", (req, res) => {
    const headers = [
      "ID",
      "Full Name",
      "Email Address",
      "Is Developer",
      "Role",
      "Created At",
      "Status",
      "Welcome Email Sent",
    ];
    const rows = subscribers.map((s) => [
      s.id,
      `"${s.name.replace(/"/g, '""')}"`,
      `"${s.email.replace(/"/g, '""')}"`,
      s.is_developer ? "Yes" : "No",
      `"${(s.role || "").replace(/"/g, '""')}"`,
      s.created_at,
      s.status,
      s.welcome_email_sent ? "Yes" : "No",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n");
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=waitforit_waitlist.csv",
    );
    res.send(csvContent);
  });

  // GET /api/v1/email-pipeline/logs - Fetch email pipeline delivery logs
  app.get("/api/v1/email-pipeline/logs", (req, res) => {
    res.json({ success: true, logs: emailLogs });
  });

  // POST /api/v1/email-pipeline/send - Re-send / Trigger Welcome Email manually
  app.post("/api/v1/email-pipeline/send", (req, res) => {
    const { subscriber_id } = req.body;
    const sub = subscribers.find((s) => s.id === subscriber_id);

    if (!sub) {
      return res
        .status(404)
        .json({ success: false, message: "Subscriber not found" });
    }

    const now = new Date().toISOString();
    const renderedBody = renderTemplate(emailTemplate.bodyTemplate, sub.name);
    const newLog: EmailDeliveryLog = {
      id: `log_manual_${Date.now()}`,
      subscriber_id: sub.id,
      recipient_email: sub.email,
      recipient_name: sub.name,
      subject: emailTemplate.subject,
      body_rendered: renderedBody,
      status: "sent",
      sent_at: now,
      trigger_source: "manual_resend",
    };

    sub.welcome_email_sent = true;
    sub.welcome_email_sent_at = now;
    emailLogs.unshift(newLog);

    res.json({
      success: true,
      message: `Welcome email sent successfully to ${sub.email}`,
      log: newLog,
    });
  });

  // GET & PUT /api/v1/email-template - Manage welcome email template
  app.get("/api/v1/email-template", (req, res) => {
    res.json({ success: true, template: emailTemplate });
  });

  app.put("/api/v1/email-template", (req, res) => {
    const { subject, bodyTemplate, senderName, senderEmail } = req.body;
    if (subject) emailTemplate.subject = subject;
    if (bodyTemplate) emailTemplate.bodyTemplate = bodyTemplate;
    if (senderName) emailTemplate.senderName = senderName;
    if (senderEmail) emailTemplate.senderEmail = senderEmail;

    res.json({
      success: true,
      message: "Email template updated",
      template: emailTemplate,
    });
  });

  // GET /api/v1/analytics - Conversion Funnel & Analytics Metrics
  app.get("/api/v1/analytics", (req, res) => {
    const total_signups = subscribers.length;
    const total_visitors = Math.max(visitorCount, total_signups + 85);
    const conversion_rate = parseFloat(
      ((total_signups / total_visitors) * 100).toFixed(1),
    );

    const devsCount = subscribers.filter((s) => s.is_developer).length;
    const developer_ratio =
      total_signups > 0
        ? parseFloat(((devsCount / total_signups) * 100).toFixed(1))
        : 100;

    const roleCounts: Record<string, number> = {};
    subscribers.forEach((s) => {
      const r = s.role || "Backend Engineer";
      roleCounts[r] = (roleCounts[r] || 0) + 1;
    });

    let top_role = "Backend Engineer";
    let maxRoleCount = 0;
    Object.entries(roleCounts).forEach(([role, count]) => {
      if (count > maxRoleCount) {
        maxRoleCount = count;
        top_role = role;
      }
    });

    const ctaClicks =
      analyticsEvents.filter((e) => e.event_name === "cta_click").length + 38;

    // Daily breakdown for visual metric charts
    const daily_metrics = [
      { date: "Aug 1", visitors: 24, signups: 1, cta_clicks: 8 },
      { date: "Aug 2", visitors: 35, signups: 1, cta_clicks: 12 },
      { date: "Aug 3", visitors: 48, signups: 2, cta_clicks: 19 },
      {
        date: "Aug 4",
        visitors: Math.max(35, total_visitors - 107),
        signups: total_signups - 4,
        cta_clicks: Math.max(15, ctaClicks - 39),
      },
    ];

    res.json({
      success: true,
      summary: {
        total_visitors,
        total_signups,
        conversion_rate,
        developer_ratio,
        emails_sent: emailLogs.length,
        email_open_rate: 68.4, // Estimated open rate metric
        top_role,
        cta_clicks: ctaClicks,
        role_breakdown: roleCounts,
        daily_metrics,
      },
      events: analyticsEvents.slice(0, 50),
    });
  });

  // POST /api/v1/analytics/event - Track client events
  app.post("/api/v1/analytics/event", (req, res) => {
    const { event_name, page, metadata } = req.body;
    if (event_name === "page_view") {
      visitorCount++;
    }
    trackEvent(event_name || "page_view", page || "home", metadata);
    res.json({ success: true });
  });

  // --- VITE / STATIC FILE SERVING ---
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

  app.listen(PORT, "127.0.0.1", () => {
    console.log(
      `WaitForIt Full-Stack Server listening on http://127.0.0.1:${PORT}`,
    );
  });
}

startServer();
