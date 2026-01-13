import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/components'
import { redirect } from 'next/navigation';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { supabase } from '@/utils/supabase';
import Link from 'next/link';
import { 
  BarChart3, 
  AlertCircle, 
  MessageSquare, 
  MapPin, 
  Shield, 
  TrendingUp,
  FileText,
  LogOut,
  PlusCircle,
  CheckCircle,
  Clock,
  Award
} from 'lucide-react';

const Dashboard = async () => {
  const { isAuthenticated, getUser } = getKindeServerSession();
  const auth = await isAuthenticated();
  const user = await getUser();

  if (!auth) {
    redirect("/");
  }

  const {getPermissions}=getKindeServerSession();
  const p=await getPermissions();
  console.log(p);
  const { data: userData, error } = await supabase
    .from("users")
    .select()
    .eq('id', user.id);

  if (error) {
    console.error("Error fetching user data:", error);
    redirect("/");
  }

  // Create user if doesn't exist
  if (userData && userData.length === 0) {
    const { error: insertError } = await supabase.from("users").insert([
      {
        email: user.email,
        name: user.given_name,
        id: user.id,
      }
    ]);
    
    if (insertError) {
      console.error("Error creating user:", insertError);
    }
  }

  // Fetch user's issues
  const { data: userIssues } = await supabase
    .from("issues")
    .select("*")
    .eq("created_by", user.id);

  // Fetch stats
  const { count: totalIssues } = await supabase
    .from("issues")
    .select('*', { count: 'exact', head: true });

  const { count: userResolvedIssues } = await supabase
    .from("issues")
    .select('*', { count: 'exact', head: true })
    .eq("created_by", user.id)
    .eq("status", "resolved");

  const { count: userPendingIssues } = await supabase
    .from("issues")
    .select('*', { count: 'exact', head: true })
    .eq("created_by", user.id)
    .eq("status", "pending");

  // Calculate user's contribution percentage
  const userContribution = userIssues?.length ? ((userIssues.length / totalIssues) * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen mt-15 bg-linear-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Dashboard
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Welcome to ResolIssue - Your community platform for reporting, tracking, and resolving local issues
          </p>
        </div>

        {/* User Welcome Card */}
        <div className="bg-linear-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 mb-8 shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {user.given_name?.charAt(0) || "U"}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-gray-900"></div>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Welcome back, {user.given_name}!
                </h2>
                <p className="text-gray-400">{user.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-400">Verified Community Member</span>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <LogoutLink>
              <button className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold rounded-xl transition-all duration-300">
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </LogoutLink>
          </div>
        </div>

        {/* App Description */}
        <div className="bg-linear-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-sm border border-blue-700/30 rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-linear-to-br from-blue-500/20 to-purple-500/20 rounded-lg">
              <AlertCircle className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white">About ResolIssue</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-300 leading-relaxed mb-6">
                ResolIssue is a community-driven platform designed to help residents report, track, and resolve local issues efficiently. From broken street lights to potholes and cleanliness concerns, our platform connects community members with local authorities.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Real-time issue tracking</span>
                </div>
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-300">Community discussions</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-yellow-400" />
                  <span className="text-gray-300">Location-based reporting</span>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                  <span className="text-gray-300">Progress monitoring</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-xl font-semibold text-white mb-4">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-4">
                <Link
                  href="/issue/create"
                  className="p-4 bg-linear-to-br from-blue-600/20 to-blue-700/20 border border-blue-600/30 rounded-xl hover:border-blue-500 transition-colors"
                >
                  <PlusCircle className="w-6 h-6 text-blue-400 mb-2" />
                  <p className="font-medium text-white">Report Issue</p>
                  <p className="text-sm text-gray-400">Report a new problem</p>
                </Link>
                
                <Link
                  href="/issue/my"
                  className="p-4 bg-linear-to-br from-purple-600/20 to-purple-700/20 border border-purple-600/30 rounded-xl hover:border-purple-500 transition-colors"
                >
                  <FileText className="w-6 h-6 text-purple-400 mb-2" />
                  <p className="font-medium text-white">My Issues</p>
                  <p className="text-sm text-gray-400">View your reports</p>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-linear-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Total Issues</h3>
            </div>
            <p className="text-3xl font-bold text-white mb-2">{totalIssues || 0}</p>
            <p className="text-sm text-gray-400">Community-wide reports</p>
          </div>

          <div className="bg-linear-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Your Resolved</h3>
            </div>
            <p className="text-3xl font-bold text-white mb-2">{userResolvedIssues || 0}</p>
            <p className="text-sm text-gray-400">Issues you helped fix</p>
          </div>

          <div className="bg-linear-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Pending</h3>
            </div>
            <p className="text-3xl font-bold text-white mb-2">{userPendingIssues || 0}</p>
            <p className="text-sm text-gray-400">Awaiting resolution</p>
          </div>

          <div className="bg-linear-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Award className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Contribution</h3>
            </div>
            <p className="text-3xl font-bold text-white mb-2">{userContribution}%</p>
            <p className="text-sm text-gray-400">Of total issues</p>
          </div>
        </div>

        {/* Recent Activity */}
        {userIssues && userIssues.length > 0 && (
          <div className="bg-linear-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-linear-to-br from-green-500/20 to-emerald-500/20 rounded-lg">
                <FileText className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">Your Recent Issues</h3>
            </div>

            <div className="space-y-4">
              {userIssues.slice(0, 5).map((issue) => (
                <Link
                  key={issue.id}
                  href={`/issue/${issue.id}`}
                  className="block p-4 bg-gray-900/30 border border-gray-700/50 rounded-xl hover:border-gray-600 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-white mb-1">{issue.title}</h4>
                      <div className="flex items-center gap-4 text-sm">
                        <span className={`px-2 py-1 rounded-full ${
                          issue.status === 'resolved' 
                            ? 'bg-green-500/20 text-green-300' 
                            : issue.status === 'in-progress'
                            ? 'bg-yellow-500/20 text-yellow-300'
                            : 'bg-red-500/20 text-red-300'
                        }`}>
                          {issue.status}
                        </span>
                        <span className="text-gray-400">{issue.category}</span>
                        <span className="text-gray-400">{issue.location}</span>
                      </div>
                    </div>
                    <div className="text-gray-500 text-sm">
                      {new Date(issue.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;