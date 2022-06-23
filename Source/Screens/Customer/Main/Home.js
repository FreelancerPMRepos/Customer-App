import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Dimensions,
  Pressable,
  ScrollView,
  Keyboard
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
import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const Home = ({ navigation, props, route }) => {
  const auth = useSelector(state => state.auth)
  const [viewHideShow, setViewHideShow] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [storeList, setStoreList] = useState([]);
  const [serviceData, setServiceData] = useState([]);
  const [isLoading, setLoading] = useState(false)
  const [selectedValue, setSelectedValue] = useState();
  const updatedName = useSelector(state => state)
  const dispatch = useDispatch()
  const [keyboardStatus, setKeyboardStatus] = useState();
  const [keyword, setKeyword] = useState('')
  const [miles, setMiles] = useState(10)



  useEffect(() => {
    let isCancelled = false;
    if (!isCancelled) {
      if (auth.access_token) {
        const unsubscribe = navigation.addListener('focus', () => {
          setTimeout(() => {
            setAuthToken(auth.access_token)
            getUserInfo()
            serviceList()
            getlocation()
          }, 1000)
        });
        return unsubscribe;
      }
    }
    return () => {
      isCancelled = true
    }
  }, [navigation])


  const getlocation = async () => {
    try {
      var longitude = await AsyncStorage.getItem('CurrentLongitude')
      var latitude = await AsyncStorage.getItem('CurrentLatitude')
      global.longitude = longitude
      global.latitude = latitude
      {
        global.longitude ? getStoreList("", "", "", "", "", latitude, longitude, global.pickStyleId) : null
      }
      if (value !== null) {
        alert('Not getting current location')
      }
    } catch (e) {
      // er
    }
  }

  const getStoreList = (fromPrice, toprice, keyword, serviceId, miles, latitude, longitude, store_id) => {
    { keyword ? '' : setLoading(true) }
    global.new_to_price = toprice === undefined ? '' : toprice
    global.new_from_price = fromPrice === undefined ? '' : fromPrice
    global.new_keyword = keyword === undefined ? '' : global.keyword ? global.keyword : keyword
    global.new_service = serviceId === undefined ? '' : serviceId
    global.new_miles = miles === undefined ? '' : miles
    var lat = global.searchLatitude ? global.searchLatitude : latitude
    var long = global.searchLongitude ? global.searchLongitude : longitude
    var storeId = store_id == '' ? '' : global.pickStyleId ? global.pickStyleId : ''
    axios.get(`${BASE_URL}/store/list2?price_to=${global.new_to_price}&price_from=${global.new_from_price}&keyword=${global.new_keyword}&service_id=${global.new_service}&miles=${global.new_miles}&latitude=${lat}&longitude=${long}&store_id=${storeId}`)
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
    setTimeout(() => {
      getStoreList("", "", "", "", "", global.latitude, global.longitude, '')
      global.pickStyleId = '';
    }, 1000)

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
    getStoreList(fromPrice, toprice, global.new_keyword, global.new_service, global.new_miles, global.latitude, global.longitude, "NULL")
  }

  const serviceList = () => {
    axios.get(`${BASE_URL}/service/all/list`)
      .then(res => {
        setServiceData(res.data)
      })
      .catch(e => {
        console.log('e', e)
      })
  }

  const _onServiceChange = (item) => {
    setSelectedValue(item)
    getStoreList(global.new_from_price, global.new_to_price, global.new_keyword, item, global.new_miles, global.latitude, global.longitude, "NULL")
  }

  const _onDrag = (value) => {
    setMiles(value)
  }

  const resetFilter = () => {
    setKeyword('')
    setMiles(0)
    getStoreList("", "", undefined, "", "", global.latitude, global.longitude, "NULL")
    setShowFilter(!showFilter)
    global.keyword = '';
    global.searchLatitude = '';
    global.searchLongitude = '';
  }

  const mapView = () => {
    return (
      <MapView style={styles.map} initialRegion={{
        latitude: storeList[0]?.latitude === undefined ? 37.78825 : storeList[0]?.latitude,
        longitude: storeList[0]?.longitude === undefined ? -122.4324 : storeList[0]?.longitude,
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
      </MapView>
    )
  }

  const searchBar = () => {
    return (
      <View style={styles.searchMainView}>
        <Pressable style={[styles.searchView, { width: showFilter == false ? '78%' : '100%' }]} onPress={() => navigation.navigate('HomeScreenSearch')}>
          <Text style={{ padding: 15, color: 'grey' }}>{global.keyword ? global.keyword : 'Search By Salon, Location'}</Text>
        </Pressable>
        {
          showFilter == false ?
            <Pressable style={styles.filterButton} onPress={() => setShowFilter(!showFilter)}>
              <Image
                style={styles.filterImage}
                source={require('../../../Images/filter.png')}
              />
            </Pressable>
            :
            null
        }
      </View>
    )
  }

  const filterView = () => {
    return (
      <View style={styles.priceView}>
        <View>
          <Picker
            selectedValue={selectedValue}
            style={styles.pickerStyle}
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
        <View style={styles.currencyView}>
          <Pressable onPress={() => _onPriceFilter(0, 10)} style={{ borderRightWidth: 1 }}>
            <Text style={styles.currency}>£</Text>
          </Pressable>
          <Pressable onPress={() => _onPriceFilter(10, 50)} style={{ borderRightWidth: 1 }}>
            <Text style={styles.currency}>££</Text>
          </Pressable>
          <Pressable onPress={() => _onPriceFilter(50, 100000)}>
            <Text style={styles.currency}>£££</Text>
          </Pressable>
        </View>
      </View>
    )
  }

  const slider = () => {
    return (
      <View style={styles.sliderView}>
        <Slider
          style={{ width: width * 0.88, height: 20, marginTop: 10 }}
          minimumValue={10}
          maximumValue={20}
          minimumTrackTintColor="#A9A8A8"
          maximumTrackTintColor="#A9A8A8"
          value={miles}
          onSlidingComplete={(value) => getStoreList(global.new_from_price, global.new_to_price, global.new_keyword, global.new_service, value, global.latitude, global.longitude)}
          onValueChange={(value) => _onDrag(value)}
        />
        <Text style={styles.milesText}>{miles} Miles</Text>
      </View>
    )
  }

  const resetFilterButton = () => {
    return (
      <View style={styles.resetFilterButton}>
        <Pressable style={{ backgroundColor: '#FFFFFF' }} onPress={() => resetFilter()}>
          <Text style={styles.clearFilterText}>Clear Filters</Text>
        </Pressable>
      </View>
    )
  }

  const pickStyleView = () => {
    return (
      <View style={styles.pickStyleView}>
        <Image source={{ uri: updatedName.fav.data.upload_front_photo != null ? updatedName.fav.data.upload_front_photo : updatedName.fav.data.upload_back_photo != null ? updatedName.fav.data.upload_back_photo : updatedName.fav.data.upload_top_photo != null ? updatedName.fav.data.upload_top_photo : updatedName.fav.data.upload_right_photo != null ? updatedName.fav.data.upload_right_photo : updatedName.fav.data.upload_left_photo != null ? updatedName.fav.data.upload_left_photo : updatedName.fav.data.upload_left_photo }} style={styles.pickStyleImage} />
        <Pressable onPress={() => _onSalonCancel()}>
          <Image source={require('../../../Images/cross.png')} style={styles.crossImage} />
        </Pressable>
      </View>
    )
  }

  const storeListView = () => {
    return (
      <View>
        <View style={[styles.storeView, { height: keyboardStatus === 'Keyboard Shown' ? height * 0.2 : viewHideShow == true ? height * 0.535 : height * 0.44 }]}>
          <Pressable style={[styles.upButton, { bottom: keyboardStatus === 'Keyboard Shown' ? height * 0.15 : viewHideShow == true ? height * 0.49 : height * 0.39, }]} onPress={() => setViewHideShow(!viewHideShow)}>
            {
              viewHideShow == true ?
                <Image source={require('../../../Images/arrowDown.png')} style={{ marginBottom: 20 }} />
                :
                <Image source={require('../../../Images/arrowUp.png')} style={{ marginBottom: 20 }} />
            }
          </Pressable>
          <ScrollView style={{ marginTop: 15 }}>
            {
              storeList.length === 0 && isLoading === false ?
                <View style={styles.noStoreAvailableView}>
                  <Text>No store available</Text>
                </View>
                :
                storeList?.map((res, index) => {
                  let price = res.min_male_price > res.min_female_price ? res.min_female_price : res.min_male_price
                  let price_length = price === null ? 0 : price.toString().length
                  var prefix = '';
                  if (price_length > 0) {
                    for (var i = 0; i < price_length; i++) {
                      prefix += '£';
                    }
                  }
                  return (
                    <Pressable style={styles.store} key={index} onPress={() => navigation.navigate('StoreDescription', { storeDetails: res, page: 'Home', miles: 10 })}>
                      {
                        res.images.length == 0 ?
                          <Image
                            style={styles.noImage}
                            source={require('../../../Images/noImage.jpg')}
                          />
                          :
                          <Image source={{
                            uri: res?.images[0]?.url,
                          }} style={styles.noImage} />
                      }
                      <View style={styles.storeContentView}>
                        <View style={styles.contentView}>
                          <View style={{ width: 90 }}>
                            <Text style={styles.storeName}>{res.store_name}</Text>
                          </View>
                          <View style={styles.contentView}>
                            <Text style={styles.time}>{moment.utc(res.opentime, "HH:mm:ss").local().format('hh:mm A')}-{moment.utc(res.closetime, "HH:mm:ss").local().format('hh:mm A')}</Text>
                            {
                              res.is_available == 1 ?
                                <Text style={styles.timeText}> Open</Text>
                                :
                                <Text style={styles.timeText}> Closed</Text>
                            }
                          </View>
                        </View>
                        <Text style={styles.miles}>{res.latitude === 0 && res.longitude === 0 ? 0 : res.distance} Miles</Text>
                        <View style={styles.row}>
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
                          <Text style={styles.prefixText}>{prefix}</Text>
                        </View>
                        <Text numberOfLines={2} style={styles.description}>{res.description}</Text>
                        <View style={styles.seeMoreView}>
                          <Text style={styles.seeMoreText}>SEE MORE</Text>
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


  return (
    <View style={styles.container}>

      {
        isLoading === true ? <Loader /> :
          <KeyboardAwareScrollView>
            <View style={styles.mapView}>
              {mapView()}
              {searchBar()}
              {showFilter == true ? filterView() : null}
              {showFilter == true ? slider() : null}
              {showFilter == true ? resetFilterButton() : null}
              {updatedName.fav.data == null ? null : pickStyleView()}
            </View>
          </KeyboardAwareScrollView>
      }
      {/* // store List View */}
      {isLoading === true ? <Loader /> : storeListView()}
    </View>
  )
}
export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
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
    height: height * 0.50,
    width: width * 1,
    alignItems: 'center',
  },
  searchMainView: {
    flexDirection: 'row',
    position: 'absolute',
    marginTop: 32,
    width: '88%'
  },
  searchView: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
  },
  storeView: {
    bottom: 0,
    backgroundColor: 'white',
    position: 'absolute',
    width: width * 1
  },
  filterButton: {
    backgroundColor: '#FFFFFF',
    marginLeft: 5,
    height: 50
  },
  filterImage: {
    marginTop: 12,
    marginRight: 12,
    marginLeft: 17,
    marginRight: 16
  },
  priceView: {
    top: 95,
    flexDirection: 'row'
  },
  pickerStyle: {
    height: 50,
    width: width * 0.43,
    backgroundColor: 'white'
  },
  currencyView: {
    backgroundColor: 'white',
    marginLeft: 20,
    flexDirection: 'row'
  },
  currency: {
    width: width * 0.13,
    textAlign: 'center',
    paddingTop: 15.5,
  },
  sliderView: {
    top: 110,
    backgroundColor: 'white'
  },
  pickStyleView: {
    top: 125,
    backgroundColor: Colors.white,
    marginLeft: width * 0.56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  pickStyleImage: {
    height: 60,
    width: 59.39,
    marginTop: 5.5,
    marginLeft: 7.8,
    marginBottom: 5.5
  },
  crossImage: {
    marginLeft: 10,
    marginRight: 14
  },
  upButton: {
    height: 50,
    width: 50,
    borderRadius: 30,
    backgroundColor: 'white',
    position: 'absolute',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center'
  },
  noStoreAvailableView: {
    alignItems: 'center',
    marginTop: height * 0.19
  },
  store: {
    flexDirection: 'row',
    marginLeft: 10,
    //  marginRight: 50,
    marginTop: height * 0.02,
    borderBottomWidth: 1,
    borderColor: '#979797',

    width: '100%'
  },
  noImage: {
    height: 83,
    width: width * 0.2
  },
  storeContentView: {
    marginLeft: width * 0.05,
  },
  contentView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  storeName: {
    color: '#1A1919',
    fontSize: 15,
    fontFamily: 'Avenir-Medium',
    lineHeight: 20,
  },
  time: {
    fontFamily: 'Avenir-Medium',
    lineHeight: 16
  },
  timeText: {
    color: '#70CF2B',
    fontFamily: 'Avenir-Medium',
    lineHeight: 16
  },
  miles: {
    fontSize: 12,
    fontFamily: 'Avenir-Medium',
    lineHeight: 16
  },
  prefixText: {
    fontSize: 14,
    fontFamily: 'Avenir-Heavy',
    marginLeft: 14
  },
  description: {
    fontSize: 12,
    fontFamily: 'Avenir-Medium',
    lineHeight: 16,
    width: width * 0.7
  },
  seeMoreView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 13,
    marginRight: 35
  },
  seeMoreText: {
    marginTop: 8,
    fontFamily: 'Avenir-Heavy',
    borderBottomWidth: 1,
    lineHeight: 16
  },
  resetFilterButton: {
    top: 115,
    marginLeft: width * 0.64,
  },
  clearFilterText: {
    fontSize: 12,
    fontFamily: 'Avenir-Book', 
    marginTop: 5, 
    marginBottom: 5, 
    marginLeft: 15.5, 
    marginRight: 15.5
  },
  milesText: {
    textAlign: 'right', 
    marginRight: 10, 
    fontFamily: 'Avenir-Book', 
    marginBottom: 10
  }
})