export interface Context {
  session_id: string // Primary key
  repository_id: string // UUID references repositories(id)
  commit_sha: string
  parent_commit_sha: string | null
  author_email: string
  total_messages: number
  session_count: number
  new_messages_since_parent: number | null
  new_session: boolean // true if this starts a new Claude session, false if continuing previous
  jsonl_data: string // JSONL conversation data
  created_by: string // UUID references users(id)
  created_at: string
  updated_at: string
}

// Sample JSONL conversation for initial setup (Commit 1 - Session 1 start)
const setupConversation = `{"type":"user","content":"I need help setting up a new Node.js project with TypeScript and Express.","timestamp":"2025-01-08T09:15:00Z"}
{"type":"assistant","content":"I'll help you set up a TypeScript Express project. Let's start with the basic structure.","timestamp":"2025-01-08T09:15:20Z"}
{"type":"user","content":"Should I use a specific tsconfig.json configuration?","timestamp":"2025-01-08T09:16:00Z"}
{"type":"assistant","content":"Yes, for Express projects I recommend strict mode with ES modules. Here's a good base config.","timestamp":"2025-01-08T09:16:30Z"}
{"type":"user","content":"What about folder structure?","timestamp":"2025-01-08T09:17:00Z"}
{"type":"assistant","content":"I suggest: src/ for source code, dist/ for compiled output, and separate folders for routes, controllers, and services.","timestamp":"2025-01-08T09:17:30Z"}
{"type":"user","content":"Perfect! Can you help me set up the basic Express server?","timestamp":"2025-01-08T09:18:00Z"}
{"type":"assistant","content":"Sure! Here's a basic setup with TypeScript types and middleware.","timestamp":"2025-01-08T09:18:45Z"}
{"type":"user","content":"Thanks, this looks great!","timestamp":"2025-01-08T09:19:30Z"}
{"type":"assistant","content":"You're welcome! Your project structure is now ready for development.","timestamp":"2025-01-08T09:20:00Z"}`

// Sample JSONL conversation for authentication (Commit 2 - Session 1 continues)
const authConversation = `{"type":"user","content":"Now I need to add JWT authentication to the API.","timestamp":"2025-01-10T14:30:00Z"}
{"type":"assistant","content":"Great! Let's implement JWT authentication using jsonwebtoken. What authentication flow do you want?","timestamp":"2025-01-10T14:30:15Z"}
{"type":"user","content":"Standard login/register with token-based auth.","timestamp":"2025-01-10T14:31:00Z"}
{"type":"assistant","content":"Perfect. We'll need: 1) User model, 2) Auth routes, 3) JWT middleware. Let's start with the User model.","timestamp":"2025-01-10T14:31:20Z"}
{"type":"user","content":"Should I hash passwords with bcrypt?","timestamp":"2025-01-10T14:32:00Z"}
{"type":"assistant","content":"Absolutely! Use bcrypt with a salt rounds of 10-12 for security.","timestamp":"2025-01-10T14:32:10Z"}
{"type":"user","content":"How do I verify the JWT on protected routes?","timestamp":"2025-01-10T14:33:00Z"}
{"type":"assistant","content":"Create middleware that extracts the token from the Authorization header and verifies it. I'll show you the implementation.","timestamp":"2025-01-10T14:33:30Z"}`

// Sample JSONL conversation for bug fix (Commit 3 - Session 1 continues)
const bugfixConversation = `{"type":"user","content":"I'm getting a 'jwt malformed' error when testing the auth endpoints.","timestamp":"2025-01-12T11:00:00Z"}
{"type":"assistant","content":"That error usually means the token format is incorrect. Are you stripping the 'Bearer ' prefix?","timestamp":"2025-01-12T11:00:20Z"}
{"type":"user","content":"Oh! I forgot to parse the Authorization header properly.","timestamp":"2025-01-12T11:01:00Z"}
{"type":"assistant","content":"Exactly. Use: const token = authHeader.split(' ')[1] to extract just the token.","timestamp":"2025-01-12T11:01:20Z"}
{"type":"user","content":"Fixed! The authentication is working now.","timestamp":"2025-01-12T11:02:00Z"}`

// Sample JSONL conversation for payment feature
const paymentConversation = `{"type":"user","content":"I need to implement a payment processing endpoint using Stripe. What's the best approach?","timestamp":"2025-01-15T10:00:00Z"}
{"type":"assistant","content":"For Stripe integration, I recommend: 1) Use Stripe Checkout for PCI compliance, 2) Store customer IDs in your database, 3) Use webhooks for payment confirmation. Would you like me to help with the implementation?","timestamp":"2025-01-15T10:00:30Z"}
{"type":"user","content":"Yes, let's start with the checkout session creation endpoint.","timestamp":"2025-01-15T10:01:00Z"}
{"type":"assistant","content":"Here's a basic implementation:\\n\\nconst stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);\\n\\napp.post('/create-checkout-session', async (req, res) => {\\n  const session = await stripe.checkout.sessions.create({\\n    payment_method_types: ['card'],\\n    line_items: [{\\n      price_data: {\\n        currency: 'usd',\\n        product_data: { name: 'Your Product' },\\n        unit_amount: 2000,\\n      },\\n      quantity: 1,\\n    }],\\n    mode: 'payment',\\n    success_url: 'https://yoursite.com/success',\\n    cancel_url: 'https://yoursite.com/cancel',\\n  });\\n  res.json({ id: session.id });\\n});","timestamp":"2025-01-15T10:01:45Z"}
{"type":"user","content":"Perfect! Now how do I handle the webhook for payment confirmation?","timestamp":"2025-01-15T10:03:00Z"}
{"type":"assistant","content":"You'll need to set up a webhook endpoint that listens for Stripe events. Here's the structure:\\n\\napp.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {\\n  const sig = req.headers['stripe-signature'];\\n  let event;\\n  \\n  try {\\n    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);\\n  } catch (err) {\\n    return res.status(400).send('Webhook Error');\\n  }\\n  \\n  if (event.type === 'checkout.session.completed') {\\n    const session = event.data.object;\\n    // Fulfill the order here\\n  }\\n  \\n  res.json({received: true});\\n});","timestamp":"2025-01-15T10:03:40Z"}`

// Sample JSONL conversation for refactoring (Commit 5 - Session 2 continues)
const refactorConversation = `{"type":"user","content":"The payment code is getting messy. Should I refactor it into a service class?","timestamp":"2025-01-17T14:30:00Z"}
{"type":"assistant","content":"Yes! Creating a PaymentService will make the code more maintainable and testable.","timestamp":"2025-01-17T14:30:30Z"}
{"type":"user","content":"What methods should the service have?","timestamp":"2025-01-17T14:31:00Z"}
{"type":"assistant","content":"I'd suggest: createCheckoutSession(), handleWebhook(), getPaymentStatus(), and refundPayment().","timestamp":"2025-01-17T14:31:30Z"}`

// Sample JSONL conversation for testing (Commit 6 - Session 3 start)
const testingConversation = `{"type":"user","content":"What's the best way to test payment integration without charging real cards?","timestamp":"2025-01-18T16:00:00Z"}
{"type":"assistant","content":"Stripe provides test mode with test card numbers. Use these test cards:\\n- Success: 4242 4242 4242 4242\\n- Decline: 4000 0000 0000 0002\\n- 3D Secure: 4000 0027 6000 3184\\n\\nMake sure you're using your test API keys (they start with 'sk_test_').","timestamp":"2025-01-18T16:00:20Z"}
{"type":"user","content":"Should I write integration tests for the Stripe webhooks?","timestamp":"2025-01-18T16:01:00Z"}
{"type":"assistant","content":"Yes! You can use Stripe's official library to mock webhook events in your tests. Here's an example:\\n\\nconst event = stripe.webhooks.constructEvent(\\n  JSON.stringify(mockPayload),\\n  generateTestSignature(),\\n  webhookSecret\\n);\\n\\nThis lets you test your webhook handler without relying on Stripe's servers.","timestamp":"2025-01-18T16:01:30Z"}`

export const mockContexts: Context[] = [
  // 1. Initial setup (WITH Claude context - SESSION 1 START)
  {
    session_id: "ctx-setup-001",
    repository_id: "880fb700-h59e-74g7-d049-779988773001",
    commit_sha: "abc123def456789012345678901234567890ab01",
    parent_commit_sha: null,
    author_email: "you@example.com",
    total_messages: 10,
    session_count: 1,
    new_messages_since_parent: 10,
    new_session: true,
    jsonl_data: setupConversation,
    created_by: "550e8400-e29b-41d4-a716-446655440001",
    created_at: "2025-01-08T09:20:00Z",
    updated_at: "2025-01-08T09:20:00Z",
  },

  // 2. Add authentication (WITH Claude context - SESSION 1 CONTINUES)
  {
    session_id: "ctx-auth-002",
    repository_id: "880fb700-h59e-74g7-d049-779988773001",
    commit_sha: "def456abc789012345678901234567890ab012cd",
    parent_commit_sha: "abc123def456789012345678901234567890ab01",
    author_email: "you@example.com",
    total_messages: 8,
    session_count: 1,
    new_messages_since_parent: 8,
    new_session: false,
    jsonl_data: authConversation,
    created_by: "550e8400-e29b-41d4-a716-446655440001",
    created_at: "2025-01-10T14:35:00Z",
    updated_at: "2025-01-10T14:35:00Z",
  },

  // 3. Fix bug (WITH Claude context - SESSION 1 CONTINUES)
  {
    session_id: "ctx-bugfix-003",
    repository_id: "880fb700-h59e-74g7-d049-779988773001",
    commit_sha: "789012def456abc123456789012345678ab0123e",
    parent_commit_sha: "def456abc789012345678901234567890ab012cd",
    author_email: "you@example.com",
    total_messages: 5,
    session_count: 1,
    new_messages_since_parent: 5,
    new_session: false,
    jsonl_data: bugfixConversation,
    created_by: "550e8400-e29b-41d4-a716-446655440001",
    created_at: "2025-01-12T11:20:00Z",
    updated_at: "2025-01-12T11:20:00Z",
  },

  // 4. Add payment feature (WITH Claude context - SESSION 2 START)
  {
    session_id: "ctx-payment-004",
    repository_id: "880fb700-h59e-74g7-d049-779988773001",
    commit_sha: "012345abc789def456789012345678ab012345fg",
    parent_commit_sha: "789012def456abc123456789012345678ab0123e",
    author_email: "you@example.com",
    total_messages: 6,
    session_count: 1,
    new_messages_since_parent: 6,
    new_session: true,
    jsonl_data: paymentConversation,
    created_by: "550e8400-e29b-41d4-a716-446655440001",
    created_at: "2025-01-15T10:15:00Z",
    updated_at: "2025-01-15T10:15:00Z",
  },

  // 5. Refactor code (WITH Claude context - SESSION 2 CONTINUES)
  {
    session_id: "ctx-refactor-005",
    repository_id: "880fb700-h59e-74g7-d049-779988773001",
    commit_sha: "345678def789abc012345678901234ab0123456h",
    parent_commit_sha: "012345abc789def456789012345678ab012345fg",
    author_email: "you@example.com",
    total_messages: 4,
    session_count: 1,
    new_messages_since_parent: 4,
    new_session: false,
    jsonl_data: refactorConversation,
    created_by: "550e8400-e29b-41d4-a716-446655440001",
    created_at: "2025-01-17T14:45:00Z",
    updated_at: "2025-01-17T14:45:00Z",
  },

  // 6. Add tests (WITH Claude context - SESSION 3 START)
  {
    session_id: "ctx-tests-006",
    repository_id: "880fb700-h59e-74g7-d049-779988773001",
    commit_sha: "678901abc012def345678901234ab01234567i8j",
    parent_commit_sha: "345678def789abc012345678901234ab0123456h",
    author_email: "you@example.com",
    total_messages: 4,
    session_count: 1,
    new_messages_since_parent: 4,
    new_session: true,
    jsonl_data: testingConversation,
    created_by: "550e8400-e29b-41d4-a716-446655440001",
    created_at: "2025-01-18T16:10:00Z",
    updated_at: "2025-01-18T16:10:00Z",
  },

  // 7. Update docs (no Claude context)
  {
    session_id: "ctx-docs-007",
    repository_id: "880fb700-h59e-74g7-d049-779988773001",
    commit_sha: "901234def345abc678901234ab012345678901jk",
    parent_commit_sha: "678901abc012def345678901234ab01234567i8j",
    author_email: "teammate1@example.com",
    total_messages: 0,
    session_count: 0,
    new_messages_since_parent: null,
    new_session: false,
    jsonl_data: "",
    created_by: "550e8400-e29b-41d4-a716-446655440002",
    created_at: "2025-01-20T10:00:00Z",
    updated_at: "2025-01-20T10:00:00Z",
  },
]
