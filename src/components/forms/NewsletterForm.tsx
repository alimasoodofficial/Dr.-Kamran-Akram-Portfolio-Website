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
        className=" px-12 py-4    w-full sm:flex-1 text-base focus:outline-none focus:ring-2 focus:ring-black-200
        backdrop-blur-xl backdrop-saturate-150
      card
      border
      rounded-full
      shadow-[0_0_20px_rgba(0,0,0,0.25)]
      transition-all duration-500
        "
      />
      <Button
        type="submit"
        className="btn-gradient text-white px-8 py-3 rounded font-medium  transition w-full sm:w-auto"
      >
        Grow with Me!
      </Button>
    </form>
  );
}
