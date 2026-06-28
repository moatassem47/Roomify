import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend , ResponsiveContainer } from 'recharts';

const BarCharts = ({data}) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
        <BarChart
      style={{ width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618 }}
      responsive
      data={data}
      margin={{
        top: 5,
        right: 0,
        left: 0,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis width="auto" />
      <Tooltip />
      <Legend />
      <Bar dataKey="totalSpent" fill="#8884d8" activeBar={{ fill: 'pink', stroke: 'blue' }} radius={[10, 10, 0, 0]} />
    </BarChart>
    </ResponsiveContainer>
  )
}

export default BarCharts