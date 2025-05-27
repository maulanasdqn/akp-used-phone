import { DashboardHeader } from './_components/header';
import { DashboardContent } from './_components/content';
import { Fragment } from 'react/jsx-runtime';

export default function Component() {
  return (
    <Fragment>
      <DashboardHeader />
      <DashboardContent />
    </Fragment>
  );
}
