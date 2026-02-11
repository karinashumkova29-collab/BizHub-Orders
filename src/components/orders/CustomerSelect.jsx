import { useState } from "react";
import { Check, ChevronsUpDown, Plus, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function CustomerSelect({ customers, value, onChange }) {
  const [open, setOpen] = useState(false);
  const selectedCustomer = customers.find(c => c.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-12 rounded-xl border-slate-200 hover:border-slate-300 hover:bg-slate-50"
        >
          {selectedCustomer ? (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-slate-500" />
              </div>
              <div className="text-left">
                <p className="font-medium text-slate-900">{selectedCustomer.name}</p>
                <p className="text-xs text-slate-500">{selectedCustomer.email}</p>
              </div>
            </div>
          ) : (
            <span className="text-slate-400">Select a customer...</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-slate-400" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search customers..." className="h-11" />
          <CommandList>
            <CommandEmpty>
              <div className="py-6 text-center">
                <p className="text-sm text-slate-500 mb-3">No customer found.</p>
                <Link to={createPageUrl("NewCustomer")}>
                  <Button variant="outline" size="sm" className="rounded-lg">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Customer
                  </Button>
                </Link>
              </div>
            </CommandEmpty>
            <CommandGroup>
              {customers.map((customer) => (
                <CommandItem
                  key={customer.id}
                  value={customer.name}
                  onSelect={() => {
                    onChange(customer.id, customer.name);
                    setOpen(false);
                  }}
                  className="py-3"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-xs text-slate-500">{customer.email}</p>
                    </div>
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === customer.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}