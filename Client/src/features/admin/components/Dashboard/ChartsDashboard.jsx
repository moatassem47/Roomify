import BarCharts from "./BarCharts"
import LineCharts from "./LineCharts"
import PieCharts from "./PieCharts"


const ChartsDashboard = ({charts}) => {
  console.log(charts)
  return (
    <div className="grid lg:grid-cols-3 grid-col-1 md:grid-col-2 gap-3">
      <div className="bg-white px-5  pt-5 rounded-2xl">
        <h1>Performance Analytics</h1>
        <span className="text-xs text-stone-500"> orders growth trend</span>
       <LineCharts data={charts.dailyTrends}/>
      </div>
      <div className="bg-white px-5  pt-5 rounded-2xl">
        <h1>Top 5 Customers</h1>
        <span className="text-xs text-stone-500">Our loyal customer</span>
       <BarCharts data={charts.top5Customers}/>
      </div>
       <div className="bg-white px-5  pt-5 rounded-2xl">
        <h1>Top 5 Customers</h1>
        <span className="text-xs text-stone-500">Our loyal customer</span>
       <PieCharts data={charts.orderStatusStats}/>
      </div>
    </div>
  )
}

export default ChartsDashboard