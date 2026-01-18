import Image from "next/image";
import ArticlesSection from "@/components/sections/ArticlesSection";
import Banner from "@/components/sections/Banner";

export default function Articles() {
  return (
    <>
      <Banner
        title="Read/Download My Research Articles"
        showLottie={true}
        lottieSrc="/lotties/articles.lottie"
      >
        <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex flex-wrap gap-4 w-full">
                <Image 
                    src="/images/logos/googleScholar.webp" 
                    alt="CSIRO" 
                    width={150} 
                    height={150} 
                    className=" object-cover"
                />
                 <Image 
                    src="/images/logos/orcid.png" 
                    alt="University of Queensland" 
                    width={150} 
                    height={150} 
                    className=" object-cover"
                />
            </div>
           
        </div>
      </Banner>
      <ArticlesSection />
    </>
  );
}
