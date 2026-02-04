"use client"; 

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const useKindeAuth = () => {
  if (typeof window === 'undefined') {
    return { isAuthenticated: false, user: null, isLoading: true };
  }
  return require("@kinde-oss/kinde-auth-nextjs").useKindeAuth();
};

const LogoutLink = ({ children }) => {
  const { LogoutLink: KindeLogoutLink } = require("@kinde-oss/kinde-auth-nextjs");
  return <KindeLogoutLink>{children}</KindeLogoutLink>;
};

const Icon = ({ name, ...props }) => {
  const [IconComponent, setIconComponent] = useState(null);
  
  useEffect(() => {
    const loadIcon = async () => {
      const icons = await import("lucide-react");
      setIconComponent(() => icons[name]);
    };
    loadIcon();
  }, [name]);
  
  if (!IconComponent) return <div className="w-6 h-6" />;
  return <IconComponent {...props} />;
};

export default function Dashboard() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useKindeAuth();
  const [isClient, setIsClient] = useState(false);
  const [userIssues, setUserIssues] = useState([]);
  const [totalIssues, setTotalIssues] = useState(0);
  const [resolvedIssues, setResolvedIssues] = useState(0);
  const [pendingIssues, setPendingIssues] = useState(0);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !isLoading && !isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, isLoading, router, isClient]);

 
  useEffect(() => {
    if (!isClient || !user || isLoading) return;

    const loadData = async () => {
      try {
  
        const { supabase } = await import("@/utils/supabase");
 
        const { data: existingUser } = await supabase
          .from("users")
          .select("id")
          .eq("id", user.id)
          .single();

        if (!existingUser) {
          await supabase.from("users").insert({
            id: user.id,
            email: user.email,
            name: user.given_name || user.email.split("@")[0]
          });
        }
        const { data: issues = [] } = await supabase
          .from("issues")
          .select("*")
          .eq("created_by", user.id)
          .order("created_at", { ascending: false });

        setUserIssues(issues || []);

        const [
          { count: total },
          { count: resolved },
          { count: pending }
        ] = await Promise.all([
          supabase.from("issues").select("*", { count: "exact", head: true }),
          supabase
            .from("issues")
            .select("*", { count: "exact", head: true })
            .eq("created_by", user.id)
            .eq("status", "resolved"),
          supabase
            .from("issues")
            .select("*", { count: "exact", head: true })
            .eq("created_by", user.id)
            .eq("status", "pending")
        ]);

        setTotalIssues(total || 0);
        setResolvedIssues(resolved || 0);
        setPendingIssues(pending || 0);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
    };

    loadData();
  }, [user, isLoading, isClient]);

  if (!isClient || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const contribution = totalIssues > 0
    ? ((userIssues.length / totalIssues) * 100).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen mt-16 bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
              {user?.given_name?.charAt(0) || user?.email?.charAt(0) || "U"}
            </div>
            <div>
              <p className="text-xl font-semibold text-white">
                Welcome back, {user?.given_name || user?.email?.split("@")[0]}
              </p>
              <p className="text-gray-400">{user?.email}</p>
              <div className="flex items-center gap-2 text-green-400 text-sm mt-1">
                <Icon name="Shield" size={14} />
                Verified Member
              </div>
            </div>
          </div>

          <LogoutLink>
            <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-5 py-2 rounded-xl text-white transition-colors">
              <Icon name="LogOut" size={18} />
              Logout
            </button>
          </LogoutLink>
        </div>

    
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          <Link href="/issue/create" className="p-6 bg-blue-600/20 border border-blue-600 rounded-xl hover:bg-blue-600/30 transition-colors">
            <Icon name="PlusCircle" className="text-blue-400 mb-2" size={24} />
            <p className="text-white font-semibold">Report Issue</p>
            <p className="text-gray-400 text-sm">Submit a new issue</p>
          </Link>

          <Link href="/issue/my" className="p-6 bg-purple-600/20 border border-purple-600 rounded-xl hover:bg-purple-600/30 transition-colors">
            <Icon name="FileText" className="text-purple-400 mb-2" size={24} />
            <p className="text-white font-semibold">My Issues</p>
            <p className="text-gray-400 text-sm">View your submitted issues</p>
          </Link>
        </div>

    
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10">
          <Stat title="Total Issues" value={totalIssues} iconName="BarChart3" />
          <Stat title="Resolved" value={resolvedIssues} iconName="CheckCircle" />
          <Stat title="Pending" value={pendingIssues} iconName="Clock" />
          <Stat title="Contribution %" value={`${contribution}%`} iconName="Award" />
        </div>

     
        {userIssues.length > 0 && (
          <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Recent Issues
            </h2>
            <div className="space-y-3">
              {userIssues.slice(0, 5).map(issue => (
                <Link
                  key={issue.id}
                  href={`/issue/${issue.id}`}
                  className="block p-4 bg-gray-900 rounded-xl hover:bg-gray-800 transition-colors"
                >
                  <p className="text-white font-semibold">{issue.title}</p>
                  <p className="text-sm text-gray-400">
                    {issue.status} • {issue.category} • {issue.location}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ title, value, iconName }) {
  return (
    <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-4 md:p-6">
      <div className="flex items-center gap-2 text-white mb-2">
        <Icon name={iconName} size={20} />
        <p className="font-semibold text-sm md:text-base">{title}</p>
      </div>
      <p className="text-2xl md:text-3xl font-bold text-white">{value}</p>
    </div>
  );
}

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
