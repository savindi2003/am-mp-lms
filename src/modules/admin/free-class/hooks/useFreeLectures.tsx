"use client";

import { useEffect, useState } from "react";

import {
  createFreeLecture,
  deleteFreeLecture,
  getFreeLectures,
  updateFreeLecture,
} from "../services/apiFreeClass";

export const useFreeLectures = () => {
  const [lectures, setLectures] = useState([]);

  const fetchLectures = async () => {
    try {
      const data = await getFreeLectures();

      setLectures(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchLectures();
  }, []);

  const createLecture = async (data: any) => {
    await createFreeLecture(data);

    await fetchLectures();
  };

  const updateLecture = async (
    id: number,
    data: any
  ) => {
    await updateFreeLecture(id, data);

    await fetchLectures();
  };

  const removeLecture = async (id: number) => {
    await deleteFreeLecture(id);

    await fetchLectures();
  };

  return {
    lectures,

    createLecture,
    updateLecture,
    removeLecture,
  };
};