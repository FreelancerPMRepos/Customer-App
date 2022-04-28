import React, { useEffect, useState } from 'react';
import {
    Text,
    View
} from 'react-native';

import Header from '../../../Components/EmployeeHeader';
import { BASE_URL, Colors } from '../../../Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Loader from '../../../Components/Loader';

const RevenueYear = (props) => {
    const [isLoading, setLoading] = useState(false)
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
            console.log("parData", parData.store_id)
            setUserId(parData.id)
            getData(parData.id, parData.store_id)
        } catch (e) {
            // error reading value
        }
    }

    const getData = (id, storeId) => {
        setLoading(true)
        axios.get(`${BASE_URL}/revenue/year?year=${new Date().getFullYear()}&employee_id=${id}&store_id=${storeId}`)
            .then(res => {
                console.log('res', res.data)
                setListData(res.data)
                setLoading(false)
            })
            .catch(e => {
                console.log('e', e)
                setLoading(false)
            })
    }

    function kFormatter(num) {
        return Math.abs(num) > 999 ? Math.sign(num) * ((Math.abs(num) / 1000).toFixed(1)) + 'k' : Math.sign(num) * Math.abs(num)
    }


    return (
        <View>
            {
                <Header leftIcon="back" onLeftIconPress={() => _onBack()} title={"My Performance"} {...props} />
            }
            {
                isLoading && <Loader />
            }
            {
                <View style={{ marginRight: 20 }}>
                    <View style={{ backgroundColor: '#141313', marginTop: 23, marginLeft: 16, }}>
                        <Text style={{ textAlign: 'center', color: '#FFFFFF', fontSize: 16, fontFamily: 'Avenir-Heavy', lineHeight: 22, marginTop: 9, marginBottom: 10, width: '100%' }}>{new Date().getFullYear()}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginLeft: 17, flexWrap: 'wrap', width: '100%' }}>
                        {
                            listData.map((res) => {
                                return (
                                    <View style={{ width: '15.8%' }}>
                                        <Text style={{ color: '#1A1919', fontFamily: 'Avenir-Heavy', lineHeight: 19, borderWidth: 1, paddingTop: 7, borderColor: '#979797', textAlign: 'center', paddingBottom: 6 }}>{res.month_name.substring(0, 3)}</Text>
                                        <Text style={{ color: '#50C2C6', fontFamily: 'Avenir-Black', borderRightWidth: 1, borderLeftWidth: 1, borderBottomWidth: 1, borderColor: '#979797', textAlign: 'center', paddingTop: 13, paddingBottom: 14.5, fontSize: 12 }}>${kFormatter(res.revenue)}</Text>
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