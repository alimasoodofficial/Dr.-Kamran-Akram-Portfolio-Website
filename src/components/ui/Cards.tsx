type CardProps = {
  title: string;
  description: string;
};

export default function Card({ title, description }: CardProps) {
  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h3 className="font-bold">{title}</h3>
      <p>{description}</p>
    </div>
  );
}
