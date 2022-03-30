import React from 'react';
import { StyleSheet, Text, View, Image, Pressable, ScrollView } from 'react-native';
import Header from '../../../Components/Header';
import moment from 'moment';
import { width } from '../../../Config';

const BookingSuccessfullScreen = ({ navigation, route, props }) => {
    const { transaction_id, booking_id, salon_name, employee_name, date_time } = route.params

    console.log("asd",date_time)

    const _onBack = () => navigation.goBack()

    return (
        <View style={Styles.container}>
            {
                <Header onLeftIconPress={_onBack} {...props} />
            }
            {
                <ScrollView>
                    <Image
                        style={{ marginTop: 90, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}
                        source={require('../../../Images/tick.png')}
                    />
                    <View style={{ justifyContent: 'center', alignItems: 'center', width: width * 0.5, alignSelf: 'center' }}>
                        <Text style={{ fontSize: 18, fontFamily: 'Avenir-Heavy', textAlign: 'center', lineHeight: 25, marginTop: 18 }}>Your Appointment Is Successfully Booked</Text>
                    </View>
                    <View style={{ borderWidth: 1, borderColor: '#979797', marginLeft: 27.5, marginRight: 26.5, marginTop: 32.5, borderStyle: 'solid', flexDirection: 'row' }}>
                        {/* <View style={{marginTop: 14.5, marginLeft: 14.5}}>
                            <Text style={{fontSize: 16, fontFamily: 'Avenir-Heavy', lineHeight: 22}}>Booking Number</Text>
                            <Text style={{fontSize: 16, fontFamily: 'Avenir-Medium', lineHeight: 22, marginTop: 7}}>#{booking_id}</Text>
                            <Text style={{fontSize: 16, fontFamily: 'Avenir-Heavy', lineHeight: 22, marginTop: 30}}>Date & Time</Text>
                            <Text style={{fontSize: 16, fontFamily: 'Avenir-Medium', lineHeight: 22, marginTop: 7, marginBottom: 28.5}}>{moment(date_time, "YYYY-M-D, HH:mm").format("DD MMM YYYY, hh:mm A")}</Text>
                        </View>
                        <View style={{marginTop: 14.5, marginLeft: 20, width: width * 0.3}}>
                            <Text style={{fontSize: 16, fontFamily: 'Avenir-Heavy', lineHeight: 22}}>Salon Name</Text>
                            <Text style={{fontSize: 16, fontFamily: 'Avenir-Medium', lineHeight: 22, marginTop: 7, width: width * 0.27}}>{salon_name}</Text>
                            <Text style={{fontSize: 16, fontFamily: 'Avenir-Heavy', lineHeight: 22, marginTop: 30}}>Stylist</Text>
                            <Text style={{fontSize: 16, fontFamily: 'Avenir-Medium', lineHeight: 22, marginTop: 7, marginBottom: 28.5}}>{employee_name}</Text>
                        </View> */}
                        <View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
                                <View style={{ marginTop: 14.5, marginLeft: 14.5, width: width * 0.5}}>
                                    <Text style={{ fontSize: 16, fontFamily: 'Avenir-Heavy', lineHeight: 22 }}>Booking Number</Text>
                                    <Text style={{ fontSize: 16, fontFamily: 'Avenir-Medium', lineHeight: 22, marginTop: 7 }}>#{booking_id}</Text>
                                </View>
                                <View style={{ width: width * 0.5, marginTop: 14.5}}>
                                    <Text style={{ fontSize: 16, fontFamily: 'Avenir-Heavy', lineHeight: 22 }}>Salon Name</Text>
                                    <Text style={{ fontSize: 16, fontFamily: 'Avenir-Medium', lineHeight: 22, marginTop: 7, width: width * 0.3}}>{salon_name}</Text>
                                </View>
                            </View>
                            <View style={{flexDirection: 'row', marginLeft: 14.5,}}>
                                <View style={{ width: width * 0.5}}>
                                    <Text style={{ fontSize: 16, fontFamily: 'Avenir-Heavy', lineHeight: 22, marginTop: 13 }}>Date & Time</Text>
                                    <Text style={{ fontSize: 16, fontFamily: 'Avenir-Medium', lineHeight: 22, marginTop: 7, marginBottom: 28.5 }}>{moment(date_time).format("DD MMM YYYY, hh:mm A")}</Text>
                                </View>
                                <View style={{}}>
                                    <Text style={{ fontSize: 16, fontFamily: 'Avenir-Heavy', lineHeight: 22, marginTop: 13 }}>Stylist</Text>
                                    <Text style={{ fontSize: 16, fontFamily: 'Avenir-Medium', lineHeight: 22, marginTop: 7, marginBottom: 28.5, width: width * 0.3 }}>{employee_name}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <Pressable style={{ justifyContent: 'center', alignItems: 'center', borderWidth: 1, marginLeft: 122.5, marginRight: 122.5, marginTop: 75 }} onPress={() => navigation.navigate('HomeTabs')}>
                        <Text style={{ fontFamily: 'Avenir-Medium', lineHeight: 19, marginTop: 9.5, marginBottom: 9.5 }}>OK</Text>
                    </Pressable>
                </ScrollView>
            }
        </View>
    )
}
export default BookingSuccessfullScreen;

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    }
})