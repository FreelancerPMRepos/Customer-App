import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    Pressable
} from 'react-native';
import Header from '../../Components/Header'

const ForgotPassword = (props) => {

    const _onBack = () => props.navigation.goBack()

    return (
        <View style={styles.container}>
            {
                <Header leftIcon='back' onLeftIconPress={_onBack} {...props} />
            }
            {
                <View>
                    <Text style={{ color: '#17171A', fontSize: 18, fontFamily: 'Avenir-Heavy', marginLeft: 132, marginTop: 60}}>Forgot Password</Text>
                    <Text style={{color: '#17171A', fontSize: 16, fontFamily: 'Avenir-Medium', marginLeft: 83, marginRight: 81, marginTop: 34, textAlign: 'center'}}>Please enter your registered mobile number/ Email.</Text>
                    <TextInput  placeholder= "Registered Mobile Number/Email" style={{borderWidth: 1, marginLeft: 15.5, marginRight: 15.5, marginTop: 14.5}}/> 
                    <Text style={{color: '#17171A', fontSize: 14, fontFamily: 'Avenir-Book', textAlign: 'center', marginLeft: 36.5, marginTop: 20.59, marginRight: 28.5}}>We will send verification code on your registered mobile number.</Text>
                    <Pressable style={{borderWidth: 1, borderColor: '#504E4E', marginLeft: 22.5, marginRight: 21.5, marginTop: 110}}>
                        <Text style={{color: '#2A2929', fontSize: 16, fontFamily: 'Avenir-Medium', marginTop: 11.15, marginBottom: 11.15, textAlign: 'center'}}>Send</Text>
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
})