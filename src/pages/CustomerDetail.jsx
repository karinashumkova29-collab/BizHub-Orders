import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  ArrowLeft,
  User,
  Loader2,
  Mail,
  Phone,
  Building2,
  MapPin,
  FileText,
  Trash2,
  Edit,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Link } from "react-router-dom";
import OrderRow from "@/components/orders/OrderRow";

export default function CustomerDetail() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const customerId = urlParams.get("id");

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);

  const { data: customer, isLoading } = useQuery({
  queryKey: ["customer", customerId],
  queryFn: () => api.entities.Customer.get(customerId),
  enabled: !!customerId,
  onSuccess: (data) => {
    if (data && !formData) setFormData(data);
  },
});


  const { data: orders = [] } = useQuery({
    queryKey: ["customer-orders", customerId],
    queryFn: () => api.entities.Order.filter({ customer_id: customerId }),
    enabled: !!customerId,
  });

  const updateMutation = useMutation({
    mutationFn: (data) => api.entities.Customer.update(customerId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer", customerId] });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      setIsEditing(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.entities.Customer.delete(customerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      navigate(createPageUrl("Customers"));
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center">
        <div className="text-center">
          <User className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900">Customer not found</h2>
          <Link to={createPageUrl("Customers")}>
            <Button variant="link" className="mt-2">
              Back to Customers
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentData = formData || customer;

  const handleSave = () => {
    updateMutation.mutate(formData);
  };

  const startEditing = () => {
    setFormData(customer);
    setIsEditing(true);
  };

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="min-h-screen bg-slate">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link to={createPageUrl("Customers")}>
              <Button variant="ghost" size="icon" className="rounded-xl">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center">
                <span className="text-xl font-bold text-slate-600">
                  {customer.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  {customer.name}
                </h1>
                {customer.company && (
                  <p className="text-slate-500 flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    {customer.company}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="h-10 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={updateMutation.isPending}
                  className="bg-slate-900 hover:bg-slate-800 text-white h-10 px-6 rounded-xl"
                >
                  {updateMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={startEditing}
                  className="h-10 rounded-xl"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-10 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Customer</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this customer? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteMutation.mutate()}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Contact Info */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Contact Information
            </h2>
            {isEditing ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2 sm:col-span-2">
                  <Label>Name</Label>
                  <Input
                    value={formData?.name || ""}
                    onChange={(e) => updateField("name", e.target.value)}
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={formData?.email || ""}
                    onChange={(e) => updateField("email", e.target.value)}
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={formData?.phone || ""}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Company</Label>
                  <Input
                    value={formData?.company || ""}
                    onChange={(e) => updateField("company", e.target.value)}
                    className="h-11 rounded-xl"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-slate-600">
                  <Mail className="w-5 h-5 text-slate-400" />
                  <a href={`mailto:${customer.email}`} className="hover:text-slate-900">
                    {customer.email}
                  </a>
                </div>
                {customer.phone && (
                  <div className="flex items-center gap-3 text-slate-600">
                    <Phone className="w-5 h-5 text-slate-400" />
                    <a href={`tel:${customer.phone}`} className="hover:text-slate-900">
                      {customer.phone}
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Address */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-slate-400" />
              Address
            </h2>
            {isEditing ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2 sm:col-span-2">
                  <Label>Street Address</Label>
                  <Input
                    value={formData?.address || ""}
                    onChange={(e) => updateField("address", e.target.value)}
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input
                    value={formData?.city || ""}
                    onChange={(e) => updateField("city", e.target.value)}
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Input
                    value={formData?.state || ""}
                    onChange={(e) => updateField("state", e.target.value)}
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>ZIP Code</Label>
                  <Input
                    value={formData?.zip_code || ""}
                    onChange={(e) => updateField("zip_code", e.target.value)}
                    className="h-11 rounded-xl"
                  />
                </div>
              </div>
            ) : (
              <p className="text-slate-600">
                {[customer.address, customer.city, customer.state, customer.zip_code]
                  .filter(Boolean)
                  .join(", ") || "No address added"}
              </p>
            )}
          </div>

          {/* Notes */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-slate-400" />
              Notes
            </h2>
            {isEditing ? (
              <Textarea
                value={formData?.notes || ""}
                onChange={(e) => updateField("notes", e.target.value)}
                placeholder="Add notes..."
                className="min-h-20 rounded-xl"
              />
            ) : (
              <p className="text-slate-600">{customer.notes || "No notes added"}</p>
            )}
          </div>

          {/* Customer Orders */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-slate-400" />
                Orders ({orders.length})
              </h2>
              <Link to={createPageUrl("NewOrder")}>
                <Button variant="outline" size="sm" className="rounded-lg">
                  New Order
                </Button>
              </Link>
            </div>
            {orders.length > 0 ? (
              <div className="space-y-3">
                {orders.map((order, index) => (
                  <OrderRow key={order.id} order={order} index={index} />
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-center py-8">No orders yet</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}