"use client";

import { Button } from "@/modules/ui/button";
import { useRouter } from "next/navigation";

export default function FreeClasses() {
  const router = useRouter();

    return(
        <Button variant="gray" className=""
        onClick={() => router.push("/admin/free-classes")}
        >
            Free Seminar</Button>
    )

}