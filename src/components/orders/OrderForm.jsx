import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, X } from 'lucide-react';

export default function OrderForm({ customers, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    order_number: `ORD-${Date.now()}`,
    customer_id: '',
    customer_name: '',
    status: 'pending',
    priority: 'normal',
    items: [],
    subtotal: 0,
    tax: 0,
    shipping_cost: 0,
    total_amount: 0,
    shipping_address: '',
    tracking_number: '',
    notes: '',
    due_date: ''
  });

  const handleCustomerChange = (customerId) => {
    const customer = customers.find(c => c.id === customerId);
    setFormData(prev => ({
      ...prev,
      customer_id: customerId,
      customer_name: customer?.name || '',
      shipping_address: customer?.address || ''
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { name: '', quantity: 1, unit_price: 0, total: 0 }]
    }));
  };

  const updateItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    
    if (field === 'quantity' || field === 'unit_price') {
      newItems[index].total = (newItems[index].quantity || 0) * (newItems[index].unit_price || 0);
    }
    
    const subtotal = newItems.reduce((sum, item) => sum + (item.total || 0), 0);
    const total = subtotal + (formData.tax || 0) + (formData.shipping_cost || 0);
    
    setFormData(prev => ({
      ...prev,
      items: newItems,
      subtotal,
      total_amount: total
    }));
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    const subtotal = newItems.reduce((sum, item) => sum + (item.total || 0), 0);
    const total = subtotal + (formData.tax || 0) + (formData.shipping_cost || 0);
    
    setFormData(prev => ({
      ...prev,
      items: newItems,
      subtotal,
      total_amount: total
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <Card className="w-full max-w-4xl my-8 border-0 shadow-2xl">
        <CardHeader className="border-b border-slate-100">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">Create New Order</CardTitle>
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Order Number</Label>
                <Input
                  value={formData.order_number}
                  onChange={(e) => setFormData({ ...formData, order_number: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Customer</Label>
                <Select value={formData.customer_id} onValueChange={handleCustomerChange} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map(customer => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val })}>
                  <SelectTrigger>
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
                <Select value={formData.priority} onValueChange={(val) => setFormData({ ...formData, priority: val })}>
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
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Tracking Number</Label>
                <Input
                  value={formData.tracking_number}
                  onChange={(e) => setFormData({ ...formData, tracking_number: e.target.value })}
                  placeholder="Optional"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Shipping Address</Label>
              <Textarea
                value={formData.shipping_address}
                onChange={(e) => setFormData({ ...formData, shipping_address: e.target.value })}
                rows={2}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-lg">Order Items</Label>
                <Button type="button" variant="outline" size="sm" onClick={addItem}>
                  <Plus className="w-4 h-4 mr-2" /> Add Item
                </Button>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formData.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Input
                            value={item.name}
                            onChange={(e) => updateItem(index, 'name', e.target.value)}
                            placeholder="Item name"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value))}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unit_price}
                            onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value))}
                            className="w-28"
                          />
                        </TableCell>
                        <TableCell className="font-semibold">
                          ${(item.total || 0).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(index)}
                          >
                            <Trash2 className="w-4 h-4 text-rose-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <Label>Tax</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.tax}
                  onChange={(e) => {
                    const tax = parseFloat(e.target.value) || 0;
                    setFormData(prev => ({
                      ...prev,
                      tax,
                      total_amount: prev.subtotal + tax + prev.shipping_cost
                    }));
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Shipping</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.shipping_cost}
                  onChange={(e) => {
                    const shipping = parseFloat(e.target.value) || 0;
                    setFormData(prev => ({
                      ...prev,
                      shipping_cost: shipping,
                      total_amount: prev.subtotal + prev.tax + shipping
                    }));
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Total Amount</Label>
                <div className="text-3xl font-bold text-slate-900">
                  ${formData.total_amount.toFixed(2)}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes..."
                rows={3}
              />
            </div>
          </CardContent>
          <CardFooter className="border-t border-slate-100 flex justify-end gap-3 p-6">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" className="bg-slate-900 hover:bg-slate-800">
              Create Order
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}