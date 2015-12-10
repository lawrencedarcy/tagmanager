import Reqwest from 'reqwest';

import {getStore} from '../util/storeAccessor';

function paramsObjectToQuery (params) {

  if (!params) {
    return '';
  }

  return Object.keys(params).map((paramName) => {
    return params[paramName] ? paramName + '=' + params[paramName] : false;
  }).filter(a => a).join('&');
}

function getCapiUrl() {
  const store = getStore();
  return store.getState().config.capiUrl + '/search?api-key=' + store.getState().config.capiKey;
}

export function getByTag (tag, params) {
    const query = paramsObjectToQuery(params);

    return Reqwest({
      url: getCapiUrl() + '&tag=' + tag.path  + '&' + query,
      contentType: 'application/json',
      crossOrigin: true,
      method: 'get'
    });
}

export function searchContent (searchString, params) {
    const query = paramsObjectToQuery(params);

    return Reqwest({
      url: getCapiUrl() + '&q=' + searchString  + '&' + query,
      contentType: 'application/json',
      crossOrigin: true,
      method: 'get'
    });
}