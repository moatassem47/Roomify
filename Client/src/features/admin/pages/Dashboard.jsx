import { useDashboard } from "../apis/useAdmin";
import Loading from "../../../components/Loading";
import KPISDashboard from "../components/Dashboard/KPISDashboard";
import ChartsDashboard from "../components/Dashboard/ChartsDashboard";

const Dashboard = () => {
  const { data, isLoading } = useDashboard();

  if (isLoading)
    return (
      <div className="flex justify-center items-center">
        <Loading />
      </div>
    );

  if (!data || !data.KPIS) {
    return <div className="p-4 text-stone-500">No data available.</div>;
  }
  const Charts=data.Charts
  const KPIS = data.KPIS;
  console.log(Charts);
  
  return (
    <div className="py-2 px-3 flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-wide mt-4 text-center">Dashboard Overview</h1>
        <p className="text-stone-500 text-sm text-center">
          Good afternoon, manager. Here's what's happening at the Roomify.
        </p>
      </div>
      <KPISDashboard KPIS={KPIS}/>
      <ChartsDashboard charts={Charts}/>
    </div>
  
  );
};

export default Dashboard;
