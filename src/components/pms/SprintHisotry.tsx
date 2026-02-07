// import React, { useEffect, useState } from 'react'
// import { Sprint } from './sprint-types';
// import { fetchSprints, fetchSprintsHistory } from '@/lib/api';
// import { Card, CardContent } from '../ui/card';

// import { Badge } from '../ui/badge';
// import { Calendar } from '../ui/calendar';
// import { Button } from '../ui/button';
// import { format } from 'date-fns';
// import { CheckCircle2 } from 'lucide-react';
// import { Target } from 'lucide-react';
// import { Progress } from '../ui/progress';
// import { differenceInDays } from 'date-fns';

// const SprintHistory = () => {
//     const [sprints, setSprints] = useState<Sprint[]>([]); // Initialize with empty array

//     const [isLoadingSprints, setIsLoadingSprints] = useState(true); // New loading state for sprints
//     const [sprintsError, setSprintsError] = useState<string | null>(null); // New error state for sprints
//     const loadSprints = async () => {
//         setIsLoadingSprints(true);
//         setSprintsError(null);
//         try {
//             const fetchedSprints: Sprint[] = await fetchSprintsHistory();
//             console.log("Fetched Sprints:", fetchedSprints); // Add this log
//             setSprints(fetchedSprints);
//             // Set an active sprint, e.g., the first 'Active' one or the first in the list

//         } catch (err: any) {
//             setSprintsError(err.message || "Failed to fetch sprints.");
//         } finally {
//             setIsLoadingSprints(false);
//         }
//     };

//     // Effect to load sprints on component mount
//     useEffect(() => {
//         loadSprints();
//     }, []);
//     return (
//         <>
//             {sprints.length > 0 && (
//                 <Card className="border-none shadow-sm bg-primary text-primary-foreground overflow-hidden">
//                     <CardContent className="p-0">
//                         <div className="flex flex-col md:flex-row items-stretch">
//                             <div className="p-6 md:w-1/3 bg-black/10 dark:bg-black/20">
//                                 <div className="flex items-center gap-2 mb-2">
//                                     <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 uppercase text-[10px]">
//                                         {sprints[0].status}
//                                     </Badge>
//                                     <span className="text-sm opacity-80">{sprints[0].number}</span>
//                                 </div>
//                                 <h2 className="text-xl font-bold mb-1">{sprints[0].name}</h2>
//                                 <p className="text-sm opacity-90 line-clamp-1 italic">"{sprints[0].goal}"</p>
//                                 <div className="flex items-center gap-4 mt-4 text-xs opacity-80">
//                                     <div className="flex items-center gap-1">
//                                         <Calendar className="w-3 h-3" />
//                                         {format(new Date(sprints[0].startDate), 'MMM d')} - {format(new Date(sprints[0].endDate), 'MMM d')}
//                                     </div>
//                                     <div className="flex items-center gap-1">
//                                         <Target className="w-3 h-3" />
//                                         {sprints[0].storyPointsTarget} SP Target
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="p-6 flex-1 flex flex-col justify-center">

//                                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
//                                     <div>
//                                         <p className="text-[10px] uppercase opacity-70 tracking-wider">Completed</p>
//                                         {/* <p className="text-lg font-bold">{completedStoryPoints} <span className="text-sm font-normal opacity-70">pts</span></p> */}
//                                     </div>
//                                     <div>
//                                         <p className="text-[10px] uppercase opacity-70 tracking-wider">Days Left</p>
//                                         <p className="text-lg font-bold">{differenceInDays(new Date(sprints[0].endDate), new Date())} <span className="text-sm font-normal opacity-70">days</span></p>
//                                     </div>
//                                     <div>
//                                         <p className="text-[10px] uppercase opacity-70 tracking-wider">Sprint Health</p>
//                                         <div className="flex items-center gap-1 text-success">
//                                             <CheckCircle2 className="w-4 h-4" />
//                                             <span className="text-sm font-bold">Healthy</span>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="p-6 md:w-1/4 border-l border-white/10 dark:border-primary-foreground/20 flex flex-col justify-center items-center gap-3">

//                                 {sprints[0].status === 'Completed' && (
//                                     <Button className="w-full bg-muted text-muted-foreground" disabled>
//                                         Sprint Completed
//                                     </Button>
//                                 )}
//                             </div>
//                         </div>
//                     </CardContent>
//                 </Card>
//             )}
//         </>
//     )
// }

// export default SprintHistory
