"use client";
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Tag, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  Eye,
  MessageSquare,
  ChevronRight,
  Image as ImageIcon,
  Droplets,
  Zap,
  Sparkles,
  Shield
} from 'lucide-react';
import { useState } from 'react';

const Issue = ({ value, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const categoryColors = {
    electrical: 'from-cyan-500 to-blue-500',
    water: 'from-blue-500 to-indigo-500',
    cleaniness: 'from-teal-500 to-emerald-500',
    transportation: 'from-violet-500 to-purple-500',
  };

  const categoryIcons = {
    electrical: Zap,
    water: Droplets,
    cleaniness: Sparkles,
    transportation: Shield,
  };

  const statusColors = {
    pending: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
    'in-progress': 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    resolved: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    closed: 'text-gray-400 bg-gray-400/10 border-gray-400/20',
    incomplete: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
  };

  const statusIcons = {
    pending: Clock,
    'in-progress': AlertCircle,
    resolved: CheckCircle,
    closed: CheckCircle,
    incomplete: AlertCircle,
  }
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const StatusIcon = statusIcons[value.status] || Clock;
  const CategoryIcon = categoryIcons[value.category] || Tag;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ scale: 1.02, y: -2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full max-w-4xl mx-auto mb-4"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0.15 : 0 }}
        className={`absolute inset-0 rounded-2xl blur-xl bg-linear-to-r ${
          categoryColors[value.category] || 'from-cyan-500 to-blue-500'
        }`}
      />

      <div className="relative bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden group hover:border-gray-600 transition-all duration-300 shadow-xl">

        <div className={`h-1 bg-linear-to-r ${
          categoryColors[value.category] || 'from-cyan-500 to-blue-500'
        }`} />

        <div className="p-6">

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
            <div className="flex-1">

              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg bg-linear-to-r ${
                  categoryColors[value.category] || 'from-cyan-500 to-blue-500'
                } bg-opacity-20`}>
                  <CategoryIcon className="w-5 h-5 text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <motion.h1 
                    className="text-xl font-bold text-white truncate"
                    animate={{ x: isHovered ? 4 : 0 }}
                  >
                    {value.title}
                  </motion.h1>
                </div>
       
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
                    statusColors[value.status] || statusColors.pending
                  }`}
                >
                  <StatusIcon className="w-4 h-4" />
                  <span className="text-sm font-medium capitalize">{value.status}</span>
                </motion.div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
          
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r ${
                  categoryColors[value.category] || 'from-cyan-500 to-blue-500'
                } text-white text-sm font-semibold shadow-lg`}>
                  <CategoryIcon className="w-4 h-4" />
                  <span className="capitalize">{value.category}</span>
                </div>
 
                {value.createdAt && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{formatDate(value.createdAt)}</span>
                  </div>
                )}
                

                <div className="flex items-center gap-2 text-gray-300">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-medium">{value.location}</span>
                </div>
              </div>
            </div>


            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-3 rounded-xl bg-linear-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-cyan-500/50 hover:bg-gray-800 transition-all duration-300"
            >
              <motion.div
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="w-5 h-5 text-cyan-400" />
              </motion.div>
            </motion.button>
          </div>

          <motion.div
            initial={false}
            animate={{ height: isExpanded ? 'auto' : '4rem' }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-linear-to-r from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-700/50">
              <p className="text-gray-200 leading-relaxed font-medium">
                {value.description}
              </p>
            </div>
          </motion.div>


          <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-6 border-t border-gray-700/50">

            <div className="flex items-center gap-6">

            </div>


            <div className="flex items-center gap-4">
  
              {value.id && (
                <div className="px-3 py-1.5 bg-gray-800/50 border border-gray-700/50 rounded-lg">
                  <p className="text-xs font-mono text-cyan-300">
                    ID: <span className="text-cyan-400 font-bold">{value.id.slice(0, 8)}...</span>
                  </p>
                </div>
              )}
              

              {value.priority && (
                <div className={`px-3 py-1.5 rounded-lg ${
                  value.priority === 'high' ? 'bg-rose-900/30 border-rose-700/30 text-rose-300' :
                  value.priority === 'medium' ? 'bg-amber-900/30 border-amber-700/30 text-amber-300' :
                  'bg-cyan-900/30 border-cyan-700/30 text-cyan-300'
                } border`}>
                  <span className="text-xs font-semibold capitalize">{value.priority}</span>
                </div>
              )}
            </div>
          </div>


          {(value.status === 'incomplete' || value.status === 'in-progress') && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6"
            >
              
            </motion.div>
          )}


          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 mt-6 pt-6 border-t border-gray-700/50"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 px-6 py-3 bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-5 h-5" />
                Add Comment
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 px-6 py-3 bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Eye className="w-5 h-5" />
                Follow Issue
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 px-6 py-3 bg-linear-to-r from-gray-800 to-gray-900 border border-gray-700 hover:border-gray-600 text-gray-300 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                <ImageIcon className="w-5 h-5" />
                Share
              </motion.button>
            </motion.div>
          )}

          {value.tags && value.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {value.tags.map((tag, idx) => (
                <motion.span
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + idx * 0.05 }}
                  className="px-3 py-1.5 text-xs bg-linear-to-r from-gray-800 to-gray-900 text-cyan-300 rounded-full border border-cyan-800/50 font-medium"
                >
                  #{tag}
                </motion.span>
              ))}
            </div>
          )}
        </div>
        <div className={`absolute inset-0 border-2 border-transparent group-hover:border-${value.category === 'water' ? 'blue' : 'cyan'}-500/30 rounded-2xl pointer-events-none transition-all duration-300`} />
      </div>

    </motion.div>
  );
};

export default Issue;