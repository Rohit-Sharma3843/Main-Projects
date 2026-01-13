import { supabase } from "@/utils/supabase";
import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
export async function POST(req,{params}){
    const {isAuthenticated}=getKindeServerSession();
    const auth=await isAuthenticated();
    if(!auth){
        return NextResponse.json({error:"unauthenticated"});
    }
    const p=await params;
    const {data,error}=await supabase.from("issues").delete().eq("id",p.id);
    if(error){
        return NextResponse.json({error:"unknown"});
    }
    return NextResponse.json({success:"true"});
}