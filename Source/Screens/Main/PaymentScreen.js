import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Pressable, Alert, TextInput } from 'react-native';
import Header from '../../Components/Header';
import Stripe from 'react-native-stripe-api';

const PaymentScreen = (props) => {

    const _onBack = () => props.navigation.goBack()

    const getData = async () => {
        // setLoading(true)
        const apiKey = 'pk_test_51JVfvXCnUpBJoNDHFLOyPrzRvBarz4oXWCCARl2UDVJJXdvBmCjSNkbrZN2lgqOEIiMpD7dngcowDCMR704rStrs00pQ4HmrW4';
        const client = new Stripe('sk_test_51JVfvXCnUpBJoNDH82KAk5JeMK7ucpYXxc7XwNJRLlU0Oy7AvgGD6SFTiDaNTDwHiTC3NXw4H7tR0MsGBiNSMbpi00aJJGfEvz');

        try {
            const token = await client.createToken({
                number: 424242424242424,
                exp_month: 12,
                exp_year: 24,
                cvc: 123,
            });
            if (token.id) {
                // setLoading(false)
                console.log(token.id);
                // _onPostToken(token.id, productArray, productPrice)
            }
            else {
                // setLoading(false)
                alert(token.error.code)
            }

        } catch (err) {
            console.log('e', err)
            // setLoading(false)
        }



    }


    return (
        <View style={styles.container}>
            {
                <Header leftIcon='back' onLeftIconPress={_onBack} {...props} />
            }
            {
                <View>
                    <View style={{ backgroundColor: '#1A1919', marginLeft: 10, marginRight: 10, borderRadius: 8, paddingTop: 100, paddingLeft: 20, paddingRight: 20 }}>
                       {/* <TextInput
                       placeholder='ENter coed'
                       style={{backgroundColor: '#FFFFFF', borderRadius: 8}}
                       /> */}
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