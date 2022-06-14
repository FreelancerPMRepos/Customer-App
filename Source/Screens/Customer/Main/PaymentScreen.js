import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Pressable, Alert, TextInput } from 'react-native';
import Header from '../../../Components/Header';
import { CreditCardInput, LiteCreditCardInput } from "react-native-credit-card-input";
import axios from 'axios';
import { BASE_URL } from '../../../Config';
import Loader from '../../../Components/Loader';
import { useStripe } from '@stripe/stripe-react-native';

const PaymentScreen = ({ navigation, route, props }) => {
    const [isLoading, setLoading] = useState(false)
    const [cardData, setCardData] = useState('');
    const [ephemeralKey, setEphemeralKey] = useState('');
    const [customerId, setCustomerId] = useState('')
    const [clientSecret, setClientSecret] = useState('');
    const { booking_id, salon_name, employee_name, date_time } = route.params
    const { initPaymentSheet, presentPaymentSheet } = useStripe();

    const _onBack = () => navigation.goBack()

    useEffect(() => {
        fetchPaymentIntentClientSecret()
    }, [])

    const fetchPaymentIntentClientSecret = async () => {
        axios.post(`${BASE_URL}/create/payment/intent`, {
            booking_id: booking_id
        })
            .then(res => {
                console.log("res", res.data)
                setClientSecret(res.data.client_secret)
                setEphemeralKey(res.data.ephemeralKey)
                setCustomerId(res.data.customer)
                initializePaymentSheet(res.data.client_secret)
            })
            .catch(e => {
                console.log('e', e)
                alert(e.response.data.message)
            })
    }

    const initializePaymentSheet = async (clientSecret) => {
        const { error } = await initPaymentSheet({
            paymentIntentClientSecret: clientSecret,
            merchantDisplayName: 'Hairkut',
            googlePay: true,
            merchantCountryCode: 'US',
            testEnv: true, // use test environment
        });
        if (error) {
            // Error in payment
            // Show error alert
            Alert.alert(error)
        } else {
            // Show payment sheet
            openPaymentSheet();
        }
    }

    const openPaymentSheet = async () => {
        const {error} = await presentPaymentSheet();
    
        if (error) {
          // Error in payment
          // Show error alert
          Alert.alert(error)
        } else {
          // Payment done
          // Call success api for backend only
        //   depositSuccess();
        }
      };

    // const pay = async () => {
    //     console.log("Here")
    //     const { error } = await presentPaymentSheet();

    //     if (error) {
    //         Alert.alert(`Error code: ${error.code}`, error.message);
    //     } else {
    //         Alert.alert('Success', 'Your order is confirmed!');
    //     }
    // };


    return (
        <View style={styles.container}>
            {
                <Header leftIcon='back' onLeftIconPress={_onBack} {...props} />
            }
            {
                isLoading && <Loader />
            }
            {
                <View style={styles.mainView}>
                    <Pressable style={styles.button} onPress={() => pay()}>
                        <Text style={styles.buttonText}>Pay</Text>
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
    },
    mainView: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        backgroundColor: 'black',
        width: '20%',
        height: '24%',
        justifyContent: 'center',
        borderRadius: 10
    },
    buttonText: {
        color: 'white',
        textAlign: 'center'
    }
})