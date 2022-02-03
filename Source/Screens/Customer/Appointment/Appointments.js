import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Pressable,
  ScrollView
} from 'react-native';
import Header from '../../../Components/Header'
import SelectDropdown from 'react-native-select-dropdown'
import axios from 'axios';
import { BASE_URL, IMAGE_URL, width } from '../../../Config';
import Loader from '../../../Components/Loader';
import moment from 'moment';


const countries = ["Chronological"]

const Appointments = ({navigation,props}) => {
  const [list, setList] = useState([]);
  const [upcomingList, setUpcomingList] = useState([]);
  const [isLoading, setLoading] = useState(false)


  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getUpcomingList()
      getPassedList()
      //Put your Data loading function here instead of my loadData()
    });

    return unsubscribe;
  }, [navigation])

  const getUpcomingList = () => {
    setLoading(true)
    axios.get(`${BASE_URL}/booking/customer/list?type=UPCOMING`)
      .then(res => {
        setUpcomingList(res.data)
        setLoading(false)
      })
      .catch(e => {
        console.log('er', e)
        setLoading(false)
      })
  }

  const getPassedList = () => {
    setLoading(true)
    axios.get(`${BASE_URL}/booking/customer/list?type=PAST`)
      .then(res => {
        setList(res.data)
        setLoading(false)
      })
      .catch(e => {
        console.log('err', e)
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
            upcomingList.map((res, index) => {
            let fhg = moment.utc(res?.booking_date) == moment(new Date()).add(1,'days');
              return (
                <View style={styles.row} key={index}>
                  {
                    res?.style?.upload_front_photo == null
                      ?
                      <Image
                        style={{ height: 118, width: 103, marginLeft: 26, marginTop: 14, resizeMode: 'contain' }}
                        source={require('../../../Images/noImage.jpg')}
                      />
                      :
                      <Image
                        style={{ marginLeft: 26, marginTop: 14, height: 118, width: 103, }}
                        source={{
                          uri: `${res?.style?.upload_front_photo}`,
                        }}
                      />
                  }
                  <View style={{ marginTop: 23, marginLeft: 25 }}>
                    <Text style={{ color: '#1A1919', fontSize: 16, fontFamily: 'Avenir-Heavy' }}>{res?.style?.name == undefined ? res?.styletype?.name : res?.style?.name}</Text>
                    <Text style={{ color: '#1A1919', marginTop: 2, lineHeight: 19, fontFamily: 'Avenir-Medium', }}>{moment(res?.booking_date,).add(0, 'days').calendar(null, {sameElse: 'DD MMM YYYY hh:mm A'})}</Text>
                    <Pressable style={{ borderWidth: 1, marginTop: 10.5, width: width * 0.4 }} onPress={() => navigation.navigate('AppointmentsDescriptionScreen', { appointmentDetails: res, type: 'UPCOMING'})}>
                      <Text style={{ color: '#1A1919', marginTop: 8.5, marginBottom: 8.5, textAlign: 'center',fontFamily: 'Avenir-Medium' }}>Look at booking</Text>
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
              }}
            />
          </View>
          {
            list.map((res, index) => {
              return (
                <View style={{ flexDirection: 'row' }} key={index}>
                  {
                    res?.style?.upload_front_photo == null
                      ?
                      <Image
                        style={{ height: 118, width: 103, marginLeft: 26, marginTop: 14, resizeMode: 'contain' }}
                        source={require('../../../Images/noImage.jpg')}
                      />
                      :
                      <Image
                        style={{ marginLeft: 26, marginTop: 14, height: 118, width: 103, }}
                        source={{
                          uri: `${res?.style?.upload_front_photo}`,
                        }}
                      />
                  }
                  <View style={{ marginTop: 29, marginLeft: 25 }}>
                    <Text style={{ color: '#1A1919', fontSize: 16, fontFamily: 'Avenir-Heavy' }}>{res?.style?.name}</Text>
                    <Text style={{ color: '#1A1919', marginTop: 2 , lineHeight: 19}}>{moment(res?.booking_date,).format("DD MMM YYYY hh:mm a")}</Text>
                    <Pressable style={{ borderWidth: 1, marginTop: 10.5, width: width * 0.4 }} onPress={() => navigation.navigate('AppointmentsDescriptionScreen', { appointmentDetails: res, type: 'PASSED'})}>
                      <Text style={{ color: '#1A1919', marginTop: 8.5, marginBottom: 8.5, textAlign: 'center', fontFamily: 'Avenir-Medium'}}>Look at booking</Text>
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
export default Appointments;

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