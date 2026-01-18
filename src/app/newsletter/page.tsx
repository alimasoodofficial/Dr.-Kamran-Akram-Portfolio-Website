import SubscribeForm from "@/components/forms/SubscribeForm";
import Banner from "@/components/sections/Banner";


export default function NewsletterPage() {
  return (
          <>


          <div className="min-h-screen pb-20">
            <Banner
              title="Newsletter"
              description="Stay updated with the latest insights and tech trends."
               gradientColors={["#0b42f5ff", "#7ebcf6ff"]} 
              showImage={false}
              className="w-auto h-100px "
            />
            <div className="flex justify-center items-center mt-12 w-full px-4">
                 <SubscribeForm />    
            </div>
            
          </div>


          </>
        
   
  );
}