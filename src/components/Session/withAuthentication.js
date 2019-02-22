import React from 'react'

const withAuthentication = Component => {
    class withAuthentication extends React.Component {
        render() {
            return <Component {...this.props} />
        }
    }
    return withAuthentication;
}

export default withAuthentication;