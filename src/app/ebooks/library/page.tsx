import Banner from "@/components/sections/Banner";
import LibraryClient from "./LibraryClient";

export const metadata = {
  title: "My Library - Dr. Muhammad Kamran",
  description: "Verify your email to access your library of purchased eBooks and publications.",
};

export default function LibraryPage() {
  return (
    <div className="min-h-screen pb-24 bg-transparent">
      <Banner
        title="My E-Book Library"
        description="Verify your email to access your library of purchased technical publications. Read directly in our secure interactive 3D flipbook viewer."
        imageSrc="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1470&auto=format&fit=crop"
        imageAlt="Library Banner Illustration"
        showImage={true}
        showBreadcrumb={true}
        className="rounded-3xl shadow-2xl border-4 border-white/20 dark:border-white/5 object-cover h-64 md:h-80 w-full"
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <LibraryClient />
      </main>
    </div>
  );
}
