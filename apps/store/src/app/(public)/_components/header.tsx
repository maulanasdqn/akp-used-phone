import { Search, ShoppingCart, User, Menu } from 'lucide-react';
import { Button, Input } from '@/shared/web/components';
import { useState } from 'react';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              PhoneMarket
            </h1>
          </div>

          {/* Desktop Search - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search for phones..."
                className="pl-10 w-full bg-white"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2"
            >
              <User className="h-4 w-4" />
              <span className="hidden lg:inline">Account</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden lg:inline">Cart</span>
            </Button>
            <Button size="sm" className="hidden sm:flex">
              Sell Phone
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <ShoppingCart className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <User className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-4">
              {/* Mobile Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search for phones..."
                  className="pl-10 w-full bg-white"
                />
              </div>

              {/* Mobile Actions */}
              <div className="flex flex-col space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <User className="h-4 w-4 mr-2" />
                  Account
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Cart
                </Button>
                <Button className="w-full">Sell Phone</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
