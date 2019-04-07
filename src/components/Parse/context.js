import React from 'react';

const ParseContext = React.createContext(null);

export const withParse = Component => props => (
  <ParseContext.Consumer>
    {parse => <Component {...props} parse={parse} />}
  </ParseContext.Consumer>
);

export default ParseContext;
