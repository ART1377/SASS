'use client';

import { useDebounce } from '@/shared/hooks/use-debounce';
import { cn } from '@/shared/lib/utils';
import { Search, X } from 'lucide-react';
import { useQueryState } from 'nuqs';
import { useEffect, useRef, useState } from 'react';

interface SearchInputURLProps {
  placeholder?: string;
  className?: string;
  delay?: number;
}

export function SearchInputURL({
  placeholder = 'جستجو...',
  className,
  delay = 300,
}: SearchInputURLProps) {
  const [urlValue, setUrlValue] = useQueryState('q', { defaultValue: '' });
  const [value, setValue] = useState(urlValue);
  const debouncedValue = useDebounce(value, delay);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync from URL when it changes externally (e.g., back/forward navigation)
  useEffect(() => {
    setValue(urlValue);
  }, [urlValue]);

  // Push to URL only when length >= 2 or cleared to 0
  useEffect(() => {
    if (debouncedValue.length === 0) {
      setUrlValue(null); // remove param
    } else if (debouncedValue.length >= 2) {
      setUrlValue(debouncedValue);
    }
    // if length == 1, do nothing (keep previous URL value)
  }, [debouncedValue, setUrlValue]);

  // Clear with Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        setValue('');
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClear = () => {
    setValue('');
    inputRef.current?.focus();
  };

  return (
    <div className={cn('relative w-full', className)}>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <Search className="text-muted-foreground/40 h-4 w-4" />
      </div>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'bg-muted/40 h-9 w-full rounded-lg border-0 py-2 pr-10 pl-10 text-sm',
          'placeholder:text-muted-foreground/40',
          'ring-primary/20 ring-1 transition-all duration-200',
          'focus:bg-background focus:ring-primary/40 focus:ring-1 focus:outline-none',
          className
        )}
      />
      {value && (
        <div className="absolute inset-y-0 left-0 flex items-center gap-1 pl-3">
          <button
            onClick={handleClear}
            className="text-muted-foreground/40 hover:bg-primary/10 hover:text-muted-foreground cursor-pointer rounded-lg p-1 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
