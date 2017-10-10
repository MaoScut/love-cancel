import React from 'react';
import ReactDom from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import App from './Container';

// why can't find the dom, coz in the html, the dom is behind js!
const render = (Component) => {
  // the first letter must be capital!
  ReactDom.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('root'),
  );
};
render(App);
if (module.hot) {
  module.hot.accept('./app.jsx', () => render(App));
}

