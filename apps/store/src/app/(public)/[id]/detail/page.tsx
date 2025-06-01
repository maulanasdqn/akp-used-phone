import { useParams, Link } from 'react-router';
import { useState } from 'react';
import { Header } from '../../_components/header';
import { CartSidebar } from '../../_components/cart-sidebar';
import { AuthModal } from '../../_components/auth-modal';
import {
  Button,
  Badge,
  Skeleton,
  Card,
  CardContent,
  Separator,
} from '@/shared/web/components';
import {
  ArrowLeft,
  Heart,
  Share2,
  Star,
  Package,
  Shield,
  Truck,
  RotateCcw,
  Zap,
  Plus,
  Minus,
  ShoppingCart,
  CheckCircle,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { trpc } from '@/shared/web/utils';
import { useCartStore } from '../../../../stores/cart-store';
import { toast } from 'sonner';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const { addItem } = useCartStore();

  const {
    data: product,
    isLoading,
    error,
  } = trpc.products.getById.useQuery({ id: id! }, { enabled: !!id });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
        <Header />
        <main className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100/20 via-blue-100/20 to-cyan-100/20 pointer-events-none"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
              <Skeleton className="h-10 w-32 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                <Skeleton className="aspect-square rounded-2xl bg-gradient-to-br from-purple-100 to-blue-100" />
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton
                      key={i}
                      className="aspect-square rounded-xl bg-gradient-to-br from-purple-100 to-blue-100"
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="space-y-4">
                  <Skeleton className="h-8 w-3/4 bg-gradient-to-r from-purple-200 to-blue-200 rounded-lg" />
                  <Skeleton className="h-12 w-1/2 bg-gradient-to-r from-purple-300 to-blue-300 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg" />
                    <Skeleton className="h-4 w-5/6 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg" />
                    <Skeleton className="h-4 w-4/5 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg" />
                  </div>
                </div>
                <Skeleton className="h-16 w-full bg-gradient-to-r from-purple-200 to-blue-200 rounded-xl" />
              </div>
            </div>
          </div>
        </main>
        <CartSidebar onCheckout={() => setIsAuthModalOpen(true)} />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={() =>
            toast.success('Welcome! You can now proceed with your purchase.')
          }
        />
      </div>
    );
  }

  if (error || !product || 'message' in product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
        <Header />
        <main className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100/20 via-blue-100/20 to-cyan-100/20 pointer-events-none"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="h-12 w-12 text-red-500" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Product Not Found
              </h1>
              <p className="text-gray-600 mb-8">
                The product you're looking for doesn't exist or has been
                removed.
              </p>
              <Link to="/">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <CartSidebar onCheckout={() => setIsAuthModalOpen(true)} />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={() =>
            toast.success('Welcome! You can now proceed with your purchase.')
          }
        />
      </div>
    );
  }

  const isInStock = product.stockQuantity > 0;
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 5;
  const maxQuantity = Math.min(product.stockQuantity, 10);

  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(product.price);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!isInStock) {
      toast.error('This item is out of stock');
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl || undefined,
        sku: product.sku,
        stockQuantity: product.stockQuantity,
      });
    }

    toast.success(
      `${quantity} ${product.name}${quantity > 1 ? 's' : ''} added to cart!`
    );
    setQuantity(1);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    toast.success(
      isFavorited ? 'Removed from favorites' : 'Added to favorites'
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      <Header />

      <main className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100/20 via-blue-100/20 to-cyan-100/20 pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Link to="/">
              <Button
                variant="ghost"
                className="hover:bg-white/90 backdrop-blur-sm rounded-xl transition-all duration-300"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Products
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-purple-100 via-blue-100 to-cyan-100 rounded-2xl overflow-hidden">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Package className="h-24 w-24" />
                    </div>
                  )}
                </div>

                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleFavorite}
                    className="h-10 w-10 p-0 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        isFavorited
                          ? 'text-red-500 fill-current'
                          : 'text-gray-600'
                      }`}
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleShare}
                    className="h-10 w-10 p-0 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Share2 className="h-5 w-5 text-gray-600" />
                  </Button>
                </div>

                {isLowStock && (
                  <Badge className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 rounded-full px-3 py-1 shadow-lg">
                    🔥 Low Stock
                  </Badge>
                )}
                {!isInStock && (
                  <Badge className="absolute top-4 left-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white border-0 rounded-full px-3 py-1 shadow-lg">
                    ❌ Out of Stock
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className="aspect-square bg-gradient-to-br from-purple-100 via-blue-100 to-cyan-100 rounded-xl overflow-hidden cursor-pointer hover:ring-2 hover:ring-purple-300 transition-all duration-300"
                  >
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={`${product.name} view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Package className="h-8 w-8" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="text-xs bg-white/90 backdrop-blur-sm text-gray-700 border-0 rounded-full px-3 py-1"
                  >
                    SKU: {product.sku}
                  </Badge>
                  <Badge
                    variant={isInStock ? 'default' : 'destructive'}
                    className={`text-xs border-0 rounded-full px-3 py-1 ${
                      isInStock
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                        : 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                    }`}
                  >
                    📦 {product.stockQuantity} in stock
                  </Badge>
                </div>

                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                  {product.name}
                </h1>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < 4
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">
                      (4.0) • 127 reviews
                    </span>
                  </div>
                </div>

                <div className="flex items-baseline gap-4">
                  <span className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    {formattedPrice}
                  </span>
                  <div className="text-right">
                    <div className="text-sm text-gray-500 line-through">
                      {new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                      }).format(product.price * 1.25)}
                    </div>
                    <div className="text-sm font-semibold text-green-600">
                      Save 25%
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <Separator className="bg-gradient-to-r from-purple-200 to-blue-200" />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Quantity:</span>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="h-10 w-10 p-0 rounded-full border-purple-200 hover:bg-purple-50"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-semibold text-lg">
                      {quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= maxQuantity}
                      className="h-10 w-10 p-0 rounded-full border-purple-200 hover:bg-purple-50"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  {maxQuantity < product.stockQuantity && (
                    <p>Maximum {maxQuantity} items per order</p>
                  )}
                  {product.minimumOrderQuantity > 1 && (
                    <p>Minimum order: {product.minimumOrderQuantity} items</p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleAddToCart}
                  className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                    isInStock
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl hover:shadow-purple-500/25'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={!isInStock}
                >
                  {isInStock ? (
                    <div className="flex items-center justify-center gap-2">
                      <ShoppingCart className="h-5 w-5" />
                      Add {quantity} to Cart
                    </div>
                  ) : (
                    'Out of Stock'
                  )}
                </Button>

                <Button
                  variant="outline"
                  className="w-full py-4 rounded-xl font-semibold text-lg border-purple-200 hover:bg-purple-50 transition-all duration-300"
                  disabled={!isInStock}
                >
                  <Zap className="h-5 w-5 mr-2" />
                  Buy Now
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                <Card className="bg-white/90 backdrop-blur-sm border-0 rounded-xl">
                  <CardContent className="p-4 text-center">
                    <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-sm text-gray-900">
                      Quality Guarantee
                    </h4>
                    <p className="text-xs text-gray-600">30-day warranty</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 backdrop-blur-sm border-0 rounded-xl">
                  <CardContent className="p-4 text-center">
                    <Truck className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-sm text-gray-900">
                      Fast Shipping
                    </h4>
                    <p className="text-xs text-gray-600">2-3 business days</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 backdrop-blur-sm border-0 rounded-xl">
                  <CardContent className="p-4 text-center">
                    <RotateCcw className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-sm text-gray-900">
                      Easy Returns
                    </h4>
                    <p className="text-xs text-gray-600">7-day return policy</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          <section className="mt-16">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-purple-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Product Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Brand:</span>
                    <span className="font-semibold">Premium</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Condition:</span>
                    <span className="font-semibold">Excellent</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Storage:</span>
                    <span className="font-semibold">128GB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Color:</span>
                    <span className="font-semibold">Space Gray</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Battery Health:</span>
                    <span className="font-semibold text-green-600">95%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Screen:</span>
                    <span className="font-semibold">Perfect</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Accessories:</span>
                    <span className="font-semibold">Charger included</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Unlocked:</span>
                    <span className="font-semibold text-green-600">
                      <CheckCircle className="h-4 w-4 inline mr-1" />
                      Yes
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-16 py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl">
            <div className="text-center px-8">
              <div className="inline-flex items-center gap-2 bg-white/20 text-white px-6 py-2 rounded-full text-sm font-semibold mb-6">
                <Sparkles className="h-4 w-4" />
                Why Choose This Phone?
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Premium Quality, Unbeatable Price
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Thoroughly Tested
                  </h3>
                  <p className="text-white/80">
                    Every device undergoes comprehensive testing to ensure
                    optimal performance
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Quality Assured
                  </h3>
                  <p className="text-white/80">
                    30-day warranty and quality guarantee on all purchases
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Truck className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Fast & Secure</h3>
                  <p className="text-white/80">
                    Quick delivery with secure packaging to protect your device
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <CartSidebar onCheckout={() => setIsAuthModalOpen(true)} />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() =>
          toast.success('Welcome! You can now proceed with your purchase.')
        }
      />
    </div>
  );
}
