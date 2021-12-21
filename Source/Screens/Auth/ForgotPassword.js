import axios from 'axios';
import React, { useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    Pressable,
    Image
} from 'react-native';
import Header from '../../Components/Header'
import { BASE_URL } from '../../Config';
import Loader from '../../Components/Loader';

const ForgotPassword = (props) => {
    const [isLoading, setLoading] = useState(false)

    const _onBack = () => props.navigation.goBack()

    const _onSend = () => {
        setLoading(true)
        axios.post(`${BASE_URL}/forgot/password`, {
            mobile_number: "98997979496"
        })
            .then(res => {
                console.log('res', res.data)
                props.navigation.navigate('OtpVerification')
                setLoading(false)
            })
            .catch(e => {
                console.log('e', e)
                props.navigation.navigate('OtpVerification')
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
                <View>
                    <Text style={styles.forgotPasswordText}>Forgot Password</Text>
                    <Image
                        style={styles.tinyLogo}
                        source={require('../../Images/forgot.png')}
                    />
                    <Text style={styles.titleText}>Please enter your registered Email.</Text>
                    <TextInput placeholder="Registered Email" style={styles.emailTextinput} />
                    <Text style={styles.subtitleText}>We will send verification code on your registered Email.</Text>
                    <Pressable style={styles.sendButton} onPress={() => _onSend()}>
                        <Text style={styles.buttonText}>Send</Text>
                    </Pressable>
                </View>
            }
        </View>
    )
}
export default ForgotPassword;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    tinyLogo: {
        marginLeft: 145,
        marginTop: 17
    },
    forgotPasswordText: {
        color: '#17171A',
        fontSize: 18,
        fontFamily: 'Avenir-Heavy',
        marginLeft: 132,
        marginTop: 60
    },
    titleText: {
        color: '#17171A',
        fontSize: 16,
        fontFamily: 'Avenir-Medium',
        marginLeft: 83,
        marginRight: 81,
        marginTop: 34,
        textAlign: 'center'
    },
    subtitleText: {
        color: '#17171A',
        fontSize: 14,
        fontFamily: 'Avenir-Book',
        textAlign: 'center',
        marginLeft: 36.5,
        marginTop: 20.59,
        marginRight: 28.5
    },
    emailTextinput: {
        borderWidth: 1,
        marginLeft: 15.5,
        marginRight: 15.5,
        marginTop: 14.5,
        paddingLeft: 15.5
    },
    sendButton: {
        borderWidth: 1,
        borderColor: '#504E4E',
        marginLeft: 22.5,
        marginRight: 21.5,
        marginTop: 110
    },
    buttonText: {
        color: '#2A2929',
        fontSize: 16,
        fontFamily: 'Avenir-Medium',
        marginTop: 11.15,
        marginBottom: 11.15,
        textAlign: 'center'
    }
})