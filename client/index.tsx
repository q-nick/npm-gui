import * as ReactDOM from 'react-dom';

import { App } from './app/App';
import './base.css';

ReactDOM.render(
  <App />,
  document.querySelector('.npm-gui'),
);

if (window.localStorage.getItem('npm-gui-id') === null) {
  window.localStorage.setItem('npm-gui-id', new Date().getTime().toString());
}

if (window.localStorage.getItem('npm-gui-id') !== 'developer') {
  void fetch(
    '/api/log',
    { method: 'POST', body: JSON.stringify({ id: window.localStorage.getItem('npm-gui-id') }) },
  );
}
