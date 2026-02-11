import express from "express";
import cors from "cors";
import { v4 as uuid } from "uuid";

const app = express();
app.use(cors());
app.use(express.json());

let customers = [];
let orders = []; // ADD THIS

// ============ CUSTOMERS ============
// GET all - sorted by newest first
app.get("/api/customers", (req, res) => {
  const sortedCustomers = [...customers].sort((a, b) => 
    new Date(b.created_date) - new Date(a.created_date)
  );
  res.json(sortedCustomers);
});

app.get("/api/customers/:id", (req, res) => {
  const customer = customers.find(c => c.id === req.params.id);
  res.json(customer);
});

app.post("/api/customers", (req, res) => {
  const newCustomer = { id: uuid(), created_date: new Date().toISOString(), ...req.body };
  customers.push(newCustomer);
  res.json(newCustomer);
});

app.put("/api/customers/:id", (req, res) => {
  customers = customers.map(c =>
    c.id === req.params.id ? { ...c, ...req.body } : c
  );
  res.json({ success: true });
});

app.delete("/api/customers/:id", (req, res) => {
  customers = customers.filter(c => c.id !== req.params.id);
  res.json({ success: true });
});

// ============ ORDERS ============
// GET all orders
app.get("/api/orders", (req, res) => {
  const sortedOrders = [...orders].sort((a, b) => 
    new Date(b.created_date) - new Date(a.created_date)
  );
  res.json(sortedOrders);
});

app.get("/api/orders/:id", (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  res.json(order);
});

app.post("/api/orders", (req, res) => {
  const newOrder = { 
    id: uuid(), 
    created_date: new Date().toISOString(),
    ...req.body 
  };
  orders.push(newOrder);
  res.json(newOrder);
});

app.put("/api/orders/:id", (req, res) => {
  orders = orders.map(o =>
    o.id === req.params.id ? { ...o, ...req.body } : o
  );
  res.json({ success: true });
});

app.delete("/api/orders/:id", (req, res) => {
  orders = orders.filter(o => o.id !== req.params.id);
  res.json({ success: true });
});

app.listen(5000, () => console.log("✅ Server running on port 5000"));