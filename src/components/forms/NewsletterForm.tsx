"use client";
import { useState, FormEvent, ChangeEvent } from "react";
import Button from "../ui/Button";

export default function NewsletterForm() {
  const [email, setEmail] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert(`Subscribed with: ${email}`);
    setEmail("");
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={handleChange}
        required
        className="border p-2 rounded flex-1"
      />
      <Button title="click here" href="/" />
    </form>
  );
}
