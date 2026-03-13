'use client'
import { useState } from "react";
import Sidebar from "../Components/Sidebar/Sidebar";
import Main from "../Components/Main/Main";
import Products from "../Components/Products/Products";
import Orders from "../Components/Orders/Orders";
import News from "../Components/News/News";
import UsersPage from "../features/Users/Users";

function Dashboard(){

  const [selected,setSelected] = useState("main");

  return (
    <div className="flex gap-5">

      <div className="w-1/6">
        <Sidebar selected={selected} setSelected={setSelected}/>
      </div>

      <div className="w-5/6">

        {selected==="main" && <Main/>}
        {selected==="users" && <UsersPage/>}
        {selected==="products" && <Products/>}
        {selected==="orders" && <Orders/>}
        {selected==="news" && <News/>}

      </div>

    </div>
  )
}

export default Dashboard;