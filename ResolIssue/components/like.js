"use client";
import { useRouter } from "next/navigation";
const Like=({id,data})=>{
    const router=useRouter();
    async function like() {
        await fetch(`/api/like/${id}`,{
            method:"POST",
            headers:{"Content-type":"application/json"},
            body:JSON.stringify(data),
        }) 
        router.refresh();
    }
    return <>
    <h1 onClick={like} className="cursor-pointer text-white">Like</h1>
    </>
}
export default Like;