import React, { memo } from 'react'

export const ChatPage = memo(props => {
    const fromID = sessionStorage.getItem('uid');
    console.log(props.location.toID, fromID);
    
    return (
        <div>is a chat</div>
    )
})