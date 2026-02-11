import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

export default function OrderItemsEditor({ items, onChange }) {
  const addItem = () => {
    onChange([...items, { name: "", quantity: 1, unit_price: 0, total: 0 }]);
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    
    if (field === "quantity" || field === "unit_price") {
      newItems[index].total = newItems[index].quantity * newItems[index].unit_price;
    }
    
    onChange(newItems);
  };

  const removeItem = (index) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-12 gap-3 text-xs font-medium text-slate-500 uppercase tracking-wide px-1">
        <div className="col-span-5">Item Name</div>
        <div className="col-span-2">Qty</div>
        <div className="col-span-2">Price</div>
        <div className="col-span-2">Total</div>
        <div className="col-span-1"></div>
      </div>

      <AnimatePresence>
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-12 gap-3 items-center"
          >
            <div className="col-span-5">
              <Input
                placeholder="Item name"
                value={item.name}
                onChange={(e) => updateItem(index, "name", e.target.value)}
                className="h-11 rounded-xl border-slate-200"
              />
            </div>
            <div className="col-span-2">
              <Input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value) || 0)}
                className="h-11 rounded-xl border-slate-200"
              />
            </div>
            <div className="col-span-2">
              <Input
                type="number"
                min="0"
                step="0.01"
                value={item.unit_price}
                onChange={(e) => updateItem(index, "unit_price", parseFloat(e.target.value) || 0)}
                className="h-11 rounded-xl border-slate-200"
              />
            </div>
            <div className="col-span-2">
              <p className="font-medium text-slate-900 pl-2">
                ${item.total.toFixed(2)}
              </p>
            </div>
            <div className="col-span-1 flex justify-end">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeItem(index)}
                className="h-9 w-9 text-slate-400 hover:text-red-500 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <Button
        type="button"
        variant="outline"
        onClick={addItem}
        className="w-full h-11 rounded-xl border-dashed border-slate-300 hover:border-slate-400 text-slate-600"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Item
      </Button>
    </div>
  );
}