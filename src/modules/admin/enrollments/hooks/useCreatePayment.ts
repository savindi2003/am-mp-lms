export function useCreatePayment() {
    const createPayment = async (data : any) => {
        const res = await fetch("/api/admin/backend/payments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        return res.json();
    }
    return { createPayment };
}