import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';

import { App } from './app/App';
import './base.css';
import { stores } from './stores';

ReactDOM.render(
  <Provider {...stores}><App /></Provider>
  ,
  document.querySelector('.npm-gui'));
