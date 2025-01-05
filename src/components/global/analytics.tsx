"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import {
  addMonths,
  differenceInMonths,
  format,
  startOfMonth,
  subMonths,
} from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Log } from "@/db/types";
import React, { useEffect, useState } from "react";

const generateRandomColor = (): string => {
  return `hsl(${Math.floor(Math.random() * 360)}, ${Math.floor(
    Math.random() * 30 + 70
  )}%, ${Math.floor(Math.random() * 20 + 40)}%)`;
};

const Analytics: React.FC<{ logs: Log[] }> = ({ logs }) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [chartConfig, setChartConfig] = useState<Record<string, any>>({});

  useEffect(() => {
    const chartDataMap = new Map<string, { [workflow: string]: number }>();
    const workflowColors = new Map<string, string>();

    logs.forEach((log) => {
      const monthYear = format(log.createdAt, "MMMM yyyy");
      const workflow = log.WorkflowName;

      if (!chartDataMap.has(monthYear)) {
        chartDataMap.set(monthYear, {});
      }

      const monthData = chartDataMap.get(monthYear)!;
      monthData[workflow] = (monthData[workflow] || 0) + 1;

      if (!workflowColors.has(workflow)) {
        workflowColors.set(workflow, generateRandomColor());
      }
    });

    if (logs.length > 0) {
      const earliestDate = startOfMonth(
        new Date(Math.min(...logs.map((log) => log.createdAt.getTime())))
      );
      const startRange = subMonths(earliestDate, 5);
      const latestDate = startOfMonth(
        new Date(Math.max(...logs.map((log) => log.createdAt.getTime())))
      );
      const totalMonths = differenceInMonths(latestDate, startRange) + 1;

      for (let i = 0; i < totalMonths; i++) {
        const currentMonthYear = format(addMonths(startRange, i), "MMMM yyyy");
        if (!chartDataMap.has(currentMonthYear)) {
          chartDataMap.set(currentMonthYear, {});
        }
      }
    }

    const sortedChartData = Array.from(chartDataMap.entries())
      .sort(([a], [b]) => {
        return new Date(`${a} 01`).getTime() - new Date(`${b} 01`).getTime();
      })
      .map(([month, workflows]) => {
        const workflowCounts = Object.fromEntries(
          Array.from(workflowColors.keys()).map((workflow) => [
            workflow,
            workflows[workflow] || 0,
          ])
        );
        return { month, ...workflowCounts };
      });

    const newChartConfig = Object.fromEntries(
      Array.from(workflowColors.entries()).map(([workflow, color]) => [
        workflow,
        { label: workflow, color },
      ])
    );

    setChartData(sortedChartData);
    setChartConfig(newChartConfig);
  }, [logs]);

  return (
    <Card className="shadow-lg dark:shadow-gray-800">
      <CardHeader>
        <CardTitle>Workflow Analytics</CardTitle>
        <CardDescription>Automate Your Github with Ease</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="h-[200px] w-full"
          aria-label="Workflow analytics chart"
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const [month, year] = value.split(" ");
                return `${month.slice(0, 3)} '${year.slice(-2)}`;
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
              aria-hidden="true"
            />
            {Object.keys(chartConfig).map((key) => (
              <Line
                key={key}
                dataKey={key}
                type="monotone"
                stroke={chartConfig[key].color}
                strokeWidth={2}
                dot={false}
                aria-hidden="true"
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start space-2 text-sm">
          <div className="flex items-center space-2 leading-none text-muted-foreground">
            Showing Actions on Every Workflow <TrendingUp className="h-4 w-4" />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Analytics;
