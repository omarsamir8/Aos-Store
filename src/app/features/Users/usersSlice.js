"use client";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";


export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async () => {
    const token = Cookies.get("token"); 
    const res = await axios.get("/api/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  }
);


export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id) => {
    const token = Cookies.get("token");

    await axios.delete(`/api/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return id;
  }
);

export const usersSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(deleteUser.fulfilled, (state, action) => {
       state.users = state.users.filter((user) => user._id !== action.payload);
      });
  },
});

export default usersSlice.reducer;