import {
  BarChart3,
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  Users,
  FileText,
  TrendingUp,
  CreditCard,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/shared/web/components/ui/sidebar';
import { Link } from 'react-router';

const data = {
  navMain: [
    {
      title: 'Overview',
      items: [
        {
          title: 'Dashboard',
          url: '#',
          icon: Home,
          isActive: true,
        },
        {
          title: 'Analytics',
          url: '#',
          icon: BarChart3,
        },
        {
          title: 'Reports',
          url: '#',
          icon: FileText,
        },
      ],
    },
    {
      title: 'Management',
      items: [
        {
          title: 'Users',
          url: '#',
          icon: Users,
        },
        {
          title: 'Calendar',
          url: '#',
          icon: Calendar,
        },
        {
          title: 'Messages',
          url: '#',
          icon: Inbox,
        },
        {
          title: 'Billing',
          url: '#',
          icon: CreditCard,
        },
      ],
    },
    {
      title: 'Tools',
      items: [
        {
          title: 'Search',
          url: '#',
          icon: Search,
        },
        {
          title: 'Performance',
          url: '#',
          icon: TrendingUp,
        },
        {
          title: 'Settings',
          url: '#',
          icon: Settings,
        },
      ],
    },
  ],
};

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <BarChart3 className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Dashboard</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive}>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <span className="text-xs font-semibold">JD</span>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">John Doe</span>
                <span className="truncate text-xs">john@example.com</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
