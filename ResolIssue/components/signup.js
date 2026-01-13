"use client";
import { RegisterLink, LoginLink } from '@kinde-oss/kinde-auth-nextjs'
import { motion } from 'framer-motion';
import { 
  AlertCircle, 
  ArrowRight, 
  Shield, 
  Users, 
  Sparkles,
  CheckCircle
} from 'lucide-react';

const Signup = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5" />
      </div>

      <div className="relative container mx-auto px-4 min-h-screen flex items-center justify-center py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-4xl my-8"
        >
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-block p-4 bg-linear-to-br from-blue-500/20 to-purple-500/20 rounded-2xl mb-6"
            >
              <AlertCircle className="w-16 h-16 text-blue-400" />
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-linear-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Welcome to ResolIssue
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Your community's platform for reporting and resolving issues efficiently
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Why Join ResolIssue?
                  </h2>
                  
                  <div className="space-y-4">
                    {[
                      { icon: Shield, text: "Secure & Private", color: "text-green-400" },
                      { icon: Users, text: "Community Driven", color: "text-blue-400" },
                      { icon: Sparkles, text: "Quick Resolution", color: "text-purple-400" },
                      { icon: CheckCircle, text: "Track Progress", color: "text-cyan-400" },
                    ].map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <div className={`p-2 rounded-lg bg-gray-800/50 ${feature.color.split('-')[1]}-500/10`}>
                          <feature.icon className={`w-5 h-5 ${feature.color}`} />
                        </div>
                        <span className="text-gray-300">{feature.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Get Started Today
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Join thousands who are making their communities better
                    </p>
                  </div>

                  <div className="space-y-4">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <RegisterLink className="block w-full">
                        <button className="w-full py-4 px-6 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 group">
                          <span>Create Account</span>
                          <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                        </button>
                      </RegisterLink>
                    </motion.div>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-700"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-gray-800/40 text-gray-400">Already have an account?</span>
                      </div>
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <LoginLink className="block w-full">
                        <button className="w-full py-4 px-6 bg-linear-to-r from-gray-800 to-gray-900 border border-gray-700 hover:border-gray-600 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-3">
                          Sign In to Your Account
                        </button>
                      </LoginLink>
                    </motion.div>
                  </div>

                  <div className="pt-6 border-t border-gray-700/50">
                    <p className="text-center text-sm text-gray-500">
                      Trusted by communities worldwide
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;