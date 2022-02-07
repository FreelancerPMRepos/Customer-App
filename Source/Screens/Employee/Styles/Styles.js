import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Image, Pressable, TouchableOpacity } from 'react-native';
import { BASE_URL, Colors } from '../../../Config';
import Header from '../../../Components/EmployeeHeader';
import axios from 'axios';

const Styles = (props) => {
    const [serviceData, setServiceData] = useState([]);
    const [selectedService, setSelectedService] = useState('');
    

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
                                    <View>
                                        {
                                            res.name == selectedService ?
                                                <Pressable style={{ backgroundColor: '#141313', borderRadius: 5, marginLeft: 10, marginTop: 11, marginBottom: 10 }} onPress={() => setSelectedService(res.name)}>
                                                    <Text style={{ color: '#FFFFFF', marginLeft: 14, marginRight: 13, marginTop: 8, marginBottom: 7, fontFamily: 'Avenir-Heavy', lineHeight: 19 }}>{res.name}</Text>
                                                </Pressable>
                                                :
                                                <Pressable onPress={() => setSelectedService(res.name)}>
                                                    <Text style={{ fontFamily: 'Avenir-Heavy', lineHeight: 19, marginTop: 19, marginLeft: 25 }}>{res.name}</Text>
                                                </Pressable>
                                        }
                                    </View>
                                )
                            })
                        }
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Pressable onPress={() => props.navigation.navigate('StylesDescription')}>
                            <Image
                                style={styles.tinyLogo}
                                source={require('../../../Images/cut1.png')}
                            />
                            <Text style={{ fontFamily: 'Avenir-Heavy', color: '#1A1919', marginLeft: 20 }}>Shoulder Length</Text>
                        </Pressable>
                        <Pressable onPress={() => props.navigation.navigate('StylesDescription')}>
                            <Image
                                style={styles.tinyLogo}
                                source={require('../../../Images/cut2.png')}
                            />
                            <Text style={{ fontFamily: 'Avenir-Heavy', color: '#1A1919', marginLeft: 20 }}>Fishtail Braid</Text>
                        </Pressable>
                        <Pressable onPress={() => props.navigation.navigate('StylesDescription')}>
                            <Image
                                style={{ height: 120, marginTop: 15 }}
                                source={require('../../../Images/upcoming.png')}
                            />
                            <Text style={{ fontFamily: 'Avenir-Heavy', color: '#1A1919', marginTop: 17 }}>Short & Straight</Text>
                        </Pressable>
                    </View>
                </View>
            }
            {
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => props.navigation.navigate('AddStyle', { service_name: selectedService})}
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