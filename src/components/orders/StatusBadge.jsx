import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, Package, Truck, CheckCheck, XCircle } from 'lucide-react';

const statusConfig = {
  pending: {
    icon: Clock,
    label: 'Pending',
    className: 'bg-amber-100 text-amber-800 border-amber-200'
  },
  confirmed: {
    icon: CheckCircle,
    label: 'Confirmed',
    className: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  processing: {
    icon: Package,
    label: 'Processing',
    className: 'bg-purple-100 text-purple-800 border-purple-200'
  },
  shipped: {
    icon: Truck,
    label: 'Shipped',
    className: 'bg-indigo-100 text-indigo-800 border-indigo-200'
  },
  delivered: {
    icon: CheckCheck,
    label: 'Delivered',
    className: 'bg-emerald-100 text-emerald-800 border-emerald-200'
  },
  cancelled: {
    icon: XCircle,
    label: 'Cancelled',
    className: 'bg-slate-100 text-slate-800 border-slate-200'
  }
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={`${config.className} flex items-center gap-1 w-fit border`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </Badge>
  );
}