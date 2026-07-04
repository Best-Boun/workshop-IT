// import DashboardHeader from "../../components/admin/Dashboard/DashboardHeader";
import StatsCards from "../../components/admin/Dashboard/StatsCards";
import RevenueChart from "../../components/admin/Dashboard/RevenueChart";
import LatestOrders from "../../components/admin/Dashboard/LatestOrders";
import TopProducts from "../../components/admin/Dashboard/TopProducts";
import LowStock from "../../components/admin/Dashboard/LowStock";
import QuickActions from "../../components/admin/Dashboard/QuickActions";
import ReportsPage from "./ReportsPage";



const Dashboard = () => {
  return (
    <div className="dashboard-page">
      {/* <DashboardHeader /> */}

      <StatsCards />

      <div className="row mt-4">
        <div className="col-lg-8">
          <RevenueChart />
        </div>

        <div className="col-lg-4">
          <LatestOrders />
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-lg-6">
          <TopProducts />
        </div>

        <div className="col-lg-6">
          <LowStock />
        </div>
      </div>

      <QuickActions />

      <div className="mt-4">
        <ReportsPage />
      </div>
    </div>
  );
};

export default Dashboard;
