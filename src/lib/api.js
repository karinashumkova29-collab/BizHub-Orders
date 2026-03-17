import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export const api = {
  entities: {
    Customer: {
      list: async () => {
        const { data, error } = await supabase.from("customers").select("*").order("created_date", { ascending: false });
        if (error) throw new Error(error.message);
        return data;
      },
      get: async (id) => {
        const { data, error } = await supabase.from("customers").select("*").eq("id", id).single();
        if (error) throw new Error(error.message);
        return data;
      },
      create: async (body) => {
        const { data, error } = await supabase.from("customers").insert([body]).select().single();
        if (error) throw new Error(error.message);
        return data;
      },
      update: async (id, body) => {
        const { data, error } = await supabase.from("customers").update(body).eq("id", id).select().single();
        if (error) throw new Error(error.message);
        return data;
      },
      delete: async (id) => {
        const { error } = await supabase.from("customers").delete().eq("id", id);
        if (error) throw new Error(error.message);
      },
    },
    Order: {
      list: async () => {
        const { data, error } = await supabase.from("orders").select("*").order("created_date", { ascending: false });
        if (error) throw new Error(error.message);
        return data;
      },
      get: async (id) => {
        const { data, error } = await supabase.from("orders").select("*").eq("id", id).single();
        if (error) throw new Error(error.message);
        return data;
      },
      filter: async () => {
        const { data, error } = await supabase.from("orders").select("*").order("created_date", { ascending: false });
        if (error) throw new Error(error.message);
        return data;
      },
      create: async (body) => {
        const { data, error } = await supabase.from("orders").insert([body]).select().single();
        if (error) throw new Error(error.message);
        return data;
      },
      update: async (id, body) => {
        const { data, error } = await supabase.from("orders").update(body).eq("id", id).select().single();
        if (error) throw new Error(error.message);
        return data;
      },
      delete: async (id) => {
        const { error } = await supabase.from("orders").delete().eq("id", id);
        if (error) throw new Error(error.message);
      },
    },
  },
};