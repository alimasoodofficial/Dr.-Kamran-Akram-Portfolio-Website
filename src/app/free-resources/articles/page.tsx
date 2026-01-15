import ArticlesSection from "@/components/sections/ArticlesSection";
import Banner from "@/components/sections/Banner";

export default function Articles() {
  return (
    <>
      <Banner
        title="Read/Download My Research Articles"
        showLottie={true}
        lottieSrc="/lotties/articles.lottie"
      />
      <ArticlesSection />
    </>
  );
}
