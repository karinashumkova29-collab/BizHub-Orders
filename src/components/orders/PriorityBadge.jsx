import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Flag } from 'lucide-react';

const priorityConfig = {
  low: { label: 'Low', className: 'bg-slate-100 text-slate-700 border-slate-200' },
  normal: { label: 'Normal', className: 'bg-blue-100 text-blue-700 border-blue-200' },
  high: { label: 'High', className: 'bg-orange-100 text-orange-700 border-orange-200' },
  urgent: { label: 'Urgent', className: 'bg-rose-100 text-rose-700 border-rose-200' }
};

export default function PriorityBadge({ priority }) {
  const config = priorityConfig[priority] || priorityConfig.normal;

  return (
    <Badge variant="outline" className={`${config.className} flex items-center gap-1 w-fit border`}>
      <Flag className="w-3 h-3" />
      {config.label}
    </Badge>
  );
}