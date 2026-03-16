"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Field, Form, Formik } from "formik";
import Cookies from "js-cookie";
import { useState } from "react";
import Swal from "sweetalert2";
import { useDeleteNews, useNews } from "./NewsQuery";
import Loading from "../Loader/Loader";

function News() {

  const queryClient = useQueryClient();
  const [editingNew, setEditingNew] = useState(null);

  const { data: news = [], isLoading, error } = useNews();

  const deleteMutation = useDeleteNews();

  const initialValues = editingNew || {
    author: "",
    description: "",
    imageFile: null,
  };

  // CREATE NEWS
  const addNews = useMutation({
    mutationFn: async (values) => {

      const token = Cookies.get("token");

      const formData = new FormData();
      formData.append("author", values.author);
      formData.append("description", values.description);
      formData.append("image", values.imageFile);

      const res = await axios.post("/api/news", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    },

    onSuccess: () => {

      Swal.fire("Success!", "News added successfully.", "success");

      queryClient.invalidateQueries(["news"]);

    },

    onError: () => {

      Swal.fire("Error!", "Failed to add News.", "error");

    },
  });

  // UPDATE NEWS
  const updateNews = useMutation({
    mutationFn: async ({ id, values }) => {

      const token = Cookies.get("token");

      const formData = new FormData();
      formData.append("author", values.author);
      formData.append("description", values.description);

      if (values.imageFile) {
        formData.append("image", values.imageFile);
      }

      const res = await axios.put(`/api/news/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    },

    onSuccess: () => {

      Swal.fire("Updated!", "News updated successfully.", "success");

      queryClient.invalidateQueries(["news"]);

    },

    onError: () => {

      Swal.fire("Error!", "Failed to update News.", "error");

    },
  });

  // SUBMIT FORM
  const onSubmit = (values, { resetForm }) => {

    if (editingNew) {

      updateNews.mutate(
        { id: editingNew._id, values },
        {
          onSuccess: () => {
            resetForm();
            setEditingNew(null);
          },
        }
      );

    } else {

      addNews.mutate(values, {
        onSuccess: () => {
          resetForm();
        },
      });

    }

  };

  // DELETE NEWS
  const handleDelete = (id) => {

    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
    }).then((result) => {

      if (result.isConfirmed) {

        deleteMutation.mutate(id, {
          onSuccess: () => {
            Swal.fire("Deleted!", "News has been deleted.", "success");
          },
        });

      }

    });

  };

  if (isLoading)
    return <h2 className="text-center mt-10 font-bold">Loading...</h2>;

  if (error)
    return (
      <h2 className="text-center mt-10 font-bold text-red-500">
        Error loading News
      </h2>
    );

  return (
    <>
      {(addNews.isPending || updateNews.isPending || deleteMutation.isPending) && (
        <Loading/>
      )}

      <div className="form w-full m-auto pr-4 pt-4">
        <Formik
          initialValues={initialValues}
          enableReinitialize
          onSubmit={onSubmit}
        >
          {({ setFieldValue }) => (
            <Form className="flex flex-col gap-4">
              <h2 className="font-bold text-2xl">
                {editingNew ? "Update News" : "Create New News"}
              </h2>
              <Field
                name="author"
                type="text"
                placeholder="News Author"
                className="bg-blue-100 p-2 rounded-md"
              />
              <Field
                name="description"
                type="text"
                placeholder="News Description"
                className="bg-blue-100 p-2 rounded-md"
              />
              <input
                type="file"
                className="bg-blue-100 p-2 rounded-md"
                onChange={(e) => {
                  setFieldValue("imageFile", e.currentTarget.files[0]);
                }}
              />
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded-md flex justify-center items-center gap-2"
              >
                {(addNews.isPending || updateNews.isPending) ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  editingNew ? "Update News" : "Create New News"
                )}
              </button>
            </Form>
          )}
        </Formik>
      </div>

      <h2 className="font-bold text-2xl pt-4">All News</h2>
      <div className="table-wrapper w-full p-4 pl-0">
        <table className="w-full border border-gray-300">
          <thead className="bg-blue-100">
            <tr>
              <th className="p-2">Image</th>
              <th className="p-2">Author</th>
              <th className="p-2">Description</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody className="text-md text-gray-600 font-bold text-center">
            {news.length > 0 ? (
              news.map((item) => (
                <tr key={item._id} className="hover:bg-gray-100">
                  <td className="p-2">
                    <img
                      src={item.image || "/no-image.png"}
                      alt={item.author}
                      className="m-auto"
                      width={50}
                      height={50}
                    />
                  </td>
                  <td className="p-2">{item.author}</td>
                  <td className="p-2">{item.description}</td>
                  <td className="p-2 flex gap-2 space-x-2">
                    <button
                      onClick={() => setEditingNew(item)}
                      className="px-6 py-2 rounded bg-green-500 text-white cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="px-6 py-2 cursor-pointer rounded bg-red-600 text-white flex items-center gap-2 justify-center"
                    >
                      {deleteMutation.isPending ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        "Delete"
                      )}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-4">
                  No News found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default News;