import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { store } from './store/store';
import RouteRender from './router';

// 引入设计系统样式
import './design-system/styles/index.less';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <MemoryRouter>
        <RouteRender></RouteRender>
      </MemoryRouter>
    </Provider>
  </React.StrictMode>
);
