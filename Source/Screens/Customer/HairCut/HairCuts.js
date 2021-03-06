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
        global.is_data = false
        for (var i in res.data) {
          if (res.data[i].list.length > 0) {
            global.is_data = true
          }
        }
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
      <Text style={styles.heading}>Saved and Custom Styles</Text>
      {
        global.is_data === false ?
          <View style={styles.errorView}>
            <Text style={styles.errorMessage}>{`You don't have any current style saved... \n Search for some!`}</Text>
          </View>
          :
          <ScrollView style={{ marginBottom: 15, }}>
            {
              list.map((res, index) => {
                return (
                  res.list.length == 0 ? null :
                    <View key={index}>
                      <Text style={styles.serviceName}>{res.list.length == 0 ? null : res.name}</Text>
                      <View style={{ flexDirection: 'row' }}>
                        <ScrollView style={styles.serviceView} horizontal={true} showsHorizontalScrollIndicator={false}>
                          {
                            res.list.map((val, index) => {
                              console.log("val", val)
                              return (
                                <Pressable key={index} onPress={() => navigation.navigate('HairCutDescriptionScreen', { id: val.style_id })}>
                                  <ImageBackground
                                    style={styles.serviceImage}
                                    source={{
                                      uri: `${val.upload_front_photo != null ? val.upload_front_photo : val.upload_back_photo != null ? val.upload_back_photo : val.upload_top_photo != null ? val.upload_top_photo : val.upload_right_photo != null ? val.upload_right_photo : val.upload_left_photo != null ? val.upload_left_photo : val.upload_left_photo}`,
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
                        {
                          res.list.length > 3 ?
                            <View style={{justifyContent: 'center'}}>
                              <Image
                                style={{height: 20, width: 20}}
                                source={require('../../../Images/right-arrow-black.png')}
                              />
                            </View> : null
                        }
                      </View>
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
  },
  errorView: {
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    flex: 1
  },
  errorMessage: {
    textAlign: 'center',
    lineHeight: 25,
    fontSize: 16
  }
})