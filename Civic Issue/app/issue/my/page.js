export const dynamic = "force-dynamic";
import Link from "next/link";
import {supabase} from "@/utils/supabase";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import Issue from "@/components/issue";

const MyIssues = async () => {
    const {getUser, isAuthenticated} = getKindeServerSession();
    const auth=await isAuthenticated();
    if(!auth){
        redirect("/");
    }
    
    const user = await getUser();
    if(!user){
        redirect("/");
    }
    const {data} = await supabase.from("issues").select("*").eq("created_by", user.id);
    
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-linear-to-b from-gray-900 to-black py-8 px-4">
            <div className="w-full max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        My Reported Issues
                    </h1>
                    <p className="text-gray-400">
                        Track all issues you have reported
                    </p>
                </div>
                
                <div className="flex flex-col items-center space-y-6">
                    {data && data.length > 0 ? (
                        data.map((d) => (
                            <Link 
                                href={`/issue/${d.id}`} 
                                key={d.id}
                                className="block w-full transition-transform duration-300 hover:scale-[1.02]"
                            >
                                <Issue value={d}/>
                            </Link>
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <div className="p-8 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl">
                                <h3 className="text-xl font-semibold text-gray-300 mb-2">
                                    No Issues Found
                                </h3>
                                <p className="text-gray-400 mb-6">
                                    You haven't reported any issues yet.
                                </p>
                                <Link 
                                    href="/issue/create" 
                                    className="inline-block px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all duration-300"
                                >
                                    Report Your First Issue
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MyIssues;