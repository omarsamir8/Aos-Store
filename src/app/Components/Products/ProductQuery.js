"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";

//  Get Products
export const useProducts = () => {
  const token = Cookies.get("token");

  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axios.get("/api/product", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res)
      return res.data;
    },
  });
};

//  Delete User
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const token = Cookies.get("token");

  return useMutation({
    mutationFn: async (id) => {
      await axios.delete(`/api/product/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },

    onSuccess: () => {
      // refresh
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};