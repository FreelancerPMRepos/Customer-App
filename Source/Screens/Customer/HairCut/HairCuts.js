import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  ImageBackground,
  ScrollView
} from 'react-native';
import Header from '../../../Components/Header'
import { BASE_URL, height, IMAGE_URL, width } from '../../../Config';
import Loader from '../../../Components/Loader';

const GridViewItems = [
  { key: '../../../Images/cut1.png' },
  { key: '../../../Images/cut2.png' },
  { key: '../../../Images/upcoming.png' },
]

const HelloWorldApp = ({navigation,props}) => {
  const [list, setList] = useState([]);
  const [isLoading, setLoading] = useState(false)


  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getAllFavouriteList();
    });

    return unsubscribe;
  }, [navigation])

 

  console.log("key", GridViewItems.key)

  const getAllFavouriteList = () => {
    setLoading(true)
    axios.get(`${BASE_URL}/all/favourite`)
      .then(res => {
        setList(res.data)
        console.log('res All Favourite style', res.data)
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
        <Header {...props} />
      }
       {
        isLoading && <Loader />
      }
      {
        <ScrollView style={{marginBottom: 15}}>
          <Text style={{ color: '#1A1919', fontSize: 16, marginLeft: 27, marginTop: 28, fontFamily: 'Avenir-Heavy' }}>Saved and Custom Styles</Text>
          {/* <Text style={{ color: '#1A1919', fontSize: 16, fontFamily: 'Avenir-Medium', marginLeft: 27, marginTop: 34.67 }}>Haircuts</Text> */}
          {
            list.map((res, index) => {
              console.log("res", res.list.length)
              return (
                <View key={index}>
                  <Text style={{ color: '#1A1919', fontSize: 16, fontFamily: 'Avenir-Medium', marginLeft: 27, marginTop: 10 }}>{res.name}</Text>
                  <ScrollView style={{ flexDirection: 'row', marginRight: 20 }} horizontal={true} showsHorizontalScrollIndicator={false}>
                    {
                      res.list.map((val, index) => {
                        return (
                          <Pressable style={{}} key={index} onPress={() => navigation.navigate('HairCutDescriptionScreen', { id: val.style_id})}>
                            <ImageBackground
                              style={{ marginLeft: 11, marginTop: 14, height: height * 0.16, width: width * 0.28, alignItems: 'flex-end', }}
                              //  source={require('../../Images/upcoming.png')}
                              source={{
                                uri: `${val.upload_front_photo}`,
                              }}
                            >
                              <Image
                                style={{ marginTop: 7, marginRight: 7.51 }}
                                source={require('../../../Images/heart.png')}
                              />
                            </ImageBackground>
                          </Pressable>
                        )
                      })
                    }
                  </ScrollView>
                </View>
              )
            })
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
    //  justifyContent: '',
    //   flex: 1,
    //   alignItems: 'center',
    //  marginRight: 20,
    flexDirection: 'row'
    //  height: 100,
    //  margin: 5,
    // backgroundColor: '#00BCD4'
  },
})