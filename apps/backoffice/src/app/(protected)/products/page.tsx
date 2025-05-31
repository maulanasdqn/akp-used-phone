import { ProductsHeader } from './_components/header';
import { ProductsContent } from './_components/content';
import { Fragment } from 'react/jsx-runtime';

export default function ProductsPage() {
  return (
    <Fragment>
      <ProductsHeader />
      <ProductsContent />
    </Fragment>
  );
}
