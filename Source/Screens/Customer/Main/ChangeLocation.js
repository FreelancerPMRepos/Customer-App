import React, { useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    Switch,
    TextInput,
    Pressable
} from 'react-native';

import { Colors, height, width } from '../../../Config';
import Header from '../../../Components/Header';
import MapView, { Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const ChangeLocation = (props) => {
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    const _onBack = () => props.navigation.goBack()

    const renderlocation = () => {
        return (
            <View>
                <View style={{ marginLeft: 18, marginTop: 31, flexDirection: 'row', justifyContent: 'space-between', marginRight: 33 }}>
                    <Text style={{ fontSize: 16, fontFamily: 'Avenir-Medium', color: '#1A1919', lineHeight: 22 }}>Auto Location</Text>
                    <Switch
                        trackColor={{ false: "#D0CDCD", true: "black" }}
                        thumbColor={isEnabled ? "white" : "white"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                    />
                </View>
                <TextInput style={{ borderWidth: 1, marginLeft: 15.5, marginRight: 15.5, marginTop: 24.5, textAlignVertical: 'top' }} multiline={true} numberOfLines={5} placeholder="Addresss" />
                <View style={styles.mapView}>
                    {/* <GooglePlacesAutocomplete
                        placeholder='Search'
                        onPress={(data, details) => {
                            // 'details' is provided when fetchDetails = true
                            console.log(data, details);
                        }}
                        query={{
                            key: 'AIzaSyD6-vGk55XyKKw9TJCEiV0Q3XzwBSRq_0E',
                            language: 'en',
                        }}
                       
                    /> */}
                    {/* <MapView style={styles.map} initialRegion={{
                        latitude: 37.78825,
                        longitude: -122.4324,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}>
                        {
                            storeList.map((marker, index) => (
                                <Marker
                                    key={index}
                                    coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                                    title={marker.store_name}
                                />
                            ))}
                    </MapView> */}
                </View>
                <Pressable style={{ borderWidth: 1, marginLeft: 23, marginRight: 22, marginTop: 74 }}>
                    <Text style={{ textAlign: 'center', fontSize: 16, fontFamily: 'Avenir-Medium', marginTop: 11.5, marginBottom: 11.5 }}>Save</Text>
                </Pressable>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            {
                <Header leftIcon='back' onLeftIconPress={_onBack} {...props} />
            }
            {
                <View>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 18, fontFamily: 'Avenir-Heavy' }}>Change Location</Text>
                    </View>
                    {renderlocation()}
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
       // height: height * 0.3,
        // width: width * 0.92,
        // alignItems: 'center',
        // marginLeft: 16,
        // marginRight: 16,
        // marginTop: 23
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
})