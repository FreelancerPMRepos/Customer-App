import React, { useEffect, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';

import { BASE_URL, Colors } from '../../../Config';
import Header from '../../../Components/EmployeeHeader';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import Loader from '../../../Components/Loader';

const Notification = (props) => {
    const [isLoading, setLoading] = useState(false)
    const [notification, setNotification] = useState([])

    const _onMenuPress = () => {
        props.navigation.goBack()
    }

    useEffect(() => {
        getUserDetail()
    }, [])

    const getUserDetail = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@user_details')
            const data = JSON.parse(jsonValue)
            if (data != null) {
                getNotification(data.id)
            }
        } catch (e) {
            alert('Error getting user data.')
        }
    }


    const getNotification = (id) => {
        setLoading(true)
        axios.get(`${BASE_URL}/notification/list/${id}`)
            .then(res => {
                console.log("notification response", res.data)
                setNotification(res.data)
                setNoticationDefault()
                setLoading(false)
            })
            .catch(e => {
                console.log('e', e)
                setLoading(false)
            })
    }

    const setNoticationDefault = () => {
        axios.get(`${BASE_URL}/notification/count/UPDATECOUNT`)
        .then(res => {
        })
        .catch(e => {
            console.log('e', e)
        })
    }

    return (
        <View style={styles.container}>
            {
                <Header leftIcon="back" onLeftIconPress={() => _onMenuPress()} title={"Notification"} {...props} />
            }
            {
                isLoading && <Loader />
            }
            {
                <ScrollView style={{ marginBottom: 20 }}>
                    {
                        notification.map((res) => {
                            return (
                                <View style={{ borderWidth: 0.5, borderColor: res.is_read == 1 ? '#FF2626' : '#FFD026', marginTop: 11.5, marginLeft: 15.75, marginRight: 15.75 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={{ fontSize: 16, fontFamily: 'Avenir-Medium', lineHeight: 22, color: Colors.black, marginTop: 5.25, marginLeft: 13.25 }}>{res.from_user.name}</Text>
                                        <Text style={{ fontSize: 12, fontFamily: 'Avenir-Medium', lineHeight: 16, marginTop: 8.25, marginRight: 4.25, color: Colors.black }}>{moment(res.created_at).format('HH:mm A, DD MMM YYYY')}</Text>
                                    </View>
                                    <Text style={{ fontFamily: 'Avenir-Book', lineHeight: 18, color: Colors.black, marginLeft: 14.25, marginTop: 4, marginRight: 40.25, marginBottom: 12.25 }}>Andrew M. cancelled hir appointment for beard cut.</Text>
                                </View>
                            )
                        })
                    }
                </ScrollView>
            }
        </View>
    )
}
export default Notification;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white
    }
})