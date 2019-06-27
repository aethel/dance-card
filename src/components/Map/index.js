import React, { Component } from 'react';
import { Map, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { UserDetailsPopup } from './UserDetailsPopup';


delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const PopupMarker = ({ children, position }) => (
  <Marker position={position}>
    <Popup>{children}</Popup>
  </Marker>
);

export default class DanceMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: 45.6982642,
      lng: 9.6772698,
      zoom: 13,
      radius: 1000
    };
    this.mapRef = React.createRef();
  }

  recentreMap = () => {
    this.mapRef.current.leafletElement.setView(
      Object.values(this.props.location)
    );
  };

  render() {
    const { location, users, radius } = this.props;
    const centre = location
      ? Object.values(location)
      : [this.state.lat, this.state.lng];
    
      const userItem = users
      .filter(user => user.coordinates)
      .map(user => ({ ...user, coordinates: Object.values(user.coordinates) }))
      .map((user, index) => (        
        <Marker
          key={`${user.username}${index}`}
          position={user.coordinates}
          className={'blahhhh'}
        >
          <UserDetailsPopup user={user} />          
        </Marker>
      ));

    return (
      <React.Fragment>
        <button onClick={this.recentreMap}>Recentre</button>
        <Map
          style={{ width: '100vw', height: '100vw' }}
          center={centre}
          zoom={this.state.zoom}
          ref={this.mapRef}
        >
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
          />
          <PopupMarker position={centre}>It's you</PopupMarker>
          <Circle
            center={{ lat: centre[0], lng: centre[1] }}
            fillColor="blue"
            radius={radius * 1000 || this.state.radius}
          />
          {userItem}
        </Map>
      </React.Fragment>
    );
  }
}
