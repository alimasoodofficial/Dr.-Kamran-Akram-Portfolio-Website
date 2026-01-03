import Banner from "@/components/sections/Banner";
import BookCard from "@/components/ui/BookCard";

export default function articles() {
  return (
    <section>
      <Banner
        title="Read/Download My Research Articles"
        showLottie={true}
        lottieSrc="/lotties/articles.lottie"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-8">
        <BookCard
          title="What Color Is Your Parachute"
          imageSrc="https://imkamran.com/wp-content/uploads/2025/01/article-1-1.png"
          width={360}
          height={480}
          coverColor="bg-[#2a1f50]"
          coverText="What Color Is Your Parachute"
          href="/"
          buttonText="Open course"
          openInNewTab={false}
        />
        <BookCard
          title="What Color Is Your Parachute"
          imageSrc="https://imkamran.com/wp-content/uploads/2025/01/article-1-1.png"
          width={360}
          height={480}
          coverColor="bg-[#2a1f50]"
          coverText="What Color Is Your Parachute"
          href="/"
          buttonText="Open course"
          openInNewTab={false}
        />
        <BookCard
          title="What Color Is Your Parachute"
          imageSrc="https://imkamran.com/wp-content/uploads/2025/01/article-1-1.png"
          width={360}
          height={480}
          coverColor="bg-[#2a1f50]"
          coverText="What Color Is Your Parachute"
          href="/"
          buttonText="Open course"
          openInNewTab={false}
        />
        <BookCard
          title="What Color Is Your Parachute"
          imageSrc="https://imkamran.com/wp-content/uploads/2025/01/article-1-1.png"
          width={360}
          height={480}
          coverColor="bg-[#2a1f50] "
          coverText="What Color Is Your Parachute"
          href="/"
          buttonText="Open course"
          openInNewTab={false}
        />
        <BookCard
          title="What Color Is Your Parachute"
          imageSrc="https://imkamran.com/wp-content/uploads/2025/01/article-1-1.png"
          width={360}
          height={480}
          coverColor="bg-[#2a1f50]"
          coverText="What Color Is Your Parachute"
          href="/"
          buttonText="Open course"
          openInNewTab={false}
        />
        <BookCard
          title="What Color Is Your Parachute"
          imageSrc="https://imkamran.com/wp-content/uploads/2025/01/article-1-1.png"
          width={360}
          height={480}
          coverColor="bg-[#2a1f50]"
          coverText="What Color Is Your Parachute"
          href="/"
          buttonText="Open course"
          openInNewTab={false}
        />
        <BookCard
          title="What Color Is Your Parachute"
          imageSrc="https://imkamran.com/wp-content/uploads/2025/01/article-1-1.png"
          width={360}
          height={480}
          coverColor="bg-[#2a1f50]"
          coverText="What Color Is Your Parachute"
          href="/"
          buttonText="Open course"
          openInNewTab={false}
        />


      </div>
    </section>
  );
}
