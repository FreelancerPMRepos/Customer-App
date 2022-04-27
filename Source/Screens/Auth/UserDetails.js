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

import { isValidEmail, width } from '../../Config';
import { useDispatch, useSelector } from 'react-redux';

import {
  GoogleSignin,
} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SocialSignup } from '../../Actions/AuthActions';


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

const UserDetails = (props) => {
  const [email, setEmail] = useState('');
  const [id, setId] = useState('');
  const [type, setType] = useState('');
  const dispatch = useDispatch()
  const auth = useSelector(state => state.auth)

  useEffect(() => {
    GoogleSignin.configure()
    getData()
    getEmail()
    setEmail('')
  }, [])

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@storage_Key')
      const parData = jsonValue != null ? JSON.parse(jsonValue) : null;
      setId(parData.social_id)
      setType(parData.type)
    } catch (e) {
      console.log("e",e)
    }
  }

  const getEmail = async () => {
    try {
      const value = await AsyncStorage.getItem('@google_email')
      setEmail(value)
    } catch (e) {
      console.log("e",e)
    }
  }

  const _onSignUp = () => {
    if (email == '') {
      alert('Please Enter Email Address')
      return false
    } else if (!isValidEmail(email)) {
      alert('Please Enter valid Email')
      return false
    } else {
      const data = {
        email: email,
        social_id: id,
        type: type,
        role: 'USER'
      }
      dispatch(SocialSignup(data))
    }
  }


  const renderEmailView = () => {
    return (
      <View style={styles.emailView}>
        <Text style={styles.emailText}>Email</Text>
        <TextInput placeholder="Enter Email" style={styles.input} placeholderTextColor='#FFFFFF' onChangeText={text => setEmail(text)} value={email} editable={type == 'GOOGLE' ? false : true} />
      </View>
    )
  }


  const renderSingupButton = () => {
    return (
      <Pressable style={styles.signUpButton} onPress={() => _onSignUp()}>
        <Text style={styles.signUpText}>SIGN UP</Text>
      </Pressable>
    )
  }

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../../Images/background.png')} resizeMode="cover" style={styles.image}>
        <Image
          style={styles.tinyLogo}
          source={require('../../Images/logo.png')}
        />
        <Text style={styles.heading}>Your Way. Every Time.</Text>
        <Text style={styles.subHeading}>Sign Up</Text>
        {renderEmailView()}
        {renderSingupButton()}
      </ImageBackground>
    </View>
  )
}
export default UserDetails;


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
  },
  emailView: {
    width: width * 0.83, 
    marginTop: 44
  },
  emailText: {
    color: "#FFFFFF" 
  },
  signUpButton: {
    backgroundColor: '#FFFFFF', 
    marginTop: 33,
  },
  signUpText: {
    marginLeft: 44, 
    marginRight: 44, 
    marginTop: 8, 
    marginBottom: 8, 
    fontFamily: 'Avenir Medium'
  },
  heading: {
    color: "#FFFFFF", 
    fontSize: 16, 
    fontFamily: 'Avenir Heavy'
  },
  subHeading: {
    color: "#FFFFFF", 
    fontSize: 18, 
    marginTop: 33, 
    fontFamily: 'Avenir Heavy'
  }
})