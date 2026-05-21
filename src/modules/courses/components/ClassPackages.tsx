"use client";

import { Button } from "@/modules/ui/button";
import { useRouter } from "next/navigation";

export default function ClassPackages() {
  const router = useRouter();

    return(
        <Button variant="gray" 
        onClick={() => router.push("/admin/class-packages")}
        >
            Class Packages</Button>
    )

}