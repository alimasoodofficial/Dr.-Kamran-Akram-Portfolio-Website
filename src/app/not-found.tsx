import Banner from "@/components/sections/Banner";
import React from "react";

export default function Notfound() {
  return (
    <>
      <Banner
        title="404 - Page Not Found"
        description="The page you’re looking for doesn’t exist."
        showLottie={true}
        showImage={false}
        lottieSrc="/lotties/notfound.lottie"
        showBreadcrumb={false}
      />
    </>
  );
}
