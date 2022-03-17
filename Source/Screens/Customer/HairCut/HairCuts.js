import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Pressable,
  ImageBackground,
  ScrollView
} from 'react-native';
import Header from '../../../Components/Header'
import { BASE_URL, height, width } from '../../../Config';
import Loader from '../../../Components/Loader';


const HelloWorldApp = ({ navigation, props }) => {
  const [list, setList] = useState([]);
  const [isLoading, setLoading] = useState(false)


  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getAllFavouriteList();
    });

    return unsubscribe;
  }, [navigation])

  const getAllFavouriteList = () => {
    setLoading(true)
    axios.get(`${BASE_URL}/all/favourite`)
      .then(res => {
        setList(res.data)
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
        <ScrollView style={{ marginBottom: 15 }}>
          <Text style={styles.heading}>Saved and Custom Styles</Text>
          {
            list.map((res, index) => {
              return (
                <View key={index}>
                  <Text style={styles.serviceName}>{res.name}</Text>
                  <ScrollView style={styles.serviceView} horizontal={true} showsHorizontalScrollIndicator={false}>
                    {
                      res.list.map((val, index) => {
                        return (
                          <Pressable key={index} onPress={() => navigation.navigate('HairCutDescriptionScreen', { id: val.style_id })}>
                            <ImageBackground
                              style={styles.serviceImage}
                              source={{
                                uri: `${val.upload_front_photo}`,
                              }}
                            >
                              {
                                val.is_custom === 1 ?
                                  <Image
                                    style={styles.sciscorImage}
                                    source={require('../../../Images/scisor.png')}
                                  />
                                  :
                                  <Image
                                    style={styles.sciscorImage}
                                    source={require('../../../Images/heart.png')}
                                  />
                              }
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
    flexDirection: 'row'
  },
  heading: {
    color: '#1A1919',
    fontSize: 16,
    marginLeft: 27,
    fontFamily: 'Avenir-Heavy'
  },
  serviceName: {
    color: '#1A1919',
    fontSize: 16,
    fontFamily: 'Avenir-Medium',
    marginLeft: 27,
    marginTop: 10
  },
  serviceView: {
    flexDirection: 'row',
    marginRight: 20
  },
  serviceImage: {
    marginLeft: 11, 
    marginTop: 14, 
    height: height * 0.16, 
    width: width * 0.28, 
    alignItems: 'flex-end',
  },
  sciscorImage: {
    marginTop: 7, 
    marginRight: 7.51
  }
})