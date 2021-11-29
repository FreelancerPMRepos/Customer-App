import React from 'react';
import { 
  Text, 
  View,
  StyleSheet,
  FlatList,
  Image,
  Pressable
} from 'react-native';
import Header from '../../Components/Header'

const GridViewItems = [
  { key: '1' },
  { key: '2' },
  { key: '3' },
]

const HelloWorldApp = (props) => {
  return (
   <View style={styles.container}>
      {
        <Header {...props} />
      }
      {
        <View>
          <Text style={{color: '#1A1919', fontSize: 16, marginLeft: 27, marginTop: 28, fontFamily: 'Avenir-Heavy'}}>Saved and Custom Styles</Text>
          <Text style={{color: '#1A1919', fontSize: 16, fontFamily: 'Avenir-Medium', marginLeft: 27, marginTop: 34.67}}>Haircuts</Text>
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
          <Text style={{color: '#1A1919', fontSize: 16, fontFamily: 'Avenir-Medium', marginLeft: 27, marginTop: 14.67}}>Dyes</Text>
          <FlatList
            data={GridViewItems}
            renderItem={({ item }) =>
              <Pressable style={styles.GridViewBlockStyle} onPress={() => props.navigation.navigate('HairCutDescriptionScreen')}>
                <Image
                  style={{ marginLeft: 26, marginTop: 14 }}
                  source={require('../../Images/upcoming.png')}
                />
                {/* <Text style={styles.GridViewInsideTextItemStyle} onPress={GetGridViewItem.bind(this, item.key)} > {item.key} </Text> */}
              </Pressable>}
            numColumns={3}
          />
          <Text style={{color: '#1A1919', fontSize: 16, fontFamily: 'Avenir-Medium', marginLeft: 27, marginTop: 14.67}}>Nails</Text>
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
   </View>
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
})