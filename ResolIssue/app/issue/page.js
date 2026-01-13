import { supabase } from "@/utils/supabase";
import Link from "next/link";
import Issue from "@/components/issue";
import {redirect} from 'next/navigation'
import {getKindeServerSession} from '@kinde-oss/kinde-auth-nextjs/server' 

const Issues = async () => {
    const {isAuthenticated} = getKindeServerSession();
    const auth=await isAuthenticated();
    if(!auth){
        redirect("/");
    }
    const res = await supabase.from("issues").select();
    const data = res.data;
    
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-linear-to-b from-gray-900 to-black py-8 px-4">
            <div className="w-full max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        All Reported Issues
                    </h1>
                    <p className="text-gray-400">
                        Browse through all community-reported issues
                    </p>
                </div>
                
                <div className="flex flex-col items-center space-y-6">
                    {data && data.length > 0 ? (
                        data.map((d) => (
                            <Link 
                                key={d.id} 
                                href={`/issue/${d.id}`}
                                className="block w-full transition-transform duration-300 hover:scale-[1.02]"
                            >
                                <Issue value={d} />
                            </Link>
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <h3 className="text-xl font-semibold text-gray-400 mb-2">
                                No issues reported yet
                            </h3>
                            <p className="text-gray-500">
                                Be the first to report an issue in your community
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Issues;