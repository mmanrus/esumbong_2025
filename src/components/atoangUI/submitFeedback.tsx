
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import clsx from "clsx";

export default function SubmitFeedbackPage() {
  const [title, setTitle] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log({ title, feedback });
    
    // You can send data to API here
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
          <MessageSquare className="h-7 w-7 text-primary" />
          Submit Feedback
        </h1>
        <p className="text-muted-foreground mt-1">
          Share your thoughts and suggestions with us
        </p>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Feedback Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="e.g., Suggestion for better service"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>


            <div className="space-y-2">
              <Label htmlFor="message">Your Feedback</Label>
              <Textarea
                id="message"
                placeholder="Share your feedback, suggestions, or comments..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={6}
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit Feedback"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
