import data from "../../data/chartData";
import React from "react";
import { Line, Bar, Pie, Doughnut } from "react-chartjs-2";
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
  defaults,
} from "chart.js";
import revenuData from "../../data/revenuData";
import { useTranslation } from "react-i18next";

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

defaults.maintainAspectRatio = false;
defaults.responsive = true;

defaults.plugins.title.display = true;
defaults.plugins.title.align = "start";
defaults.plugins.title.font.size = 20;
defaults.plugins.title.color = "var(--primary-text-color)";

const Chart = ({ view }) => {
  const { t } = useTranslation();

  const chartData = {
    labels:
      view === "line"
        ? revenuData.map((data) => data.label)
        : data.map((data) => t(data.label)),
    datasets:
      view === "line"
        ? [
            {
              label: t("Revenu"),
              data: revenuData.map((data) => data.revenue),
              backgroundColor: "#064FF0",
              borderColor: "#064FF0",
            },
            {
              label: t("Cost"),
              data: revenuData.map((data) => data.cost),
              backgroundColor: "#FF3030",
              borderColor: "#FF3030",
            },
          ]
        : [
            {
              label: t("Revenu"),
              data: data.map((data) => data.value),
              backgroundColor: [
                "rgba(43,63,229,0.8)",
                "rgba(250,192,19,0.8)",
                "rgba(253,135,135,0.8)",
              ],
              borderColor: [
                "rgba(43,63,229,0.8)",
                "rgba(250,192,19,0.8)",
                "rgba(253,135,135,0.8)",
              ],
            },
          ],
  };

  const renderChart = () => {
    switch (view) {
      case "line":
        return (
          <div className="dataChart">
            <Line
              data={chartData}
              options={{
                plugins: { title: { text: t("Monthly Revenu & Cost") } },
                elements: { line: { tension: 0.5 } },
              }}
            />
          </div>
        );
      case "bar":
        return (
          <div className="dataChart">
            <Bar
              data={chartData}
              options={{
                plugins: { title: { text: t("Revenu Source") } },
              }}
            />
          </div>
        );
      case "pie":
        return (
          <div className="dataChart">
            <Pie
              data={chartData}
              options={{
                plugins: { title: { text: t("Revenu Source") } },
              }}
            />
          </div>
        );
      case "dougnut":
        return (
          <div className="dataChart">
            <Doughnut
              data={chartData}
              options={{
                plugins: { title: { text: t("Revenu Source") } },
              }}
            />
          </div>
        );
      default:
        return (
          <div className="dataChart" style={{ width: "100%", height: "40rem" }}>
            <Line
              data={chartData}
              options={{
                plugins: { title: { text: t("Monthly Revenu & Cost") } },
                elements: { line: { tension: 0.5 } },
              }}
            />
          </div>
        );
    }
  };

  return renderChart();
};

export default Chart;
