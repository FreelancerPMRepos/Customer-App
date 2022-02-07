import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import Header from '../../../Components/EmployeeHeader';
import { BASE_URL, Colors } from '../../../Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const RevenueYear = (props) => {
    const [listData, setListData] = useState([]);
    const [userId, setUserId] = useState('');

    const _onBack = () => props.navigation.goBack()

    useEffect(() => {
        getUser();
    }, [])

    const getUser = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@user_details')
            const parData = jsonValue != null ? JSON.parse(jsonValue) : null;
            console.log("jdfhughs", parData.id)
            setUserId(parData.id)
            getData(parData.id)
        } catch (e) {
            // error reading value
        }
    }

    const getData = (id) => {
        axios.get(`${BASE_URL}/revenue/year?year=2021&employee_id=${id}`)
            .then(res => {
                console.log('res', res.data)
                setListData(res.data)
                // setLoading(false)
            })
            .catch(e => {
                console.log('e', e)
                //  setLoading(false)
            })
    }


    return (
        <View>
            {
                <Header leftIcon="back" onLeftIconPress={() => _onBack()} title={"My Performance"} {...props} />
            }
            {
                <View>
                    <View style={{ backgroundColor: '#141313', marginTop: 23, marginLeft: 16, marginRight: 16 }}>
                        <Text style={{ textAlign: 'center', color: '#FFFFFF', fontSize: 16, fontFamily: 'Avenir-Heavy', lineHeight: 22, marginTop: 9, marginBottom: 10 }}>2021</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginLeft: 17, marginRight: 16, flexWrap: 'wrap' }}>
                        {
                            listData.map((res) => {
                                return (
                                    <View>
                                        <Text style={{ color: '#1A1919', fontFamily: 'Avenir-Heavy', lineHeight: 19, borderWidth: 1, width: 59.75, paddingTop: 7, borderColor: '#979797', textAlign: 'center', paddingBottom: 6 }}>{res.month_name.substring(0, 3)}</Text>
                                        <Text style={{ color: '#50C2C6', fontFamily: 'Avenir-Black', borderRightWidth: 1, borderLeftWidth: 1, borderBottomWidth: 1, borderColor: '#979797', textAlign: 'center', paddingRight: 1, paddingTop: 13, paddingBottom: 14.5 }}>${res.revenue}</Text>
                                    </View>
                                )
                            })
                        }
                    </View>
                </View>
            }
        </View>
    )
}
export default RevenueYear;