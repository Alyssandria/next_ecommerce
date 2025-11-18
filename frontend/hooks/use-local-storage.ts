"use client";
import { toast } from "sonner"

export const useLocalStorage = () => {

  const getItem = (value: string) => {
    try {
      const item = window.localStorage.getItem(value);
      return item;
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong, please try again later!");
      return;
    }
  }

  const setItem = (key: string, value: string) => {
    try {
      window.localStorage.setItem(key, value);
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong, please try again later!");
      return;
    }
  }

  const deleteItem = (key: string) => {
    try {
      window.localStorage.removeItem(key);
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong, please try again later!");
      return;
    }
  }

  return { getItem, setItem, deleteItem };
}
