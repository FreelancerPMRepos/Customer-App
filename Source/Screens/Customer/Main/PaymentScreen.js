import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Pressable, Alert, TextInput } from 'react-native';
import Header from '../../../Components/Header';
import Stripe from 'react-native-stripe-api';
import { CreditCardInput, LiteCreditCardInput } from "react-native-credit-card-input";
import axios from 'axios';
import { BASE_URL } from '../../../Config';
import Loader from '../../../Components/Loader';

const PaymentScreen = ({ navigation, route, props }) => {
    const [isLoading, setLoading] = useState(false)
    const [cardData, setCardData] = useState('');
    const { booking_id, salon_name, employee_name, date_time } = route.params
    console.log("booking_id", booking_id)

    const _onBack = () => navigation.goBack()

    const getData = async () => {
        setLoading(true)
        if (cardData.valid === true) {
            // setLoading(true)
            const apiKey = 'pk_test_51JVfvXCnUpBJoNDHFLOyPrzRvBarz4oXWCCARl2UDVJJXdvBmCjSNkbrZN2lgqOEIiMpD7dngcowDCMR704rStrs00pQ4HmrW4';
            const client = new Stripe('sk_test_51JVfvXCnUpBJoNDH82KAk5JeMK7ucpYXxc7XwNJRLlU0Oy7AvgGD6SFTiDaNTDwHiTC3NXw4H7tR0MsGBiNSMbpi00aJJGfEvz');
            let Expiry = cardData.values.expiry.slice(0, 2)
            let Year = cardData.values.expiry.slice(3, 6)
            try {
                const token = await client.createToken({
                    number: cardData.values.number,
                    exp_month: Expiry,
                    exp_year: Year,
                    cvc: cardData.values.cvc,
                });
                if (token.id) {
                    console.log("asdf", token.id, booking_id);
                    axios.post(`${BASE_URL}/payment/getway`, {
                        booking_id: booking_id,
                        stripeToken: token.id,
                    })
                        .then(res => {
                            console.log("payment response", res.data)
                            navigation.navigate('BookingSuccessfullScreen', { transaction_id: res.data.transaction_id, booking_id: booking_id, salon_name: salon_name, employee_name: employee_name, date_time: date_time })
                            setLoading(false)
                        })
                        .catch(e => {
                            console.log('e', e)
                            alert(e.response.data.message)
                            setLoading(false)
                        })

                    // _onPostToken(token.id, productArray, productPrice)
                }
                else {
                    // setLoading(false)
                    alert(token.error.code)
                    setLoading(false)
                }

            } catch (err) {
                console.log('e', err)
                // setLoading(false)
                setLoading(false)
            }
        } else {
            alert('Card details are invalid.')
            setLoading(false)
        }
    }


    return (
        <View style={styles.container}>
            {
                <Header leftIcon='back' onLeftIconPress={_onBack} {...props} />
            }
            {
                isLoading && <Loader />
            }
            {
                <View>
                    {/* <View style={{ backgroundColor: '#1A1919', marginLeft: 10, marginRight: 10, borderRadius: 8, paddingTop: 100, paddingLeft: 20, paddingRight: 20 }}>
                    </View>
                    <Pressable style={{ backgroundColor: '#1A1919', marginLeft: 90, marginRight: 90, marginTop: 50, borderRadius: 5 }} onPress={() => getData()}>
                        <Text style={{ color: '#FFFFFF', textAlign: 'center', fontSize: 16, fontFamily: 'Avenir-Heavy', marginTop: 8, marginBottom: 7 }}>Pay Now</Text>
                    </Pressable> */}
                    <View style={{marginLeft: 11, marginRight: 20}}>
                        <CreditCardInput onChange={form => setCardData(form)} />
                    </View>
                    <Pressable style={{ backgroundColor: '#1A1919', marginLeft: 90, marginRight: 90, marginTop: 50, borderRadius: 5 }} onPress={() => getData()}>
                        <Text style={{ color: '#FFFFFF', textAlign: 'center', fontSize: 16, fontFamily: 'Avenir-Heavy', marginTop: 8, marginBottom: 7 }}>Pay Now</Text>
                    </Pressable>
                </View>
            }
        </View>
    )
}
export default PaymentScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    }
})