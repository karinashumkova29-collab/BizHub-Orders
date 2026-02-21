import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Supabase - reads from environment variables (works on both Vercel and localhost with .env)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Test endpoint to check environment variables
app.get("/api/test", (req, res) => {
  res.json({
    hasSupabaseUrl: !!process.env.SUPABASE_URL,
    hasSupabaseKey: !!process.env.SUPABASE_KEY,
    supabaseUrlLength: process.env.SUPABASE_URL?.length || 0,
    supabaseKeyLength: process.env.SUPABASE_KEY?.length || 0,
  });
});

// ============ CUSTOMERS ============
app.get("/api/customers", async (req, res) => {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .order("created_date", { ascending: false });
  
  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
});

app.get("/api/customers/:id", async (req, res) => {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("id", req.params.id)
    .single();
  
  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
});

app.post("/api/customers", async (req, res) => {
  const { data, error } = await supabase
    .from("customers")
    .insert([req.body])
    .select()
    .single();
  
  if (error) return res.status(400).json({ message: error.message });
  res.json(data);
});

app.put("/api/customers/:id", async (req, res) => {
  const { data, error } = await supabase
    .from("customers")
    .update(req.body)
    .eq("id", req.params.id)
    .select()
    .single();
  
  if (error) return res.status(400).json({ message: error.message });
  res.json(data);
});

app.delete("/api/customers/:id", async (req, res) => {
  const { error } = await supabase
    .from("customers")
    .delete()
    .eq("id", req.params.id);
  
  if (error) return res.status(400).json({ message: error.message });
  res.json({ success: true });
});

// ============ ORDERS ============
app.get("/api/orders", async (req, res) => {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_date", { ascending: false });
  
  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
});

app.get("/api/orders/:id", async (req, res) => {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", req.params.id)
    .single();
  
  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
});

app.post("/api/orders", async (req, res) => {
  const { data, error } = await supabase
    .from("orders")
    .insert([req.body])
    .select()
    .single();
  
  if (error) return res.status(400).json({ message: error.message });
  res.json(data);
});

app.put("/api/orders/:id", async (req, res) => {
  const { data, error } = await supabase
    .from("orders")
    .update(req.body)
    .eq("id", req.params.id)
    .select()
    .single();
  
  if (error) return res.status(400).json({ message: error.message });
  res.json(data);
});

app.delete("/api/orders/:id", async (req, res) => {
  const { error } = await supabase
    .from("orders")
    .delete()
    .eq("id", req.params.id);
  
  if (error) return res.status(400).json({ message: error.message });
  res.json({ success: true });
});

// For local development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
}

// Export for Vercel serverless
export default app;
