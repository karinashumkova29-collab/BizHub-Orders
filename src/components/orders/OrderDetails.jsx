import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
} from '@/components/ui/alert-dialog';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import { X, Package, MapPin, Calendar, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function OrderDetails({ order, customers, onUpdate, onClose }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(order);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => api.entities.Order.delete(order.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      onClose(); // Close the modal after deletion
    },
  });

  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <Card className="w-full max-w-3xl my-8 border-0 shadow-2xl">
        <CardHeader className="border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">Order #{order.order_number}</CardTitle>
              <p className="text-sm text-slate-500 mt-1">
                Created {format(new Date(order.created_date), 'MMM d, yyyy • h:mm a')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-5 h-5" />
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
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          {!isEditing ? (
            <>
              <div className="flex flex-wrap gap-3">
                <StatusBadge status={order.status} />
                <PriorityBadge priority={order.priority} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-1">Customer</h3>
                  <p className="text-lg font-semibold text-slate-900">{order.customer_name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-1">Total Amount</h3>
                  <p className="text-3xl font-bold text-slate-900">${(order.total_amount || 0).toFixed(2)}</p>
                </div>
              </div>

              {order.shipping_address && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    <h3 className="text-sm font-medium text-slate-500">Shipping Address</h3>
                  </div>
                  <p className="text-slate-700">{order.shipping_address}</p>
                </div>
              )}

              {order.tracking_number && (
                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-1">Tracking Number</h3>
                  <p className="text-slate-900 font-mono">{order.tracking_number}</p>
                </div>
              )}

              {order.due_date && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <h3 className="text-sm font-medium text-slate-500">Due Date</h3>
                  </div>
                  <p className="text-slate-900">{format(new Date(order.due_date), 'MMMM d, yyyy')}</p>
                </div>
              )}

              {order.items && order.items.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Package className="w-4 h-4 text-slate-500" />
                    <h3 className="text-sm font-medium text-slate-500">Order Items</h3>
                  </div>
                  <div className="border rounded-lg divide-y divide-slate-100">
                    {order.items.map((item, index) => (
                      <div key={index} className="p-4 flex justify-between items-center">
                        <div>
                          <p className="font-medium text-slate-900">{item.name}</p>
                          <p className="text-sm text-slate-500">
                            {item.quantity} × ${(item.unit_price || 0).toFixed(2)}
                          </p>
                        </div>
                        <p className="font-semibold text-slate-900">${(item.total || 0).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 space-y-2 border-t pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Subtotal</span>
                      <span className="font-medium">${(order.subtotal || 0).toFixed(2)}</span>
                    </div>
                    {order.tax > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Tax</span>
                        <span className="font-medium">${(order.tax || 0).toFixed(2)}</span>
                      </div>
                    )}
                    {order.shipping_cost > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Shipping</span>
                        <span className="font-medium">${(order.shipping_cost || 0).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span>Total</span>
                      <span>${(order.total_amount || 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              {order.notes && (
                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-2">Notes</h3>
                  <p className="text-slate-700 bg-slate-50 p-3 rounded-lg">{order.notes}</p>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={editData.status} onValueChange={(val) => setEditData({ ...editData, status: val })}>
                    <SelectTrigger>
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
                  <Select value={editData.priority} onValueChange={(val) => setEditData({ ...editData, priority: val })}>
                    <SelectTrigger>
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
              <div className="space-y-2">
                <Label>Tracking Number</Label>
                <Input
                  value={editData.tracking_number || ''}
                  onChange={(e) => setEditData({ ...editData, tracking_number: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={editData.notes || ''}
                  onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                  rows={4}
                />
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="border-t border-slate-100 flex justify-end gap-3 p-6">
          {!isEditing ? (
            <>
              <Button variant="outline" onClick={onClose}>Close</Button>
              <Button onClick={() => setIsEditing(true)} className="bg-slate-900 hover:bg-slate-800">
                Edit Order
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button onClick={handleSave} className="bg-slate-900 hover:bg-slate-800">
                Save Changes
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}