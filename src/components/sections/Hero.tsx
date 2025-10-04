import "../../app/globals.css";
import Image from "next/image";


export default function Hero() {
  return (
    <div className="  px-6 lg:px-12">
    <section className="flex flex-col-reverse lg:flex-row-reverse items-center justify-between  mx-auto px-6 md:px-12 lg:px-24 py-16 lg:py-24 gap-10 container-bg-color">

  {/* Left Text Section */}
  <div className="flex-1 text-center lg:text-left space-y-6">
    <h1 className="font-heading text-5xl md:text-6xl lg:text-[82px] font-bold leading-tight">
      Hey Friends 👋
    </h1>
    <p className="font-body text-lg md:text-xl lg:text-4xl pr-20 text-black">
      I’m Kamran. I’m a Doctor turned Entrepreneur, YouTuber, and the author of the 
      New York Times bestseller, <span className="font-semibold ">Feel-Good Productivity</span>.
    </p>
  </div>

  {/* Right Image Section */}
  <div className="flex-1 flex justify-center lg:justify-end">
    <img
      src="https://imkamran.com/wp-content/uploads/2023/09/cropped-Kamran-Akram-logo.png"
      alt="kamran-akram"
      className="w-64 md:w-80 lg:w-[420px] h-auto object-contain"
    />
  </div>
  
</section>

    </div>
  );
}
