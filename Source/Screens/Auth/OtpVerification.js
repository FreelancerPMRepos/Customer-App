import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    Pressable
} from 'react-native';
import Header from '../../Components/Header'

const OtpVerification = (props) => {

    const _onBack = () => props.navigation.goBack()

    return (
        <View style={styles.container}>
            {
                <Header leftIcon='back' onLeftIconPress={_onBack} {...props} />
            }
            {
                <View style={{flex: 1}}>
                    <Text style={styles.otpVerificationText}>OTP Verification</Text>
                    <Image
                        style={styles.tinyLogo}
                        source={require('../../Images/otp.png')}
                    />
                    <Text style={styles.title}>Please enter verification code.</Text>
                    <Text style={styles.subtitle}>We have sent verification code on your registered mobile number.</Text>
                    <View style={styles.buttonView}>
                        <Pressable  style={styles.verifyButton} onPress={() => props.navigation.navigate('ResetPassword')}>
                            <Text style={styles.verifyButtonText}>Verify</Text>
                        </Pressable>
                        <View style={styles.resendButton}>
                            <Text>Didn’t Get the code?</Text>
                            <Text style={styles.resendButtonText}> Resend.</Text>
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
        textAlign: 'center'
    },
    buttonView: {
        position: 'absolute', 
        bottom: 59
    },
    verifyButton: {
        borderWidth: 1, 
        borderColor: '#504E4E', 
        marginLeft: 22.5
    },
    verifyButtonText: {
        fontSize: 16, 
        fontFamily: 'Avenir-Medium', 
        marginLeft: 144.5, 
        marginRight: 143.5, 
        marginTop: 11.5, 
        marginBottom: 11.5
    },
    resendButton: {
        flexDirection: 'row', 
        justifyContent: 'center', 
        marginTop: 12
    },
    resendButtonText: {
        fontFamily: 'Avenir-Black'
    }
})