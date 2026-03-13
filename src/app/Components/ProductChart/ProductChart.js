// "use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ProductChart(props) {

  const data = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul"
    ],
    datasets: [
      {
        label: "Users per Month",
        data: [5, 8, 12, 6, 15, 10, 20],
        backgroundColor: "rgba(54, 162, 235, 0.6)"
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top"
      },
      title: {
        display: true,
        text: "Users Analytics"
      }
    }
  };

  return <Bar data={data} options={options} />;
}