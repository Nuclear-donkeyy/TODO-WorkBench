import { Route, Routes } from 'react-router-dom';
import { IRouter, routers } from './config';
import { Suspense, useMemo } from 'react';
import Loading from '../page/Loading';

const RouteRender = (): JSX.Element => {
  const routeRender = (router: Array<IRouter>): JSX.Element[] => {
    return router.map(item => {
      return (
        <Route
          key={item.name || item.path}
          path={item.path}
          element={
            <Suspense fallback={<Loading />}>
              <item.component></item.component>
            </Suspense>
          }
        >
          {item.children && routeRender(item.children)}
        </Route>
      );
    });
  };

  const routes = useMemo(() => {
    return routeRender(routers);
  }, [routers]);
  return <Routes>{routes}</Routes>;
};

export default RouteRender;
