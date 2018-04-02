import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import App from './App';
import MuiApp from './MuiApp';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import Login from './components/Login';
import Dashboard from './components/dashboard/Dashboard';
import ApplyLeave from './components/ApplyLeave';
import MiniDrawer from './MiniDrawer';

ReactDOM.render(
  <BrowserRouter basename="/">
    <div>    
      <MuiApp/>
    </div>
  </BrowserRouter>
, document.getElementById('root'));
registerServiceWorker();
