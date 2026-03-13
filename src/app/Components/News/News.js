'use client'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Field, Form, Formik } from "formik";
import Cookies from "js-cookie";
import { useState } from "react";
import Swal from "sweetalert2";
import { useDeleteNews, useNews } from "./NewsQuery";

function News(){
    const queryClient = useQueryClient();
    const [editingNew, setEditingNew] = useState(null);
    const { data: news, isLoading, error } = useNews();
    const deleteMutation = useDeleteNews();
    const initialValues = editingNew || {
        author: "",
        description: "",
        imageFile: null,
    };

    const addNews=useMutation({
        mutationKey:["news"],
        mutationFn:async(values)=>{
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
        onSuccess:()=>{
            Swal.fire({
                title: "Success!",
                text: "News added successfully.",
                icon: "success",
            });
            queryClient.invalidateQueries(["news"]);
        },
        onError: () => {
            Swal.fire({
                title: "Error!",
                text: "Failed to add News.",
                icon: "error",
            });
        },
    })

    // update news
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
          Swal.fire({
            title: "Updated!",
            text: "News updated successfully.",
            icon: "success",
          });
          queryClient.invalidateQueries(["news"]);
        },
    
        onError: () => {
          Swal.fire({
            title: "Error!",
            text: "Failed to update News.",
            icon: "error",
          });
        },
      });

    //   submit form
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


    // DELETE PRODUCT
    const handleDelete = (id) => {
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Yes, delete it!",
          cancelButtonText: "Cancel",
        }).then((result) => {
          if (result.isConfirmed) {
            deleteMutation.mutate(id);
    
            Swal.fire("Deleted!", "Product has been deleted.", "success");
          }
        });
    };
    if (isLoading) return <h2 className="text-center mt-10 font-bold">Loading...</h2>;
    if (error) return <h2 className="text-center mt-10 font-bold text-red-500">Error loading Products</h2>;
    return (
        <>
            <div className="form w-full m-auto pr-4 pt-4">
                    <Formik
                      initialValues={initialValues}
                      enableReinitialize
                      onSubmit={onSubmit}
                    >
                      {({ setFieldValue }) => (
                        <Form className="flex flex-col gap-4 justify-center align-middle">
                          <h2 className="font-bold text-2xl">
                            {editingNew ? "Update Product" : "Create New Product"}
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
                            className="bg-blue-200 p-2 rounded-md cursor-pointer font-bold"
                          >
                            {editingNew ? "Update News" : "Create New News"}
                          </button>
            
                        </Form>
            
                      )}
                    </Formik>
                  </div>
                  <h2 className="font-bold text-2xl pt-4">All Products</h2>
                  <div className="table-wrapper w-full p-4 pl-0 ">
                        <table className="w-full p-4 border border-gray-300">
                        <thead className="bg-blue-100">
                            <tr>
                            <th className="p-2">Image</th>
                            <th className="p-2">Auth</th>
                            <th className="p-2">Description</th>
                            <th className="p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-md text-gray-600 font-bold text-center">
                            {news.length > 0 ? (
                            news.map((news) => (
                                <tr key={news._id} className="hover:bg-gray-100">

                                <td className="p-2">
                                    <img
                                    src={news.image || "/no-image.png"}
                                    alt={news.author}
                                    className="m-auto"
                                    width={50}
                                    height={50}
                                    />
                                </td>
                                <td className="p-2">{news.author}</td>
                                <td className="p-2">{news.description}</td>
                                <td className="p-2 space-x-2">
                                    <button
                                    onClick={() => setEditingNew(news)}
                                    className="pt-2 pr-6 pb-2 pl-6 rounded bg-green-500 text-white cursor-pointer"
                                    >
                                    Edit
                                    </button>
                                    <button
                                    onClick={() => handleDelete(news._id)}
                                    className="pt-2 pr-6 pb-2 pl-6 rounded bg-red-600 text-white cursor-pointer"
                                    >
                                    Delete
                                    </button>
                                </td>
                                </tr>
                            ))
                            ) : (
                            <tr>
                                <td colSpan="7" className="border p-4">
                                No products found
                                </td>
                            </tr>
                            )}
                        </tbody>
                        </table>
                    </div>
        </>
    )
}
export default News;