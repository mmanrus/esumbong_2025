"use client";

import { useState } from "react";
import { CategoryDialog } from "@/components/atoangUI/forms/categoryForm";

export default function Page() {
  const [categoryName, setCategoryName] = useState<string>("");

  const [categoryDescription, setCategoryDescription] = useState<string>("");
  return (
    <>
      <div>Create Category Page</div>
      <CategoryDialog/>
    </>
  );
}
