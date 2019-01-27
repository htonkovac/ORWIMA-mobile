import * as React from 'react';
import { View, StyleSheet, FlatList, ImageBackground } from 'react-native';
import { Constants, MapView, Location, Permissions } from 'expo';
import { Container, Header, Content, Footer, FooterTab, Button, Icon, Text, Spinner } from 'native-base';
import { FontAwesome } from '@expo/vector-icons';

// or any pure javascript modules available in npm
import { Card } from 'react-native-paper';

const apiKey = 'AIzaSyDyjGpfZNwzc0VmdV4LaDfWpUctWY9AfnU'
const customBlue = "rgb(40,152,252)"

const views = {
  map: 'map',
  list: 'list'
}
export default class App extends React.Component {

  state = {
    locations: [],
    location: null,
    view: views.map,
    loading: true
  };

  async componentWillMount() {
    await Expo.Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
    });
    this.setState({loading: false})
    const location = await this._getLocationAsync()
    //const baseUrl = 
    const url = 'https://snnnbb0pm3.execute-api.eu-central-1.amazonaws.com/v1/locations/?longitude='
      + location.coords.longitude
      + '&latitude='
      + location.coords.latitude
      + '&radius=10000&fbclid=IwAR1XAKO1vNTkzhWKhukQI3-r1FC8deU_oNmBjXe1YfvCmJ1Z8ThRD0jWBrY'
    console.log(url)
    const response = await fetch(url);
    const data = JSON.parse(response._bodyInit)
    this.setState({
      locations: data.locations,
    });
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location });
    return location
  };

  _renderMapView = (location, locations) => (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.4,
        longitudeDelta: 0.4,
      }}
    >
      <MapView.Marker
        key={location.name}
        coordinate={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        }}
        title={location.name}
        description={location.name}
      >
        <View>
          <FontAwesome name="location-arrow" size={32} color={customBlue} />
        </View>
      </MapView.Marker>
      {
        locations.map(location => (
          <MapView.Marker
            key={location.name}
            coordinate={{
              latitude: location.coordinates.coordinates[1],
              longitude: location.coordinates.coordinates[0]
            }}
            title={location.name}
            description={location.type}
          />
        ))
      }
    </MapView>
  )

  _renderListView = (location, locations) => (
    <FlatList
      style={styles.paragraph}
      data={locations.map((location, index) => ({ ...location, key: location.name, index: index }))}
      renderItem={
        ({ item }) => (
          <View style={{
         padding: 5
          }}>
            <Card style={{
              flexDirection: 'row',
              padding: 10,
              backgroundColor: item.index % 2 === 0 ? 'red' : 'white'
            }}>
              <View style={{
                flexDirection: 'column'
              }}>
                <Text style={{
                  fontSize: 20,
                  color: item.index % 2 === 0 ? 'white' : 'black'
                }}> {item.name} </Text>
                <Text style={{
                  fontSize: 15,
                  color: item.index % 2 === 0 ? 'white' : 'black'
                }}> {item.type} </Text>
                <Text style={{
                  fontSize: 15,
                  color: item.index % 2 === 0 ? 'white' : 'black'
                }}> {item.address} </Text>
              </View>
            </Card>
          </View>
        )
      }
    />
  )

  _renderSpinner = () => (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Spinner color={customBlue} />
    </View>
  )

  render() {
    const { location, locations, view } = this.state
    if (this.state.loading) {
      return <Expo.AppLoading />;
    }
    return (
      <Container>
        <Header />
        {
          location
            && locations
            && locations.length > 0
            ? view === views.map
              ? this._renderMapView(location, locations)
              : this._renderListView(location, locations)
            : this._renderSpinner()
        }
        <Footer>
          <FooterTab>
            <Button
              vertical
              active={this.state.view === views.map}
              color={customBlue}
              onPress={() => this.setState({ view: views.map })}
            >
              <FontAwesome name="location-arrow" size={30} color={customBlue} />
              <Text>Map</Text>
            </Button>
            <Button
              onPress={() => this.setState({ view: views.list })}
              vertical
              active={this.state.view === views.list}
            >
              <FontAwesome name="list-ul" size={30} color="black" />
              <Text>List</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});