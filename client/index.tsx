import './base.css';

import { render } from 'react-dom';

import { App } from './app/App';

render(<App />, document.querySelector('.npm-gui'));

if (window.localStorage.getItem('npm-gui-id') === null) {
  window.localStorage.setItem('npm-gui-id', Date.now().toString());
}

if (window.localStorage.getItem('npm-gui-id') !== 'developer') {
  void fetch('/api/log', {
    method: 'POST',
    body: JSON.stringify({ id: window.localStorage.getItem('npm-gui-id') }),
  });
}
