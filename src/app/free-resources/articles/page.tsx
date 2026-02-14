import Image from "next/image";
import Link from "next/link";
import ArticlesSection from "@/components/sections/ArticlesSection";
import Banner from "@/components/sections/Banner";

export default function Articles() {
  return (
    <>
      <Banner
        title="Read/Download My Research Articles"
        description="Explore a comprehensive collection of my research publications, journal articles, and academic contributions available for reading and download."
        showLottie={true}
        lottieSrc="/lotties/articles.lottie"
      >
        <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex flex-wrap gap-4 w-full">
                <Link 
                    href="https://scholar.google.com.au/citations?user=lBBycJgAAAAJ&hl" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:scale-105 transition-transform"
                >
                    <Image 
                        src="/images/logos/googleScholar.webp" 
                        alt="Google Scholar" 
                        width={100} 
                        height={100} 
                        className=" object-cover animate-float"
                    />
                </Link>
                <Link 
                    href="https://orcid.org/0000-0002-0909-8476" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:scale-105 transition-transform"
                >
                    <Image 
                        src="/images/logos/orcid.png" 
                        alt="ORCID" 
                        width={100} 
                        height={100} 
                        className=" object-cover animate-float"
                    />
                </Link>
            </div>
        </div>
      </Banner>
      <section className="w-full mx-auto">

      <ArticlesSection />
      </section>
    </>
  );
}
