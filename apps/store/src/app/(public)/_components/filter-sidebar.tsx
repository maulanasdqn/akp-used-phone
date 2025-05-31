import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Label,
  Checkbox,
  Slider,
} from '@/shared/web/components';
import { Separator } from '@radix-ui/react-separator';
import { useState, useCallback, useEffect } from 'react';
import { useDebounce } from '@/shared/web/utils';

interface FilterSidebarProps {
  onPriceChange: (min?: number, max?: number) => void;
  onStockChange: (inStock?: boolean) => void;
  onClearFilters: () => void;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

export const FilterSidebar = ({
  onPriceChange,
  onStockChange,
  onClearFilters,
  minPrice,
  maxPrice,
  inStock,
}: FilterSidebarProps) => {
  const [priceRange, setPriceRange] = useState([
    minPrice || 0,
    maxPrice || 9000000,
  ]);

  const debouncedPriceRange = useDebounce(priceRange, 300);

  useEffect(() => {
    setPriceRange([minPrice || 0, maxPrice || 9000000]);
  }, [minPrice, maxPrice]);

  useEffect(() => {
    const [min, max] = debouncedPriceRange;
    onPriceChange(min > 0 ? min : undefined, max < 9000000 ? max : undefined);
  }, [debouncedPriceRange, onPriceChange]);

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `Rp${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `Rp${(price / 1000).toFixed(0)}K`;
    } else {
      return `Rp${price}`;
    }
  };

  const handlePriceChange = useCallback((values: number[]) => {
    setPriceRange(values);
  }, []);

  const handleStockFilter = useCallback(
    (checked: boolean) => {
      onStockChange(checked ? true : undefined);
    },
    [onStockChange]
  );

  return (
    <Card className="w-full lg:max-w-xs">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-sm font-medium mb-3 block">Price Range</Label>
          <div className="px-2">
            <Slider
              value={priceRange}
              onValueChange={handlePriceChange}
              max={9000000}
              step={100000}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2 px-1">
            <span>{formatPrice(priceRange[0])}</span>
            <span>
              {priceRange[1] >= 9000000 ? 'Rp9M+' : formatPrice(priceRange[1])}
            </span>
          </div>
        </div>

        <Separator className="my-4" />

        <div>
          <Label className="text-sm font-medium mb-3 block">Availability</Label>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="inStock"
                checked={inStock === true}
                onCheckedChange={handleStockFilter}
              />
              <Label htmlFor="inStock" className="text-sm cursor-pointer">
                In Stock Only
              </Label>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <Button
          variant="outline"
          className="w-full"
          onClick={onClearFilters}
          size="sm"
        >
          Clear All Filters
        </Button>
      </CardContent>
    </Card>
  );
};
