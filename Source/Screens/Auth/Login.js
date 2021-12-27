import React, { useEffect, useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    ImageBackground,
    Image,
    TextInput,
    Pressable
} from 'react-native';

import { BASE_URL, width } from '../../Config';
import { useDispatch, useSelector } from 'react-redux';
import { login, socialLogin } from '../../Actions/AuthActions'
import { Colors } from '../../Config/index';
import Loader from '../../Components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
} from '@react-native-google-signin/google-signin';
import {
    LoginManager,
    AccessToken,
    GraphRequest,
    GraphRequestManager,
    Profile
} from 'react-native-fbsdk-next'


GoogleSignin.configure({
    scopes: ['https://www.googleapis.com/auth/drive.readonly'], // [Android] what API you want to access on behalf of the user, default is email and profile
    webClientId: '423891850043-hn0jkc7hlbncun2i7ngcm4cb8tpin6um.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
    offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    hostedDomain: '', // specifies a hosted domain restriction
    iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
    googleServicePlistPath: '', // [iOS] if you renamed your GoogleService-Info file, new name here, e.g. GoogleService-Info-Staging
    openIdRealm: '', // [iOS] The OpenID2 realm of the home web server. This allows Google to include the user's OpenID Identifier in the OpenID Connect ID token.
    profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
});

const Login = (props) => {
    const dispatch = useDispatch()
    const auth = useSelector(state => state.auth)
    const { isError } = auth
    const [email, setEmail] = useState('')
    const [Password, setPassword] = useState('')
    const [isLoading, setLoading] = useState(false)

    useEffect(() => {
        GoogleSignin.configure()
    }, [])

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

    const _onGoogleSignin = async () => {
        try {
            await GoogleSignin.hasPlayServices()
            const userInfo = await GoogleSignin.signIn()
            userInfo.social_type = 'GOOGLE'
            console.log("User Info", userInfo.user.id)
            const data = {
                social_id: userInfo.user.id,
                type: "GOOGLE"
            }
            try {
                const jsonValue = JSON.stringify(data)
                await AsyncStorage.setItem('@storage_Key', jsonValue)
                dispatch(socialLogin(data))
            } catch (e) {
                // saving error
            }
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                this.setState({
                    isGoogleLoading: false
                })
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (f.e. sign in) is in progress already
                this.setState({
                    isGoogleLoading: false
                })
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
                alert('Google SignIn Play Services Not Available')
                this.setState({
                    isGoogleLoading: false
                })
            } else {
                // some other error happened
                alert(error)
            }
        }
    }

    const _onFacebookSignin = async () => {
        const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
        if (result.isCancelled) {
            throw 'User cancelled the login process';
        }
        const data = await AccessToken.getCurrentAccessToken();
        console.log("fb", data.userID)
        const fbdata = {
            social_id: data.userID,
            type: "FACEBOOK"
        }
        console.log("data", fbdata)
        try {
            const jsonValue = JSON.stringify(fbdata)
            AsyncStorage.setItem('@storage_Key', jsonValue)
            dispatch(socialLogin(fbdata))
        } catch (e) {
            console.log("error", e)
        }
    }

    // const _onFacebookSignin = async () => {
    //     let self = this
    //     LoginManager.logInWithPermissions(['public_profile', 'email']).then(
    //         function (result) {
    //             console.log("result", result)
    //             if (result.isCancelled) {
    //             } else {
    //                 AccessToken.getCurrentAccessToken().then(data => {
    //                     let accessToken = data.accessToken
    //                     try {
    //                         const currentProfile = Profile.getCurrentProfile().then(
    //                             function (currentProfile) {
    //                                 if (currentProfile) {
    //                                     const data = {
    //                                         social_id: currentProfile.userID,
    //                                         type: "FACEBOOK"
    //                                     }
    //                                     console.log("data",data)
    //                                     try {
    //                                         const jsonValue = JSON.stringify(data)
    //                                          AsyncStorage.setItem('@storage_Key', jsonValue)
    //                                         dispatch(socialLogin(data))
    //                                     } catch (e) {
    //                                         console.log("error", e)
    //                                     }
    //                                 }
    //                             }
    //                         );
    //                     }
    //                     catch {
    //                         console.log("error")
    //                     }
    //                 })
    //             }
    //         },
    //         function (error) {
    //             this.setState({
    //                 btnFacebookLoading: false
    //             })
    //         }
    //     )
    // }

    const renderEmailView = () => {
        return (
            <View style={{ width: width * 0.83, marginTop: 44 }}>
                <Text style={{ color: Colors.white }}>Email</Text>
                <TextInput placeholder="Enter Email" onChangeText={text => setEmail(text)} value={email} style={styles.input} placeholderTextColor='#FFFFFF' />
            </View>
        )
    }

    const renderPasswordView = () => {
        return (
            <View style={{ width: width * 0.83, marginTop: 24.50 }}>
                <Text style={{ color: Colors.white }}>Password</Text>
                <TextInput placeholder="Enter Password" style={styles.input} placeholderTextColor='#FFFFFF' secureTextEntry={true} onChangeText={text => setPassword(text)} value={Password} />
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
            <View style={{ flexDirection: 'row', marginTop: 7 }}>
                <Pressable style={{ backgroundColor: '#FFFFFF' }} onPress={() => _onGoogleSignin()}>
                    <Text style={{ marginLeft: 35, marginRight: 35, marginTop: 4, marginBottom: 4 }}>Google</Text>
                </Pressable>
                <Pressable style={{ backgroundColor: '#1976D2', marginLeft: 7 }} onPress={() => _onFacebookSignin()}>
                    <Text style={{ color: '#FFFFFF', marginLeft: 35, marginRight: 35, marginTop: 4, marginBottom: 4 }}>Facebook</Text>
                </Pressable>
            </View>
        )
    }
    return (
        <View style={styles.container}>
            {
                (auth.isLoading && isLoading) && <Loader />
            }
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