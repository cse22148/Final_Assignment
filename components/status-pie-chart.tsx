// src/components/StatusPieChart.jsx
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"

const COLORS = ["#22c55e", "#f59e0b", "#3b82f6", "#ef4444"]

export default function StatusPieChart({ data }) {
  console.log("[v0] StatusPieChart received data:", data)

  return (
    <div className="bg-white p-4 rounded-xl shadow-md h-96">
      <h2 className="text-lg font-semibold mb-2">Team Status Distribution</h2>
      {data && data.length > 0 ? (
        <ResponsiveContainer width="100%" height="80%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={(entry) => `${entry.status}: ${entry.count}`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name) => [`${value} members`, name]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-64 text-gray-500">No team status data available</div>
      )}
    </div>
  )
}
