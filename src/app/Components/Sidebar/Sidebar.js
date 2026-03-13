'use client'

import Image from "next/image";
import { useRouter } from "next/navigation";
function Sidebar({selected,setSelected}){
const router = useRouter();
  return (
    <div className="flex">
      <div className="w-1/6 h-screen bg-blue-100 text-black flex flex-col justify-between p-5 font-bold fixed">

        <div>

          <div className="mb-10 flex gap-3 items-center">
            <Image src="/Assets/Aos-Logo.png" alt="Logo" width={60} height={60}/>
            <h2 className="text-xl">Aos Store (Dashboard)</h2>
          </div>

          <ul className="space-y-4">

            <li
            onClick={()=>setSelected("main")}
            className={`p-2 rounded cursor-pointer hover:bg-gray-100 ${selected==="main" && "bg-gray-100"}`}>
              Main Dashboard
            </li>

            <li
            onClick={()=>setSelected("users")}
            className={`p-2 rounded cursor-pointer hover:bg-gray-100 ${selected==="users" && "bg-gray-100"}`}>
              Users
            </li>

            <li
            onClick={()=>setSelected("products")}
            className={`p-2 rounded cursor-pointer hover:bg-gray-100 ${selected==="products" && "bg-gray-100"}`}>
              Products
            </li>

            <li
            onClick={()=>setSelected("orders")}
            className={`p-2 rounded cursor-pointer hover:bg-gray-100 ${selected==="orders" && "bg-gray-100"}`}>
              Orders
            </li>

            <li
            onClick={()=>setSelected("news")}
            className={`p-2 rounded cursor-pointer hover:bg-gray-100 ${selected==="news" && "bg-gray-100"}`}>
              News
            </li>

          </ul>

        </div>

        <button onClick={()=>{router.push("/LoginPage")}} className="w-full bg-red-500 hover:bg-red-600 p-2 cursor-pointer rounded">
          Logout
        </button>

      </div>
    </div>
  )
}

export default Sidebar;