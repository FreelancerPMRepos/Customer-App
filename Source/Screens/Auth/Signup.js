import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  Image,
  TextInput,
  Pressable,
  ScrollView
} from 'react-native';

import { BASE_URL, Colors, height, isValidEmail, width } from '../../Config';
import { useDispatch, useSelector } from 'react-redux';
import { signUp } from '../../Actions/AuthActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { socialLogin } from '../../Actions/AuthActions'
import Loader from '../../Components/Loader';

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

const Signup = (props) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const dispatch = useDispatch()
  const auth = useSelector(state => state.auth)
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    GoogleSignin.configure()
  }, [])

  const _onSignUp = () => {
    if (name == '') {
      showMessageAlert(strings.please_enter_name)
      return false
    } else if (email == '') {
      showMessageAlert(strings.please_enter_email)
      return false
    } else if (!isValidEmail(email)) {
      showMessageAlert(strings.please_enter_valid_email)
      return false
    } else if (password == '') {
      showMessageAlert(strings.please_enter_password)
      return false
    } else if (!/^(?=.*[a-z])(?=.*[0-9])(?=.{8,})/.test(password)) {
      showMessageAlert(strings.password_should_be_minimum)
      return false
    } else if (confirmPassword == '') {
      showMessageAlert(strings.please_enter_confirm_password)
      return false
    } else if (password !== confirmPassword) {
      showMessageAlert(strings.password_and_confirm_password_does_not_match)
      return false
    } else {
      const data = {
        name: name,
        email: email,
        password: password
      }
      dispatch(signUp(data))
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
      console.log("error", error)
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
        // this.setState({
        //   btnFacebookLoading: false
        // })
      }
    )
  }

  const renderNameView = () => {
    return (
      <View style={styles.nameView}>
        <Text style={styles.white}>{strings.name}</Text>
        <TextInput placeholder={strings.enter_name} style={styles.input} placeholderTextColor='#FFFFFF' onChangeText={text => setName(text)} value={name} />
      </View>
    )
  }

  const renderEmailView = () => {
    return (
      <View style={styles.emailView}>
        <Text style={styles.white}>{strings.email}</Text>
        <TextInput placeholder={strings.enter_email} style={styles.input} placeholderTextColor='#FFFFFF' onChangeText={text => setEmail(text)} value={email} />
      </View>
    )
  }

  const renderPasswordView = () => {
    return (
      <View style={styles.emailView}>
        <Text style={styles.white}>{strings.password}</Text>
        <TextInput placeholder={strings.enter_password} style={styles.input} placeholderTextColor='#FFFFFF' onChangeText={text => setPassword(text)} value={password} />
      </View>
    )
  }

  const renderConfirmPasswordView = () => {
    return (
      <View style={styles.emailView}>
        <Text style={styles.white}>{strings.confirm_password}</Text>
        <TextInput placeholder={strings.enter_confirm_password} style={styles.input} placeholderTextColor='#FFFFFF' onChangeText={text => setConfirmPassword(text)} value={confirmPassword} />
      </View>
    )
  }

  const renderSignupButton = () => {
    return (
      <Pressable style={styles.signUpButton} onPress={() => _onSignUp()} disabled={isLoading}>
        <Text style={styles.signUpButtonText}>{strings.sign_up.toUpperCase()}</Text>
      </Pressable>
    )
  }

  const renderLoginView = () => {
    return (
      <View style={styles.alreadyAccountView}>
        <Text style={styles.alreadyAccountText}>{strings.already_have_an_account}</Text>
        <Pressable onPress={() => props.navigation.navigate('Login')}>
          <Text style={styles.loginText}>  {strings.signup_log_in}</Text>
        </Pressable>
      </View>
    )
  }

  const renderContinueView = () => {
    return (
      <View style={{ marginTop: 15 }}>
        <Text style={styles.continueText}>{strings.or_continue_with}</Text>
      </View>
    )
  }

  const renderSocialButton = () => {
    return (
      <View style={styles.socialButtonView}>
        <Pressable style={styles.googleButton} onPress={() => _onGoogleSignin()}>
          <Image
            style={{ marginTop: height * 0.01 }}
            source={require('../../Images/Google_transparent.png')}
          />
        </Pressable>
        <Pressable style={styles.facebookButton} onPress={() => _onFacebookSignin()}>
          <Image
            style={{ marginTop: height * 0.01 }}
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
      <ImageBackground source={require('../../Images/background.png')} style={styles.image}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Image
              style={styles.tinyLogo}
              source={require('../../Images/logo.png')}
            />
            <Text style={styles.yourWayText}>{strings.your_way_every_time}</Text>
            {renderNameView()}
            {renderEmailView()}
            {renderPasswordView()}
            {renderConfirmPasswordView()}
            {renderSignupButton()}
            {renderLoginView()}
            {renderContinueView()}
            {renderSocialButton()}
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  )
}
export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
  },
  white: {
    color: Colors.white
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderColor: '#FFFFFF',
    borderWidth: 1,
    marginTop: 11.5,
    color: '#FFFFFF'
  },
  nameView: {
    width: width * 0.83,
    marginTop: 20
  },
  emailView: {
    width: width * 0.83,
    marginTop: 24.50
  },
  signUpButton: {
    backgroundColor: 'white',
    marginTop: 33,
    opacity: 0.6
  },
  signUpButtonText: {
    marginLeft: 44,
    marginRight: 44,
    marginTop: height * 0.02,
    marginBottom: 8,
    fontFamily: 'Avenir Medium'
  },
  alreadyAccountView: {
    marginTop: height * 0.02,
    flexDirection: 'row'
  },
  alreadyAccountText: {
    color: '#FFFFFF',
    fontFamily: 'Avenir Black'
  },
  loginText: {
    color: '#FFFFFF',
    fontWeight: 'bold'
  },
  continueText: {
    color: '#FFFFFF',
    fontFamily: 'Avenir Medium'
  },
  socialButtonView: {
    flexDirection: 'row',
    marginTop: 7,
    paddingBottom: 20
  },
  googleButton: {
    flexDirection: 'row',
    width: 155,
    justifyContent: 'center',
    height: 29
  },
  facebookButton: {
    flexDirection: 'row',
    width: 155,
    justifyContent: 'center',
    marginLeft: 7
  },
  yourWayText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: 'Avenir Heavy'
  },
  tinyLogo: {
    marginTop: height * 0.05
  }
})