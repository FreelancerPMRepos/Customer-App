import React from 'react';
import { View, Text, Image, StyleSheet, Pressable, Alert } from 'react-native';
import { Colors, BASE_URL } from '../../Config';
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
        props.navigation.closeDrawer()
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
        <View style={{ flex: 1, backgroundColor: Colors.black }}>
            <View style={{ backgroundColor: Colors.white, flexDirection: 'row' }}>
                <Image
                    style={styles.tinyLogo}
                    source={require('../../Images/profile.png')}
                />
                <View style={{ marginLeft: 10, marginTop: 11 }}>
                    <Text style={{ fontSize: 16, fontFamily: 'Avenir-Heavy', lineHeight: 22, color: Colors.black }}>Kristen Jacob</Text>
                    <Text style={{ fontSize: 16, fontFamily: 'Avenir-Medium', lineHeight: 22, color: Colors.black }}>Stylist</Text>
                </View>
            </View>


            {/* Appointments  */}
            <Pressable style={{ flexDirection: 'row', marginTop: 20, marginLeft: 15 }} onPress={() => _onAppointment()}>
                <Image
                    style={{}}
                    source={require('../../Images/calender_white.png')}
                />
                <Text style={{ color: Colors.white, fontSize: 18, fontFamily: 'Avenir-Medium', marginLeft: 16, lineHeight: 25 }}>Appointments</Text>
            </Pressable>
            <View
                style={{
                    borderBottomColor: Colors.white,
                    borderBottomWidth: 1,
                    marginTop: 10
                }}
            />

            {/* Performance */}
            <Pressable style={{ flexDirection: 'row', marginTop: 12.26, marginLeft: 17, marginRight: 52 }} onPress={() => _onPerformance()}>
                <Image
                    style={{}}
                    source={require('../../Images/performance.png')}
                />
                <Text style={{ color: Colors.white, fontSize: 18, fontFamily: 'Avenir-Medium', marginLeft: 16, lineHeight: 25 }}>My Performance & Ratings</Text>
            </Pressable>
            <View
                style={{
                    borderBottomColor: Colors.white,
                    borderBottomWidth: 1,
                    marginTop: 2
                }}
            />

            {/* Styles */}
            <Pressable style={{ flexDirection: 'row', marginTop: 14, marginLeft: 17, marginRight: 52 }} onPress={() => _onStyles()}>
                <Image
                    style={{}}
                    source={require('../../Images/hair-salon_white.png')}
                />
                <Text style={{ color: Colors.white, fontSize: 18, fontFamily: 'Avenir-Medium', marginLeft: 16, lineHeight: 25 }}>Styles</Text>
            </Pressable>
            <View
                style={{
                    borderBottomColor: Colors.white,
                    borderBottomWidth: 1,
                    marginTop: 14
                }}
            />

            {/* Logout */}
            <Pressable style={{ flexDirection: 'row', marginTop: 13, marginLeft: 17, marginRight: 52 }} onPress={() => onLogout()}>
                <Image
                    style={{}}
                    source={require('../../Images/logout.png')}
                />
                <Text style={{ color: Colors.white, fontSize: 18, fontFamily: 'Avenir-Medium', marginLeft: 16, lineHeight: 25 }}>Logout</Text>
            </Pressable>
            <View
                style={{
                    borderBottomColor: Colors.white,
                    borderBottomWidth: 1,
                    marginTop: 14
                }}
            />
        </View>
    )
}

export default DrawerContent;

const styles = StyleSheet.create({
    tinyLogo: {
        marginTop: 8,
        marginLeft: 20,
        marginBottom: 11
    }
})