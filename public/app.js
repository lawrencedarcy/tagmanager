import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import Router from 'react-router';

import routes from './routes/routes';
import configureStore from './util/configureStore';
import history from './routes/history';
import {setStore} from './util/storeAccessor';

import './style/main.scss';

function extractConfigFromPage() {

const configEl = document.getElementById('config');

  if (!configEl) {
    return {};
  }

  return JSON.parse(configEl.innerHTML);
}

const store = configureStore();
const config = extractConfigFromPage();

setStore(store);

store.dispatch({
    type:       'CONFIG_RECEIVED',
    config:     config,
    receivedAt: Date.now()
});

render(
    <Provider store={store}>
      <Router routes={routes} history={history}/>
    </Provider>
, document.getElementById('react-mount'));
