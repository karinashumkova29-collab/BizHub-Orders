import React, { useState } from 'react';
import { api } from '@/lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import StatusBadge from '../components/orders/StatusBadge';
import PriorityBadge from '../components/orders/PriorityBadge';
import OrderForm from '../components/orders/OrderForm';
import OrderDetails from '../components/orders/OrderDetails';
import { Plus, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AnimatePresence, motion } from 'framer-motion';

export default function Orders() {
  const [showForm, setShowForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => api.entities.Order.list('-created_date', 200)
  });

  const { data: customers = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: () => api.entities.Customer.list()
  });

  const createOrderMutation = useMutation({
    mutationFn: (data) => api.entities.Order.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      setShowForm(false);
    }
  });

  const updateOrderMutation = useMutation({
    mutationFn: ({ id, data }) => api.entities.Order.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      setSelectedOrder(null);
    }
  });

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.order_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customer_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || order.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Orders</h1>
          <p className="text-slate-500 mt-1">Manage and track all your orders</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-slate-900 hover:bg-slate-800 text-white shadow-md"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Order
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search orders or customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      {isLoading ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <div className="animate-pulse text-slate-500">Loading orders...</div>
          </CardContent>
        </Card>
      ) : filteredOrders.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <p className="text-slate-500 mb-4">No orders found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence>
            {filteredOrders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card 
                  className="border-0 shadow-sm hover:shadow-md transition-all cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-slate-900">#{order.order_number}</h3>
                          <StatusBadge status={order.status} />
                          <PriorityBadge priority={order.priority} />
                        </div>
                        <p className="text-slate-700 font-medium">{order.customer_name}</p>
                        <p className="text-sm text-slate-500 mt-1">
                          {format(new Date(order.created_date), 'MMM d, yyyy • h:mm a')}
                        </p>
                        {order.items && (
                          <p className="text-sm text-slate-500 mt-1">
                            {order.items.length} items
                          </p>
                        )}
                      </div>
                      <div className="text-left lg:text-right">
                        <p className="text-3xl font-bold text-slate-900">
                          ${(order.total_amount || 0).toFixed(2)}
                        </p>
                        {order.tracking_number && (
                          <p className="text-sm text-slate-500 mt-2">
                            Tracking: {order.tracking_number}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Order Form Modal */}
      {showForm && (
        <OrderForm
          customers={customers}
          onSave={(data) => createOrderMutation.mutate(data)}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetails
          order={selectedOrder}
          customers={customers}
          onUpdate={(data) => updateOrderMutation.mutate({ id: selectedOrder.id, data })}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}