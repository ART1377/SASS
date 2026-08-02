'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import ReactECharts from 'echarts-for-react';
import { useTheme } from 'next-themes';
import type { DashboardStats } from '../types';

interface ProjectsChartProps {
  projectStats?: DashboardStats['projectStats'];
}

export function ProjectsChart({ projectStats }: ProjectsChartProps) {
  const { theme } = useTheme();
  const isDark = theme?.includes('dark');

  if (!projectStats || projectStats.length === 0) {
    return (
      <Card className="card-hover border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">آمار پروژه‌ها</CardTitle>
          <CardDescription>داده‌ای برای نمایش وجود ندارد</CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground flex h-75 items-center justify-center">
          پس از ایجاد پروژه و تسک، نمودار اینجا نمایش داده می‌شود
        </CardContent>
      </Card>
    );
  }

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      textStyle: { fontFamily: 'Vazirmatn' },
    },
    legend: {
      bottom: 0,
      textStyle: {
        color: isDark ? '#9ca3af' : '#6b7280',
        fontFamily: 'Vazirmatn',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: projectStats.map((p) => p.name),
      axisLabel: {
        color: isDark ? '#9ca3af' : '#6b7280',
        fontFamily: 'Vazirmatn',
        fontSize: 11,
      },
      axisLine: {
        lineStyle: { color: isDark ? '#374151' : '#e5e7eb' },
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: isDark ? '#9ca3af' : '#6b7280',
        fontFamily: 'Vazirmatn',
      },
      splitLine: {
        lineStyle: { color: isDark ? '#374151' : '#f3f4f6' },
      },
    },
    series: [
      {
        name: 'تکمیل شده',
        type: 'bar',
        data: projectStats.map((p) => p.completed),
        itemStyle: {
          borderRadius: [8, 8, 0, 0],
          color: isDark ? '#6ee7b7' : '#10b981',
        },
        emphasis: {
          itemStyle: { color: isDark ? '#a7f3d0' : '#059669' },
        },
      },
      {
        name: 'در حال انجام',
        type: 'bar',
        data: projectStats.map((p) => p.inProgress),
        itemStyle: {
          borderRadius: [8, 8, 0, 0],
          color: isDark ? '#818cf8' : '#6366f1',
        },
        emphasis: {
          itemStyle: { color: isDark ? '#a5b4fc' : '#4f46e5' },
        },
      },
    ],
  };

  return (
    <Card className="card-hover border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg">آمار پروژه‌ها</CardTitle>
        <CardDescription>تسک‌های تکمیل شده و در حال انجام</CardDescription>
      </CardHeader>
      <CardContent>
        <ReactECharts option={option} style={{ height: '300px' }} />
      </CardContent>
    </Card>
  );
}
