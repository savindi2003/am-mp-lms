"use client";



import { useState } from "react";



export function useCreatePayment() {

  const [loading, setLoading] = useState(false);



  const createPayment = async (payload: any) => {

    setLoading(true);



    try {

      const res = await fetch("/api/backend/admin/payments", {

        method: "POST",

        headers: {

          "Content-Type": "application/json",

        },

        body: JSON.stringify(payload),

      });



      const data = await res.json();



      if (!res.ok) {

      console.log("API RESPONSE:", data);

       throw new Error(data?.error || data?.message || "Payment failed");

      }



      return data;

    } catch (err) {

      console.error(err);

      throw err;

    } finally {

      setLoading(false);

    }

  };



  return { createPayment, loading };

}



// "use client";

// import { useState } from "react";

// export function useCreatePayment() {
//   const [loading, setLoading] = useState(false);

//   const createPayment = async (payload: any) => {
//     setLoading(true);

//     try {
//       const res = await fetch("/api/backend/admin/payments", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//       console.log("API RESPONSE:", data);
//        throw new Error(data?.error || data?.message || "Payment failed");
       
//       }

//       return data;
//     } catch (err) {
//       console.error(err);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { createPayment, loading };
// }