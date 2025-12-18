'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, ChevronDown, PanelLeft, PanelRight } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { STAFF_SIDENAV_ITEMS } from '@/lib/constants';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Button } from '../ui/button';
import Link from 'next/link';


const NavItem = ({ item, isCollapsed, setSidebarOpen, LinkComponent }: { item: any; isCollapsed: boolean; setSidebarOpen: (open: boolean) => void; LinkComponent: React.ComponentType<any> }) => {
  const pathname = usePathname();
  
  const isActive = item.path === pathname || (item.submenu && item.subMenuItems.some((sub:any) => sub.path === pathname));

  // Function to handle link click and close sidebar
  const handleClick = () => {
    setSidebarOpen(false);
  };

  if (isCollapsed) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            {item.submenu ? (
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="w-full">
                       <Button variant="ghost" className={cn(
                          "flex items-center justify-center w-full h-12 p-3 text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors duration-200 rounded-lg",
                          isActive && 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground'
                        )}>
                          {item.icon}
                          <span className="sr-only">{item.title}</span>
                        </Button>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="right" align="start" className="ml-2 bg-popover border-border text-popover-foreground">
                    {item.subMenuItems.map((subItem: any) => (
                      <DropdownMenuItem key={subItem.title} asChild>
                        <LinkComponent href={subItem.path} className={cn(pathname === subItem.path && 'bg-accent')} onClick={handleClick}>
                          {subItem.title}
                        </LinkComponent>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
            ) : (
              <LinkComponent
                href={item.path}
                className={cn(
                  'flex items-center justify-center w-full h-12 p-3 text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors duration-200 rounded-lg',
                  isActive && 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground'
                )}
                onClick={handleClick}
              >
                {item.icon}
                 <span className="sr-only">{item.title}</span>
              </LinkComponent>
            )}
            
          </TooltipTrigger>
          <TooltipContent side="right" align="center">
            <p>{item.title}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (item.submenu) {
    return (
      <Collapsible defaultOpen={isActive}>
        <CollapsibleTrigger
          className={cn(
            'group flex items-center justify-between w-full p-3 text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors duration-200 rounded-lg',
            isActive && 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground'
          )}
        >
          <div className="flex items-center">
            {item.icon}
            <span className="ml-4">{item.title}</span>
          </div>
          <ChevronDown
            className={cn(
              'h-4 w-4 transition-transform duration-200',
              'group-data-[state=open]:rotate-180'
            )}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="py-1 pl-8">
          <ul className="space-y-1">
            {item.subMenuItems.map((subItem: any) => (
              <li key={subItem.title}>
                <LinkComponent
                  href={subItem.path}
                  className={cn(
                    'block p-2 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors duration-200 rounded-md',
                     pathname === subItem.path && 'text-primary-foreground bg-sidebar-primary/50 font-semibold'
                  )}
                  onClick={handleClick}
                >
                  {subItem.title}
                </LinkComponent>
              </li>
            ))}
          </ul>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <li>
      <LinkComponent
        href={item.path}
        className={cn(
          'flex items-center p-3 text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors duration-200 rounded-lg',
          isActive && 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground'
        )}
        onClick={handleClick}
      >
        {item.icon}
        <span className="ml-4">{item.title}</span>
      </LinkComponent>
    </li>
  );
};


const SidebarContent = ({ isCollapsed, setSidebarOpen }: { isCollapsed: boolean, setSidebarOpen: (open: boolean) => void }) => {
  const pathname = usePathname();
  const isActive = (path: string) => {
    if (path === '/staff') return pathname === path;
    return pathname.startsWith(path);
  };
  
  return (
    <ul className="space-y-2">
      {STAFF_SIDENAV_ITEMS.map((item) => (
          <NavItem key={item.title} item={item} isCollapsed={isCollapsed} setSidebarOpen={setSidebarOpen} LinkComponent={Link} />
      ))}
    </ul>
  );
};


export function StaffSidebar({ isSidebarOpen, setSidebarOpen, isCollapsed, setIsCollapsed }: { 
  isSidebarOpen: boolean, 
  setSidebarOpen: (open: boolean) => void,
  isCollapsed: boolean,
  setIsCollapsed: (collapsed: boolean) => void 
}) {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const storedUserName = localStorage.getItem('userName');
      const storedUserEmail = localStorage.getItem('userEmail');
      setUserName(storedUserName);
      setUserEmail(storedUserEmail);
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userRole');
      localStorage.removeItem('authToken');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userId');
    }
    router.push('/login');
  };

  const getFirstName = (name: string | null) => {
    if (!name) return '';
    return name.split(' ')[0];
  };

  const SidebarHeader = ({ isCollapsed, setIsCollapsed }: { isCollapsed: boolean, setIsCollapsed: (collapsed: boolean) => void }) => (
    <div className={cn("flex items-center h-20 border-b border-sidebar-border", isCollapsed ? "justify-center" : "px-4 justify-between")}>
      <div className="flex items-center">
        <Avatar className="h-10 w-10 bg-primary text-primary-foreground font-bold">
          <AvatarFallback className='bg-orange-500'>
            {userName ? userName[0].toUpperCase() : 'S'}
          </AvatarFallback>
        </Avatar>
        {!isCollapsed && <h1 className="ml-3 text-2xl font-bold text-white">{getFirstName(userName) || 'Staff'}</h1>}
      </div>
      {!isCollapsed && (
        <Button onClick={() => setIsCollapsed(true)} variant="ghost" className="hidden lg:flex justify-center h-8 w-8 p-0 text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground">
          <PanelLeft size={24} />
          <span className="sr-only">Collapse Sidebar</span>
        </Button>
      )}
    </div>
  );

  const SidebarStructure = ({ isCollapsed, setIsCollapsed, setSidebarOpen }: { isCollapsed: boolean, setIsCollapsed: (collapsed: boolean) => void, setSidebarOpen: (open: boolean) => void }) => (
    <>
      <SidebarHeader isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className="flex-1 overflow-y-auto" data-sidebar="content">
        <nav className="mt-4 p-4">
          <SidebarContent isCollapsed={isCollapsed} setSidebarOpen={setSidebarOpen}/>
        </nav>
      </div>
    </>
  );

  const SidebarFooter = ({ isCollapsed, setIsCollapsed }: { isCollapsed: boolean, setIsCollapsed: (collapsed: boolean) => void }) => (
      <div className={cn("p-4 border-t border-sidebar-border", isCollapsed ? "flex flex-col items-center" : "")}>
          {isCollapsed && (
             <Button onClick={() => setIsCollapsed(false)} variant="ghost" className="hidden lg:flex justify-center w-full mb-2 text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground">
              <PanelRight size={24} />
              <span className="sr-only">Expand Sidebar</span>
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center cursor-pointer group w-full ">
                <Avatar className="h-10 w-10  text-white font-bold">
                  <AvatarFallback className='bg-orange-500'>{userName ? userName[0].toUpperCase() : 'S'}</AvatarFallback>
                </Avatar>
                {!isCollapsed && (
                  <div className="ml-3">
                    <p className="text-sm font-medium">{userName || 'Staff User'}</p>
                    <p className="text-xs text-muted-foreground group-hover:text-sidebar-foreground/80">{userEmail || 'staff@nexus.com'}</p>
                  </div>
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mb-2 ml-2 bg-popover border-border text-popover-foreground" align="end" forceMount>
                 <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{userName || 'Staff User'}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                        {userEmail || 'staff@nexus.com'}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuItem>
                    <Link href="/staff/profile" className="flex items-center w-full">
                        <span>Profile</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
      </div>
  );


  return (
    <>
      {/* Mobile Sidebar */}
      <div className={cn(
          "lg:hidden fixed inset-0 z-40 bg-black/50 transition-opacity",
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )} onClick={() => setSidebarOpen(false)}></div>
      <aside className={cn(
        "lg:hidden fixed left-0 top-0 h-full bg-sidebar text-sidebar-foreground flex flex-col justify-between border-r border-sidebar-border z-50 transition-transform duration-300 ease-in-out",
        "w-60",
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <SidebarStructure isCollapsed={false} setIsCollapsed={() => {}} setSidebarOpen={setSidebarOpen} />
        <SidebarFooter isCollapsed={false} setIsCollapsed={() => {}}/>
      </aside>

      {/* Desktop Sidebar */}
      <aside className={cn(
          "hidden lg:fixed left-0 top-0 h-full bg-sidebar text-sidebar-foreground lg:flex flex-col border-r border-sidebar-border transition-all duration-300 ease-in-out",
          isCollapsed ? "w-18" : "w-60"
        )}>
          <div className='flex flex-col h-full'>
            <SidebarStructure isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} setSidebarOpen={function (open: boolean): void {
            throw new Error('Function not implemented.');
          } } />
            <SidebarFooter isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
          </div>
      </aside>
    </>
  );
}