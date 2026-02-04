export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import {
  BarChart3,
  Shield,
  FileText,
  LogOut,
  PlusCircle,
  CheckCircle,
  Clock,
  Award
} from "lucide-react";

const Dashboard = async () => {
  const session = getKindeServerSession();
  const isAuthenticated = await session.isAuthenticated();
  const user = await session.getUser();

  if (!isAuthenticated || !user) {
    redirect("/");
  }

  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        }
      }
    }
  );

  const { data: existingUser, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!existingUser && !error) {
    await supabase.from("users").insert({
      id: user.id,
      email: user.email,
      name: user.given_name
    });
  }

  const { data: userIssues = [] } = await supabase
    .from("issues")
    .select("*")
    .eq("created_by", user.id)
    .order("created_at", { ascending: false });

  const { count: totalIssues = 0 } = await supabase
    .from("issues")
    .select("*", { count: "exact", head: true });

  const { count: resolvedIssues = 0 } = await supabase
    .from("issues")
    .select("*", { count: "exact", head: true })
    .eq("created_by", user.id)
    .eq("status", "resolved");

  const { count: pendingIssues = 0 } = await supabase
    .from("issues")
    .select("*", { count: "exact", head: true })
    .eq("created_by", user.id)
    .eq("status", "pending");

  const contribution =
    totalIssues > 0
      ? ((userIssues.length / totalIssues) * 100).toFixed(1)
      : 0;

  return (
    <div className="min-h-screen mt-16 bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-white mb-10">
          Dashboard
        </h1>

        <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-6 mb-8 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
              {user.given_name?.charAt(0)}
            </div>
            <div>
              <p className="text-xl font-semibold text-white">
                Welcome back, {user.given_name}
              </p>
              <p className="text-gray-400">{user.email}</p>
              <div className="flex items-center gap-2 text-green-400 text-sm mt-1">
                <Shield size={14} />
                Verified Member
              </div>
            </div>
          </div>

          <LogoutLink>
            <button className="flex items-center gap-2 bg-red-600 px-5 py-2 rounded-xl text-white">
              <LogOut size={18} />
              Logout
            </button>
          </LogoutLink>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-10">
          <Link
            href="/issue/create"
            className="p-6 bg-blue-600/20 border border-blue-600 rounded-xl"
          >
            <PlusCircle className="text-blue-400 mb-2" />
            <p className="text-white font-semibold">Report Issue</p>
          </Link>

          <Link
            href="/issue/my"
            className="p-6 bg-purple-600/20 border border-purple-600 rounded-xl"
          >
            <FileText className="text-purple-400 mb-2" />
            <p className="text-white font-semibold">My Issues</p>
          </Link>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-10">
          <Stat title="Total Issues" value={totalIssues} icon={<BarChart3 />} />
          <Stat title="Resolved" value={resolvedIssues} icon={<CheckCircle />} />
          <Stat title="Pending" value={pendingIssues} icon={<Clock />} />
          <Stat
            title="Contribution %"
            value={`${contribution}%`}
            icon={<Award />}
          />
        </div>

        {userIssues.length > 0 && (
          <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Recent Issues
            </h2>

            {userIssues.slice(0, 5).map(issue => (
              <Link
                key={issue.id}
                href={`/issue/${issue.id}`}
                className="block p-4 mb-3 bg-gray-900 rounded-xl"
              >
                <p className="text-white font-semibold">{issue.title}</p>
                <p className="text-sm text-gray-400">
                  {issue.status} • {issue.category} • {issue.location}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Stat = ({ title, value, icon }) => (
  <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-6">
    <div className="flex items-center gap-2 text-white mb-2">
      {icon}
      <p className="font-semibold">{title}</p>
    </div>
    <p className="text-3xl font-bold text-white">{value}</p>
  </div>
);

export default Dashboard;

