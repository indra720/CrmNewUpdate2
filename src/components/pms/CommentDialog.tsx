// 'use client';

// import React, { useState, useEffect } from 'react';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { TaskViewTask, Comment } from '@/types';
// import { createTaskComment, deleteTaskComment, getTaskComments, updateTaskComment } from '@/lib/api'; // Import updateTaskComment
// import { useToast } from '@/hooks/use-toast';
// import { Loader2, Pencil } from 'lucide-react'; // Import Pencil for edit icon
// import { format } from 'date-fns';

// interface CommentDialogProps {
//   isOpen: boolean;
//   onClose: () => void;
//   task: TaskViewTask | null;
// }

// const CommentDialog: React.FC<CommentDialogProps> = ({ isOpen, onClose, task }) => {
//   const [newCommentText, setNewCommentText] = useState('');
//   const [isSavingComment, setIsSavingComment] = useState(false); // Renamed from isAddingComment
//   const [comments, setComments] = useState<Comment[]>([]);
//   const [isLoadingComments, setIsLoadingComments] = useState(true);
//   const [commentsError, setCommentsError] = useState<string | null>(null);
//   const [editingCommentId, setEditingCommentId] = useState<string | null>(null); // State for comment being edited
//   const [editingCommentText, setEditingCommentText] = useState(''); // State for text of comment being edited
//   const { toast } = useToast();

//   const fetchComments = async (taskId: string) => {
//     setIsLoadingComments(true);
//     setCommentsError(null);
//     try {
//       const fetchedComments = await getTaskComments(taskId);
//       setComments(fetchedComments);
//     } catch (err: any) {
//       setCommentsError(err.message || 'Failed to load comments.');
//       toast({
//         title: 'Error',
//         description: err.message || 'Failed to load comments.',
//         variant: 'destructive',
//       });
//     } finally {
//       setIsLoadingComments(false);
//     }
//   };

//   useEffect(() => {
//     if (isOpen && task && task.id) {
//       fetchComments(task.id);
//     } else {
//       setComments([]);
//       setIsLoadingComments(true);
//       setCommentsError(null);
//       setNewCommentText('');
//       setEditingCommentId(null); // Reset editing state on close
//       setEditingCommentText(''); // Reset editing state on close
//     }
//   }, [isOpen, task?.id]);

//   if (!task) return null;

//   const handleSaveComment = async () => { // Renamed from handleAddComment
//     const commentToSave = editingCommentId ? editingCommentText : newCommentText;

//     if (!commentToSave.trim()) {
//       toast({
//         title: 'Error',
//         description: 'Comment cannot be empty.',
//         variant: 'destructive',
//       });
//       return;
//     }
//     if (!task || !task.id) {
//       toast({
//         title: 'Error',
//         description: 'No task selected for commenting.',
//         variant: 'destructive',
//       });
//       return;
//     }

//     setIsSavingComment(true);
//     try {
//       if (editingCommentId) {
//         // Update existing comment
//         await updateTaskComment(editingCommentId, task.id, commentToSave);
//         toast({
//           title: 'Success',
//           description: 'Comment updated successfully.',
//         });
//         setEditingCommentId(null);
//         setEditingCommentText('');
//       } else {
//         // Add new comment
//         await createTaskComment(task.id, commentToSave);
//         toast({
//           title: 'Success',
//           description: 'Comment added successfully.',
//         });
//         setNewCommentText('');
//       }
//       fetchComments(task.id); // Re-fetch comments to update the displayed list
//     } catch (error: any) {
//       toast({
//         title: 'Error',
//         description: error.message || (editingCommentId ? 'Failed to update comment.' : 'Failed to add comment.'),
//         variant: 'destructive',
//       });
//     } finally {
//       setIsSavingComment(false);
//     }
//   };

//   const handleEditClick = (comment: Comment) => {
//     setEditingCommentId(comment.id);
//     setEditingCommentText(comment.comment);
//     setNewCommentText(comment.comment); // Also set the main textarea for editing
//   };

//   const handleCancelEdit = () => {
//     setEditingCommentId(null);
//     setEditingCommentText('');
//     setNewCommentText(''); // Clear main textarea
//   };

//   const currentCommentInput = editingCommentId ? editingCommentText : newCommentText;


//   // function to handle comment deletion
//   const handleDeleteComment = async (commentId: string) => {
//     try {
//       await deleteTaskComment(commentId);

//       //  Instant UI update (VERY IMPORTANT)
//       setComments(prev => prev.filter(c => c.id !== commentId));

//       toast({
//         title: "Success",
//         description: "Comment deleted successfully.",
//       });

//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.message || "Failed to delete comment.",
//         variant: "destructive",
//       });
//     }
//   };


//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="w-[90vw] sm:max-w-[425px] md:max-w-[700px] lg:max-w-[900px]">
//         <DialogHeader>
//           <DialogTitle>Comments for "{task.title}"</DialogTitle>
//           <DialogDescription>
            
//           </DialogDescription>
//         </DialogHeader>
//         <div className="py-4">
//           {/* Displaying comments */}
//           <div className="min-h-[150px] max-h-[400px] overflow-y-auto  border rounded-md p-2 mb-4">
//             {isLoadingComments ? (
//               <div className="flex justify-center items-center h-full">
//                 <Loader2 className="h-6 w-6 animate-spin" />
//                 <p className="ml-2 text-muted-foreground">Loading comments...</p>
//               </div>
//             ) : commentsError ? (
//               <p className="text-destructive">{commentsError}</p>
//             ) : comments.length === 0 ? (
//               <p className="text-muted-foreground">No comments yet.</p>
//             ) : (
//               <div className="space-y-4">
//                 {comments.map((comment) => (
//                   <div key={comment.id} className="border-b pb-2 last:border-b-0">
//                     <div className="flex justify-between items-center text-sm text-muted-foreground">
//                       <span className="font-medium text-foreground">{comment.commented_by_name || 'Unknown User'}</span>
//                       <span>{format(new Date(comment.created_at), 'MMM d, yyyy HH:mm')}</span>
//                     </div>
//                     <p className="text-sm mt-1">{comment.comment}</p>
//                     <div className="flex sm:justify-end gap-2 mt-2">
//                       <Button variant="ghost" size="sm" onClick={() => handleEditClick(comment)}>
//                         <Pencil className="h-4 w-4" /> Edit
//                       </Button>
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => handleDeleteComment(comment.id)}
//                         className="text-red-500 hover:text-red-600"
//                       >
//                         Delete
//                       </Button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Section for adding/editing a new comment */}
//           <div className="flex gap-2">
//             <textarea
//               className="flex-1 border rounded-md p-2 text-sm"
//               placeholder={editingCommentId ? "Edit comment..." : "Add a new comment..."}
//               rows={2}
//               value={currentCommentInput}
//               onChange={(e) => {
//                 if (editingCommentId) {
//                   setEditingCommentText(e.target.value);
//                 } else {
//                   setNewCommentText(e.target.value);
//                 }
//               }}
//               disabled={isSavingComment}
//             ></textarea>
//             <div className="flex flex-col gap-2 self-end">
//               {editingCommentId && (
//                 <Button variant="outline" onClick={handleCancelEdit} disabled={isSavingComment}>
//                   Cancel
//                 </Button>
//               )}
//               <Button
//                 className="self-end"
//                 onClick={handleSaveComment}
//                 disabled={isSavingComment || !currentCommentInput.trim()}
//               >
//                 {isSavingComment ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
//                 {editingCommentId ? (isSavingComment ? 'Saving...' : 'Save Changes') : (isSavingComment ? 'Adding...' : 'Add Comment')}
//               </Button>
//             </div>
//           </div>
//         </div>
//         <DialogFooter>
//           <Button variant="outline" onClick={onClose}>Close</Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default CommentDialog;




'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TaskViewTask, Comment } from '@/types';
import { createTaskComment, deleteTaskComment, getTaskComments, updateTaskComment } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface CommentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  task: TaskViewTask | null;
}

const CommentDialog: React.FC<CommentDialogProps> = ({ isOpen, onClose, task }) => {
  const [newCommentText, setNewCommentText] = useState('');
  const [isSavingComment, setIsSavingComment] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [commentsError, setCommentsError] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentText, setEditingCommentText] = useState('');
  const { toast } = useToast();

  const fetchComments = async (taskId: string) => {
    setIsLoadingComments(true);
    setCommentsError(null);
    try {
      const fetchedComments = await getTaskComments(taskId);
      setComments(fetchedComments);
    } catch (err: any) {
      setCommentsError(err.message || 'Failed to load comments.');
      toast({
        title: 'Error',
        description: err.message || 'Failed to load comments.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingComments(false);
    }
  };

  useEffect(() => {
    if (isOpen && task && task.id) {
      fetchComments(task.id);
    } else {
      setComments([]);
      setIsLoadingComments(true);
      setCommentsError(null);
      setNewCommentText('');
      setEditingCommentId(null);
      setEditingCommentText('');
    }
  }, [isOpen, task?.id]);

  if (!task) return null;

  const handleSaveComment = async () => {
    const commentToSave = editingCommentId ? editingCommentText : newCommentText;

    if (!commentToSave.trim()) {
      toast({
        title: 'Error',
        description: 'Comment cannot be empty.',
        variant: 'destructive',
      });
      return;
    }
    if (!task || !task.id) {
      toast({
        title: 'Error',
        description: 'No task selected for commenting.',
        variant: 'destructive',
      });
      return;
    }

    setIsSavingComment(true);
    try {
      if (editingCommentId) {
        await updateTaskComment(editingCommentId, task.id, commentToSave);
        toast({
          title: 'Success',
          description: 'Comment updated successfully.',
        });
        setEditingCommentId(null);
        setEditingCommentText('');
      } else {
        await createTaskComment(task.id, commentToSave);
        toast({
          title: 'Success',
          description: 'Comment added successfully.',
        });
        setNewCommentText('');
      }
      fetchComments(task.id);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || (editingCommentId ? 'Failed to update comment.' : 'Failed to add comment.'),
        variant: 'destructive',
      });
    } finally {
      setIsSavingComment(false);
    }
  };

  const handleEditClick = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditingCommentText(comment.comment);
    setNewCommentText(comment.comment);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingCommentText('');
    setNewCommentText('');
  };

  const currentCommentInput = editingCommentId ? editingCommentText : newCommentText;

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteTaskComment(commentId);
      setComments(prev => prev.filter(c => c.id !== commentId));
      toast({
        title: "Success",
        description: "Comment deleted successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete comment.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:w-[90vw] sm:max-w-[425px] md:max-w-[700px] lg:max-w-[900px] max-h-[90vh] flex flex-col p-4 sm:p-6">
        <DialogHeader className="pb-3">
          <DialogTitle className="text-base sm:text-lg md:text-xl pr-6 line-clamp-2">
            Comments for "{task.title}"
          </DialogTitle>
          <DialogDescription className="sr-only">
            View and manage task comments
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col min-h-0 gap-3 sm:gap-4">
          {/* Comments Display Area */}
          <div className="flex-1 min-h-[200px] max-h-[300px] sm:max-h-[400px] overflow-y-auto border rounded-md p-2 sm:p-3">
            {isLoadingComments ? (
              <div className="flex flex-col justify-center items-center h-full gap-2">
                <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin" />
                <p className="text-xs sm:text-sm text-muted-foreground">Loading comments...</p>
              </div>
            ) : commentsError ? (
              <p className="text-destructive text-xs sm:text-sm">{commentsError}</p>
            ) : comments.length === 0 ? (
              <p className="text-muted-foreground text-xs sm:text-sm text-center py-8">No comments yet.</p>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="border-b pb-3 last:border-b-0">
                    {/* Comment Header */}
                    <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-1 xs:gap-2 mb-2">
                      <span className="font-medium text-foreground text-xs sm:text-sm truncate">
                        {comment.commented_by_name || 'Unknown User'}
                      </span>
                      <span className="text-[10px] xs:text-xs text-muted-foreground whitespace-nowrap">
                        {format(new Date(comment.created_at), 'MMM d, yyyy HH:mm')}
                      </span>
                    </div>
                    
                    {/* Comment Text */}
                    <p className="text-xs sm:text-sm text-foreground break-words mb-2">
                      {comment.comment}
                    </p>
                    
                    {/* Action Buttons */}
                    <div className="flex justify-end gap-1 sm:gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEditClick(comment)}
                        className="h-7 sm:h-8 px-2 sm:px-3 text-xs"
                      >
                        <Pencil className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                        <span className="hidden xs:inline">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteComment(comment.id)}
                        className="h-7 sm:h-8 px-2 sm:px-3 text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                        <span className="hidden xs:inline">Delete</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add/Edit Comment Section */}
          <div className="flex flex-col sm:flex-row gap-2">
            <textarea
              className="flex-1 border rounded-md p-2 sm:p-3 text-xs sm:text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder={editingCommentId ? "Edit comment..." : "Add a new comment..."}
              rows={3}
              value={currentCommentInput}
              onChange={(e) => {
                if (editingCommentId) {
                  setEditingCommentText(e.target.value);
                } else {
                  setNewCommentText(e.target.value);
                }
              }}
              disabled={isSavingComment}
            ></textarea>
            
            <div className="flex sm:flex-col gap-2 sm:self-end">
              {editingCommentId && (
                <Button 
                  variant="outline" 
                  onClick={handleCancelEdit} 
                  disabled={isSavingComment}
                  className="flex-1 sm:flex-none h-9 sm:h-10 text-xs sm:text-sm"
                >
                  Cancel
                </Button>
              )}
              <Button
                onClick={handleSaveComment}
                disabled={isSavingComment || !currentCommentInput.trim()}
                className="flex-1 sm:flex-none h-9 sm:h-10 text-xs sm:text-sm"
              >
                {isSavingComment && <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin mr-1 sm:mr-2" />}
                {editingCommentId ? (isSavingComment ? 'Saving...' : 'Save') : (isSavingComment ? 'Adding...' : 'Add')}
              </Button>
            </div>
          </div>
        </div>
        
        <DialogFooter className="pt-3 sm:pt-4">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto h-9 sm:h-10 text-xs sm:text-sm">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
