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
} from 'react-native';

import { BASE_URL } from '../../../Config';
import axios from 'axios';
import { setAuthToken } from '../../../Utils/setHeader';
import { useSelector, useDispatch } from 'react-redux';
import MapView, { Marker } from 'react-native-maps';
import Loader from '../../../Components/Loader';
import { Rating } from 'react-native-ratings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { deleteSalon } from '../../../Actions/PickSalon';
import moment from 'moment';
import { getPreciseDistance } from 'geolib';
import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;


const Home = (props) => {
  const auth = useSelector(state => state.auth)
  const [viewHideShow, setViewHideShow] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [storeList, setStoreList] = useState([]);
  const [serviceData, setServiceData] = useState([]);
  const [isLoading, setLoading] = useState(false)
  const [selectedValue, setSelectedValue] = useState();
  const updatedName = useSelector(state => state)
  const dispatch = useDispatch()


  useEffect(() => {
    let isCancelled = false;
    if (!isCancelled) {
      if (auth.access_token) {
        setAuthToken(auth.access_token)
        getStoreList()
        getUserInfo()
        serviceList()
        getlocation()
      }
    }
    return () => {
      isCancelled = true
    }
  }, [])

  const getlocation = async () => {
    try {
      global.longitude = await AsyncStorage.getItem('CurrentLongitude')
      global.latitude = await AsyncStorage.getItem('CurrentLongitude')
      if (value !== null) {
        alert('Not getting current location')
      }
    } catch (e) {
      // er
    }
  }

  const getStoreList = (fromPrice, toprice, keyword, serviceId, miles) => {
    setLoading(true)
    const new_to_price = toprice === undefined ? '' : toprice
    const new_from_price = fromPrice === undefined ? '' : fromPrice
    const new_keyword = keyword === undefined ? '' : keyword
    const new_service = serviceId === undefined ? '' : serviceId
    const new_miles = miles === undefined ? '' : miles
    console.log("asd", `${BASE_URL}/store/list2?price_to=${new_to_price}&price_from=${new_from_price}&keyword=${new_keyword}&service_id=${new_service}&miles=${new_miles}&latitude=${global.latitude}&longitude=${global.longitude}`)
    axios.get(`${BASE_URL}/store/list2?price_to=${new_to_price}&price_from=${new_from_price}&keyword=${new_keyword}&service_id=${new_service}&miles=${new_miles}&latitude=${global.latitude}&longitude=${global.longitude}`)
      .then(res => {
        setStoreList(res.data.list)
        setLoading(false)
      })
      .catch(e => {
        console.log('e', e)
        setLoading(false)
      })
  }


  const _onSalonCancel = async () => {
    dispatch(deleteSalon(updatedName.fav))
  }

  const getUserInfo = async () => {
    axios.get(`${BASE_URL}/users/me`)
      .then(res => {
        try {
          const jsonValue = JSON.stringify(res.data)
          AsyncStorage.setItem('@user_details', jsonValue)
        } catch (e) {
          // saving error
        }
      })
      .catch(e => {
        console.log('e', e)
      })
  }

  const _onPriceFilter = (fromPrice, toprice) => {
    getStoreList(fromPrice, toprice)
  }

  const serviceList = () => {
    setLoading(true)
    axios.get(`${BASE_URL}/service/all/list`)
      .then(res => {
        setServiceData(res.data)
        setLoading(false)
      })
      .catch(e => {
        console.log('e', e)
        setLoading(false)
      })
  }

  const _onServiceChange = (item) => {
    setSelectedValue(item)
    getStoreList('', '', '', item)
  }


  return (
    <View style={styles.container}>
      {
        isLoading && <Loader />
      }
      <View style={styles.mapView}>
        <MapView style={styles.map}>
          {
            storeList.map((marker, index) => (
              <Marker
                key={index}
                coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                title={marker.store_name}
              />
            ))}
        </MapView>
        <View style={styles.searchMainView}>
          <View style={styles.searchView}>
            <TextInput
              placeholder="Search By Salons, Location"
              style={{ width: showFilter == false ? width * 0.6 : width * 0.8, paddingLeft: 18 }}
              onChangeText={(text) => getStoreList('', '', text)}
            />
            <Image
              style={{ marginTop: 12, marginRight: 12 }}
              source={require('../../../Images/search.png')}
            />
          </View>
          {
            showFilter == false ?
              <Pressable style={{ backgroundColor: '#FFFFFF', marginLeft: 5 }} onPress={() => setShowFilter(!showFilter)}>
                <Image
                  style={{ marginTop: 12, marginRight: 12, marginLeft: 17, marginRight: 16 }}
                  source={require('../../../Images/filter.png')}
                />
              </Pressable>
              :
              null
          }
        </View>
        {
          showFilter == true ?
            <View style={{ top: 95, flexDirection: 'row' }}>
              <View>
                <Picker
                  selectedValue={selectedValue}
                  style={{ height: 50, width: 180, backgroundColor: 'white' }}
                  onValueChange={(itemValue, itemIndex) => _onServiceChange(itemValue)}
                >
                  <Picker.Item label="Select Type" value="0" />
                  {
                    serviceData.map((res) => {
                      return (
                        <Picker.Item label={res.name} value={res.id} />
                      )
                    })
                  }
                </Picker>
              </View>
              <View style={{ backgroundColor: 'white', marginLeft: 20, flexDirection: 'row' }}>
                <Pressable onPress={() => _onPriceFilter(0, 9)} style={{ borderRightWidth: 1 }}>
                  <Text style={{ width: 54, textAlign: 'center', paddingTop: 15.5, }}>£</Text>
                </Pressable>
                <Pressable onPress={() => _onPriceFilter(10, 99)} style={{ borderRightWidth: 1 }}>
                  <Text style={{ width: 54, textAlign: 'center', paddingTop: 15.5, }}>££</Text>
                </Pressable>
                <Pressable onPress={() => _onPriceFilter(100, 999)}>
                  <Text style={{ width: 54, textAlign: 'center', paddingTop: 15.5 }}>£££</Text>
                </Pressable>
              </View>
            </View>
            :
            null
        }
        {
          showFilter == true ?
            <View style={{ top: 110, backgroundColor: 'white' }}>
              <Slider
                style={{ width: 360, height: 40 }}
                minimumValue={100}
                maximumValue={10000}
                minimumTrackTintColor="#A9A8A8"
                maximumTrackTintColor="#A9A8A8"
                onValueChange={(value) => getStoreList('', '', '', '', value)}
              />
            </View> : null
        }
        {
          updatedName.fav.data == null ?
            null
            :
            <View style={{ top: 95, backgroundColor: Colors.white, marginLeft: width * 0.57, flexDirection: 'row' }}>
              <Image source={{ uri: updatedName.fav.data.upload_front_photo }} style={{ height: 60, width: 59.39, marginTop: 5.5, marginLeft: 7.8, marginBottom: 5.5 }} />
              <Pressable onPress={() => _onSalonCancel()}>
                <Image source={require('../../../Images/cross.png')} style={{ marginTop: 20, marginLeft: 10, marginRight: 14 }} />
              </Pressable>
            </View>
        }
      </View>

      {/* // store List View */}
      <View style={[styles.storeView, { height: viewHideShow == true ? height * 0.52 : height * 0.395, }]}>
        <Pressable style={{ height: 50, width: 50, borderRadius: 30, backgroundColor: 'white', position: 'absolute', bottom: viewHideShow == true ? height * 0.49 : height * 0.35, justifyContent: 'center', alignSelf: 'center', alignItems: 'center' }} onPress={() => setViewHideShow(!viewHideShow)}>
          {
            viewHideShow == true ?
              <Image source={require('../../../Images/arrowDown.png')} style={{ marginBottom: 20 }} />
              :
              <Image source={require('../../../Images/arrowUp.png')} style={{ marginBottom: 20 }} />
          }
        </Pressable>
        <ScrollView>
          {
            storeList.length === 0 ?
              <View style={{ alignItems: 'center', marginTop: height * 0.19 }}>
                <Text>No store available</Text>
              </View>
              :
              storeList?.map((res, index) => {
                // var pdis = getPreciseDistance(
                //   { latitude: res?.latitude == 0 ? global?.latitude : res.latitude, longitude: res?.longitude == 0 ? global?.longitude : res.longitude },
                //   { latitude: global?.latitude, longitude: global?.longitude },
                // );
                // let distance = (pdis / 1609).toFixed(2)
                let price = res.min_male_price > res.min_female_price ? res.min_female_price : res.min_male_price
                let price_length = price === null ? 0 : price.toString().length
                var prefix = '';
                if (price_length > 0) {
                  for (var i = 0; i < price_length; i++) {
                    prefix += '£';
                  }
                }
                return (
                  <Pressable style={{ flexDirection: 'row', marginLeft: 28, marginTop: 29.38, marginRight: 20, borderBottomWidth: 1, borderColor: '#979797' }} key={index} onPress={() => props.navigation.navigate('StoreDescription', { storeDetails: res, page: 'Home', miles: 10 })}>
                    {
                      res.images.length == 0 ?
                        <Image
                          style={{ height: 83, width: 71 }}
                          source={require('../../../Images/noImage.jpg')}
                        />
                        :
                        <Image source={{
                          uri: res?.images[0]?.url,
                        }} style={{ height: 83, width: 71 }} />
                    }
                    <View style={{ marginLeft: 23, flex: 1 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                        <View style={{ width: width * 0.35 }}>
                          <Text style={{ color: '#1A1919', fontSize: 15, fontFamily: 'Avenir-Medium', lineHeight: 20, }}>{res.store_name}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                          <Text style={{ fontFamily: 'Avenir-Medium', lineHeight: 16 }}>{moment(res.opentime, "H").format('h a')}-{moment(res.closetime, "H").format('h a')}</Text>
                          {
                            res.is_available == 1 ?
                              <Text style={{ color: '#70CF2B', fontFamily: 'Avenir-Medium', lineHeight: 16 }}> Open</Text>
                              :
                              <Text style={{ color: '#E73E3E', fontFamily: 'Avenir-Medium', lineHeight: 16 }}> Closed</Text>
                          }
                        </View>
                      </View>
                      <Text style={{ fontSize: 12, fontFamily: 'Avenir-Medium', lineHeight: 16 }}>{res.distance} Miles</Text>
                      <View style={{ flexDirection: 'row' }}>
                        <View style={{ marginTop: 3 }}>
                          <Rating
                            type='custom'
                            ratingCount={5}
                            ratingColor='#1F1E1E'
                            ratingBackgroundColor='#c8c7c8'
                            tintColor="#FFFFFF"
                            readonly={true}
                            startingValue={res.avg_rating}
                            imageSize={16}
                          //   onFinishRating={this.ratingCompleted}
                          />
                        </View>
                        <Text style={{ fontSize: 14, fontFamily: 'Avenir-Heavy', marginLeft: 14 }}>{prefix}</Text>
                      </View>
                      <Text numberOfLines={2} style={{ fontSize: 12, fontFamily: 'Avenir-Medium', lineHeight: 16 }}>{res.description}</Text>
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
  },
  imageContainer: {
    alignItems: 'center',
    backgroundColor: 'yellow',
  },
  imageWrapper: {
    width: 125,
    height: 250,
    backgroundColor: 'transparent',
    overflow: 'hidden'
  },
  image: {
    width: 180,
    height: 100,
    borderRadius: 125,
    backgroundColor: 'transparent'
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapView: {
    height: height * 0.56,
    width: width * 1,
    alignItems: 'center',
  },
  searchMainView: {
    flexDirection: 'row',
    position: 'absolute',
    marginTop: 32
  },
  searchView: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row'
  },
  storeView: {
    bottom: 0,
    backgroundColor: 'white',
    position: 'absolute',
    width: width * 1
  }
})