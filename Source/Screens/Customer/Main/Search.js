import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
  ScrollView,
  ImageBackground,
  PermissionsAndroid,
} from 'react-native';

import Header from '../../../Components/Header'
import { BASE_URL, height, width } from '../../../Config';
import Loader from '../../../Components/Loader';
import { useSelector, useDispatch } from 'react-redux';
import { setAuthToken } from '../../../Utils/setHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import Dialog, { DialogContent } from 'react-native-popup-dialog';
import strings from '../../../Localization/strings';



const HelloWorldApp = (props) => {
  const [keyword, setKeyword] = useState('')
  const [modalVisible, setModalVisible] = useState(false);
  const [list, setList] = useState(false);
  const [tagList, setTagList] = useState([]);
  const [search, setSearch] = useState('');
  const [tags, setTags] = useState([]);
  const [tagsList, setTagsList] = useState([]);
  const [serviceData, setServiceData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [selectedTags, setSelectedTags] = useState('');
  const [selectedSubTags, setSelectedSubTags] = useState('');
  const [isLoading, setLoading] = useState(false)
  const auth = useSelector(state => state.auth)
  const [currentLongitude, setCurrentLongitude] = useState('...');
  const [currentLatitude, setCurrentLatitude] = useState('...');
  const [locationStatus, setLocationStatus] = useState('');
  let isApiCall = false;

  useEffect(() => {
    let isCancelled = false;
    if (!isCancelled) {
      if (auth.access_token) {
        locationPermission()
        setAuthToken(auth.access_token)
        getTopStyleList();
        getServiceList()
        getUserInfo()
      }
    }
    return () => {
      isCancelled = true
    }
  }, [])

  const renderHeader = () => {
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: '30%' }}>
        <Image source={require('../../../Images/hairkut.png')} style={{ resizeMode: 'contain' }} />
        <View style={{ flexDirection: 'row' }}>
          <Pressable onPress={() => props.navigation.navigate('StyleScreen')}>
            <Image source={require('../../../Images/search.png')} style={{ resizeMode: 'contain' }} />
          </Pressable>
          <Pressable onPress={() => props.navigation.navigate('TagSearchScreen')}>
            <Image source={require('../../../Images/filter.png')} style={{ resizeMode: 'contain', marginLeft: '20%' }} />
          </Pressable>
        </View>
      </View>
    )
  }

  const getUserInfo = async () => {
    setLoading(true)
    axios.get(`${BASE_URL}/users/me`)
      .then(res => {
        try {
          const jsonValue = JSON.stringify(res.data)
          AsyncStorage.setItem('@user_details', jsonValue)
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
        //    getTags(res.data.service_id)
        setLoading(false)
      })
      .catch(e => {
        console.log('e', e)
        setLoading(false)
      })
  }

  const locationPermission = async () => {
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
          setLoading(false)
        } else {
          setLocationStatus('Permission Denied');
          setLoading(false)
        }
      } catch (err) {
        console.warn(err);
        setLoading(false)
      }
    }
  }

  const getOneTimeLocation = () => {
    setLoading(true)
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
        setLoading(false)
      },
      (error) => {
        setLocationStatus(error.message);
        setLoading(false)
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000
      },
    );
  };

  const getServiceList = () => {
    axios.get(`${BASE_URL}/service/all/list`)
      .then(res => {
        console.log("d", res.data)
        setServiceData(res.data)
        getTags(res.data[0].id)
        setSelectedTags(res.data[0].name)
        setLoading(false)
      })
      .catch(e => {
        console.log('e', e)
        setLoading(false)
      })
  }

  const getTags = (id) => {
    setLoading(true)
    axios.get(`${BASE_URL}/service/tag/${id}`)
      .then(res => {
        console.log("response", res.data)
        if (res.data.value) {
          var temp = res.data.value.split('|');
          var tags = [];
          for (var index in temp) {
            tags.push({ isSelected: false, value: temp[index] })
          }
          console.log("TAGS", tags)
          setTagList(tags)
        }
        setLoading(false)
      })
      .catch(e => {
        console.log('e', e)
        setLoading(false)
      })
  }

  const _onSelectedTags = (tag) => {
    setLoading(true)
    axios.get(`${BASE_URL}/search/keyword?keyword=${tag}`)
      .then(res => {
        console.log("gfgahdfa", res.data)
        setTagsList(res.data)
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
        getTopStyleList()
        _onSelectedTags(selectedSubTags)
        setLoading(false)
      })
      .catch(e => {
        console.log('e', e)
        setLoading(false)
      })
  }



  const _addTags = (j) => {
    var temp = [];
    for (var index in tagList) {
      if (index == j) {
        tagList[j].isSelected = !tagList[j].isSelected;
      }

      temp.push(tagList[index])
      // console.log("TEMP",temp)
      setTagList(temp)
    }
    for (var index in tagList) {
      if (tagList[index].isSelected == true) {
        _onSelectedTags(tagList[index].value,)
      }
    }
  }

  const _onSearch = (event) => {
    setTimeout(() => {
      axios.get(`${BASE_URL}/search/styles?name=${search}`)
        .then(res => {
          console.log("a", res.data)
          setSearchData(res.data)
          setLoading(false)
        })
        .catch(e => {
          console.log('e', e)
          setLoading(false)
        })
    }, 2000);
  }

  const onSelectServiceId = (res) => {
    setSelectedTags(res.name)
    getTags(res.id)
  }

  const SearchBarButton = () => {
    return (
      <View>
        <View style={styles.row}>
          <TextInput placeholder={strings.search_by_styles} style={styles.searchBar} onChangeText={text => setSearch(text)} />
          <Pressable style={{ borderWidth: 1 }} onPress={() => _onSearch()}>
            <Image source={require('../../../Images/search.png')} style={styles.searchIcon} />
          </Pressable>
        </View>
        <Pressable style={styles.tagButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.tagButtonText}>{strings.tags}</Text>
        </Pressable>
      </View>
    )
  }

  const SearchData = () => {
    return (
      <View>
        {
          searchData.map((res, index) => {
            return (
              <Pressable key={index} onPress={() => _onFavourite(res.id)}>
                <ImageBackground
                  style={styles.searchImage}
                  source={{
                    uri: `${res.upload_front_photo != null ? res.upload_front_photo : res.upload_back_photo != null ? res.upload_back_photo : res.upload_top_photo != null ? res.upload_top_photo : res.upload_right_photo != null ? res.upload_right_photo : res.upload_left_photo != null ? res.upload_left_photo : res.upload_left_photo}`,
                  }}
                >
                  {
                    res.is_fav == 1 ?
                      <Image
                        style={styles.heartIcon}
                        source={require('../../../Images/heart.png')}
                      />
                      :
                      <Image
                        style={styles.heartIcon}
                        source={require('../../../Images/empty_heart.png')}
                      />
                  }
                </ImageBackground>
              </Pressable>
            )
          })
        }
      </View>
    )
  }

  const TopCuts = () => {
    return (
      <View>
        <Text style={styles.topCutText}>{strings.top_cuts}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {
            list?.top_cuts?.map((item, index) => {
              return (
                <Pressable key={index} onPress={() => _onFavourite(item.style_id)}>
                  <ImageBackground
                    style={styles.searchImage}
                    source={{
                      uri: `${item.upload_front_photo != null ? item.upload_front_photo : item.upload_back_photo != null ? item.upload_back_photo : item.upload_top_photo != null ? item.upload_top_photo : item.upload_right_photo != null ? item.upload_right_photo : item.upload_left_photo != null ? item.upload_left_photo : item.upload_left_photo}`,
                    }}
                  >
                    {
                      item.is_fav == 1 ?
                        <Image
                          style={styles.heartIcon}
                          source={require('../../../Images/heart.png')}
                        />
                        :
                        <Image
                          style={styles.heartIcon}
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
    )
  }

  const PopularStyles = () => {
    return (
      <View style={{ marginBottom: 20 }}>
        <Text style={styles.popularStyleText}>{strings.popular_styles}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {
            list?.top_styles?.map((item, index) => {
              return (
                <Pressable key={index} onPress={() => _onFavourite(item.style_id)}>
                  <ImageBackground
                    style={styles.searchImage}
                    source={{
                      uri: `${item.upload_front_photo != null ? item.upload_front_photo : item.upload_back_photo != null ? item.upload_back_photo : item.upload_top_photo != null ? item.upload_top_photo : item.upload_right_photo != null ? item.upload_right_photo : item.upload_left_photo != null ? item.upload_left_photo : item.upload_left_photo}`,
                    }}
                  >
                    {
                      item.is_fav == 1 ?
                        <Image
                          style={styles.heartIcon}
                          source={require('../../../Images/heart.png')}
                        />
                        :
                        <Image
                          style={styles.heartIcon}
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
    )
  }

  const TagData = () => {
    return (
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 }}>
        {
          tagsList?.map((res, index) => {
            return (
              <Pressable key={index} onPress={() => _onFavourite(res.style_id)}>
                <ImageBackground
                  style={styles.searchImage}
                  source={{
                    uri: `${res?.style?.upload_front_photo != null ? res?.style?.upload_front_photo : res?.style?.upload_back_photo != null ? res?.style?.upload_back_photo : res?.style?.upload_top_photo != null ? res?.style?.upload_top_photo : res?.style?.upload_right_photo != null ? res?.style?.upload_right_photo : res?.style?.upload_left_photo != null ? res?.style?.upload_left_photo : res?.style?.upload_left_photo}`,
                  }}
                >
                  {
                    res.is_fav == 1 ?
                      <Image
                        style={styles.heartIcon}
                        source={require('../../../Images/heart.png')}
                      />
                      :
                      <Image
                        style={styles.heartIcon}
                        source={require('../../../Images/empty_heart.png')}
                      />
                  }
                </ImageBackground>
              </Pressable>
            )
          })
        }
      </View>
    )
  }

  const TagModal = () => {
    return (
      <Dialog
        visible={modalVisible}
        onTouchOutside={() => {
          setModalVisible(!modalVisible);
        }}
        dialogStyle={{ bottom: 60 }}
      >
        <DialogContent>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.tagView}>
                <Text style={styles.selectTagText}>{strings.select_tags}</Text>
                <Pressable onPress={() => setModalVisible(!modalVisible)}>
                  <Image
                    style={styles.crossImage}
                    source={require('../../../Images/cross.png')}
                  />
                </Pressable>
              </View>
              <View style={styles.serviceView}>
                {
                  serviceData.map((res, index) => {
                    return (
                      <Pressable key={index} style={res.name == selectedTags ? styles.selectedServiceButton : null} onPress={() => onSelectServiceId(res)}>
                        <Text style={res.name == selectedTags ? styles.selectedServiceButtonText : styles.unselectedServiceText}>{res.name}</Text>
                      </Pressable>
                    )
                  })
                }
              </View>
              <View style={styles.subTagView}>
                {
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap' }} >
                    {
                      tagList.map((val, j) => {
                        return (
                          <Pressable key={j} style={val.isSelected == true ? styles.subTagSelectedButton : styles.subTagUnselectedButton} onPress={() => _addTags(j)}>
                            <Text style={val.isSelected == true ? styles.subTagSelectedButtonText : styles.subTagUnselectedButtonText}>{val.value}</Text>
                          </Pressable>
                        )
                      })
                    }
                  </View>
                }
              </View>
            </View>
          </View>
        </DialogContent>
      </Dialog>
    )
  }


  return (
    <View style={styles.container}>
      {/* {
        <Header {...props} />
      } */}
      {renderHeader()}
      {
        isLoading && <Loader />
      }
      {/* {SearchBarButton()} */}
      {
        // <ScrollView>
        //   {
        //     selectedSubTags == '' ?
        //       <View>
        //         {
        //           search != '' ?
        //             SearchData()
        //             :
        //             TopCuts()
        //         }
        //         {
        //           search != '' ?
        //             null
        //             :
        //             PopularStyles()
        //         }
        //       </View>
        //       :
        //       TagData()
        //   }
        // </ScrollView>
        <ScrollView>
          {TopCuts()}
          {PopularStyles()}
        </ScrollView>
      }
      {TagModal()}
    </View>
  )
}
export default HelloWorldApp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  GridViewInsideTextItemStyle: {
    color: '#fff',
    padding: 10,
    fontSize: 18,
    justifyContent: 'center',
  },
  centeredView: {
    width: 320
  },
  row: {
    flexDirection: 'row'
  },
  searchBar: {
    borderWidth: 1,
    marginLeft: 20,
    marginRight: 20,
    paddingLeft: 18.5,
    fontFamily: 'Avenir-Book',
    lineHeight: 22,
    fontSize: 16,
    width: '75%'
  },
  searchIcon: {
    marginTop: 15,
    marginLeft: 10,
    marginRight: 10
  },
  tagButton: {
    backgroundColor: '#010101',
    marginLeft: 20,
    marginTop: 16.5,
    marginRight: 20
  },
  tagButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 18,
    marginTop: 15.50,
    marginBottom: 17,
    fontFamily: 'Avenir-Book',
    lineHeight: 22
  },
  searchImage: {
    marginLeft: 20,
    marginTop: 14,
    height: height * 0.15,
    width: width * 0.265,
    alignItems: 'flex-end'
  },
  heartIcon: {
    marginTop: 7,
    marginRight: 7.51
  },
  topCutText: {
    color: '#1A1919',
    fontSize: 16,
    marginLeft: 20,
    marginTop: 26.67,
    fontFamily: 'Avenir-Heavy',
    lineHeight: 22
  },
  popularStyleText: {
    color: '#1A1919',
    fontSize: 16,
    marginLeft: 20,
    marginTop: 25,
    fontFamily: 'Avenir-Heavy',
    lineHeight: 22
  },
  tagView: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  selectTagText: {
    color: '#1A1919',
    fontSize: 18,
    marginLeft: 115,
    marginTop: 10.5,
    fontFamily: 'Avenir-Heavy'
  },
  crossImage: {
    marginRight: 13.45,
    marginTop: 16.5
  },
  serviceView: {
    backgroundColor: '#D8D8D8',
    marginTop: 8,
    borderRadius: 5,
    flexDirection: 'row',
    width: 330
  },
  selectedServiceButton: {
    backgroundColor: '#141313',
    marginTop: 11,
    marginLeft: 10,
    marginBottom: 11,
    width: 75,
    borderRadius: 5
  },
  selectedServiceButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 7
  },
  unselectedServiceText: {
    color: '#000000',
    fontSize: 14,
    fontFamily: 'Avenir-Heavy',
    marginLeft: 25,
    marginTop: 15
  },
  subTagView: {
    flexDirection: 'row',
    marginTop: 18,
    marginBottom: 44.5
  },
  subTagSelectedButton: {
    backgroundColor: '#4D4C4C',
    borderRadius: 17,
    marginLeft: 4,
    justifyContent: 'center',
    marginTop: 8
  },
  subTagSelectedButtonText: {
    color: '#1A1919',
    fontSize: 14,
    fontFamily: 'Avenir-Heavy',
    textAlign: 'center',
    paddingTop: 5,
    paddingBottom: 7,
    paddingLeft: 22,
    paddingRight: 21,
    color: '#FFFFFF'
  },
  subTagUnselectedButton: {
    backgroundColor: '#D8D8D8',
    borderRadius: 17,
    marginLeft: 4,
    justifyContent: 'center',
    marginTop: 8
  },
  subTagUnselectedButtonText: {
    color: '#1A1919',
    fontSize: 14,
    fontFamily: 'Avenir-Heavy',
    textAlign: 'center',
    paddingTop: 5,
    paddingBottom: 7,
    paddingLeft: 22,
    paddingRight: 21
  }
})