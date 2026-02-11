const BASE_URL = "http://localhost:5000/api";

async function request(url, options = {}) {
  const res = await fetch(BASE_URL + url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "API Error");
  }

  return res.json();
}

export const api = {
  entities: {
    Customer: {
      list: () => request("/customers"),
      get: (id) => request(`/customers/${id}`),
      create: (data) =>
        request("/customers", {
          method: "POST",
          body: JSON.stringify(data),
        }),
      update: (id, data) =>
        request(`/customers/${id}`, {
          method: "PUT",
          body: JSON.stringify(data),
        }),
      delete: (id) =>
        request(`/customers/${id}`, {
          method: "DELETE",
        }),
    },
    Order: {
  list: (sortBy, limit) => request(`/orders`),
  get: (id) => request(`/orders/${id}`),
  filter: (params) => request(`/orders`), // simplified
  create: (data) =>
    request("/orders", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    request(`/orders/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    request(`/orders/${id}`, {
      method: "DELETE",
    }),
},
  },
};


