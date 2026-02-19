import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(cors());
app.use(express.json());

// Hardcode the values temporarily to test
const SUPABASE_URL = "https://vrtmlljjjuzoxmwptkgp.supabase.co";
const SUPABASE_KEY = "sb_publishable_uPELC8QcOV_-4YP1qHo_Iw_ZRa8fYWn";

console.log("🔵 Initializing Supabase with:", SUPABASE_URL);

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ============ CUSTOMERS ============
app.get("/api/customers", async (req, res) => {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .order("created_date", { ascending: false });
  
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

// ============ ORDERS ============
app.get("/api/orders", async (req, res) => {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_date", { ascending: false });
  
  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
});

app.post("/api/orders", async (req, res) => {
  console.log("📦 Creating order:", req.body);
  const { data, error } = await supabase
    .from("orders")
    .insert([req.body])
    .select()
    .single();
  
  if (error) {
    console.error("❌ Order creation error:", error);
    return res.status(400).json({ message: error.message });
  }
  
  console.log("✅ Order created:", data);
  res.json(data);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

export default app;