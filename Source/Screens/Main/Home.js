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
  PixelRatio
} from 'react-native';

import { BASE_URL } from '../../Config';
import axios from 'axios';
import { setAuthToken } from '../../Utils/setHeader';
import { useSelector, useDispatch } from 'react-redux';
import MapView from 'react-native-maps';
import Loader from '../../Components/Loader';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const Home = (props) => {
  const dispatch = useDispatch()
  const auth = useSelector(state => state.auth)
  const [viewHideShow, setViewHideShow] = useState(false);
  const [storeList, setStoreList] = useState([]);
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    let isCancelled = false;
    if (!isCancelled) {
      if (auth.access_token) {
        setAuthToken(auth.access_token)
        getStoreList()
      }
    }
    return () => {
      isCancelled = true
    }
  }, [])

  const getStoreList = () => {
    setLoading(true)
    axios.get(`${BASE_URL}/store/list`)
      .then(res => {
        setStoreList(res.data)
        console.log('res', res.data)
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
              style={{ marginLeft: 18, marginRight: 37 }}
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
      </View>
      <View style={{ bottom: 0, backgroundColor: 'white', height: viewHideShow == true ? 410 : height * 0.38, position: 'absolute', }}>
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
              <View style={{flex : 1}}>
                <Text>NO store available</Text>
              </View>
              :
              storeList.map((res) => {
                return (
                  <Pressable style={{ flexDirection: 'row', marginLeft: 28, marginTop: 29.38, }} onPress={() => props.navigation.navigate('StoreDescription', { storeDetails: res })}>
                    <Image source={require('../../Images/home_dummy.png')} />
                    <View style={{ marginLeft: 23 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ color: '#1A1919', fontSize: 15, fontFamily: 'Avenir-Medium' }}>{res.store_name}</Text>
                        <Text style={{ marginRight: 27 }}>8-18 Open</Text>
                      </View>
                      <Text style={{ fontSize: 12, fontFamily: 'Avenir-Medium' }}>0.4 Miles</Text>
                      <Text style={{ fontSize: 14, fontFamily: 'Avenir-Heavy' }}>££</Text>
                      <Text style={{ width: width * 0.69, fontSize: 12, fontFamily: 'Avenir-Medium' }}>Step into our salon and experience the most contemporary hair services.</Text>
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