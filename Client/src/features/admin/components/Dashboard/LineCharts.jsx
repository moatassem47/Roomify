import {
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const LineCharts = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
         margin={{
        top: 5,
        right: 0,
        left: 0,
        bottom: 5,
      }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        
        <XAxis dataKey="date" />
        
        

         <Tooltip
        cursor={{
          stroke: '#825032',
        }}
        contentStyle={{
          backgroundColor: '#fef9f2',
          borderColor: 'grey',
        }}
      />

        <Legend />

        <Line
          type="monotone"
          dataKey="totalOrders"
          stroke="#825032"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineCharts;