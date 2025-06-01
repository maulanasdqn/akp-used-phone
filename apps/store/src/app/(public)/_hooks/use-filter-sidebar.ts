import { useDebounce } from '@/shared/web/utils';
import { useState, useEffect, useCallback, useRef } from 'react';

export type TFilterSidebarProps = {
  onPriceChange: (min?: number, max?: number) => void;
  onStockChange: (inStock?: boolean) => void;
  onClearFilters: () => void;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
};

export const useFilterSidebar = (props: TFilterSidebarProps) => {
  const [priceRange, setPriceRange] = useState([
    props.minPrice ?? 0,
    props.maxPrice ?? 9000000,
  ]);

  const debouncedPriceRange = useDebounce(priceRange, 300);
  const onPriceChangeRef = useRef(props.onPriceChange);
  const onStockChangeRef = useRef(props.onStockChange);
  const onClearFiltersRef = useRef(props.onClearFilters);

  // Update refs when props change
  useEffect(() => {
    onPriceChangeRef.current = props.onPriceChange;
    onStockChangeRef.current = props.onStockChange;
    onClearFiltersRef.current = props.onClearFilters;
  });

  // Update price range when props change (but avoid infinite loops)
  useEffect(() => {
    const newMinPrice = props.minPrice ?? 0;
    const newMaxPrice = props.maxPrice ?? 9000000;

    // Only update if the values are actually different
    if (priceRange[0] !== newMinPrice || priceRange[1] !== newMaxPrice) {
      setPriceRange([newMinPrice, newMaxPrice]);
    }
  }, [props.minPrice, props.maxPrice]);

  // Handle debounced price changes
  useEffect(() => {
    const [min, max] = debouncedPriceRange;
    const minValue = min > 0 ? min : undefined;
    const maxValue = max < 9000000 ? max : undefined;

    // Only call if the values are different from current props
    if (minValue !== props.minPrice || maxValue !== props.maxPrice) {
      onPriceChangeRef.current(minValue, maxValue);
    }
  }, [debouncedPriceRange, props.minPrice, props.maxPrice]);

  const formatPrice = useCallback((price: number) => {
    if (price >= 1000000) {
      return `Rp${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `Rp${(price / 1000).toFixed(0)}K`;
    } else {
      return `Rp${price}`;
    }
  }, []);

  const handlePriceChange = useCallback((values: number[]) => {
    setPriceRange(values);
  }, []);

  const handleStockFilter = useCallback((checked: boolean) => {
    onStockChangeRef.current(checked ? true : undefined);
  }, []);

  const handleClearFilters = useCallback(() => {
    onClearFiltersRef.current();
  }, []);

  const state = {
    priceRange,
    formatPrice,
    inStock: props.inStock,
  };

  const handler = {
    onPriceChange: handlePriceChange,
    onStockFilter: handleStockFilter,
    onClearFilters: handleClearFilters,
  };

  return {
    state,
    handler,
  };
};
