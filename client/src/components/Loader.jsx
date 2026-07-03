import React from 'react';

const Loader = ({ size = 'md', fullPage = false }) => {
  const dim = size === 'sm' ? 20 : size === 'lg' ? 56 : 36;

  const spinner = (
    <div
      className="loader-spinner"
      style={{ width: dim, height: dim }}
      role="status"
      aria-label="Loading"
    />
  );

  if (fullPage) {
    return <div className="loader-fullpage">{spinner}</div>;
  }
  return spinner;
};

export default Loader;
