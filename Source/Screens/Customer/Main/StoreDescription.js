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
import Header from '../../../Components/Header';
import { BASE_URL, width, height } from '../../../Config';
import axios from 'axios';
import { Rating } from 'react-native-ratings';
import moment, { now } from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux';
import { deleteSalon } from '../../../Actions/PickSalon'
import Loader from '../../../Components/Loader';
import { getPreciseDistance } from 'geolib';
import MapView, { Marker } from 'react-native-maps';
import Dialog, { DialogContent } from 'react-native-popup-dialog';

const Days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const DaysName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

const DayShortCapsName = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]

const genderList = ["Men", "Women"]


const StoreDescription = ({ navigation, route, props }) => {
    const updatedName = useSelector(state => state)
    const [isLoading, setLoading] = useState(false)
    const [belowView, setBelowView] = useState(false)
    const dispatch = useDispatch()
    const [serviceList, setServiceList] = useState([]);
    const [serviceTypeList, setServiceTypeList] = useState([]);
    const [hairdresserList, setHairdresserList] = useState([]);
    const [dateList, setDateList] = useState([]);
    const [pickStyleList, setPickStyleList] = useState([]);
    const [promotionTime, setPromotionTime] = useState([]);
    const [userDataMe, setUserData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [serviceTypeModal, setServiceTypeModal] = useState(false);
    const [pickStyleModal, setPickStyleModal] = useState(false);
    const [hairdresserModal, setHairdresserModal] = useState(false);
    const [genderModal, setGenderModal] = useState(false);
    const [bookingDone, setBookingDone] = useState(false);
    const [serviceId, setServiceId] = useState('');
    const [serviceName, setServiceName] = useState('');
    const [serviceTypeId, setServiceTypeId] = useState('');
    const [serviceTypeName, setServiceTypeName] = useState('');
    const [pickStyleId, setPickStyleId] = useState('');
    const [pickStyleName, setPickStyleName] = useState('');
    const [hairdresserId, setHairdresserId] = useState('');
    const [hairdresserName, setHairdresserName] = useState('');
    const [genderName, setGenderName] = useState('');
    const [userDetails, setUserDetails] = useState('');
    const [timeInterval, setTimeInterval] = useState('');
    const [serviceTypeDiscount, setServiceTypeDiscount] = useState('');
    const [serviceDiscount, setServiceDiscount] = useState('');
    const { storeDetails } = route.params
    const { page } = route.params
    const [storeData, setStoreData] = useState([]);
    const [dateModalVisible, setDateModalVisible] = useState(false);
    const [timeModalVisible, setTimeModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [overallDistance, setOverallDistance] = useState('');
    const [bookingData, setBookingData] = useState([]);
    const [isServiceTypeDiscount, setIsServiceTypeDiscount] = useState(false);
    // Date
    const [days, setDays] = useState([]);
    const [nextDate, setNextDate] = useState(0);
    const [nextYear, setNextYear] = useState(0);
    // Time
    const [time, setTime] = useState([]);



    useEffect(() => {
        let isCancelled = false;
        if (!isCancelled) {
            getStoreData();
            if (updatedName.fav != null && updatedName.fav.data != null && updatedName.fav.data != null && updatedName.fav.data.length > 0 && updatedName.fav.data[0].service) {
                setServiceId(updatedName.fav.data[0].service.id)
                setServiceName(updatedName.fav.data[0].service.name)
                if (updatedName.fav.data[0].styletype) {
                    setServiceTypeId(updatedName.fav.data[0].styletype.id)
                    setServiceTypeName(updatedName.fav.data[0].styletype.name)
                }
            }
            setNextYear(new Date().getFullYear());
            setNextDate(new Date().getMonth());
            getServiceList();
            getHairdresserList();
            //  getDateSlot();
            getData();
            userData();
            //     Check();
        }
        return () => {
            isCancelled = true
        }
    }, [])

    const userData = () => {
        setLoading(true)
        axios.get(`${BASE_URL}/users/me`)
            .then(res => {
                setUserData(res)
                if (res.data.gender != '') {
                    if (res.data.gender == "FEMALE")
                        setGenderName('Women')
                    else if (res.data.gender == "MALE") {
                        setGenderName('Men')
                    }
                }
                setLoading(false)
            })
            .catch(e => {
                console.log('e', e)
                setLoading(false)
            })
    }

    const getStoreData = () => {
        setLoading(true)
        axios.get(`${BASE_URL}/store/detail/${storeDetails.id}`)
            .then(res => {
                setStoreData(res.data)
                global.mark = [{ latitude: res.data.latitude, longitude: res.data.longitude }]
                global.latitude = res.data.latitude
                global.longitude = res.data.longitude
                var pdis = getPreciseDistance(
                    { latitude: res.data.latitude, longitude: res.data.longitude },
                    { latitude: global.CurrentLatitude, longitude: global.CurrentLongitude },
                );
                let distance = (pdis / 1609).toFixed(2)
                setOverallDistance(distance)

                setLoading(false)
            })
            .catch(e => {
                console.log('e', e)
                setLoading(false)
            })
    }

    const Check = () => {
        if (updatedName.fav.data == null) {
            null
        } else {
            setServiceId(updatedName?.fav?.data?.service?.id)
        }
    }

    const getData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@user_details')
            const parData = jsonValue != null ? JSON.parse(jsonValue) : null;
            setUserDetails(parData)
        } catch (e) {
            // error reading value
        }
    }

    const getTime = (date, day) => {
        setLoading(true)
        setSelectedDate(date)
        for (var i in dateList) {
            if (dateList[i].employee_id) {
                console.log("In if")
                if (dateList[i].day == DaysName[day]) {
                    var new_array = getEmployeeTimeData(dateList[i].employee_start_time, dateList[i].break_start_time, promotionTime, dateList[i].day, date)
                    var next_slot = getEmployeeTimeData(dateList[i].break_end_time, dateList[i].employee_end_time, promotionTime, dateList[i].day, date)
                    for (var i in next_slot) {
                        new_array.push(next_slot[i])
                    }

                }
            } else {
                console.log("In Else")
                if (dateList[i].day == DaysName[day]) {
                    console.log("Opne",dateList[i].open_time)
                    var new_array = getEmployeeTimeData(dateList[i].open_time, dateList[i].close_time, promotionTime, dateList[i].day, date)
                }
            }

        }
        setLoading(false)
        setTime(new_array)
    }

    const getEmployeeTimeData = (employeeStartTime, employeeEndTime, promotion_timeslot, day, date) => {

        var startTime = employeeStartTime;
        var endTime = employeeEndTime;
        var openTime = moment(startTime, 'HH:mm');
        var closeTime = moment(endTime, 'HH:mm');

        if (closeTime.isBefore(openTime)) {
            closeTime.add(1, 'day');
        }
        var timeStops = [];
        var isToday = false;
        if (moment(`${nextYear}-${nextDate + 1}-${date}`).format('YYYY-M-DD') === moment(new Date()).format('YYYY-M-DD')) {
            isToday = true;
        }

        var currentDate = moment(new Date()).utc();
        currentDate = moment(currentDate).format('DD/MM/YYYY hh:mm A')
        currentDate = moment(currentDate, 'DD/MM/YYYY hh:mm A');

        while (openTime <= closeTime) {


            var obj = {
                date: moment(openTime).format('hh:mm A'),
                temp: moment(openTime, 'HH:mm'),
                isOffer: false,
            }


            if (isToday == true) {
                if (obj.temp <= currentDate) {
                    openTime.add('5', 'minutes');
                    continue;
                }
            }

            var discount = getDiscount(obj.temp, promotion_timeslot, day);
            if (discount && discount > 0) {
                obj.isOffer = true;
                obj.discount = discount;
            }

            timeStops.push(obj);
            openTime.add('5', 'minutes');

        }

        return timeStops;
    }

    const getDiscount = (temp, timeslot, day) => {
        var discount = 0;
        for (var i in timeslot) {
            if (timeslot[i].day == day && timeslot[i].close_time != "" && timeslot[i].open_time != "" && timeslot[i].is_open == 1) {
                var openTime = moment(timeslot[i].open_time, 'HH:mm');
                var closeTime = moment(timeslot[i].close_time, 'HH:mm');
                if (temp.isBefore(closeTime) && temp.isAfter(openTime)) {
                    if (discount < timeslot[i].discount) {
                        discount = timeslot[i].discount;
                    }
                }
            }
        }

        return discount;
    }

    const getMonthDateDay = (year, date) => {
        setNextDate(date)
        var year = year;
        var month = date;
        var date = new Date(year, month, 1);
        var days = [];
        var newObj = {};
        while (date.getMonth() === month) {
            if (date.getDay() == 0) {
                days.push(newObj);
                newObj = {};
                newObj.date = date.getDate();
                newObj.is_open = getIsopen(date.getDay(), date);
            } else if (date.getDay() == 1) {
                newObj.date1 = date.getDate();
                newObj.is_open1 = getIsopen(date.getDay(), date);
            } else if (date.getDay() == 2) {
                newObj.date2 = date.getDate();
                newObj.is_open2 = getIsopen(date.getDay(), date);
            } else if (date.getDay() == 3) {
                newObj.date3 = date.getDate();
                newObj.is_open3 = getIsopen(date.getDay(), date);
            } else if (date.getDay() == 4) {
                newObj.date4 = date.getDate();
                newObj.is_open4 = getIsopen(date.getDay(), date);
            } else if (date.getDay() == 5) {
                newObj.date5 = date.getDate();
                newObj.is_open5 = getIsopen(date.getDay(), date);
            } else if (date.getDay() == 6) {
                newObj.date6 = date.getDate();
                newObj.is_open6 = getIsopen(date.getDay(), date);
            }

            date.setDate(date.getDate() + 1);
        }
        days.push(newObj);
        setDays(days);
    }

    const getIsopen = (day, date) => {
        if (moment(date).format('MM/DD/YYYY') >= moment(new Date()).format('MM/DD/YYYY')) {
            for (var i in dateList) {
                if (dateList[i].day == DaysName[day]) {
                    return dateList[i].is_open;
                }
            }
        }

        return 0;
    }

    const getDateSlot = (id) => {
        console.log("id", id)
        setLoading(true)
        //    axios.get(`${BASE_URL}/timeslot/list/${storeDetails.id}`)
        if (id == '001') {
            axios.get(`${BASE_URL}/timeslot/list/${storeDetails.id}`)
                .then(res => {
                    setDateList(res.data.list)
                    console.log('res.data.list', res.data.list)
                    setLoading(false)
                })
                .catch(e => {
                    console.log('e getDateSlot', e)
                    setLoading(false)
                })
        } else {
            axios.get(`${BASE_URL}/employee/working/hour/list/${id}`)
                .then(res => {
                    setDateList(res.data.list)
                    console.log('res.data.list', res.data.list)
                    setLoading(false)
                })
                .catch(e => {
                    console.log('e getDateSlot', e)
                    setLoading(false)
                })
        }
    }

    const getPromotionTimeList = (id) => {
        setLoading(true)
        axios.get(`${BASE_URL}/promotion/timeslot/list/${id}`)
            .then(res => {
                console.log("rtr", res.data)
                setPromotionTime(res.data)
                setLoading(false)
            })
            .catch(e => {
                console.log('e getPromotionTimeList', e)
                setLoading(false)
            })
    }


    const getServiceList = () => {
        setLoading(true)
        axios.get(`${BASE_URL}/service/all/list2?store_id=${storeDetails.id}`)
            .then(res => {
                setServiceList(res.data)
                console.log("SERVICE", res.data)
                setLoading(false)
            })
            .catch(e => {
                console.log('e getServiceList', e)
                setLoading(false)
            })
    }

    const getHairdresserList = () => {
        setLoading(true)
        axios.get(`${BASE_URL}/employee/list/${storeDetails.id}`)
            .then(res => {
                setHairdresserList(res.data.list)
                setLoading(false)
            })
            .catch(e => {
                console.log('e getHairdresserList', e)
                setLoading(false)
            })
    }

    const getPickStyleList = (id) => {
        setLoading(true)
        axios.get(`${BASE_URL}/all/favourite/service/?service_id=${id}&store_id=${storeDetails.id}`)
            .then(res => {
                setPickStyleList(res.data)
                setLoading(false)
            })
            .catch(e => {
                console.log('e', e)
                setLoading(false)
            })
    }

    const getServiceTypeList = () => {
        if (serviceId == '') {
            alert('Please select service first.')
        } else {
            console.log("DATA", storeDetails.id, serviceId)
            axios.get(`${BASE_URL}/style/type/list/?store_id=${storeDetails.id}&service_id=${serviceId}`)
                .then(res => {
                    if (res.data.length == 0) {
                        alert('No service type available.')
                    } else {
                        setServiceTypeList(res.data)
                        setServiceTypeModal(!serviceTypeModal)
                        setModalVisible(false)
                        setGenderModal(false)
                        setPickStyleModal(false)
                        setHairdresserModal(false)
                        var today = moment(new Date()).format('dddd');
                        var temp = [];
                        for (var i in res.data) {
                            if (res.data[i].promotion_timeslot) {
                                var local_data = res.data[i].promotion_timeslot;
                                for (var j in local_data) {
                                    if (local_data[j].day == today && local_data[j].is_open == 1) {
                                        temp.push(local_data[j].discount)
                                    }
                                }
                                var largest = 0;
                                if (temp.length > 0) {
                                    for (k = 0; k <= largest; k++) {
                                        if (temp[i] > largest) {
                                            var largest = temp[k];
                                        }
                                    }
                                }
                                res.data[i].total_discount = largest;
                            }
                        }
                        console.log("largest", res.data)
                        setIsServiceTypeDiscount(true)
                        setServiceTypeList(res.data)
                    }
                })
                .catch(e => {
                    console.log('e', e)
                    alert('No service type available.')
                })
        }
    }

    const service = (data) => {
        setServiceId(data.id)
        getPickStyleList(data.id);
        setServiceName(data.name)
        setServiceTypeDiscount('')
        setServiceTypeName('')
        setServiceTypeId('')
        setPickStyleId('')
        setPickStyleName('')
        setModalVisible(!modalVisible)
        if (data.discount === false) {

        } else {
            getPromotionTimeList()
            setServiceDiscount(data.discount)
        }
        setBelowView(true)
    }

    const onService = () => {
        if (serviceList.length == 0) {
            alert('No service available.')
        } else {
            setModalVisible(!modalVisible)
            setGenderModal(false)
            setServiceTypeModal(false)
            setPickStyleModal(false)
            setHairdresserModal(false)
        }
    }

    const _onServiceType = (res) => {
        setServiceTypeDiscount('')
        setServiceTypeId(res.id)
        setServiceTypeName(res.name)
        // if (res.discount === false) {

        // } else {
        //     setServiceTypeDiscount(res.discount)
        // }
        setTimeInterval(res.time)
        setServiceTypeModal(!serviceTypeModal)
        setPromotionTime(res.promotion_timeslot)
    }

    const _onPickStyle = (res) => {
        setPickStyleId(res.style.id)
        setPickStyleName(res.style.name)
        setPickStyleModal(!pickStyleModal)
    }

    const _onFavouriteStyle = () => {
        if (serviceId == '') {
            alert('Please select service first.')
        } else {
            setPickStyleModal(!pickStyleModal)
            setModalVisible(false)
            setGenderModal(false)
            setServiceTypeModal(false)
            setHairdresserModal(false)
        }
    }

    const _onHairdresser = (res) => {
        setSelectedDate('')
        setSelectedTime('')
        setHairdresserId(res.id)
        setHairdresserName(res.name)
        setHairdresserModal(!hairdresserModal)
        if (res.id == '001') {
            axios.get(`${BASE_URL}/timeslot/list/${storeDetails.id}`)
                .then(res => {
                    for (var i in res.data.list) {
                        res.data.list[i].employee_start_time = res.data.list[i].open_time;
                        res.data.list[i].employee_end_time = res.data.list[i].close_time;
                    }
                    setDateList(res.data.list)
                    setLoading(false)
                })
                .catch(e => {
                    console.log('es', e)
                    setLoading(false)
                })
        } else {
            getDateSlot(res.id)
        }
    }


    const _onGender = (res) => {
        setGenderName(res)
        setGenderModal(!genderModal)
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
    }

    const _onCalendarRight = () => {
        if (nextDate == 11) {
            setNextDate('0')
            setNextYear(nextYear + 1)
            getMonthDateDay(nextYear + 1, 0)
        } else {
            setNextDate(parseInt(nextDate) + 1)
            setNextYear(nextYear)
            getMonthDateDay(nextYear, parseInt(nextDate) + 1)
        }
    }

    const _onBook = () => {
        setLoading(true)
        // if (genderName == '') {
        //     alert('Please select sex.')
        //     setLoading(false)
        //     return false
        // } else 
        if (serviceId == '') {
            alert('Please select service.')
            setLoading(false)
            return false
        } else if (serviceTypeId == '') {
            alert('Please select service type.')
            setLoading(false)
            return false
        }
        // else if (serviceTypeId == '') {
        //     alert('Please select pick style.')
        //     setLoading(false)
        //     return false
        // } 
        else if (hairdresserId == '') {
            alert('Please select stylist.')
            setLoading(false)
            return false
        } else if (selectedDate == '') {
            alert('Please select date.')
            setLoading(false)
            return false
        } else if (selectedTime == '') {
            alert('Please select time.')
            setLoading(false)
            return false
        } else {
            var date_time = `${nextYear}-${nextDate + 1}-${selectedDate} ${moment(selectedTime, "hh:mm A").format("HH:mm")}`
            var bookingDate = moment(date_time).utc().format("YYYY-MM-DD HH:mm:ss")
            if (bookingDate) {
                console.log("Booking", {
                    store_id: storeDetails.id,
                    employee_id: hairdresserId,
                    customer_id: userDetails.id,
                    service_id: serviceId,
                    style_type_id: serviceTypeId,
                    style_id: pickStyleId,
                    gender: genderName,
                    booking_date: bookingDate,
                })
                axios.post(`${BASE_URL}/booking`, {
                    store_id: storeDetails.id,
                    employee_id: hairdresserId,
                    customer_id: userDetails.id,
                    service_id: serviceId,
                    style_type_id: serviceTypeId,
                    style_id: pickStyleId,
                    gender: genderName,
                    booking_date: bookingDate,
                })
                    .then(res => {
                        setBookingData(res.data)
                        setBookingDone(!bookingDone)
                        setLoading(false)
                    })
                    .catch(e => {
                        console.log('e', e)
                        alert(e.response.data.message)
                        setLoading(false)
                    })
            }
        }
    }

    const _onGenderSelect = () => {
        setGenderModal(!genderModal)
        setModalVisible(false)
        setServiceTypeModal(false)
        setPickStyleModal(false)
        setHairdresserModal(false)
    }

    const _onHairdresserSelect = () => {
        setHairdresserModal(!hairdresserModal)
        setModalVisible(false)
        setGenderModal(false)
        setServiceTypeModal(false)
        setPickStyleModal(false)
    }

    const renderGender = () => {
        return (
            <View>
                <Pressable style={{ borderWidth: 1, borderColor: '#979797', height: 35, marginRight: 26.5, flexDirection: 'row', justifyContent: 'space-between' }} onPress={() => _onGenderSelect()}>
                    <Text style={{ fontFamily: 'Avenir-Medium', marginLeft: 10.5, marginTop: 4.5 }}>{genderName == '' ? 'Select' : genderName}</Text>
                    <Image source={require('../../../Images/Triangle.png')} style={{ marginTop: 12, marginRight: 9.36 }} />
                </Pressable>
                {
                    genderModal == true ?
                        <View style={{ borderWidth: 1, marginRight: 27 }}>
                            {
                                genderList.map((res, index) => {
                                    return (
                                        <Pressable key={index} onPress={() => _onGender(res)}>
                                            <Text style={{ fontFamily: 'Avenir-Medium', marginTop: 7, marginLeft: 10.5, marginBottom: 7 }}>{res}</Text>
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

    const renderService = () => {
        return (
            <View>
                <Pressable style={{ borderWidth: 1, borderColor: '#979797', height: 35, marginRight: 26.5, flexDirection: 'row', justifyContent: 'space-between' }} onPress={() => onService()}>
                    <Text style={{ fontFamily: 'Avenir-Medium', marginLeft: 10.5, marginTop: 4.5 }}>{serviceName == '' ? 'Select' : serviceName}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        {
                            serviceDiscount ?
                                <Text style={{ backgroundColor: '#EB2C47', color: '#FFFFFF', marginTop: 5, borderRadius: 5, textAlign: 'center', marginBottom: 7, fontSize: 12, fontFamily: 'Avenir Medium', lineHeight: 16, paddingTop: 2, paddingBottom: 1, width: 125, marginRight: 14 }}>Available Discount</Text> : null
                        }
                        <Image source={require('../../../Images/Triangle.png')} style={{ marginTop: 12, marginRight: 9.36 }} />
                    </View>
                </Pressable>
                <View>
                    <ScrollView nestedScrollEnabled={true} style={{ marginRight: 27, maxHeight: 193 }}>
                        {
                            modalVisible == true ?
                                <View style={{ borderWidth: 1 }}>
                                    {
                                        serviceList.map((res, index) => {
                                            return (
                                                <Pressable key={index} onPress={() => service(res)}>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                        <Text style={{ fontFamily: 'Avenir-Medium', marginTop: 7, marginLeft: 10.5, }}>{res.name}</Text>
                                                        {
                                                            res.discount === false ? null :
                                                                <Text style={{ backgroundColor: '#EB2C47', color: '#FFFFFF', marginTop: 5, borderRadius: 5, marginRight: 30.5, textAlign: 'center', marginBottom: 7, fontSize: 12, fontFamily: 'Avenir Medium', lineHeight: 16, paddingTop: 2, paddingBottom: 1, width: 125, height: 21.5 }}>Available Discount</Text>

                                                        }
                                                    </View>
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
                    </ScrollView>
                </View>
            </View>
        )
    }

    const renderServiceType = () => {
        return (
            <View>
                <Pressable style={{ borderWidth: 1, borderColor: '#979797', height: 35, marginRight: 26.5, flexDirection: 'row', justifyContent: 'space-between' }} onPress={() => getServiceTypeList()}>
                    <Text style={{ fontFamily: 'Avenir-Medium', marginLeft: 10.5, marginTop: 4.5 }}>{serviceTypeName == '' ? 'Select' : serviceTypeName}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        {
                            serviceTypeDiscount ?
                                <Text style={{ backgroundColor: '#EB2C47', color: '#FFFFFF', marginTop: 5, borderRadius: 5, textAlign: 'center', marginBottom: 7, fontSize: 12, fontFamily: 'Avenir Medium', lineHeight: 16, paddingTop: 2, paddingBottom: 1, width: 125, marginRight: 14 }}>{serviceTypeDiscount}% Discount</Text> : null
                        }
                        <Image source={require('../../../Images/Triangle.png')} style={{ marginTop: 12, marginRight: 9.36 }} />
                    </View>
                </Pressable>
                <View>
                    <ScrollView nestedScrollEnabled={true} style={{ marginRight: 27, maxHeight: 193 }}>
                        {
                            serviceTypeModal == true ?
                                <View style={{ borderWidth: 1 }}>
                                    {
                                        serviceTypeList.map((res, index) => {
                                            return (
                                                <Pressable key={index} onPress={() => _onServiceType(res)}>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                        <Text style={{ fontFamily: 'Avenir-Medium', marginTop: 7, marginLeft: 10.5, marginBottom: 7 }}>{res.name}</Text>
                                                        {
                                                            res.total_discount == 0 ? null
                                                                :
                                                                <Text style={{ backgroundColor: '#EB2C47', color: '#FFFFFF', marginTop: 5, borderRadius: 5, marginRight: 30.5, textAlign: 'center', marginBottom: 7, fontSize: 12, fontFamily: 'Avenir Medium', lineHeight: 16, paddingTop: 2, paddingBottom: 1, width: 125, height: 21.5 }}>{res.total_discount}% Discount</Text>
                                                        }
                                                    </View>
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
                    </ScrollView>
                </View>
            </View>
        )
    }

    const renderPickStyle = () => {
        return (
            <View>
                <Pressable style={{ borderWidth: 1, borderColor: '#979797', height: 35, marginRight: 26.5, flexDirection: 'row', justifyContent: 'space-between' }} onPress={() => _onFavouriteStyle()}>
                    <Text style={{ fontFamily: 'Avenir-Medium', marginLeft: 10.5, marginTop: 4.5 }}>{pickStyleName == '' ? 'Select' : pickStyleName}</Text>
                    <Image source={require('../../../Images/Triangle.png')} style={{ marginTop: 12, marginRight: 9.36 }} />
                </Pressable>
                <View >
                    <ScrollView nestedScrollEnabled={true} style={{ marginRight: 27, maxHeight: 193 }}>
                        {
                            pickStyleModal == true ?
                                <View style={{ borderWidth: 1 }}>
                                    {
                                        pickStyleList.length === 0 ?
                                            <Text style={{ fontFamily: 'Avenir-Medium', marginTop: 7, marginLeft: 10.5, marginBottom: 7 }}>No Pick Style Available</Text> :
                                            pickStyleList.map((res, index) => {
                                                return (
                                                    <Pressable key={index} onPress={() => _onPickStyle(res)}>
                                                        {
                                                            pickStyleList ?
                                                                <Text style={{ fontFamily: 'Avenir-Medium', marginTop: 7, marginLeft: 10.5, marginBottom: 7 }}>{res.style.name}</Text>
                                                                :
                                                                <Text style={{ fontFamily: 'Avenir-Medium', marginTop: 7, marginLeft: 10.5, marginBottom: 7 }}>No Data Available</Text>
                                                        }

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
                    </ScrollView>
                </View>
            </View>
        )
    }


    const renderHairDresser = () => {
        var any = { "id": "001", "name": "Any" }
        return (
            <View>
                <Pressable style={{ borderWidth: 1, borderColor: '#979797', height: 35, marginRight: 26.5, flexDirection: 'row', justifyContent: 'space-between' }} onPress={() => _onHairdresserSelect()}>
                    <Text style={{ fontFamily: 'Avenir-Medium', marginLeft: 10.5, marginTop: 4.5 }}>{hairdresserName == '' ? 'Select' : hairdresserName}</Text>
                    <Image source={require('../../../Images/Triangle.png')} style={{ marginTop: 12, marginRight: 9.36 }} />
                </Pressable>
                <View >
                    <ScrollView nestedScrollEnabled={true} style={{ marginRight: 27, maxHeight: 193 }}>
                        {
                            hairdresserModal == true ?
                                <View style={{ borderWidth: 1 }}>
                                    <Pressable onPress={() => _onHairdresser(any)}>
                                        <Text style={{ fontFamily: 'Avenir-Medium', marginTop: 7, marginLeft: 10.5, marginBottom: 7 }}>Any</Text>
                                        <View
                                            style={{
                                                borderBottomColor: '#979797',
                                                borderBottomWidth: 1,
                                            }}
                                        />
                                    </Pressable>
                                    {
                                        hairdresserList.length == 0 ?
                                            <Text style={{ fontFamily: 'Avenir-Medium', marginTop: 7, marginLeft: 10.5, marginBottom: 7 }}>No Stylist Available</Text> :
                                            hairdresserList.map((res, index) => {
                                                return (
                                                    <Pressable key={index} onPress={() => _onHairdresser(res)}>
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
                                </View>
                                :
                                null
                        }
                    </ScrollView>
                </View>
            </View>
        )
    }

    const onContinePay = () => {
        setBookingDone(!bookingDone)
        navigation.navigate('PaymentScreen', { booking_id: bookingData.id, salon_name: storeData.store_name, employee_name: hairdresserName, date_time: `${nextYear}-${nextDate + 1}-${selectedDate} ${moment(selectedTime, "hh:mm A").format("HH:mm")}` })
    }

    const renderBookingDone = () => {

        return (
            <Dialog
                visible={bookingDone}
                onTouchOutside={() => {
                    setBookingDone(!bookingDone);
                }}
                dialogStyle={{ width: '90%' }}>
                <DialogContent>
                    <View >
                        <View style={{}}>
                            <View style={{}}>
                                <Pressable style={{ justifyContent: 'flex-end', alignSelf: 'flex-end', marginTop: 15, marginRight: 12.5 }} onPress={() => setBookingDone(!bookingDone)}>
                                    <Image
                                        style={{}}
                                        source={require('../../../Images/cross.png')}
                                    />
                                </Pressable>
                                <Text style={{ fontSize: 18, fontFamily: 'Avenir-Heavy', lineHeight: 25, marginLeft: 111, marginTop: 0.75 }}>Booking Details</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 29.5, marginRight: 29.5, marginTop: 17 }}>
                                    <Text style={{ fontSize: 16, fontFamily: 'Avenir-medium' }}>Service Name</Text>
                                    <Text style={{ fontSize: 16 }}>{serviceName}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 29.5, marginRight: 29.5, marginTop: 17 }}>
                                    <Text style={{ fontSize: 16, fontFamily: 'Avenir-medium' }}>Service Type</Text>
                                    <Text style={{ fontSize: 16 }}>{serviceTypeName}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 29.5, marginRight: 29.5, marginTop: 17 }}>
                                    <Text style={{ fontSize: 16, fontFamily: 'Avenir-medium' }}>Service Price</Text>
                                    <Text style={{ fontSize: 16 }}>{Number(bookingData.service_price)} USD</Text>
                                </View>
                                {
                                    bookingData.discount === 0 ?
                                        null
                                        :
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 29.5, marginRight: 29.5, marginTop: 17 }}>
                                            <Text style={{ fontSize: 16, fontFamily: 'Avenir-medium' }}>Discount</Text>
                                            <Text style={{ fontSize: 16 }}>{bookingData.discount} USD</Text>
                                        </View>
                                }
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 29.5, marginRight: 29.5, marginTop: 17 }}>
                                    <Text style={{ fontSize: 16, fontFamily: 'Avenir-medium', fontFamily: 'Avenir-Heavy' }}>Total Charges</Text>
                                    <Text style={{ fontSize: 16, fontFamily: 'Avenir-Heavy' }}>{(Number(bookingData.paid_amount)).toFixed(2)} USD</Text>
                                </View>
                                <Pressable style={{ borderWidth: 1, marginLeft: 80, marginRight: 80, marginTop: 26.5, marginBottom: 30 }} onPress={() => onContinePay()}>
                                    <Text style={{ textAlign: 'center', marginTop: 12.59, marginBottom: 12.59, fontFamily: 'Avenir-Medium' }}>Continue and Pay</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </DialogContent>
            </Dialog>
        )
    }

    const _onChangeSalon = () => {
        dispatch(deleteSalon(updatedName.fav))
        navigation.navigate('HomeTabs', { screen: 'Home' })
    }

    const _onDateClick = () => {
        if (hairdresserId === '') {
            alert('Please select Stylist first.')
        } else {
            setDateModalVisible(!dateModalVisible)
            getMonthDateDay(new Date().getFullYear(), new Date().getMonth())
        }
    }

    return (
        <View style={styles.container}>
            {
                <Header leftIcon='back' onLeftIconPress={_onBack} {...props} />
            }
            {
                isLoading && <Loader />
            }
            {
                <ScrollView nestedScrollEnabled={true}>
                    {
                        updatedName.fav.data == null ?
                            null :
                            <View style={styles.mapView}>
                                <MapView style={styles.map}
                                    initialRegion={{
                                        latitude: Number(global.latitude),
                                        longitude: Number(global.longitude),
                                        latitudeDelta: 0.0922,
                                        longitudeDelta: 0.0421,
                                    }}
                                >
                                    {
                                        global.mark?.map((marker, index) => (
                                            <Marker
                                                key={index}
                                                coordinate={{ latitude: Number(marker.latitude), longitude: Number(marker.longitude) }}
                                            />
                                        ))}
                                </MapView>
                            </View>
                    }
                    {
                        updatedName.fav.data == null ?
                            null : page == 'Home' ? null
                                :
                                <Text style={styles.styleName}>{updatedName.fav.data.name}</Text>
                    }
                    {
                        updatedName.fav.data == null ?
                            null
                            :
                            <View >
                                {
                                    updatedName?.fav?.data[0]?.upload_front_photo == undefined && updatedName?.fav?.data[0]?.upload_back_photo == undefined && updatedName?.fav?.data[0]?.upload_right_photo == undefined ?
                                        null
                                        :
                                        <View style={{ flexDirection: 'row' }}>
                                            <Image
                                                style={[styles.styleImages, { marginLeft: 26 }]}
                                                source={{
                                                    uri: updatedName.fav.data[0].upload_front_photo,
                                                }}
                                            />
                                            <Image
                                                style={[styles.styleImages, { marginLeft: 12 }]}
                                                source={{
                                                    uri: updatedName.fav.data[0].upload_back_photo,
                                                }}
                                            />
                                            <Image
                                                style={[styles.styleImages, { marginLeft: 12, marginRight: 26 }]}
                                                source={{
                                                    uri: updatedName.fav.data[0].upload_right_photo,
                                                }}
                                            />
                                        </View>
                                }

                            </View>
                    }
                    <View style={[styles.topView, { marginTop: updatedName.fav.data ? 23 : 10 }]}>
                        {
                            !storeData || !storeData.images || storeData.images.length == 0 ?
                                <Image
                                    style={styles.storeImage}
                                    source={require('../../../Images/noImage.jpg')}
                                />
                                :
                                <Image source={{
                                    uri: storeData.images[0].url,
                                }} style={styles.storeImage} />
                        }
                        <View style={{ marginLeft: 15 }}>
                            <View style={styles.salonNameView}>
                                <Text style={styles.storeName}>{storeData.store_name}</Text>
                                {
                                    updatedName.fav.data == null || updatedName.fav.data[1] == undefined ?
                                        null
                                        :
                                        <Pressable style={styles.ChangeSalonButton} onPress={() => _onChangeSalon()}>
                                            <Text style={styles.ChangeSalonButtonText}>Change salon</Text>
                                        </Pressable>
                                }
                            </View>
                            <Text style={styles.miles}>{overallDistance} Miles</Text>
                            <View style={{ marginRight: 186 }}>
                                <Rating
                                    type='custom'
                                    ratingCount={5}
                                    ratingColor='#1F1E1E'
                                    ratingBackgroundColor='#c8c7c8'
                                    tintColor="#FFFFFF"
                                    readonly={true}
                                    startingValue={storeData.avg_rating}
                                    imageSize={16}
                                />
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.time}>{moment.utc(storeData.opentime, "HH:mm:ss").local().format('hh:mm A')}-{moment.utc(storeData.closetime, "HH:mm:ss").local().format('hh:mm A')}</Text>
                                <Text style={[styles.time, { color: storeData?.is_available == 1 ? '#70CF2B' : '#E73E3E' }]}>{storeData?.is_available == 1 ? 'Open' : 'Closed'} </Text>
                            </View>
                        </View>
                    </View>
                    {
                        updatedName.fav.data == null ?
                            <View>
                                <Text style={{ fontSize: 16, fontFamily: 'Avenir-Heavy', marginLeft: 26, marginTop: 10 }}>Reviews</Text>
                                <View style={{ borderBottomColor: '#979797', borderBottomWidth: 1, marginLeft: 27, marginRight: 27, marginTop: 3 }}
                                />
                                {
                                    storeData?.reviews?.length == 0 ?
                                        <View>
                                            <Text style={{ fontFamily: 'Avenir-Medium', marginLeft: 27, marginTop: 6, marginBottom: 7 }}>No Reviews</Text>
                                            <View style={{ borderBottomColor: '#979797', borderBottomWidth: 1, marginLeft: 27, marginRight: 27, }} />
                                        </View>
                                        :
                                        storeData?.reviews?.map((res, index) => {
                                            return (
                                                <View key={index}>
                                                    <Text style={{ fontFamily: 'Avenir-Medium', marginLeft: 27, marginTop: 6, marginBottom: 7 }}>“{res.review}”</Text>
                                                    <View style={{ borderBottomColor: '#979797', borderBottomWidth: 1, marginLeft: 27, marginRight: 27, }} />
                                                </View>
                                            )
                                        })
                                }
                            </View>
                            :
                            null
                    }
                    <Text style={{ fontSize: 16, fontFamily: 'Avenir-Heavy', marginLeft: 28, marginTop: 10 }}>Book</Text>
                    <View style={{ marginLeft: 27.5 }}>
                        <View>
                            <Text style={{ fontFamily: 'Avenir-Medium', marginTop: 7, marginBottom: 7.5 }}>Sex (Optional)</Text>
                            {renderGender()}
                        </View>
                        <View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontFamily: 'Avenir-Medium', marginTop: 7.5, marginBottom: 7.5 }}>Service</Text>
                                <Text style={{ marginTop: 8, marginLeft: 5, color: 'red' }}>*</Text>
                            </View>
                            {renderService()}

                        </View>
                        {
                            belowView == true ?
                                <View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ fontFamily: 'Avenir-Medium', marginTop: 7.5, marginBottom: 7.5 }}>Service Type</Text>
                                        <Text style={{ marginTop: 8, marginLeft: 5, color: 'red' }}>*</Text>
                                    </View>
                                    {renderServiceType()}
                                    {
                                        updatedName.fav.data == null ?
                                            <View>
                                                <Text style={{ fontFamily: 'Avenir-Medium', marginTop: 7.5, marginBottom: 7.5 }}>Pick Style (Optional)</Text>
                                                {renderPickStyle()}
                                            </View>
                                            :
                                            null
                                    }
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ fontFamily: 'Avenir-Medium', marginTop: 7.5, marginBottom: 7.5 }}>Stylist</Text>
                                        <Text style={{ marginTop: 8, marginLeft: 5, color: 'red' }}>*</Text>
                                    </View>
                                    {renderHairDresser()}
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ fontFamily: 'Avenir-Medium', marginTop: 7.5, marginBottom: 7.5 }}>Date & Time</Text>
                                        <Text style={{ marginTop: 8, marginLeft: 5, color: 'red' }}>*</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Pressable style={{ flexDirection: 'row', borderWidth: 1, borderColor: '#979797', height: 35, width: 133, justifyContent: 'space-between' }} onPress={() => _onDateClick()}>
                                            <Text style={{ fontFamily: 'Avenir-Medium', marginLeft: 10.5, marginTop: 5 }}>{selectedDate == '' ? 'Select' : `${selectedDate} ${nextDate == 0 ? 'Jan' : nextDate == 1 ? 'Feb' : nextDate == 2 ? "Mar" : nextDate == 3 ? "Apr" : nextDate == 4 ? "May" : nextDate == 5 ? "Jun" : nextDate == 6 ? "Jul" : nextDate == 7 ? "Aug" : nextDate == 8 ? "Sep" : nextDate == 9 ? "Oct" : nextDate == 10 ? "Nov" : "Dec"} ${nextYear}`}</Text>
                                            <Image
                                                style={{ marginLeft: 15, marginRight: 4.5, marginTop: 7.5 }}
                                                source={require('../../../Images/storeCalendar.png')}
                                            />
                                        </Pressable>
                                        <Pressable style={{ flexDirection: 'row', borderWidth: 1, borderColor: '#979797', marginLeft: 15, height: 35 }} onPress={() => { time.length == 0 || selectedDate == '' ? alert("Please select date first") : setTimeModalVisible(!timeModalVisible) }}>
                                            <Text style={{ fontFamily: 'Avenir-Medium', marginLeft: 10.5, marginTop: 5 }}>{selectedTime == '' ? 'Select' : selectedTime}</Text>
                                            <Image
                                                style={{ marginTop: 15, marginLeft: 36, marginRight: 6.36 }}
                                                source={require('../../../Images/Triangle.png')}
                                            />
                                        </Pressable>
                                    </View>
                                    <Pressable style={{ borderWidth: 1, marginLeft: 95.5, marginRight: 123, marginTop: 24, marginBottom: 24 }}>
                                        <Text style={{ fontFamily: 'Avenir-Medium', textAlign: 'center', marginTop: 9.5, marginBottom: 6.5, lineHeight: 19 }} onPress={() => _onBook()}>BOOK NOW</Text>
                                    </Pressable>
                                </View>
                                : null
                        }


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
                                        <Pressable onPress={() => setDateModalVisible(!dateModalVisible)}>
                                            <Image
                                                style={{ justifyContent: 'flex-end', alignSelf: 'flex-end', marginBottom: 10 }}
                                                source={require('../../../Images/cross.png')}
                                            />
                                        </Pressable>
                                        <View style={{ backgroundColor: 'black', justifyContent: 'space-between', flexDirection: 'row' }}>
                                            <Pressable onPress={() => _onCalendarLeft()}>
                                                <Image
                                                    style={{ marginLeft: 15, marginRight: 4.5, marginTop: 10.5 }}
                                                    source={require('../../../Images/left-arrow.png')}
                                                />
                                            </Pressable>
                                            <Text style={{ color: 'white', textAlign: 'center', fontSize: 16, fontFamily: 'Avenir-Heavy', marginTop: 9, marginBottom: 10, lineHeight: 22 }}>
                                                {nextDate == 0 ? 'January' : nextDate == 1 ? 'February' : nextDate == 2 ? "March" : nextDate == 3 ? "April" : nextDate == 4 ? "May" : nextDate == 5 ? "June" : nextDate == 6 ? "July" : nextDate == 7 ? "August" : nextDate == 8 ? "September" : nextDate == 9 ? "October" : nextDate == 10 ? "November" : "December"} {nextYear}
                                            </Text>
                                            <Pressable onPress={() => _onCalendarRight()}>
                                                <Image
                                                    style={{ marginRight: 15, marginTop: 10.5 }}
                                                    source={require('../../../Images/right-arrow.png')}
                                                />
                                            </Pressable>
                                        </View>
                                        <View style={{ borderColor: '#979797', flexDirection: 'row', borderBottomWidth: 1 }}>
                                            {
                                                Days.map((res, index) => {
                                                    return (
                                                        <Text key={index} style={{ fontFamily: 'Avenir-Heavy', borderWidth: 1, textAlign: 'center', width: 45 }}>{res}</Text>
                                                    )
                                                })
                                            }
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <View>
                                                {
                                                    days.map((res, i) => {
                                                        return (
                                                            <View key={i} style={{ flexDirection: 'row' }}>
                                                                {
                                                                    res.is_open == 0 ?
                                                                        <Pressable>
                                                                            <Text style={{ fontFamily: 'Avenir-Heavy', textAlign: 'center', width: 45, borderLeftWidth: 1, borderBottomWidth: 1, color: '#979797' }}>{res.date} </Text>
                                                                        </Pressable>
                                                                        :
                                                                        <Pressable onPress={() => { res.date === undefined || res.is_open == 0 ? console.log("not Pressable") : (setDateModalVisible(!dateModalVisible), getTime(res.date, 0)) }}>
                                                                            <Text style={{ fontFamily: 'Avenir-Heavy', textAlign: 'center', width: 45, borderLeftWidth: 1, borderBottomWidth: 1 }}>{res.date} </Text>
                                                                        </Pressable>
                                                                }
                                                                {
                                                                    res.is_open1 == 0 ?
                                                                        <Pressable>
                                                                            <Text style={{ fontFamily: 'Avenir-Heavy', textAlign: 'center', width: 45, borderLeftWidth: 1, borderBottomWidth: 1, color: '#979797' }}>{res.date1} </Text>
                                                                        </Pressable>
                                                                        :
                                                                        <Pressable onPress={() => { res.date1 === undefined || res.is_open1 == 0 ? console.log("not Pressable") : (setDateModalVisible(!dateModalVisible), getTime(res.date1, 1)) }}>
                                                                            <Text style={{ fontFamily: 'Avenir-Heavy', textAlign: 'center', width: 45, borderLeftWidth: 1, borderBottomWidth: 1 }}>{res.date1} </Text>
                                                                        </Pressable>
                                                                }
                                                                {
                                                                    res.is_open2 == 0 ?
                                                                        <Pressable>
                                                                            <Text style={{ fontFamily: 'Avenir-Heavy', textAlign: 'center', width: 45, borderLeftWidth: 1, borderBottomWidth: 1, color: '#979797' }}>{res.date2} </Text>
                                                                        </Pressable>
                                                                        :
                                                                        <Pressable onPress={() => { res.date2 === undefined || res.is_open2 == 0 ? console.log("not Pressable") : (setDateModalVisible(!dateModalVisible), getTime(res.date2, 2)) }}>
                                                                            <Text style={{ fontFamily: 'Avenir-Heavy', textAlign: 'center', width: 45, borderLeftWidth: 1, borderBottomWidth: 1 }}>{res.date2} </Text>
                                                                        </Pressable>
                                                                }
                                                                {
                                                                    res.is_open3 == 0 ?
                                                                        <Pressable>
                                                                            <Text style={{ fontFamily: 'Avenir-Heavy', textAlign: 'center', width: 45, borderLeftWidth: 1, borderBottomWidth: 1, color: '#979797' }}>{res.date3} </Text>
                                                                        </Pressable>
                                                                        :
                                                                        <Pressable onPress={() => { res.date3 === undefined || res.is_open3 == 0 ? console.log("not Pressable") : (setDateModalVisible(!dateModalVisible), getTime(res.date3, 3)) }}>
                                                                            <Text style={{ fontFamily: 'Avenir-Heavy', textAlign: 'center', width: 45, borderLeftWidth: 1, borderBottomWidth: 1 }}>{res.date3} </Text>
                                                                        </Pressable>
                                                                }
                                                                {
                                                                    res.is_open4 == 0 ?
                                                                        <Pressable>
                                                                            <Text style={{ fontFamily: 'Avenir-Heavy', textAlign: 'center', width: 45, borderLeftWidth: 1, borderBottomWidth: 1, color: '#979797' }}>{res.date4} </Text>
                                                                        </Pressable>
                                                                        :
                                                                        <Pressable onPress={() => { res.date4 === undefined || res.is_open4 == 0 ? console.log("not Pressable") : (setDateModalVisible(!dateModalVisible), getTime(res.date4, 4)) }}>
                                                                            <Text style={{ fontFamily: 'Avenir-Heavy', textAlign: 'center', width: 45, borderLeftWidth: 1, borderBottomWidth: 1 }}>{res.date4} </Text>
                                                                        </Pressable>
                                                                }
                                                                {
                                                                    res.is_open5 == 0 ?
                                                                        <Pressable>
                                                                            <Text style={{ fontFamily: 'Avenir-Heavy', textAlign: 'center', width: 45, borderLeftWidth: 1, borderBottomWidth: 1, color: '#979797' }}>{res.date5} </Text>
                                                                        </Pressable>
                                                                        :
                                                                        <Pressable onPress={() => { res.date5 === undefined || res.is_open5 == 0 ? console.log("not Pressable") : (setDateModalVisible(!dateModalVisible), getTime(res.date5, 5)) }}>
                                                                            <Text style={{ fontFamily: 'Avenir-Heavy', textAlign: 'center', width: 45, borderLeftWidth: 1, borderBottomWidth: 1 }}>{res.date5} </Text>
                                                                        </Pressable>
                                                                }
                                                                {
                                                                    res.is_open6 == 0 ?
                                                                        <Pressable>
                                                                            <Text style={{ fontFamily: 'Avenir-Heavy', textAlign: 'center', width: 45, borderLeftWidth: 1, borderBottomWidth: 1, borderRightWidth: 1, color: '#979797' }}>{res.date6} </Text>
                                                                        </Pressable>
                                                                        :
                                                                        <Pressable onPress={() => { res.date6 === undefined || res.is_open6 == 0 ? console.log("not Pressable") : (setDateModalVisible(!dateModalVisible), getTime(res.date6, 6)) }}>
                                                                            <Text style={{ fontFamily: 'Avenir-Heavy', textAlign: 'center', width: 45, borderLeftWidth: 1, borderBottomWidth: 1, borderRightWidth: 1 }}>{res.date6} </Text>
                                                                        </Pressable>
                                                                }
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
                            <View style={{ flex: 1, position: 'absolute', bottom: 15, left: 140, top: 500 }}>
                                <View style={{
                                    width: 200,
                                    margin: 20,
                                    alignItems: 'center',
                                    backgroundColor: "white",
                                    shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 2
                                    },
                                    shadowOpacity: 0.25,
                                    shadowRadius: 4,
                                    elevation: 5
                                }}>
                                    <Pressable style={{ justifyContent: 'flex-end', alignSelf: 'flex-end', marginTop: 10, right: 20 }} onPress={() => setTimeModalVisible(!timeModalVisible)}>
                                        <Image
                                            style={{}}
                                            source={require('../../../Images/cross.png')}
                                        />
                                    </Pressable>
                                    <ScrollView showsVerticalScrollIndicator={false}>
                                        {
                                            time.map((res, index) => {
                                                return (
                                                    <View key={index}>
                                                        {
                                                            res.isOffer == true ?
                                                                <Pressable style={{ flexDirection: 'row' }} onPress={() => _onTime(moment.utc(res.date, 'hh:mm A').local().format('hh:mm A'))}>
                                                                    <Text style={{ fontSize: 16, fontFamily: 'Avenir-Medium', marginTop: 13, color: '#EB2C47' }}>{moment.utc(res.date, 'hh:mm A').local().format('hh:mm A')}</Text>
                                                                    <Text style={{ marginTop: 20, marginLeft: 4, fontSize: 10, fontFamily: 'Avenir-Medium', lineHeight: 14, color: '#EB2C47' }}>{res.discount}% Discount</Text>
                                                                </Pressable>
                                                                :
                                                                <Pressable onPress={() => _onTime(moment.utc(res.date, 'hh:mm A').local().format('hh:mm A'))}>
                                                                    <Text style={{ fontSize: 16, fontFamily: 'Avenir-Medium', marginTop: 13 }}>{moment.utc(res.date, 'hh:mm A').local().format('hh:mm A')}</Text>
                                                                </Pressable>
                                                        }
                                                    </View>
                                                )
                                            })
                                        }
                                    </ScrollView>
                                </View>
                            </View>
                        </Modal>
                        {renderBookingDone()}
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
        alignItems: "center",
    },
    modalView: {
        width: 336,
        margin: 20,
        backgroundColor: "white",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    mapView: {
        height: height * 0.2,
        width: width * 1,
        alignItems: 'center',
    },
    styleName: {
        fontSize: 16,
        fontFamily: 'Avenir-Medium',
        marginLeft: 29,
        lineHeight: 22
    },
    styleImages: {
        marginTop: 15,
        height: height * 0.14,
        width: width * 0.28,
    },
    topView: {
        flexDirection: 'row',
        marginLeft: 26,
    },
    storeImage: {
        height: 83,
        width: 71
    },
    salonNameView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%'
    },
    storeName: {
        color: '#1A1919',
        fontSize: 15,
        fontFamily: 'Avenir-Medium',
        width: '50%'
    },
    ChangeSalonButton: {
        borderWidth: 1,
        fontFamily: 'Avenir-Medium',
        lineHeight: 16
    },
    ChangeSalonButtonText: {
        marginLeft: 10.5,
        marginRight: 10.5,
        marginTop: 5.5,
        marginBottom: 5.5
    },
    miles: {
        fontSize: 12,
        fontFamily: 'Avenir-Medium',
        lineHeight: 16
    },
    time: {
        fontSize: 12,
        fontFamily: 'Avenir-Medium',
        marginTop: 4
    },
})