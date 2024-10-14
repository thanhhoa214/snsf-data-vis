"use client";
import {
  CommandDialog,
  CommandEmpty,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDebounceCallback } from "usehooks-ts";

export default function PersonFilter<T, U extends keyof T>({
  serverItems,
  initItem = null,
  itemKey,
  itemLabel,
  labelFunc,
  onSearch,
}: {
  serverItems: T[];
  initItem?: T | null;
  itemKey: U;
  onSearch: (search: string) => Promise<T[]>;
} & (
  | { itemLabel: keyof T; labelFunc?: never }
  | { labelFunc: (item: T) => string; itemLabel?: never }
)) {
  const [items, setItems] = useState(serverItems);
  const [showItemSelect, setShowItemSelect] = useState(false);
  const [itemSearch, setItemSearch] = useState("");
  const router = useRouter();

  const [selectedItem, setSelectedItem] = useState<T | null>(initItem);

  const onSearchItem = useDebounceCallback((search: string) => {
    onSearch(search).then(setItems);
  }, 500);

  return (
    <>
      <input
        name={itemKey as string}
        value={selectedItem ? (selectedItem[itemKey] as string) : ""}
        readOnly
        className="hidden"
      />
      <strong
        id="select-item"
        onClick={() => setShowItemSelect(true)}
        className="px-4 py-2 border rounded-lg cursor-pointer text-sm line-clamp-2 bg-gray-100 hover:bg-gray-200 text-center w-fit mx-auto"
      >
        {selectedItem
          ? `[${selectedItem[itemKey]}] ${
              labelFunc?.(selectedItem) ||
              (itemLabel && selectedItem[itemLabel]) ||
              ""
            }`
          : "Select an item"}

        <Edit size={16} strokeWidth={2.5} className="inline-block ml-1" />
      </strong>

      <CommandDialog open={showItemSelect} onOpenChange={setShowItemSelect}>
        <input
          placeholder="Type a command or search..."
          value={itemSearch}
          onChange={(e) => {
            setItemSearch(e.target.value);
            onSearchItem(e.target.value);
          }}
          className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 px-2"
        />
        <CommandList>
          <CommandEmpty>No items found.</CommandEmpty>

          {items.map((item) => (
            <CommandItem
              key={item[itemKey] as string}
              onSelect={() => {
                setSelectedItem(item);
                setShowItemSelect(false);
                router.push(`?${itemKey as string}=${item[itemKey]}`);
              }}
              className="items-start"
            >
              <strong className="mr-1">[{item[itemKey] as string}]</strong>{" "}
              <span className="leading-4">
                {labelFunc?.(item) || (itemLabel && item[itemLabel]) + "" || ""}
              </span>
            </CommandItem>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
