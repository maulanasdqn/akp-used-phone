import { TProductItem } from '@/shared/api/app/client';
import {
  Card,
  CardContent,
  Button,
  CardFooter,
  Badge,
} from '@/shared/web/components';
import { Heart, Package, Star, Zap } from 'lucide-react';
import { useCartStore } from '../../../stores/cart-store';
import { toast } from 'sonner';
import { Link } from 'react-router';

export const ProductCard = ({
  id,
  name,
  description,
  price,
  imageUrl,
  stockQuantity,
  sku,
}: TProductItem) => {
  const { addItem } = useCartStore();
  const isInStock = stockQuantity > 0;
  const isLowStock = stockQuantity > 0 && stockQuantity <= 5;

  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(price);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isInStock) {
      toast.error('This item is out of stock');
      return;
    }

    addItem({
      id,
      name,
      price,
      imageUrl: imageUrl || undefined,
      sku,
      stockQuantity,
    });

    toast.success(`${name} added to cart!`);
  };

  return (
    <Link to={`/${id}/detail`} className="block">
      <Card className="group hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 cursor-pointer bg-white/90 backdrop-blur-sm border-0 rounded-2xl overflow-hidden hover:-translate-y-2">
        <CardContent className="p-0">
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-purple-100 via-blue-100 to-cyan-100 rounded-t-2xl overflow-hidden">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Package className="h-16 w-16" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="absolute top-3 right-3 h-10 w-10 p-0 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <Heart className="h-5 w-5 text-red-500" />
            </Button>

            {isLowStock && (
              <Badge className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 rounded-full px-3 py-1 shadow-lg">
                🔥 Low Stock
              </Badge>
            )}
            {!isInStock && (
              <Badge className="absolute top-3 left-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white border-0 rounded-full px-3 py-1 shadow-lg">
                ❌ Out of Stock
              </Badge>
            )}

            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <Badge
                variant="secondary"
                className="text-xs bg-white/90 backdrop-blur-sm text-gray-700 border-0 rounded-full px-2 py-1"
              >
                SKU: {sku}
              </Badge>
              <Badge
                variant={isInStock ? 'default' : 'destructive'}
                className={`text-xs border-0 rounded-full px-2 py-1 ${
                  isInStock
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                    : 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                }`}
              >
                📦 {stockQuantity} left
              </Badge>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <h3 className="font-bold text-lg line-clamp-2 text-gray-900 group-hover:text-purple-700 transition-colors duration-300">
                {name}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                {description}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {formattedPrice}
                </span>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-xs text-gray-500 ml-1">(4.0)</span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-gray-500">Save up to</div>
                <div className="text-sm font-semibold text-green-600">
                  25% OFF
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0">
          <Button
            onClick={handleAddToCart}
            className={`w-full rounded-xl py-3 font-semibold transition-all duration-300 ${
              isInStock
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl hover:shadow-purple-500/25'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!isInStock}
          >
            {isInStock ? (
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Add to Cart
              </div>
            ) : (
              'Out of Stock'
            )}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};
