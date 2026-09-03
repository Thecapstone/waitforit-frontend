import {
  AuthUser,
  AnalyticsEvent,
  AnalyticsSummary,
  EmailDeliveryLog,
  EmailTemplateConfig,
  WaitlistApiResponse,
  WaitlistSubmission,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

async function apiRequest<T>(
  path: string,
  options: { method?: HttpMethod; body?: unknown; headers?: HeadersInit } = {},
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method || 'GET',
    credentials: 'include',
    headers: {
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
    body: options.body
      ? options.body instanceof FormData
        ? options.body
        : JSON.stringify(options.body)
      : undefined,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || data.detail || 'Request failed.');
  }

  return data as T;
}

function normalizeSubscriber(subscriber: any): WaitlistSubmission {
  return {
    ...subscriber,
    status: subscriber.status || 'new',
    welcome_email_sent: Boolean(
      subscriber.welcome_email_sent ||
        subscriber.status === 'contacted' ||
        subscriber.status === 'converted',
    ),
    welcome_email_sent_at: subscriber.welcome_email_sent_at || subscriber.created_at,
  };
}

function normalizeEmailLog(log: any): EmailDeliveryLog {
  return {
    id: log.id,
    subscriber_id: log.subscriber?.id || log.subscriber_id || '',
    recipient_email: log.recipient_email,
    recipient_name: log.subscriber?.name || log.recipient_name || log.recipient_email,
    subject: log.subject,
    body_rendered: log.body || log.body_rendered || '',
    status: log.status,
    sent_at: log.created_at || log.sent_at,
    trigger_source: log.trigger_source || 'auto_pipeline',
  };
}

function normalizeTemplate(template: any): EmailTemplateConfig {
  return {
    subject: template.subject,
    bodyTemplate: template.body || template.bodyTemplate || '',
    senderName: template.senderName || 'The WaitForIt Team',
    senderEmail: template.senderEmail || 'welcome@waitforit.dev',
  };
}

function normalizeAnalytics(payload: any): {
  summary: AnalyticsSummary;
  events: AnalyticsEvent[];
} {
  const summary = payload.summary || {};
  const totalSignups = summary.total_signups ?? summary.total_subscribers ?? 0;
  const developers = summary.developers ?? 0;
  const totalVisitors = summary.total_visitors ?? Math.max(totalSignups, 1);
  const recentEvents = payload.recent_events || payload.events || [];

  return {
    summary: {
      total_visitors: totalVisitors,
      total_signups: totalSignups,
      conversion_rate: summary.conversion_rate ?? 0,
      developer_ratio: totalSignups > 0 ? Math.round((developers / totalSignups) * 100) : 0,
      emails_sent: summary.emails_sent ?? summary.email_logs ?? 0,
      email_open_rate: summary.email_open_rate ?? 0,
      top_role: summary.top_role || payload.subscribers_by_role?.[0]?.role || 'Unknown',
      cta_clicks: summary.cta_clicks ?? 0,
      role_breakdown: Object.fromEntries(
        (payload.subscribers_by_role || []).map((item: any) => [item.role || 'Unknown', item.count]),
      ),
      daily_metrics: summary.daily_metrics || [],
    },
    events: recentEvents.map((event: any) => ({
      id: event.id,
      event_name: event.event_name || event.event || 'page_view',
      page: event.page || event.metadata?.page || 'unknown',
      timestamp: event.timestamp || event.created_at,
      metadata: event.metadata || {},
    })),
  };
}

export async function joinWaitlist(payload: {
  name: string;
  email: string;
  is_developer: boolean;
  role: string;
  source: string;
}): Promise<WaitlistApiResponse> {
  const data = await apiRequest<any>('/api/v1/waitlist', {
    method: 'POST',
    body: payload,
  });

  return {
    success: true,
    message: data.message || "You're on the list! Welcome to WaitForIt.",
    data: data.data ? normalizeSubscriber(data.data) : undefined,
  };
}

export async function trackAnalyticsEvent(
  eventName: AnalyticsEvent['event_name'],
  page: string,
  metadata?: Record<string, unknown>,
) {
  return apiRequest('/api/v1/analytics/event', {
    method: 'POST',
    body: {
      event: eventName,
      visitor_id: window.localStorage.getItem('wfi_visitor_id') || '',
      metadata: { page, ...metadata },
    },
  });
}

export async function fetchDashboardData() {
  const [subscribers, emailLogs, template, analytics] = await Promise.all([
    apiRequest<any>('/api/v1/waitlist'),
    apiRequest<any>('/api/v1/email-pipeline/logs'),
    apiRequest<any>('/api/v1/email-template'),
    apiRequest<any>('/api/v1/analytics'),
  ]);

  return {
    subscribers: (subscribers.data || subscribers.subscribers || []).map(normalizeSubscriber),
    emailLogs: (emailLogs.data || emailLogs.logs || []).map(normalizeEmailLog),
    emailTemplate: normalizeTemplate(template.data || template.template || {}),
    ...normalizeAnalytics(analytics),
  };
}

export async function updateWaitlistSubscriber(id: string, body: Partial<WaitlistSubmission>) {
  return apiRequest(`/api/v1/waitlist/${id}`, {
    method: 'PUT',
    body,
  });
}

export async function deleteWaitlistSubscriber(id: string) {
  return apiRequest(`/api/v1/waitlist/${id}`, {
    method: 'DELETE',
  });
}

export async function resendWelcomeEmail(subscriberId: string) {
  return apiRequest<any>('/api/v1/email-pipeline/send', {
    method: 'POST',
    body: { subscriber_id: subscriberId },
  });
}

export async function updateEmailTemplate(template: Partial<EmailTemplateConfig>) {
  return apiRequest('/api/v1/email-template', {
    method: 'PUT',
    body: {
      subject: template.subject,
      body: template.bodyTemplate,
    },
  });
}

export async function exportWaitlistCsv() {
  const response = await fetch(`${API_BASE_URL}/api/v1/waitlist/export`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Unable to export waitlist.');
  }

  return response.blob();
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const data = await apiRequest<{ user: AuthUser }>('/api/auth/me/');
    return data.user;
  } catch {
    return null;
  }
}

export async function loginUser(payload: { email: string; password: string }) {
  const data = await apiRequest<{ user: AuthUser }>('/api/auth/login/', {
    method: 'POST',
    body: payload,
  });
  return data.user;
}

export async function registerUser(payload: { email: string; password: string }) {
  return apiRequest<{ message: string }>('/api/auth/register/', {
    method: 'POST',
    body: payload,
  });
}

export async function logoutUser() {
  return apiRequest('/api/auth/logout/', {
    method: 'GET',
  });
}

export async function requestPasswordReset(email: string) {
  return apiRequest<{ message: string }>('/api/auth/forgot-password/', {
    method: 'POST',
    body: { email },
  });
}

export async function approveTerminalLogin(userCode: string) {
  return apiRequest<{ message: string }>('/api/auth/terminal/approve/', {
    method: 'POST',
    body: { user_code: userCode },
  });
}
