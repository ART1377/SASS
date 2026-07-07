'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import ReactECharts from 'echarts-for-react';
import { useTheme } from 'next-themes';

export function ProjectsChart() {
  const { theme } = useTheme();
  const isDark = theme?.includes('dark');

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {
      bottom: 0,
      textStyle: {
        color: isDark ? '#9ca3af' : '#6b7280',
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
      data: ['پروژه آلفا', 'پروژه بتا', 'پروژه گاما', 'پروژه دلتا'],
      axisLabel: {
        color: isDark ? '#9ca3af' : '#6b7280',
      },
      axisLine: {
        lineStyle: {
          color: isDark ? '#374151' : '#e5e7eb',
        },
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: isDark ? '#9ca3af' : '#6b7280',
      },
      splitLine: {
        lineStyle: {
          color: isDark ? '#374151' : '#f3f4f6',
        },
      },
    },
    series: [
      {
        name: 'تسک‌های تکمیل شده',
        type: 'bar',
        data: [23, 45, 18, 32],
        itemStyle: {
          borderRadius: [8, 8, 0, 0],
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: isDark ? '#818cf8' : '#6366f1' },
              { offset: 1, color: isDark ? '#6366f1' : '#818cf8' },
            ],
          },
        },
        emphasis: {
          itemStyle: {
            color: isDark ? '#a5b4fc' : '#4f46e5',
          },
        },
      },
      {
        name: 'تسک‌های در حال انجام',
        type: 'bar',
        data: [12, 8, 15, 10],
        itemStyle: {
          borderRadius: [8, 8, 0, 0],
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: isDark ? '#6ee7b7' : '#10b981' },
              { offset: 1, color: isDark ? '#34d399' : '#059669' },
            ],
          },
        },
        emphasis: {
          itemStyle: {
            color: isDark ? '#a7f3d0' : '#047857',
          },
        },
      },
    ],
  };

  return (
    <Card className="card-hover border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg">آمار پروژه‌ها</CardTitle>
        <CardDescription>وضعیت تسک‌ها در هر پروژه</CardDescription>
      </CardHeader>
      <CardContent>
        <ReactECharts option={option} style={{ height: '300px' }} />
      </CardContent>
    </Card>
  );
}