import React, { useEffect, useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    Pressable,
    Modal,
    ScrollView,
} from 'react-native';
import Header from '../../Components/Header';
import { BASE_URL, width, height } from '../../Config';
import axios from 'axios';
import { Rating } from 'react-native-ratings';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux';
import { deleteSalon } from '../../Actions/PickSalon'

const Days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const DaysName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

const StoreDescription = ({ navigation, route, props }) => {
    const updatedName = useSelector(state => state)
    console.log("new name andar fav", updatedName.fav)
    const dispatch = useDispatch()
    const [serviceList, setServiceList] = useState([]);
    const [serviceTypeList, setServiceTypeList] = useState([]);
    const [hairdresserList, setHairdresserList] = useState([]);
    const [dateList, setDateList] = useState([]);
    const [pickStyleList, setPickStyleList] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [serviceTypeModal, setServiceTypeModal] = useState(false);
    const [pickStyleModal, setPickStyleModal] = useState(false);
    const [hairdresserModal, setHairdresserModal] = useState(false);
    const [serviceId, setServiceId] = useState('');
    const [serviceName, setServiceName] = useState('');
    const [serviceTypeId, setServiceTypeId] = useState('');
    const [serviceTypeName, setServiceTypeName] = useState('');
    const [pickStyleId, setPickStyleId] = useState('');
    const [pickStyleName, setPickStyleName] = useState('');
    const [hairdresserId, setHairdresserId] = useState('');
    const [hairdresserName, setHairdresserName] = useState('');
    const [userDetails, setUserDetails] = useState('');
    const { storeDetails } = route.params
    const { page } = route.params
    const [storeData, setStoreData] = useState([]);
    const [dateModalVisible, setDateModalVisible] = useState(false);
    const [timeModalVisible, setTimeModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    // Date
    const [days, setDays] = useState([]);
    const [nextDate, setNextDate] = useState(0);
    const [nextYear, setNextYear] = useState(0);
    // Time
    const [time, setTime] = useState([]);

    console.log("page",page)

    useEffect(() => {
        setNextYear(new Date().getFullYear());
        setNextDate(new Date().getMonth());
        getServiceList();
        getHairdresserList();
        getPickStyleList();
        getDateSlot();
        getData();
        Check()
        getStoreData()
    }, [])


    const getStoreData = () => {
        axios.get(`${BASE_URL}/store/detail/${storeDetails.id}`)
            .then(res => {
                setStoreData(res.data)
                //  console.log('res date slot', res.data.list)
            })
            .catch(e => {
                console.log('e', e)
            })
    }

    const Check = () => {
        if (updatedName.fav.data == null) {
            null
        } else {
            setServiceId(updatedName.fav.data.service.id)
        }
    }

    const getData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@user_details')
            const parData = jsonValue != null ? JSON.parse(jsonValue) : null;
            console.log("jdfhughs", parData)
            setUserDetails(parData)
        } catch (e) {
            // error reading value
        }
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

    const getDateSlot = () => {
        axios.get(`${BASE_URL}/timeslot/list/${storeDetails.id}`)
            .then(res => {
                setDateList(res.data.list)
                //  console.log('res date slot', res.data.list)
            })
            .catch(e => {
                console.log('e', e)
            })
    }


    const getServiceList = () => {
        // axios.get(`${BASE_URL}/style/list/${storeDetails.id}`)
        axios.get(`${BASE_URL}/service/all/list`)
            .then(res => {
                setServiceList(res.data)
                //    console.log('res', res.data)
            })
            .catch(e => {
                console.log('e', e)
            })
    }

    const getHairdresserList = () => {
        axios.get(`${BASE_URL}/employee/list/${storeDetails.id}`)
            .then(res => {
                setHairdresserList(res.data.list)
                //    console.log('res', res.data)
            })
            .catch(e => {
                console.log('e', e)
            })
    }

    const getPickStyleList = () => {
        axios.get(`${BASE_URL}/favourite/${storeDetails.id}`)
            .then(res => {
                setPickStyleList(res.data)
                console.log('res pick style', res.data)
            })
            .catch(e => {
                console.log('e', e)
            })
    }

    const getServiceTypeList = () => {
        if (serviceId == '') {
            //   console.log("Please Select Service First")
            alert('Please Select Service First')
        } else {
            axios.get(`${BASE_URL}/style/type/list/${serviceId}`)
                .then(res => {
                    setServiceTypeList(res.data)
                    //    console.log('res', res.data)
                    if (res.data.length == 0) {
                        alert('No Service Type available')
                    } else {
                        setServiceTypeModal(!serviceTypeModal)
                    }
                })
                .catch(e => {
                    console.log('e', e)
                    alert('No Service Type available')
                })
        }
    }

    const service = (data) => {
        setServiceId(data.id)
        setServiceName(data.name)
        setModalVisible(!modalVisible)
    }

    const onService = () => {
        if (serviceList.length == 0) {
            alert('No Service available')
        } else {
            setModalVisible(!modalVisible)
        }
    }

    const _onServiceType = (res) => {
        setServiceTypeId(res.id)
        setServiceTypeName(res.name)
        setServiceTypeModal(!serviceTypeModal)
    }

    const _onPickStyle = (res) => {
        console.log("sd", res)
        setPickStyleId(res.style.id)
        setPickStyleName(res.style.name)
        setPickStyleModal(!pickStyleModal)
    }

    const _onHairdresser = (res) => {
        setHairdresserId(res.id)
        setHairdresserName(res.name)
        setHairdresserModal(!hairdresserModal)
    }

    const _onTime = (res) => {
        setSelectedTime(res)
        setTimeModalVisible(!timeModalVisible)
    }

    const _onBack = () => navigation.goBack()

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

    const _onBook = () => {
        if (serviceId == '') {
            alert('Please select service')
            return false
        } else if (serviceTypeId == '') {
            alert('Please select service type')
            return false
        } else if (serviceTypeId == '') {
            alert('Please select pick style')
            return false
        } else if (hairdresserId == '') {
            alert('Please select hairdresser')
            return false
        } else if (selectedDate && selectedTime == '') {
            alert('Please select date and time')
            return false
        } else {
            axios.post(`${BASE_URL}/booking`, {
                store_id: storeDetails.id,
                employee_id: hairdresserId,
                customer_id: userDetails.id,
                service_id: serviceId,
                style_type_id: serviceTypeId,
                style_id: pickStyleId,
                booking_date: `${nextYear}-${nextDate + 1}-${selectedDate} ${selectedTime}`,
            })
                .then(res => {
                    console.log("booking response", res.data)
                    //    alert(res.data.message)
                    //    navigation.goBack()
                    navigation.navigate('PaymentScreen')
                    dispatch(deleteSalon(updatedName.fav))
                })
                .catch(e => {
                    console.log('e', e)
                    alert(e)
                })
        }
    }



    const renderService = () => {
        return (
            <View>
                <Pressable style={{ borderWidth: 1, borderColor: '#979797', height: 35, marginRight: 26.5, flexDirection: 'row', justifyContent: 'space-between' }} onPress={() => onService()}>
                    <Text style={{ fontFamily: 'Avenir-Medium', marginLeft: 10.5, marginTop: 4.5 }}>{serviceName == '' ? 'Select' : serviceName}</Text>
                    <Image source={require('../../Images/arrowDown.png')} style={{ marginTop: 5, marginRight: 9.36 }} />
                </Pressable>
                {
                    modalVisible == true ?
                        <View style={{ borderWidth: 1, marginRight: 27 }}>
                            {
                                serviceList.map((res) => {
                                    return (
                                        <Pressable onPress={() => service(res)}>
                                            <Text style={{ fontFamily: 'Avenir-Medium', marginTop: 7, marginLeft: 10.5, marginBottom: 7 }}>{res.name}</Text>
                                            <View
                                                style={{
                                                    borderBottomColor: '#979797',
                                                    borderBottomWidth: 1,
                                                }}
                                            />
                                        </Pressable>
                                    )
                                })
                            }
                        </View> :
                        null
                }
            </View>
        )
    }

    const renderServiceType = () => {
        return (
            <View>
                <Pressable style={{ borderWidth: 1, borderColor: '#979797', height: 35, marginRight: 26.5, flexDirection: 'row', justifyContent: 'space-between' }} onPress={() => getServiceTypeList()}>
                    <Text style={{ fontFamily: 'Avenir-Medium', marginLeft: 10.5, marginTop: 4.5 }}>{serviceTypeName == '' ? 'Select' : serviceTypeName}</Text>
                    <Image source={require('../../Images/arrowDown.png')} style={{ marginTop: 5, marginRight: 9.36 }} />
                </Pressable>
                {
                    serviceTypeModal == true ?
                        <View style={{ borderWidth: 1, marginRight: 27 }}>
                            {
                                serviceTypeList.map((res) => {
                                    return (
                                        <Pressable onPress={() => _onServiceType(res)}>
                                            <Text style={{ fontFamily: 'Avenir-Medium', marginTop: 7, marginLeft: 10.5, marginBottom: 7 }}>{res.name}</Text>
                                            <View
                                                style={{
                                                    borderBottomColor: '#979797',
                                                    borderBottomWidth: 1,
                                                }}
                                            />
                                        </Pressable>
                                    )
                                })
                            }
                        </View> :
                        null
                }
            </View>
        )
    }

    const renderPickStyle = () => {
        return (
            <View>
                <Pressable style={{ borderWidth: 1, borderColor: '#979797', height: 35, marginRight: 26.5, flexDirection: 'row', justifyContent: 'space-between' }} onPress={() => setPickStyleModal(!pickStyleModal)}>
                    <Text style={{ fontFamily: 'Avenir-Medium', marginLeft: 10.5, marginTop: 4.5 }}>{pickStyleName == '' ? 'Select' : pickStyleName}</Text>
                    <Image source={require('../../Images/arrowDown.png')} style={{ marginTop: 5, marginRight: 9.36 }} />
                </Pressable>
                {
                    pickStyleModal == true ?
                        <View style={{ borderWidth: 1, marginRight: 27 }}>
                            {
                                pickStyleList.map((res) => {
                                    return (
                                        <Pressable onPress={() => _onPickStyle(res)}>
                                            <Text style={{ fontFamily: 'Avenir-Medium', marginTop: 7, marginLeft: 10.5, marginBottom: 7 }}>{res.style.name}</Text>
                                            <View
                                                style={{
                                                    borderBottomColor: '#979797',
                                                    borderBottomWidth: 1,
                                                }}
                                            />
                                        </Pressable>
                                    )
                                })
                            }
                        </View> :
                        null
                }
            </View>
        )
    }

    const renderHairDresser = () => {
        return (
            <View>
                <Pressable style={{ borderWidth: 1, borderColor: '#979797', height: 35, marginRight: 26.5, flexDirection: 'row', justifyContent: 'space-between' }} onPress={() => setHairdresserModal(!hairdresserModal)}>
                    <Text style={{ fontFamily: 'Avenir-Medium', marginLeft: 10.5, marginTop: 4.5 }}>{hairdresserName == '' ? 'Select' : hairdresserName}</Text>
                    <Image source={require('../../Images/arrowDown.png')} style={{ marginTop: 5, marginRight: 9.36 }} />
                </Pressable>
                {
                    hairdresserModal == true ?
                        <View style={{ borderWidth: 1, marginRight: 27 }}>
                            {
                                hairdresserList.map((res) => {
                                    return (
                                        <Pressable onPress={() => _onHairdresser(res)}>
                                            <Text style={{ fontFamily: 'Avenir-Medium', marginTop: 7, marginLeft: 10.5, marginBottom: 7 }}>{res.name}</Text>
                                            <View
                                                style={{
                                                    borderBottomColor: '#979797',
                                                    borderBottomWidth: 1,
                                                }}
                                            />
                                        </Pressable>
                                    )
                                })
                            }
                        </View> :
                        null
                }
            </View>
        )
    }

    return (
        <View style={styles.container}>
            {
                <Header leftIcon='back' onLeftIconPress={_onBack} {...props} />
            }
            {
                <ScrollView>
                    {
                        updatedName.fav.data == null ?
                            null : page == 'Home' ? null
                            :
                            <Text style={{ fontSize: 16, fontFamily: 'Avenir-Medium', marginLeft: 29, lineHeight: 22 }}>{updatedName.fav.data.name}</Text>
                    }
                    {
                        updatedName.fav.data == null ?
                            null
                            :
                            <View style={{ flexDirection: 'row' }}>
                                <Image
                                    style={{ marginLeft: 26, marginTop: 15, height: height * 0.14, width: width * 0.28, }}
                                    source={{
                                        uri: updatedName.fav.data.upload_front_photo,
                                    }}
                                />
                                <Image
                                    style={{ marginLeft: 12, marginTop: 15, height: height * 0.14, width: width * 0.28, }}
                                    source={{
                                        uri: updatedName.fav.data.upload_back_photo,
                                    }}
                                />
                                <Image
                                    style={{ marginLeft: 12, marginTop: 15, height: height * 0.14, width: width * 0.28, marginRight: 26 }}
                                    source={{
                                        uri: updatedName.fav.data.upload_right_photo,
                                    }}
                                />
                            </View>
                    }
                    <View style={{ flexDirection: 'row', marginLeft: 26, marginTop: updatedName.fav.data ? 23 : 10 }}>
                        {
                           !storeData || !storeData.images ||  storeData.images.length == 0 ?
                                <Image
                                    style={{ height: 83, width: 71 }}
                                    source={require('../../Images/noImage.jpg')}
                                />
                                :
                              
                                        <Image source={{
                                            uri:  storeData.images[0].url,
                                        }} style={{ height: 83, width: 71 }} />
                                    
                                

                        }
                        <View style={{ marginLeft: 15 }}>
                            <Text style={{ color: '#1A1919', fontSize: 15, fontFamily: 'Avenir-Medium' }}>{storeData.store_name}</Text>
                            <Text style={{ fontSize: 12, fontFamily: 'Avenir-Medium', lineHeight: 16 }}>0.4 Miles</Text>
                            <View style={{ marginRight: 186 }}>
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
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontSize: 12, fontFamily: 'Avenir-Medium', marginTop: 4 }}>8-18</Text>
                                {
                                    storeData?.is_available == 1 ?
                                        <Text style={{ fontSize: 12, fontFamily: 'Avenir-Medium', marginTop: 4, color: '#70CF2B' }}> Open</Text>
                                        :
                                        <Text style={{ fontSize: 12, fontFamily: 'Avenir-Medium', marginTop: 4, color: '#E73E3E' }}> Closed</Text>
                                }
                            </View>
                        </View>
                    </View>
                    {
                        updatedName.fav.data == null ?
                            <View>
                                <Text style={{ fontSize: 16, fontFamily: 'Avenir-Heavy', marginLeft: 26, marginTop: 10 }}>Reviews</Text>
                                <View style={{ borderBottomColor: '#979797', borderBottomWidth: 1, marginLeft: 27, marginRight: 27, marginTop: 3 }}
                                />
                                <Text style={{ fontFamily: 'Avenir-Medium', marginLeft: 27, marginTop: 6, marginBottom: 7 }}>“Brilliant and professional, I was in and out before the end of my lunch break.”</Text>
                                <View style={{ borderBottomColor: '#979797', borderBottomWidth: 1, marginLeft: 27, marginRight: 27, }} />
                                <Text style={{ fontFamily: 'Avenir-Medium', marginLeft: 27, marginTop: 6, marginBottom: 7 }}>“Had a stop over in town tonight and needed a haircut before a meeting tomorrow. Last minute lifesaver.”</Text>
                                <View style={{ borderBottomColor: '#979797', borderBottomWidth: 1, marginLeft: 27, marginRight: 27, }} />
                            </View>
                            :
                            null
                    }
                    <Text style={{ fontSize: 16, fontFamily: 'Avenir-Heavy', marginLeft: 28, marginTop: 10 }}>Book</Text>
                    <View style={{ marginLeft: 27.5 }}>
                        {
                            updatedName.fav.data == null ?
                                <View>
                                    <Text style={{ fontFamily: 'Avenir-Medium', marginTop: 7 }}>Service</Text>
                                    {renderService()}

                                </View>
                                :
                                null

                        }
                        < Text style={{ fontFamily: 'Avenir-Medium', marginTop: 7.5 }}>Service Type</Text>
                        {renderServiceType()}
                        {
                            updatedName.fav.data == null ?
                                <View>
                                    <Text style={{ fontFamily: 'Avenir-Medium', marginTop: 7.5 }}>Pick Style</Text>
                                    {renderPickStyle()}
                                </View>
                                :
                                null
                        }

                        <Text style={{ fontFamily: 'Avenir-Medium', marginTop: 7.5 }}>Hairdresser</Text>
                        {renderHairDresser()}
                        <Text style={{ fontFamily: 'Avenir-Medium', marginTop: 7.5 }}>Date & Time</Text>





















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
                                                                <Pressable onPress={() => { res.date === undefined || res.is_open == 0 ? null : setDateModalVisible(!dateModalVisible), getTime(res.date, 0) }}>
                                                                    {
                                                                        res.is_open == 0 ?
                                                                            <Text style={{ fontFamily: 'Avenir-Heavy', textAlign: 'center', width: 45, borderLeftWidth: 1, borderBottomWidth: 1, color: '#979797' }}>{res.date} </Text>
                                                                            :
                                                                            <Text style={{ fontFamily: 'Avenir-Heavy', textAlign: 'center', width: 45, borderLeftWidth: 1, borderBottomWidth: 1 }}>{res.date} </Text>
                                                                    }

                                                                </Pressable>
                                                                <Pressable onPress={() => { res.date1 === undefined || res.is_open1 == 0 ? console.log("not Pressable") : setDateModalVisible(!dateModalVisible), getTime(res.date1, 1) }}>
                                                                    {
                                                                        res.is_open1 == 0 ?
                                                                            <Text style={{ fontFamily: 'Avenir-Heavy', textAlign: 'center', width: 45, borderLeftWidth: 1, borderBottomWidth: 1, color: '#979797' }}>{res.date1} </Text>
                                                                            :
                                                                            <Text style={{ fontFamily: 'Avenir-Heavy', textAlign: 'center', width: 45, borderLeftWidth: 1, borderBottomWidth: 1 }}>{res.date1} </Text>
                                                                    }

                                                                </Pressable>
                                                                <Pressable onPress={() => { res.date2 === undefined || res.is_open2 == 0 ? console.log("not Pressable") : setDateModalVisible(!dateModalVisible), getTime(res.date2, 2) }}>
                                                                    {
                                                                        res.is_open2 == 0 ?
                                                                            <Text style={{ fontFamily: 'Avenir-Heavy', textAlign: 'center', width: 45, borderLeftWidth: 1, borderBottomWidth: 1, color: '#979797' }}>{res.date2} </Text>
                                                                            :
                                                                            <Text style={{ fontFamily: 'Avenir-Heavy', textAlign: 'center', width: 45, borderLeftWidth: 1, borderBottomWidth: 1 }}>{res.date2} </Text>
                                                                    }

                                                                </Pressable>
                                                                <Pressable onPress={() => { res.date3 === undefined || res.is_open3 == 0 ? console.log("not Pressable") : setDateModalVisible(!dateModalVisible), getTime(res.date3, 3) }}>
                                                                    {
                                                                        res.is_open3 == 0 ?
                                                                            <Text style={{ fontFamily: 'Avenir-Heavy', textAlign: 'center', width: 45, borderLeftWidth: 1, borderBottomWidth: 1, color: '#979797' }}>{res.date3} </Text>
                                                                            :
                                                                            <Text style={{ fontFamily: 'Avenir-Heavy', textAlign: 'center', width: 45, borderLeftWidth: 1, borderBottomWidth: 1 }}>{res.date3} </Text>
                                                                    }

                                                                </Pressable>
                                                                <Pressable onPress={() => { res.date4 === undefined || res.is_open4 == 0 ? console.log("not Pressable") : setDateModalVisible(!dateModalVisible), getTime(res.date4, 4) }}>
                                                                    {
                                                                        res.is_open4 == 0 ?
                                                                            <Text style={{ fontFamily: 'Avenir-Heavy', textAlign: 'center', width: 45, borderLeftWidth: 1, borderBottomWidth: 1, color: '#979797' }}>{res.date4} </Text>
                                                                            :
                                                                            <Text style={{ fontFamily: 'Avenir-Heavy', textAlign: 'center', width: 45, borderLeftWidth: 1, borderBottomWidth: 1 }}>{res.date4} </Text>
                                                                    }

                                                                </Pressable>
                                                                <Pressable onPress={() => { res.date5 === undefined || res.is_open5 == 0 ? console.log("not Pressable") : setDateModalVisible(!dateModalVisible), getTime(res.date5, 5) }}>
                                                                    {
                                                                        res.is_open5 == 0 ?
                                                                            <Text style={{ fontFamily: 'Avenir-Heavy', textAlign: 'center', width: 45, borderLeftWidth: 1, borderBottomWidth: 1, color: '#979797' }}>{res.date5} </Text>
                                                                            :
                                                                            <Text style={{ fontFamily: 'Avenir-Heavy', textAlign: 'center', width: 45, borderLeftWidth: 1, borderBottomWidth: 1 }}>{res.date5} </Text>
                                                                    }

                                                                </Pressable>
                                                                <Pressable onPress={() => { res.date6 === undefined || res.is_open6 == 0 ? console.log("not Pressable") : setDateModalVisible(!dateModalVisible), getTime(res.date6, 6) }}>
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






                        {/* Time Modal */}


                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={timeModalVisible}
                            onRequestClose={() => {
                                Alert.alert("Modal has been closed.");
                                setTimeModalVisible(!timeModalVisible);
                            }}
                        >
                            <View style={{ flex: 1, position: 'absolute', bottom: 0, left: 160 }}>
                                <View style={{
                                    width: 145,
                                    height: 229,
                                    margin: 20,
                                    alignItems: 'center',
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
                                                return (
                                                    <Pressable
                                                        style={[styles.button, styles.buttonClose]}
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




















                        <View style={{ flexDirection: 'row' }}>
                            <Pressable style={{ flexDirection: 'row', borderWidth: 1, borderColor: '#979797', height: 35, width: 133, justifyContent: 'space-between' }} onPress={() => { setDateModalVisible(!dateModalVisible), getMonthDateDay(new Date().getFullYear(), new Date().getMonth()) }}>
                                <Text style={{ fontFamily: 'Avenir-Medium', marginLeft: 10.5, marginTop: 5 }}>{selectedDate == '' ? 'Select' : `${selectedDate} ${nextDate == 0 ? 'Jan' : nextDate == 1 ? 'Feb' : nextDate == 2 ? "Mar" : nextDate == 3 ? "Apr" : nextDate == 4 ? "May" : nextDate == 5 ? "Jun" : nextDate == 6 ? "Jul" : nextDate == 7 ? "Aug" : nextDate == 8 ? "Sep" : nextDate == 9 ? "Oct" : nextDate == 10 ? "Nov" : "Dec"} ${nextYear}`}</Text>
                                <Image
                                    style={{ marginLeft: 15, marginRight: 4.5, marginTop: 7.5 }}
                                    source={require('../../Images/storeCalendar.png')}
                                />
                            </Pressable>
                            <Pressable style={{ flexDirection: 'row', borderWidth: 1, borderColor: '#979797', marginLeft: 15, height: 35 }} onPress={() => { time.length == 0 ? alert("Please select date first") : setTimeModalVisible(!timeModalVisible) }}>
                                <Text style={{ fontFamily: 'Avenir-Medium', marginLeft: 10.5, marginTop: 5 }}>{selectedTime == '' ? 'Select' : selectedTime}</Text>
                                <Image
                                    style={{ marginTop: 15, marginLeft: 36, marginRight: 6.36 }}
                                    source={require('../../Images/Triangle.png')}
                                />
                            </Pressable>
                        </View>
                        <Pressable style={{ borderWidth: 1, marginLeft: 95.5, marginRight: 123, marginTop: 24, marginBottom: 24 }}>
                            <Text style={{ fontFamily: 'Avenir-Medium', textAlign: 'center', marginTop: 9.5, marginBottom: 6.5, lineHeight: 19 }} onPress={() => _onBook()}>BOOK NOW</Text>
                        </Pressable>
                    </View>
                </ScrollView>
            }
        </View >
    )
}
export default StoreDescription;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    centeredView: {
        flex: 1,
        //     justifyContent: "center",
        alignItems: "center",
    },
    modalView: {
        width: 336,
        margin: 20,
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
    },
})