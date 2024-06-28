import React from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Chart = ({ data, view }) => {
  const chartData = {
    labels: data?.map((item) => item.date),
    datasets: [
      {
        label: "Data",
        data: data.map((item) => item.value),
        fill: false,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  };

  const renderChart = () => {
    switch (view) {
      case "line":
        return <Line data={chartData} />;
      case "bar":
        return <Bar data={chartData} />;
      case "pie":
        return <Pie data={chartData} />;
      default:
        return <Line data={chartData} />;
    }
  };

  return renderChart();
};

export default Chart;
