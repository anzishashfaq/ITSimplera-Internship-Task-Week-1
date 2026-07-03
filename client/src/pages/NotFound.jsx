import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="not-found">
    <h1>404</h1>
    <p>The page you're looking for doesn't exist.</p>
    <Link to="/dashboard" className="btn btn-primary">
      Go to Dashboard
    </Link>
  </div>
);

export default NotFound;
