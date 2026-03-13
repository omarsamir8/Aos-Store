'use client'
import { useDispatch, useSelector } from "react-redux";
import { useProducts } from "../Products/ProductQuery";
import { useEffect } from "react";
import { fetchUsers } from "@/app/features/Users/usersSlice";
import { useNews } from "../News/NewsQuery";
import ProductChart from "../ProductChart/ProductChart";
import AnalyticsPie from "../ProductChart/AnalyticsPie";

function Main(){
    const dispatch = useDispatch();
    const { data: products} = useProducts();
    const { data: news} = useNews();
    const { users} = useSelector((state) => state.users);
    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);
    return (
        <>
        <h2 className="text-xl font-serif mt-4">Initial Analysis</h2>
        <div className="flex justify-evenly mt-4 pr-4 ">
            <div className="min-w-1/5 flex gap-4 bg-amber-100 justify-center items-center pt-4 pb-4 rounded">
                <div className="bg-amber-300 text-2xl w-10 flex justify-center items-center rounded pt-1">U</div>
                <div className="">
                    <h2 className="font-bold text-md">Users</h2>
                    <h5 className="font-bold text-gray-500">{users?.length} ❤️</h5>
                </div>
            </div>
            <div className="min-w-1/5 flex gap-4 bg-blue-100 justify-center items-center pt-4 pb-4 rounded">
                <div className="bg-amber-300 text-2xl w-10 flex justify-center items-center rounded pt-1">P</div>
                <div className="">
                    <h2 className="font-bold text-md">Products</h2>
                    <h5 className="font-bold text-gray-500">{products?.length} 🚀</h5>
                </div>
            </div>
            <div className="min-w-1/5 flex gap-4 bg-red-300 justify-center items-center pt-4 pb-4 rounded">
                <div className="bg-amber-300 text-2xl w-10 flex justify-center items-center rounded pt-1">O</div>
                <div className="">
                    <h2 className="font-bold text-md">Orders</h2>
                    <h5 className="font-bold text-gray-500">21 🎉</h5>
                </div>
            </div>
            <div className="min-w-1/5 flex gap-4 bg-green-300 justify-center items-center pt-4 pb-4 rounded">
                <div className="bg-amber-300 text-2xl w-10 flex justify-center items-center rounded pt-1">N</div>
                <div className="">
                    <h2 className="font-bold text-md">News</h2>
                    <h5 className="font-bold text-gray-500">{news?.length} 😊</h5>
                </div>
            </div>
        </div>
        <div className="mt-8">
            <AnalyticsPie />
            <ProductChart/>
        </div>
        </>
    )
}
export default Main;