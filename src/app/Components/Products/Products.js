"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Field, Form, Formik } from "formik";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { useDeleteProduct, useProducts } from "./ProductQuery";

function Products() {
  const queryClient = useQueryClient();
  const { data: products, isLoading, error } = useProducts();
  const deleteMutation = useDeleteProduct();
  const [editingProduct, setEditingProduct] = useState(null);

  const initialValues = editingProduct || {
    name: "",
    description: "",
    price: "",
    priceBeforeSale: "",
    brand: "",
    category: "",
    imageFile: null,
  };

  // CREATE PRODUCT
  const addProduct = useMutation({
    mutationFn: async (values) => {
      const token = Cookies.get("token");
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("price", values.price);
      formData.append("priceBeforeSale", values.priceBeforeSale);
      formData.append("brand", values.brand);
      formData.append("category", values.category);
      formData.append("image", values.imageFile);

      const res = await axios.post("/api/product", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    },

    onSuccess: () => {
      Swal.fire({
        title: "Success!",
        text: "Product added successfully.",
        icon: "success",
      });
      queryClient.invalidateQueries(["products"]);
    },

    onError: () => {
      Swal.fire({
        title: "Error!",
        text: "Failed to add product.",
        icon: "error",
      });
    },
  });

  // UPDATE PRODUCT
  const updateProduct = useMutation({
    mutationFn: async ({ id, values }) => {

      const token = Cookies.get("token");

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("price", values.price);
      formData.append("priceBeforeSale", values.priceBeforeSale);
      formData.append("brand", values.brand);
      formData.append("category", values.category);

      if (values.imageFile) {
        formData.append("image", values.imageFile);
      }

      const res = await axios.put(`/api/product/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    },

    onSuccess: () => {
      Swal.fire({
        title: "Updated!",
        text: "Product updated successfully.",
        icon: "success",
      });
      queryClient.invalidateQueries(["products"]);
    },

    onError: () => {
      Swal.fire({
        title: "Error!",
        text: "Failed to update product.",
        icon: "error",
      });
    },
  });

  const onSubmit = (values, { resetForm }) => {

    if (editingProduct) {

      updateProduct.mutate(
        { id: editingProduct._id, values },
        {
          onSuccess: () => {
            resetForm();
            setEditingProduct(null);
          },
        }
      );

    } else {

      addProduct.mutate(values, {
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

  if (isLoading) return <h2 className="text-center mt-10">Loading...</h2>;
  if (error) return <h2 className="text-center mt-10 text-red-500">Error loading Products</h2>;

  return (
    <div>
      <div className="form w-full m-auto pr-4 pt-4">
        <Formik
          initialValues={initialValues}
          enableReinitialize
          onSubmit={onSubmit}
        >
          {({ setFieldValue }) => (
            <Form className="flex flex-col gap-4 justify-center align-middle">
              <h2 className="font-bold text-2xl">
                {editingProduct ? "Update Product" : "Create New Product"}
              </h2>

              <Field
                name="name"
                type="text"
                placeholder="Product Name"
                className="bg-blue-100 p-2 rounded-md"
              />
              <Field
                name="description"
                type="text"
                placeholder="Product description"
                className="bg-blue-100 p-2 rounded-md"
              />
              <Field
                name="price"
                type="text"
                placeholder="Product price"
                className="bg-blue-100 p-2 rounded-md"
              />

              <Field
                name="priceBeforeSale"
                type="text"
                placeholder="Product price Before Sale"
                className="bg-blue-100 p-2 rounded-md"
              />
              <Field
                name="brand"
                type="text"
                placeholder="Product brand"
                className="bg-blue-100 p-2 rounded-md"
              />
              <Field
                name="category"
                type="text"
                placeholder="Product category"
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
                {editingProduct ? "Update Product" : "Create New Product"}
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
              <th className="p-2">Name</th>
              <th className="p-2">Brand</th>
              <th className="p-2">Category</th>
              <th className="p-2">Price</th>
              <th className="p-2">Price Before Sale</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody className="text-md text-gray-600 font-bold text-center">
            {products.length > 0 ? (
              products.map((p) => (
                <tr key={p._id} className="hover:bg-gray-100">

                  <td className="p-2">
                    <img
                      src={p.image || "/no-image.png"}
                      alt={p.name}
                      className="m-auto"
                      width={50}
                      height={50}
                    />
                  </td>
                  <td className="p-2">{p.name}</td>
                  <td className="p-2">{p.brand}</td>
                  <td className="p-2">{p.category}</td>
                  <td className="p-2">${p.price}</td>
                  <td className="p-2">
                    <del className="text-red-600">
                      ${p.priceBeforeSale}
                    </del>
                  </td>
                  <td className="p-2 space-x-2">
                    <button
                      onClick={() => setEditingProduct(p)}
                      className="pt-2 pr-6 pb-2 pl-6 rounded bg-green-500 text-white cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
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
    </div>
  );
}

export default Products;