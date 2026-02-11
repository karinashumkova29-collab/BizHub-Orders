import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { ArrowLeft, Package, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";
import CustomerSelect from "@/components/orders/CustomerSelect";
import OrderItemsEditor from "@/components/orders/OrderItemsEditor";

export default function NewOrder() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    customer_id: "",
    customer_name: "",
    status: "pending",
    priority: "normal",
    items: [{ name: "", quantity: 1, unit_price: 0, total: 0 }],
    shipping_address: "",
    notes: "",
    due_date: "",
    tax: 0,
    shipping_cost: 0,
  });

  const { data: customers = [] } = useQuery({
    queryKey: ["customers"],
    queryFn: () => api.entities.Customer.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => api.entities.Order.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      navigate(createPageUrl("Orders"));
    },
  });

  const subtotal = formData.items.reduce((sum, item) => sum + item.total, 0);
  const total = subtotal + (formData.tax || 0) + (formData.shipping_cost || 0);

const handleSubmit = async (e) => {
  e.preventDefault();
  
  const orderNumber = `ORD-${Date.now()}`;
  const orderData = {
    ...formData,
    order_number: orderNumber,
    subtotal,
    total_amount: total,
  };

  console.log('=== ORDER CREATION DEBUG ===');
  console.log('1. Form Data:', formData);
  console.log('2. Order Number:', orderNumber);
  console.log('3. Subtotal:', subtotal);
  console.log('4. Total:', total);
  console.log('5. Final Order Data:', orderData);
  
  try {
    console.log('6. Attempting to create order...');
    const result = await api.entities.Order.create(orderData);
    console.log('7. SUCCESS! Order created:', result);
    
    // Invalidate queries and navigate
    queryClient.invalidateQueries({ queryKey: ["orders"] });
    navigate(createPageUrl("Orders"));
  } catch (error) {
    console.error('8. ERROR creating order:', error);
    console.error('Error details:', error.response?.data || error.message);
    alert(`Error creating order: ${error.message}`);
  }
};

  const handleCustomerChange = (customerId, customerName) => {
    const customer = customers.find(c => c.id === customerId);
    setFormData({
      ...formData,
      customer_id: customerId,
      customer_name: customerName,
      shipping_address: customer ? 
        [customer.address, customer.city, customer.state, customer.zip_code].filter(Boolean).join(", ") : ""
    });
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to={createPageUrl("Orders")}>
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              New Order
            </h1>
            <p className="text-slate-500 mt-1">Create a new order</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Customer Selection */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Customer</h2>
              <CustomerSelect
                customers={customers}
                value={formData.customer_id}
                onChange={handleCustomerChange}
              />
              {customers.length === 0 && (
                <p className="text-sm text-slate-500 mt-3">
                  No customers yet.{" "}
                  <Link to={createPageUrl("NewCustomer")} className="text-slate-900 underline">
                    Add a customer
                  </Link>{" "}
                  first.
                </p>
              )}
            </div>

            {/* Order Details */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Order Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger className="h-11 rounded-xl border-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData({ ...formData, priority: value })}
                  >
                    <SelectTrigger className="h-11 rounded-xl border-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Shipping Address</Label>
                  <Input
                    value={formData.shipping_address}
                    onChange={(e) => setFormData({ ...formData, shipping_address: e.target.value })}
                    className="h-11 rounded-xl border-slate-200"
                    placeholder="Enter shipping address"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Due Date (Optional)</Label>
                  <Input
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                    className="h-11 rounded-xl border-slate-200"
                  />
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Items</h2>
              <OrderItemsEditor
                items={formData.items}
                onChange={(items) => setFormData({ ...formData, items })}
              />
            </div>

            {/* Totals */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Summary</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tax</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.tax}
                      onChange={(e) => setFormData({ ...formData, tax: parseFloat(e.target.value) || 0 })}
                      className="h-11 rounded-xl border-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Shipping Cost</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.shipping_cost}
                      onChange={(e) => setFormData({ ...formData, shipping_cost: parseFloat(e.target.value) || 0 })}
                      className="h-11 rounded-xl border-slate-200"
                    />
                  </div>
                </div>
                <div className="border-t border-slate-100 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Tax</span>
                    <span className="font-medium">${(formData.tax || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Shipping</span>
                    <span className="font-medium">${(formData.shipping_cost || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg pt-2 border-t border-slate-100">
                    <span className="font-semibold text-slate-900">Total</span>
                    <span className="font-bold text-slate-900">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Notes</h2>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Add any additional notes..."
                className="min-h-24 rounded-xl border-slate-200"
              />
            </div>

           {/* Actions */}
<div className="flex gap-3 justify-end pt-4">
  <Link to={createPageUrl("Orders")}>
    <Button type="button" variant="outline" className="h-11 px-6 rounded-xl">
      Cancel
    </Button>
  </Link>
  <Button
    type="submit"
    disabled={!formData.customer_id || createMutation.isPending}
    className="bg-slate-900 hover:bg-slate-800 text-white h-11 px-8 rounded-xl shadow-sm flex items-center justify-center"
  >
    {createMutation.isPending ? (
      <>
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        Creating...
      </>
    ) : (
      <>
        <Package className="w-4 h-4 mr-2" />
        Create Order
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