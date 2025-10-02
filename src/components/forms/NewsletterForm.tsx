"use client";
import { useState } from "react";
import Button from "../ui/Button";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");

  function handleSubmit(e:any) {
    e.preventDefault();
    alert(`Subscribed with: ${email}`);
    setEmail("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="border p-2 rounded flex-1"
      />
      <Button title={"click here"} href="/" />
    </form>
  );
}
