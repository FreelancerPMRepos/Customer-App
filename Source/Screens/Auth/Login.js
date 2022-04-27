import React, { useEffect, useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    ImageBackground,
    Image,
    TextInput,
    Pressable,
    PermissionsAndroid,
} from 'react-native';

import { BASE_URL, width } from '../../Config';
import { useDispatch, useSelector } from 'react-redux';
import { login, socialLogin } from '../../Actions/AuthActions'
import { Colors } from '../../Config/index';
import Loader from '../../Components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';

import {
    GoogleSignin,
} from '@react-native-google-signin/google-signin';
import {
    LoginManager,
    AccessToken,
    GraphRequest,
    GraphRequestManager,
} from 'react-native-fbsdk'
import axios from 'axios';
import strings from '../../Localization/strings';
import { showMessageAlert } from '../../Utils/Utility';


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
    const [email, setEmail] = useState('')
    const [Password, setPassword] = useState('')
    const [isLoading, setLoading] = useState(false)


    useEffect(() => {
        GoogleSignin.configure()
        locationPermission()
    }, [])

    const locationPermission = async () => {
        if (Platform.OS === 'ios') {
            getOneTimeLocation();
        } else {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location Access Required',
                        message: 'This App needs to Access your location',
                    },
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    //To Check, If Permission is granted
                    getOneTimeLocation();
                } else {
                    showMessageAlert('Permission Denied')
                }
            } catch (err) {
                console.warn(err);
            }
        }
    }

    const getOneTimeLocation = async () => {
        setLoading(true)
        Geolocation.getCurrentPosition(
            (position) => {
                const currentLongitude =
                    JSON.stringify(position.coords.longitude);
                const currentLatitude =
                    JSON.stringify(position.coords.latitude);
                setLocation(currentLongitude, currentLatitude)
                setLoading(false)
            },
            (error) => {
                setLoading(false)
            },
            {
                enableHighAccuracy: false,
                timeout: 30000,
                maximumAge: 1000
            },
        );
    };

    const setLocation = async (currentLongitude, currentLatitude) => {
        try {
            await AsyncStorage.setItem('CurrentLongitude', currentLongitude)
            await AsyncStorage.setItem('CurrentLatitude', currentLatitude)
        } catch (e) {
            // saving error
        }
    }

    const _onLogin = () => {
        if (email == '') {
            showMessageAlert(strings.please_enter_email)
            return false
        } else if (Password == '') {
            showMessageAlert(strings.please_enter_password)
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
            const data = {
                social_id: userInfo.user.id,
                type: "GOOGLE"
            }
            try {
                const jsonValue = JSON.stringify(data)
                await AsyncStorage.setItem('@storage_Key', jsonValue)
                await AsyncStorage.setItem('@google_email', userInfo.user.email)
                axios.post(`${BASE_URL}/social/login`, data)
                    .then(res => {
                        if (res.data.user_status == '0') {
                            props.navigation.navigate('UserDetails')
                        } else {
                            dispatch(socialLogin(res.data.access_token))
                        }
                    })
                    .catch(e => {
                        console.log("error", e.message)
                        alert(`${e.message}.`)
                        dispatch({ type: AUTH_ERROR, payload: { error: e } })
                    })
            } catch (e) {
                // saving error
            }
        } catch (error) {
            alert(error)
        }
    }

    const _onFacebookSignin = () => {
        let self = this
        LoginManager.logInWithPermissions(['public_profile', 'email']).then(
            function (result) {
                if (result.isCancelled) {
                    self.setState({
                        isFacebookLoading: false
                    })
                } else {
                    AccessToken.getCurrentAccessToken().then(data => {
                        let accessToken = data.accessToken
                        const jsonValue = JSON.stringify(accessToken)
                        AsyncStorage.setItem('facebook_token', jsonValue)
                        const infoRequest = new GraphRequest(
                            '/me?fields=email,name,first_name,middle_name,last_name,picture.type(large)', // { //   accessToken: accessToken, //   parameters: { //     fields: { //       string: "email"//,name,first_name,middle_name,last_name //     } //   } // },
                            null,
                            (error, result) => {
                                if (error) {
                                    self.setState({
                                        isFacebookLoading: false
                                    })
                                    alert('Error fetching data: ' + error.toString())
                                } else {
                                    const fbdata = {
                                        social_id: result.id,
                                        type: "FACEBOOK"
                                    }
                                    try {
                                        const jsonValue = JSON.stringify(fbdata)
                                        AsyncStorage.setItem('@storage_Key', jsonValue)
                                        axios.post(`${BASE_URL}/social/login`, fbdata)
                                            .then(res => {
                                                console.log("asdf", res.data)
                                                if (res.data.user_status == '0') {
                                                    props.navigation.navigate('UserDetails')
                                                } else {
                                                    dispatch(socialLogin())
                                                }
                                            })
                                            .catch(e => {
                                                console.log("asd", e.message)
                                                alert(`${e.message}.`)
                                                dispatch({ type: AUTH_ERROR, payload: { error: e } })
                                            })
                                    } catch (e) {
                                        console.log("error", e)
                                    }
                                }
                            }
                        )
                        // Start the graph request.\
                        new GraphRequestManager().addRequest(infoRequest).start()
                    })
                }
            },
            function (error) {
               console.log("error",error)
            }
        )
    }

    const renderEmailView = () => {
        return (
            <View style={styles.emailView}>
                <Text style={{ color: Colors.white }}>{strings.email}</Text>
                <TextInput placeholder={strings.enter_email} onChangeText={text => setEmail(text)} value={email} style={styles.input} placeholderTextColor={Colors.white} />
            </View>
        )
    }

    const renderPasswordView = () => {
        return (
            <View style={styles.passwordView}>
                <Text style={{ color: Colors.white }}>{strings.password}</Text>
                <TextInput placeholder={strings.enter_password} style={styles.input} placeholderTextColor={Colors.white} secureTextEntry={true} onChangeText={text => setPassword(text)} value={Password} />
            </View>
        )
    }

    const renderForgotPassword = () => {
        return (
            <Pressable style={styles.forgotPasswordButton} onPress={() => props.navigation.navigate('ForgotPassword')}>
                <Text style={{ color: Colors.white }}>{strings.forgot_password}</Text>
            </Pressable>
        )
    }

    const renderLoginButton = () => {
        return (
            <Pressable style={styles.loginButton} onPress={() => _onLogin()}>
                <Text style={styles.loginButtonText}>{strings.log_in}</Text>
            </Pressable>
        )
    }

    const renderSignupView = () => {
        return (
            <View style={styles.signUpView}>
                <Text style={styles.didHaveText}>{strings.do_not_have_an_account}</Text>
                <Pressable onPress={() => props.navigation.navigate('Signup')}>
                    <Text style={{ color: Colors.white, fontWeight: 'bold' }}>  {strings.sign_up}.</Text>
                </Pressable>
            </View>
        )
    }

    const renderContinueView = () => {
        return (
            <View style={{ marginTop: 15 }}>
                <Text style={{ color: Colors.white, fontFamily: 'Avenir Medium' }}>{strings.or_continue_with}</Text>
            </View>
        )
    }

    const renderSocialButton = () => {
        return (
            <View style={styles.socialButtonView}>
                <Pressable style={styles.googleButton} onPress={() => _onGoogleSignin()}>
                    <Image
                        style={styles.socialButtonImage}
                        source={require('../../Images/Google_transparent.png')}
                    />
                </Pressable>
                <Pressable style={styles.facebookButton} onPress={() => _onFacebookSignin()}>
                    <Image
                        style={styles.socialButtonImage}
                        source={require('../../Images/facebook_transparent.png')}
                    />
                </Pressable>
            </View>
        )
    }
    return (
        <View style={styles.container}>
            {
                (auth.isLoading || isLoading) && <Loader />
            }
            <ImageBackground source={require('../../Images/background.png')} resizeMode="cover" style={styles.image}>
                <Image
                    source={require('../../Images/logo.png')}
                />
                <Text style={styles.quoteText}>{strings.your_way_every_time}</Text>
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
    },
    emailView: {
        width: width * 0.83,
        marginTop: 44
    },
    passwordView: {
        width: width * 0.83,
        marginTop: 24.50
    },
    forgotPasswordButton: {
        marginTop: 10.59,
        fontSize: 14,
        alignSelf: 'flex-end',
        marginRight: 33
    },
    loginButton: {
        backgroundColor: 'white',
        marginTop: 33,
        opacity: 0.6
    },
    loginButtonText: {
        marginLeft: 44,
        marginRight: 44,
        marginTop: 8,
        marginBottom: 8,
        fontFamily: 'Avenir-Medium'
    },
    signUpView: {
        marginTop: 15,
        flexDirection: 'row'
    },
    didHaveText: {
        color: Colors.white,
        fontFamily: 'Avenir Black'
    },
    socialButtonView: {
        flexDirection: 'row',
        marginTop: 7
    },
    googleButton: {
        flexDirection: 'row',
        width: 155,
        justifyContent: 'center',
        height: 29
    },
    socialButtonImage: {
        marginTop: 7
    },
    facebookButton: {
        flexDirection: 'row',
        width: 155,
        justifyContent: 'center',
        marginLeft: 7
    }
})