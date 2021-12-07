import React, { useEffect, useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    Pressable,
    Modal,
    ScrollView
} from 'react-native';
import Header from '../../Components/Header';
import SelectDropdown from 'react-native-select-dropdown'
import { BASE_URL, width } from '../../Config';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Rating, AirbnbRating } from 'react-native-ratings';


const countries = ["Egypt", "Canada", "Australia", "Ireland"]

const StoreDescription = ({ navigation, route, props }) => {
    const [serviceList, setServiceList] = useState([]);
    const [serviceTypeList, setServiceTypeList] = useState([]);
    const [hairdresserList, setHairdresserList] = useState([]);
    const [pickStyleList, setPickStyleList] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [serviceTypeModal, setServiceTypeModal] = useState(false);
    const [pickStyleModal, setPickStyleModal] = useState(false);
    const [hairdresserModal, setHairdresserModal] = useState(false);
    const [serviceId, setServiceId] = useState('');
    const { storeDetails } = route.params
    // Date Picker
    const [date, setDate] = useState(new Date(1598051730000));
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    console.log("date", date)


    console.log("storeDetails.id", storeDetails)

    useEffect(() => {
        getServiceList();
        getHairdresserList();
        getPickStyleList();
        console.log("asd", serviceTypeList)
    }, [])

    const getServiceList = () => {
        axios.get(`${BASE_URL}/style/list/${storeDetails.id}`)
            .then(res => {
                setServiceList(res.data)
                console.log('res', res.data)
            })
            .catch(e => {
                console.log('e', e)
            })
    }

    const getHairdresserList = () => {
        axios.get(`${BASE_URL}/employee/list/${storeDetails.id}`)
            .then(res => {
                setHairdresserList(res.data)
                console.log('res', res.data)
            })
            .catch(e => {
                console.log('e', e)
            })
    }

    const getPickStyleList = () => {
        axios.get(`${BASE_URL}/favourite/${storeDetails.id}`)
            .then(res => {
                setPickStyleList(res.data)
                console.log('res pick style', res.data)
            })
            .catch(e => {
                console.log('e', e)
            })
    }

    const getServiceTypeList = () => {
        if (serviceId == '') {
            console.log("Please Select Service First")
            alert('Please Select Service First')
        } else {
            axios.get(`${BASE_URL}/style/type/list/${serviceId}`)
                .then(res => {
                    setServiceTypeList(res.data)
                    console.log('res', res.data)
                    if (res.data.length == 0) {
                        alert('No Service Type available')
                    } else {
                        setServiceTypeModal(!serviceTypeModal)
                    }
                })
                .catch(e => {
                    console.log('e', e)
                    alert('No Service Type available')
                })
        }
    }

    const service = (id) => {
        setServiceId(id)
        setModalVisible(!modalVisible)
    }

    const onService = () => {
        if (serviceList.length == 0) {
            alert('No Service available')
        } else {
            setModalVisible(!modalVisible)
        }
    }

    const _onBack = () => navigation.goBack()

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const showTimepicker = () => {
        showMode('time');
    };

    const renderService = () => {
        return (
            <View>
                <Pressable style={{ borderWidth: 1, borderColor: '#979797', height: 35, marginRight: 26.5, flexDirection: 'row', justifyContent: 'space-between' }} onPress={() => onService()}>
                    <Text style={{ fontFamily: 'Avenir-Medium', marginLeft: 10.5, marginTop: 4.5 }}>Select</Text>
                    <Image source={require('../../Images/arrowDown.png')} style={{ marginTop: 5, marginRight: 9.36 }} />
                </Pressable>
                {
                    modalVisible == true ?
                        <View style={{ borderWidth: 1, marginRight: 27 }}>
                            {
                                serviceList.map((res) => {
                                    return (
                                        <Pressable onPress={() => service(res.id)}>
                                            <Text style={{ fontFamily: 'Avenir-Medium', marginTop: 7, marginLeft: 10.5, marginBottom: 7 }}>{res.name}</Text>
                                            <View
                                                style={{
                                                    borderBottomColor: '#979797',
                                                    borderBottomWidth: 1,
                                                }}
                                            />
                                        </Pressable>
                                    )
                                })
                            }
                        </View> :
                        null
                }
            </View>
        )
    }

    const renderServiceType = () => {
        return (
            <View>
                <Pressable style={{ borderWidth: 1, borderColor: '#979797', height: 35, marginRight: 26.5, flexDirection: 'row', justifyContent: 'space-between' }} onPress={() => getServiceTypeList()}>
                    <Text style={{ fontFamily: 'Avenir-Medium', marginLeft: 10.5, marginTop: 4.5 }}>Select</Text>
                    <Image source={require('../../Images/arrowDown.png')} style={{ marginTop: 5, marginRight: 9.36 }} />
                </Pressable>
                {
                    serviceTypeModal == true ?
                        <View style={{ borderWidth: 1, marginRight: 27 }}>
                            {
                                serviceTypeList.map((res) => {
                                    return (
                                        <Pressable onPress={() => setServiceTypeModal(!serviceTypeModal)}>
                                            <Text style={{ fontFamily: 'Avenir-Medium', marginTop: 7, marginLeft: 10.5, marginBottom: 7 }}>{res.name}</Text>
                                            <View
                                                style={{
                                                    borderBottomColor: '#979797',
                                                    borderBottomWidth: 1,
                                                }}
                                            />
                                        </Pressable>
                                    )
                                })
                            }
                        </View> :
                        null
                }
            </View>
        )
    }

    const renderPickStyle = () => {
        return (
            <View>
                <Pressable style={{ borderWidth: 1, borderColor: '#979797', height: 35, marginRight: 26.5, flexDirection: 'row', justifyContent: 'space-between' }} onPress={() => setPickStyleModal(!pickStyleModal)}>
                    <Text style={{ fontFamily: 'Avenir-Medium', marginLeft: 10.5, marginTop: 4.5 }}>Select</Text>
                    <Image source={require('../../Images/arrowDown.png')} style={{ marginTop: 5, marginRight: 9.36 }} />
                </Pressable>
                {
                    pickStyleModal == true ?
                        <View style={{ borderWidth: 1, marginRight: 27 }}>
                            {
                                pickStyleList.map((res) => {
                                    return (
                                        <Pressable onPress={() => setPickStyleModal(!pickStyleModal)}>
                                            <Text style={{ fontFamily: 'Avenir-Medium', marginTop: 7, marginLeft: 10.5, marginBottom: 7 }}>{res.name}</Text>
                                            <View
                                                style={{
                                                    borderBottomColor: '#979797',
                                                    borderBottomWidth: 1,
                                                }}
                                            />
                                        </Pressable>
                                    )
                                })
                            }
                        </View> :
                        null
                }
            </View>
        )
    }

    const renderHairDresser = () => {
        return (
            <View>
                <Pressable style={{ borderWidth: 1, borderColor: '#979797', height: 35, marginRight: 26.5, flexDirection: 'row', justifyContent: 'space-between' }} onPress={() => setHairdresserModal(!hairdresserModal)}>
                    <Text style={{ fontFamily: 'Avenir-Medium', marginLeft: 10.5, marginTop: 4.5 }}>Select</Text>
                    <Image source={require('../../Images/arrowDown.png')} style={{ marginTop: 5, marginRight: 9.36 }} />
                </Pressable>
                {
                    hairdresserModal == true ?
                        <View style={{ borderWidth: 1, marginRight: 27 }}>
                            {
                                hairdresserList.map((res) => {
                                    return (
                                        <Pressable onPress={() => setHairdresserModal(!hairdresserModal)}>
                                            <Text style={{ fontFamily: 'Avenir-Medium', marginTop: 7, marginLeft: 10.5, marginBottom: 7 }}>{res.name}</Text>
                                            <View
                                                style={{
                                                    borderBottomColor: '#979797',
                                                    borderBottomWidth: 1,
                                                }}
                                            />
                                        </Pressable>
                                    )
                                })
                            }
                        </View> :
                        null
                }
            </View>
        )
    }

    return (
        <View style={styles.container}>
            {
                <Header leftIcon='back' onLeftIconPress={_onBack} {...props} />
            }
            {
                <ScrollView>
                    <View style={{ flexDirection: 'row', marginLeft: 26, marginTop: 10 }}>
                        <Image source={{
                            uri: storeDetails.images[0].url,
                        }} style={{ height: 83, width: 71 }} />
                        <View style={{ marginLeft: 15 }}>
                            <Text style={{ color: '#1A1919', fontSize: 15, fontFamily: 'Avenir-Medium' }}>{storeDetails.store_name}</Text>
                            <Text style={{ fontSize: 12, fontFamily: 'Avenir-Medium', lineHeight: 16 }}>0.4 Miles</Text>
                            <View style={{ marginRight: 186 }}>
                                <Rating
                                    type='custom'
                                    ratingCount={5}
                                    ratingColor='#1F1E1E'
                                    ratingBackgroundColor='#c8c7c8'
                                    tintColor="#FFFFFF"
                                    readonly={true}
                                    startingValue={4}
                                    imageSize={16}
                                //   onFinishRating={this.ratingCompleted}
                                />
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontSize: 12, fontFamily: 'Avenir-Medium', marginTop: 4 }}>8-18</Text>
                                {
                                    storeDetails.is_available == 1 ?
                                        <Text style={{ fontSize: 12, fontFamily: 'Avenir-Medium', marginTop: 4, color: '#70CF2B' }}> Open</Text>
                                        :
                                        <Text style={{ fontSize: 12, fontFamily: 'Avenir-Medium', marginTop: 4, color: '#E73E3E' }}> Closed</Text>
                                }
                            </View>
                        </View>
                    </View>
                    <Text style={{ fontSize: 16, fontFamily: 'Avenir-Heavy', marginLeft: 26, marginTop: 10 }}>Reviews</Text>
                    <View style={{ borderBottomColor: '#979797', borderBottomWidth: 1, marginLeft: 27, marginRight: 27, marginTop: 3 }}
                    />
                    <Text style={{ fontFamily: 'Avenir-Medium', marginLeft: 27, marginTop: 6, marginBottom: 7 }}>“Brilliant and professional, I was in and out before the end of my lunch break.”</Text>
                    <View style={{ borderBottomColor: '#979797', borderBottomWidth: 1, marginLeft: 27, marginRight: 27, }} />
                    <Text style={{ fontFamily: 'Avenir-Medium', marginLeft: 27, marginTop: 6, marginBottom: 7 }}>“Had a stop over in town tonight and needed a haircut before a meeting tomorrow. Last minute lifesaver.”</Text>
                    <View style={{ borderBottomColor: '#979797', borderBottomWidth: 1, marginLeft: 27, marginRight: 27, }} />
                    <Text style={{ fontSize: 16, fontFamily: 'Avenir-Heavy', marginLeft: 28, marginTop: 10 }}>Book</Text>
                    <Text style={{ fontFamily: 'Avenir-Medium', marginLeft: 28, marginTop: 7 }}>Service</Text>
                    <View style={{ marginLeft: 27.5 }}>
                        {renderService()}
                        <Text style={{ fontFamily: 'Avenir-Medium', marginTop: 7.5 }}>Service Type</Text>
                        {renderServiceType()}
                        <Text style={{ fontFamily: 'Avenir-Medium', marginTop: 7.5 }}>Pick Style</Text>
                        {renderPickStyle()}
                        <Text style={{ fontFamily: 'Avenir-Medium', marginTop: 7.5 }}>Hairdresser</Text>
                        {renderHairDresser()}
                        <Text style={{ fontFamily: 'Avenir-Medium', marginTop: 7.5 }}>Date & Time</Text>
                        {show && (
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={date}
                                mode={mode}
                                minimumDate={new Date()}
                                is24Hour={true}
                                display="default"
                                onChange={onChange}
                            />
                        )}
                        <View style={{ flexDirection: 'row' }}>
                            <Pressable style={{ flexDirection: 'row', borderWidth: 1, borderColor: '#979797', height: 35 }} onPress={showDatepicker}>
                                <Text style={{ fontFamily: 'Avenir-Medium', marginLeft: 10.5, marginTop: 5 }}>15 Aug 2021</Text>
                                <Image
                                    style={{ marginLeft: 15, marginRight: 4.5, marginTop: 7.5 }}
                                    source={require('../../Images/storeCalendar.png')}
                                />
                            </Pressable>
                            <Pressable style={{ flexDirection: 'row', borderWidth: 1, borderColor: '#979797', marginLeft: 15, height: 35 }} onPress={showTimepicker}>
                                <Text style={{ fontFamily: 'Avenir-Medium', marginLeft: 10.5, marginTop: 5 }}>14:30</Text>
                                <Image
                                    style={{ marginTop: 15, marginLeft: 36, marginRight: 6.36 }}
                                    source={require('../../Images/Triangle.png')}
                                />
                            </Pressable>
                        </View>
                        <Pressable style={{ borderWidth: 1, marginLeft: 123, marginRight: 123, marginTop: 10 }}>
                            <Text style={{ fontFamily: 'Avenir-Medium', textAlign: 'center', marginTop: 10.59, marginBottom: 10.59 }}>BOOK NOW</Text>
                        </Pressable>
                    </View>
                </ScrollView>
            }
        </View>
    )
}
export default StoreDescription;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    centeredView: {
        flex: 1,
        //     justifyContent: "center",
        alignItems: "center",
    },
    modalView: {
        width: 336,
        margin: 20,
        backgroundColor: "white",
        //  borderRadius: 20,
        //    padding: 35,
        //    alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
})