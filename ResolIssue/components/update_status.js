"use client";
import { useRouter } from 'next/navigation';
import {  useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  ChevronDown,
  RefreshCw,
  Shield
} from 'lucide-react';

const StatusUpdateAdmin = ({ issueId, currentStatus }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);
  const router=useRouter();
  const statusOptions = [
    { value: 'open', label: 'Open', icon: AlertCircle, color: 'text-red-400', bgColor: 'bg-red-500/20' },
    { value: 'in-progress', label: 'In Progress', icon: Clock, color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' },
    { value: 'resolved', label: 'Resolved', icon: CheckCircle, color: 'text-green-400', bgColor: 'bg-green-500/20' },
  ];

  const handleStatusUpdate = async () => {
    setIsUpdating(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsUpdating(false);
    setIsOpen(false);
    const res=await fetch(`/api/issues/update/${issueId}`,{
      method:"POST",
      headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({status:selectedStatus})
    })
    if(res.error){
      router.replace("/")
    }
    else{
      router.refresh();
    }
    console.log('Updating issue', issueId, 'to status:', selectedStatus);
  };

  const currentStatusInfo = statusOptions.find(s => s.value === selectedStatus);

  return (
    <div className="mt-4">
      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg"
      >
        <Shield className="w-5 h-5" />
        <span>Update Status</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      {/* Status Update Panel */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 bg-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl"
        >
          <h3 className="text-xl font-bold text-white mb-4">Update Issue Status</h3>
          
          <div className="space-y-4">
            {/* Status Selection */}
            <div>
              <label className="block text-gray-300 font-medium mb-2">Select Status</label>
              <div className="grid grid-cols-3 gap-3">
                {statusOptions.map((status) => (
                  <button
                    key={status.value}
                    onClick={() => setSelectedStatus(status.value)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
                      selectedStatus === status.value
                        ? `${status.bgColor} border-${status.color.split('-')[1]}-400`
                        : 'bg-gray-900/50 border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <status.icon className={`w-6 h-6 ${status.color}`} />
                    <span className="text-white font-medium">{status.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Current Status Display */}
            <div className="p-4 bg-gray-900/30 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {currentStatusInfo && (
                    <>
                      <div className={`p-2 rounded-lg ${currentStatusInfo.bgColor}`}>
                        <currentStatusInfo.icon className={`w-5 h-5 ${currentStatusInfo.color}`} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Current Status</p>
                        <p className="text-white font-bold">{currentStatusInfo.label}</p>
                      </div>
                    </>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Issue ID</p>
                  <p className="text-white font-mono">{issueId}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStatusUpdate}
                disabled={isUpdating || selectedStatus === currentStatus}
                className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-3 ${
                  selectedStatus !== currentStatus && !isUpdating
                    ? 'bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isUpdating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Update Status
                  </>
                )}
              </motion.button>
              
              <button
                onClick={() => setIsOpen(false)}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default StatusUpdateAdmin;