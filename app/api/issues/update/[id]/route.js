import { supabase } from "@/utils/supabase";
import { NextResponse } from "next/server";
export async function POST(req,{params}) {
    const p=await params;
    console.log(p);
    const body=await req.json();
    const status=body.status;
    const {data,error}=await supabase.from("issues").update({status:status}).eq("id",p.id);
    if(error){
        return NextResponse.json({error:"unknown"});
    }
    return NextResponse.json({success:"true"});
}