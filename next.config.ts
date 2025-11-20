/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imkamran.com", // 👈 allow your domain
      },
      {
        protocol: "https",
        hostname: "rqrnzfuvgmnjkjqaahve.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
