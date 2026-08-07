'use client';

import { useProjects } from '@/features/projects/hooks/use-projects';
import { useQueryState } from 'nuqs';
import { useCallback, useMemo, useState } from 'react';
import type { Task } from '../types';
import { useTaskDragDrop } from './use-task-drag-drop';
import { useTasks } from './use-tasks';

export function useKanbanBoard() {
  const { projects } = useProjects();

  // ── URL‑based search ──
  const [searchQuery, setSearchQuery] = useQueryState('q', { defaultValue: '' });

  // ── Local UI state ──
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');
  const [combinedSort, setCombinedSort] = useState<string>('createdAt_desc');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  // ── Derived sort values ──
  const [sortBy, sortOrder] = useMemo(() => {
    const [field, order] = combinedSort.split('_');
    return [field || 'createdAt', order || 'desc'];
  }, [combinedSort]);

  // ── API filters ──
  const filters = useMemo(
    () => ({
      projectId: selectedProjectId !== 'all' ? selectedProjectId : undefined,
      priority: priorityFilter !== 'all' ? priorityFilter : undefined,
      assigneeId: assigneeFilter !== 'all' ? assigneeFilter : undefined,
      q: searchQuery || undefined,
      sortBy,
      sortOrder,
    }),
    [selectedProjectId, priorityFilter, assigneeFilter, searchQuery, sortBy, sortOrder]
  );

  // ── Data ──
  const { tasks, isLoading, isError, updateTask, deleteTask, isDeleting } = useTasks(filters);

  // ── Drag & drop ──
  const { draggedTask, handleDragStart, handleDragOver, handleDrop, handleDragEnd } =
    useTaskDragDrop((id, status) => updateTask({ id, data: { status } }));

  // ── Dialogs state ──
  const [createOpen, setCreateOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);

  // ── Handlers ──
  const openCreate = useCallback(() => setCreateOpen(true), []);
  const closeCreate = useCallback((open: boolean) => setCreateOpen(open), []);

  const handleEdit = useCallback((task: Task) => setEditingTask(task), []);
  const closeEdit = useCallback((open: boolean) => {
    if (!open) setEditingTask(null);
  }, []);

  const handleDeleteRequest = useCallback((id: string) => setDeletingTaskId(id), []);
  const handleDeleteConfirm = useCallback(() => {
    if (deletingTaskId) {
      deleteTask(deletingTaskId);
      setDeletingTaskId(null);
    }
  }, [deletingTaskId, deleteTask]);
  const closeDelete = useCallback(() => setDeletingTaskId(null), []);

  const handleView = useCallback((task: Task) => setViewingTask(task), []);
  const closeView = useCallback((open: boolean) => {
    if (!open) setViewingTask(null);
  }, []);

  // ── Kanban columns ──
  const columns = useMemo(
    () =>
      [
        { id: 'TODO', title: 'انجام نشده', color: 'bg-gray-500', borderColor: 'border-gray-500' },
        {
          id: 'IN_PROGRESS',
          title: 'در حال انجام',
          color: 'bg-blue-500',
          borderColor: 'border-blue-500',
        },
        {
          id: 'REVIEW',
          title: 'در بازبینی',
          color: 'bg-orange-500',
          borderColor: 'border-orange-500',
        },
        {
          id: 'DONE',
          title: 'انجام شده',
          color: 'bg-emerald-500',
          borderColor: 'border-emerald-500',
        },
      ].map((col) => ({
        ...col,
        tasks: tasks.filter((t) => t.status === col.id),
      })),
    [tasks]
  );

  const clearFilters = useCallback(() => {
    setSelectedProjectId('all');
    setPriorityFilter('all');
    setAssigneeFilter('all');
    setCombinedSort('createdAt_desc');
    setSearchQuery(null);
  }, []);

  const hasNoTasks = tasks.length === 0;

  return {
    // data
    tasks,
    isLoading,
    isError,
    isDeleting,
    hasNoTasks,
    columns,
    projects,
    searchQuery,

    // filters state + setters
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

    // drag & drop
    draggedTask,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,

    // dialogs
    createOpen,
    editingTask,
    deletingTaskId,
    viewingTask,
    openCreate,
    closeCreate,
    handleEdit,
    closeEdit,
    handleDeleteRequest,
    handleDeleteConfirm,
    closeDelete,
    handleView,
    closeView,
    clearFilters,
  };
}
