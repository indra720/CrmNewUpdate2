  'use client';
  import React, { useState, useMemo } from 'react';
  import { MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react';
  import { format } from 'date-fns';
  import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragStartEvent,
    DragOverlay,
  } from '@dnd-kit/core';
  import {
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
  } from '@dnd-kit/sortable';
  import { CSS } from '@dnd-kit/utilities';

  import { TaskViewTask } from '@/types'; // Changed from Task
  import { Card, CardContent } from '@/components/ui/card';
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from '@/components/ui/dropdown-menu';
  import { Badge } from '@/components/ui/badge';
  import { Button } from '@/components/ui/button';
  import { useDroppable } from '@dnd-kit/core';

  // Import the new dialogs
  import TaskDetailsDialog from './TaskDetailsDialog';
  import { TaskFormDialog } from '@/components/forms/TaskFormDialog'; // Changed from EditProjectTaskDialog
  import DeleteConfirmationDialog from './DeleteConfirmationDialog';

  const priorityVariant: { [key in TaskViewTask['priority']]: 'destructive' | 'default' | 'secondary' } = { // Changed from Task
    'high': 'destructive',
    'medium': 'default',
    'low': 'secondary',
  };

  // --- TaskCard for Display (used in Overlay and Sortable) ---
  interface TaskCardProps {
    task: TaskViewTask; // Changed from Task
    onView?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    isOverlay?: boolean;
  }
  const TaskCard: React.FC<TaskCardProps> = ({ task, onView, onEdit, onDelete, isOverlay = false }) => (
    <Card className={`mb-4 bg-card transition-shadow duration-200 ${isOverlay ? 'shadow-lg' : 'hover:shadow-md'}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <p className="font-semibold text-sm leading-tight pr-2">{task.title}</p>
          {!isOverlay && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-6 w-6 p-0 flex-shrink-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[40px]">
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    onView && onView();
                  }}
                  className="px-2 py-1"
                >
                  <span>
                    <Eye className="mr-2 h-4 w-4" />
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    onEdit && onEdit();
                  }}
                  className="px-2 py-1"
                >
                  <span>
                    <Pencil className="mr-2 h-4 w-4" />
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    onDelete && onDelete();
                  }}
                  className="text-red-600 dark:text-red-400 focus:text-red-500 dark:focus:text-red-500 px-2 py-1"
                >
                  <span>
                    <Trash2 className="mr-2 h-4 w-4" />
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{task.id}</span>
          <span>Due: {format(task.dueDate, 'MMM d')}</span>
        </div>
        <div className="flex items-center justify-between mt-3">
          <Badge variant={priorityVariant[task.priority]} className='capitalize'>{task.priority}</Badge>
          <div className="text-sm font-medium">{task.assignee.name}</div>
        </div>
      </CardContent>
    </Card>
  );

  // --- Sortable TaskCard ---
  interface SortableTaskCardProps extends Omit<TaskCardProps, 'isOverlay'> {}
  const SortableTaskCard: React.FC<SortableTaskCardProps> = ({ task, onView, onEdit, onDelete }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.3 : 1,
    };
    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-none">
        <TaskCard task={task} onView={onView} onEdit={onEdit} onDelete={onDelete} />
      </div>
    );
  };

  // --- Droppable Column ---
  interface DroppableColumnProps {
    id: TaskViewTask['status']; // Changed from Task
    title: string;
    tasks: TaskViewTask[]; // Changed from Task
    onViewTask: (task: TaskViewTask) => void; // Changed from Task
    onEditTask: (task: TaskViewTask) => void; // Changed from Task
    onDeleteTask: (task: TaskViewTask) => void; // Changed from Task
  }
  const DroppableColumn: React.FC<DroppableColumnProps> = ({ id, title, tasks, onViewTask, onEditTask, onDeleteTask }) => {
    const { setNodeRef } = useDroppable({ id });
    const taskIds = useMemo(() => tasks.map(t => t.id), [tasks]);
    return (
      <div className="bg-muted/60 rounded-lg">
        <div className="p-4 border-b"><h3 className="font-semibold flex items-center">{title}<span className='ml-2 text-sm bg-muted-foreground/20 text-muted-foreground rounded-full px-2 py-0.5'>{tasks.length}</span></h3></div>
        <div ref={setNodeRef} className="p-4 h-[60vh] overflow-y-auto">
          <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
            {tasks.length > 0 ? (
              tasks.map(task => <SortableTaskCard key={task.id} task={task} onView={() => onViewTask(task)} onEdit={() => onEditTask(task)} onDelete={() => onDeleteTask(task)} />)
            ) : ( <div className="flex items-center justify-center h-full"><p className="text-sm text-center text-muted-foreground mt-4">No tasks here.</p></div>)}
          </SortableContext>
        </div>
      </div>
    );
  };

  // --- Main TaskBoardView ---
  interface TaskBoardViewProps {
    tasks: TaskViewTask[]; // Changed from Task
    setTasks: React.Dispatch<React.SetStateAction<TaskViewTask[]>>; // Changed from Task
    columns?: TaskViewTask['status'][]; // Changed from Task
    onTaskUpdatedOrAdded: () => void; // Added for re-fetching
  }
  const TaskBoardView: React.FC<TaskBoardViewProps> = ({ tasks, setTasks, columns: columnsProp, onTaskUpdatedOrAdded }) => {
    const [activeTask, setActiveTask] = useState<TaskViewTask | null>(null); // Changed from Task
    const [selectedTask, setSelectedTask] = useState<TaskViewTask | null>(null); // Changed from Task
    const [dialogs, setDialogs] = useState({ details: false, edit: false, delete: false });

    const columns: TaskViewTask['status'][] = columnsProp || ['To Do', 'In Progress', 'Done']; // Changed from Task
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

    const handleDragStart = (event: DragStartEvent) => {
      const task = tasks.find(t => t.id === event.active.id);
      setActiveTask(task || null);
    };

    const handleDragEnd = (event: DragEndEvent) => {
      setActiveTask(null);
      const { active, over } = event;
      if (over && active.id !== over.id) {
        setTasks((items) => {
          const activeIndex = items.findIndex((item) => item.id === active.id);
          const overId = over.id as TaskViewTask['status'] | string; // Changed from Task['status'] | Task['id']
          const overColumn = columns.includes(overId as TaskViewTask['status']) ? (overId as TaskViewTask['status']) : items.find(t => t.id === overId)?.status; // Changed from Task['status']
          if (!overColumn) return items;
          const activeTask = items[activeIndex];
          if (activeTask.status !== overColumn) {
            const updatedItems = [...items];
            updatedItems[activeIndex] = { ...activeTask, status: overColumn };
            return updatedItems;
          }
          return items;
        });
      }
    };

    const openDialog = (type: 'details' | 'edit' | 'delete', task: TaskViewTask) => { // Changed from Task
      setSelectedTask(task);
      setDialogs(d => ({ ...d, [type]: true }));
    };

    const closeDialog = (type: 'details' | 'edit' | 'delete') => {
      setDialogs(d => ({ ...d, [type]: false }));
      setTimeout(() => setSelectedTask(null), 300);
    };
    
    const handleDeleteConfirm = () => {
      if (selectedTask) {
        setTasks(tasks.filter(t => t.id !== selectedTask.id));
      }
      closeDialog('delete');
    };

    // No longer needed here, as TaskFormDialog handles update API calls and onTaskUpdatedOrAdded will re-fetch
    // const handleTaskUpdate = (updatedTask: Task) => {
    //   setTasks(currentTasks => 
    //     currentTasks.map(t => t.id === updatedTask.id ? updatedTask : t)
    //   );
    // };

    const groupedTasks = useMemo(() => {
      const initialGroups: { [key in TaskViewTask['status']]: TaskViewTask[] } = { 'To Do': [], 'In Progress': [], 'Done': [] }; // Changed from Task
      return tasks.reduce((acc, task) => {
        if (acc[task.status]) acc[task.status].push(task);
        return acc;
      }, initialGroups);
    }, [tasks]);

    return (
      <>
        <DndContext id="pms-task-board" sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {columns.map(status => (
              <DroppableColumn key={status} id={status} title={status} tasks={groupedTasks[status]} onViewTask={(task) => openDialog('details', task)} onEditTask={(task) => openDialog('edit', task)} onDeleteTask={(task) => openDialog('delete', task)} />
            ))}
          </div>
          <DragOverlay>{activeTask ? <TaskCard task={activeTask} isOverlay /> : null}</DragOverlay>
        </DndContext>

        <TaskDetailsDialog isOpen={dialogs.details} onOpenChange={() => closeDialog('details')} task={selectedTask} />
        {/* Replaced EditProjectTaskDialog with TaskFormDialog */}
        <TaskFormDialog 
          isOpen={dialogs.edit} 
          onOpenChange={() => closeDialog('edit')} 
          initialTask={selectedTask} 
          onTaskSubmitted={onTaskUpdatedOrAdded} // Trigger re-fetch in parent
        />
        <DeleteConfirmationDialog isOpen={dialogs.delete} onOpenChange={() => closeDialog('delete')} task={selectedTask} onConfirm={handleDeleteConfirm} />
      </>
    );
  };

  export default TaskBoardView;










