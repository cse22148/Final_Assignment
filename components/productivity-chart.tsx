"use client"

import { useAppSelector } from "../redux/hooks"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"
import { TrendingUp } from "lucide-react"

export function ProductivityChart() {
  const members = useAppSelector((state) => state.members.members)

  console.log("[v0] Members data:", members)

  const statusCounts = members.reduce(
    (acc, member) => {
      const status = member.status || "Offline"
      acc[status] = (acc[status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  console.log("[v0] Status counts:", statusCounts)

  const chartData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status,
    value: count,
    fill: getStatusColor(status),
  }))

  console.log("[v0] Chart data:", chartData)

  const chartConfig = {
    value: {
      label: "Members",
    },
    Working: {
      label: "Working",
      color: "hsl(142, 76%, 36%)",
    },
    Meeting: {
      label: "Meeting",
      color: "hsl(221, 83%, 53%)",
    },
    Break: {
      label: "Break",
      color: "hsl(48, 96%, 53%)",
    },
    Offline: {
      label: "Offline",
      color: "hsl(215, 16%, 47%)",
    },
  }

  function getStatusColor(status: string) {
    const colors = {
      Working: "hsl(142, 76%, 36%)",
      Meeting: "hsl(221, 83%, 53%)",
      Break: "hsl(48, 96%, 53%)",
      Offline: "hsl(215, 16%, 47%)",
    }
    return colors[status as keyof typeof colors] || "hsl(215, 16%, 47%)"
  }

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
    if (percent < 0.05) return null // Show labels for slices > 5%

    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.7
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={14}
        fontWeight="bold"
        className="drop-shadow-lg"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  if (chartData.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Team Status Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">No team members found</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Team Status Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[450px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 40, right: 40, bottom: 40, left: 40 }}>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
                formatter={(value, name) => [`${value} member${value !== 1 ? "s" : ""}`, name]}
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={140}
                innerRadius={0}
                strokeWidth={3}
                stroke="hsl(var(--background))"
                labelLine={false}
                label={renderCustomLabel}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value, entry) => `${value}: ${entry.payload?.value} members`}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="grid grid-cols-2 gap-4 mt-6">
          {chartData.map((item) => (
            <div
              key={item.name}
              className="flex items-center gap-3 p-4 rounded-lg bg-muted/40 border border-border/50 hover:bg-muted/60 transition-colors"
            >
              <div
                className="w-6 h-6 rounded-full border-2 border-background shadow-md flex-shrink-0"
                style={{ backgroundColor: item.fill }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-foreground">{item.name}</div>
                <div className="text-xs text-muted-foreground">
                  {item.value} member{item.value !== 1 ? "s" : ""} ({((item.value / members.length) * 100).toFixed(0)}%)
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-6 pt-4 border-t border-border">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              Total Team Members: <span className="font-bold text-primary">{members.length}</span>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
