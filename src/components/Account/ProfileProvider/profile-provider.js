import React ,{useEffect, useState, useContext}from 'react'
import { withFirebase } from '../../Firebase';

const ProfileContext = React.createContext(undefined);

const ProfileProviderBase = (props) => {
const [state,setState] = useState({profile: {}});
const uid = sessionStorage.getItem('uid');



const profileRequest = () => {
    const userProfileSnapshot = props.firebase
        .geoUsers()
        .where('id', '==', uid)
        .get();
    userProfileSnapshot.then(doc => {
        doc.docs.forEach(item => {
            setState(item.data())
        });
    }).catch(error => console.log(error));
}


useEffect(() => {
    if (!uid) { return }
     try {
        profileRequest()
    } catch (error) {
        console.log(error);        
    }
}, [uid]);
    
    return <ProfileContext.Provider value={{profile:state}}>{props.children}</ProfileContext.Provider>
}

export const {Consumer: ProfileConsumer} = ProfileContext;

export const ProfileProvider = withFirebase(ProfileProviderBase);

export const useProfile = () => {
    const context = useContext(ProfileContext)
    if (!context) {
        throw new Error('use ProfileProvider')
    }
    return context
}