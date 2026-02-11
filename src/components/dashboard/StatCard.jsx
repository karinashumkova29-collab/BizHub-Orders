import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function StatCard({ title, value, icon: Icon, trend, trendValue, bgColor, iconColor }) {
  const isPositive = trend === 'up';

  return (
    <Card className="relative overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow bg-white">
      <div className={`absolute top-0 right-0 w-32 h-32 ${bgColor} opacity-5 rounded-full transform translate-x-12 -translate-y-12`} />
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-slate-900 mb-3">{value}</h3>
            {trendValue && (
              <div className="flex items-center gap-1">
                {isPositive ? (
                  <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-rose-600" />
                )}
                <span className={`text-sm font-semibold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {trendValue}
                </span>
                <span className="text-sm text-slate-500">vs last month</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-xl ${bgColor} bg-opacity-10`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}