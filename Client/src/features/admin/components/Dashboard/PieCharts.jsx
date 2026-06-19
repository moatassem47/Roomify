import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = {
  Placed: "#D4A017",
  Packed: "#A97142",
  "Out for Delivery": "#4F7CAC",
  Delivered: "#5D735D",
  Cancelled: "#D9534F",
};

const RADIAN = Math.PI / 180;

const renderCustomLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  percent,
  name,
}) => {
  if (percent === 0) return null;

  const radius = outerRadius + 28;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const isRight = x > cx;

  return (
    <g>
      {/* Leader line */}
      <line
        x1={cx + (outerRadius + 6) * Math.cos(-midAngle * RADIAN)}
        y1={cy + (outerRadius + 6) * Math.sin(-midAngle * RADIAN)}
        x2={x}
        y2={y}
        stroke="#ccc"
        strokeWidth={1}
      />
      <text
        x={x + (isRight ? 4 : -4)}
        y={y}
        textAnchor={isRight ? "start" : "end"}
        dominantBaseline="middle"
        fontSize={11}
        fill="#555"
      >
        {name} {(percent * 100).toFixed(0)}%
      </text>
    </g>
  );
};

const PieCharts = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart margin={{ top: 20, right: 60, bottom: 20, left: 60 }}>
          <Pie
            data={data}
            dataKey="count"
            nameKey="status"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={2}
            labelLine={false}
            label={renderCustomLabel}
          >
            {data.map((entry) => (
              <Cell key={entry.status} fill={COLORS[entry.status]} />
            ))}
          </Pie>

          {/* Center label */}
          <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
            <tspan x="50%" dy="-6" fontSize="24" fontWeight="700" fill="#1a1a1a">
              {total}
            </tspan>
            <tspan x="50%" dy="18" fontSize="10" fill="#888">
              TOTAL
            </tspan>
          </text>

          <Tooltip formatter={(value, name) => [value, name]} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieCharts;