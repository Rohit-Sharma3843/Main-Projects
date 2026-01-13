import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { supabase } from '@/utils/supabase'
import { redirect } from 'next/navigation'
import { 
  Mail, 
  Calendar, 
  MapPin, 
  Award, 
  TrendingUp,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Edit,
  Shield,
  Activity,
  Star,
  Target,
  Users,
  Settings,
  Bell,
  LogOut
} from 'lucide-react'
import Link from 'next/link'

const Profile = async () => {
  const { isAuthenticated, getUser } = getKindeServerSession()
  const auth = await isAuthenticated()
  const user = await getUser()

  if (!auth) {
    redirect("/")
  }

  const { data: userData, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()
  if (error) {
    console.error('Error fetching user data:', error)
    redirect("/")
  }
  const { data: userIssues } = await supabase
    .from('issues')
    .select('*')
    .eq('created_by', user.id)
    .order('created_at', { ascending: false })
  const totalIssues = userIssues?.length || 0
  const resolvedIssues = userIssues?.filter(issue => issue.status === 'resolved').length || 0
  const pendingIssues = userIssues?.filter(issue => issue.status === 'pending' || issue.status === 'in-progress').length || 0
  const resolutionRate = totalIssues > 0 ? Math.round((resolvedIssues / totalIssues) * 100) : 0
  const categories = userIssues?.map(issue => issue.category) || []
  const categoryCount = categories.reduce((acc, category) => {
    acc[category] = (acc[category] || 0) + 1
    return acc
  }, {})
  const topCategory = Object.keys(categoryCount).length > 0 
    ? Object.keys(categoryCount).reduce((a, b) => categoryCount[a] > categoryCount[b] ? a : b)
    : 'None'
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  return (
    <div className="min-h-screen mt-15 bg-linear-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Your Profile
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Manage your account, track contributions, and view activity history
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-linear-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-xl">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-4xl font-bold text-white">
                      {user.given_name?.charAt(0) || user.email?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2">
                        {user.given_name} {user.family_name}
                      </h2>
                    </div>
                    <button className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
                      <Edit className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-400">Member Since</p>
                      <p className="font-medium text-white">{formatDate(userData.created_at)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Reports</p>
                      <p className="font-medium text-white">{totalIssues}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Resolved</p>
                      <p className="font-medium text-white">{resolvedIssues}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Success Rate</p>
                      <p className="font-medium text-white">{resolutionRate}%</p>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-blue-400" />
                      <span className="text-gray-300">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-green-400" />
                      <span className="text-gray-300">Joined {formatDate(userData.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Stats */}
            <div className="bg-linear-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-linear-to-br from-green-500/20 to-emerald-500/20 rounded-lg">
                  <Activity className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Activity Overview</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-gray-900/30 rounded-xl border border-gray-700/30">
                  <Target className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                  <p className="text-2xl font-bold text-white">{totalIssues}</p>
                  <p className="text-sm text-gray-400">Total Reports</p>
                </div>
                <div className="text-center p-4 bg-gray-900/30 rounded-xl border border-gray-700/30">
                  <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-3" />
                  <p className="text-2xl font-bold text-white">{resolvedIssues}</p>
                  <p className="text-sm text-gray-400">Resolved</p>
                </div>
                <div className="text-center p-4 bg-gray-900/30 rounded-xl border border-gray-700/30">
                  <Clock className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                  <p className="text-2xl font-bold text-white">{pendingIssues}</p>
                  <p className="text-sm text-gray-400">Pending</p>
                </div>
                <div className="text-center p-4 bg-gray-900/30 rounded-xl border border-gray-700/30">
                  <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                  <p className="text-2xl font-bold text-white">{resolutionRate}%</p>
                  <p className="text-sm text-gray-400">Success Rate</p>
                </div>
              </div>

              {/* Progress Bars */}
              <div className="mt-8 space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-300">Issue Resolution</span>
                    <span className="text-gray-400">{resolutionRate}%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-linear-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${resolutionRate}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Issues */}
            {userIssues && userIssues.length > 0 && (
              <div className="bg-linear-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-linear-to-br from-blue-500/20 to-purple-500/20 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Recent Reports</h3>
                </div>

                <div className="space-y-4">
                  {userIssues.slice(0, 5).map((issue) => (
                    <Link
                      key={issue.id}
                      href={`/issue/${issue.id}`}
                      className="block p-4 bg-gray-900/30 border border-gray-700/50 rounded-xl hover:border-gray-600 transition-colors group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-white group-hover:text-blue-300 transition-colors">
                            {issue.title}
                          </h4>
                          <div className="flex items-center gap-3 mt-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              issue.status === 'resolved' 
                                ? 'bg-green-500/20 text-green-300' 
                                : issue.status === 'in-progress'
                                ? 'bg-yellow-500/20 text-yellow-300'
                                : 'bg-red-500/20 text-red-300'
                            }`}>
                              {issue.status}
                            </span>
                            <span className="text-gray-400 text-sm">{issue.category}</span>
                            <span className="text-gray-400 text-sm">{issue.location}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-gray-500 text-sm">
                            {new Date(issue.created_at).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1 text-yellow-400 text-sm">
                            <Star className="w-3 h-3" />
                            {issue.likes?.length || 0}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {userIssues.length > 5 && (
                  <div className="text-center mt-6">
                    <Link
                      href="/issue/my"
                      className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      View all reports
                      <span>→</span>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="space-y-8">
            <div className="bg-linear-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Account</h3>
              
              <div className="space-y-3">
                <Link
                  href="/api/auth/logout"
                  className="flex items-center gap-3 p-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl transition-colors group"
                >
                  <LogOut className="w-5 h-5 text-red-400" />
                  <span className="text-red-300 group-hover:text-red-200">Sign Out</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile