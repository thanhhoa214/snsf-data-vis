"use client";
import {
  CommandDialog,
  CommandEmpty,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useState } from "react";
import { useDebounceCallback } from "usehooks-ts";

export default function PersonFilter<T>({
  serverItems,
  initItem,
  itemKey,
  itemLabel,
  onSearch,
}: {
  serverItems: T[];
  initItem: T | null;
  itemKey: keyof T; // Key for the unique identifier
  itemLabel: keyof T; // Key for the label display
  onSearch: (search: string) => Promise<T[]>;
}) {
  const [items, setItems] = useState(serverItems);
  const [showItemSelect, setShowItemSelect] = useState(false);
  const [itemSearch, setItemSearch] = useState("");

  const [selectedItem, setSelectedItem] = useState<T | null>(initItem);

  const onSearchItem = useDebounceCallback((search: string) => {
    onSearch(search).then(setItems); // Adjust this to your search function
  }, 500);

  return (
    <>
      <input
        name={itemKey as string}
        value={selectedItem ? (selectedItem[itemKey] as string) : ""}
        readOnly
        className="hidden"
      />
      <span
        id="select-item"
        onClick={() => setShowItemSelect(true)}
        className="px-2 py-1 border rounded-lg cursor-pointer text-sm line-clamp-2 hover:bg-gray-100"
      >
        {selectedItem
          ? `[${selectedItem[itemKey]}] ${selectedItem[itemLabel] || ""}`
          : "Select an item"}
      </span>

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
              }}
              className="items-start"
            >
              <strong className="mr-1">[{item[itemKey] as string}]</strong>{" "}
              <span className="leading-4">{item[itemLabel] as string}</span>
            </CommandItem>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
