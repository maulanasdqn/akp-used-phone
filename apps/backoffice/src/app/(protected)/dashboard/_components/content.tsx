import {
  Card,
  Progress,
  CardContent,
  Button,
  CardDescription,
  Badge,
  CardHeader,
  CardTitle,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/web/components';
import {
  ArrowUpRight,
  ArrowDownRight,
  Smartphone,
  CreditCard,
  Package,
  DollarSign,
  TrendingUp,
  MoreHorizontal,
  AlertTriangle,
  Star,
} from 'lucide-react';

const stats = [
  {
    title: 'Total Revenue',
    value: 'Rp 125,450,000',
    change: '+15.2%',
    trend: 'up',
    icon: DollarSign,
  },
  {
    title: 'Phones Sold',
    value: '342',
    change: '+23.1%',
    trend: 'up',
    icon: CreditCard,
  },
  {
    title: 'Active Listings',
    value: '1,247',
    change: '+8.5%',
    trend: 'up',
    icon: Package,
  },
  {
    title: 'Low Stock Items',
    value: '18',
    change: '-12%',
    trend: 'down',
    icon: AlertTriangle,
  },
];

const recentSales = [
  {
    name: 'iPhone 14 Pro Max',
    customer: 'Ahmad Rizki',
    amount: 'Rp 12,500,000',
    condition: 'Excellent',
    avatar: '/placeholder.svg?height=32&width=32',
    initials: 'IP',
  },
  {
    name: 'Samsung Galaxy S23',
    customer: 'Siti Nurhaliza',
    amount: 'Rp 8,750,000',
    condition: 'Very Good',
    avatar: '/placeholder.svg?height=32&width=32',
    initials: 'SG',
  },
  {
    name: 'iPhone 13 Mini',
    customer: 'Budi Santoso',
    amount: 'Rp 7,200,000',
    condition: 'Good',
    avatar: '/placeholder.svg?height=32&width=32',
    initials: 'IP',
  },
  {
    name: 'Xiaomi 13 Pro',
    customer: 'Maya Sari',
    amount: 'Rp 6,500,000',
    condition: 'Excellent',
    avatar: '/placeholder.svg?height=32&width=32',
    initials: 'XI',
  },
  {
    name: 'OnePlus 11',
    customer: 'Dedi Kurniawan',
    amount: 'Rp 5,800,000',
    condition: 'Very Good',
    avatar: '/placeholder.svg?height=32&width=32',
    initials: 'OP',
  },
];

const inventory = [
  {
    brand: 'iPhone',
    model: '14 Pro Max',
    condition: 'Excellent',
    stock: 12,
    price: 'Rp 12,500,000',
    status: 'In Stock',
  },
  {
    brand: 'Samsung',
    model: 'Galaxy S23 Ultra',
    condition: 'Very Good',
    stock: 8,
    price: 'Rp 9,200,000',
    status: 'In Stock',
  },
  {
    brand: 'iPhone',
    model: '13 Pro',
    condition: 'Good',
    stock: 3,
    price: 'Rp 8,500,000',
    status: 'Low Stock',
  },
  {
    brand: 'Google',
    model: 'Pixel 7 Pro',
    condition: 'Excellent',
    stock: 0,
    price: 'Rp 7,800,000',
    status: 'Out of Stock',
  },
  {
    brand: 'Xiaomi',
    model: '13 Pro',
    condition: 'Very Good',
    stock: 15,
    price: 'Rp 6,500,000',
    status: 'In Stock',
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
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>
              Monthly sales performance and trends
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Sales chart visualization would go here</p>
                <p className="text-sm">Revenue and units sold over time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>Latest phone sales this week.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {recentSales.map((sale, index) => (
                <div key={index} className="flex items-center">
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={sale.avatar || '/placeholder.svg'}
                      alt="Phone"
                    />
                    <AvatarFallback>{sale.initials}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {sale.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {sale.customer} • {sale.condition}
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
            <CardTitle>Inventory Status</CardTitle>
            <CardDescription>
              Current stock levels and pricing for used phones.
            </CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Smartphone className="h-4 w-4 mr-2" />
            Add Phone
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Brand & Model</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{item.brand}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.model}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        item.condition === 'Excellent'
                          ? 'default'
                          : item.condition === 'Very Good'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      <Star className="h-3 w-3 mr-1" />
                      {item.condition}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span
                      className={
                        item.stock <= 3 ? 'text-orange-600 font-medium' : ''
                      }
                    >
                      {item.stock} units
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">{item.price}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        item.status === 'In Stock'
                          ? 'default'
                          : item.status === 'Low Stock'
                          ? 'secondary'
                          : 'destructive'
                      }
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
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
