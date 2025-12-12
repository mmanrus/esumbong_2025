"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import clsx from "clsx";

export default function Page() {
  const [title, setTitle] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log({ title, feedback });

    // You can send data to API here
  };

  return (
    <>
      <h2 className="text-3xl font-bold mb-4">Submit Feedback</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 md:p-8 rounded-xl shadow-md space-y-4"
      >
        {/* Title */}
        <div>
          <label className="block font-medium mb-2 text-lg">Title</label>
          <Input
            type="text"
            placeholder="e.g., Suggest more lights in park"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-3 text-base"
          />
        </div>

        {/* Feedback */}
        <div>
          <label className="block font-medium mb-2 text-lg">Feedback</label>
          <Textarea
            rows={5}
            placeholder="Share your suggestions..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="p-3 text-base"
          />
        </div>

        
        <div className="flex justify-center">
          <Button
            type="submit"
            className={clsx(`bg-green-600 text-white px-6 py-3 
            rounded-md hover:bg-green-700 text-lg
            font-semibold transition cursor-pointer`, loading && ("bg-green-950"))}
            disabled={loading}
          >
            <span>{loading ? "Submitting..." : "Send Feedback"}</span>
          </Button>
        </div>
      </form>
    </>
  );
}
