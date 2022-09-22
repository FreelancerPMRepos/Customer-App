import React, { useState } from 'react';
import {
    Text,
    View,
    Dimensions,
    StyleSheet,
    Image,
    Pressable
} from 'react-native';

import { Colors } from '../../../Config';
import Header from '../../../Components/Header';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';


const GOOGLE_PLACES_API_KEY = 'AIzaSyD6-vGk55XyKKw9TJCEiV0Q3XzwBSRq_0E';
const ScreenWidth = Dimensions.get('screen').width;

const HomeScreenSearch = (props) => {
    const [searchKeyword, setSearchKeyword] = useState('')
    const [latitude, setLatitude] = useState('')
    const [longitude, setLongitude] = useState('')

    const _onBack = () => props.navigation.goBack()

    const onChange = (text) => {
        console.log(text)
        setSearchKeyword(text)
        global.keyword = text;
    }

    const searchLocation = (latitude, longitude, data) => {
        setLatitude(latitude)
        setLongitude(longitude)
        global.keyword = data.description;
    }

    const onSearch = () => {
        global.searchLatitude = latitude;
        global.searchLongitude = longitude;
        _onBack()
    }

    return (
        <View style={styles.container}>
            {
                <Header leftIcon='back' onLeftIconPress={_onBack} {...props} />
            }
            {
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ width: '80%'}}>
                        <GooglePlacesAutocomplete
                            placeholder="Search By Salon, Location"
                            GooglePlacesDetailsQuery={{ fields: "geometry" }}
                            //enablePoweredByContainer={false}
                            fetchDetails={true}
                            query={{
                                key: GOOGLE_PLACES_API_KEY,
                                language: 'en', // language of the results
                            }}
                            returnKeyType={'default'}
                            onPress={(data, details = null) => searchLocation(details.geometry.location.lat, details.geometry.location.lng, data)}
                            onFail={(error) => console.error(error)}
                            textInputProps={{
                                onChangeText: onChange  
                            }}
                            listViewDisplayed={true}
                            suppressDefaultStyles={true}
                            keepResultsAfterBlur={true}
                            styles={{
                                textInputContainer: {
                                    textAlignVertical: 'top',
                                    marginLeft: 15.5,
                                    //borderWidth: 1,
                                    borderLeftWidth: 1,
                                    borderTopWidth: 1,
                                    borderBottomWidth: 1,
                                    //marginRight: 15.5
                                    height: 50,
                                },
                                textInput: {
                                    color: '#5d5d5d',
                                    fontSize: 16,
                                },
                                predefinedPlacesDescription: {
                                    color: '#1faadb',
                                },
                                listView: {
                                    //backgroundColor: 'green',
                                    width: ScreenWidth - 44,
                                    marginLeft: 15.5,
                                    marginRight: 15.5,
                                    borderWidth: 1
                                },
                                row: {
                                    paddingTop: 10,
                                    paddingLeft: 5
                                },
                                poweredContainer: {
                                    //paddingVertical: 5,
                                 //backgroundColor: 'red',
                                },
                                powered: {
                                    //fontWeight: '200',
                                   //fontSize: 10,
                                }
                            }}
                        />
                    </View>
                    <Pressable style={{alignItems: 'center', width: '12%', height: 50, borderBottomWidth: 1, borderRightWidth: 1, borderTopWidth: 1 }} onPress={() => onSearch()}>
                        <Image
                            style={{ marginTop: 12, }}
                            source={require('../../../Images/search.png')}
                        />
                    </Pressable>
                </View>
            }
        </View>
    )
}
export default HomeScreenSearch;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white
    }
})