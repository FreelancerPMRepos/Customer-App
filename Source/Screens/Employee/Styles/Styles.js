import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Image, Pressable, TouchableOpacity } from 'react-native';
import { BASE_URL, Colors, height, width } from '../../../Config';
import Header from '../../../Components/EmployeeHeader';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Styles = (props) => {
    const [serviceData, setServiceData] = useState([]);
    const [styleData, setStyleData] = useState([]);
    const [selectedService, setSelectedService] = useState('');
    const [selectedServiceId, setSelectedServiceId] = useState('');


    const _onBack = () => props.navigation.goBack()

    useEffect(() => {
        getServiceList()
    }, [])


    const getServiceList = () => {
        axios.get(`${BASE_URL}/service/all/list`)
            .then(res => {
                console.log("response service", res.data)
                setServiceData(res.data)
                setSelectedService(res.data[0].name)
                console.log("sd",res.data[0].name)
                _onSelectService(res.data[0].name)
            })
            .catch(e => {
                console.log('e', e)
            })
    }

    const _onSelectService = async (val) => {
        const value = await AsyncStorage.getItem('@user_details')
        const user_data = value != null ? JSON.parse(value) : null;
        console.log("sd", user_data.store_id)
        setSelectedService(val.name)
        setSelectedServiceId(val.id)
        axios.get(`${BASE_URL}/style/list/${user_data.store_id}`)
            .then(res => {
                setStyleData(res.data)
            })
            .catch(e => {
                console.log('e', e)
            })
    }
    return (
        <View style={styles.conatiner}>
            {
                <Header leftIcon="menu" onLeftIconPress={() => _onBack()} title={"Styles"} {...props} />
            }
            {
                <View>
                    <View style={{ backgroundColor: '#D8D8D8', marginLeft: 16, marginTop: 9, borderRadius: 5, flexDirection: 'row', marginRight: 10 }}>
                        {
                            serviceData.map((res, index) => {
                                return (
                                    <View key={index}>
                                        {
                                            res.name == selectedService ?
                                                <Pressable style={{ backgroundColor: '#141313', borderRadius: 5, marginLeft: 10, marginTop: 11, marginBottom: 10 }} onPress={() => setSelectedService(res)}>
                                                    <Text style={{ color: '#FFFFFF', marginLeft: 14, marginRight: 13, marginTop: 8, marginBottom: 7, fontFamily: 'Avenir-Heavy', lineHeight: 19 }}>{res.name}</Text>
                                                </Pressable>
                                                :
                                                <Pressable onPress={() => _onSelectService(res)}>
                                                    <Text style={{ fontFamily: 'Avenir-Heavy', lineHeight: 19, marginTop: 19, marginLeft: 25 }}>{res.name}</Text>
                                                </Pressable>
                                        }
                                    </View>
                                )
                            })
                        }
                    </View>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 9 }}>
                        {
                            styleData.map((res) => {
                                return (
                                    <Pressable onPress={() => props.navigation.navigate('StylesDescription')}>
                                        {
                                            res.service.name == selectedService ?
                                                <View>
                                                    <Image
                                                        style={{ height: 194, width: 104, marginLeft: 16 }}
                                                        source={{
                                                            uri: `${res.upload_front_photo != null ? res.upload_front_photo : res.upload_back_photo != null ? res.upload_back_photo : res.upload_top_photo != null ? res.upload_top_photo : res.upload_right_photo != null ? res.upload_right_photo : res.upload_left_photo != null ? res.upload_left_photo : res.upload_left_photo}`,
                                                        }}
                                                    />
                                                    <Text style={{ fontFamily: 'Avenir-Heavy', color: '#1A1919', marginLeft: 20 }}>{res.name}</Text>
                                                </View>
                                                :
                                                null
                                        }

                                    </Pressable>
                                )
                            })
                        }
                    </View>
                </View>
            }
            {
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => props.navigation.navigate('AddStyle', { service_name: selectedService, service_id: selectedServiceId })}
                    style={styles.touchableOpacityStyle}>
                    <Image
                        source={require('../../../Images/Group.png')}
                        style={styles.floatingButtonStyle}
                    />
                </TouchableOpacity>
            }
        </View>
    )
}
export default Styles;

const styles = StyleSheet.create({
    conatiner: {
        flex: 1,
        backgroundColor: Colors.white
    },
    touchableOpacityStyle: {
        position: 'absolute',
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        right: 30,
        bottom: 30,
    },
})