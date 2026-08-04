'use client';

import { useDebounce } from '@/shared/hooks/use-debounce';
import { cn } from '@/shared/lib/utils';
import { Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface SearchInputProps {
  placeholder?: string;
  onSearch: (value: string) => void;
  delay?: number;
  className?: string;
  defaultValue?: string;
}

export function SearchInput({
  placeholder = 'جستجو...',
  onSearch,
  delay = 300,
  className,
  defaultValue = '',
}: SearchInputProps) {
  const [value, setValue] = useState(defaultValue);
  const debouncedValue = useDebounce(value, delay);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync debounced value to parent
  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  // Clear with Escape key
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
      {/* Icon */}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <Search className="text-muted-foreground/40 h-4 w-4" />
      </div>

      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'bg-muted/40 focus:bg-background h-10 w-full rounded-xl border-0 py-2 pr-10 pl-10 text-sm',
          'placeholder:text-muted-foreground/40',
          'transition-all duration-200',
          'focus:ring-primary/20 focus:ring-1 focus:outline-none',
          className
        )}
      />

      {/* Clear button + Results count */}
      {value && (
        <div className="absolute inset-y-0 left-0 flex items-center gap-1 pl-3">
          <button
            onClick={handleClear}
            className="text-muted-foreground/40 hover:text-muted-foreground hover:bg-primary/10 cursor-pointer! rounded-lg p-1 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
