import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Pressable,
    ScrollView
} from 'react-native';

import { BASE_URL, Colors } from '../../../Config';
import Header from '../../../Components/EmployeeHeader';
import axios from 'axios';
import moment from 'moment';

const AppointmentDetails = ({ navigation, route, props }) => {
    const [appointmentData, setAppointmentData] = useState([]);
    const { data } = route.params
    const { id } = route.params
    const _onBack = () => {
        navigation.goBack()
    }

    useEffect(() => {
        getAppointmentsDetail();
    }, [])

    const getAppointmentsDetail = () => {
        axios.get(`${BASE_URL}/booking/detail/${id}`)
            .then(res => {
                console.log("appointment response", res.data)
                setAppointmentData(res.data[0])
            })
            .catch(e => {
                console.log('er', e)
            })
    }


    return (
        <View style={styles.container}>
            {
                <Header leftIcon="back" onLeftIconPress={() => _onBack()} title={"Appointments Details"} {...props} />
            }
            {
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.mainView}>
                        <View style={styles.row}>
                            {
                                appointmentData?.user?.image_url == null ?
                                    <Image
                                        style={styles.profileImageStyle}
                                        source={require('../../../Images/dummy.png')}

                                    />
                                    :
                                    <Image
                                        style={styles.profileImageStyle}
                                        source={{
                                            uri: `${appointmentData?.user?.image_url}`,
                                        }}
                                    />
                            }
                            <View>
                                <Text style={styles.name}>{appointmentData?.user?.name}</Text>
                                <Text style={styles.serviceName}>{appointmentData?.style?.service?.name}</Text>
                            </View>
                        </View>
                        <View style={styles.horizontalLine} />
                        <View style={styles.sexView}>
                            <Text style={styles.title}>Sex -</Text>
                            <Text style={styles.description}> {appointmentData?.user?.gender}</Text>
                        </View>
                        <View style={styles.sexView}>
                            <Text style={styles.title}>Hair Type -</Text>
                            <Text style={styles.description}> {appointmentData?.user?.hair_length}</Text>
                        </View>
                        <View style={styles.sexView}>
                            <Text style={styles.title}>Natural Color -</Text>
                            <Text style={styles.description}> {appointmentData?.user?.hair_colour_is_natural}</Text>
                        </View>
                        <View style={styles.sexView}>
                            <Text style={styles.title}>Service Type -</Text>
                            <Text style={styles.description}> {appointmentData?.styletype?.name}</Text>
                        </View>
                        <View style={[styles.sexView, { marginBottom: 14 }]}>
                            <Text style={styles.title}>Style -</Text>
                            <Text style={styles.description}> {appointmentData?.style?.name}</Text>
                        </View>
                        <View style={styles.horizontalLine} />
                        <Text style={styles.descriptionHeading}>Description</Text>
                        <Text style={styles.descriptionSubheading}>{appointmentData?.style?.description}</Text>
                        <View style={styles.horizontalLine} />
                        <Text style={styles.dateTimeHeading}>Date & Time</Text>
                        <Text style={styles.dateTimeSubHeading}>{moment(appointmentData.booking_date).add(0, 'days').calendar(null, { sameElse: 'DD MMM YYYY hh:mm A' })}</Text>
                        <View style={styles.horizontalLine} />
                        <Text style={styles.customerNoteTitle}>Customer Notes</Text>
                        <Text style={styles.customerNoteDescription}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the </Text>
                        <View style={styles.horizontalLine} />
                        <Text style={styles.haircutPhotoText}>Haircut Photos</Text>
                        <View style={styles.row}>
                            <Image
                                style={styles.imageStyle}
                                source={{
                                    uri: `${appointmentData?.style?.upload_front_photo}`,
                                }}
                            />
                            <Image
                                style={styles.imageStyle}
                                source={{
                                    uri: `${appointmentData?.style?.upload_right_photo}`,
                                }}
                            />
                            <Image
                                style={styles.imageStyle}
                                source={{
                                    uri: `${appointmentData?.style?.upload_left_photo}`,
                                }}
                            />
                        </View>
                        <Pressable style={styles.buttonStyle} onPress={() => navigation.navigate('AddStyle', { service_name: appointmentData?.style?.service?.name, service_id: appointmentData?.style?.service?.id, page: 'Detail', userId: appointmentData?.user?.id })}>
                            <Text style={styles.buttonText}>Add Custom Hairstyle</Text>
                        </Pressable>
                    </View>
                </ScrollView>
            }
        </View>
    )
}
export default AppointmentDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white
    },
    row: {
        flexDirection: 'row'
    },
    mainView: {
        borderWidth: 1,
        marginTop: 20.5,
        marginLeft: 16.5,
        marginRight: 16.5,
        marginBottom: 17.5
    },
    profileImageStyle: {
        marginTop: 8.5,
        marginLeft: 5.5,
        marginBottom: 8.5,
        width: 54,
        height: 54,
        borderRadius: 54 / 2
    },
    name: {
        fontSize: 16,
        fontFamily: 'Avenir-Heavy',
        lineHeight: 22,
        color: Colors.black,
        marginTop: 13.67,
        marginLeft: 20
    },
    buttonText: {
        color: '#FFFFFF',
        textAlign: 'center',
        marginTop: 11,
        marginBottom: 11,
        fontSize: 16,
        fontFamily: 'Avenir-Medium',
        lineHeight: 22
    },
    buttonStyle: {
        backgroundColor: '#141313',
        marginLeft: 6.5,
        marginTop: 23,
        marginRight: 7.5,
        marginBottom: 25.5
    },
    imageStyle: {
        marginTop: 16,
        marginLeft: 11.95,
        marginBottom: 8.5,
        height: 114,
        width: 110
    },
    haircutPhotoText: {
        color: '#141313',
        fontFamily: 'Avenir-Heavy',
        marginLeft: 12.5,
        marginTop: 11.09,
        lineHeight: 19
    },
    customerNoteTitle: {
        fontFamily: 'Avenir-Heavy',
        color: '#141313',
        marginLeft: 12.5,
        marginTop: 11.09,
        lineHeight: 19
    },
    customerNoteDescription: {
        fontSize: 12,
        fontFamily: 'Avenir-Medium',
        marginLeft: 12.5,
        marginTop: 10.05,
        lineHeight: 14,
        color: '#141313',
        marginBottom: 11,
        marginRight: 10
    },
    horizontalLine: {
        borderBottomColor: '#979797',
        borderBottomWidth: 1,
        marginLeft: 4.5,
        marginRight: 21.5,
    },
    serviceName: {
        fontFamily: 'Avenir-Medium',
        lineHeight: 19,
        color: Colors.black,
        marginLeft: 20
    },
    sexView: {
        flexDirection: 'row',
        marginLeft: 12.5,
        marginTop: 9
    },
    title: {
        color: '#1A1919',
        fontFamily: 'Avenir-Heavy',
        lineHeight: 19
    },
    description: {
        color: '#1A1919',
        lineHeight: 19,
        fontFamily: 'Avenir-Medium'
    },
    descriptionHeading: {
        color: '#141313',
        fontFamily: 'Avenir-Heavy',
        marginLeft: 12.5,
        marginTop: 14,
        lineHeight: 19
    },
    descriptionSubheading: {
        fontSize: 12,
        marginLeft: 12.5,
        marginTop: 6,
        fontFamily: 'Avenir-Medium',
        lineHeight: 14,
        color: '#141313',
        marginBottom: 11
    },
    dateTimeHeading: {
        fontFamily: 'Avenir-Heavy',
        marginLeft: 12.5,
        marginTop: 7,
        color: '#141313',
        lineHeight: 19
    },
    dateTimeSubHeading: {
        fontSize: 12,
        fontFamily: 'Avenir-Medium',
        color: '#141313',
        marginLeft: 12.5,
        marginTop: 6,
        lineHeight: 14,
        marginBottom: 11
    }
})