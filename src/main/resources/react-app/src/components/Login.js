import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import Dashboard from './dashboard/Dashboard';

class Login extends React.Component {

  render(){
    return(

      <div>
        <h1> Hai Login </h1>
        <Link to='/home'>Home</Link>
      </div>
    );
  }
}

export default Login;
