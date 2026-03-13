"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, deleteUser } from "./usersSlice";
import Swal from "sweetalert2";

export default function UsersPage() {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

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
        dispatch(deleteUser(id));
        Swal.fire("Deleted!", "User has been deleted.", "success");
      }
    });
  };

  if (loading) return <h2 className="text-center mt-10">Loading...</h2>;
  if (error) return <h2 className="text-center mt-10 text-red-500">{error}</h2>;

  return (
    <div className="p-4 pl-0">
      <h1 className="text-2xl font-bold mb-4">All Users List</h1>

      <div className="overflow-x-auto">
        <table className="w-full  border border-gray-300 rounded-lg text-center">
          <thead className="bg-blue-100">
            <tr>
              <th className="py-2">Name</th>
              <th className="py-2">Email</th>
              <th className="py-2">Role</th>
              <th className="py-2">Created At</th>
              <th className="py-2">Updated At</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-md font-bold">
            {users?.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.role}</td>
                <td className="px-4 py-2">{new Date(user.createdAt).toLocaleString()}</td>
                <td className="px-4 py-2">{new Date(user.updatedAt).toLocaleString()}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="bg-red-600 hover:bg-red-600 text-white px-3 py-1 rounded cursor-pointer"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}