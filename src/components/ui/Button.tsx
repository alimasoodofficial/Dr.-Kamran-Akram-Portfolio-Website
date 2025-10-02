import Link from "next/link";

type ButtonProps = {
  title: string;
  href: string; // page path
};


export default function Button({ title, href }: ButtonProps) {
  return (
    <Link href={href}>
      <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        {title}
      </button>
    </Link>
  );
}