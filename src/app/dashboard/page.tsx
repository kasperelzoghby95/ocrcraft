'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Workflow,
  Plus,
  Trash2,
  ExternalLink,
  LogOut,
  Loader2,
  FileText,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface WorkflowItem {
  id: string;
  title: string;
  description?: string;
  workflowData: string;
  isPublic: boolean;
  createdAt: string;
}

interface User {
  id: string;
  email: string;
  name?: string | null;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [workflows, setWorkflows] = useState<WorkflowItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [userRes, workflowsRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/workflows'),
        ]);

        const userData = await userRes.json();
        const workflowsData = await workflowsRes.json();

        if (!userData.user) {
          router.push('/login');
          return;
        }

        setUser(userData.user);
        setWorkflows(workflowsData.workflows || []);
      } catch {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this workflow?')) return;
    await fetch(`/api/workflows/${id}`, { method: 'DELETE' });
    setWorkflows((prev) => prev.filter((w) => w.id !== id));
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <LayoutDashboard className="h-6 w-6 text-blue-500" />
              <h1 className="text-2xl font-bold">Dashboard</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Welcome back, {user?.name || user?.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Your Workflows</h2>
          <Link
            href="/workflow-editor"
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Workflow
          </Link>
        </div>

        {workflows.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-border p-16 text-center">
            <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No workflows saved yet</p>
            <Link
              href="/workflow-editor"
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create Your First Workflow
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {workflows.map((workflow) => {
              let stepCount = 0;
              try {
                const data = JSON.parse(workflow.workflowData);
                stepCount = data.steps?.length || 0;
              } catch {}
              return (
                <div
                  key={workflow.id}
                  className="rounded-xl border border-border bg-card p-5 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{workflow.title}</h3>
                      {workflow.description && (
                        <p className="text-xs text-muted-foreground mt-1">{workflow.description}</p>
                      )}
                    </div>
                    {workflow.isPublic && (
                      <span className="rounded-full bg-green-500/10 text-green-600 text-xs px-2 py-0.5">
                        Public
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {stepCount} step{stepCount !== 1 ? 's' : ''} &middot;{' '}
                    {new Date(workflow.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/workflow-editor?load=${workflow.id}`}
                      className="inline-flex items-center gap-1 rounded-lg bg-muted px-3 py-1.5 text-xs font-medium hover:bg-muted/80 transition-colors"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Open
                    </Link>
                    <button
                      onClick={() => handleDelete(workflow.id)}
                      className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
