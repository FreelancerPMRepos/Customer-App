import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Pressable,
  FlatList,
  Image,
  ScrollView,
  Modal
} from 'react-native';
import Header from '../../Components/Header'

const GridViewItems = [
  { key: '1' },
  { key: '2' },
  { key: '3' },
]

const HelloWorldApp = (props) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <ScrollView style={styles.container}>
      {
        <Header {...props} />
      }
      {
        <View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: '#1A1919', fontSize: 18, marginLeft: 130, marginTop: 14.5, fontFamily: 'Avenir-Heavy' }}>Select Tags</Text>
                  <Pressable onPress={() => setModalVisible(!modalVisible)}>
                    <Image
                      style={{ marginRight: 13.45, marginTop: 16.5 }}
                      source={require('../../Images/cross.png')}
                    />
                  </Pressable>
                </View>
                <View style={{ backgroundColor: '#D8D8D8', marginLeft: 7.5, marginTop: 8, borderRadius: 5, flexDirection: 'row' }}>
                  <View style={{ backgroundColor: '#141313', marginTop: 11, marginLeft: 10, marginBottom: 11, width: 75, borderRadius: 5 }}>
                    <Text style={{ color: '#FFFFFF', textAlign: 'center', marginTop: 8, marginBottom: 7 }}>Haircut</Text>
                  </View>
                  <Text style={{ color: '#000000', fontSize: 14, fontFamily: 'Avenir-Heavy', marginLeft: 25, marginTop: 15 }}>Updo</Text>
                  <Text style={{ color: '#000000', fontSize: 14, fontFamily: 'Avenir-Heavy', marginLeft: 25, marginTop: 15 }}>Blowout</Text>
                  <Text style={{ color: '#000000', fontSize: 14, fontFamily: 'Avenir-Heavy', marginLeft: 25, marginTop: 15 }}>Dyes</Text>
                </View>
                <View style={{ flexDirection: 'row', marginLeft: 17.5, marginTop: 18, marginBottom: 44.5}}>
                  <View style={{ backgroundColor: '#4D4C4C', borderRadius: 17 }}>
                    <Text style={{ color: '#FFFFFF', fontSize: 14, fontFamily: 'Avenir-Heavy', textAlign: 'center', marginLeft: 19, marginTop: 8, marginBottom: 7, marginRight: 20 }}>Bald</Text>
                  </View>
                  <View style={{ backgroundColor: '#D8D8D8', borderRadius: 17, marginLeft: 4 }}>
                    <Text style={{ color: '#1A1919', fontSize: 14, fontFamily: 'Avenir-Heavy', textAlign: 'center', marginLeft: 19, marginTop: 8, marginBottom: 7, marginRight: 20 }}>Mullet</Text>
                  </View>
                </View>
              </View>
            </View>
          </Modal>



          <TextInput placeholder="Search By Styles" style={{ borderWidth: 1, marginLeft: 26.5, marginRight: 26.5, paddingLeft: 18.5 }} />
          <Pressable style={{ backgroundColor: '#010101', marginLeft: 27, marginTop: 16.5, marginRight: 27 }} onPress={() => setModalVisible(true)}>
            <Text style={{ color: '#FFFFFF', fontSize: 16, marginLeft: 18, marginTop: 15.50, marginBottom: 17 }}>Tags</Text>
          </Pressable>
          <Text style={{ color: '#1A1919', fontSize: 16, marginLeft: 28, marginTop: 26.67 }}>Top Cuts</Text>
          <FlatList
            data={GridViewItems}
            renderItem={({ item }) =>
              <View style={styles.GridViewBlockStyle}>
                <Image
                  style={{ marginLeft: 26, marginTop: 14 }}
                  source={require('../../Images/upcoming.png')}
                />
                {/* <Text style={styles.GridViewInsideTextItemStyle} onPress={GetGridViewItem.bind(this, item.key)} > {item.key} </Text> */}
              </View>}
            numColumns={3}
          />
          <Text style={{ color: '#1A1919', fontSize: 16, marginLeft: 28, marginTop: 25 }}>Popular Styles</Text>
          <FlatList
            data={GridViewItems}
            renderItem={({ item }) =>
              <View style={styles.GridViewBlockStyle}>
                <Image
                  style={{ marginLeft: 26, marginTop: 14 }}
                  source={require('../../Images/upcoming.png')}
                />
                {/* <Text style={styles.GridViewInsideTextItemStyle} onPress={GetGridViewItem.bind(this, item.key)} > {item.key} </Text> */}
              </View>}
            numColumns={3}
          />
        </View>
      }
    </ScrollView>
  )
}
export default HelloWorldApp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  GridViewBlockStyle: {
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
    marginRight: 20
    //  height: 100,
    //  margin: 5,
    // backgroundColor: '#00BCD4'
  },
  GridViewInsideTextItemStyle: {
    color: '#fff',
    padding: 10,
    fontSize: 18,
    justifyContent: 'center',
  },
  centeredView: {
    flex: 1,
    // justifyContent: "center",
    //   alignItems: "center",
    marginTop: 107.5
  },
  modalView: {
    margin: 15,
    backgroundColor: "white",
    //   borderRadius: 20,
    //   padding: 35,
    //   alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
})