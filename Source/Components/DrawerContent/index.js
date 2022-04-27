import React from 'react';
import { 
    View, 
    Text, 
    Image, 
    StyleSheet, 
    Pressable, 
    Alert
} from 'react-native';

import { Colors, BASE_URL, height } from '../../Config';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { resetAuth } from '../../Actions/AuthActions';

const DrawerContent = (props) => {
    const dispatch = useDispatch()

    const _onAppointment = () => {
        props.navigation.closeDrawer()
    }

    const _onPerformance = () => {
        props.navigation.navigate('PerformanceScreen')
    }

    const _onStyles = () => {
        props.navigation.navigate('Styles')
    }

    const onLogout = () => {
        Alert.alert(
            "Alert",
            "Are You Sure?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: 'cancel'
                },
                { text: "OK", onPress: () => _log() }
            ],
            { cancelable: false }
        );
    }

    const _log = () => {
        axios.delete(`${BASE_URL}/logout`)
            .then(res => {
                console.log('res', res.data)
                dispatch(resetAuth())
                console.log("USER LOGOUT")
            })
            .catch(e => {
                console.log('e', e)
            })
    }

    return (
        <View style={styles.container}>
            <View style={styles.userView}>
                <Image
                    style={styles.tinyLogo}
                    source={require('../../Images/dummy.png')}
                />
                <View style={styles.employeeNameView}>
                    <Text style={styles.employeeName}>{global.employeeName}</Text>
                    <Text style={styles.stylistText}>Stylist</Text>
                </View>
            </View>


            {/* Appointments  */}
            <Pressable style={styles.appointmentButton} onPress={() => _onAppointment()}>
                <Image
                    source={require('../../Images/calender_white.png')}
                />
                <Text style={styles.appointmentText}>Appointments</Text>
            </Pressable>
            <View
                style={styles.whiteHorizontalLine}
            />

            {/* Performance */}
            <Pressable style={styles.appointmentButton} onPress={() => _onPerformance()}>
                <Image
                    source={require('../../Images/performance.png')}
                />
                <Text style={styles.appointmentText}>My Performance & Ratings</Text>
            </Pressable>
            <View
                style={styles.whiteHorizontalLine}
            />

            {/* Styles */}
            <Pressable style={styles.appointmentButton} onPress={() => _onStyles()}>
                <Image
                    source={require('../../Images/hair-salon_white.png')}
                />
                <Text style={styles.appointmentText}>Styles</Text>
            </Pressable>
            <View
                style={styles.whiteHorizontalLine}
            />

            {/* Logout */}
            <Pressable style={styles.appointmentButton} onPress={() => onLogout()}>
                <Image
                    source={require('../../Images/logout.png')}
                />
                <Text style={styles.appointmentText}>Logout</Text>
            </Pressable>
            <View
                style={styles.whiteHorizontalLine}
            />
        </View>
    )
}

export default DrawerContent;

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: Colors.black
    },
    tinyLogo: {
        marginTop: 8,
        marginLeft: 20,
        marginBottom: 11,
        height: 40,
        width: 42
    },
    userView: {
        backgroundColor: Colors.white, 
        flexDirection: 'row'
    },
    employeeNameView: {
        marginLeft: 10, 
        marginTop: 11
    },
    employeeName: {
        fontSize: 16, 
        fontFamily: 'Avenir-Heavy', 
        lineHeight: 22, 
        color: Colors.black
    },
    stylistText: {
        fontSize: 16, 
        fontFamily: 'Avenir-Medium', 
        lineHeight: 22, 
        color: Colors.black
    },
    appointmentButton: {
        flexDirection: 'row', 
        marginTop: 12.26, 
        marginLeft: 17, 
        marginRight: 52
    },
    appointmentText: {
        color: Colors.white, 
        fontSize: 18, 
        fontFamily: 'Avenir-Medium', 
        marginLeft: 16, 
        lineHeight: 25
    },
    whiteHorizontalLine: {
        borderBottomColor: Colors.white,
        borderBottomWidth: 1,
        marginTop: 10
    }
})