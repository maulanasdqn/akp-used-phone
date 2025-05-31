import { TProductItem } from '@/shared/api/app';
import {
  Card,
  CardContent,
  Button,
  CardFooter,
  Badge,
} from '@/shared/web/components';
import { Heart, Package } from 'lucide-react';

export const ProductCard = ({
  id,
  name,
  description,
  price,
  imageUrl,
  stockQuantity,
  sku,
}: TProductItem) => {
  const isInStock = stockQuantity > 0;
  const isLowStock = stockQuantity > 0 && stockQuantity <= 5;

  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(price);

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300 cursor-pointer">
      <CardContent className="p-4">
        <div className="relative mb-4">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Package className="h-12 w-12" />
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 hover:bg-white"
          >
            <Heart className="h-4 w-4" />
          </Button>
          {isLowStock && (
            <Badge className="absolute top-2 left-2 bg-orange-500">
              Low Stock
            </Badge>
          )}
          {!isInStock && (
            <Badge className="absolute top-2 left-2 bg-red-500">
              Out of Stock
            </Badge>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              SKU: {sku}
            </Badge>
            <Badge
              variant={isInStock ? 'default' : 'destructive'}
              className="text-xs"
            >
              {stockQuantity} in stock
            </Badge>
          </div>
          <h3 className="font-semibold text-sm line-clamp-2">{name}</h3>
          <p className="text-xs text-gray-600 line-clamp-2">{description}</p>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              {formattedPrice}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" size="sm" disabled={!isInStock}>
          {isInStock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </CardFooter>
    </Card>
  );
};
