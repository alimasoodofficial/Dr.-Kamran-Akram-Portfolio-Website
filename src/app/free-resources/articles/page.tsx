import Banner from "@/components/sections/Banner";
import ArticleBook from "@/components/ui/ArticleBook";
import BookCard from "@/components/ui/BookCard";
import Image from "next/image";

export default function articles() {
  const articles = [
    {
      title: "The Future of React",
      category: "Engineering",
      summary: "Server Components have fundamentally changed how we architect web applications. In this deep dive, we explore the mental model shift required to master modern React patterns.",
      imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000&auto=format&fit=crop",
      author: "Dan Abramov",
      issue: "42"
    },
    {
      title: "Design Systems 101",
      category: "UX/UI",
      summary: "Atomic design is dead. Long live composite component patterns. Learn how to build scalable design systems that your developers will actually love using.",
      imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1000&auto=format&fit=crop",
      author: "Sarah Drasner",
      issue: "12",
      readTime: "8 min"
    },
    {
      title: "AI in Production",
      category: "Machine Learning",
      summary: "Deploying LLMs is easy. Keeping them cost-effective and strictly typed is hard. Here is our battle-tested architecture for enterprise AI integration.",
      imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop",
      author: "Andrej K.",
      issue: "99"
    },
    {
      title: "The Future of React",
      category: "Engineering",
      summary: "Server Components have fundamentally changed how we architect web applications. In this deep dive, we explore the mental model shift required to master modern React patterns.",
      imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000&auto=format&fit=crop",
      author: "Dan Abramov",
      issue: "42"
    },
    {
      title: "Design Systems 101",
      category: "UX/UI",
      summary: "Atomic design is dead. Long live composite component patterns. Learn how to build scalable design systems that your developers will actually love using.",
      imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1000&auto=format&fit=crop",
      author: "Sarah Drasner",
      issue: "12",
      readTime: "8 min"
    },
    {
      title: "AI in Production",
      category: "Machine Learning",
      summary: "Deploying LLMs is easy. Keeping them cost-effective and strictly typed is hard. Here is our battle-tested architecture for enterprise AI integration.",
      imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop",
      author: "Andrej K.",
      issue: "99"
    }
  ];
  return (
    <section>
      <Banner
        title="Read/Download My Research Articles"
        showLottie={true}
        lottieSrc="/lotties/articles.lottie"
      />

      

      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-8">
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


      </div> */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16  md:w-9/12 mx-auto md:ps-20 py-16">
        {articles.map((article, index) => (
          <ArticleBook
            key={index}
            title={article.title}
            category={article.category}
            summary={article.summary}
            imageUrl={article.imageUrl}
            author={article.author}
            issueNumber={article.issue}
            readTime={article.readTime}
          />
        ))}
      </div>
    </section>
  );
}
