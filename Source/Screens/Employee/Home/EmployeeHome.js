import React, { useEffect, useState } from 'react';
import {
    Text,
    View,
    Image,
    Pressable,
    Dimensions
} from 'react-native';

import Header from '../../../Components/EmployeeHeader';
import { BASE_URL, Colors, width } from '../../../Config';
import SelectDropdown from 'react-native-select-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { setAuthToken } from '../../../Utils/setHeader';
import { useSelector } from 'react-redux';
import moment from 'moment';
import EStyleSheet from 'react-native-extended-stylesheet';

const countries = ["TODAY", "UPCOMING"]

let entireScreenWidth = Dimensions.get('window').width;

EStyleSheet.build({ $rem: entireScreenWidth / 380 });

const EmployeeHome = (props) => {
    const auth = useSelector(state => state.auth)
    const [dropdownValue, setDropdownValue] = useState('');
    const [appointmentData, setAppointmentData] = useState([]);
    const [userData, setUserData] = useState([]);

    useEffect(() => {
        let isCancelled = false;
        if (!isCancelled) {
            if (auth.access_token) {
                setAuthToken(auth.access_token)
                getUserInfo()
                getAppointments('TODAY')
            }
        }
    }, [])

    const getUserInfo = async () => {
        axios.get(`${BASE_URL}/users/me`)
            .then(res => {
                try {
                    const jsonValue = JSON.stringify(res.data)
                    AsyncStorage.setItem('@user_details', jsonValue)
                    setUserData(res.data)
                    console.log('res user info', res.data)
                } catch (e) {
                    console.log('e', e)
                }
            })
            .catch(e => {
                console.log('e', e)
            })
    }

    const getAppointments = (value) => {
        axios.get(`${BASE_URL}/booking/employee?type=${value}`)
            .then(res => {
                console.log("appointment response", res.data)
                setAppointmentData(res.data)
            })
            .catch(e => {
                console.log('e', e)
            })
    }

    const _onMenuPress = () => {
        props.navigation.openDrawer()
    }

    const _onNotify = () => {
        props.navigation.navigate('Notification')
    }

    return (
        <View style={styles.container}>
            {
                <Header leftIcon="menu" onLeftIconPress={() => _onMenuPress()} title={"Appointments"} rightIcon="notification" onRightIconPress={() => _onNotify()} {...props} />
            }
            {
                <View>
                    <Text style={styles.title}>{`Welcome ${userData.name}!`}</Text>
                    <Text style={styles.subTitle}>Your Appointment </Text>
                    <View style={styles.dropdownView}>
                        <SelectDropdown
                            data={countries}
                            buttonStyle={styles.dropdownStyle}
                            defaultValue={"TODAY"}
                            onSelect={(selectedItem, index) => {
                                console.log(selectedItem, index)
                                setDropdownValue(selectedItem)
                                getAppointments(selectedItem);
                            }}
                        />
                    </View>
                    {/* {
                        appointmentData?.map((res, index) => {
                            return (
                                <Pressable key={index} style={styles.boxStyle} onPress={() => props.navigation.navigate('AppointmentDetails', { data: userData, id: res.id})}>
                                    <Image
                                        style={styles.profileImageStyle}
                                        source={require('../../Images/profile.png')}
                                    />
                                    <View style={styles.nameServiceBox}>
                                        <Text style={styles.nameStyle}>{res.user.name}</Text>
                                        <Text style={styles.haircutStyle}>{res.style.service.name}</Text>
                                    </View>
                                    <Text style={styles.timeStyle}>{moment(res.booking_date).format("hh:mm A")}</Text>
                                </Pressable>
                            )
                        })
                    } */}
                </View>
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
        width: "48rem"
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
        paddingLeft: "120rem",
        lineHeight: "19rem"
    },
    nameServiceBox: {
        marginLeft: "17rem",
        marginTop: "16.17rem"
    },
    dropdownView: {
        marginLeft: "15.5rem"
    }
})