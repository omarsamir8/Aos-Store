"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";

//  Get News
export const useNews = () => {
  const token = Cookies.get("token");

  return useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      const res = await axios.get("/api/news", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res)
      return res.data.news;
    },
  });
};

//  Delete New
export const useDeleteNews = () => {
  const queryClient = useQueryClient();
  const token = Cookies.get("token");

  return useMutation({
    mutationFn: async (id) => {
      await axios.delete(`/api/news/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },

    onSuccess: () => {
      // refresh
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
  });
};