import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function EmptyState({ icon: Icon, title, description, actionLabel, actionUrl }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-slate-500 mb-4 text-center max-w-sm">{description}</p>
      {actionLabel && actionUrl && (
        <Link to={createPageUrl(actionUrl)}>
          <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-6">
            <Plus className="w-4 h-4 mr-2" />
            {actionLabel}
          </Button>
        </Link>
      )}
    </motion.div>
  );
}