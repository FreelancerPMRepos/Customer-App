import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';

import Header from '../../Components/Header';
import { useDispatch } from 'react-redux';
import { resetAuth } from '../../Actions/AuthActions';
import axios from 'axios';
import { BASE_URL } from '../../Config';
import Loader from '../../Components/Loader';

const Settings = (props) => {
  const [isLoading, setLoading] = useState(false)
  const dispatch = useDispatch()


  const onLogout = () => {
    Alert.alert(
      "Alert",
      "Are You Sure?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: 'cancel'
        },
        { text: "OK", onPress: () => _log() }
      ],
      { cancelable: false }
    );
  }

  const _log = () => {
    setLoading(true)
    axios.delete(`${BASE_URL}/logout`)
      .then(res => {
        console.log('res', res.data)
        dispatch(resetAuth())
        console.log("USER LOGOUT")
        setLoading(false)
      })
      .catch(e => {
        console.log('e', e)
        setLoading(false)
      })
  }


  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {
        <Header {...props} />
      }
       {
        isLoading && <Loader />
      }
      {
        <View style={styles.mainView} >
          <Text style={styles.nameText}>Name</Text>
          <TextInput placeholder="Zoe Corby" style={styles.textInputStyle} />
          <Text style={styles.commonText}>Email</Text>
          <TextInput placeholder="zoe.corby@gmail.com" style={styles.textInputStyle} />
          <Text style={styles.commonText}>Password</Text>
          <TextInput placeholder="*********" style={styles.textInputStyle} />
          <Pressable style={styles.loactionpasswordButton} onPress={() => props.navigation.navigate('ResetPassword')}>
            <Text style={styles.resetPasswordText}>Reset Password</Text>
          </Pressable>
          <Text style={styles.commonText}>Location</Text>
          <TextInput placeholder="Auto Location Enabled" style={styles.textInputStyle} />
          <View style={styles.loactionpasswordButton}>
            <Text style={styles.changeLocationText}>Change Location</Text>
          </View>
          <Text style={styles.servicesText}>Which services are you interested in?</Text>
          <Text style={styles.commonText}>Sex</Text>
          <TextInput placeholder="Male" style={styles.textInputStyle} />
          <Text style={styles.commonText}>Hair Length</Text>
          <TextInput placeholder="Short" style={styles.textInputStyle} />
          <Text style={styles.commonText}>Is your hair naturally coloured?</Text>
          <TextInput placeholder="Yes" style={styles.textInputStyle} />
          <View style={styles.bottomButtonView}>
            <Text style={styles.privacyPolicyText}>Privacy Policy</Text>
            <Text style={styles.termsServiceText}>Terms Of Service</Text>
            <Pressable onPress={() => onLogout()}>
              <Text style={styles.logoutText}>Logout</Text>
            </Pressable>
          </View>
        </View>
      }
    </ScrollView>
  )
}
export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  mainView: {
    marginLeft: 27,
    marginTop: 28,
    marginRight: 27.5,
    marginBottom: 43
  },
  nameText: {
    color: '#1A1919'
  },
  commonText: {
    color: '#1A1919',
    marginTop: 15.59
  },
  resetPasswordText: {
    fontSize: 12,
    color: '#1A1919'
  },
  changeLocationText: {
    fontSize: 12,
    color: '#1A1919'
  },
  servicesText: {
    marginTop: 29,
    color: '#1A1919'
  },
  privacyPolicyText: {
    borderBottomWidth: 1,
    color: '#17171A'
  },
  termsServiceText: {
    borderBottomWidth: 1,
    color: '#17171A'
  },
  logoutText: {
    borderBottomWidth: 1,
    color: '#17171A'
  },
  bottomButtonView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20.59
  },
  textInputStyle: {
    borderWidth: 1,
    marginTop: 12.5,
    borderColor: '#979797',
    height: 35,
    paddingLeft: 10.5
  },
  loactionpasswordButton: {
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    marginTop: 13,
    borderBottomWidth: 1
  }
})