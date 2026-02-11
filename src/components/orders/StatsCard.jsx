import { motion } from "framer-motion";

export default function StatsCard({ title, value, subtitle, icon: Icon, color = "slate" }) {
  const colorClasses = {
    slate: "bg-slate-50 text-slate-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    blue: "bg-blue-50 text-blue-600",
    rose: "bg-rose-50 text-rose-600",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-500 tracking-wide uppercase">
            {title}
          </p>
          <p className="text-3xl font-semibold text-slate-900 tracking-tight">
            {value}
          </p>
          {subtitle && (
            <p className="text-sm text-slate-400">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </motion.div>
  );
}