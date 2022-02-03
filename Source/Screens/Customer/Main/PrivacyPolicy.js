import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Header from '../../../Components/Header'
import Loader from '../../../Components/Loader';
import axios from 'axios';
import { BASE_URL } from '../../../Config';

const PrivacyPolicy = ({ navigation, route, props }) => {
    const [isLoading, setLoading] = useState(false)
    const { name } = route.params
    const [list, setList] = useState([])
    const _onBack = () => navigation.goBack()

    useEffect(() => {
        setLoading(true)
        axios.get(`${BASE_URL}/cms/${name}`)
            .then(res => {
                setList(res.data)
                setLoading(false)
            })
            .catch(e => {
                console.log('err', e)
                setLoading(false)
            })
    },[])
    return (
        <View style={styles.container}  >
            {
                <Header leftIcon='back' onLeftIconPress={_onBack} {...props} />
            }
            {
                isLoading && <Loader />
            }
            {
                <ScrollView>
                    <Text style={{marginLeft: 30, marginRight: 20, marginTop: 10, marginBottom: 20}}>{list.description}</Text>
                </ScrollView>
            }
        </View>
    )
}
export default PrivacyPolicy;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
      },
})