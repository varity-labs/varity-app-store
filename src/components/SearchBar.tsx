"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { useEffect, useState, useCallback, memo } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function SearchBarComponent({
  value,
  onChange,
  placeholder = "Search applications...",
}: SearchBarProps): React.JSX.Element {
  const [localValue, setLocalValue] = useState(value);

  // Debounce the onChange callback
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [localValue, onChange]);

  // Sync external value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleClear = useCallback(() => {
    setLocalValue("");
    onChange("");
  }, [onChange]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  }, []);

  return (
    <div className="relative w-full max-w-lg group">
      <label className="sr-only" htmlFor="search-input">Search applications</label>
      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground-muted pointer-events-none transition-colors group-focus-within:text-brand-400" aria-hidden="true" />
      <input
        id="search-input"
        type="search"
        inputMode="search"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        value={localValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="w-full h-14 rounded-xl border border-border bg-background-secondary pl-12 pr-12 text-body-md text-foreground placeholder:text-foreground-muted transition-all duration-200 hover:border-border-muted focus:border-brand-500 focus:bg-background-tertiary focus:outline-none focus:ring-2 focus:ring-brand-500/20 shadow-sm focus:shadow-md"
      />
      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-foreground-muted transition-all hover:bg-background-quaternary hover:text-foreground animate-scale-in"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

export const SearchBar = memo(SearchBarComponent);
