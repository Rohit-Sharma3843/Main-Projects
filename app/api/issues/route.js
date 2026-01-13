import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import cloudinary from "@/utils/cloudinary";
import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";

export const runtime = "nodejs";

export async function POST(req) {
  const { isAuthenticated, getUser } = getKindeServerSession();

  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getUser();
  const formData = await req.formData();

  const images = formData.getAll("images");

  if (images.length > 5) {
    return NextResponse.json({ error: "Max 5 images allowed" }, { status: 400 });
  }

  const uploadImage = (buffer) =>
    new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "issues" },
        (err, result) => {
          if (err) reject(err);
          else resolve(result.secure_url);
        }
      ).end(buffer);
    });

  const imageUrls = [];
  for (const file of images) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadImage(buffer);
    imageUrls.push(url);
  }

  const { error } = await supabase.from("issues").insert([
    {
      title: formData.get("title"),
      description: formData.get("description"),
      category: formData.get("category"),
      location: formData.get("location"),
      created_by: user.id,
      status: "incomplete",
      likes: [],
      images: imageUrls,
    },
  ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
