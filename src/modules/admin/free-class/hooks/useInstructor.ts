"use client";

import { useEffect, useState } from "react";

import { getInstructors } from "../services/apiFreeClass";

export const useInstructors = () => {
  const [instructors, setInstructors] = useState([]);

  const fetchInstructors = async () => {
    try {
      const data = await getInstructors();

      setInstructors(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, []);

  return {
    instructors,
  };
};