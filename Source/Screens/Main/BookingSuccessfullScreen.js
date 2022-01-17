import React from 'react';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import Header from '../../Components/Header';
import moment from 'moment';

const BookingSuccessfullScreen = ({ navigation, route, props }) => {
    const { transaction_id, booking_id, salon_name, employee_name, date_time } = route.params

    const _onBack = () => navigation.goBack()

    return (
        <View style={Styles.container}>
            {
                <Header onLeftIconPress={_onBack} {...props} />
            }
            {
                <View>
                    <Image
                        style={{marginTop: 90, justifyContent: 'center', alignItems: 'center', alignSelf: 'center'}}
                        source={require('../../Images/tick.png')}
                    />
                    <Text style={{ fontSize: 18, fontFamily: 'Avenir-Heavy', textAlign: 'center', lineHeight: 25, marginLeft: 102, marginRight: 102, marginTop: 18 }}>Your Appointment Is Successfully Booked</Text>
                    <View style={{ borderWidth: 1, borderColor: '#979797', marginLeft: 27.5, marginRight: 26.5, marginTop: 32.5, borderStyle: 'solid', flexDirection: 'row' }}>
                        <View style={{marginTop: 14.5, marginLeft: 14.5}}>
                            <Text style={{fontSize: 16, fontFamily: 'Avenir-Heavy', lineHeight: 22}}>Booking Number</Text>
                            <Text style={{fontSize: 16, fontFamily: 'Avenir-Medium', lineHeight: 22, marginTop: 7}}>#{booking_id}</Text>
                            <Text style={{fontSize: 16, fontFamily: 'Avenir-Heavy', lineHeight: 22, marginTop: 30}}>Date & Time</Text>
                            <Text style={{fontSize: 16, fontFamily: 'Avenir-Medium', lineHeight: 22, marginTop: 7, marginBottom: 28.5}}>{moment(date_time, "hh:mm A").format("DD MMM YYYY, HH:mm")}</Text>
                        </View>
                        <View style={{marginTop: 14.5, marginLeft: 43}}>
                            <Text style={{fontSize: 16, fontFamily: 'Avenir-Heavy', lineHeight: 22}}>Salon Name</Text>
                            <Text style={{fontSize: 16, fontFamily: 'Avenir-Medium', lineHeight: 22, marginTop: 7, width: 130}}>{salon_name}</Text>
                            <Text style={{fontSize: 16, fontFamily: 'Avenir-Heavy', lineHeight: 22, marginTop: 30}}>Stylist</Text>
                            <Text style={{fontSize: 16, fontFamily: 'Avenir-Medium', lineHeight: 22, marginTop: 7, marginBottom: 28.5}}>{employee_name}</Text>
                        </View>
                    </View>
                    <Pressable style={{justifyContent: 'center', alignItems: 'center', borderWidth: 1, marginLeft: 122.5, marginRight: 122.5, marginTop: 75}} onPress={() => navigation.navigate('HomeTabs')}>
                        <Text style={{fontFamily: 'Avenir-Medium', lineHeight: 19, marginTop: 9.5, marginBottom: 9.5}}>OK</Text>
                    </Pressable>
                </View>
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