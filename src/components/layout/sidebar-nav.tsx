
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { SIDENAV_ITEMS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useSidebar } from '../ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { buttonVariants } from '../ui/button';

export function SidebarNav() {
  const { state } = useSidebar();
  const pathname = usePathname();

  if (state === 'collapsed') {
    return (
      <nav className="grid gap-1 p-2">
        <TooltipProvider>
          {SIDENAV_ITEMS.map((item, index) =>
            item.submenu ? (
              <Collapsible key={index}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <CollapsibleTrigger asChild>
                        <span
                            className={cn(
                            buttonVariants({ variant: 'ghost', size: 'icon' }),
                            'h-10 w-10',
                            item.subMenuItems.some(sub => pathname.startsWith(sub.path)) && 'bg-accent'
                            )}
                        >
                            {item.icon}
                            <span className="sr-only">{item.title}</span>
                        </span>
                        </CollapsibleTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="flex items-center gap-4">
                        {item.title}
                        <ChevronDown className="ml-auto h-4 w-4" />
                    </TooltipContent>
                </Tooltip>
                <CollapsibleContent asChild>
                    <div className="absolute left-full top-0 ml-2 hidden group-hover:block">
                        <div className="bg-background border rounded-md p-1 min-w-[150px]">
                            {item.subMenuItems.map((subItem, subIndex) => (
                                <Link
                                    key={subIndex}
                                    href={subItem.path}
                                    className={cn(
                                        buttonVariants({ variant: 'ghost', size: 'sm' }),
                                        'h-8 justify-start gap-2 w-full',
                                        pathname === subItem.path && 'bg-accent'
                                    )}
                                >
                                    {subItem.icon}
                                    <span className="font-medium">{subItem.title}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.path ?? '#'}
                    className={cn(
                      buttonVariants({ variant: 'ghost', size: 'icon' }),
                      'h-10 w-10',
                      pathname === item.path && 'bg-accent'
                    )}
                  >
                    {item.icon}
                    <span className="sr-only">{item.title}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{item.title}</TooltipContent>
              </Tooltip>
            )
          )}
        </TooltipProvider>
      </nav>
    );
  }

  return (
    <nav className="grid gap-1 p-2">
      {SIDENAV_ITEMS.map((item, index) =>
        item.submenu ? (
          <Collapsible key={index} className="grid gap-1" defaultOpen={item.subMenuItems.some(sub => pathname.startsWith(sub.path))}>
            <CollapsibleTrigger
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'default' }),
                'group flex h-10 w-full items-center justify-start gap-2',
                 item.subMenuItems.some(sub => pathname.startsWith(sub.path)) && 'bg-accent'
              )}
            >
              {item.icon}
              <span className="font-medium">{item.title}</span>
              <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="ml-4 grid gap-1 pl-4 border-l">
              {item.subMenuItems.map((subItem, subIndex) => (
                <Link
                  key={subIndex}
                  href={subItem.path}
                  className={cn(
                    buttonVariants({ variant: 'ghost', size: 'sm' }),
                    'h-8 justify-start gap-2',
                    pathname === subItem.path && 'bg-accent'
                  )}
                >
                  {subItem.icon}
                  <span className="font-medium">{subItem.title}</span>
                </Link>
              ))}
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <Link
            key={index}
            href={item.path ?? '#'}
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'default' }),
              'h-10 justify-start gap-2',
              pathname === item.path && 'bg-accent'
            )}
          >
            {item.icon}
            <span className="font-medium">{item.title}</span>
          </Link>
        )
      )}
    </nav>
  );
}
