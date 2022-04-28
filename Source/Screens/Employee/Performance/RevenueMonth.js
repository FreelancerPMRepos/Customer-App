import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Text, View, Pressable, StyleSheet, Image } from 'react-native';
import Header from '../../../Components/EmployeeHeader';
import { BASE_URL, Colors, width } from '../../../Config';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../../Components/Loader';

const Days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",]

const RevenueMonth = (props) => {
  const [isLoading, setLoading] = useState(false)
  const [listData, setListData] = useState([]);
  const [days, setDays] = useState([]);
  const [nextDate, setNextDate] = useState(0);
  const [nextYear, setNextYear] = useState(0);

  const _onBack = () => props.navigation.goBack()

  useEffect(() => {
    setNextYear(new Date().getFullYear());
    setNextDate(new Date().getMonth());
    getMonthDateDay(new Date().getFullYear(), new Date().getMonth())
    getUser();
  }, [])

  const getData = (id, storeId) => {
    setLoading(true)
    console.log("sd",`${BASE_URL}/revenue/month?date=${nextDate}-${nextYear}&employee_id=${id}&store_id=${storeId}`)
    axios.get(`${BASE_URL}/revenue/month?date=${nextDate}-${nextYear}&employee_id=${id}&store_id=${storeId}`)
      .then(res => {
        console.log('res', res.data)
        setListData(res.data)
        setLoading(false)
      })
      .catch(e => {
        console.log('e', e)
        setLoading(false)
      })
  }

  const getUser = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@user_details')
      const parData = jsonValue != null ? JSON.parse(jsonValue) : null;
      console.log("jdfhughs", parData.id)
      getData(parData.id, parData.store_id)
    } catch (e) {
      // error reading value
    }
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
        //   newObj.is_open = getIsopen(date.getDay());
      } else if (date.getDay() == 1) {
        newObj.date1 = date.getDate();
        //   newObj.is_open1 = getIsopen(date.getDay());
      } else if (date.getDay() == 2) {
        newObj.date2 = date.getDate();
        //  newObj.is_open2 = getIsopen(date.getDay());
      } else if (date.getDay() == 3) {
        newObj.date3 = date.getDate();
        //   newObj.is_open3 = getIsopen(date.getDay());
      } else if (date.getDay() == 4) {
        newObj.date4 = date.getDate();
        //  newObj.is_open4 = getIsopen(date.getDay());
      } else if (date.getDay() == 5) {
        newObj.date5 = date.getDate();
        //   newObj.is_open5 = getIsopen(date.getDay());
      } else if (date.getDay() == 6) {
        newObj.date6 = date.getDate();
        //   newObj.is_open6 = getIsopen(date.getDay());
      }

      date.setDate(date.getDate() + 1);
    }

    days.push(newObj);
    setDays(days);
  }

  const _onCalendarLeft = () => {
    if (nextDate == 0) {
      setNextDate("11")
      setNextYear(nextYear - 1)
      getMonthDateDay(nextYear - 1, 11)
      getData()
    } else {
      setNextDate(parseInt(nextDate) - 1)
      setNextYear(nextYear)
      getMonthDateDay(nextYear, parseInt(nextDate) - 1)
      getData()
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
      getData()
    } else {
      //   console.log(nextDate + 1)
      setNextDate(parseInt(nextDate) + 1)
      setNextYear(nextYear)
      getMonthDateDay(nextYear, parseInt(nextDate) + 1)
      getData()
    }
  }

  function kFormatter(num) {
    return Math.abs(num) > 999 ? Math.sign(num) * ((Math.abs(num) / 1000).toFixed(1)) + 'k' : Math.sign(num) * Math.abs(num)
  }


  return (
    <View>
      {
        <Header leftIcon="back" onLeftIconPress={() => _onBack()} title={"My Performance"} {...props} />
      }
      {
        isLoading && <Loader />
      }
      {
        <View style={[styles.centeredView, { justifyContent: 'center' }]}>
          <View>
            <View style={{ marginTop: 15, marginLeft: 16, marginRight: 22, marginBottom: 20 }}>
              <View style={{ backgroundColor: 'black', justifyContent: 'space-between', flexDirection: 'row', width: '100%' }}>
                <Pressable onPress={() => _onCalendarLeft()}>
                  <Image
                    style={{ marginLeft: 15, marginRight: 4.5, marginTop: 10.5 }}
                    source={require('../../../Images/left-arrow.png')}
                  />
                </Pressable>
                <Text style={{ color: 'white', textAlign: 'center', fontSize: 16, fontFamily: 'Avenir-Heavy', marginTop: 9, marginBottom: 10, lineHeight: 22 }}>
                  {nextDate == 0 ? 'January' : nextDate == 1 ? 'February' : nextDate == 2 ? "March" : nextDate == 3 ? "April" : nextDate == 4 ? "May" : nextDate == 5 ? "June" : nextDate == 6 ? "July" : nextDate == 7 ? "August" : nextDate == 8 ? "September" : nextDate == 9 ? "October" : nextDate == 10 ? "November" : "December"}
                </Text>
                <Pressable onPress={() => _onCalendarRight()}>
                  <Image
                    style={{ marginRight: 15, marginTop: 10.5 }}
                    source={require('../../../Images/right-arrow.png')}
                  />
                </Pressable>
              </View>
              <View style={{ borderColor: '#979797', flexDirection: 'row', borderBottomWidth: 1, width: '100%' }}>
                {
                  Days.map((res, index) => {
                    return (
                      <Text key={index} style={{ fontFamily: 'Avenir-Heavy', borderWidth: 1, textAlign: 'center', color: '#1A1919', width: '14.28%' }}>{res}</Text>
                    )
                  })
                }
              </View>
              <View style={{ flexDirection: 'row' }}>
                <View style={{}}>
                  {
                    days.map((res, i) => {
                      return (
                        <View key={i} style={{ flexDirection: 'row', width: '100%', }}>
                          <Pressable style={{ borderBottomWidth: 1, height: 45, borderLeftWidth: 1, width: '14.28%' }}>
                            <Text style={{ fontFamily: 'Avenir-Heavy', textAlign: 'right', color: '#1A1919' }}>{res.date} </Text>
                            {
                              listData.map((val) => {
                                return (
                                  <View>
                                    {
                                      moment(val.date).format('DD') == res.date ?
                                        <Text style={{ textAlign: 'center', color: '#50C2C6', fontFamily: 'Avenir-Black', lineHeight: 19, fontSize: 12 }}>${kFormatter(val.revenue)}</Text>
                                        :
                                        null
                                    }

                                  </View>
                                )
                              })
                            }
                          </Pressable>
                          <Pressable style={{ borderLeftWidth: 1, borderBottomWidth: 1, height: 45, width: '14.28%' }}>
                            <Text style={{ fontFamily: 'Avenir-Heavy', textAlign: 'right', color: '#1A1919' }}>{res.date1} </Text>
                            {
                              listData.map((val) => {
                                return (
                                  <View style={{ marginBottom: 6 }}>
                                    {
                                      moment(val.date).format('DD') == res.date1 ?
                                        <Text style={{ textAlign: 'center', color: '#50C2C6', fontFamily: 'Avenir-Black', lineHeight: 19, fontSize: 12 }}>${kFormatter(val.revenue)}</Text>
                                        :
                                        null
                                    }

                                  </View>
                                )
                              })
                            }
                          </Pressable>
                          <Pressable style={{ borderBottomWidth: 1, borderLeftWidth: 1, width: '14.28%' }}>
                            <Text style={{ fontFamily: 'Avenir-Heavy', textAlign: 'right', lineHeight: 19, color: '#1A1919' }}>{res.date2} </Text>
                            {
                              listData.map((val) => {
                                return (
                                  <View style={{ marginBottom: 6 }}>
                                    {
                                      moment(val.date).format('DD') == res.date2 ?
                                        <Text style={{ textAlign: 'center', color: '#50C2C6', fontFamily: 'Avenir-Black', lineHeight: 19, fontSize: 12 }}>${kFormatter(val.revenue)}</Text>
                                        :
                                        null
                                    }

                                  </View>
                                )
                              })
                            }
                          </Pressable>
                          <Pressable style={{ borderLeftWidth: 1, borderBottomWidth: 1, height: 45, width: '14.28%' }}>
                            <Text style={{ fontFamily: 'Avenir-Heavy', textAlign: 'right', color: '#1A1919' }}>{res.date3} </Text>
                            {
                              listData.map((val) => {
                                return (
                                  <View style={{ marginBottom: 6 }}>
                                    {
                                      moment(val.date).format('DD') == res.date3 ?
                                        <Text style={{ textAlign: 'center', color: '#50C2C6', fontFamily: 'Avenir-Black', lineHeight: 19, fontSize: 12 }}>${kFormatter(val.revenue)}</Text>
                                        :
                                        null
                                    }

                                  </View>
                                )
                              })
                            }
                          </Pressable>
                          <Pressable style={{ borderLeftWidth: 1, borderBottomWidth: 1, height: 45, width: '14.28%' }}>
                            <Text style={{ fontFamily: 'Avenir-Heavy', textAlign: 'right', color: '#1A1919' }}>{res.date4} </Text>
                            {
                              listData.map((val) => {
                                return (
                                  <View style={{ marginBottom: 6 }}>
                                    {
                                      moment(val.date).format('DD') == res.date4 ?
                                        <Text style={{ textAlign: 'center', color: '#50C2C6', fontFamily: 'Avenir-Black', lineHeight: 19, fontSize: 12 }}>${kFormatter(val.revenue)}</Text>
                                        :
                                        null
                                    }

                                  </View>
                                )
                              })
                            }
                          </Pressable>
                          <Pressable style={{ borderLeftWidth: 1, borderBottomWidth: 1, height: 45, width: '14.28%' }}>
                            <Text style={{ fontFamily: 'Avenir-Heavy', textAlign: 'right', color: '#1A1919' }}>{res.date5} </Text>
                            {
                              listData.map((val) => {
                                return (
                                  <View style={{ marginBottom: 6 }}>
                                    {
                                      moment(val.date).format('DD') == res.date5 ?
                                        <Text style={{ textAlign: 'center', color: '#50C2C6', fontFamily: 'Avenir-Black', lineHeight: 19, fontSize: 12 }}>${kFormatter(val.revenue)}</Text>
                                        :
                                        null
                                    }

                                  </View>
                                )
                              })
                            }
                          </Pressable>
                          <Pressable style={{ borderLeftWidth: 1, borderBottomWidth: 1, borderRightWidth: 1, width: '14.28%' }}>
                            <Text style={{ fontFamily: 'Avenir-Heavy', textAlign: 'right', color: '#1A1919' }}>{res.date6} </Text>
                            {
                              listData.map((val) => {
                                return (
                                  <View style={{ marginBottom: 6 }}>
                                    {
                                      moment(val.date).format('DD') == res.date6 ?
                                        <Text style={{ textAlign: 'center', color: '#50C2C6', fontFamily: 'Avenir-Black', lineHeight: 19, fontSize: 12 }}>${kFormatter(val.revenue)}</Text>
                                        :
                                        null
                                    }

                                  </View>
                                )
                              })
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
      }
    </View>
  )
}
export default RevenueMonth;

const styles = StyleSheet.create({

})