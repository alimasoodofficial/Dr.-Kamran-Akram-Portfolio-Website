import Hero from "@/components/sections/Hero";
import Button from "@/components/ui/Button";


export default function HomePage() {
  return (
    <div>
      <Hero />
      <h2 className="text-4xl font-bold mt-8">I am Kamran Akram!</h2>
      <p>This is the HomePage page of my Next.js website.</p>
      <Button title={"click here"} href="/gallery" />
      
    </div>
  );
}
