import { format } from "date-fns";
import { ChevronRight, Calendar, Package } from "lucide-react";
import { motion } from "framer-motion";
import StatusBadge from "./StatusBadge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function OrderRow({ order, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        to={createPageUrl(`OrderDetail?id=${order.id}`)}
        className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all duration-200 group"
      >
        <div className="flex-shrink-0 w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
          <Package className="w-5 h-5 text-slate-500" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-900">
              {order.order_number || `#${order.id.slice(-6).toUpperCase()}`}
            </span>
            <StatusBadge status={order.status} />
            {order.priority && order.priority !== "normal" && (
              <StatusBadge status={order.priority} type="priority" />
            )}
          </div>
          <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
            <span className="font-medium text-slate-700">{order.customer_name}</span>
            {order.items && (
              <span>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {format(new Date(order.created_date), "MMM d, yyyy")}
            </span>
          </div>
        </div>

        <div className="text-right">
          <p className="font-semibold text-slate-900">
            ${(order.total_amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          {order.due_date && (
            <p className="text-xs text-slate-400 mt-0.5">
              Due {format(new Date(order.due_date), "MMM d")}
            </p>
          )}
        </div>

        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition-colors" />
      </Link>
    </motion.div>
  );
}