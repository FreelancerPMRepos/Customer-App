import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Header from '../../../Components/EmployeeHeader';
import { BASE_URL, Colors } from '../../../Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import moment from 'moment';

var weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun",]

var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const RevenueWeek = (props) => {
    const [listData, setListData] = useState([]);
    const [weekDate, setWeekDate] = useState();
    const [userId, setUserId] = useState('');

    const _onBack = () => props.navigation.goBack()

    useEffect(() => {
        getWeek();
        getUser();
    }, [])

    const getWeek = () => {
        let curr = new Date
        let week = []

        for (let i = 1; i <= 7; i++) {
            let first = curr.getDate() - curr.getDay() + i
            let day = new Date(curr.setDate(first)).toISOString().slice(0, 10)
            week.push(day)
        }
        setWeekDate(week)
        console.log("week", week)
    }

    const getUser = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@user_details')
            const parData = jsonValue != null ? JSON.parse(jsonValue) : null;
            console.log("jdfhughs", parData.id)
            setUserId(parData.id)
            getData(parData.id)
        } catch (e) {
            // error reading value
        }
    }

    const getData = (id) => {
        axios.get(`${BASE_URL}/revenue/week?employee_id=${id}`)
            .then(res => {
                console.log('res', res.data)
                setListData(res.data)
                // setLoading(false)
            })
            .catch(e => {
                console.log('e', e)
                //  setLoading(false)
            })
    }

    return (
        <View>
            {
                <Header leftIcon="back" onLeftIconPress={() => _onBack()} title={"My Performance"} {...props} />
            }
            {
                <View>
                    <View style={{ backgroundColor: '#141313', marginTop: 23, marginLeft: 16, marginRight: 16 }}>
                        <Text style={{ textAlign: 'center', color: '#FFFFFF', fontSize: 16, fontFamily: 'Avenir-Heavy', lineHeight: 22, marginTop: 9, marginBottom: 10 }}>{months[new Date().getMonth()]}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginLeft: 17, borderBottomWidth: 1, marginRight: 16, borderColor: '#979797' }}>
                        {
                            weekdays.map((res) => {
                                return (
                                    <Text style={{ color: '#1A1919', fontFamily: 'Avenir-Heavy', lineHeight: 19, borderLeftWidth: 1, width: 54, paddingTop: 7, textAlign: 'center', borderRightWidth: 1, borderColor: '#979797' }}>{res}</Text>
                                )
                            })
                        }
                    </View>
                    <View style={{ flexDirection: 'row', marginLeft: 17, borderBottomWidth: 1, marginRight: 16, borderColor: '#979797' }}>
                        {
                            listData.map((res) => {
                                var revenue = res.revenue.toString()
                                return (
                                    <View style={{ borderLeftWidth: 1, flexDirection: 'row', flexWrap: 'wrap', borderColor: '#979797' }}>
                                        {
                                            weekDate.map((val) => {
                                                return (
                                                    <View style={{ borderRightWidth: 1, flexWrap: 'wrap', borderColor: '#979797' }}>
                                                        <Text style={{ color: '#1A1919', fontFamily: 'Avenir-Heavy', lineHeight: 19, fontSize: 12, width: 54, textAlign: 'right', paddingRight: 5 }}>{moment(val).format('DD')}</Text>
                                                        {
                                                            moment(val).format('DD') == moment(res.date).format('DD') ?
                                                                <Text style={{ color: '#50C2C6', fontFamily: 'Avenir-Black', lineHeight: 19, paddingLeft: 11, paddingBottom: 5.5, flexWrap: 'wrap' }}>{res.revenue > 999 ? `$${revenue.substring(0,2)}K` : res.revenue > 1000000 ? `$${revenue.substring(0,4)}M` : `${res.revenue}`}</Text>
                                                                :
                                                                null
                                                        }
                                                    </View>
                                                )
                                            })
                                        }
                                    </View>
                                )
                            })
                        }
                    </View>
                </View>
            }
        </View>
    )
}
export default RevenueWeek;

const styles = StyleSheet.create({

})