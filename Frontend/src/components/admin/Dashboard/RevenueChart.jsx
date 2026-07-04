import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { getRevenueChart } from "../../../services/reportService";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const rangeOptions = [
  { value: "today", label: "Today" },
  { value: "5d", label: "5 Days" },
  { value: "1m", label: "1 Month" },
  { value: "3m", label: "3 Months" },
  { value: "6m", label: "6 Months" },
  { value: "1y", label: "1 Year" },
  { value: "5y", label: "5 Years" },
  { value: "all", label: "All Time" },
];

const monthOptions = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const RevenueChart = () => {
  const [range, setRange] = useState("1m");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChart = async () => {
      setLoading(true);

      try {
        const data = await getRevenueChart(range, month, year);
        setAnalytics(data);
      } catch (error) {
        console.error("Error loading revenue chart:", error);
      } finally {
        setLoading(false);
      }
    };

    void loadChart();
  }, [range, month, year]);

  const years = Array.from(
    { length: 6 },
    (_, index) => new Date().getFullYear() - index,
  );

  const formatGrowth = (growth, previous, current) => {
    if (previous === 0 && current > 0) {
      return {
        text: "+100%",
        type: "up",
        icon: "↑",
      };
    }

    if (growth > 0) {
      return {
        text: `+${growth.toFixed(1)}%`,
        type: "up",
        icon: "↑",
      };
    }

    if (growth < 0) {
      return {
        text: `${growth.toFixed(1)}%`,
        type: "down",
        icon: "↓",
      };
    }

    return {
      text: "0%",
      type: "flat",
      icon: "→",
    };
  };


const growth = analytics
  ? formatGrowth(
      analytics.growth_percentage || 0,
      analytics.previous_revenue || 0,
      analytics.current_revenue || 0,
    )
  : { text: "0%", type: "flat", icon: "→" };
  
  return (
    <div className="card shadow-sm border-0 h-100">
      <div className="card-body">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <div>
            <h5 className="mb-1 fw-bold">Revenue Analytics</h5>
            <p className="text-muted small mb-0">
              Performance trends across your selected range
            </p>
          </div>

          <div className="d-flex flex-wrap gap-2">
            <select
              className="form-select form-select-sm"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
            >
              {monthOptions.map((name, index) => (
                <option key={name} value={index + 1}>
                  {name}
                </option>
              ))}
            </select>

            <select
              className="form-select form-select-sm"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            >
              {years.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="d-flex flex-wrap gap-2 mb-3">
          {rangeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`btn btn-sm ${range === option.value ? "btn-primary" : "btn-outline-secondary"}`}
              onClick={() => setRange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>

        {analytics?.labels?.length > 0 && (
          <div className="row g-2 mb-3">
            {[
              {
                label: "Revenue",
                value: `฿${Number(analytics.current_revenue || 0).toLocaleString()}`,
              },
              { label: "Orders", value: analytics.current_orders || 0 },
              { label: "Customers", value: analytics.current_customers || 0 },
              {
                label: "Avg Order",
                value: `฿${Number(analytics.average_order_value || 0).toLocaleString()}`,
              },
              {
                label: "Growth %",
                value: (
                  <span className={`growth-badge ${growth.type}`}>
                    <span className="me-1">{growth.icon}</span>
                    {growth.text}
                  </span>
                ),
              },
              {
                label: "Prev Revenue",
                value: `฿${Number(analytics.previous_revenue || 0).toLocaleString()}`,
              },
            ].map((item) => (
              <div className="col-md-4 col-xl-2" key={item.label}>
                <div className="dashboard-ghost p-2 rounded-3">
                  <small className="text-muted d-block">{item.label}</small>
                  <strong className="fs-6">{item.value}</strong>
                </div>
              </div>
            ))}
          </div>
        )}

        {loading ? (
          <div className="text-center py-5 text-muted">
            Loading revenue analytics...
          </div>
        ) : !analytics || analytics.labels.length === 0 ? (
          <div className="text-center py-5 text-muted">
            No revenue data found for this period.
          </div>
        ) : (
          <div style={{ height: "320px" }}>
            <Line
              data={{
                labels: analytics.labels,
                datasets: [
                  {
                    label: "Revenue (฿)",
                    data: analytics.data,
                    borderColor: "#2563eb",
                    backgroundColor: "rgba(37, 99, 235, 0.16)",
                    borderWidth: 3,
                    tension: 0.35,
                    fill: true,
                    pointRadius: 3,
                    pointHoverRadius: 6,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                  mode: "index",
                  intersect: false,
                },
                plugins: {
                  legend: {
                    display: true,
                    labels: {
                      usePointStyle: true,
                    },
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) =>
                        `฿${Number(context.parsed.y).toLocaleString()}`,
                    },
                  },
                },
                scales: {
                  x: {
                    grid: {
                      display: false,
                    },
                  },
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value) => `฿${Number(value).toLocaleString()}`,
                    },
                  },
                },
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default RevenueChart;
