"use client";

const images = [
  "https://images.pexels.com/photos/35823491/pexels-photo-35823491.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/35823490/pexels-photo-35823490.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/35823492/pexels-photo-35823492.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/35823493/pexels-photo-35823493.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/35823494/pexels-photo-35823494.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/35823495/pexels-photo-35823495.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/35823496/pexels-photo-35823496.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/35823497/pexels-photo-35823497.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/35823498/pexels-photo-35823498.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/35823499/pexels-photo-35823499.jpeg?auto=compress&cs=tinysrgb&w=400",
];

export default function ImageSphere() {
  const total = images.length;
  return (
    <div className="card-3d">
      {images.map((src, index) => {
        const rotate = (360 / total) * index;

        return (
          <div
            key={index}
            style={{
              transform: `translate(-50%, -50%) rotateY(${rotate}deg) translateZ(var(--radius))`,
              animationDelay: `-${index * 2}s`,
            }}
          >
            <img src={src} alt={`image-${index}`} />
          </div>
        );
      })}
    </div>
  );
}
