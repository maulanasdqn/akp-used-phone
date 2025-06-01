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
import { ReactElement, FC } from 'react';
import {
  TFilterSidebarProps,
  useFilterSidebar,
} from '../_hooks/use-filter-sidebar';

export const FilterSidebar: FC<TFilterSidebarProps> = (props): ReactElement => {
  const { state, handler } = useFilterSidebar(props);
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
              value={state.priceRange}
              onValueChange={handler.onPriceChange}
              max={9000000}
              step={100000}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2 px-1">
            <span>{state.formatPrice(state.priceRange[0])}</span>
            <span>
              {state.priceRange[1] >= 9000000
                ? 'Rp9M+'
                : state.formatPrice(state.priceRange[1])}
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
                checked={state.inStock === true}
                onCheckedChange={handler.onStockFilter}
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
          onClick={handler.onClearFilters}
          size="sm"
        >
          Clear All Filters
        </Button>
      </CardContent>
    </Card>
  );
};
