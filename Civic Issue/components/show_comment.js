"use client";
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Calendar
} from 'lucide-react';

function convertToIST(utcTime) {
  const date = new Date(utcTime);

  const options = {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  const formatted = new Intl.DateTimeFormat("en-GB", options).format(date);
  const [day, month, year, hour, minute] = formatted.match(/\d+/g);

  return `${day}-${month}-${year}`;
}

const ShowComment = ({ comment }) => {
  const t = convertToIST(comment.time);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/30 border border-gray-700 rounded-lg p-5 mb-4 hover:border-gray-600 transition-colors"
    >
      {/* User Info */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-linear--br from-blue-500/20 to-purple-500/20 flex items-center justify-center shrink-0">
          <User className="w-5 h-5 text-blue-400" />
        </div>
        
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <h4 className="font-bold text-white text-lg">{comment.name}</h4>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>Posted on: {t}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-gray-400 mb-3">
            <Mail className="w-4 h-4" />
            <span className="text-sm">{comment.email}</span>
          </div>
        </div>
      </div>

      {/* Comment Content */}
      <div className="text-gray-300 leading-relaxed">
        {comment.content}
      </div>
    </motion.div>
  );
};

export default ShowComment;