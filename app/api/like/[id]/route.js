import { supabase } from "@/utils/supabase";
import { NextResponse } from "next/server";
import {getKindeServerSession} from '@kinde-oss/kinde-auth-nextjs/server'
import { redirect } from "next/navigation";
export async function POST(request, { params }) {
  const resolvedParams = await params;
  const {isAuthenticated,getUser}=getKindeServerSession();
  const auth=await isAuthenticated();
  if(!auth){
    redirect("/");
  }
  const user=await getUser();
  const { id } = resolvedParams;
  const body=await request.json();
  if(body.likes.includes(user.id)){
    const index=body.likes.indexOf(user.id);
    body.likes.splice(index,1);
    await supabase.from("issues").update({ likes: body.likes }).eq("id",id);
}
else{
    body.likes.push(user.id);
    const {data,error}=await supabase.from("issues").update({ likes: body.likes }).eq("id",id);
  }
  return NextResponse.json({ success: true });
}
