import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import StatCard from '../components/dashboard/StatCard';
import StatusBadge from '../components/orders/StatusBadge';
import PriorityBadge from '../components/orders/PriorityBadge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Users, DollarSign, TrendingUp, Plus, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

export default function Dashboard() {
  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => api.entities.Order.list('-created_date', 100)
  });

  const { data: customers = [], isLoading: customersLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: () => api.entities.Customer.list()
  });

  // Calculate date ranges for comparison
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  // Orders comparison
  const ordersLast30Days = orders.filter(o => new Date(o.created_date) >= thirtyDaysAgo).length;
  const ordersPrevious30Days = orders.filter(
    o => new Date(o.created_date) >= sixtyDaysAgo && new Date(o.created_date) < thirtyDaysAgo
  ).length;
  const ordersChange = ordersPrevious30Days > 0
    ? ((ordersLast30Days - ordersPrevious30Days) / ordersPrevious30Days) * 100
    : ordersLast30Days > 0 ? 100 : 0;

  // Revenue comparison
  const revenueLast30Days = orders
    .filter(o => new Date(o.created_date) >= thirtyDaysAgo)
    .reduce((sum, order) => sum + (order.total_amount || 0), 0);
  const revenuePrevious30Days = orders
    .filter(o => new Date(o.created_date) >= sixtyDaysAgo && new Date(o.created_date) < thirtyDaysAgo)
    .reduce((sum, order) => sum + (order.total_amount || 0), 0);
  const revenueChange = revenuePrevious30Days > 0
    ? ((revenueLast30Days - revenuePrevious30Days) / revenuePrevious30Days) * 100
    : revenueLast30Days > 0 ? 100 : 0;

  // Active orders comparison
  const activeOrdersLast30Days = orders.filter(
    o => new Date(o.created_date) >= thirtyDaysAgo &&
    ['pending', 'confirmed', 'processing', 'shipped'].includes(o.status)
  ).length;
  const activeOrdersPrevious30Days = orders.filter(
    o => new Date(o.created_date) >= sixtyDaysAgo && 
    new Date(o.created_date) < thirtyDaysAgo &&
    ['pending', 'confirmed', 'processing', 'shipped'].includes(o.status)
  ).length;
  const activeOrdersChange = activeOrdersPrevious30Days > 0
    ? ((activeOrdersLast30Days - activeOrdersPrevious30Days) / activeOrdersPrevious30Days) * 100
    : activeOrdersLast30Days > 0 ? 100 : 0;

  // Customers comparison
  const customersLast30Days = customers.filter(c => new Date(c.created_date) >= thirtyDaysAgo).length;
  const customersPrevious30Days = customers.filter(
    c => new Date(c.created_date) >= sixtyDaysAgo && new Date(c.created_date) < thirtyDaysAgo
  ).length;
  const customersChange = customersPrevious30Days > 0
    ? ((customersLast30Days - customersPrevious30Days) / customersPrevious30Days) * 100
    : customersLast30Days > 0 ? 100 : 0;

  const stats = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + (order.total_amount || 0), 0),
    activeOrders: orders.filter(o => ['pending', 'confirmed', 'processing', 'shipped'].includes(o.status)).length,
    totalCustomers: customers.length
  };

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome back! Here's your business overview.</p>
        </div>
        <Link to={createPageUrl('Orders')}>
          <Button className="bg-slate-900 hover:bg-slate-800 text-white shadow-md">
            <Plus className="w-4 h-4 mr-2" />
            New Order
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={Package}
          bgColor="bg-blue-500"
          iconColor="text-blue-600"
          trend={ordersChange >= 0 ? "up" : "down"}
          trendValue={`${ordersChange >= 0 ? '+' : ''}${ordersChange.toFixed(0)}%`}
        />
        <StatCard
          title="Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          bgColor="bg-emerald-500"
          iconColor="text-emerald-600"
          trend={revenueChange >= 0 ? "up" : "down"}
          trendValue={`${revenueChange >= 0 ? '+' : ''}${revenueChange.toFixed(0)}%`}
        />
        <StatCard
          title="Active Orders"
          value={stats.activeOrders}
          icon={TrendingUp}
          bgColor="bg-purple-500"
          iconColor="text-purple-600"
          trend={activeOrdersChange >= 0 ? "up" : "down"}
          trendValue={`${activeOrdersChange >= 0 ? '+' : ''}${activeOrdersChange.toFixed(0)}%`}
        />
        <StatCard
          title="Customers"
          value={stats.totalCustomers}
          icon={Users}
          bgColor="bg-amber-500"
          iconColor="text-amber-600"
          trend={customersChange >= 0 ? "up" : "down"}
          trendValue={`${customersChange >= 0 ? '+' : ''}${customersChange.toFixed(0)}%`}
        />
      </div>

      {/* Recent Orders */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="border-b border-slate-100 bg-white">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-slate-900">Recent Orders</CardTitle>
            <Link to={createPageUrl('Orders')}>
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {ordersLoading ? (
            <div className="p-8 text-center">
              <div className="animate-pulse text-slate-500">Loading orders...</div>
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 mb-4">No orders yet</p>
              <Link to={createPageUrl('Orders')}>
                <Button className="bg-slate-900 hover:bg-slate-800 text-white shadow-md">
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Order
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentOrders.map((order) => (
                <div key={order.id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-slate-900">#{order.order_number}</h3>
                        <StatusBadge status={order.status} />
                        <PriorityBadge priority={order.priority} />
                      </div>
                      <p className="text-sm text-slate-600">{order.customer_name}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {format(new Date(order.created_date), 'MMM d, yyyy • h:mm a')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-slate-900">
                        ${(order.total_amount || 0).toFixed(2)}
                      </p>
                      <p className="text-sm text-slate-500 mt-1">
                        {order.items?.length || 0} items
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}