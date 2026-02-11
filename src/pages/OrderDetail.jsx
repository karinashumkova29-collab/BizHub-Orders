import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  ArrowLeft,
  Package,
  Loader2,
  User,
  MapPin,
  Calendar,
  FileText,
  Truck,
  Trash2,
  Edit,
} from "lucide-react";
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
import StatusBadge from "@/components/orders/StatusBadge";
import OrderItemsEditor from "@/components/orders/OrderItemsEditor";

export default function OrderDetail() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get("id");

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
const { data: order, isLoading } = useQuery({
  queryKey: ["order", orderId],
  queryFn: () => api.entities.Order.get(orderId),
  enabled: !!orderId,
});

useEffect(() => {
  if (order && !formData) {
    setFormData(order);
  }
}, [order]);

  const updateMutation = useMutation({
    mutationFn: (data) => api.entities.Order.update(orderId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      setIsEditing(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.entities.Order.delete(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      navigate(createPageUrl("Orders"));
    },
  });

  if (isLoading) {
    return (
      <div className="bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-white">
        <div className="text-center">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900">Order not found</h2>
          <Link to={createPageUrl("Orders")}>
            <Button variant="link" className="mt-2">
              Back to Orders
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentData = formData || order;
  const subtotal = currentData.items?.reduce((sum, item) => sum + (item.total || 0), 0) || 0;
  const total = subtotal + (currentData.tax || 0) + (currentData.shipping_cost || 0);

  const handleSave = () => {
    updateMutation.mutate({
      ...formData,
      subtotal,
      total_amount: total,
    });
  };

  const startEditing = () => {
    setFormData(order);
    setIsEditing(true);
  };

  return (
    <div className="bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link to={createPageUrl("Orders")}>
              <Button variant="ghost" size="icon" className="rounded-xl">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  {order.order_number || `#${order.id.slice(-6).toUpperCase()}`}
                </h1>
                <StatusBadge status={order.status} />
              </div>
              <p className="text-slate-500 mt-1">
                Created {format(new Date(order.created_date), "MMM d, yyyy 'at' h:mm a")}
              </p>
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
                      <AlertDialogTitle>Delete Order</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this order? This action cannot be undone.
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
          {/* Customer & Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-slate-400" />
                Customer
              </h2>
              <div className="space-y-2">
                <p className="font-medium text-slate-900">{order.customer_name}</p>
                {order.shipping_address && (
                  <p className="text-sm text-slate-500 flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    {order.shipping_address}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Order Status</h2>
              {isEditing ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={formData?.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger className="h-11 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select
                      value={formData?.priority}
                      onValueChange={(value) => setFormData({ ...formData, priority: value })}
                    >
                      <SelectTrigger className="h-11 rounded-xl">
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
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <StatusBadge status={order.status} />
                  {order.priority && order.priority !== "normal" && (
                    <StatusBadge status={order.priority} type="priority" />
                  )}
                  {order.due_date && (
                    <span className="text-sm text-slate-500 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Due {format(new Date(order.due_date), "MMM d, yyyy")}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Items */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-slate-400" />
              Items
            </h2>
            {isEditing ? (
              <OrderItemsEditor
                items={formData?.items || []}
                onChange={(items) => setFormData({ ...formData, items })}
              />
            ) : (
              <div className="divide-y divide-slate-100">
                {order.items?.map((item, index) => (
                  <div key={index} className="py-3 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-slate-900">{item.name}</p>
                      <p className="text-sm text-slate-500">
                        {item.quantity} × ${item.unit_price?.toFixed(2)}
                      </p>
                    </div>
                    <p className="font-medium text-slate-900">${item.total?.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              {isEditing ? (
                <div className="grid grid-cols-2 gap-4 py-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Tax</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData?.tax || 0}
                      onChange={(e) => setFormData({ ...formData, tax: parseFloat(e.target.value) || 0 })}
                      className="h-9 rounded-lg"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Shipping</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData?.shipping_cost || 0}
                      onChange={(e) => setFormData({ ...formData, shipping_cost: parseFloat(e.target.value) || 0 })}
                      className="h-9 rounded-lg"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Tax</span>
                    <span className="font-medium">${(order.tax || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Shipping</span>
                    <span className="font-medium">${(order.shipping_cost || 0).toFixed(2)}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between text-lg pt-2 border-t border-slate-100">
                <span className="font-semibold text-slate-900">Total</span>
                <span className="font-bold text-slate-900">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Tracking & Notes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-slate-400" />
                Tracking
              </h2>
              {isEditing ? (
                <Input
                  value={formData?.tracking_number || ""}
                  onChange={(e) => setFormData({ ...formData, tracking_number: e.target.value })}
                  placeholder="Enter tracking number"
                  className="h-11 rounded-xl"
                />
              ) : (
                <p className="text-slate-600">
                  {order.tracking_number || "No tracking number added"}
                </p>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-400" />
                Notes
              </h2>
              {isEditing ? (
                <Textarea
                  value={formData?.notes || ""}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Add notes..."
                  className="min-h-20 rounded-xl"
                />
              ) : (
                <p className="text-slate-600">
                  {order.notes || "No notes added"}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

