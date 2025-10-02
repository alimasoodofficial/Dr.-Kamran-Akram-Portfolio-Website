export default function Card({ title, description }) {
  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h3 className="font-bold">{title}</h3>
      <p>{description}</p>
    </div>
  );
}