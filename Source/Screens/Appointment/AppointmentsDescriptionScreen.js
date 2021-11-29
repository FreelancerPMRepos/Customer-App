import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Pressable
} from 'react-native';
import Header from '../../Components/Header'
import { Colors } from '../../Config';

const AppointmentsDescriptionScreen = (props) => {

  const _onBack = () => props.navigation.goBack()

  return (
    <View style={styles.container}>
      {
        <Header leftIcon='back' onLeftIconPress={_onBack} {...props} />
      }
      {
        <View>
          <View style={{flexDirection: 'row'}}>
            <Image
              style={{ marginLeft: 27, marginTop: 28 }}
              source={require('../../Images/upcoming.png')}
            />
            <View style={{marginLeft: 32, marginTop: 28}}>
              <Text style={{color: '#1A1919', fontSize: 16, fontFamily: 'Avenir-Heavy'}}>Short Hair</Text>
              <Text style={{color: '#1A1919', fontSize: 14, fontFamily: 'Avenir-Medium'}}>Tomorrow at 8:30 PM</Text>
              <Text style={{color: '#1A1919', fontSize: 16, fontFamily: 'Avenir-Heavy', marginTop: 5}}>Location</Text>
              <Text style={{color: '#1A1919', fontSize: 14, fontFamily: 'Avenir-Medium'}}>Tommy Hair Spa</Text>
            </View>
          </View>
          <Text style={{color: '#1A1919', fontSize: 16, fontFamily: 'Avenir-Heavy', marginLeft: 27, marginTop: 28}}>Description</Text>
          <Text style={{color: '#1A1919', fontSize: 14, fontFamily: 'Avenir-Medium', marginLeft: 27, marginRight: 27, marginTop: 5.09}}>A short base, via electric razor. Over that a layer that reaches just beyond the eyebrows at the front, just above the ear either side</Text>
          <Text style={{color: '#1A1919', fontSize: 16, fontFamily: 'Avenir-Heavy', marginLeft: 27, marginTop: 13}}>Notes</Text>
          <Text style={{color: '#1A1919', fontSize: 14, fontFamily: 'Avenir-Medium', marginLeft: 27, marginRight: 27, marginTop: 5.09}}>Use only lakme products.</Text>
          <Pressable style={[styles.button,{ marginTop: 26.5 }]}>
            <Text style={styles.buttonText}>Add Notes</Text>
          </Pressable>
          <Pressable style={[styles.button,{ marginTop: 13}]}>
            <Text style={styles.buttonText}>Reschedule</Text>
          </Pressable>
          <Pressable style={[styles.button,{ marginTop: 13}]}>
            <Text style={styles.buttonText}>Cancel Booking</Text>
          </Pressable>
        </View>
      }
    </View>
  )
}
export default AppointmentsDescriptionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  button: {
    borderWidth: 1, 
    borderColor: Colors.greyLight, 
    marginLeft: 122.5, 
    marginRight: 122.5, 
  },
  buttonText: {
    textAlign: 'center',
    color: Colors.black, 
    fontSize: 14, 
    fontFamily: 'Avenir-Medium', 
    marginTop: 9.5, 
    marginBottom: 6.5, 
  }
})