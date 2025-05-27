import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/web/components/ui/card';
import { Badge } from '@/shared/web/components/ui/badge';
import { Button } from '@/shared/web/components/ui/button';
import { Progress } from '@/shared/web/components/ui/progress';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/web/components/ui/avatar';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/web/components/ui/table';
import {
  ArrowUpRight,
  ArrowDownRight,
  Users,
  CreditCard,
  Activity,
  DollarSign,
  TrendingUp,
  MoreHorizontal,
} from 'lucide-react';

const stats = [
  {
    title: 'Total Revenue',
    value: '$45,231.89',
    change: '+20.1%',
    trend: 'up',
    icon: DollarSign,
  },
  {
    title: 'Subscriptions',
    value: '+2350',
    change: '+180.1%',
    trend: 'up',
    icon: Users,
  },
  {
    title: 'Sales',
    value: '+12,234',
    change: '+19%',
    trend: 'up',
    icon: CreditCard,
  },
  {
    title: 'Active Now',
    value: '+573',
    change: '+201',
    trend: 'up',
    icon: Activity,
  },
];

const recentSales = [
  {
    name: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    amount: '+$1,999.00',
    avatar: '/placeholder.svg?height=32&width=32',
    initials: 'OM',
  },
  {
    name: 'Jackson Lee',
    email: 'jackson.lee@email.com',
    amount: '+$39.00',
    avatar: '/placeholder.svg?height=32&width=32',
    initials: 'JL',
  },
  {
    name: 'Isabella Nguyen',
    email: 'isabella.nguyen@email.com',
    amount: '+$299.00',
    avatar: '/placeholder.svg?height=32&width=32',
    initials: 'IN',
  },
  {
    name: 'William Kim',
    email: 'will@email.com',
    amount: '+$99.00',
    avatar: '/placeholder.svg?height=32&width=32',
    initials: 'WK',
  },
  {
    name: 'Sofia Davis',
    email: 'sofia.davis@email.com',
    amount: '+$39.00',
    avatar: '/placeholder.svg?height=32&width=32',
    initials: 'SD',
  },
];

const projects = [
  {
    name: 'Website Redesign',
    status: 'In Progress',
    progress: 75,
    dueDate: 'Dec 15, 2024',
  },
  {
    name: 'Mobile App',
    status: 'Planning',
    progress: 25,
    dueDate: 'Jan 30, 2025',
  },
  {
    name: 'API Integration',
    status: 'Completed',
    progress: 100,
    dueDate: 'Nov 20, 2024',
  },
  {
    name: 'Database Migration',
    status: 'In Progress',
    progress: 60,
    dueDate: 'Dec 10, 2024',
  },
];

export function DashboardContent() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 mt-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-500" />
                )}
                <span
                  className={
                    stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                  }
                >
                  {stat.change}
                </span>
                from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Chart visualization would go here</p>
                <p className="text-sm">Revenue trends over time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>You made 265 sales this month.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {recentSales.map((sale) => (
                <div key={sale.email} className="flex items-center">
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={sale.avatar || '/placeholder.svg'}
                      alt="Avatar"
                    />
                    <AvatarFallback>{sale.initials}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {sale.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {sale.email}
                    </p>
                  </div>
                  <div className="ml-auto font-medium">{sale.amount}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Projects</CardTitle>
            <CardDescription>
              Manage your ongoing projects and their progress.
            </CardDescription>
          </div>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.name}>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        project.status === 'Completed'
                          ? 'default'
                          : project.status === 'In Progress'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {project.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={project.progress} className="w-[60px]" />
                      <span className="text-sm text-muted-foreground">
                        {project.progress}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{project.dueDate}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">More actions</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
