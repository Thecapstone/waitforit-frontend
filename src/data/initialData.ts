import {
  WaitlistSubmission,
  EmailTemplateConfig,
  BlogPost,
  EmailDeliveryLog,
  AnalyticsEvent,
} from "../types";

export const DEFAULT_EMAIL_TEMPLATE: EmailTemplateConfig = {
  subject: "Welcome to WaitForIt 🚀",
  senderName: "The WaitForIt Team",
  senderEmail: "welcome@waitforit.dev",
  bodyTemplate: `Hi {{name}},

Thank you for joining the WaitForIt waitlist.

You're now among the first developers who'll get access to a new way of documenting engineering decisions, debugging sessions, architectural trade-offs, and technical breakthroughs—all without disrupting your existing workflow.

As we prepare for launch, we'll occasionally share updates on the product, behind-the-scenes progress, and opportunities to join the private beta.

In the meantime, follow our journey as we build WaitForIt in public.

We're excited to have you with us.

— The WaitForIt Team`,
};

export const INITIAL_SUBSCRIBERS: WaitlistSubmission[] = [
  {
    id: "sub_1",
    name: "Mogbolu Thecapstone",
    email: "m.cap@waitforit.io",
    is_developer: true,
    role: "Backend Engineer",
    created_at: "2026-08-01T14:22:10.000Z",
    status: "welcomed",
    welcome_email_sent: true,
    welcome_email_sent_at: "2026-08-01T14:22:12.000Z",
    source: "home_hero",
  },
  {
    id: "sub_2",
    name: "Oluwafemi Akinyemi",
    email: "oa@wfi.dev",
    is_developer: true,
    role: "DevOps",
    created_at: "2026-08-02T09:15:45.000Z",
    status: "beta_invited",
    welcome_email_sent: true,
    welcome_email_sent_at: "2026-08-02T09:15:47.000Z",
    source: "developers_page",
  },
  {
    id: "sub_3",
    name: "Mobolaji Olawole",
    email: "m.wole@wait.forit",
    is_developer: true,
    role: "Platform",
    created_at: "2026-08-03T11:40:00.000Z",
    status: "welcomed",
    welcome_email_sent: true,
    welcome_email_sent_at: "2026-08-03T11:40:02.000Z",
    source: "home_footer",
  },
  {
    id: "sub_4",
    name: "Ayogu Chioma",
    email: "chioms@thedevvis.software",
    is_developer: true,
    role: "Full Stack",
    created_at: "2026-08-03T16:05:22.000Z",
    status: "welcomed",
    welcome_email_sent: true,
    welcome_email_sent_at: "2026-08-03T16:05:25.000Z",
    source: "integration_guide",
  },
  {
    id: "sub_5",
    name: "Gideon Terhemba",
    email: "gterhemba@waitfor.it",
    is_developer: true,
    role: "Student",
    created_at: "2026-08-04T08:12:30.000Z",
    status: "pending",
    welcome_email_sent: true,
    welcome_email_sent_at: "2026-08-04T08:12:32.000Z",
    source: "why_page",
  },
];

export const INITIAL_EMAIL_LOGS: EmailDeliveryLog[] = INITIAL_SUBSCRIBERS.map(
  (sub) => ({
    id: `log_${sub.id}`,
    subscriber_id: sub.id,
    recipient_email: sub.email,
    recipient_name: sub.name,
    subject: DEFAULT_EMAIL_TEMPLATE.subject,
    body_rendered: DEFAULT_EMAIL_TEMPLATE.bodyTemplate.replace(
      "{{name}}",
      sub.name,
    ),
    status: "sent",
    sent_at: sub.welcome_email_sent_at || sub.created_at,
    trigger_source: "auto_pipeline",
  }),
);

export const INITIAL_ANALYTICS_EVENTS: AnalyticsEvent[] = [
  {
    id: "evt_1",
    event_name: "page_view",
    page: "home",
    timestamp: "2026-08-04T09:00:00.000Z",
  },
  {
    id: "evt_2",
    event_name: "cta_click",
    page: "home",
    timestamp: "2026-08-04T09:02:15.000Z",
    metadata: { cta: "Join the Waitlist" },
  },
  {
    id: "evt_3",
    event_name: "demo_play",
    page: "home",
    timestamp: "2026-08-04T09:03:00.000Z",
  },
  {
    id: "evt_4",
    event_name: "waitlist_signup",
    page: "home",
    timestamp: "2026-08-04T09:05:10.000Z",
    metadata: { email: "david.kim@example.com" },
  },
  {
    id: "evt_5",
    event_name: "guide_visit",
    page: "integration-guide",
    timestamp: "2026-08-04T09:10:00.000Z",
  },
];

export const FEATURED_ARTICLES: BlogPost[] = [
  {
    id: "art_1",
    slug: "inventory-sync-redis-streams",
    title: "Building Reliable Inventory Synchronization with Redis Streams",
    subtitle: "Synchronization with Redis Streams",
    excerpt:
      "Today started with a frustrating discovery. Under concurrent inventory updates, optimistic locking proved insufficient for real-time race prevention. Here is how we redesigned our stream consumer pipeline.",
    author: "WaitForIt Demo Capsule",
    date: "Aug 2026",
    readTime: "4 min read",
    tags: ["Redis", "Architecture", "Concurrency", "Backend"],
    content: `## The Problem
Today started with a frustrating discovery. Under concurrent inventory updates, our standard optimistic locking strategy proved insufficient when burst writes hit the checkout service.

When 50+ workers simultaneously tried to decremented stock counts for high-demand items, dirty reads led to over-allocations and cascade rollbacks.

## Initial Experimentation
We first attempted distributed locks with Redlock. While theoretically safe, key expiration TTLs under high network latency introduced unnecessary failure modes and blocked quick database retries.

\`\`\`bash
$ wfi log
Today's progress:
Implemented Redis Streams to eliminate race conditions in the inventory service.
After profiling, optimistic locking proved insufficient under concurrent writes.
Switched to Streams for guaranteed ordering.
\`\`\`

## The Redis Streams Refactor
Instead of locking rows, we inverted the flow: write incoming inventory delta events into a single Redis Stream per product SKU. A lightweight background worker process processes the stream sequentially, applying deterministic increments to PostgreSQL in batches.

### Architectural Trade-offs
1. **Latency:** End-to-end sync delay increased by ~4ms.
2. **Consistency:** Achieved strict serializability per SKU.
3. **Throughput:** Handled 12,000 req/sec without deadlocks.

## Lessons Learned
Never use distributed locks when an event stream can transform concurrent updates into sequential operations.`,
  },
  {
    id: "art_2",
    slug: "why-backend-developers-need-better-portfolios",
    title: "Why Backend Developers Need Better Portfolios",
    subtitle: "Beyond GitHub repositories and API specs",
    excerpt:
      "Explore why engineering thinking is often overlooked—and why that needs to change for senior backend engineers.",
    author: "WaitForIt Founder",
    date: "Jul 2026",
    readTime: "5 min read",
    tags: ["Career", "Backend", "Portfolio"],
    content: `Frontend developers have live interactive websites. UI/UX designers have Figma portfolios. 

What do backend engineers have? A collection of GitHub repositories filled with schema migrations, Dockerfiles, and complex system design logic that recruiters never actually clone or execute.

Git stores code. Swagger documents endpoints. Landing pages showcase products. None of them explain the technical decisions that shaped the software.`,
  },
  {
    id: "art_3",
    slug: "git-commits-arent-documentation",
    title: "Git Commits Aren't Documentation",
    subtitle: "Git records changes. It rarely records reasoning.",
    excerpt:
      "Commit messages like 'fix bug in queue worker' hide months of architectural trade-offs. Here is why reasoning must live alongside code.",
    author: "Engineering Team",
    date: "Jul 2026",
    readTime: "3 min read",
    tags: ["Git", "Workflow", "DevOps"],
    content: `When you open a codebase after six months, git log tells you *what* line changed and *when*. It won't tell you *why* Redis Streams was picked over RabbitMQ, or why optimistic locking failed under high concurrency.

WaitForIt bridges the gap by building an engineering timeline directly from your terminal while you work.`,
  },
];

export const FAQ_ITEMS = [
  {
    q: "What is WaitForIt?",
    a: "WaitForIt is a developer visibility platform that captures engineering decisions directly from your terminal workflow and transforms them into searchable technical articles and a living engineering journal.",
  },
  {
    q: "Does WaitForIt replace Git?",
    a: "No. Git tracks source code. WaitForIt documents engineering reasoning. They complement one another seamlessly.",
  },
  {
    q: "Will this interrupt my workflow?",
    a: "No. Logging happens directly from your terminal (`$ wfi log`) and is designed to feel as natural as writing a Git commit. No IDE switching or manual wiki editing required.",
  },
  {
    q: "Why not just use Markdown?",
    a: "Markdown requires you to remember to write documentation after the work is done. WaitForIt captures engineering context while you're actively solving problems, then automatically groups related logs into full technical articles.",
  },
  {
    q: "How does AI fit in?",
    a: "AI is used after enough engineering context has been collected. Rather than writing one article for every log, WaitForIt intelligently groups related entries into one complete engineering story using your personal voice.",
  },
  {
    q: "Can teams use WaitForIt?",
    a: "Team Capsules and collaborative engineering journals are planned as part of Phase 4 on our public roadmap.",
  },
];
