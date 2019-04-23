import React, { Component } from 'react'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const PopupMarker = ({ children, position }) => (
    <Marker position={position}>
        <Popup>
            {children}
        </Popup>
    </Marker>
)

export default class DanceMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lat: 45.6982642,
            lng: 9.6772698,
            zoom: 13
        }
    }

    render() {
        const {location} = this.props;
        const centre = location ?  Object.values(location) : [this.state.lat, this.state.lng];
        
        return (
            <Map style={{width:'100vw', height: '100vw'}} center={centre} zoom={this.state.zoom}>
                <TileLayer
          attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
/>
                <PopupMarker position={centre} >Is a label</PopupMarker>
            </Map>
        )
    }
}