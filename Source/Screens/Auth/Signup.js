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

import { isValidEmail, width } from '../../Config';
import { useDispatch, useSelector } from 'react-redux';
import { signUp } from '../../Actions/AuthActions'

const Signup = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const dispatch = useDispatch()
  const auth = useSelector(state => state.auth)
  const { isError } = auth

  const _onSignUp = () => {
    if (email == '') {
      alert('Please Enter Email Address')
      return false
    } else if (!isValidEmail(email)) {
      alert('Please Enter Valid Email Address')
      return false
    } else if (password == '') {
      alert('Please Enter Password')
      return false
    } else if (confirmPassword == '') {
      alert('Please Enter Confirm Password')
      return false
    } else if (password !== confirmPassword) {
      alert('Password and Confirm Password does not match')
      return false
    } else {
      const data = {
        email: email,
        password: password
      }
      dispatch(signUp(data))
    }
  }

  const renderEmailView = () => {
    return (
      <View style={{ width: width * 0.83, marginTop: 44 }}>
        <Text style={{ color: "#FFFFFF" }}>Email</Text>
        <TextInput placeholder="Enter Email" style={styles.input} placeholderTextColor='#FFFFFF' onChangeText={text => setEmail(text)} value={email}/>
      </View>
    )
  }

  const renderPasswordView = () => {
    return (
      <View style={{ width: width * 0.83, marginTop: 24.50 }}>
        <Text style={{ color: "#FFFFFF", }}>Password</Text>
        <TextInput placeholder="Enter Password" style={styles.input} placeholderTextColor='#FFFFFF' onChangeText={text => setPassword(text)} value={password}/>
      </View>
    )
  }

  const renderConfirmPasswordView = () => {
    return (
      <View style={{ width: width * 0.83, marginTop: 24.50 }}>
        <Text style={{ color: "#FFFFFF", }}>Confirm Password</Text>
        <TextInput placeholder="Confirm Password" style={styles.input} placeholderTextColor='#FFFFFF' onChangeText={text => setConfirmPassword(text)} value={confirmPassword}/>
      </View>
    )
  }

  const renderLoginButton = () => {
    return (
      <Pressable style={{ backgroundColor: '#FFFFFF', marginTop: 33, }} onPress={() => _onSignUp()}>
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
          style={styles.tinyLogo}
          source={require('../../Images/logo.png')}
        />
        <Text style={{ color: "#FFFFFF", fontSize: 16, fontFamily: 'Avenir Heavy' }}>Your Way. Every Time.</Text>
        <Text style={{ color: "#FFFFFF", fontSize: 18, marginTop: 33, fontFamily: 'Avenir Heavy' }}>Sign Up</Text>
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