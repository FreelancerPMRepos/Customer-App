import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  Image,
  TextInput,
  Pressable
} from 'react-native';

import { doesContanisSpeacialCharecters, getCapitalLettersCount, getNumbersCount, getSmallLettersCount, getSpecialCharectersCount, isValidEmail, width } from '../../Config';
import { useDispatch, useSelector } from 'react-redux';
import { signUp } from '../../Actions/AuthActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login, socialLogin } from '../../Actions/AuthActions'
import SelectDropdown from 'react-native-select-dropdown'
import Loader from '../../Components/Loader';

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
} from 'react-native-fbsdk'


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
  const { isError } = auth
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    GoogleSignin.configure()
  }, [])

  const _onSignUp = () => {
    if (name == '') {
      alert('Please enter name.')
    } else if (email == '') {
      alert('Please enter email.')
      return false
    } else if (!isValidEmail(email)) {
      alert('Please enter valid email.')
      return false
    } else if (password == '') {
      alert('Please enter password.')
      return false
    } else if (!/^(?=.*[a-z])(?=.*[0-9])(?=.{8,})/.test(password)) {
      alert('Password should be minimum 8 characters and at least one number.')
      return false
    }
    //  else if (getCapitalLettersCount(password) < 1) {
    //   alert('Password should contain atleast 1 capital letter')
    //   return false
    // } 
    // else if (getSmallLettersCount(password) < 1) {
    //   alert('Password should contain atleast 1 small letter')
    //   return false
    // } 
    // else if (getNumbersCount(password) < 1) {
    //   alert('Password should contain atleast 1 number letter')
    //   return false
    // } 
    // else if (doesContanisSpeacialCharecters(password) < 1) {
    //   alert('Password should contain atleast 1 special character')
    //   return false
    // } 
    else if (confirmPassword == '') {
      alert('Please enter confirm password.')
      return false
    } else if (password !== confirmPassword) {
      alert('Password and confirm password does not match.')
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

  const _onFacebookSignin = () => {
    // Attempt a login using the Facebook login dialog asking for default permissions.
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
                    dispatch(socialLogin(fbdata))
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
      <View style={{ width: width * 0.83, marginTop: 20 }}>
        <Text style={{ color: "#FFFFFF" }}>Name</Text>
        <TextInput placeholder="Enter Name" style={styles.input} placeholderTextColor='#FFFFFF' onChangeText={text => setName(text)} value={name} />
      </View>
    )
  }

  const renderEmailView = () => {
    return (
      <View style={{ width: width * 0.83, marginTop: 24.50 }}>
        <Text style={{ color: "#FFFFFF" }}>Email</Text>
        <TextInput placeholder="Enter Email" style={styles.input} placeholderTextColor='#FFFFFF' onChangeText={text => setEmail(text)} value={email} />
      </View>
    )
  }

  const renderPasswordView = () => {
    return (
      <View style={{ width: width * 0.83, marginTop: 24.50 }}>
        <Text style={{ color: "#FFFFFF", }}>Password</Text>
        <TextInput placeholder="Enter Password" style={styles.input} placeholderTextColor='#FFFFFF' onChangeText={text => setPassword(text)} value={password} />
      </View>
    )
  }

  const renderConfirmPasswordView = () => {
    return (
      <View style={{ width: width * 0.83, marginTop: 24.50 }}>
        <Text style={{ color: "#FFFFFF", }}>Confirm Password</Text>
        <TextInput placeholder="Confirm Password" style={styles.input} placeholderTextColor='#FFFFFF' onChangeText={text => setConfirmPassword(text)} value={confirmPassword} />
      </View>
    )
  }

  const renderLoginButton = () => {
    return (
      <Pressable style={{ backgroundColor: 'rgba(52, 52, 52, alpha)', marginTop: 33, opacity: 0.6}} onPress={() => _onSignUp()}>
        <Text style={{ marginLeft: 44, marginRight: 44, marginTop: 8, marginBottom: 8, fontFamily: 'Avenir Medium' }}>SIGN UP</Text>
      </Pressable>
    )
  }

  const renderLoginView = () => {
    return (
      <View style={{ marginTop: 15, flexDirection: 'row' }}>
        <Text style={{ color: '#FFFFFF', fontFamily: 'Avenir Black' }}>Already Have An Account?</Text>
        <Pressable onPress={() => props.navigation.navigate('Login')}>
          <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>  Log In.</Text>
        </Pressable>
      </View>
    )
  }

  const renderContinueView = () => {
    return (
      <View style={{ marginTop: 15 }}>
        <Text style={{ color: '#FFFFFF', fontFamily: 'Avenir Medium' }}>Or Continue With</Text>
      </View>
    )
  }

  const renderSocialButton = () => {
    return (
      <View style={{ flexDirection: 'row', marginTop: 7 }}>
        <Pressable style={{  flexDirection: 'row', width: 155, justifyContent: 'center', height: 29 }} onPress={() => _onGoogleSignin()}>
          <Image
            style={{ marginTop: 7 }}
            source={require('../../Images/Google_transparent.png')}
          />
          {/* <Text style={{ marginTop: 4, marginBottom: 4, marginLeft: 7 }}>Google</Text> */}
        </Pressable>
        <Pressable style={{  flexDirection: 'row', width: 155, justifyContent: 'center', marginLeft: 7 }} onPress={() => _onFacebookSignin()}>
          <Image
            style={{ marginTop: 7 }}
            source={require('../../Images/facebook_transparent.png')}
          />
          {/* <Text style={{ color: '#FFFFFF', marginTop: 4, marginBottom: 4, marginLeft: 7 }}>Facebook</Text> */}
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
          style={styles.tinyLogo}
          source={require('../../Images/logo.png')}
        />
        <Text style={{ color: "#FFFFFF", fontSize: 16, fontFamily: 'Avenir Heavy' }}>Your Way. Every Time.</Text>
        {/* <Text style={{ color: "#FFFFFF", fontSize: 18, marginTop: 33, fontFamily: 'Avenir Heavy' }}>Sign Up</Text> */}
        {renderNameView()}
        {renderEmailView()}
        {renderPasswordView()}
        {renderConfirmPasswordView()}
        {renderLoginButton()}
        {renderLoginView()}
        {renderContinueView()}
        {renderSocialButton()}
      </ImageBackground>
    </View>
  )
}
export default Signup;

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
    borderColor: '#FFFFFF',
    borderWidth: 1,
    marginTop: 11.5,
    color: '#FFFFFF'
  }
})