import React, { Component } from "react";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stores: []
    };
  }

  displayMarkers = () => {
    return this.state.stores.map((store, index) => {
      return (
        <Marker
          key={index}
          id={index}
          position={{
            lat: store.latitude,
            lng: store.longitude
          }}
          onClick={() => console.log("You clicked me!")}
        />
      );
    });
  };

  componentDidMount() {
    setInterval(() => {
      let stores = [...this.state.stores];
      this.callBackendAPI()
        .then(res => {
          res.forEach(element => {
            let coordinates = JSON.parse(element).coordinates;
            stores.push({
              latitude: coordinates[1],
              longitude: coordinates[0]
            });
          });
          this.setState({ stores });
        })
        .catch(err => console.log(err));
    }, 2000);
  }

  callBackendAPI = async () => {
    const response = await fetch("/tweets");
    const body = await response.json();
    body.pop();
    return body;
  };

  render() {
    return (
      <Map
        google={this.props.google}
        zoom={2}
        style={{
          width: "100%",
          height: "100%"
        }}
        initialCenter={{ lat: 0, lng: 0 }}
      >
        {this.displayMarkers()}
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: ""
})(App);
