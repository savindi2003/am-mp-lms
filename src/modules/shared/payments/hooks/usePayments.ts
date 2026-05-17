import { useEffect, useState } from "react";
import { getPayments } from "../services/apiPayments";

export function usePayments(month: string, page: number = 1) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getPayments({ month, page });
      setData(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [month, page]);

  return { data, loading, load };
}