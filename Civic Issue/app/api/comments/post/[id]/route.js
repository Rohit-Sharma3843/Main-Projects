import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { supabase } from '@/utils/supabase';
import { NextResponse } from 'next/server';
export async function POST(req,{params}) {
    const {isAuthenticated,getUser}=getKindeServerSession();
    const auth=await isAuthenticated();
    if(!auth){
        return NextResponse.json({error:"unauthorized"});
    }
    const p=await params;
    const {id}=p;
    const user=await getUser();
    const formData=await req.formData();
    const {data,error}=await supabase.from("comments").insert([
        {
            posted_on:id,
            posted_by:user.id,
            content:formData.get("content"),
        }
    ])
    if(error){
        return NextResponse.json({error:"unknown"});
    }
    return NextResponse.json({success:true});
}