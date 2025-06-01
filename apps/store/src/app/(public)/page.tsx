import { Header } from './_components/header';
import { ProductCard } from './_components/product-card';
import { CartSidebar } from './_components/cart-sidebar';
import { AuthModal } from './_components/auth-modal';
import { FilterSidebar } from './_components/filter-sidebar';
import { CustomPagination } from './_components/pagination';
import {
  Skeleton,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/web/components';
import {
  Package,
  Sparkles,
  Star,
  Zap,
  SlidersHorizontal,
  Search,
  ArrowUpDown,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { useDebounce, trpc } from '@/shared/web/utils';
import { toast } from 'sonner';

export default function HomePage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
    inStock: undefined as boolean | undefined,
    sortBy: 'createdAt' as
      | 'createdAt'
      | 'updatedAt'
      | 'name'
      | 'price'
      | 'stockQuantity',
    sortOrder: 'desc' as 'asc' | 'desc',
  });

  const itemsPerPage = 12;

  const queryParams = useMemo(
    () => ({
      search: debouncedSearchQuery || undefined,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      inStock: filters.inStock,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
      page: currentPage,
      limit: itemsPerPage,
    }),
    [debouncedSearchQuery, filters, currentPage]
  );

  const { data: productsResponse, isLoading } =
    trpc.products.getAll.useQuery(queryParams);
  const products = productsResponse?.data || [];
  const totalPages = Math.ceil(
    (productsResponse?.meta?.total || 0) / itemsPerPage
  );

  const handleCheckout = () => {
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = () => {
    toast.success('Welcome! You can now proceed with your purchase.');
  };

  const handlePriceChange = (min?: number, max?: number) => {
    setFilters((prev) => ({ ...prev, minPrice: min, maxPrice: max }));
    setCurrentPage(1);
  };

  const handleStockChange = (inStock?: boolean) => {
    setFilters((prev) => ({ ...prev, inStock }));
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split('-') as [
      typeof filters.sortBy,
      typeof filters.sortOrder
    ];
    setFilters((prev) => ({ ...prev, sortBy, sortOrder }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      minPrice: undefined,
      maxPrice: undefined,
      inStock: undefined,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getSortLabel = (sortBy: string, sortOrder: string) => {
    const sortLabels = {
      'createdAt-desc': 'Newest First',
      'createdAt-asc': 'Oldest First',
      'price-asc': 'Price: Low to High',
      'price-desc': 'Price: High to Low',
      'name-asc': 'Name: A to Z',
      'name-desc': 'Name: Z to A',
      'stockQuantity-desc': 'Stock: High to Low',
      'stockQuantity-asc': 'Stock: Low to High',
    };
    return (
      sortLabels[`${sortBy}-${sortOrder}` as keyof typeof sortLabels] ||
      'Newest First'
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      <Header onSearch={handleSearch} searchQuery={searchQuery} />

      <main className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100/20 via-blue-100/20 to-cyan-100/20 pointer-events-none"></div>

        <section className="relative py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold mb-6 shadow-lg">
                <Sparkles className="h-4 w-4" />
                Premium Used Phones
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Find Your Perfect
                <span className="block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Smartphone Deal
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Discover premium quality used phones at unbeatable prices. Every
                device is carefully inspected and comes with our quality
                guarantee.
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:hidden">
                <Button
                  variant="outline"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="w-full mb-6 bg-white/90 backdrop-blur-sm border-purple-200 hover:bg-purple-50 rounded-xl"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
                </Button>
                {isFilterOpen && (
                  <div className="mb-6">
                    <FilterSidebar
                      onPriceChange={handlePriceChange}
                      onStockChange={handleStockChange}
                      onClearFilters={handleClearFilters}
                      minPrice={filters.minPrice}
                      maxPrice={filters.maxPrice}
                      inStock={filters.inStock}
                    />
                  </div>
                )}
              </div>

              <div className="hidden lg:block lg:w-80 flex-shrink-0">
                <div className="sticky top-24">
                  <FilterSidebar
                    onPriceChange={handlePriceChange}
                    onStockChange={handleStockChange}
                    onClearFilters={handleClearFilters}
                    minPrice={filters.minPrice}
                    maxPrice={filters.maxPrice}
                    inStock={filters.inStock}
                  />
                </div>
              </div>

              <div className="flex-1">
                <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
                  <div className="text-sm text-gray-600">
                    {isLoading ? (
                      <Skeleton className="h-4 w-32 bg-gradient-to-r from-purple-100 to-blue-100" />
                    ) : (
                      `Showing ${products.length} of ${
                        productsResponse?.meta?.total || 0
                      } products`
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <ArrowUpDown className="h-4 w-4 text-gray-500" />
                      <Select
                        value={`${filters.sortBy}-${filters.sortOrder}`}
                        onValueChange={handleSortChange}
                      >
                        <SelectTrigger className="w-48 bg-white/90 backdrop-blur-sm border-purple-200 rounded-xl">
                          <SelectValue>
                            {getSortLabel(filters.sortBy, filters.sortOrder)}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="bg-white/95 backdrop-blur-sm border-purple-200 rounded-xl">
                          <SelectItem value="createdAt-desc">
                            Newest First
                          </SelectItem>
                          <SelectItem value="createdAt-asc">
                            Oldest First
                          </SelectItem>
                          <SelectItem value="price-asc">
                            Price: Low to High
                          </SelectItem>
                          <SelectItem value="price-desc">
                            Price: High to Low
                          </SelectItem>
                          <SelectItem value="name-asc">Name: A to Z</SelectItem>
                          <SelectItem value="name-desc">
                            Name: Z to A
                          </SelectItem>
                          <SelectItem value="stockQuantity-desc">
                            Stock: High to Low
                          </SelectItem>
                          <SelectItem value="stockQuantity-asc">
                            Stock: Low to High
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {isLoading
                    ? Array.from({ length: itemsPerPage }).map((_, index) => (
                        <div key={index} className="space-y-4">
                          <Skeleton className="aspect-square rounded-2xl bg-gradient-to-br from-purple-100 to-blue-100" />
                          <div className="space-y-2 p-4">
                            <Skeleton className="h-6 w-3/4 bg-gradient-to-r from-purple-200 to-blue-200 rounded-lg" />
                            <Skeleton className="h-4 w-full bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg" />
                            <Skeleton className="h-4 w-2/3 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg" />
                            <div className="flex justify-between items-center pt-2">
                              <Skeleton className="h-8 w-24 bg-gradient-to-r from-purple-200 to-blue-200 rounded-lg" />
                              <Skeleton className="h-10 w-28 bg-gradient-to-r from-purple-300 to-blue-300 rounded-xl" />
                            </div>
                          </div>
                        </div>
                      ))
                    : products.map((product) => (
                        <ProductCard key={product.id} {...product} />
                      ))}
                </div>

                {!isLoading && products.length === 0 && (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      {searchQuery ||
                      filters.minPrice ||
                      filters.maxPrice ||
                      filters.inStock ? (
                        <Search className="h-12 w-12 text-gray-400" />
                      ) : (
                        <Package className="h-12 w-12 text-gray-400" />
                      )}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {searchQuery ||
                      filters.minPrice ||
                      filters.maxPrice ||
                      filters.inStock
                        ? 'No Products Found'
                        : 'No Products Available'}
                    </h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      {searchQuery ||
                      filters.minPrice ||
                      filters.maxPrice ||
                      filters.inStock
                        ? "Try adjusting your search or filters to find what you're looking for."
                        : "We're currently updating our inventory. Please check back soon for amazing deals on premium used phones!"}
                    </p>
                    {(searchQuery ||
                      filters.minPrice ||
                      filters.maxPrice ||
                      filters.inStock) && (
                      <Button
                        onClick={handleClearFilters}
                        className="mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl"
                      >
                        Clear All Filters
                      </Button>
                    )}
                  </div>
                )}

                {!isLoading && products.length > 0 && totalPages > 1 && (
                  <div className="mt-12 flex justify-center">
                    <CustomPagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                      className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-100"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="relative py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Why Choose PhoneMarket?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Star className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Quality Guaranteed
                  </h3>
                  <p className="text-white/80">
                    Every phone is thoroughly tested and comes with our quality
                    assurance
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
                  <p className="text-white/80">
                    Quick and secure shipping to get your phone to you fast
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Package className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
                  <p className="text-white/80">
                    Competitive pricing on all premium used smartphones
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <CartSidebar onCheckout={handleCheckout} />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}
