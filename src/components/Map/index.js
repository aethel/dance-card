import React, { Component } from 'react'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const PopupMarker = ({ children, position }) => (
    <Marker position={position}>
        <Popup>
            {children}
        </Popup>
    </Marker>
)

export default class DanceMap extends Component {
    constructor() {
        super();
        this.state = {
            lat: 45.6982642,
            lng: 9.6772698,
            zoom: 13
        }
    }

    render() {
        const centre = [this.state.lat, this.state.lng];
        return (
            <Map style={{width:'100vw', height: '100vw'}} center={centre} zoom={this.state.zoom}>
                <TileLayer
          attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
/>
                <PopupMarker position={[45.69836455, 9.6472798]} >Is a label</PopupMarker>
            </Map>
        )
    }
}