import { createClient } from "@supabase/supabase-js";
 
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
 
const BASE_URL = "/api";
 
async function request(url, options = {}) {
  // Get the current user's token and send it with every request
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
 
  const res = await fetch(BASE_URL + url, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
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
      filter: (params) => request(`/orders`),
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
 