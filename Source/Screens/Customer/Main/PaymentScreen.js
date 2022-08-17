import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Pressable, Alert, TextInput } from 'react-native';
import Header from '../../../Components/Header';
import { CreditCardInput, LiteCreditCardInput } from "react-native-credit-card-input";
import axios from 'axios';
import { BASE_URL, height } from '../../../Config';
import Loader from '../../../Components/Loader';
import { useStripe } from '@stripe/stripe-react-native';

const PaymentScreen = ({ navigation, route, props }) => {
    const [isLoading, setLoading] = useState(false)
    const [cardData, setCardData] = useState('');
    const [ephemeralKey, setEphemeralKey] = useState('');
    const [customerId, setCustomerId] = useState('')
    const [clientSecret, setClientSecret] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const { booking_id, salon_name, employee_name, date_time } = route.params
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [paymentSheetError, setPaymentSheetError] = useState(false);

    const _onBack = () => navigation.goBack()

    useEffect(() => {
        fetchPaymentIntentClientSecret()
    }, [])

    const fetchPaymentIntentClientSecret = async () => {
        console.log("df",booking_id)
        axios.post(`${BASE_URL}/create/payment/intent`, {
            booking_id: booking_id
        })
            .then(res => {
                console.log("res", res.data)
                setClientSecret(res.data.client_secret)
                setEphemeralKey(res.data.ephemeralKey)
                setCustomerId(res.data.customer)
                initializePaymentSheet(res.data.client_secret)
                setTransactionId(res.transaction_id)
            })
            .catch(e => {
                console.log('error', e)
                alert(e.response.data.message)
            })
    }

    const initializePaymentSheet = async (clientSecret) => {
        const { error } = await initPaymentSheet({
            paymentIntentClientSecret: clientSecret,
            merchantDisplayName: 'Hairkut',
            googlePay: true,
            merchantCountryCode: 'UK',
            customerId: customerId,
            testEnv: true, // use test environment
        });
        if (error) {
            // Error in payment
            // Show error alert
            alert(error.code)
          console.log("error",error)
        } else {
            // Show payment sheet
            openPaymentSheet();
        }
    }

    const openPaymentSheet = async () => {
        const { error } = await presentPaymentSheet();

        if (error) {
            // Error in payment
            // Show error alert
          //  Alert.alert(error)
          alert(error.code)
          setPaymentSheetError(true)
          console.log("error",error)
        } else {
            // Payment done
            onConfirmPayment()
        }
    };

    const onConfirmPayment = () => {
        axios.post(`${BASE_URL}/payment/getway`, {
            booking_id: booking_id,
            transaction_id: transactionId,
        })
            .then(res => {
                console.log("payment response", res.data)
                navigation.navigate('BookingSuccessfullScreen', { transaction_id: transactionId, booking_id: booking_id, salon_name: salon_name, employee_name: employee_name, date_time: date_time })
                setLoading(false)
            })
            .catch(e => {
                console.log('e', e)
                alert(e.response.data.message)
                setLoading(false)
            })
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
                <View style={styles.mainView}>
                    <Text style={{justifyContent: 'center', alignItems: 'center'}}>{paymentSheetError == true ? 'Cancel' : 'Please Wait.....'}</Text>
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
        alignItems: 'center',
        height: height
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