import React, { useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    ImageBackground,
    Image,
    TextInput,
    Pressable
} from 'react-native';

import { width } from '../../Config';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../Actions/AuthActions'
import { Colors } from '../../Config/index';

const Login = (props) => {
    const dispatch = useDispatch()
    const auth = useSelector(state => state.auth)
    const { isError } = auth
    const [email, setEmail] = useState('')
    const [Password, setPassword] = useState('')

    const _onLogin = () => {
        if (email == '') {
            alert('Please Enter Email Address')
            return false
        } else if (Password == '') {
            alert('Please Enter Password')
            return false
        } else {
           const data = {
            username: email,
            password: Password
           }
           dispatch(login(data))
        }
    }

    const renderEmailView = () => {
        return (
            <View style={{ width: width * 0.83, marginTop: 44 }}>
                <Text style={{ color: Colors.white }}>Email</Text>
                <TextInput placeholder="Enter Email" onChangeText={text => setEmail(text)} value={email}  style={styles.input} placeholderTextColor='#FFFFFF' />
            </View>
        )
    }

    const renderPasswordView = () => {
        return (
            <View style={{ width: width * 0.83, marginTop: 24.50 }}>
                <Text style={{ color: Colors.white }}>Password</Text>
                <TextInput placeholder="Enter Password" style={styles.input} placeholderTextColor='#FFFFFF' secureTextEntry={true} onChangeText={text => setPassword(text)} value={Password}/>
            </View>
        )
    }

    const renderForgotPassword = () => {
        return (
            <Pressable style={{ marginLeft: width * 0.55, marginTop: 10.59, fontSize: 14 }} onPress={() => props.navigation.navigate('ForgotPassword')}>
                <Text style={{ color: Colors.white }}>Forgot Password?</Text>
            </Pressable>
        )
    }

    const renderLoginButton = () => {
        return (
            <Pressable style={{ backgroundColor: Colors.white, marginTop: 33, }} onPress={() => _onLogin()}>
                <Text style={{ marginLeft: 44, marginRight: 44, marginTop: 8, marginBottom: 8, fontFamily: 'Avenir-Medium' }}>LOG IN</Text>
            </Pressable>
        )
    }

    const renderSignupView = () => {
        return (
            <View style={{ marginTop: 15, flexDirection: 'row' }}>
                <Text style={{ color: Colors.white, fontFamily: 'Avenir Black' }}>Didn’t Have An Account?</Text>
                <Pressable onPress={() => props.navigation.navigate('Signup')}>
                    <Text style={{ color: Colors.white, fontWeight: 'bold' }}>  Sign Up.</Text>
                </Pressable>
            </View>
        )
    }

    const renderContinueView = () => {
        return (
            <View style={{ marginTop: 15 }}>
                <Text style={{ color: Colors.white, fontFamily: 'Avenir Medium' }}>Or Continue With</Text>
            </View>
        )
    }

    const renderSocialButton = () => {
        return (
            <View style={{flexDirection: 'row', marginTop: 7}}>
                <Pressable style={{backgroundColor: '#FFFFFF'}}>
                    <Text style={{marginLeft: 35, marginRight: 35, marginTop: 4, marginBottom: 4}}>Google</Text>
                </Pressable>
                <Pressable style={{backgroundColor: '#1976D2', marginLeft: 7}}>
                    <Text style={{color: '#FFFFFF', marginLeft: 35, marginRight: 35, marginTop: 4, marginBottom: 4}}>Facebook</Text>
                </Pressable>
            </View>
        )
    }
    return (
        <View style={styles.container}>
            <ImageBackground source={require('../../Images/background.png')} resizeMode="cover" style={styles.image}>
                <Image
                    source={require('../../Images/logo.png')}
                />
                <Text style={styles.quoteText}>Your Way. Every Time.</Text>
                <Text style={styles.loginText}>Log In</Text>
                {renderEmailView()}
                {renderPasswordView()}
                {renderForgotPassword()}
                {renderLoginButton()}
                {renderSignupView()}
                {renderContinueView()}
                {renderSocialButton()}
            </ImageBackground>
        </View>
    )
}
export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    image: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        borderColor: Colors.white,
        borderWidth: 1,
        marginTop: 11.5,
        color: Colors.white,
        paddingLeft: 15.5,
        fontFamily: 'Avenir-Book'
    },
    quoteText: {
        color: Colors.white, 
        fontSize: 16, 
        fontFamily: 'Avenir-Heavy'
    },
    loginText: {
        color: Colors.white, 
        fontSize: 18, 
        marginTop: 33, 
        fontFamily: 'Avenir-Heavy'
    }
})