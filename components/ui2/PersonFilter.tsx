"use client";
import { searchPerson } from "@/app/actions/persons";
import {
  CommandDialog,
  CommandEmpty,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Person } from "@prisma/client";
import { useState } from "react";
import { useDebounceCallback } from "usehooks-ts";

export default function PersonFilter({
  serverPersons,
  initPerson,
}: {
  serverPersons: Person[];
  initPerson: Person | null;
}) {
  const [persons, setPersons] = useState(serverPersons);
  const [showPersonSelect, setShowPersonSelect] = useState(false);
  const [personSearch, setPersonSearch] = useState("");

  const [selectedPerson, setSelectedPerson] = useState<Person | null>(
    initPerson
  );

  const onSearchPerson = useDebounceCallback((search: string) => {
    searchPerson(search).then(setPersons);
  }, 500);

  return (
    <>
      <input
        name="person_no"
        value={selectedPerson ? selectedPerson.PersonNumber : ""}
        readOnly
        className="hidden"
      />
      <span
        id="select-person"
        onClick={() => setShowPersonSelect(true)}
        className="px-2 py-1 border rounded-lg cursor-pointer text-sm line-clamp-2 hover:bg-gray-100"
      >
        {selectedPerson
          ? `[${selectedPerson.PersonNumber}] ${
              selectedPerson.FirstName || ""
            } ${selectedPerson.Surname}`
          : "Select a person"}
      </span>

      <CommandDialog open={showPersonSelect} onOpenChange={setShowPersonSelect}>
        <input
          placeholder="Type a command or search..."
          value={personSearch}
          onChange={(e) => {
            setPersonSearch(e.target.value);
            onSearchPerson(e.target.value);
          }}
          className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 px-2"
        />
        <CommandList>
          <CommandEmpty>No people found.</CommandEmpty>

          {persons.map((person) => (
            <CommandItem
              key={person.PersonNumber}
              onSelect={() => {
                setSelectedPerson(person);
                setShowPersonSelect(false);
              }}
            >
              [<strong>{person.PersonNumber}</strong>] {person.FirstName}{" "}
              {person.Surname}
            </CommandItem>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
