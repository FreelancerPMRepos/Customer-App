import React, { useEffect, useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    Pressable,
    Modal
} from 'react-native';
import Header from '../../Components/Header';
import SelectDropdown from 'react-native-select-dropdown'
import { BASE_URL, width } from '../../Config';
import axios from 'axios';
import DateTimePickerModal from "react-native-modal-datetime-picker";


const countries = ["Egypt", "Canada", "Australia", "Ireland"]

const StoreDescription = ({ navigation, route, props }) => {
    const [serviceList, setServiceList] = useState([]);
    const [serviceTypeList, setServiceTypeList] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [serviceTypeModal, setServiceTypeModal] = useState(false);
    const [serviceId, setServiceId] = useState('');
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const { storeId } = route.params

    console.log("storeId", storeId)

    useEffect(() => {
        getServiceList();
        console.log("asd", serviceTypeList)
    }, [])

    const getServiceList = () => {
        axios.get(`${BASE_URL}/style/list/${storeId}`)
            .then(res => {
                setServiceList(res.data)
                console.log('res', res.data)
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

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    return (
        <View style={styles.container}>
            {
                <Header leftIcon='back' onLeftIconPress={_onBack} {...props} />
            }
            {
                <View>
                    <View style={{ flexDirection: 'row', marginLeft: 26, marginTop: 10 }}>
                        <Image source={require('../../Images/home_dummy.png')} />
                        <View style={{ marginLeft: 15 }}>
                            <Text style={{ color: '#1A1919', fontSize: 15, fontFamily: 'Avenir-Medium' }}>Tommy Guns Salon</Text>
                            <Text style={{ fontSize: 12, fontFamily: 'Avenir-Medium' }}>0.4 Miles</Text>
                            <Text style={{ fontSize: 12, fontFamily: 'Avenir-Medium' }}>8-18 Open</Text>
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


                        {/* service modal */}

                        <Pressable style={{ borderWidth: 1, borderColor: '#979797', height: 35, marginRight: 26.5, flexDirection: 'row', justifyContent: 'space-between' }} onPress={() => onService()}>
                            <Text style={{ fontFamily: 'Avenir-Medium', marginLeft: 10.5, marginTop: 4.5 }}>Select</Text>
                            <Image source={require('../../Images/arrowDown.png')} style={{ marginTop: 5, marginRight: 9.36 }} />
                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={modalVisible}
                                onRequestClose={() => {
                                    Alert.alert("Modal has been closed.");
                                    setModalVisible(!modalVisible);
                                }}
                            >
                                <View style={[styles.centeredView, { marginTop: 410 }]}>
                                    <View style={styles.modalView}>
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
                                    </View>
                                </View>
                            </Modal>
                        </Pressable>





                        <Text style={{ fontFamily: 'Avenir-Medium', marginTop: 7.5 }}>Service Type</Text>


                        {/* service Type Modal */}
                        <Pressable style={{ borderWidth: 1, borderColor: '#979797', height: 35, marginRight: 26.5, flexDirection: 'row', justifyContent: 'space-between' }} onPress={() => getServiceTypeList()}>
                            <Text style={{ fontFamily: 'Avenir-Medium', marginLeft: 10.5, marginTop: 4.5 }}>Select</Text>
                            <Image source={require('../../Images/arrowDown.png')} style={{ marginTop: 5, marginRight: 9.36 }} />
                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={serviceTypeModal}
                                onRequestClose={() => {
                                    Alert.alert("Modal has been closed.");
                                    setServiceTypeModal(!serviceTypeModal);
                                }}
                            >
                                <View style={[styles.centeredView, { marginTop: 324 }]}>
                                    <View style={styles.modalView}>
                                        {
                                            serviceTypeList.map((res) => {
                                                return (
                                                    <Pressable onPress={() => setServiceTypeModal(!serviceTypeModal)}>
                                                        <Text>{res.name}</Text>
                                                    </Pressable>
                                                )
                                            })
                                        }
                                    </View>
                                </View>
                            </Modal>
                        </Pressable>





                        <Text style={{ fontFamily: 'Avenir-Medium', marginTop: 7.5 }}>Pick Style</Text>
                        <SelectDropdown
                            data={countries}
                            buttonStyle={{ backgroundColor: 'white', borderWidth: 1, borderColor: '#979797', height: 35, marginTop: 7.5, width: 336 }}
                            buttonTextStyle={{ textAlign: "left" }}
                            onSelect={(selectedItem, index) => {
                                console.log(selectedItem, index)
                            }}
                        />
                        <Text style={{ fontFamily: 'Avenir-Medium', marginTop: 7.5 }}>Hairdresser</Text>
                        <SelectDropdown
                            data={countries}
                            buttonStyle={{ backgroundColor: 'white', borderWidth: 1, borderColor: '#979797', height: 35, marginTop: 7.5, width: 336 }}
                            buttonTextStyle={{ textAlign: "left" }}
                            onSelect={(selectedItem, index) => {
                                console.log(selectedItem, index)
                            }}
                        />
                        <Text style={{ fontFamily: 'Avenir-Medium', marginTop: 7.5 }}>Date & Time</Text>
                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="date"
                            display="inline"
                           // onConfirm={handleConfirm}
                            onCancel={hideDatePicker}
                        />
                        <View style={{ flexDirection: 'row' }}>
                            <Pressable style={{ flexDirection: 'row', borderWidth: 1, borderColor: '#979797', height: 35 }} onPress={() => showDatePicker()}>
                                <Text style={{ fontFamily: 'Avenir-Medium', marginLeft: 10.5, marginTop: 5 }}>15 Aug 2021</Text>
                                <Image
                                    style={{ marginLeft: 15, marginRight: 4.5, marginTop: 7.5 }}
                                    source={require('../../Images/storeCalendar.png')}
                                />
                            </Pressable>
                            <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: '#979797', marginLeft: 15, height: 35 }}>
                                <Text style={{ fontFamily: 'Avenir-Medium', marginLeft: 10.5, marginTop: 5 }}>14:30</Text>
                                <Image
                                    style={{ marginTop: 15, marginLeft: 36, marginRight: 6.36 }}
                                    source={require('../../Images/Triangle.png')}
                                />
                            </View>
                        </View>
                        <Pressable style={{ borderWidth: 1, marginLeft: 123, marginRight: 123, marginTop: 10 }}>
                            <Text style={{ fontFamily: 'Avenir-Medium', textAlign: 'center', marginTop: 10.59, marginBottom: 10.59 }}>BOOK NOW</Text>
                        </Pressable>
                    </View>
                </View>
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