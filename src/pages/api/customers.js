let customers = [];

export default function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json(customers);
  }

  if (req.method === "POST") {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const newCustomer = {
      id: Date.now().toString(),
      name,
      email,
      createdAt: new Date().toISOString(),
    };

    customers.push(newCustomer);

    return res.status(200).json(newCustomer);
  }

  res.status(405).json({ message: "Method not allowed" });
}