import React from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
  Alert
} from 'react-native';

import Header from '../../Components/Header';
import { useDispatch } from 'react-redux';
import { resetAuth } from '../../Actions/AuthActions';

const Settings = (props) => {
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
    dispatch(resetAuth())
    console.log("USER LOGOUT")
  }


  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {
        <Header {...props} />
      }
      {
        <View style={styles.mainView} >
          <Text style={{ color: '#1A1919' }}>Name</Text>
          <TextInput placeholder="Zoe Corby" style={{ borderWidth: 1, marginTop: 12.5, borderColor: '#979797', height: 35, paddingLeft: 10.5 }} />
          <Text style={{ color: '#1A1919', marginTop: 15.59 }}>Email</Text>
          <TextInput placeholder="zoe.corby@gmail.com" style={{ borderWidth: 1, marginTop: 12.5, borderColor: '#979797', height: 35, paddingLeft: 10.5 }} />
          <Text style={{ color: '#1A1919', marginTop: 15.59 }}>Password</Text>
          <TextInput placeholder="*********" style={{ borderWidth: 1, marginTop: 12.5, borderColor: '#979797', height: 35, paddingLeft: 10.5 }} />
          <View style={{ justifyContent: 'flex-end', alignSelf: 'flex-end', marginTop: 13, borderBottomWidth: 1 }}>
            <Text style={{ fontSize: 12, color: '#1A1919' }}>Reset Password</Text>
          </View>
          <Text style={{ color: '#1A1919', marginTop: 15.59 }}>Location</Text>
          <TextInput placeholder="Auto Location Enabled" style={{ borderWidth: 1, marginTop: 12.5, borderColor: '#979797', height: 35, paddingLeft: 10.5 }} />
          <View style={{ justifyContent: 'flex-end', alignSelf: 'flex-end', marginTop: 13, borderBottomWidth: 1 }}>
            <Text style={{ fontSize: 12, color: '#1A1919' }}>Change Location</Text>
          </View>
          <Text style={{ marginTop: 29, color: '#1A1919' }}>Which services are you interested in?</Text>
          <Text style={{ color: '#1A1919', marginTop: 15.59 }}>Sex</Text>
          <TextInput placeholder="Male" style={{ borderWidth: 1, marginTop: 12.5, borderColor: '#979797', height: 35, paddingLeft: 10.5 }} />
          <Text style={{ color: '#1A1919', marginTop: 15.59 }}>Hair Length</Text>
          <TextInput placeholder="Short" style={{ borderWidth: 1, marginTop: 12.5, borderColor: '#979797', height: 35, paddingLeft: 10.5 }} />
          <Text style={{ color: '#1A1919', marginTop: 15.59 }}>Is your hair naturally coloured?</Text>
          <TextInput placeholder="Yes" style={{ borderWidth: 1, marginTop: 12.5, borderColor: '#979797', height: 35, paddingLeft: 10.5 }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20.59 }}>
            <Text style={{ borderBottomWidth: 1, color: '#17171A' }}>Privacy Policy</Text>
            <Text style={{ borderBottomWidth: 1, color: '#17171A' }}>Terms Of Service</Text>
            <Pressable onPress={() => onLogout()}>
              <Text style={{ borderBottomWidth: 1, color: '#17171A' }}>Logout</Text>
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
  }
})