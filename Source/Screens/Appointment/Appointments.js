import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Pressable,
  ScrollView
} from 'react-native';
import Header from '../../Components/Header'
import SelectDropdown from 'react-native-select-dropdown'
import axios from 'axios';
import { BASE_URL, IMAGE_URL } from '../../Config';
import Loader from '../../Components/Loader';


const countries = ["Egypt", "Canada", "Australia", "Ireland"]

const HelloWorldApp = (props) => {
  const [list, setList] = useState([]);
  const [upcomingList, setUpcomingList] = useState([]);
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    getUpcomingList()
    getPassedList()
  }, [])

  const getUpcomingList = () => {
    setLoading(true)
    axios.get(`${BASE_URL}/booking/customer/list?type=UPCOMING`)
      .then(res => {
        setUpcomingList(res.data)
        console.log('res appointment', res.data)
        setLoading(false)
      })
      .catch(e => {
        console.log('e', e)
        setLoading(false)
      })
  }

  const getPassedList = () => {
    setLoading(true)
    axios.get(`${BASE_URL}/booking/customer/list?type=PAST`)
      .then(res => {
        setList(res.data)
        console.log('res appointment', res.data)
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
        <ScrollView style={{ marginBottom: 10 }}>
          <Text style={styles.upcomingTextStyle}>Upcoming</Text>
          {
            upcomingList.map((res) => {
              // console.log("dsa",res.style.name)
              console.log("Sdf", `${IMAGE_URL}/${res.style.upload_front_photo}`)
              return (
                <View style={styles.row}>
                  {
                    res.style.upload_front_photo == null
                      ?
                      <Image
                        style={{ height: 118, width: 103, marginLeft: 26, marginTop: 14, resizeMode: 'contain' }}
                        source={require('../../Images/noImage.jpg')}
                      />
                      :
                      <Image
                        style={{ marginLeft: 26, marginTop: 14, height: 118, width: 103, }}
                        source={{
                          uri: `${IMAGE_URL}/${res.style.upload_front_photo}`,
                        }}
                      />
                  }
                  <View style={{ marginTop: 23, marginLeft: 25 }}>
                    <Text style={{ color: '#1A1919', fontSize: 16, fontFamily: 'Avenir-Heavy' }}>{res.style.name}</Text>
                    <Text style={{ color: '#1A1919', marginTop: 2 }}>Tomorrow at 8:30 PM</Text>
                    <Pressable style={{ borderWidth: 1, marginTop: 10.5 }} onPress={() => props.navigation.navigate('AppointmentsDescriptionScreen')}>
                      <Text style={{ color: '#1A1919', marginLeft: 28.5, marginTop: 8.5, marginBottom: 8.5, marginRight: 27.5 }}>Look at booking</Text>
                    </Pressable>
                  </View>
                </View>
              )
            })
          }
          <View
            style={{
              borderBottomColor: '#979797',
              borderBottomWidth: 1,
              marginTop: 39,
              marginLeft: 27,
              marginRight: 25
            }}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginRight: 33 }}>
            <Text style={{ fontSize: 16, color: '#1A1919', marginLeft: 27, marginTop: 38 }}>Passed</Text>
            <SelectDropdown
              data={countries}
              buttonStyle={{ backgroundColor: 'white', borderWidth: 1, borderColor: '#171717', height: 35, marginTop: 30, width: 166 }}
              onSelect={(selectedItem, index) => {
                console.log(selectedItem, index)
              }}
            // buttonTextAfterSelection={(selectedItem, index) => {
            //   // text represented after item is selected
            //   // if data array is an array of objects then return selectedItem.property to render after item is selected
            //   return selectedItem
            // }}
            // rowTextForSelection={(item, index) => {
            //   // text represented for each item in dropdown
            //   // if data array is an array of objects then return item.property to represent item in dropdown
            //   return item
            // }}
            />
          </View>
          {
            list.map((res) => {
              console.log("tye", res)
              return (
                <View style={{ flexDirection: 'row' }}>
                  {
                    res.style.upload_front_photo == null
                      ?
                      <Image
                        style={{ height: 118, width: 103, marginLeft: 26, marginTop: 14, resizeMode: 'contain' }}
                        source={require('../../Images/noImage.jpg')}
                      />
                      :
                      <Image
                        style={{ marginLeft: 26, marginTop: 14, height: 118, width: 103, }}
                        source={{
                          uri: `${IMAGE_URL}/${res.style.upload_front_photo}`,
                        }}
                      />
                  }
                  <View style={{ marginTop: 29, marginLeft: 25 }}>
                    <Text style={{ color: '#1A1919', fontSize: 16 }}>{res.style.name}</Text>
                    <Text style={{ color: '#1A1919', marginTop: 2 }}>Wed 11 Mar 2020</Text>
                    <Pressable style={{ borderWidth: 1, marginTop: 10.5 }}>
                      <Text style={{ color: '#1A1919', marginLeft: 28.5, marginTop: 8.5, marginBottom: 8.5, marginRight: 27.5 }}>Look at booking</Text>
                    </Pressable>
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
  row: {
    flexDirection: 'row',
  },
  upcomingTextStyle: {
    fontSize: 16,
    color: '#1A1919',
    marginLeft: 27,
    marginTop: 28,
    fontFamily: 'Avenir-Medium'
  }
})