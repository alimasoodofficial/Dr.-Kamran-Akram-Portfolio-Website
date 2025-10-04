"use client";
import { useState, FormEvent, ChangeEvent } from "react";
import Button from "../ui/Button";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert(`Subscribed with: ${email}`);
    setEmail("");
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-3 mt-4 w-full max-w-lg mx-auto "
    >
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={handleChange}
        required
        className="border p-3 rounded w-full sm:flex-1 text-base focus:outline-none focus:ring-2 focus:ring-black"
      />
      <Button
        type="submit"
        className="bg-black text-white px-6 py-3 rounded font-medium hover:bg-gray-900 transition w-full sm:w-auto"
      >
        Subscribe
      </Button>
    </form>
  );
}
