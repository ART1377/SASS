'use client';

import type { Project } from '@/features/projects/types';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { SearchInputURL } from '@/shared/components/ui/search-input-url';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Columns, List, Plus, RotateCcw } from 'lucide-react';

const SORT_OPTIONS = [
  { value: 'createdAt_desc', label: 'جدیدترین' },
  { value: 'createdAt_asc', label: 'قدیمی‌ترین' },
  { value: 'dueDate_asc', label: 'موعد (نزدیک‌ترین)' },
  { value: 'dueDate_desc', label: 'موعد (دورترین)' },
  { value: 'priority_asc', label: 'اولویت (کم→زیاد)' },
  { value: 'priority_desc', label: 'اولویت (زیاد→کم)' },
] as const;

interface KanbanToolbarProps {
  projects: Project[];

  selectedProjectId: string;
  setSelectedProjectId: (v: string) => void;
  priorityFilter: string;
  setPriorityFilter: (v: string) => void;
  assigneeFilter: string;
  setAssigneeFilter: (v: string) => void;
  combinedSort: string;
  setCombinedSort: (v: string) => void;

  viewMode: 'kanban' | 'list';
  setViewMode: (v: 'kanban' | 'list') => void;
  onCreateClick: () => void;
  onClearFilters: () => void;

  members?: { user: { id: string; name: string } }[];
  searchQuery?: string;
  user?: { id: string; role?: string | null } | null;
}

export function KanbanToolbar({
  projects,
  selectedProjectId,
  setSelectedProjectId,
  priorityFilter,
  setPriorityFilter,
  assigneeFilter,
  setAssigneeFilter,
  combinedSort,
  setCombinedSort,
  viewMode,
  setViewMode,
  onCreateClick,
  onClearFilters,
  searchQuery,
  members = [],
  user,
}: KanbanToolbarProps) {
  const hasActiveFilters =
    selectedProjectId !== 'all' ||
    priorityFilter !== 'all' ||
    assigneeFilter !== 'all' ||
    combinedSort !== 'createdAt_desc' ||
    (searchQuery && searchQuery.length > 0);

  return (
    <div className="space-y-3">
      {/* Row 1: Search + Project */}
      <div className="flex flex-col items-center gap-2 sm:flex-row">
        <SearchInputURL placeholder="جستجوی تسک..." className="min-w-0 flex-2" />
        <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
          <SelectTrigger className="h-9 w-full flex-1 shrink-0 rounded-lg text-xs sm:w-35">
            <SelectValue placeholder="همه پروژه‌ها" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه پروژه‌ها</SelectItem>
            {projects.map((p) => {
              const memberRole = p.members?.find((m) => m.userId === user?.id)?.role;
              const isOwner = p.ownerId === user?.id;

              return (
                <SelectItem key={p.id} value={p.id}>
                  <span className="flex items-center gap-2">
                    <span>{p.name}</span>
                    {isOwner && (
                      <Badge
                        variant="outline"
                        className="border-amber-500/50 text-[9px] text-amber-500"
                      >
                        مالک
                      </Badge>
                    )}
                    {!isOwner && memberRole === 'ADMIN' && (
                      <Badge
                        variant="outline"
                        className="border-primary/50 text-primary text-[9px]"
                      >
                        مدیر
                      </Badge>
                    )}
                    {!isOwner && memberRole === 'MANAGER' && (
                      <Badge
                        variant="outline"
                        className="border-blue-500/50 text-[9px] text-blue-500"
                      >
                        مدیر پروژه
                      </Badge>
                    )}
                    {!isOwner && memberRole === 'MEMBER' && (
                      <Badge variant="outline" className="text-muted-foreground text-[9px]">
                        عضو
                      </Badge>
                    )}
                  </span>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Row 2: Priority + Assignee + Sort + Clear Filters */}
      <div className="flex flex-col items-center gap-2 sm:flex-row">
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="h-9 w-full min-w-20 flex-1 rounded-lg text-xs">
            <SelectValue placeholder="اولویت" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه اولویت‌ها</SelectItem>
            <SelectItem value="LOW">کم</SelectItem>
            <SelectItem value="MEDIUM">متوسط</SelectItem>
            <SelectItem value="HIGH">زیاد</SelectItem>
            <SelectItem value="URGENT">فوری</SelectItem>
          </SelectContent>
        </Select>

        {selectedProjectId !== 'all' && (
          <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
            <SelectTrigger className="h-9 w-full min-w-25 flex-1 rounded-lg text-xs">
              <SelectValue placeholder="واگذار شده" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">همه اعضا</SelectItem>
              {members.map((m) => (
                <SelectItem key={m.user.id} value={m.user.id}>
                  {m.user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Select value={combinedSort} onValueChange={setCombinedSort}>
          <SelectTrigger className="h-9 w-full min-w-30 flex-1 rounded-lg text-xs">
            <SelectValue placeholder="مرتب‌سازی" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear Filters Chip */}
        {hasActiveFilters && (
          <Button
            variant="destructive"
            size="sm"
            onClick={onClearFilters}
            className="h-9 w-full shrink-0 gap-1.5 text-xs text-white sm:w-fit"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            حذف فیلترها
          </Button>
        )}
      </div>

      {/* Row 3: View toggle + Create */}
      <div className="flex items-center justify-between">
        <div className="bg-primary/10 flex items-center gap-1 rounded-xl p-1">
          <Button
            variant={viewMode === 'kanban' ? 'default' : 'ghost'}
            size="icon"
            className="h-8 w-8 rounded-lg"
            onClick={() => setViewMode('kanban')}
          >
            <Columns className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="icon"
            className="h-8 w-8 rounded-lg"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>

        <Button size={'sm'} onClick={onCreateClick} className="shadow-primary/20 gap-2 shadow-lg">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">تسک جدید</span>
        </Button>
      </div>
    </div>
  );
}
