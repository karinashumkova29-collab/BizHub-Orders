import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import { Users, Plus, Search, Mail, Phone, Building2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import EmptyState from "@/components/orders/EmptyState";

export default function Customers() {
  const [search, setSearch] = useState("");

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: () => api.entities.Customer.list("-created_date"),
  });

  const filteredCustomers = customers.filter((customer) => {
    return (
      !search ||
      customer.name?.toLowerCase().includes(search.toLowerCase()) ||
      customer.email?.toLowerCase().includes(search.toLowerCase()) ||
      customer.company?.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Customers
            </h1>
            <p className="text-slate-500 mt-1">
              {customers.length} customer{customers.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Link to={createPageUrl("NewCustomer")}>
            <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-11 px-6 shadow-sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Customer
            </Button>
          </Link>
        </div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-6"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 rounded-xl border-slate-200"
            />
          </div>
        </motion.div>

        {/* Customers Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-48 bg-white rounded-2xl border border-slate-100 animate-pulse"
              />
            ))}
          </div>
        ) : filteredCustomers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCustomers.map((customer, index) => (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={createPageUrl(`CustomerDetail?id=${customer.id}`)}>
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md hover:border-slate-200 transition-all duration-200 h-full">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-lg font-semibold text-slate-600">
                          {customer.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-slate-900 truncate">
                          {customer.name}
                        </h3>
                        {customer.company && (
                          <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                            <Building2 className="w-3.5 h-3.5" />
                            {customer.company}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <p className="text-sm text-slate-600 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <span className="truncate">{customer.email}</span>
                      </p>
                      {customer.phone && (
                        <p className="text-sm text-slate-600 flex items-center gap-2">
                          <Phone className="w-4 h-4 text-slate-400" />
                          {customer.phone}
                        </p>
                      )}
                      {customer.city && (
                        <p className="text-sm text-slate-500 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          {customer.city}
                          {customer.state && `, ${customer.state}`}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
            <EmptyState
              icon={Users}
              title={search ? "No matching customers" : "No customers yet"}
              description={
                search
                  ? "Try a different search term"
                  : "Add your first customer to get started"
              }
              actionLabel={!search && "Add Customer"}
              actionUrl={!search && "NewCustomer"}
            />
          </div>
        )}
      </div>
    </div>
  );
}