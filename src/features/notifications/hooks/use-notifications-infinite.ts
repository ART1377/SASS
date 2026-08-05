'use client';

import { useCallback, useMemo, useState } from 'react';
import { useNotifications } from './use-notifications';

const PAGE_SIZE = 10;

export function useNotificationsInfinite() {
  const { notifications, ...rest } = useNotifications();
  const [page, setPage] = useState(1);

  const displayedNotifications = useMemo(
    () => notifications.slice(0, page * PAGE_SIZE),
    [notifications, page]
  );

  const hasMore = displayedNotifications.length < notifications.length;

  const loadMore = useCallback(() => {
    if (hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [hasMore]);

  const reset = useCallback(() => {
    setPage(1);
  }, []);

  return {
    ...rest,
    notifications: displayedNotifications,
    allNotifications: notifications,
    hasMore,
    loadMore,
    reset,
  };
}
