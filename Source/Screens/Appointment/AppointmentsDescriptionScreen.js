import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Pressable,
  Modal,
  TextInput,
  ScrollView
} from 'react-native';
import Header from '../../Components/Header'
import { BASE_URL, Colors, IMAGE_URL, width } from '../../Config';
import { Rating, AirbnbRating } from 'react-native-ratings';
import moment from 'moment';

const Days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const DaysName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

const AppointmentsDescriptionScreen = ({ navigation, route, props }) => {
  const [isLoading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);
  const [resheduleModal, setRescheduleModal] = useState(false);
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [timeModalVisible, setTimeModalVisible] = useState(false);
  const [note, setNote] = useState('');
  const [dateList, setDateList] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const { appointmentDetails } = route.params
  // Date
  const [days, setDays] = useState([]);
  const [nextDate, setNextDate] = useState(0);
  const [nextYear, setNextYear] = useState(0);
  // Time
  const [time, setTime] = useState([]);

  console.log("Asdf", appointmentDetails)

  const _onBack = () => navigation.goBack()

  useEffect(() => {
    setNextYear(new Date().getFullYear());
    setNextDate(new Date().getMonth());
    getDateSlot();
  }, [])

  const getDateSlot = () => {
    axios.get(`${BASE_URL}/timeslot/list/${appointmentDetails.store.id}`)
      .then(res => {
        setDateList(res.data.list)
        //  console.log('res date slot', res.data.list)
      })
      .catch(e => {
        console.log('e', e)
      })
  }

  const getMonthDateDay = (year, date) => {
    var year = year;
    var month = date;
    //  console.log("object", year, date)
    var date = new Date(year, month, 1);
    var days = [];
    var newObj = {};
    while (date.getMonth() === month) {
      if (date.getDay() == 0) {
        days.push(newObj);
        newObj = {};
        newObj.date = date.getDate();
        newObj.is_open = getIsopen(date.getDay());
      } else if (date.getDay() == 1) {
        newObj.date1 = date.getDate();
        newObj.is_open1 = getIsopen(date.getDay());
      } else if (date.getDay() == 2) {
        newObj.date2 = date.getDate();
        newObj.is_open2 = getIsopen(date.getDay());
      } else if (date.getDay() == 3) {
        newObj.date3 = date.getDate();
        newObj.is_open3 = getIsopen(date.getDay());
      } else if (date.getDay() == 4) {
        newObj.date4 = date.getDate();
        newObj.is_open4 = getIsopen(date.getDay());
      } else if (date.getDay() == 5) {
        newObj.date5 = date.getDate();
        newObj.is_open5 = getIsopen(date.getDay());
      } else if (date.getDay() == 6) {
        newObj.date6 = date.getDate();
        newObj.is_open6 = getIsopen(date.getDay());
      }

      date.setDate(date.getDate() + 1);
    }

    days.push(newObj);
    setDays(days);
  }

  const getIsopen = (day) => {
    for (var i in dateList) {
      if (dateList[i].day == DaysName[day]) {
        return dateList[i].is_open;
      }
    }

    return 0;
  }

  const getTime = (date, day) => {
    setSelectedDate(date)
    console.log("akjsadhgu", date)
    var startTime = "";
    var endTime = "";
    var timeStops = [];
    for (var i in dateList) {
      if (dateList[i].day == DaysName[day]) {
        startTime = dateList[i].open_time;
        endTime = dateList[i].close_time;
        var openTime = moment(startTime, 'HH:mm');
        var closeTime = moment(endTime, 'HH:mm');
        console.log("start time", openTime)
        console.log("End time", closeTime)

        if (closeTime.isBefore(openTime)) {
          closeTime.add(1, 'day');
        }

        while (openTime <= closeTime) {
          timeStops.push(new moment(openTime).format('HH:mm'));
          openTime.add(30, 'minutes');
        }
      }
    }

    console.log(timeStops)
    setTime(timeStops)
  }

  const _onCalendarLeft = () => {
    if (nextDate == 0) {
      setNextDate("11")
      setNextYear(nextYear - 1)
      getMonthDateDay(nextYear - 1, 11)
    } else {
      setNextDate(parseInt(nextDate) - 1)
      setNextYear(nextYear)
      getMonthDateDay(nextYear, parseInt(nextDate) - 1)
    }
    // setNextDate(nextDate - 1)
    // getMonthDateDay()
  }

  const _onCalendarRight = () => {
    console.log("das", nextDate)
    console.log("fsdg", nextYear)
    if (nextDate == 11) {
      //    console.log("As")
      setNextDate('0')
      setNextYear(nextYear + 1)
      getMonthDateDay(nextYear + 1, 0)
    } else {
      //   console.log(nextDate + 1)
      setNextDate(parseInt(nextDate) + 1)
      setNextYear(nextYear)
      getMonthDateDay(nextYear, parseInt(nextDate) + 1)
    }
  }

  const _onTime = (res) => {
    setSelectedTime(res)
    setTimeModalVisible(!timeModalVisible)
    setRescheduleModal(!resheduleModal)
  }

  const addNote = () => {
    if (note == '') {
      alert('Please Enter Note')
    } else {
      axios.post(`${BASE_URL}/note`, {
        booking_id: appointmentDetails.id,
        note: note,
      })
        .then(res => {
          console.log('res appointment', res.data)
          setModalVisible(!modalVisible);
          setNote('');
          setLoading(false)
        })
        .catch(e => {
          console.log('e', e)
          setLoading(false)
        })
    }
  }

  const onCancelYes = () => {
    axios.delete(`${BASE_URL}/booking/${appointmentDetails.id}`)
      .then(res => {
        console.log('res', res.data)
        setCancelModal(!cancelModal)
        _onBack()
        //  props.navigation.addListener('willFocus', () =>  _onBack())
        alert(res.data.message)
        //  setModalVisible(!modalVisible);
        // setNote('');
        setLoading(false)
      })
      .catch(e => {
        console.log('e', e)
        setLoading(false)
      })

  }

  const _onReschedule = () => {
    setLoading(true)
    axios.put(`${BASE_URL}/reschedule/booking`, {
      id: appointmentDetails.id,
      booking_date: `${nextYear}-${nextDate + 1}-${selectedDate} ${selectedTime}`,
    })
      .then(res => {
        console.log('res reschedule', res.data)
        setRescheduleModal(!resheduleModal)
        alert(res.data.message)
        // setNote('');
        setLoading(false)
      })
      .catch(e => {
        console.log('e', e)
        setLoading(false)
      })
  }


  const renderAddNoteModal = () => {
    return (
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
            <Pressable style={{ justifyContent: 'flex-end', alignSelf: 'flex-end' }} onPress={() => setModalVisible(!modalVisible)}>
              <Image
                style={{ marginRight: 14.49, marginTop: 18.5 }}
                source={require('../../Images/cross.png')}
              />
            </Pressable>
            <Text style={{ color: '#1A1919', fontSize: 18, fontFamily: 'Avenir-Heavy', marginLeft: 14.5 }}>Add Note</Text>
            <TextInput placeholder="Type Your Note" style={{ borderWidth: 1, borderColor: '#979797', marginLeft: 13, marginTop: 13.5, marginRight: 12, height: 122 }} multiline={true} onChangeText={text => setNote(text)} value={note} />
            <Pressable style={{ borderWidth: 1, borderColor: '#171717', marginLeft: 96, marginRight: 96, marginTop: 21, marginBottom: 26 }} onPress={() => addNote()}>
              <Text style={{ color: '#1A1919', fontSize: 14, fontFamily: 'Avenir-Medium', marginTop: 8.5, marginBottom: 7.5, textAlign: 'center' }}>ADD</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    )
  }

  const renderRescheduleModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={resheduleModal}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setRescheduleModal(!resheduleModal);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Pressable style={{ justifyContent: 'flex-end', alignSelf: 'flex-end' }} onPress={() => setRescheduleModal(!resheduleModal)}>
              <Image
                style={{ marginRight: 14.49, marginTop: 18.5 }}
                source={require('../../Images/cross.png')}
              />
            </Pressable>
            <Text style={{ color: '#1A1919', fontSize: 18, fontFamily: 'Avenir-Heavy', textAlign: 'center' }}>Reschedule Appointment</Text>
            {/* <TextInput placeholder="Type Your Note" style={{ borderWidth: 1, borderColor: '#979797', marginLeft: 13, marginTop: 13.5, marginRight: 12, height: 122 }} multiline={true} onChangeText={text => setNote(text)} value={note} /> */}
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 34 }}>
              <Pressable style={{ flexDirection: 'row', borderWidth: 1, borderColor: '#979797', height: 35 }} onPress={() => { setDateModalVisible(!dateModalVisible), setRescheduleModal(!resheduleModal), getMonthDateDay(new Date().getFullYear(), new Date().getMonth()) }}>
                <Text style={{ fontFamily: 'Avenir-Medium', marginLeft: 10.5, marginTop: 5 }}>{selectedDate == '' ? 'Select' : `${selectedDate} ${nextDate == 0 ? 'Jan' : nextDate == 1 ? 'Feb' : nextDate == 2 ? "Mar" : nextDate == 3 ? "Apr" : nextDate == 4 ? "May" : nextDate == 5 ? "Jun" : nextDate == 6 ? "Jul" : nextDate == 7 ? "Aug" : nextDate == 8 ? "Sep" : nextDate == 9 ? "Oct" : nextDate == 10 ? "Nov" : "Dec"} ${nextYear}`}</Text>
                <Image
                  style={{ marginLeft: 15, marginRight: 4.5, marginTop: 7.5 }}
                  source={require('../../Images/storeCalendar.png')}
                />
              </Pressable>
              <Pressable style={{ flexDirection: 'row', borderWidth: 1, borderColor: '#979797', marginLeft: 15, height: 35 }} onPress={() => { time.length == 0 ? alert("Please select date first") : setTimeModalVisible(!timeModalVisible), setRescheduleModal(!resheduleModal) }}>
                <Text style={{ fontFamily: 'Avenir-Medium', marginLeft: 10.5, marginTop: 5 }}>{selectedTime == '' ? 'Select' : selectedTime}</Text>
                <Image
                  style={{ marginTop: 15, marginLeft: 36, marginRight: 6.36 }}
                  source={require('../../Images/Triangle.png')}
                />
              </Pressable>
            </View>
            <Pressable style={{ borderWidth: 1, borderColor: '#171717', marginLeft: 96, marginRight: 96, marginTop: 34, marginBottom: 26 }} onPress={() => _onReschedule()}>
              <Text style={{ color: '#1A1919', fontSize: 14, fontFamily: 'Avenir-Medium', marginTop: 8.5, marginBottom: 7.5, textAlign: 'center' }}>Reschedule</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    )
  }

  const renderDateModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={dateModalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setDateModalVisible(!dateModalVisible);
        }}
      >
        <View style={[styles.centeredView, { justifyContent: 'center' }]}>
          <View style={styles.modalView}>
            <View style={{ marginTop: 15, marginLeft: 10, marginRight: 10, marginBottom: 20 }}>
              <View style={{ backgroundColor: 'black', justifyContent: 'space-between', flexDirection: 'row' }}>
                <Pressable onPress={() => _onCalendarLeft()}>
                  <Image
                    style={{ marginLeft: 15, marginRight: 4.5, marginTop: 10.5 }}
                    source={require('../../Images/left-arrow.png')}
                  />
                </Pressable>
                <Text style={{ color: 'white', textAlign: 'center', fontSize: 16, fontFamily: 'Avenir-Heavy', marginTop: 9, marginBottom: 10, lineHeight: 22 }}>
                  {nextDate == 0 ? 'January' : nextDate == 1 ? 'February' : nextDate == 2 ? "March" : nextDate == 3 ? "April" : nextDate == 4 ? "May" : nextDate == 5 ? "June" : nextDate == 6 ? "July" : nextDate == 7 ? "August" : nextDate == 8 ? "September" : nextDate == 9 ? "Octomber" : nextDate == 10 ? "November" : "December"}
                </Text>
                <Pressable onPress={() => _onCalendarRight()}>
                  <Image
                    style={{ marginRight: 15, marginTop: 10.5 }}
                    source={require('../../Images/right-arrow.png')}
                  />
                </Pressable>
              </View>
              <View style={{ borderColor: '#979797', flexDirection: 'row', borderBottomWidth: 1 }}>
                {
                  Days.map((res) => {
                    //     console.log("dhf", res)
                    return (
                      <Text style={{ fontFamily: 'Avenir-Heavy', borderWidth: 1, textAlign: 'center', width: 45 }}>{res}</Text>
                    )
                  })
                }
              </View>
              <View style={{ flexDirection: 'row' }}>
                <View style={{}}>
                  {
                    days.map((res, i) => {
                      //    console.log("Asddsa", dateList[5]?.is_open)
                      return (
                        <View style={{ flexDirection: 'row' }}>
                          <Pressable onPress={() => { res.date === undefined || res.is_open == 0 ? null : setDateModalVisible(!dateModalVisible), setRescheduleModal(!resheduleModal), getTime(res.date, 0) }}>
                            {
                              res.is_open == 0 ?
                                <Text style={{ fontFamily: 'Avenir-Heavy', textAlign: 'center', width: 45, borderLeftWidth: 1, borderBottomWidth: 1, color: '#979797' }}>{res.date} </Text>
                                :
                                <Text style={{ fontFamily: 'Avenir-Heavy', textAlign: 'center', width: 45, borderLeftWidth: 1, borderBottomWidth: 1 }}>{res.date} </Text>
                            }

                          </Pressable>
                          <Pressable onPress={() => { res.date1 === undefined || res.is_open1 == 0 ? console.log("not Pressable") : setDateModalVisible(!dateModalVisible), setRescheduleModal(!resheduleModal), getTime(res.date1, 1) }}>
                            {
                              res.is_open1 == 0 ?
                                <Text style={{ fontFamily: 'Avenir-Heavy', textAlign: 'center', width: 45, borderLeftWidth: 1, borderBottomWidth: 1, color: '#979797' }}>{res.date1} </Text>
                                :
                                <Text style={{ fontFamily: 'Avenir-Heavy', textAlign: 'center', width: 45, borderLeftWidth: 1, borderBottomWidth: 1 }}>{res.date1} </Text>
                            }

                          </Pressable>
                          <Pressable onPress={() => { res.date2 === undefined || res.is_open2 == 0 ? console.log("not Pressable") : setDateModalVisible(!dateModalVisible), setRescheduleModal(!resheduleModal), getTime(res.date2, 2) }}>
                            {
                              res.is_open2 == 0 ?
                                <Text style={{ fontFamily: 'Avenir-Heavy', textAlign: 'center', width: 45, borderLeftWidth: 1, borderBottomWidth: 1, color: '#979797' }}>{res.date2} </Text>
                                :
                                <Text style={{ fontFamily: 'Avenir-Heavy', textAlign: 'center', width: 45, borderLeftWidth: 1, borderBottomWidth: 1 }}>{res.date2} </Text>
                            }

                          </Pressable>
                          <Pressable onPress={() => { res.date3 === undefined || res.is_open3 == 0 ? console.log("not Pressable") : setDateModalVisible(!dateModalVisible), setRescheduleModal(!resheduleModal), getTime(res.date3, 3) }}>
                            {
                              res.is_open3 == 0 ?
                                <Text style={{ fontFamily: 'Avenir-Heavy', textAlign: 'center', width: 45, borderLeftWidth: 1, borderBottomWidth: 1, color: '#979797' }}>{res.date3} </Text>
                                :
                                <Text style={{ fontFamily: 'Avenir-Heavy', textAlign: 'center', width: 45, borderLeftWidth: 1, borderBottomWidth: 1 }}>{res.date3} </Text>
                            }

                          </Pressable>
                          <Pressable onPress={() => { res.date4 === undefined || res.is_open4 == 0 ? console.log("not Pressable") : setDateModalVisible(!dateModalVisible), setRescheduleModal(!resheduleModal), getTime(res.date4, 4) }}>
                            {
                              res.is_open4 == 0 ?
                                <Text style={{ fontFamily: 'Avenir-Heavy', textAlign: 'center', width: 45, borderLeftWidth: 1, borderBottomWidth: 1, color: '#979797' }}>{res.date4} </Text>
                                :
                                <Text style={{ fontFamily: 'Avenir-Heavy', textAlign: 'center', width: 45, borderLeftWidth: 1, borderBottomWidth: 1 }}>{res.date4} </Text>
                            }

                          </Pressable>
                          <Pressable onPress={() => { res.date5 === undefined || res.is_open5 == 0 ? console.log("not Pressable") : setDateModalVisible(!dateModalVisible), setRescheduleModal(!resheduleModal), getTime(res.date5, 5) }}>
                            {
                              res.is_open5 == 0 ?
                                <Text style={{ fontFamily: 'Avenir-Heavy', textAlign: 'center', width: 45, borderLeftWidth: 1, borderBottomWidth: 1, color: '#979797' }}>{res.date5} </Text>
                                :
                                <Text style={{ fontFamily: 'Avenir-Heavy', textAlign: 'center', width: 45, borderLeftWidth: 1, borderBottomWidth: 1 }}>{res.date5} </Text>
                            }

                          </Pressable>
                          <Pressable onPress={() => { res.date6 === undefined || res.is_open6 == 0 ? console.log("not Pressable") : setDateModalVisible(!dateModalVisible), setRescheduleModal(!resheduleModal), getTime(res.date6, 6) }}>
                            {
                              res.is_open6 == 0 ?
                                <Text style={{ fontFamily: 'Avenir-Heavy', textAlign: 'center', width: 45, borderLeftWidth: 1, borderBottomWidth: 1, borderRightWidth: 1, color: '#979797' }}>{res.date6} </Text>
                                :
                                <Text style={{ fontFamily: 'Avenir-Heavy', textAlign: 'center', width: 45, borderLeftWidth: 1, borderBottomWidth: 1, borderRightWidth: 1 }}>{res.date6} </Text>
                            }

                          </Pressable>
                        </View>
                      )
                    })
                  }
                </View>
              </View>

            </View>
          </View>
        </View>
      </Modal>
    )
  }

  const renderTimeModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={timeModalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setTimeModalVisible(!timeModalVisible);
        }}
      >
        <View style={{ flex: 1, position: 'relative', justifyContent: 'center' }}>
          <View style={{
            width: 145,
            height: 229,
            margin: 20,
            alignItems: 'center',
            alignSelf: 'center',
            justifyContent: 'center',
            backgroundColor: "white",
            //  borderRadius: 20,
            //    padding: 35,
            //    alignItems: "center",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5
          }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {
                time.map((res) => {
                  console.log("time >>>>>>>>>>>>>>>>>>>>>>>>>", time)
                  return (
                    <Pressable
                      style={{}}
                      onPress={() => _onTime(res)}
                    >
                      <Text style={{ fontSize: 16, fontFamily: 'Avenir-Medium', marginTop: 13 }}>{res}</Text>
                    </Pressable>
                  )
                })
              }

            </ScrollView>
          </View>
        </View>
      </Modal>
    )
  }

  const renderCancelModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={cancelModal}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setCancelModal(!cancelModal);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Pressable style={{ justifyContent: 'flex-end', alignSelf: 'flex-end' }} onPress={() => setCancelModal(!cancelModal)}>
              <Image
                style={{ marginRight: 14.49, marginTop: 18.5 }}
                source={require('../../Images/cross.png')}
              />
            </Pressable>
            <Text style={{ color: '#1A1919', fontSize: 18, fontFamily: 'Avenir-Heavy', marginLeft: 55, marginRight: 55, textAlign: 'center' }}>Are you sure you want to cancel your booking?</Text>
            <View style={{ flexDirection: 'row' }}>
              <Pressable style={{ borderWidth: 1, borderColor: '#171717', marginLeft: 26.5, marginTop: 21, marginBottom: 26 }} onPress={() => onCancelYes()}>
                <Text style={{ color: '#1A1919', fontSize: 14, fontFamily: 'Avenir-Medium', marginLeft: 55.5, marginRight: 53.5, marginTop: 8.5, marginBottom: 7.5 }}>Yes</Text>
              </Pressable>
              <Pressable style={{ borderWidth: 1, borderColor: '#171717', marginLeft: 20, marginTop: 21, marginBottom: 26 }} onPress={() => setCancelModal(!cancelModal)}>
                <Text style={{ color: '#1A1919', fontSize: 14, fontFamily: 'Avenir-Medium', marginLeft: 55.5, marginRight: 53.5, marginTop: 8.5, marginBottom: 7.5 }}>No</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    )
  }

  return (
    <View style={styles.container}>
      {
        <Header leftIcon='back' onLeftIconPress={_onBack} {...props} />
      }
      {
        <View>
          {renderAddNoteModal()}
          {renderRescheduleModal()}
          {renderDateModal()}
          {renderTimeModal()}
          {renderCancelModal()}
          <View style={{ flexDirection: 'row' }}>
            {
              appointmentDetails?.style?.upload_front_photo == null
                ?
                <Image
                  style={{ marginLeft: 27, marginTop: 28, height: 127, width: 112, }}
                  source={require('../../Images/noImage.jpg')}
                />
                :
                <Image
                style={{ marginLeft: 27, marginTop: 28, height: 127, width: 112, }}
                source={{
                  uri: `${IMAGE_URL}/${appointmentDetails?.style?.upload_front_photo}`,
                }}
              />
            }
            <View style={{ marginLeft: 32, marginTop: 20, width: width * 0.52 }}>
              <Text style={{ color: '#1A1919', fontSize: 16, fontFamily: 'Avenir-Heavy' }}>{appointmentDetails?.style?.name}</Text>
              <Text style={{ color: '#1A1919', fontSize: 14, fontFamily: 'Avenir-Medium', lineHeight: 19 }}>Tomorrow at 8:30 PM</Text>
              <Text style={{ color: '#1A1919', fontSize: 16, fontFamily: 'Avenir-Heavy', marginTop: 14.67, lineHeight: 22 }}>Location</Text>
              <Text style={{ color: '#1A1919', fontSize: 14, fontFamily: 'Avenir-Medium', lineHeight: 19 }}>{appointmentDetails?.store?.store_name}</Text>
              <View style={{ marginTop: 13, marginRight: 129 }}>
                <Rating
                  type='custom'
                  ratingCount={5}
                  ratingColor='#1F1E1E'
                  ratingBackgroundColor='#c8c7c8'
                  tintColor="#FFFFFF"
                  readonly={true}
                  startingValue={4}
                  imageSize={16}
                //   onFinishRating={this.ratingCompleted}
                />
              </View>
            </View>
          </View>
          <Text style={{ color: '#1A1919', fontSize: 16, fontFamily: 'Avenir-Heavy', marginLeft: 27, marginTop: 28 }}>Description</Text>
          <Text style={{ color: '#1A1919', fontSize: 14, fontFamily: 'Avenir-Medium', marginLeft: 27, marginRight: 27, marginTop: 5.09 }}>{appointmentDetails?.style?.description}</Text>
          <Text style={{ color: '#1A1919', fontSize: 16, fontFamily: 'Avenir-Heavy', marginLeft: 27, marginTop: 13 }}>Notes</Text>
          <Text style={{ color: '#1A1919', fontSize: 14, fontFamily: 'Avenir-Medium', marginLeft: 27, marginRight: 27, marginTop: 5.09 }}>Use only lakme products.</Text>
          <Pressable style={[styles.button, { marginTop: 26.5 }]} onPress={() => setModalVisible(!modalVisible)}>
            <Text style={styles.buttonText}>Add Notes</Text>
          </Pressable>
          <Pressable style={[styles.button, { marginTop: 13 }]} onPress={() => setRescheduleModal(!resheduleModal)}>
            <Text style={styles.buttonText}>Reschedule</Text>
          </Pressable>
          <Pressable style={[styles.button, { marginTop: 13 }]} onPress={() => setCancelModal(!cancelModal)}>
            <Text style={styles.buttonText}>Cancel Booking</Text>
          </Pressable>
        </View>
      }
    </View>
  )
}
export default AppointmentsDescriptionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  button: {
    borderWidth: 1,
    borderColor: Colors.greyLight,
    marginLeft: 122.5,
    marginRight: 122.5,
  },
  buttonText: {
    textAlign: 'center',
    color: Colors.black,
    fontSize: 14,
    fontFamily: 'Avenir-Medium',
    marginTop: 9.5,
    marginBottom: 6.5,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: Colors.white,
    borderRadius: 20,
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