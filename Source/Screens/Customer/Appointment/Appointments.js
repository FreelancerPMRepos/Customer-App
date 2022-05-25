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
import { BASE_URL, width } from '../../../Config';
import Loader from '../../../Components/Loader';
import moment from 'moment';


const countries = ["Chronological"]

const Appointments = ({ navigation, props }) => {
  const [list, setList] = useState([]);
  const [upcomingList, setUpcomingList] = useState([]);
  const [isLoading, setLoading] = useState(false)


  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getUpcomingList()
      getPassedList()
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
            upcomingList.length == 0 ?
              <View style={styles.errorView}>
                <Text>No Upcoming Bookings</Text>
              </View>
              :
              upcomingList.map((res, index) => {
                console.log("res",res)
                return (
                  <View style={styles.row} key={index}>
                    {
                      res?.style?.upload_front_photo == null
                        ?
                        <Image
                          style={styles.noImageStyle}
                          source={require('../../../Images/noImage.jpg')}
                        />
                        :
                        <Image
                          style={styles.imageStyle}
                          source={{
                            uri: `${res?.style?.upload_front_photo}`,
                          }}
                        />
                    }
                    <View style={styles.contentView}>
                      <Text style={styles.name}>{res?.style?.name == undefined ? res?.styletype?.name : res?.style?.name}</Text>
                      <Text style={styles.upcomingDate}>{moment.utc(res?.booking_date,).local().add(0, 'days').calendar(null, { sameElse: 'ddd DD MMM YYYY hh:mm A' })}</Text>
                      <Pressable style={styles.bookingButton} onPress={() => navigation.navigate('AppointmentsDescriptionScreen', { appointmentDetails: res, type: 'UPCOMING' })}>
                        <Text style={styles.bookingButtonText}>Look at booking</Text>
                      </Pressable>
                    </View>
                  </View>
                )
              })
          }
          <View style={styles.horizontalLine} />
          <View style={styles.passedTopView}>
            <Text style={styles.upcomingTextStyle}>Passed</Text>
            <SelectDropdown
              data={countries}
              buttonStyle={styles.dropdownButton}
              onSelect={(selectedItem, index) => {
                console.log(selectedItem, index)
              }}
            />
          </View>
          {
            list.length == 0 ?
              <View style={styles.errorView}>
                <Text>No Passed Bookings</Text>
              </View>
              :
              list.map((res, index) => {
                return (
                  <View style={styles.row} key={index}>
                    {
                      res?.style?.upload_front_photo == null
                        ?
                        <Image
                          style={styles.noImageStyle}
                          source={require('../../../Images/noImage.jpg')}
                        />
                        :
                        <Image
                          style={styles.imageStyle}
                          source={{
                            uri: `${res?.style?.upload_front_photo}`,
                          }}
                        />
                    }
                    <View style={styles.contentView}>
                      <Text style={styles.name}>{res?.style?.name === undefined ? res.service?.name : res?.style?.name}</Text>
                      <Text style={styles.passedDate}>{moment.utc(res?.booking_date,).local().format("ddd DD MMM YYYY hh:mm a")}</Text>
                      <Pressable style={styles.bookingButton} onPress={() => navigation.navigate('AppointmentsDescriptionScreen', { appointmentDetails: res, type: 'PASSED' })}>
                        <Text style={styles.bookingButtonText}>Look at booking</Text>
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
  },
  noImageStyle: {
    height: 118,
    width: 103,
    marginLeft: 26,
    marginTop: 14,
    resizeMode: 'contain'
  },
  imageStyle: {
    marginLeft: 26,
    marginTop: 14,
    height: 118,
    width: 103,
  },
  contentView: {
    marginTop: 23,
    marginLeft: 25
  },
  name: {
    color: '#1A1919',
    fontSize: 16,
    fontFamily: 'Avenir-Heavy'
  },
  upcomingDate: {
    color: '#1A1919',
    marginTop: 2,
    lineHeight: 19,
    fontFamily: 'Avenir-Medium',
  },
  bookingButton: {
    borderWidth: 1,
    marginTop: 10.5,
    width: width * 0.4
  },
  bookingButtonText: {
    color: '#1A1919',
    marginTop: 8.5,
    marginBottom: 8.5,
    textAlign: 'center',
    fontFamily: 'Avenir-Medium'
  },
  passedDate: {
    color: '#1A1919',
    marginTop: 2,
    lineHeight: 19
  },
  horizontalLine: {
    borderBottomColor: '#979797',
    borderBottomWidth: 1,
    marginTop: 39,
    marginLeft: 27,
    marginRight: 25
  },
  passedTopView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 33
  },
  dropdownButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#171717',
    height: 35,
    marginTop: 30,
    width: 166
  },
  errorView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30
  }
})