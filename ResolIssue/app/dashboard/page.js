"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useKindeBrowserClient, LogoutLink } from "@kinde-oss/kinde-auth-nextjs";
import { supabase } from "@/utils/supabase";
import Link from "next/link";
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
} from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useKindeBrowserClient();

  const [stats, setStats] = useState({
    totalIssues: 0,
    resolved: 0,
    pending: 0,
    contribution: 0,
    issues: []
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      const { data: existingUser } = await supabase
        .from("users")
        .select()
        .eq("id", user.id);

      if (existingUser?.length === 0) {
        await supabase.from("users").insert({
          id: user.id,
          email: user.email,
          name: user.given_name
        });
      }

      const { data: issues } = await supabase
        .from("issues")
        .select("*")
        .eq("created_by", user.id);

      const { count: totalIssues } = await supabase
        .from("issues")
        .select("*", { count: "exact", head: true });

      const { count: resolved } = await supabase
        .from("issues")
        .select("*", { count: "exact", head: true })
        .eq("created_by", user.id)
        .eq("status", "resolved");

      const { count: pending } = await supabase
        .from("issues")
        .select("*", { count: "exact", head: true })
        .eq("created_by", user.id)
        .eq("status", "pending");

      const contribution =
        totalIssues && issues
          ? ((issues.length / totalIssues) * 100).toFixed(1)
          : 0;

      setStats({
        totalIssues: totalIssues || 0,
        resolved: resolved || 0,
        pending: pending || 0,
        contribution,
        issues: issues || []
      });
    };

    loadData();
  }, [user]);

  if (isLoading || !user) return null;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <LogoutLink>
          <button className="flex items-center gap-2 px-4 py-2 bg-red-600 rounded">
            <LogOut size={18} /> Logout
          </button>
        </LogoutLink>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Stat icon={<BarChart3 />} label="Total Issues" value={stats.totalIssues} />
        <Stat icon={<CheckCircle />} label="Resolved" value={stats.resolved} />
        <Stat icon={<Clock />} label="Pending" value={stats.pending} />
        <Stat icon={<Award />} label="Contribution %" value={stats.contribution} />
      </div>

      <div className="space-y-4">
        {stats.issues.slice(0, 5).map(issue => (
          <Link
            key={issue.id}
            href={`/issue/${issue.id}`}
            className="block p-4 border rounded"
          >
            <h3 className="font-semibold">{issue.title}</h3>
            <p className="text-sm text-gray-400">{issue.status}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

function Stat({ icon, label, value }) {
  return (
    <div className="p-4 border rounded">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span>{label}</span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
