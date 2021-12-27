import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Dimensions,
  Pressable,
  ScrollView,
  TextInput,
  PixelRatio,
} from 'react-native';

import { BASE_URL } from '../../Config';
import axios from 'axios';
import { setAuthToken } from '../../Utils/setHeader';
import { useSelector, useDispatch } from 'react-redux';
import MapView from 'react-native-maps';
import Loader from '../../Components/Loader';
import { Rating, AirbnbRating } from 'react-native-ratings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { deleteSalon } from '../../Actions/PickSalon'

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const Home = (props) => {
  const auth = useSelector(state => state.auth)
  const [viewHideShow, setViewHideShow] = useState(false);
  const [storeList, setStoreList] = useState([]);
  const [isLoading, setLoading] = useState(false)
  const [pickSalonData, setPickSalonData] = useState('');
  const updatedName = useSelector(state => state)
  console.log("new name andar fav", updatedName.fav)
  const dispatch = useDispatch()

  useEffect(() => {
    let isCancelled = false;
    if (!isCancelled) {
      if (auth.access_token) {
        setAuthToken(auth.access_token)
        console.log("token home", auth.access_token)
        getStoreList()
        getUserInfo()
        getPickSalon()
      }
    }
    return () => {
      isCancelled = true
    }
  }, [])

  // console.log("width", width)

  const getStoreList = () => {
    setLoading(true)
    axios.get(`${BASE_URL}/store/list`)
      .then(res => {
        setStoreList(res.data)
        //    console.log('res', res.data)
        setLoading(false)
      })
      .catch(e => {
        console.log('e', e)
        setLoading(false)
      })
  }

  const getPickSalon = async () => {
    console.log("yaha aaya")
    try {
      const jsonValue = await AsyncStorage.getItem('@pick_salon')
      const parData = jsonValue != null ? JSON.parse(jsonValue) : null;
      console.log("jdfhughs", parData)
      setPickSalonData(parData)
      console.log("data", pickSalonData)
    } catch (e) {
      // error reading value
    }
  }

  const _onSalonCancel = async () => {
    dispatch(deleteSalon(updatedName.fav))
  }

  const getUserInfo = async () => {
    setLoading(true)
    axios.get(`${BASE_URL}/users/me`)
      .then(res => {
        try {
          const jsonValue = JSON.stringify(res.data)
          AsyncStorage.setItem('@user_details', jsonValue)
          //     console.log('res user info', res.data)
        } catch (e) {
          // saving error
        }
        setLoading(false)
      })
      .catch(e => {
        console.log('e', e)
        setLoading(false)
      })
  }



  return (
    <View style={styles.container}>
      {
        isLoading && <Loader />
      }
      <View style={{
        height: height * 0.56,
        width: width * 1,
        //   justifyContent: 'flex-end',
        alignItems: 'center',
      }}>
        <MapView
          //  provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          region={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
        >
        </MapView>
        <View style={{ flexDirection: 'row', position: 'absolute', marginTop: 32 }}>
          <View style={{ backgroundColor: '#FFFFFF', flexDirection: 'row' }}>
            <TextInput
              placeholder="Search By Salons, Location"
              style={{ width: width * 0.6, paddingLeft: 18 }}
            />
            <Image
              style={{ marginTop: 12, marginRight: 12 }}
              source={require('../../Images/search.png')}
            />
          </View>
          <View style={{ backgroundColor: '#FFFFFF', marginLeft: 5 }}>
            <Image
              style={{ marginTop: 12, marginRight: 12, marginLeft: 17, marginRight: 16 }}
              source={require('../../Images/filter.png')}
            />
          </View>
        </View>
        {
          updatedName.fav.data == null ?
            null
            :
            <View style={{ top: 95, backgroundColor: Colors.white, marginLeft: width * 0.57, flexDirection: 'row' }}>
              <Image source={{ uri: updatedName.fav.data.upload_front_photo }} style={{ height: 60, width: 59.39, marginTop: 5.5, marginLeft: 7.8, marginBottom: 5.5 }} />
              <Pressable onPress={() => _onSalonCancel()}>
                <Image source={require('../../Images/cross.png')} style={{ marginTop: 20, marginLeft: 10, marginRight: 14 }} />
              </Pressable>
            </View>
        }

      </View>
      <View style={{ bottom: 0, backgroundColor: 'white', height: viewHideShow == true ? height * 0.52 : height * 0.38, position: 'absolute', width: width * 1 }}>
        <Pressable style={{ height: 50, width: 50, borderRadius: 30, backgroundColor: 'white', position: 'absolute', bottom: viewHideShow == true ? 380 : height * 0.34, justifyContent: 'center', alignSelf: 'center', alignItems: 'center' }} onPress={() => setViewHideShow(!viewHideShow)}>
          {
            viewHideShow == true ?
              <Image source={require('../../Images/arrowDown.png')} style={{ marginBottom: 20 }} />
              :
              <Image source={require('../../Images/arrowUp.png')} style={{ marginBottom: 20 }} />
          }
        </Pressable>
        <ScrollView>
          {
            storeList.length == 0 ?
              <View style={{ flex: 1 }}>
                <Text>NO store available</Text>
              </View>
              :
              storeList.map((res, index) => {
                return (
                  <Pressable style={{ flexDirection: 'row', marginLeft: 28, marginTop: 29.38, marginRight: width * 0.07, borderBottomWidth: 1, borderColor: '#979797' }} key={index} onPress={() => props.navigation.navigate('StoreDescription', { storeDetails: res })}>
                    {
                      res.images.length == 0 ?
                        <Image
                          style={{ height: 83, width: 71 }}
                          source={require('../../Images/noImage.jpg')}
                        />
                        :
                        <Image source={{
                          uri: res?.images[0]?.url,
                        }} style={{ height: 83, width: 71 }} />
                    }
                    <View style={{ marginLeft: 23, flex: 1 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ color: '#1A1919', fontSize: width / 26, fontFamily: 'Avenir-Medium', lineHeight: 20 }}>{res.store_name}</Text>
                        <View style={{ flexDirection: 'row' }}>
                          <Text style={{ fontFamily: 'Avenir-Medium', lineHeight: 16 }}>8-18</Text>
                          {
                            res.is_available == 1 ?
                              <Text style={{ color: '#70CF2B', fontFamily: 'Avenir-Medium', lineHeight: 16 }}> Open</Text>
                              :
                              <Text style={{ color: '#E73E3E', fontFamily: 'Avenir-Medium', lineHeight: 16 }}> Closed</Text>
                          }
                        </View>
                      </View>
                      <Text style={{ fontSize: 12, fontFamily: 'Avenir-Medium', lineHeight: 16 }}>0.4 Miles</Text>
                      <View style={{ flexDirection: 'row' }}>
                        <View style={{ marginTop: 3 }}>
                          <Rating
                            type='custom'
                            ratingCount={5}
                            ratingColor='#1F1E1E'
                            ratingBackgroundColor='#c8c7c8'
                            tintColor="#FFFFFF"
                            readonly={true}
                            startingValue={4}
                            imageSize={16}
                          //   onFinishRating={this.ratingCompleted}
                          />
                        </View>
                        <Text style={{ fontSize: 14, fontFamily: 'Avenir-Heavy', marginLeft: 14 }}>££</Text>
                      </View>
                      <Text style={{ fontSize: 12, fontFamily: 'Avenir-Medium', lineHeight: 16 }}>{res.description}</Text>
                      <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 13, marginRight: 35 }}>
                        <Text style={{ marginTop: 8, fontFamily: 'Avenir-Heavy', borderBottomWidth: 1, lineHeight: 16 }}>SEE MORE</Text>
                      </View>
                    </View>
                  </Pressable>
                )
              })
          }
        </ScrollView>
      </View>
    </View>
  )
}
export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'red',
  },
  imageContainer: {
    alignItems: 'center',
    backgroundColor: 'yellow',
  },
  imageWrapper: {
    width: 125, // half of the image width
    height: 250,
    backgroundColor: 'transparent',
    overflow: 'hidden'
  },
  image: {
    //  width: 250,
    //   height: 250,
    width: 180,
    height: 100,
    borderRadius: 125, // half of the image width
    backgroundColor: 'transparent'
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
})