import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Pressable,
  FlatList,
  Image,
  ScrollView,
  Modal,
  ImageBackground,
  LogBox,
  PermissionsAndroid
} from 'react-native';
import Header from '../../../Components/Header'
import { BASE_URL, height, width } from '../../../Config';
import Loader from '../../../Components/Loader';
import { useSelector } from 'react-redux';
import { setAuthToken } from '../../../Utils/setHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';

const GridViewItems = [
  { key: '1' },
  { key: '2' },
  { key: '3' },
]

const HelloWorldApp = (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [list, setList] = useState(false);
  const [tagList, setTagList] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState('');
  const [selectedSubTags, setSelectedSubTags] = useState('');
  const [isLoading, setLoading] = useState(false)
  const auth = useSelector(state => state.auth)
  const [currentLongitude, setCurrentLongitude] = useState('...');
  const [currentLatitude, setCurrentLatitude] = useState('...');
  const [locationStatus, setLocationStatus] = useState('');


  useEffect(() => {
    let isCancelled = false;
    if (!isCancelled) {
      if (auth.access_token) {
        setAuthToken(auth.access_token)
        //    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
        getTopStyleList();
        getUserInfo()
        locationPermission()
      }
    }
    return () => {
      isCancelled = true
    }
  }, [])

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

  const getTopStyleList = () => {
    setLoading(true)
    axios.get(`${BASE_URL}/top/cuts/styles`)
      .then(res => {
        setList(res.data)
        getTags(res.data.service_id)
        setLoading(false)
      })
      .catch(e => {
        console.log('e', e)
        setLoading(false)
      })
  }

  const locationPermission = async () => {
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
          setLocationStatus('Permission Denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  }

  const getOneTimeLocation = () => {
    setLocationStatus('Getting Location ...');
    Geolocation.getCurrentPosition(
      //Will give you the current location
      (position) => {
        setLocationStatus('You are Here');

        //getting the Longitude from the location json
        const currentLongitude =
          JSON.stringify(position.coords.longitude);

        //getting the Latitude from the location json
        const currentLatitude =
          JSON.stringify(position.coords.latitude);

        //Setting Longitude state
        setCurrentLongitude(currentLongitude);

        //Setting Longitude state
        setCurrentLatitude(currentLatitude);
        global.CurrentLongitude = currentLongitude
        global.CurrentLatitude = currentLongitude
      },
      (error) => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000
      },
    );
  };

  const getTags = (id) => {
    setLoading(true)
    axios.get(`${BASE_URL}/service-tag/list/${id}`)
      .then(res => {
        var data = []
        for (var i in res.data) {
          var obj = {}
          obj.name = res.data[i].name;
          obj.values = [];
          if (res.data[i].value) {
            var temp = res.data[i].value.split('|');
            for (var j in temp) {
              obj.values.push({ isSelected: false, value: temp[j] });
            }

            data.push(obj);
          }
        }

        setTagList(data)
        setSelectedTags(res.data[0].name)
        setLoading(false)
      })
      .catch(e => {
        console.log('e', e)
        setLoading(false)
      })
  }

  const _onFavourite = (id) => {
    setLoading(true)
    console.log("id", id)
    axios.post(`${BASE_URL}/favourite`, {
      style_id: id
    })
      .then(res => {
        console.log("response fav", res.data)
        getTopStyleList()
        setLoading(false)
      })
      .catch(e => {
        console.log('e', e)
        setLoading(false)
      })
  }

  const _addTags = (i, j) => {
    // setTags([...tags, name]);
    var temp = [];
    for (var index in tagList[i].values) {
      console.log(index)
      if (index == j) { tagList[i].values[index].isSelected = true; }
      temp.push(tagList[i])
    }
    console.log(">>>>>>>>>>>>" + temp)
    setTags(temp)

  }

  const removeTags = (i, j) => {
    var temp = [];
    for (var index in tagList[i].values) {
      console.log(index)
      if (index == j) { tagList[i].values[index].isSelected = false; }
      temp.push(tagList[i])
    }
    console.log(">>>>>>>>>>>>" + temp)
    setTags(temp)
  };

  return (
    <View style={styles.container}>
      {
        <Header {...props} />
      }
      {
        isLoading && <Loader />
      }
      {
        <View>
          <TextInput placeholder="Search By Styles" style={{ borderWidth: 1, marginLeft: 26.5, marginRight: 26.5, paddingLeft: 18.5 }} />
          <Pressable style={{ backgroundColor: '#010101', marginLeft: 27, marginTop: 16.5, marginRight: 27 }} onPress={() => setModalVisible(true)}>
            <Text style={{ color: '#FFFFFF', fontSize: 16, marginLeft: 18, marginTop: 15.50, marginBottom: 17 }}>Tags</Text>
          </Pressable>
        </View>
      }
      {
        <ScrollView>
          {
            <View>
              <Text style={{ color: '#1A1919', fontSize: 16, marginLeft: 28, marginTop: 26.67 }}>Top Cuts</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {
                  list?.top_cuts?.map((item, index) => {
                    return (
                      <Pressable style={styles.GridViewBlockStyle} key={index} onPress={() => _onFavourite(item.style_id)}>
                        <ImageBackground
                          style={{ marginLeft: 20, marginTop: 14, height: height * 0.15, width: width * 0.27, alignItems: 'flex-end' }}
                          //   source={require('../../Images/upcoming.png')}
                          source={{
                            uri: `${item.upload_front_photo}`,
                          }}
                        >
                          {
                            item.is_fav == 1 ?
                              <Image
                                style={{ marginTop: 7, marginRight: 7.51 }}
                                source={require('../../../Images/heart.png')}
                              />
                              :
                              <Image
                                style={{ marginTop: 7, marginRight: 7.51 }}
                                source={require('../../../Images/empty_heart.png')}
                              />
                          }

                        </ImageBackground>
                      </Pressable>
                    )
                  })
                }
              </View>
            </View>
          }
          {
            <View style={{marginBottom: 20}}>
              <Text style={{ color: '#1A1919', fontSize: 16, marginLeft: 28, marginTop: 25 }}>Popular Styles</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {
                  list?.top_styles?.map((item, index) => {
                    return (
                      <Pressable style={styles.GridViewBlockStyle} key={index} onPress={() => _onFavourite(item.style_id)}>
                        <ImageBackground
                          style={{ marginLeft: 20, marginTop: 14, height: height * 0.15, width: width * 0.27, alignItems: 'flex-end' }}
                          //   source={require('../../../Images/upcoming.png')}
                          source={{
                            uri: `${item.upload_front_photo}`,
                          }}
                        >
                          {
                            item.is_fav == 1 ?
                              <Image
                                style={{ marginTop: 7, marginRight: 7.51 }}
                                source={require('../../../Images/heart.png')}
                              />
                              :
                              <Image
                                style={{ marginTop: 7, marginRight: 7.51 }}
                                source={require('../../../Images/empty_heart.png')}
                              />
                          }
                        </ImageBackground>
                      </Pressable>
                    )
                  })
                }
              </View>
            </View>
          }
        </ScrollView>
      }
    </View>
  )
}
export default HelloWorldApp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  GridViewBlockStyle: {
    //  justifyContent: 'center',
    //  flex: 1,
    //  alignItems: 'center',
    //  marginRight: 20,
    //  height: 100,
    //  margin: 5,
    // backgroundColor: 'red'
  },
  GridViewInsideTextItemStyle: {
    color: '#fff',
    padding: 10,
    fontSize: 18,
    justifyContent: 'center',
  },
  centeredView: {
    flex: 1,
    // justifyContent: "center",
    //   alignItems: "center",
    marginTop: 107.5
  },
  modalView: {
    margin: 15,
    backgroundColor: "white",
    //   borderRadius: 20,
    //   padding: 35,
    //   alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
})