"use client";

import { useEffect, useState } from "react";

import { getClassTypes } from "../services/apiFreeClass";

export const useClassTypes = () => {
  const [classTypes, setClassTypes] = useState([]);

  const fetchClassTypes = async () => {
    try {
      const data = await getClassTypes();

      setClassTypes(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchClassTypes();
  }, []);

  return {
    classTypes,
  };
};