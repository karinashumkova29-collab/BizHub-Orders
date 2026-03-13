import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Admin client (uses service role key — can do anything, bypasses RLS)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY
);

// Auth client (uses anon key — for verifying user tokens)
const supabaseAuth = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// ============ AUTH MIDDLEWARE ============
// Reads the Bearer token from the request, verifies it, and adds user to req
async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  const { data: { user }, error } = await supabaseAuth.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  req.user = user; // Now every route knows who is calling
  next();
}

app.get("/api/test", (req, res) => {
  res.json({
    hasSupabaseUrl: !!process.env.SUPABASE_URL,
    hasSupabaseKey: !!process.env.SUPABASE_KEY,
  });
});

// ============ CUSTOMERS ============
app.get("/api/customers", requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("user_id", req.user.id)  // Only return THIS user's customers
    .order("created_date", { ascending: false });
  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
});

app.get("/api/customers/:id", requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("id", req.params.id)
    .eq("user_id", req.user.id)  // Ensure user owns this record
    .single();
  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
});

app.post("/api/customers", requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from("customers")
    .insert([{ ...req.body, user_id: req.user.id }])  // Save with user_id
    .select()
    .single();
  if (error) return res.status(400).json({ message: error.message });
  res.json(data);
});

app.put("/api/customers/:id", requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from("customers")
    .update(req.body)
    .eq("id", req.params.id)
    .eq("user_id", req.user.id)  // Ensure user owns this record
    .select()
    .single();
  if (error) return res.status(400).json({ message: error.message });
  res.json(data);
});

app.delete("/api/customers/:id", requireAuth, async (req, res) => {
  const { error } = await supabase
    .from("customers")
    .delete()
    .eq("id", req.params.id)
    .eq("user_id", req.user.id);  // Ensure user owns this record
  if (error) return res.status(400).json({ message: error.message });
  res.json({ success: true });
});

// ============ ORDERS ============
app.get("/api/orders", requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", req.user.id)  // Only return THIS user's orders
    .order("created_date", { ascending: false });
  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
});

app.get("/api/orders/:id", requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", req.params.id)
    .eq("user_id", req.user.id)
    .single();
  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
});

app.post("/api/orders", requireAuth, async (req, res) => {
  const body = { ...req.body, user_id: req.user.id };  // Save with user_id
  if (body.due_date === "" || body.due_date === undefined) {
    body.due_date = null;
  }
  const { data, error } = await supabase
    .from("orders")
    .insert([body])
    .select()
    .single();
  if (error) {
    console.error("Supabase error:", error);
    return res.status(400).json({ message: error.message });
  }
  res.json(data);
});

app.put("/api/orders/:id", requireAuth, async (req, res) => {
  const body = { ...req.body };
  if (body.due_date === "" || body.due_date === undefined) {
    body.due_date = null;
  }
  const { data, error } = await supabase
    .from("orders")
    .update(body)
    .eq("id", req.params.id)
    .eq("user_id", req.user.id)
    .select()
    .single();
  if (error) return res.status(400).json({ message: error.message });
  res.json(data);
});

app.delete("/api/orders/:id", requireAuth, async (req, res) => {
  const { error } = await supabase
    .from("orders")
    .delete()
    .eq("id", req.params.id)
    .eq("user_id", req.user.id);
  if (error) return res.status(400).json({ message: error.message });
  res.json({ success: true });
});

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
}

export default app;