import "../../app/globals.css";
import Image from "next/image";

export default function Hero() {
  return (
    // <section className="flex flex-col-reverse lg:flex-row-reverse items-center justify-between mx-auto px-4 sm:px-6 md:px-12 lg:px-16 py-10 md:py-16 lg:py-24 gap-10 max-w-7xl">

    //   {/* 🖋 Left Text Section */}
    //   <div className="flex-1 text-center lg:text-left space-y-2 sm:space-y-6">
    //     <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-[82px] font-bold leading-tight tracking-tight">
    //       Hey Friends{" "}
    //       <span className="animate-bounce inline-block align-middle">👋</span>
    //     </h1>

    //     <p className="font-body text-base sm:text-lg md:text-xl lg:text-2xl  leading-relaxed md:pr-10 lg:pr-16 xl:pr-20">
    //       I’m <span className="font-semibold">Kamran</span>. I’m a Doctor turned
    //       Entrepreneur, YouTuber, and the author of the New York Times bestseller,
    //       <span className="font-semibold text-orange-500">
    //         {" "}
    //         Feel-Good Productivity
    //       </span>
    //       .
    //     </p>
    //   </div>

    //   {/* 🖼️ Right Image Section */}
    //   <div className="flex-1 flex justify-center lg:justify-end">
    //     <Image
    //       src="https://imkamran.com/wp-content/uploads/2023/09/cropped-Kamran-Akram-logo.png"
    //       alt="kamran-akram"
    //       width={420}
    //       height={120}
    //       className="w-40 sm:w-60 md:w-72 lg:w-[420px] h-auto object-contain "
    //       priority
    //     />
    //   </div>
    // </section>
    <section className="flex flex-col  items-center justify-center mx-auto  max-w-7xl py-20 ">
      <div className="flex flex-col  items-center justify-center md:w-4/6 ">
        <h1 className="font-heading sm:text-start md:text-center  text-2xl md:text-6xl pb-2.5  font-bold leading-tight tracking-tight ">
         Turbocharge your brand. <br />
          Reach millions online
        </h1>
        <p className="font-body text-center text-base sm:text-lg md:text-xl lg:text-2xl  leading-relaxed ">
          I’m <span className="font-semibold">Kamran</span>. I’m a Doctor turned
          Entrepreneur, YouTuber, and the author of the New York Times
          bestseller,
          <span className="font-semibold text-purple-500">
            {" "}
            Feel-Good Productivity
          </span>
          .
        </p>
      </div>

      <div className=""></div>
    </section>
  );
}
