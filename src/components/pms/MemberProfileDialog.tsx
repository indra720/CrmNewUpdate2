'use client';
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { TeamMember, Task, TaskStatus } from '@/lib/mock-team-members';
import { format } from 'date-fns';
import { Mail, Briefcase, Layers, CheckCircle2, ExternalLink, MessageSquare, Clock, ListTodo, FolderKanban } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MemberProfileDialogProps {
  member: TeamMember | null;
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

const MemberProfileDialog: React.FC<MemberProfileDialogProps> = ({ member, isOpen, onOpenChange }) => {
  if (!member) return null;

  const tasksCompleted = member.tasks.filter(t => t.status === 'Completed').length;
  const tasksPending = member.tasks.filter(t => t.status !== 'Completed').length;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95%] sm:max-w-4xl p-0 overflow-hidden border-none shadow-2xl max-h-[90vh] flex flex-col rounded-2xl">
        <div className="overflow-y-auto hide-scrollbar">
          <div className="h-12 md:h-12 bg-primary  relative">
            <div className="absolute inset-0 bg-black/10" />
          </div>

          <div className="relative p-4 sm:p-6 md:p-8">
            <div className="md:grid md:grid-cols-[300px_1fr] md:gap-8">
              <aside className="flex flex-col items-center md:items-start -mt-16 md:-mt-20 mb-8 md:mb-0">
                <div className="relative group">
                  <Avatar className="h-28 w-28 md:h-24 md:w-24 border-4 border-background shadow-2xl transition-transform duration-300 group-hover:scale-105">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback className="flex items-center justify-center text-3xl md:text-4xl  bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 font-black tracking-tighter">
                      {getInitials(member.name)}
                    </AvatarFallback>                  </Avatar>
                  
                </div>
                
                <div className="mt-6 text-center md:text-left w-full">
                  <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">{member.name}</h2>a
                  <div className="flex flex-col gap-3 mt-3">
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <Badge variant="outline" className={`${roleColors[member.role] || ''} font-bold px-3 py-1 text-sm rounded-full border-2`}>
                        {member.role}
                      </Badge>
                    </div>
                    <a href={`mailto:${member.email}`} className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center justify-center md:justify-start gap-2 font-medium">
                      <div className="p-1.5 rounded-full bg-primary/10"><Mail className="h-4 w-4 text-primary" /></div>
                      {member.email}
                    </a>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mt-8">
                    <StatBox icon={<Layers className="h-5 w-5" />} label="Projects" value={member.projects.length} colorClass="bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400" />
                    <StatBox icon={<CheckCircle2 className="h-5 w-5" />} label="Completed" value={tasksCompleted} colorClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" />
                    <StatBox icon={<ListTodo className="h-5 w-5" />} label="Pending" value={tasksPending} colorClass="bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400" />
                  </div>

                  <div className="hidden md:flex flex-col gap-3 mt-8">
                    <Button className="w-full gap-3 py-6 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-base font-bold rounded-xl" asChild>
                      <a href={`mailto:${member.email}`}><Mail className="h-5 w-5" /> Send Email</a>
                    </Button>
                    <Button variant="outline" className="w-full gap-3 py-6 border-2 border-primary/20 hover:bg-primary/5 text-base font-bold rounded-xl">
                      <MessageSquare className="h-5 w-5" /> Direct Message
                    </Button>
                  </div>
                </div>
              </aside>

              <main className="space-y-8">
                <section>
                  <h4 className="text-sm font-bold text-primary uppercase tracking-widest mb-3 flex items-center gap-2"><FolderKanban className="h-5 w-5" /> Task Assignments</h4>
                  <div className="space-y-3">
                    {member.tasks.length > 0 ? (
                      member.tasks.map(task => (
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
                    {member.projects.map(project => (
                      <div key={project} className="flex items-center gap-4 p-4 rounded-xl border-2 border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all group cursor-pointer shadow-sm">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Briefcase className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <span className="font-bold block">{project}</span>
                          <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Project Member</span>
                        </div>
                        <ExternalLink className="h-5 w-5 ml-auto opacity-0 group-hover:opacity-100 transition-all text-primary" />
                      </div>
                    ))}
                  </div>
                </section>

                <div className="flex flex-col sm:flex-row gap-3 md:hidden pt-4">
                  <Button className="flex-1 gap-2 h-12 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 font-bold rounded-xl" asChild>
                    <a href={`mailto:${member.email}`}><Mail className="h-4 w-4" /> Send Email</a>
                  </Button>
                  <Button variant="outline" className="flex-1 h-12 gap-2 border-2 border-primary/20 font-bold rounded-xl">
                    <MessageSquare className="h-4 w-4" /> Message
                  </Button>
                </div>
                
                {member.lastActivity && (
                  <div className="flex items-center justify-center md:justify-start gap-2 pt-6 border-t border-border/50 mt-8">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground font-semibold">
                      Last active: {format(member.lastActivity, 'MMM d, yyyy, HH:mm')}
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
