import React, { useEffect, useState, useRef } from 'react';
import {
    Text,
    View,
    Image,
    Pressable,
    Dimensions,
    ScrollView,
    StatusBar
} from 'react-native';

import { BASE_URL, Colors, height, width } from '../../../Config';
import SelectDropdown from 'react-native-select-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { setAuthToken } from '../../../Utils/setHeader';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import EStyleSheet from 'react-native-extended-stylesheet';
import Loader from '../../../Components/Loader';
import messaging from '@react-native-firebase/messaging';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const countries = ["TODAY", "UPCOMING"]

const Tab = createMaterialTopTabNavigator();

let entireScreenWidth = Dimensions.get('window').width;

EStyleSheet.build({ $rem: entireScreenWidth / 380 });

const EmployeeHome = ({ navigation, props }) => {
    const [isLoading, setLoading] = useState(false)
    const auth = useSelector(state => state.auth)
    const [dropdownValue, setDropdownValue] = useState('');
    const [appointmentData, setAppointmentData] = useState([]);
    const [userData, setUserData] = useState([]);
    const [notificationCount, setNotificationCount] = useState('')
    const dispatch = useDispatch()
    const dropdownRef = useRef({});

    useEffect(() => {
        let isCancelled = false;
        if (!isCancelled) {
            if (auth.access_token) {
                setAuthToken(auth.access_token)
                getUserInfo()
                getAppointments(dropdownValue)
                getNotificationCount()
                requestUserPermission();
            }
        }
    }, [])

    console.log("sd",dropdownValue)

    const requestUserPermission = async () => {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
            getFcmToken()
            console.log('Authorization status:', authStatus);
        }
    }

    const getFcmToken = async () => {
        console.log("ok")
        const fcmToken = await messaging().getToken();
        if (fcmToken) {
            //console.log(fcmToken);
            console.log("Your Firebase Token is:", fcmToken);
            global.fcm_token = fcmToken;
            axios.post(`${BASE_URL}/resigterdevicetoken`, {
                token: fcmToken,
                type: "ANDROID"
            })
                .then(res => {
                    console.log("response", res.data)
                })
                .catch(e => {
                    console.log('e', e)
                })
        } else {
            console.log("Failed", "No token received");
        }
    }

    const getUserInfo = async () => {
        axios.get(`${BASE_URL}/users/me`)
            .then(res => {
                try {
                    const jsonValue = JSON.stringify(res.data)
                    AsyncStorage.setItem('@user_details', jsonValue)
                    setUserData(res.data)
                    global.employeeName = res.data.name
                } catch (e) {
                    console.log('e', e)
                }
            })
            .catch(e => {
                console.log('e', e)
            })
    }

    const getAppointments = (value) => {
        console.log("value",value)
        setLoading(true)
        axios.get(`${BASE_URL}/booking/employee?type=${value}`)
            .then(res => {
                setAppointmentData(res.data)
                setLoading(false)
            })
            .catch(e => {
                console.log('e', e)
                setLoading(false)
            })
    }
    const getNotificationCount = () => {
        axios.get(`${BASE_URL}/notification/count/COUNT`)
            .then(res => {
                setNotificationCount(res.data.count)
            })
            .catch(e => {
                console.log('e', e)
            })
    }

    const _onMenuPress = () => {
        navigation.openDrawer()
    }

    const _onNotify = () => {
        navigation.navigate('Notification')
    }

    const UpcomingScreen = () => {
        return (
            <View style={{ backgroundColor: 'white', height: height }}>
                {
                    <ScrollView style={{ marginBottom: 10 }}>
                        <Text style={styles.title}>{`Welcome ${userData.name}!`}</Text>
                        <Text style={styles.subTitle}>Your Appointment </Text>
                        <View style={styles.dropdownView}>
                            <SelectDropdown
                                ref={dropdownRef}
                                data={countries}
                                buttonStyle={styles.dropdownStyle}
                                defaultValue={dropdownValue}
                                onSelect={(selectedItem, index) => {
                                    console.log(selectedItem, index)
                                    setDropdownValue(selectedItem)
                                    getAppointments(selectedItem);
                                }}
                            />
                        </View>
                        {
                            appointmentData.length == 0 ?
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ marginTop: 50 }}>No Data Found</Text>
                                </View>
                                :
                                appointmentData?.map((res, index) => {
                                    return (
                                        <Pressable key={index} style={styles.boxStyle} onPress={() => navigation.navigate('AppointmentDetails', { data: userData, id: res.id })}>
                                            {
                                                res.user.image_url === null ?
                                                    <Image
                                                        style={styles.profileImageStyle}
                                                        source={require('../../../Images/dummy.png')}

                                                    />
                                                    :
                                                    <Image
                                                        style={styles.userImage}
                                                        source={{ uri: res.user.image_url }}

                                                    />
                                            }
                                            <View style={styles.nameServiceBox}>
                                                <Text style={styles.nameStyle} numberOfLines={1}>{res.user.name}</Text>
                                                <Text style={styles.haircutStyle}>{res?.service?.name}</Text>
                                            </View>
                                            <Text style={styles.timeStyle}>{moment.utc(res.booking_date).local().format("hh:mm A")}</Text>
                                        </Pressable>
                                    )
                                })
                        }
                    </ScrollView>
                }
            </View>
        )
    }

    const PastScreen = () => {
        return (
            <View style={{ backgroundColor: 'white', height: height }}>
                <ScrollView>
                    {
                        appointmentData.length == 0 ?
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ marginTop: 50 }}>No Data Found</Text>
                            </View>
                            :
                            appointmentData?.map((res, index) => {
                                return (
                                    <Pressable key={index} style={styles.boxStyle} onPress={() => navigation.navigate('AppointmentDetails', { data: userData, id: res.id })}>
                                        {
                                            res.user.image_url === null ?
                                                <Image
                                                    style={styles.profileImageStyle}
                                                    source={require('../../../Images/dummy.png')}

                                                />
                                                :
                                                <Image
                                                    style={styles.userImage}
                                                    source={{ uri: res.user.image_url }}

                                                />
                                        }
                                        <View style={styles.nameServiceBox}>
                                            <Text style={styles.nameStyle} numberOfLines={1}>{res.user.name}</Text>
                                            <Text style={styles.haircutStyle}>{res?.service?.name}</Text>
                                        </View>
                                        <Text style={styles.timeStyle}>{moment.utc(res.booking_date).local().format("hh:mm A")}</Text>
                                    </Pressable>
                                )
                            })
                    }
                </ScrollView>
            </View>
        )
    }


    return (
        <View style={styles.container}>
            {
                isLoading && <Loader />
            }
            {
                <View style={styles.header}>
                    <StatusBar barStyle="dark-content" backgroundColor={Colors.black} />
                    <View style={{ justifyContent: 'space-between', flexDirection: 'row', width: '100%' }}>
                        <Pressable onPress={() => _onMenuPress()}>
                            <Image source={require('../../../Images/menu.png')} style={{ marginLeft: 13 }} />
                        </Pressable>
                        <Text numberOfLines={1} style={styles.title}>Appointments</Text>
                        <Pressable style={{ flexDirection: 'row' }} onPress={() => _onNotify()}>
                            <Text style={{ backgroundColor: 'red', borderRadius: 18 / 2, width: 18, height: 18, textAlign: 'center', left: 2, bottom: 5, color: 'white', fontSize: 12 }}>{notificationCount}</Text>
                            <Image source={require('../../../Images/notification.png')} style={{ marginRight: 13 }} />
                        </Pressable>
                    </View>
                </View>
            }
            {
                <Tab.Navigator tabPress={() => console.log("object")}
                    tabBarOptions={{
                        indicatorStyle: {
                            backgroundColor: 'black',
                        },
                    }}
                    swipeEnabled={false} >
                    <Tab.Screen name="Upcoming" component={UpcomingScreen} listeners={{
                        tabPress: e => {
                            dropdownRef.current.reset()
                            getAppointments(dropdownValue)
                        },
                    }} />
                    <Tab.Screen name="Past" component={PastScreen} listeners={{
                        tabPress: e => {
                            dropdownRef.current.reset()
                            getAppointments('PAST')
                        },
                    }} />
                </Tab.Navigator>
            }
        </View>
    )
}
export default EmployeeHome;

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white
    },
    title: {
        fontSize: "18rem",
        fontFamily: 'Avenir-Heavy',
        color: Colors.black,
        marginLeft: "16rem",
        paddingTop: "14rem",
        lineHeight: "25rem"
    },
    subTitle: {
        fontSize: "18rem",
        fontFamily: 'Avenir-Medium',
        marginLeft: "16rem",
        marginTop: "2rem",
        color: Colors.black,
        lineHeight: "25rem"
    },
    dropdownStyle: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#171717',
        height: 35,
        marginTop: 30,
        width: 166,
    },
    boxStyle: {
        flexDirection: 'row',
        borderWidth: "1rem",
        marginLeft: "15.5rem",
        marginRight: "15.5rem",
        marginTop: "25rem",
    },
    profileImageStyle: {
        marginTop: "8.5rem",
        marginLeft: "5.5rem",
        marginBottom: "8.5rem",
        height: "48rem",
        width: "53rem"
    },
    userImage: {
        marginTop: "8.5rem",
        marginLeft: "5.5rem",
        marginBottom: "8.5rem",
        height: 55,
        width: 58,
        borderRadius: 58 / 2
    },
    nameStyle: {
        fontSize: "16rem",
        fontFamily: 'Avenir-Heavy',
        color: Colors.black,
        lineHeight: "22rem",
    },
    haircutStyle: {
        fontSize: "14rem",
        fontFamily: 'Avenir-Medium',
        lineHeight: "19rem",
        color: Colors.black
    },
    timeStyle: {
        marginTop: "26.59rem",
        fontSize: "14rem",
        fontFamily: 'Avenir-Medium',
        color: Colors.black,
        lineHeight: "19rem",
        paddingLeft: 10,
        lineHeight: "19rem"
    },
    nameServiceBox: {
        marginLeft: "17rem",
        marginTop: "16.17rem",
        width: width * 0.49,
    },
    dropdownView: {
        marginLeft: "15.5rem"
    },
    header: {
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 70,
        backgroundColor: Colors.black,
        flexDirection: 'row',
        height: 68,
    },
    title: {
        fontSize: 18,
        color: Colors.white,
        fontWeight: 'bold',
        marginRight: 30
    },
})