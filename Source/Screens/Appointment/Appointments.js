import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Pressable
} from 'react-native';
import Header from '../../Components/Header'
import SelectDropdown from 'react-native-select-dropdown'

const countries = ["Egypt", "Canada", "Australia", "Ireland"]

const HelloWorldApp = (props) => {

  const renderUpcomingView = () => {
    return (
      <View style={styles.row}>
        <Image
          style={{ marginLeft: 26, marginTop: 14 }}
          source={require('../../Images/upcoming.png')}
        />
        <View style={{ marginTop: 29, marginLeft: 25 }}>
          <Text style={{ color: '#1A1919', fontSize: 16, fontFamily: 'Avenir-Heavy' }}>Short Hair</Text>
          <Text style={{ color: '#1A1919', marginTop: 2 }}>Tomorrow at 8:30 PM</Text>
          <Pressable style={{ borderWidth: 1, marginTop: 10.5 }} onPress={() => props.navigation.navigate('AppointmentsDescriptionScreen')}>
            <Text style={{ color: '#1A1919', marginLeft: 28.5, marginTop: 8.5, marginBottom: 8.5, marginRight: 27.5 }}>Look at booking</Text>
          </Pressable>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {
        <Header {...props} />
      }
      {
        <View>
          <Text style={styles.upcomingTextStyle}>Upcoming</Text>
          {renderUpcomingView()}
          <View
            style={{
              borderBottomColor: '#979797',
              borderBottomWidth: 1,
              marginTop: 39,
              marginLeft: 27,
              marginRight: 25
            }}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginRight: 33 }}>
            <Text style={{ fontSize: 16, color: '#1A1919', marginLeft: 27, marginTop: 38 }}>Passed</Text>
            <SelectDropdown
              data={countries}
              buttonStyle={{ backgroundColor: 'white', borderWidth: 1, borderColor: '#171717', height: 35, marginTop: 30, width: 166 }}
              onSelect={(selectedItem, index) => {
                console.log(selectedItem, index)
              }}
            // buttonTextAfterSelection={(selectedItem, index) => {
            //   // text represented after item is selected
            //   // if data array is an array of objects then return selectedItem.property to render after item is selected
            //   return selectedItem
            // }}
            // rowTextForSelection={(item, index) => {
            //   // text represented for each item in dropdown
            //   // if data array is an array of objects then return item.property to represent item in dropdown
            //   return item
            // }}
            />
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Image
              style={{ marginLeft: 26, marginTop: 14 }}
              source={require('../../Images/passed.png')}
            />
            <View style={{ marginTop: 29, marginLeft: 25 }}>
              <Text style={{ color: '#1A1919', fontSize: 16 }}>Hair Cut</Text>
              <Text style={{ color: '#1A1919', marginTop: 2 }}>Wed 11 Mar 2020</Text>
              <Pressable style={{ borderWidth: 1, marginTop: 10.5 }}>
                <Text style={{ color: '#1A1919', marginLeft: 28.5, marginTop: 8.5, marginBottom: 8.5, marginRight: 27.5 }}>Look at booking</Text>
              </Pressable>
            </View>
          </View>
        </View>
      }
    </View>
  )
}
export default HelloWorldApp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  row: {
    flexDirection: 'row',
  },
  upcomingTextStyle: {
    fontSize: 16,
    color: '#1A1919',
    marginLeft: 27,
    marginTop: 28,
    fontFamily: 'Avenir-Medium'
  }
})