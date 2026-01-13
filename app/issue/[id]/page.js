import { supabase } from "@/utils/supabase";
import Image from "next/image";
import ShowComment from "@/components/show_comment";
import Like from "@/components/like";
import PostComment from "@/components/post_comment";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import { 
  AlertCircle, 
  MapPin, 
  Tag, 
  Calendar,
  Image as ImageIcon,
  ThumbsUp,
  Shield,
  MessageSquare,
} from 'lucide-react';
import Delete from "@/components/delete";
import StatusUpdateAdmin from "@/components/update_status";
import { redirect } from "next/navigation";

const ParticularIssue = async ({ params }) => {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const {getPermissions} = getKindeServerSession();
  const {isAuthenticated}=getKindeServerSession();
  const auth=await isAuthenticated();
  if(!auth){
    redirect("/")
  }
  const permissions = await getPermissions();
  const p = permissions.permissions.length || 0;
  
  const { data: issueData, error: issueError } = await supabase
    .from("issues")
    .select("*")
    .eq("id", id)
    .single();
    
  const { data: commentsData, error: commentsError } = await supabase
    .from("comments")
    .select("*")
    .eq("posted_on", id);

  if (issueError || commentsError) {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-900 to-black flex items-center justify-center overflow-x-hidden">
        <div className="text-center px-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Error Loading Issue</h2>
          <p className="text-gray-400">Please try again later.</p>
        </div>
      </div>
    );
  }
  
  const comments = [];
  if (commentsData) {
    for (let i = 0; i < commentsData.length; i++) {
      const { data: userData } = await supabase
        .from("users")
        .select()
        .eq("id", commentsData[i].posted_by)
        .single();
      
      if (userData) {
        comments.push({
          email: userData.email,
          name: userData.name,
          time: userData.created_at,
          content: commentsData[i].content
        });
      }
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-900 via-black to-gray-900 overflow-x-hidden">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8 pt-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 px-4">
            <span className="bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Issue Details
            </span>
          </h1>
          <p className="text-gray-400 text-lg px-4">
            View and interact with this reported issue
          </p>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 md:p-8 mb-8 shadow-xl mx-4 md:mx-0">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-linear-to-br from-blue-500/20 to-purple-500/20 rounded-lg">
              <AlertCircle className="w-6 h-6 text-blue-400" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white wrap-break-words">
              {issueData.title}
            </h2>
          </div>
          
          <div className="mb-8">
            <div className="p-4 bg-gray-900/30 rounded-xl border border-gray-700/30">
              <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap wrap-break-words">
                {issueData.description}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-800 rounded-lg shrink-0">
                  <Tag className="w-5 h-5 text-blue-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-gray-400">Category</p>
                  <p className="text-white font-medium truncate">{issueData.category}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-800 rounded-lg shrink-0">
                  <MapPin className="w-5 h-5 text-green-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-gray-400">Location</p>
                  <p className="text-white font-medium truncate">{issueData.location}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-800 rounded-lg shrink-0">
                  <AlertCircle className="w-5 h-5 text-yellow-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-gray-400">Status</p>
                  <p className={`font-medium truncate ${
                    issueData.status === 'resolved' ? 'text-green-400' :
                    issueData.status === 'in-progress' ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {issueData.status}
                  </p>
                </div>
              </div>

              {issueData.created_at && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-800 rounded-lg shrink-0">
                    <Calendar className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-gray-400">Reported</p>
                    <p className="text-white font-medium truncate">{formatDate(issueData.created_at)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {issueData.images && issueData.images.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <ImageIcon className="w-5 h-5 text-blue-400" />
                <h3 className="text-xl font-semibold text-white">Attached Images</h3>
                <span className="text-gray-400 text-sm">({issueData.images.length})</span>
              </div>
              {console.log(issueData.images)};
              <div className="flex flex-wrap gap-4 p-4 bg-gray-900/30 rounded-xl border border-gray-700/30 overflow-x-auto">
                {issueData.images.map((image, index) => (
                  <div key={index} className="relative group shrink-0">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-lg overflow-hidden border-2 border-gray-700 group-hover:border-blue-500 transition-colors">
                      <Image
                        src={image}
                        alt={`Issue image ${index + 1}`}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-sm"></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between p-4 bg-gray-900/30 rounded-xl border border-gray-700/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-linear-to-br from-blue-500/20 to-purple-500/20 rounded-lg">
                <ThumbsUp className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Likes</p>
                <p className="text-white font-bold text-xl">{issueData.likes?.length || 0}</p>
              </div>
            </div>
            
            {!p && <Like id={id} data={issueData} />}
          </div>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 md:p-8 shadow-xl mx-4 md:mx-0 mb-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-linear-to-br from-green-500/20 to-emerald-500/20 rounded-lg">
              <MessageSquare className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Comments</h3>
              <p className="text-gray-400">
                {comments.length} comment{comments.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          
          {!p && (
            <div className="mb-8">
              <PostComment />
            </div>
          )}
          
          {comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment, index) => (
                <ShowComment key={index} comment={comment} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-400 mb-2">No comments yet</h4>
              <p className="text-gray-500">Be the first to share your thoughts on this issue!</p>
            </div>
          )}
        </div>
        
        {p > 0 && (
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-xl mx-4 md:mx-0 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-linear-to-br from-blue-500/20 to-purple-500/20 rounded-lg">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Admin Controls</h3>
                <p className="text-gray-400 text-sm">Update issue status and priority</p>
              </div>
            </div>
            <Delete id={id}/>
            <StatusUpdateAdmin 
              issueId={id}
              currentStatus={issueData.status}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticularIssue;