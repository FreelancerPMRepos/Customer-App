import React, { useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    Pressable
} from 'react-native';
import Header from '../../Components/Header'
import { BASE_URL, width } from '../../Config';
import OTPInputView from '@twotalltotems/react-native-otp-input'
import axios from 'axios';
import Loader from '../../Components/Loader';

const OtpVerification = ({ navigation, route, props }) => {
    const [isLoading, setLoading] = useState(false)
    const [otp, setOtp] = useState('');
    const { data } = route.params

    const _onBack = () => navigation.goBack()

    const _onVerify = () => {
        setLoading(true)
        axios.put(`${BASE_URL}/verify/otp`, {
            email: data,
            token: otp
        })
            .then(res => {
                navigation.navigate('ResetPassword', { email: data, token: otp })
                setLoading(false)
            })
            .catch(e => {
                 alert(`${e.response.data.message}.`)
                setLoading(false)
            })
    }


    const _onResend = () => {
        setLoading(true)
        axios.post(`${BASE_URL}/resend/otp`, {
            email: data,
        })
            .then(res => {
                alert(res.data.message)
                setLoading(false)
            })
            .catch(e => {
                 alert(`${e.response.data.message}.`)
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
                <View style={{ flex: 1 }}>
                    <Text style={styles.otpVerificationText}>OTP Verification</Text>
                    <Image
                        style={styles.tinyLogo}
                        source={require('../../Images/otp.png')}
                    />
                    <Text style={styles.title}>Please enter verification code.</Text>
                    <View style={styles.otpView}>
                        <OTPInputView
                            style={{ height: 50, marginTop: 20, }}
                            pinCount={4}
                            //    code={this.state.otp} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
                            onCodeChanged={otp => setOtp(otp)}
                            autoFocusOnLoad={false}
                            editable={true}
                            codeInputFieldStyle={styles.inputItem}
                        // onCodeFilled={code => {
                        // }}
                        />
                    </View>
                    <Text style={styles.subtitle}>We have sent verification code on your registered email.</Text>
                    <View style={styles.buttonView}>
                        <Pressable style={styles.verifyButton} onPress={() => _onVerify()}>
                            <Text style={styles.verifyButtonText}>Verify</Text>
                        </Pressable>
                        <View style={styles.resendButton}>
                            <Text>Didn’t Get the code?</Text>
                            <Pressable onPress={() => _onResend()}>
                                <Text style={styles.resendButtonText}> Resend.</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            }
        </View>
    )
}
export default OtpVerification;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    tinyLogo: {
        marginLeft: 142,
        marginTop: 17
    },
    otpVerificationText: {
        fontSize: 16,
        fontFamily: 'Avenir-Heavy',
        marginLeft: 128,
        marginTop: 60
    },
    title: {
        fontSize: 16,
        fontFamily: 'Avenir-Medium',
        marginLeft: 78,
        marginTop: 42
    },
    subtitle: {
        fontFamily: 'Avenir-Book',
        marginLeft: 34,
        marginTop: 17,
        textAlign: 'center',
        marginRight: 26
    },
    buttonView: {
    //    position: 'absolute',
    //    bottom: 59
    marginTop: 117
    },
    verifyButton: {
        borderWidth: 1,
        borderColor: '#504E4E',
        marginLeft: 22.5,
        width: width * 0.87
    },
    verifyButtonText: {
        fontSize: 16,
        fontFamily: 'Avenir-Medium',
        textAlign: 'center',
        //   marginLeft: 144.5, 
        //   marginRight: 143.5, 
        marginTop: 11.5,
        marginBottom: 11.5
    },
    resendButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 12
    },
    resendButtonText: {
        fontFamily: 'Avenir-Black',
        lineHeight: 19
    },
    otpView: {
        marginLeft: 66,
        marginRight: 65
    },
    inputItem: {
        backgroundColor: 'white',
        //    borderRadius: 25,
        color: 'black',
    },
})