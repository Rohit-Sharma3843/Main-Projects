"use client";
import { useRouter } from "next/navigation";
const Delete=({id})=>{
  const router=useRouter();
  async function handleDelete() {
    const res=await fetch(`/api/issues/delete/${id}`,
      {
        method:"POST",
        body:[],
      }
    );
    if(res.error){
      router.refresh("/");
    }
    else{
      router.replace("/issue");
    }
  }
  return <>
  <button onClick={handleDelete} className="border-2 bg-white rounded-md cursor-pointer text-red-600">
    Delete this issue
  </button>
  </>
}
export default Delete;
