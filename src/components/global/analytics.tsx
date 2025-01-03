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
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Log } from "@/db/types";
import { useEffect, useState } from "react";

const generateRandomColor = () => {
  const h = Math.floor(Math.random() * 360); // Hue
  const s = Math.floor(Math.random() * 30) + 70; // Saturation (70-100%)
  const l = Math.floor(Math.random() * 20) + 40; // Lightness (40-60%)
  return `hsl(${h}, ${s}%, ${l}%)`;
};

export function Analytics({ logs }: { logs: Log[] }) {
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
      const startRange = subMonths(earliestDate, 5); // Start 5 months earlier
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

    // Sort the chart data by chronological order
    const sortedChartData = Array.from(chartDataMap.entries())
      .sort(([a], [b]) => {
        const dateA = new Date(`${a} 01`);
        const dateB = new Date(`${b} 01`);
        return dateA.getTime() - dateB.getTime();
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
    console.log(sortedChartData);
    console.log(newChartConfig);
  }, [logs]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workflow Analytics</CardTitle>
        <CardDescription>Automate Your Github with Ease</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
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
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            {Object.keys(chartConfig).map((key) => (
              <Line
                key={key}
                dataKey={key}
                type="monotone"
                stroke={chartConfig[key].color}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="flex items-center gap-2 leading-none text-muted-foreground">
            Showing Actions on Every Workflow <TrendingUp className="h-4 w-4" />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
