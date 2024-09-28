"use client";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { searchGrant } from "../actions/grant";
import { searchPerson } from "../actions/persons";

export interface NetworkGraphFilterGrant {
  GrantNumber: number;
  Title: string;
}

export interface NetworkGraphFilterPerson {
  PersonNumber: number;
  Surname: string;
  FirstName: string | null;
}

export interface NetworkGraphFilterProps {
  response: {
    grants: NetworkGraphFilterGrant[];
    persons: NetworkGraphFilterPerson[];
  };
  onSubmit: (grant: number | null, person: number | null) => void;
  isLoading: boolean;
}

export default function NetworkGraphFilter({
  response: { grants: serverGrants, persons: serverPersons },
  onSubmit,
  isLoading,
}: NetworkGraphFilterProps) {
  const [grants, setGrants] = useState(serverGrants);
  const [showGrantSelect, setShowGrantSelect] = useState(false);
  const [grantSearch, setGrantSearch] = useState("");

  const [persons, setPersons] = useState(serverPersons);
  const [showPersonSelect, setShowPersonSelect] = useState(false);
  const [personSearch, setPersonSearch] = useState("");

  const [selectedPerson, setSelectedPerson] =
    useState<NetworkGraphFilterPerson | null>(null);
  const [selectedGrant, setSelectedGrant] =
    useState<NetworkGraphFilterGrant | null>(null);

  const onSearchPerson = useDebounceCallback((search: string) => {
    searchPerson(search).then(setPersons);
  }, 500);
  const onSearchGrant = useDebounceCallback((search: string) => {
    searchGrant(search).then(setGrants);
  }, 500);

  return (
    <>
      <form className="w-1/4 flex flex-col gap-1">
        <h3>Network Filter</h3>

        <label htmlFor="select-grant">Grant:</label>
        <span
          id="select-grant"
          onClick={() => setShowGrantSelect(true)}
          className="px-2 py-1 border rounded-lg cursor-pointer"
        >
          {selectedGrant
            ? `[${selectedGrant.Title}] ${selectedGrant.Title}`
            : "Select a grant"}
        </span>
        <label htmlFor="select-person">Person:</label>
        <span
          id="select-person"
          onClick={() => setShowPersonSelect(true)}
          className="px-2 py-1 border rounded-lg cursor-pointer"
        >
          {selectedPerson
            ? `[${selectedPerson.PersonNumber}] ${
                selectedPerson.FirstName || ""
              } ${selectedPerson.Surname}`
            : "Select a person"}
        </span>
        <Button
          onClick={(e) => {
            e.preventDefault();
            onSubmit(
              selectedGrant?.GrantNumber || null,
              selectedPerson?.PersonNumber || null
            );
          }}
          className="mt-2"
        >
          {isLoading ? "Loading..." : "Submit"}
        </Button>
      </form>
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

      <CommandDialog open={showGrantSelect} onOpenChange={setShowGrantSelect}>
        <input
          placeholder="Type a command or search..."
          value={grantSearch}
          onChange={(e) => {
            setGrantSearch(e.target.value);
            onSearchGrant(e.target.value);
          }}
          className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 px-2"
        />
        <CommandList>
          <CommandEmpty>No grants found.</CommandEmpty>
          {grants.map((grant) => (
            <CommandItem
              key={grant.GrantNumber}
              onSelect={() => {
                setSelectedGrant(grant);
                setShowGrantSelect(false);
              }}
            >
              [<strong>{grant.GrantNumber}</strong>] {grant.Title}
            </CommandItem>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
