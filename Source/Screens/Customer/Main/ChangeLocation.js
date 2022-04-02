import React, { useEffect, useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    Switch,
    TextInput,
    PermissionsAndroid,
    ScrollView,
} from 'react-native';

import { Colors, height, width } from '../../../Config';
import Header from '../../../Components/Header';
import MapView, { Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';

Geocoder.init("AIzaSyD6-vGk55XyKKw9TJCEiV0Q3XzwBSRq_0E"); // use a valid API key

const GOOGLE_PLACES_API_KEY = 'AIzaSyD6-vGk55XyKKw9TJCEiV0Q3XzwBSRq_0E';

const ChangeLocation = (props) => {
    const [isEnabled, setIsEnabled] = useState(false);
    const [latitude, setLatitude] = useState('')
    const [longitude, setLongitude] = useState('')
    const [address, setAddress] = useState('')
    const [mark, setMark] = useState([])
    const [searchLatitude, setSearchLatitude] = useState('')
    const [searchLongitude, setSearchLongitude] = useState('')
    const [searchMark, setSearchMark] = useState([])

    const _onBack = () => props.navigation.goBack()

    const toggleSwitch = () => {
        setAddress('')
        setIsEnabled(previousState => !previousState);
        getCurrentLocation()
    }

    const getCurrentLocation = async () => {
        if (Platform.OS === 'ios') {
            getOneTimeLocation();
        } else {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location Access Required',
                        message: 'This App needs to Access your location',
                    },
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    //To Check, If Permission is granted
                    getOneTimeLocation();
                } else {
                    showMessageAlert('Permission Denied')
                }
            } catch (err) {
                console.warn(err);
            }
        }
    }

    const getOneTimeLocation = async () => {
        Geolocation.getCurrentPosition(
            //Will give you the current location
            (position) => {

                //getting the Longitude from the location json
                const currentLongitude =
                    JSON.stringify(position.coords.longitude);
                setLongitude(currentLongitude)
                //getting the Latitude from the location json
                const currentLatitude =
                    JSON.stringify(position.coords.latitude);
                setLatitude(currentLatitude)
                Geocoder.from(currentLatitude, currentLongitude)
                    .then(json => {
                        var addressComponent = json.results[0].formatted_address;
                        setAddress(addressComponent)
                        setMark([{ latitude: currentLatitude, longitude: currentLongitude }])
                    })
                    .catch(error => console.warn(error));
            },
            (error) => {
            },
            {
                enableHighAccuracy: true,
                timeout: 30000,
                maximumAge: 1000
            },
        );
    };

    const renderlocation = () => {
        return (
            <View>
                <View style={styles.autoLocationView}>
                    <Text style={styles.autoLocationText}>Auto Location</Text>
                    <Switch
                        trackColor={{ false: "#D0CDCD", true: "black" }}
                        thumbColor={isEnabled ? "white" : "white"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                    />
                </View>
                {
                    isEnabled === true ?
                        <View>
                            <TextInput style={styles.autoLocationInput} multiline={true} numberOfLines={5} value={address} onChangeText={(text) => setAddress(text)} placeholder="Addresss" editable={!isEnabled} />
                            <View style={[styles.mapView, { marginTop: 23 }]}>
                                <MapView style={styles.map} initialRegion={{
                                    latitude: Number(latitude),
                                    longitude: Number(longitude),
                                    latitudeDelta: 0.0922,
                                    longitudeDelta: 0.0421,
                                }}>
                                    {
                                        mark?.map((marker, index) => (
                                            <Marker
                                                key={index}
                                                coordinate={{ latitude: Number(marker.latitude), longitude: Number(marker.longitude) }}
                                            />
                                        ))}
                                </MapView>
                            </View>
                        </View>
                        :
                        null
                }
            </View>
        )
    }

    const renderSearchLocation = () => {
        return (
            <View>
                {
                    isEnabled === false ?
                        <View style={styles.searchLocationView}>
                            <GooglePlacesAutocomplete
                                placeholder="Address"
                                GooglePlacesDetailsQuery={{ fields: "geometry" }}
                                fetchDetails={true}
                                query={{
                                    key: GOOGLE_PLACES_API_KEY,
                                    language: 'en', // language of the results
                                }}
                                returnKeyType={'default'}
                                onPress={(data, details = null) => setSearchLocation(details.geometry.location.lat, details.geometry.location.lng)}
                                onFail={(error) => console.error(error)}
                                listViewDisplayed="auto"
                                suppressDefaultStyles={true}
                                styles={{
                                    textInputContainer: {
                                        borderWidth: 1,
                                        textAlignVertical: 'top',
                                        marginLeft: 15.5,
                                        marginRight: 15.5,
                                    },
                                    textInput: {
                                        height: 38,
                                        color: '#5d5d5d',
                                        fontSize: 16,
                                    },
                                    predefinedPlacesDescription: {
                                        color: '#1faadb',
                                    },
                                    listView: {
                                        borderWidth: 1,
                                        marginLeft: 15.5,
                                        marginRight: 15.5,
                                    },
                                    row: {
                                        paddingTop: 10,
                                        paddingLeft: 5
                                    }
                                }}
                            />
                            {searchLatitude ? searchMap() : null}
                        </View>
                        :
                        null
                }
            </View>
        )
    }

    const setSearchLocation = (lat, lng) => {
        setSearchMark([{ latitude: lat, longitude: lng }])
        setSearchLatitude(lat)
        setSearchLongitude(lng)
    }


    const searchMap = () => {
        return (
            <View style={[styles.mapView, { position: 'relative', marginTop: 23 }]}>
                <MapView style={styles.map} region={{
                    latitude: Number(searchLatitude),
                    longitude: Number(searchLongitude),
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}>
                    {
                        searchMark?.map((marker, index) => (
                            <Marker
                                key={index}
                                coordinate={{ latitude: Number(marker.latitude), longitude: Number(marker.longitude) }}
                            />
                        ))}
                </MapView>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            {
                <Header leftIcon='back' onLeftIconPress={_onBack} {...props} />
            }
            <ScrollView>
                {
                    <View>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 18, fontFamily: 'Avenir-Heavy' }}>Change Location</Text>
                        </View>
                        {renderlocation()}
                    </View>
                }
                {renderSearchLocation()}
            </ScrollView>
        </View>
    )
}
export default ChangeLocation;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white
    },
    mapView: {
        height: height * 0.3,
        width: width * 0.92,
        alignItems: 'center',
        marginLeft: 16,
        marginRight: 16,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    autoLocationView: {
        marginLeft: 18,
        marginTop: 31,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginRight: 33
    },
    autoLocationText: {
        fontSize: 16,
        fontFamily: 'Avenir-Medium',
        color: '#1A1919',
        lineHeight: 22
    },
    autoLocationInput: {
        borderWidth: 1,
        marginLeft: 15.5,
        marginRight: 15.5,
        marginTop: 24.5,
        textAlignVertical: 'top',
        color: 'black'
    },
    searchLocationView: {
        height: '80%',
        paddingTop: 20,
        flexGrow: 1
    }
})