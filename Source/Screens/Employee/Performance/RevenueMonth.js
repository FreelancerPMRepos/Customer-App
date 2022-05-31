import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  Pressable,
  StyleSheet,
  Image
} from 'react-native';

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
  const [storeId, setStoreId] = useState('');
  const [employeeId, setEmploteeId] = useState('');
  const [nextDate, setNextDate] = useState();
  const [nextYear, setNextYear] = useState();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [curDate, setCurDate] = useState()
  const [currentMonth, setCurrentMonth] = useState()

  const _onBack = () => props.navigation.goBack()

  useEffect(() => {

    getUser();
    setNextYear(new Date().getFullYear());
    setNextDate(new Date().getMonth() + 1);
  }, [])

  const getMonthYear = (type) => {
    if (type == 'right') {
      var date = moment(currentDate, "M-YYYY").add(1, "M").format("M-YYYY")
      setCurDate(date)
    } else if (type == 'left') {
      var date = moment(currentDate, "M-YYYY").subtract(1, "M").format("M-YYYY")
      setCurDate(date)
    } else {
      var date = (new Date().getMonth() + 1).toString() + "-" + new Date().getFullYear().toString();
    }
    setCurrentDate(date)
    var new_date = moment(date, "M-YYYY").format("MMMM YYYY");
    setCurrentMonth(new_date)
    getMonthDateDay(date.split("-")[1], date.split("-")[0] - 1, date)

  }


  const getUser = async () => {
    axios.get(`${BASE_URL}/users/me`)
      .then(res => {
        global.store_id = res.data.store_id
        global.id = res.data.id
        getMonthYear()
      })
      .catch(e => {
        console.log('e', e)
      })
  }


  const getMonthDateDay = (year, date, datety) => {
    var year = year;
    var month = date;
    var date = new Date(year, month, 1);
    var days = [];
    var newObj = {};
    setLoading(true)
    axios.get(`${BASE_URL}/revenue/month?date=${datety}&employee_id=${global.id}&store_id=${global.store_id}`)
      .then(res => {
        setListData(res.data)
        while (date.getMonth() == month) {
          var revenue = ''
          if (res.data) {
            var dateStr = moment(date).format("YYYY-MM-DD");
            for (var i in res.data) {
              if (res.data[i].date == dateStr) {
                revenue = res.data[i].revenue;
              }
            }
          }
          if (date.getDay() == 0) {
            days.push(newObj);
            newObj = {};
            newObj.revenue = revenue;
            newObj.date = date.getDate();
          } else if (date.getDay() == 1) {
            newObj.revenue1 = revenue;
            newObj.date1 = date.getDate();
          } else if (date.getDay() == 2) {
            newObj.revenue2 = revenue;
            newObj.date2 = date.getDate();
          } else if (date.getDay() == 3) {
            newObj.revenue3 = revenue;
            newObj.date3 = date.getDate();
          } else if (date.getDay() == 4) {
            newObj.revenue4 = revenue;
            newObj.date4 = date.getDate();
          } else if (date.getDay() == 5) {
            newObj.revenue5 = revenue;
            newObj.date5 = date.getDate();
          } else if (date.getDay() == 6) {
            newObj.revenue6 = revenue;
            newObj.date6 = date.getDate();
          }

          date.setDate(date.getDate() + 1);
        }
        days.push(newObj);
        console.log("days", days)
        setDays(days);
        setLoading(false)
      })
      .catch(e => {
        console.log('e', e)
        setLoading(false)
      })
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
                <Pressable onPress={() => getMonthYear('left')}>
                  <Image
                    style={{ marginLeft: 15, marginRight: 4.5, marginTop: 10.5 }}
                    source={require('../../../Images/left-arrow.png')}
                  />
                </Pressable>
                <Text style={{ color: 'white', textAlign: 'center', fontSize: 16, fontFamily: 'Avenir-Heavy', marginTop: 9, marginBottom: 10, lineHeight: 22 }}>
                  {currentMonth}
                </Text>
                <Pressable onPress={() => getMonthYear('right')}>
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
                            <Text style={{ textAlign: 'center', color: '#50C2C6', fontFamily: 'Avenir-Black', lineHeight: 19, fontSize: 10 }}>{res.revenue ? `$ ` + res.revenue.toLocaleString() : null}</Text>
                          </Pressable>
                          <Pressable style={{ borderLeftWidth: 1, borderBottomWidth: 1, height: 45, width: '14.28%' }}>
                            <Text style={{ fontFamily: 'Avenir-Heavy', textAlign: 'right', color: '#1A1919' }}>{res.date1} </Text>
                            <Text style={{ textAlign: 'center', color: '#50C2C6', fontFamily: 'Avenir-Black', lineHeight: 19, fontSize: 10 }}>{res.revenue1 ? `$ ` + res.revenue1.toLocaleString() : null}</Text>
                          </Pressable>
                          <Pressable style={{ borderBottomWidth: 1, borderLeftWidth: 1, height: 45, width: '14.28%' }}>
                            <Text style={{ fontFamily: 'Avenir-Heavy', textAlign: 'right', color: '#1A1919' }}>{res.date2} </Text>
                            <Text style={{ textAlign: 'center', color: '#50C2C6', fontFamily: 'Avenir-Black', lineHeight: 19, fontSize: 10 }}>{res.revenue2 ? `$ ` + res.revenue2.toLocaleString() : null}</Text>
                          </Pressable>
                          <Pressable style={{ borderLeftWidth: 1, borderBottomWidth: 1, height: 45, width: '14.28%' }}>
                            <Text style={{ fontFamily: 'Avenir-Heavy', textAlign: 'right', color: '#1A1919' }}>{res.date3} </Text>
                            <Text style={{ textAlign: 'center', color: '#50C2C6', fontFamily: 'Avenir-Black', lineHeight: 19, fontSize: 10 }}>{res.revenue3 ? `$ ` + res.revenue3.toLocaleString() : null}</Text>

                          </Pressable>
                          <Pressable style={{ borderLeftWidth: 1, borderBottomWidth: 1, height: 45, width: '14.28%' }}>
                            <Text style={{ fontFamily: 'Avenir-Heavy', textAlign: 'right', color: '#1A1919' }}>{res.date4} </Text>
                            <Text style={{ textAlign: 'center', color: '#50C2C6', fontFamily: 'Avenir-Black', lineHeight: 19, fontSize: 10 }}>{res.revenue4 ? `$ ` + res.revenue4.toLocaleString() : null}</Text>

                          </Pressable>
                          <Pressable style={{ borderLeftWidth: 1, borderBottomWidth: 1, height: 45, width: '14.28%' }}>
                            <Text style={{ fontFamily: 'Avenir-Heavy', textAlign: 'right', color: '#1A1919' }}>{res.date5} </Text>
                            <Text style={{ textAlign: 'center', color: '#50C2C6', fontFamily: 'Avenir-Black', lineHeight: 19, fontSize: 10 }}>{res.revenue5 ? `$ ` + res.revenue5.toLocaleString() : null}</Text>

                          </Pressable>
                          <Pressable style={{ borderLeftWidth: 1, borderBottomWidth: 1, borderRightWidth: 1, height: 45, width: '14.28%' }}>
                            <Text style={{ fontFamily: 'Avenir-Heavy', textAlign: 'right', color: '#1A1919' }}>{res.date6} </Text>
                            <Text style={{ textAlign: 'center', color: '#50C2C6', fontFamily: 'Avenir-Black', lineHeight: 19, fontSize: 10 }}>{res.revenue6 ? `$ ` + res.revenue6.toLocaleString() : null}</Text>
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