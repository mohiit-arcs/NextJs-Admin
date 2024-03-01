"use client";
import { redirect } from "next/navigation";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    return redirect("/login");
  }, []);
};

export default Index;
