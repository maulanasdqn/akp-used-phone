import { Search, ShoppingCart, User, Menu, Sparkles } from 'lucide-react';
import { Button, Input } from '@/shared/web/components';
import { FC, ReactElement, useState, useEffect } from 'react';
import { useCartStore } from '../../../stores/cart-store';
import { Link } from 'react-router';

interface HeaderProps {
  onSearch?: (query: string) => void;
  searchQuery?: string;
}

export const Header: FC<HeaderProps> = ({
  onSearch,
  searchQuery,
}): ReactElement => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery || '');
  const { getTotalItems, toggleCart } = useCartStore();
  const totalItems = getTotalItems();

  useEffect(() => {
    setLocalSearchQuery(searchQuery ?? '');
  }, [searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onSearch?.(value);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-purple-100 shadow-lg shadow-purple-500/10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                PhoneMarket
              </h1>
            </div>
          </div>

          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form className="relative w-full">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-20"></div>
              <div className="relative bg-white/90 backdrop-blur-sm rounded-xl border border-purple-200">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search for phones..."
                  value={localSearchQuery}
                  onChange={handleSearchChange}
                  className="pl-10 w-full bg-transparent border-0 focus:ring-2 focus:ring-purple-500 rounded-xl"
                />
              </div>
            </form>
          </div>

          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleCart}
              className="flex items-center space-x-2 hover:bg-blue-50 rounded-xl transition-colors duration-300 relative"
            >
              <ShoppingCart className="h-4 w-4 text-blue-600" />
              <span className="hidden lg:inline text-gray-700">Cart</span>
              {totalItems > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">
                    {totalItems}
                  </span>
                </div>
              )}
            </Button>
            <Link to="https://backoffice.used.msdqn.dev">
              <Button
                size="sm"
                className="hidden sm:flex bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Sell Phone
              </Button>
            </Link>
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleCart}
              className="relative hover:bg-blue-50 rounded-xl transition-colors duration-300"
            >
              <ShoppingCart className="h-4 w-4 text-blue-600" />
              {totalItems > 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">
                    {totalItems}
                  </span>
                </div>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-purple-50 rounded-xl transition-colors duration-300"
            >
              <User className="h-4 w-4 text-purple-600" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="hover:bg-gray-50 rounded-xl transition-colors duration-300"
            >
              <Menu className="h-4 w-4 text-gray-600" />
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-purple-100 py-4 bg-white/95 backdrop-blur-sm">
            <div className="space-y-4">
              <form className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-20"></div>
                <div className="relative bg-white/90 backdrop-blur-sm rounded-xl border border-purple-200">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search for phones..."
                    value={localSearchQuery}
                    onChange={handleSearchChange}
                    className="pl-10 w-full bg-transparent border-0 focus:ring-2 focus:ring-purple-500 rounded-xl"
                  />
                </div>
              </form>
              <div className="flex flex-col space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start hover:bg-purple-50 border-purple-200 rounded-xl transition-colors duration-300"
                >
                  <User className="h-4 w-4 mr-2 text-purple-600" />
                  Account
                </Button>
                <Button
                  variant="outline"
                  onClick={toggleCart}
                  className="w-full justify-start hover:bg-blue-50 border-blue-200 rounded-xl transition-colors duration-300 relative"
                >
                  <ShoppingCart className="h-4 w-4 mr-2 text-blue-600" />
                  Cart
                  {totalItems > 0 && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-bold">
                        {totalItems}
                      </span>
                    </div>
                  )}
                </Button>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl shadow-lg">
                  Sell Phone
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
