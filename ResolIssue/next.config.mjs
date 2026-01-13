/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactStrictMode:true,
  images:{
    remotePatterns:[
      {
        protocol:"https",
        hostname:"res.cloudinary.com",
      },
      {
        protocol:"https",
        hostname:"lh3.googleusercontent.com",
      },
      {
        protocol:"https",
        hostname:"gravatar.com",
      }
    ]
  }
};

export default nextConfig;
