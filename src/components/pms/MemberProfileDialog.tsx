'use client';
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Mail, Briefcase, Layers, CheckCircle2, ExternalLink, MessageSquare, Clock, ListTodo, FolderKanban } from 'lucide-react';
import { Button } from '@/components/ui/button';

enum TaskStatus {
  'Completed' = 'Completed',
  'In Progress' = 'In Progress',
  'To Do' = 'To Do',
}


interface TaskAssignment {
  id: string;
  name: string;
  project: string;
  status: 'Completed' | 'In Progress' | 'To Do';
}

interface ActiveProject {
  id: string;
  name: string;
  role: string;
}

interface DetailedMember {
  id: string;
  name: string;
  email: string;
  role: string;
  total_projects: number;
  completed_tasks: number;
  pending_tasks: number;
  task_assignments: TaskAssignment[];
  active_projects: ActiveProject[];
  last_active: string | null;
  // Assuming 'avatar' might still be needed or generated if not from API
  avatar?: string;
}

interface MemberProfileDialogProps {
  memberId: string | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const StatBox: React.FC<{ icon: React.ReactNode; label: string; value: string | number; colorClass: string }> = ({ icon, label, value, colorClass }) => (
  <div className="bg-muted/50 rounded-xl p-3 flex flex-col items-center justify-center border border-border/50 hover:bg-muted transition-colors">
    <div className={`p-2 rounded-full mb-2 ${colorClass}`}>{icon}</div>
    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</span>
    <span className="text-lg font-bold mt-0.5">{value}</span>
  </div>
);

const getInitials = (name: string) => {
  const parts = name.trim().split(' ');
  return parts.length > 1 ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase() : name.slice(0, 2).toUpperCase();
};

const roleColors: Record<string, string> = {
  'Admin': 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800',
  'Team Lead': 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
  'Developer': 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
  'Designer': 'bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-400 dark:border-pink-800',
  'QA': 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800',
  'Intern': 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
};

const statusColors: Record<TaskStatus, string> = {
  'Completed': 'bg-emerald-500',
  'In Progress': 'bg-blue-500',
  'To Do': 'bg-slate-400',
};

const MemberProfileDialog: React.FC<MemberProfileDialogProps> = ({ memberId, isOpen, onOpenChange }) => {
  const [detailedMember, setDetailedMember] = useState<DetailedMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !memberId) {
      setDetailedMember(null);
      setLoading(false);
      return;
    }

    const fetchDetailedMember = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('authToken');
      try {
        const response = await fetch(`http://18.138.124.3/api/projects/users/${memberId}/overview/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDetailedMember({
          ...data,
          id: data.id.toString(), // Ensure ID is string
          last_active: data.last_active ? data.last_active : null, // Handle null last_active
        });
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetailedMember();
  }, [isOpen, memberId]);

  if (!isOpen) return null;

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="w-[95%] sm:max-w-4xl p-4 text-center">
          Loading member profile...
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="w-[95%] sm:max-w-4xl p-4 text-center text-red-500">
          Error: {error}
        </DialogContent>
      </Dialog>
    );
  }

  if (!detailedMember) return null;

  // Since tasks and projects now come directly from detailedMember, no need for separate calculations
  const tasksCompleted = detailedMember.completed_tasks;
  const tasksPending = detailedMember.pending_tasks;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95%] sm:max-w-4xl p-0 overflow-hidden border-none shadow-2xl max-h-[90vh] flex flex-col rounded-2xl">
        <div className="overflow-y-auto hide-scrollbar">
          <div className="h-12 md:h-12 bg-primary relative">
            <div className="absolute inset-0 bg-black/10" />
          </div>

          <div className="relative p-4 sm:p-6 md:p-8">
            <div className="md:grid md:grid-cols-[300px_1fr] md:gap-8">
              <aside className="flex flex-col items-center md:items-start -mt-16 md:-mt-20 mb-8 md:mb-0">
                <div className="relative group">
                  <Avatar className="h-28 w-28 md:h-24 md:w-24 border-4 border-background shadow-2xl transition-transform duration-300 group-hover:scale-105">
                    <AvatarImage src={detailedMember.avatar} alt={detailedMember.name} />
                    <AvatarFallback className="flex items-center justify-center text-3xl md:text-4xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 font-black tracking-tighter">
                      {detailedMember.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="mt-6 text-center md:text-left w-full">
                  <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">{detailedMember.name}</h2>
                  <div className="flex flex-col gap-3 mt-3">
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <Badge variant="outline" className={`${roleColors[detailedMember.role] || ''} font-bold px-3 py-1 text-sm rounded-full border-2`}>
                        {detailedMember.role}
                      </Badge>
                    </div>
                    <a href={`mailto:${detailedMember.email}`} className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center justify-center md:justify-start gap-2 font-medium">
                      <div className="p-1.5 rounded-full bg-primary/10"><Mail className="h-4 w-4 text-primary" /></div>
                      {detailedMember.email}
                    </a>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mt-8">
                    <StatBox icon={<Layers className="h-5 w-5" />} label="Projects" value={detailedMember.total_projects} colorClass="bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400" />
                    <StatBox icon={<CheckCircle2 className="h-5 w-5" />} label="Completed" value={tasksCompleted} colorClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" />
                    <StatBox icon={<ListTodo className="h-5 w-5" />} label="Pending" value={tasksPending} colorClass="bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400" />
                  </div>


                </div>
              </aside>

              <main className="space-y-8">
                <section>
                  <h4 className="text-sm font-bold text-primary uppercase tracking-widest mb-3 flex items-center gap-2"><FolderKanban className="h-5 w-5" /> Task Assignments</h4>
                  <div className="space-y-3">
                    {detailedMember.task_assignments.length > 0 ? (
                      detailedMember.task_assignments.map(task => (
                        <div key={task.id} className="flex items-center gap-4 p-3 rounded-lg border bg-muted/20 hover:bg-muted/50 transition-colors">
                          <div className={`h-2.5 w-2.5 rounded-full ${statusColors[task.status]} shrink-0`}></div>
                          <div className="flex-grow">
                            <p className="font-semibold text-foreground">{task.name}</p>
                            <Badge variant="outline" className="mt-1 text-xs font-semibold border-dashed">{task.project}</Badge>
                          </div>
                          <Badge variant="secondary" className="font-bold">{task.status}</Badge>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground italic py-8">No tasks assigned yet.</p>
                    )}
                  </div>
                </section>

                <section>
                  <h4 className="text-sm font-bold text-primary uppercase tracking-widest mb-3 flex items-center gap-2"><Briefcase className="h-5 w-5" /> Active Projects</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {detailedMember.active_projects.map(project => (
                      <div key={project.id} className="flex items-center gap-4 p-4 rounded-xl border-2 border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all group cursor-pointer shadow-sm">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Briefcase className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <span className="font-bold block">{project.name}</span>
                          <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{project.role}</span>
                        </div>
                        <ExternalLink className="h-5 w-5 ml-auto opacity-0 group-hover:opacity-100 transition-all text-primary" />
                      </div>
                    ))}
                  </div>
                </section>


                
                {detailedMember.last_active && (
                  <div className="flex items-center justify-center md:justify-start gap-2 pt-6 border-t border-border/50 mt-8">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground font-semibold">
                      Last active: {format(new Date(detailedMember.last_active), 'MMM d, yyyy, HH:mm')}
                    </p>
                  </div>
                )}
              </main>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MemberProfileDialog;
