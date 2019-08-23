import React ,{useEffect, useState, useContext}from 'react'
import { withFirebase } from '../../Firebase';

const ProfileContext = React.createContext(undefined);

const ProfileProviderBase = (props) => {
const [state,setState] = useState({profile: 'test'});
const uid = sessionStorage.getItem('uid');

// const profileRequest = () => {
//     const userProfileSnapshot = props.firebase
//         .geoUsers()
//         .where('id', '==', uid)
//         .get();
//     userProfileSnapshot.then(doc => {
//         let data = [];
//         doc.docs.forEach(item => {
//             console.log(data);
            
//         });
//         // this.setState({ users: data });
//     });
// }


useEffect(() => {
    console.log('is profile provider');
    
     try {
        
    } catch (error) {
        
    }
    // return () => {
    //     cleanup
    // };
}, []);

    return <ProfileContext.Provider value={state}>{props.children}</ProfileContext.Provider>
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