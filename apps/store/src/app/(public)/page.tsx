import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Input,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/shared/web/components';
import { useState, useCallback } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { FilterSidebar } from './_components/filter-sidebar';
import { ProductCard } from './_components/product-card';
import { Header } from './_components/header';
import { trpc, useDebounce } from '@/shared/web/utils';

export const Component = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<
    'createdAt' | 'updatedAt' | 'name' | 'price' | 'stockQuantity'
  >('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [inStock, setInStock] = useState<boolean | undefined>();
  const [showFilters, setShowFilters] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const {
    data: productsData,
    isLoading,
    error,
  } = trpc.products.getAll.useQuery({
    page,
    limit: 12,
    search: debouncedSearchTerm || undefined,
    sortBy,
    sortOrder,
    minPrice,
    maxPrice,
    inStock,
  });

  const products = productsData?.data ?? [];
  const totalItems = productsData?.meta?.total ?? 0;
  const perPage = productsData?.meta?.perPage ?? 12;
  const totalPages = Math.ceil(totalItems / perPage);

  const handleSortChange = useCallback((value: string) => {
    switch (value) {
      case 'price-low':
        setSortBy('price');
        setSortOrder('asc');
        break;
      case 'price-high':
        setSortBy('price');
        setSortOrder('desc');
        break;
      case 'name':
        setSortBy('name');
        setSortOrder('asc');
        break;
      case 'newest':
        setSortBy('createdAt');
        setSortOrder('desc');
        break;
      case 'stock':
        setSortBy('stockQuantity');
        setSortOrder('desc');
        break;
      default:
        setSortBy('createdAt');
        setSortOrder('desc');
    }
    setPage(1);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handlePriceFilter = useCallback((min?: number, max?: number) => {
    setMinPrice(min);
    setMaxPrice(max);
    setPage(1);
  }, []);

  const handleStockFilter = useCallback((stockFilter?: boolean) => {
    setInStock(stockFilter);
    setPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setInStock(undefined);
    setSortBy('createdAt');
    setSortOrder('desc');
    setPage(1);
  }, []);

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={page === i}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => handlePageChange(1)}
            isActive={page === 1}
            className="cursor-pointer"
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (page > 3) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={page === i}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (page < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              onClick={() => handlePageChange(totalPages)}
              isActive={page === totalPages}
              className="cursor-pointer"
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Find Your Perfect Used Phone
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Discover amazing deals on certified pre-owned smartphones. All
            devices are thoroughly tested and come with our quality guarantee.
          </p>
        </div>

        {/* Search Bar - Mobile Optimized */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="relative w-full max-w-lg">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search for phones..."
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="w-full mb-4 flex items-center justify-center gap-2"
            >
              <Filter className="h-4 w-4" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>

          {/* Sidebar - Responsive */}
          <aside
            className={`
            lg:w-64 lg:flex-shrink-0
            ${showFilters ? 'block' : 'hidden lg:block'}
          `}
          >
            <div className="lg:sticky lg:top-24">
              <FilterSidebar
                onPriceChange={handlePriceFilter}
                onStockChange={handleStockFilter}
                onClearFilters={clearFilters}
                minPrice={minPrice}
                maxPrice={maxPrice}
                inStock={inStock}
              />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Results Header - Mobile Optimized */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
              <p className="text-sm sm:text-base text-gray-600 order-2 sm:order-1">
                {isLoading
                  ? 'Loading...'
                  : `Showing ${products.length} of ${totalItems} results`}
                <span className="hidden sm:inline">
                  {` (Page ${page} of ${totalPages})`}
                </span>
              </p>
              <div className="flex items-center space-x-4 order-1 sm:order-2">
                <Select
                  value={`${sortBy}-${sortOrder}`}
                  onValueChange={handleSortChange}
                >
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt-desc">Newest First</SelectItem>
                    <SelectItem value="price-asc">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-desc">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="name-asc">Name A-Z</SelectItem>
                    <SelectItem value="stock-desc">
                      Stock: High to Low
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="text-center py-8">
                <p className="text-red-600">
                  Error loading products. Please try again.
                </p>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && products.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-600">
                  No products found. Try adjusting your search or filters.
                </p>
              </div>
            )}

            {/* Product Grid - Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>

            {/* Pagination - Mobile Optimized */}
            {!isLoading && totalPages > 1 && (
              <div className="mt-8 sm:mt-12">
                <Pagination>
                  <PaginationContent className="flex-wrap justify-center">
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => handlePageChange(Math.max(1, page - 1))}
                        className={`cursor-pointer ${
                          page === 1 ? 'pointer-events-none opacity-50' : ''
                        }`}
                      />
                    </PaginationItem>

                    <div className="hidden sm:contents">
                      {renderPaginationItems()}
                    </div>

                    {/* Mobile pagination - simplified */}
                    <div className="sm:hidden flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        Page {page} of {totalPages}
                      </span>
                    </div>

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          handlePageChange(Math.min(totalPages, page + 1))
                        }
                        className={`cursor-pointer ${
                          page === totalPages
                            ? 'pointer-events-none opacity-50'
                            : ''
                        }`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer - Responsive */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="sm:col-span-2 lg:col-span-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                PhoneMarket
              </h3>
              <p className="text-gray-600 text-sm">
                Your trusted marketplace for quality used smartphones.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Shop</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>All Phones</li>
                <li>iPhone</li>
                <li>Android</li>
                <li>Accessories</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Help Center</li>
                <li>Returns</li>
                <li>Warranty</li>
                <li>Contact Us</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>About Us</li>
                <li>Careers</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
            © 2025 PhoneMarket. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Component;
