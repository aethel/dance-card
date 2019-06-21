import React, { memo } from 'react'
import { Popup } from 'react-leaflet';
import * as styles from './styles.css';

const objToStrMap = (obj) => {
    let strMap = new Map();
    for (let k of Object.keys(obj)) {
        strMap.set(k, obj[k]);
    }
    return strMap;
}

export const UserDetailsPopup = memo((props) => {
    const { username, dances,active } = props.user;
    const danceListItems = dances && Array.from(objToStrMap(dances)).map((dance, index) => {
        const danceName = dance[0];
        const dancePosition = dance[1];
        return (<li key={`${danceName}${index}`}>            
            <span>{danceName}</span>
            <p>Lead: {dancePosition.lead ? 'yes' : 'no'}</p>
            <p>Follow: {dancePosition.follow ? 'yes' : 'no'}</p>
        </li>
        )});        
        
    return <Popup className='userDetails'>
            <div>
                <p>Name: {username}</p>
                <p>Is active { active ? 'yes' : 'no'}</p>
                <ul>
                    {danceListItems}
                </ul>
            </div>
        </Popup>
    });
