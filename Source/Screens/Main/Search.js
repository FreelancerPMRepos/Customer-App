import axios from 'axios';
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
  LogBox
} from 'react-native';
import Header from '../../Components/Header'
import { BASE_URL, height, IMAGE_URL, width } from '../../Config';
import Loader from '../../Components/Loader';

const GridViewItems = [
  { key: '1' },
  { key: '2' },
  { key: '3' },
]

const HelloWorldApp = (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [list, setList] = useState(false);
  const [tagList, setTagList] = useState([]);
  const [selectedTags, setSelectedTags] = useState('');
  const [selectedSubTags, setSelectedSubTags] = useState('');
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    getTopStyleList();
    getTags()
  }, [])

  const getTopStyleList = () => {
    setLoading(true)
    axios.get(`${BASE_URL}/top/cuts/styles`)
      .then(res => {
        setList(res.data)
        console.log('res Top style', res.data.top_cuts)
        setLoading(false)
      })
      .catch(e => {
        console.log('e', e)
        setLoading(false)
      })
  }

  const getTags = () => {
    setLoading(true)
    axios.get(`${BASE_URL}/service/all/list`)
      .then(res => {
        setTagList(res.data)
        console.log('res Tags', res.data)
        setSelectedTags(res.data[0].name)
        setLoading(false)
      })
      .catch(e => {
        console.log('e', e)
        setLoading(false)
      })
  }

  return (
    <ScrollView style={styles.container}>
      {
        <Header {...props} />
      }
      {
        isLoading && <Loader />
      }
      {
        <View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: '#1A1919', fontSize: 18, marginLeft: 130, marginTop: 14.5, fontFamily: 'Avenir-Heavy' }}>Select Tags</Text>
                  <Pressable onPress={() => setModalVisible(!modalVisible)}>
                    <Image
                      style={{ marginRight: 13.45, marginTop: 16.5 }}
                      source={require('../../Images/cross.png')}
                    />
                  </Pressable>
                </View>
                <View style={{ backgroundColor: '#D8D8D8', marginLeft: 7.5, marginTop: 8, borderRadius: 5, flexDirection: 'row' }}>
                  {
                    tagList.map((res, index) => {
                      return (
                        <View key={index}>
                          {
                            res.name == selectedTags ?
                              <Pressable style={{ backgroundColor: '#141313', marginTop: 11, marginLeft: 10, marginBottom: 11, width: 75, borderRadius: 5 }} onPress={() => setSelectedTags('Cut')}>
                                <Text style={{ color: '#FFFFFF', textAlign: 'center', marginTop: 8, marginBottom: 7 }}>{res.name}</Text>
                              </Pressable>
                              :
                              <Pressable onPress={() => setSelectedTags(res.name)}>
                                <Text style={{ color: '#000000', fontSize: 14, fontFamily: 'Avenir-Heavy', marginLeft: 25, marginTop: 15 }}>{res.name}</Text>
                              </Pressable>
                          }
                        </View>
                      )
                    })
                  }
                  {/* <Text style={{ color: '#000000', fontSize: 14, fontFamily: 'Avenir-Heavy', marginLeft: 25, marginTop: 15 }}>Blowout</Text>
                  <Text style={{ color: '#000000', fontSize: 14, fontFamily: 'Avenir-Heavy', marginLeft: 25, marginTop: 15 }}>Dyes</Text> */}
                </View>
                <View style={{ flexDirection: 'row', marginLeft: 17.5, marginTop: 18, marginBottom: 44.5 }}>
                  <View style={{ backgroundColor: '#4D4C4C', borderRadius: 17 }}>
                    <Text style={{ color: '#FFFFFF', fontSize: 14, fontFamily: 'Avenir-Heavy', textAlign: 'center', marginLeft: 19, marginTop: 8, marginBottom: 7, marginRight: 20 }}>Bald</Text>
                  </View>
                  {
                    tagList.map((res, index) => {
                      return (
                        <View key={index}>
                          {
                            res.name == selectedTags ?
                              <View style={{ backgroundColor: '#D8D8D8', borderRadius: 17, marginLeft: 4 }}>
                                <Text style={{ color: '#1A1919', fontSize: 14, fontFamily: 'Avenir-Heavy', textAlign: 'center', marginLeft: 19, marginTop: 8, marginBottom: 7, marginRight: 20 }}>{res.name}</Text>
                              </View>
                              :
                              null
                          }
                        </View>
                      )
                    })
                  }

                </View>
              </View>
            </View>
          </Modal>



          <TextInput placeholder="Search By Styles" style={{ borderWidth: 1, marginLeft: 26.5, marginRight: 26.5, paddingLeft: 18.5 }} />
          <Pressable style={{ backgroundColor: '#010101', marginLeft: 27, marginTop: 16.5, marginRight: 27 }} onPress={() => setModalVisible(true)}>
            <Text style={{ color: '#FFFFFF', fontSize: 16, marginLeft: 18, marginTop: 15.50, marginBottom: 17 }}>Tags</Text>
          </Pressable>
          <Text style={{ color: '#1A1919', fontSize: 16, marginLeft: 28, marginTop: 26.67 }}>Top Cuts</Text>
          <FlatList
            data={list.top_cuts}
            renderItem={({ item, index }) => {
              console.log("item", item.upload_front_photo)
              return (
                <View style={styles.GridViewBlockStyle} key={index}>
                  <ImageBackground
                    style={{ marginLeft: 20, marginTop: 14, height: height * 0.15, width: width * 0.27, alignItems: 'flex-end' }}
                    //   source={require('../../Images/upcoming.png')}
                    source={{
                      uri: `${item.upload_front_photo}`,
                    }}
                  >
                    <Image
                      style={{ marginTop: 7, marginRight: 7.51 }}
                      source={require('../../Images/heart.png')}
                    />
                  </ImageBackground>
                </View>
              )
            }
            }
            numColumns={3}
            columnWrapperStyle={{ flex: 1, }}
          />
          <Text style={{ color: '#1A1919', fontSize: 16, marginLeft: 28, marginTop: 25 }}>Popular Styles</Text>
          <FlatList
            data={list.top_styles}
            renderItem={({ item, index }) =>
              <View style={styles.GridViewBlockStyle} key={index}>
                <ImageBackground
                  style={{ marginLeft: 20, marginTop: 14, height: height * 0.15, width: width * 0.27, alignItems: 'flex-end' }}
                  //   source={require('../../Images/upcoming.png')}
                  source={{
                    uri: `${item.upload_front_photo}`,
                  }}
                >
                  <Image
                    style={{ marginTop: 7, marginRight: 7.51 }}
                    source={require('../../Images/heart.png')}
                  />
                </ImageBackground>
              </View>}
            numColumns={3}
          />
        </View>
      }
    </ScrollView>
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