import NewsletterForm from "@/components/forms/NewsletterForm";
import Banner from "@/components/sections/Banner";


export default function NewsletterPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Join our Newsletter</h1>
      <NewsletterForm />
    </div>
  );
}