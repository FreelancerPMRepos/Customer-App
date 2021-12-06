import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  ImageBackground
} from 'react-native';
import Header from '../../Components/Header'
import { BASE_URL, height, width } from '../../Config';

const GridViewItems = [
  { key: '../../Images/cut1.png' },
  { key: '../../Images/cut2.png' },
  { key: '../../Images/upcoming.png' },
]

const HelloWorldApp = (props) => {
  const [list, setList] = useState([]);

  useEffect(() => {
    getAllFavouriteList();
  }, [])

  console.log("key", GridViewItems.key)

  const getAllFavouriteList = () => {
    axios.get(`${BASE_URL}/all/favourite`)
      .then(res => {
        setList(res.data)
        console.log('res All Favourite style', res.data)
      })
      .catch(e => {
        console.log('e', e)
      })
  }
  return (
    <View style={styles.container}>
      {
        <Header {...props} />
      }
      {
        <View>
          <Text style={{ color: '#1A1919', fontSize: 16, marginLeft: 27, marginTop: 28, fontFamily: 'Avenir-Heavy' }}>Saved and Custom Styles</Text>
          <Text style={{ color: '#1A1919', fontSize: 16, fontFamily: 'Avenir-Medium', marginLeft: 27, marginTop: 34.67 }}>Haircuts</Text>
          <FlatList
            data={GridViewItems}
            renderItem={({ item }) =>
              <View style={styles.GridViewBlockStyle}>
                <ImageBackground
                  style={{ marginLeft: 26, marginTop: 14, height: height * 0.16, width: width * 0.28, alignItems: 'flex-end' }}
                  source={require(`../../Images/upcoming.png`)}
                >
                  <Image
                    style={{ marginTop: 7, marginRight: 7.51 }}
                    source={require('../../Images/heart.png')}
                  />
                </ImageBackground>
              </View>}
            numColumns={3}
          />
          <Text style={{ color: '#1A1919', fontSize: 16, fontFamily: 'Avenir-Medium', marginLeft: 27, marginTop: 14.67 }}>Dyes</Text>
          <FlatList
            data={GridViewItems}
            renderItem={({ item }) =>
              <Pressable style={styles.GridViewBlockStyle} onPress={() => props.navigation.navigate('HairCutDescriptionScreen')}>
                <ImageBackground
                  style={{ marginLeft: 26, marginTop: 14, height: height * 0.16, width: width * 0.28, alignItems: 'flex-end' }}
                  source={require('../../Images/upcoming.png')}
                >
                  <Image
                    style={{ marginTop: 7, marginRight: 7.51, }}
                    source={require('../../Images/scisor.png')}
                  />
                </ImageBackground>
              </Pressable>}
            numColumns={3}
          />
          <Text style={{ color: '#1A1919', fontSize: 16, fontFamily: 'Avenir-Medium', marginLeft: 27, marginTop: 14.67 }}>Nails</Text>
          <FlatList
            data={GridViewItems}
            renderItem={({ item }) =>
              <View style={styles.GridViewBlockStyle}>
                <ImageBackground
                  style={{ marginLeft: 26, marginTop: 14, height: height * 0.16, width: width * 0.28, alignItems: 'flex-end' }}
                  source={require('../../Images/upcoming.png')}
                >
                  <Image
                    style={{ marginTop: 7, marginRight: 7.51 }}
                    source={require('../../Images/scisor.png')}
                  />
                </ImageBackground>
                {/* <Text style={styles.GridViewInsideTextItemStyle} onPress={GetGridViewItem.bind(this, item.key)} > {item.key} </Text> */}
              </View>}
            numColumns={3}
          />
        </View>
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
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
    marginRight: 20
    //  height: 100,
    //  margin: 5,
    // backgroundColor: '#00BCD4'
  },
})