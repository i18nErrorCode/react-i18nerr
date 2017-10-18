import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {onStoreDone} from './redux/createStore';
import registerServiceWorker from './registerServiceWorker';

onStoreDone(()=>{
  ReactDOM.render(<App />, document.getElementById('root'));
});

registerServiceWorker();
