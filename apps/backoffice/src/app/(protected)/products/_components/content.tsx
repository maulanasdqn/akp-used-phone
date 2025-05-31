import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/web/components';
import { Edit, Trash2, Smartphone, Search } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { trpc, useDebounce } from '@/shared/web/utils';
import { authClient } from '../../../../auth';
import { toast } from 'sonner';

const productFormSchema = z.object({
  sku: z.string().min(1, 'SKU is required').max(50, 'SKU too long'),
  slug: z.string().min(1, 'Slug is required').max(100, 'Slug too long'),
  name: z.string().min(1, 'Name is required').max(200, 'Name too long'),
  description: z.string().min(1, 'Description is required'),
  price: z.coerce.number().positive('Price must be positive'),
  imageUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  stockQuantity: z.coerce.number().int().min(0, 'Stock cannot be negative'),
  minimumOrderQuantity: z.coerce
    .number()
    .int()
    .min(1, 'Minimum order must be at least 1'),
});

type ProductFormData = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  product?: any;
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

function ProductForm({
  product,
  onSubmit,
  onCancel,
  isLoading,
}: ProductFormProps) {
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      sku: product?.sku || '',
      slug: product?.slug || '',
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price || 0,
      imageUrl: product?.imageUrl || '',
      stockQuantity: product?.stockQuantity || 0,
      minimumOrderQuantity: product?.minimumOrderQuantity || 1,
    },
  });

  const handleSubmit = (data: ProductFormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SKU</FormLabel>
                <FormControl>
                  <Input placeholder="IP14PM-128-BLK" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="iphone-14-pro-max-128gb" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="iPhone 14 Pro Max 128GB Black" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Detailed product description..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (IDR)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="12500000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stockQuantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock Quantity</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="5" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="minimumOrderQuantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Min Order Qty</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? 'Saving...'
              : product
              ? 'Update Product'
              : 'Create Product'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function ProductsContent() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const { data: session } = authClient.useSession();

  // tRPC queries and mutations
  const {
    data: productsData,
    isLoading,
    error,
    refetch,
  } = trpc.products.getAll.useQuery({
    page,
    limit: 10,
    search: debouncedSearchTerm || undefined,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const createProductMutation = trpc.products.create.useMutation({
    onSuccess: () => {
      toast.success('Product created successfully');
      refetch();
      setIsCreateDialogOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create product');
    },
  });

  const updateProductMutation = trpc.products.update.useMutation({
    onSuccess: () => {
      toast.success('Product updated successfully');
      refetch();
      setEditingProduct(null);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update product');
    },
  });

  const deleteProductMutation = trpc.products.delete.useMutation({
    onSuccess: () => {
      toast.success('Product deleted successfully');
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete product');
    },
  });

  const products = productsData?.data ?? [];
  const totalItems = productsData?.meta?.total ?? 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(price);
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0)
      return { label: 'Out of Stock', variant: 'destructive' as const };
    if (stock <= 3)
      return { label: 'Low Stock', variant: 'secondary' as const };
    return { label: 'In Stock', variant: 'default' as const };
  };

  const handleCreateProduct = (data: ProductFormData) => {
    if (!session?.user?.id) {
      toast.error('You must be logged in to create products');
      return;
    }

    createProductMutation.mutate({
      ...data,
      imageUrl: data.imageUrl || null,
      createdBy: session.user.id,
    });
  };

  const handleUpdateProduct = (data: ProductFormData) => {
    if (!editingProduct) return;

    updateProductMutation.mutate({
      id: editingProduct.id,
      ...data,
      imageUrl: data.imageUrl || null,
    });
  };

  const handleDeleteProduct = (productId: string) => {
    deleteProductMutation.mutate({ id: productId });
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 mt-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Products Management</CardTitle>
            <p className="text-sm text-muted-foreground">
              Manage your used phone inventory
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                className="pl-10 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Smartphone className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                </DialogHeader>
                <ProductForm
                  onSubmit={handleCreateProduct}
                  onCancel={() => setIsCreateDialogOpen(false)}
                  isLoading={createProductMutation.isPending}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="text-center py-8">
              <p className="text-red-600">
                Error loading products. Please try again.
              </p>
            </div>
          )}

          {!isLoading && !error && products.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600">
                No products found.{' '}
                {searchTerm
                  ? 'Try adjusting your search.'
                  : 'Create your first product!'}
              </p>
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading products...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product: any) => {
                  const stockStatus = getStockStatus(product.stockQuantity);
                  return (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                            {product.imageUrl ? (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="h-8 w-8 rounded object-cover"
                              />
                            ) : (
                              <Smartphone className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground line-clamp-1">
                              {product.description}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.sku}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatPrice(product.price)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={
                            product.stockQuantity <= 3 &&
                            product.stockQuantity > 0
                              ? 'text-orange-600 font-medium'
                              : product.stockQuantity === 0
                              ? 'text-red-600 font-medium'
                              : ''
                          }
                        >
                          {product.stockQuantity} units
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={stockStatus.variant}>
                          {stockStatus.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(product.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Dialog
                            open={editingProduct?.id === product.id}
                            onOpenChange={(open: boolean) => {
                              if (!open) setEditingProduct(null);
                              else setEditingProduct(product);
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Edit Product</DialogTitle>
                              </DialogHeader>
                              <ProductForm
                                product={product}
                                onSubmit={handleUpdateProduct}
                                onCancel={() => setEditingProduct(null)}
                                isLoading={updateProductMutation.isPending}
                              />
                            </DialogContent>
                          </Dialog>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Product
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "
                                  {product.name}
                                  "? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDeleteProduct(product.id)
                                  }
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  disabled={deleteProductMutation.isPending}
                                >
                                  {deleteProductMutation.isPending
                                    ? 'Deleting...'
                                    : 'Delete'}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}

          {!isLoading && totalItems > 0 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-600">
                Showing {products.length} of {totalItems} products
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="text-sm">Page {page}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={products.length < 10}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
