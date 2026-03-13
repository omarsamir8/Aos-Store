"use client";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { useProducts } from "../Products/ProductQuery";
import { useNews } from "../News/NewsQuery";
import { fetchUsers } from "@/app/features/Users/usersSlice";
import { useEffect } from "react";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AnalyticsPie() {
    const dispatch = useDispatch();
    const { data: products} = useProducts();
    const { data: news} = useNews();
    const { users} = useSelector((state) => state.users);
    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

  const data = {
    labels: ["Users", "Products", "Orders", "News"],
    datasets: [
      {
        label: "System Analytics",
        data: [users?.length, products?.length,5,news?.length],
        backgroundColor: [
          "#36A2EB",
          "#FF6384",
          "#FFCE56",
          "#4BC0C0"
        ],
        borderWidth: 1
      }
    ]
  };

  return (
    <div style={{ width: "400px", margin: "auto" }}>
      <Pie data={data} />
    </div>
  );
}