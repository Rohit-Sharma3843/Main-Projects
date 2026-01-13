"use client";
import { useRouter } from 'next/navigation';
import { useParams } from "next/navigation";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  MessageSquare,
  Loader2
} from 'lucide-react';

const PostComment = () => {
  const router = useRouter();
  const params = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.target);
    const res = await fetch(`/api/comments/post/${params.id}`, {
      method: "POST",
      body: formData,
    });
    
    if (res.ok) {
      router.refresh();
    } else {
      router.replace("/");
    }
    
    setIsSubmitting(false);
  }

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare className="w-5 h-5 text-blue-400" />
        <h3 className="text-xl font-bold text-white">Add a Comment</h3>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <textarea
            name="content"
            placeholder="Share your thoughts here..."
            className="w-full h-32 px-4 py-3 bg-gray-900/60 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-gray-500 resize-none"
            required
          />
        </div>
        
        <div className="flex justify-end">
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2 ${
              isSubmitting
                ? 'bg-gray-700 cursor-not-allowed text-gray-400'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Posting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Post
              </>
            )}
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default PostComment;