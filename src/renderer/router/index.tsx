import { Route, Routes } from 'react-router-dom';
import { IRouter, routers } from './config';
import { Suspense, useMemo } from 'react';
import Loading from '../page/Loading';

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

const RouteRender: React.FC = (): JSX.Element => {
  const routes = useMemo(() => routeRender(routers), []); //不需要依赖项，routers是硬编码的
  return <Routes>{routes}</Routes>;
};

export default RouteRender;
