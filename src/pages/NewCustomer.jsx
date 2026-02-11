import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { ArrowLeft, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

export default function NewCustomer() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    notes: "",
  });

  const createMutation = useMutation({
    mutationFn: (data) => api.entities.Customer.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      navigate(createPageUrl("Customers"));
    },
  });

 const handleSubmit = async (e) => {
  e.preventDefault();
  
  console.log('=== CUSTOMER CREATION DEBUG ===');
  console.log('1. Form Data:', formData);
  console.log('2. Name:', formData.name);
  console.log('3. Email:', formData.email);
  
  try {
    console.log('4. Attempting to create customer...');
    const result = await api.entities.Customer.create(formData);
    console.log('5. SUCCESS! Customer created:', result);
    
    // Invalidate queries and navigate
    queryClient.invalidateQueries({ queryKey: ["customers"] });
    navigate(createPageUrl("Customers"));
  } catch (error) {
    console.error('6. ERROR creating customer:', error);
    console.error('Error details:', error.response?.data || error.message);
    alert(`Error creating customer: ${error.message}`);
  }
};

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to={createPageUrl("Customers")}>
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              New Customer
            </h1>
            <p className="text-slate-500 mt-1">Add a new customer</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Basic Info */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Basic Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2 sm:col-span-2">
                  <Label>
                    Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    className="h-11 rounded-xl border-slate-200"
                    placeholder="Customer name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className="h-11 rounded-xl border-slate-200"
                    placeholder="email@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className="h-11 rounded-xl border-slate-200"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Company</Label>
                  <Input
                    value={formData.company}
                    onChange={(e) => updateField("company", e.target.value)}
                    className="h-11 rounded-xl border-slate-200"
                    placeholder="Company name"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2 sm:col-span-2">
                  <Label>Street Address</Label>
                  <Input
                    value={formData.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    className="h-11 rounded-xl border-slate-200"
                    placeholder="123 Main Street"
                  />
                </div>
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input
                    value={formData.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    className="h-11 rounded-xl border-slate-200"
                    placeholder="City"
                  />
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Input
                    value={formData.state}
                    onChange={(e) => updateField("state", e.target.value)}
                    className="h-11 rounded-xl border-slate-200"
                    placeholder="State"
                  />
                </div>
                <div className="space-y-2">
                  <Label>ZIP Code</Label>
                  <Input
                    value={formData.zip_code}
                    onChange={(e) => updateField("zip_code", e.target.value)}
                    className="h-11 rounded-xl border-slate-200"
                    placeholder="12345"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Notes</h2>
              <Textarea
                value={formData.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                placeholder="Additional notes about this customer..."
                className="min-h-24 rounded-xl border-slate-200"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-4">
              <Link to={createPageUrl("Customers")}>
                <Button type="button" variant="outline" className="h-11 px-6 rounded-xl">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={!formData.name || !formData.email || createMutation.isPending}
                className="bg-slate-900 hover:bg-slate-800 text-white h-11 px-8 rounded-xl shadow-sm"
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4 mr-2" />
                    Add Customer
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </form>
      </div>
    </div>
  );
}