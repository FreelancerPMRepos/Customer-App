import React, { useEffect, useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    Switch,
    TextInput,
    PermissionsAndroid,
    ScrollView,
    Pressable,
} from 'react-native';

import { BASE_URL, Colors, height, width } from '../../../Config';
import Header from '../../../Components/Header';
import MapView, { Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import Loader from '../../../Components/Loader';
import axios from 'axios';
import { showMessageAlert } from '../../../Utils/Utility';
import AsyncStorage from '@react-native-async-storage/async-storage';

Geocoder.init("AIzaSyD6-vGk55XyKKw9TJCEiV0Q3XzwBSRq_0E"); // use a valid API key

const GOOGLE_PLACES_API_KEY = 'AIzaSyD6-vGk55XyKKw9TJCEiV0Q3XzwBSRq_0E';

const ChangeLocation = ({ navigation, route, props }) => {
    const [isLoading, setLoading] = useState(false)
    const [isEnabled, setIsEnabled] = useState(false);
    const [latitude, setLatitude] = useState('')
    const [longitude, setLongitude] = useState('')
    const [address, setAddress] = useState('')
    const [searchAddress, setSearchAddress] = useState("")
    const [mark, setMark] = useState([])
    const [searchLatitude, setSearchLatitude] = useState('')
    const [searchLongitude, setSearchLongitude] = useState('')
    const [searchMark, setSearchMark] = useState([])
    const { id } = route.params

    const _onBack = () => navigation.goBack()

    useEffect(() => {
        setIsEnabled(previousState => !previousState);
        getCurrentLocation()
    }, [])


    const toggleSwitch = () => {
        setAddress('')
        setIsEnabled(previousState => !previousState);
        getCurrentLocation()
    }

    const getCurrentLocation = async () => {
        setLoading(true)
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

    const getOneTimeLocation = () => {
        console.log("yaha aaya")
        Geolocation.getCurrentPosition(info => {
            console.log(info.coords)
            setLongitude(info.coords.longitude)
            setLatitude(info.coords.latitude)
            Geocoder.from(info.coords.latitude, info.coords.longitude)
                .then(json => {
                    var addressComponent = json.results[0].formatted_address;
                    setAddress(addressComponent)
                    setMark([{ latitude: info.coords.latitude, longitude: info.coords.longitude }])
                })
                .catch(error => console.warn(error));
        });
        setLoading(false)
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
                            <View style={{ marginTop: 70 }}>
                                {renderSaveButton('ON')}
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
                                onPress={(data, details = null) => setSearchLocation(details.geometry.location.lat, details.geometry.location.lng, data)}
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
                            {
                                searchLatitude ?
                                    <View style={{ marginTop: 130 }}>
                                        {renderSaveButton('OFF')}
                                    </View>
                                    : null
                            }
                        </View>
                        :
                        null
                }
            </View>
        )
    }

    const setSearchLocation = (lat, lng, data) => {
        console.log("data", data)
        setSearchAddress(data.description)
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

    const renderSaveButton = (key) => {
        return (
            <Pressable style={{ borderWidth: 1, marginLeft: 23, marginRight: 22 }} onPress={() => _onSave(key)}>
                <Text style={{ textAlign: 'center', marginTop: 11.5, marginBottom: 11.5 }}>Save</Text>
            </Pressable>
        )
    }

    const _onSave = (key) => {
        if (key == 'OFF') {
            if (searchLatitude) {
                axios.put(`${BASE_URL}/customer`, {
                    id: id,
                    address: searchAddress,
                    latitude: searchLatitude,
                    longitude: searchLongitude
                })
                    .then(res => {
                        //  setUpcomingList(res.data)
                        showMessageAlert('Location is updated successfully.')
                        console.log("tres", res.data)
                        setLocation(searchLongitude.toString(), searchLatitude.toString())
                        setLoading(false)
                    })
                    .catch(e => {
                        console.log('er', e)
                        setLoading(false)
                    })
            } else {
                showMessageAlert('Please add address.')
            }
        } else {
            if (latitude) {
                axios.put(`${BASE_URL}/customer`, {
                    id: id,
                    address: address,
                    latitude: latitude,
                    longitude: longitude
                })
                    .then(res => {
                        //  setUpcomingList(res.data)
                        showMessageAlert('Location is updated successfully.')
                        console.log("tres", res.data)
                        setLocation(longitude.toString(), latitude.toString())
                        setLoading(false)
                    })
                    .catch(e => {
                        console.log('er', e)
                        setLoading(false)
                    })
            } else {
                showMessageAlert('Please add address')
            }
        }
    }

    const setLocation = async (currentLongitude, currentLatitude) => {
        try {
            await AsyncStorage.setItem('CurrentLongitude', currentLongitude)
            await AsyncStorage.setItem('CurrentLatitude', currentLatitude)
        } catch (e) {
            // saving error
        }
    }

    return (
        <View style={styles.container}>
            {
                <Header leftIcon='back' onLeftIconPress={_onBack} {...props} />
            }
            {
                isLoading == true ? <Loader /> :
                    <View>
                        {
                            <View>
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 18, fontFamily: 'Avenir-Heavy' }}>Change Location</Text>
                                </View>
                                {renderlocation()}
                            </View>
                        }
                        {renderSearchLocation()}
                    </View>
            }

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