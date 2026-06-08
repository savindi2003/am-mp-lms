"use client";

import AccessForm from "@/modules/admin/access/components/AccessForm";
import AccessTable from "@/modules/admin/access/components/AccessTable";
import { useState } from "react";

export default function AdminAccessControll(){

  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1); 
  };


    return(

      <section className="container mx-auto px-4 md:px-0 lg:px-0">

            <div className="mb-6">
            <h1 className="my-5 text-3xl font-semibold text-slate-800">Access Controll</h1>
            </div>

            <AccessForm onSuccess={handleSuccess}/>
            <AccessTable refreshKey={refreshKey}/>

        </section>

    )
}