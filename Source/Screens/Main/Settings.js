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
  FlatList
} from 'react-native';

import Header from '../../Components/Header';
import { useDispatch } from 'react-redux';
import { resetAuth } from '../../Actions/AuthActions';
import axios from 'axios';
import { BASE_URL } from '../../Config';
import Loader from '../../Components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';

const Settings = (props) => {
  const [isLoading, setLoading] = useState(false)
  const [toggleCheckBox, setToggleCheckBox] = useState([])
  const [list, setList] = useState([]);
  const [userData, setUserData] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('');
  const [sex, setSex] = useState('');
  const [hairLength, setHairLength] = useState('');
  const [hairColor, setHairColor] = useState('');
  const dispatch = useDispatch()

  useEffect(() => {
    getService()
  }, [])

  const handleClick = (index) => {
    var temp = [];
    for (var i in list) {
      if (index == i) {
        list[index].isChecked = !list[index].isChecked;
      }

      temp.push(list[i]);
    }
    setToggleCheckBox(temp);
  };

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@user_details')
      const parData = jsonValue != null ? JSON.parse(jsonValue) : null;
      axios.get(`${BASE_URL}/customer/detail/${parData.id}`)
        .then(res => {
          setUserData(res.data.user_detail)
          console.log('res data', res.data)
          setLoading(false)

          var temp = []
          for (var i in list) {
            if (res.data.user_interest) {
              for (var j in res.data.user_interest) {
                if (res.data.user_interest[j].service_id == list[i].id) {
                  list[i].isChecked = true;
                }
              }

            }

            temp.push(list[i])
            if (i == 0) {
              setList(temp)
            }
          }

        })
        .catch(e => {
          console.log('e', e)
          setLoading(false)
        })
    } catch (e) {
      // error reading value
    }
  }

  const getService = () => {
    axios.get(`${BASE_URL}/service/all/list`)
      .then(res => {
        for (var i in res.data) {
          res.data[i].isChecked = false;
        }
        setList(res.data)
        setLoading(false)
        getData()
      })
      .catch(e => {
        console.log('err', e)
        setLoading(false)
      })
  }


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
        try {
          var googleLogOut = GoogleSignin.signOut();
          console.log("signout",googleLogOut)
         // this.setState({ user: null }); // Remember to remove the user from your app's state as well
        } catch (error) {
          console.error(error);
        }
        setLoading(false)
      })
      .catch(e => {
        console.log('e', e)
        setLoading(false)
      })
  }

  const _onSave = () => {
    // const jsonValue = await AsyncStorage.getItem('@user_details')
    // const parData = jsonValue != null ? JSON.parse(jsonValue) : null;
    var temp = [];

    for (var i = 0; i < list.length; i++) {
       alert(i)
      // if (list[i].isChecked == true) {
      //   // temp[list[i].id]
      // }
    }
    alert("got")
    console.log("temp", temp)
    // axios.put(`${BASE_URL}/customer`, {
    // //  id: parData.id,
    //   interest: temp
    // })
    //   .then(res => {
    //     console.log('res update', res.data)
    //     setLoading(false)
    //   })
    //   .catch(e => {
    //     console.log('e', e)
    //     setLoading(false)
    //   })
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
          <TextInput placeholder="Zoe Corby" onChangeText={text => setName(text)} value={name} style={styles.textInputStyle} />
          <Text style={styles.commonText}>Email</Text>
          <TextInput placeholder="zoe.corby@gmail.com" onChangeText={text => setEmail(text)} value={email} style={styles.textInputStyle} />
          <Text style={styles.commonText}>Password</Text>
          <TextInput placeholder="*********" onChangeText={text => setPassword(text)} value={password} style={styles.textInputStyle} />
          <Pressable style={styles.loactionpasswordButton} onPress={() => props.navigation.navigate('ResetPassword')}>
            <Text style={styles.resetPasswordText}>Reset Password</Text>
          </Pressable>
          <Text style={styles.commonText}>Location</Text>
          <TextInput placeholder="Auto Location Enabled" onChangeText={text => setLocation(text)} value={location} style={styles.textInputStyle} />
          <View style={styles.loactionpasswordButton}>
            <Text style={styles.changeLocationText}>Change Location</Text>
          </View>
          <Text style={styles.servicesText}>Which services are you interested in?</Text>
          <View style={{}}>
            <FlatList
              data={list}
              renderItem={({ item, index }) => {
                // console.log("item", item.upload_front_photo)
                return (
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} key={index}>
                    <CheckBox
                      key={index}
                      disabled={false}
                      value={item.isChecked}
                      onValueChange={() => handleClick(index)}
                      //   onValueChange={console.log("index", item.name, index)}
                      style={{ marginTop: 8 }}
                    />
                    <Text style={{ fontFamily: 'Avenir-Medium', lineHeight: 19, marginTop: 15 }}>{item.name}</Text>
                  </View>
                )
              }
              }
              numColumns={3}
              columnWrapperStyle={{ justifyContent: 'space-between' }}
            />
          </View>
          <Text style={styles.commonText}>Sex</Text>
          <TextInput placeholder="Male" onChangeText={text => setSex(text)} value={sex} style={styles.textInputStyle} />
          <Text style={styles.commonText}>Hair Length</Text>
          <TextInput placeholder="Short" onChangeText={text => setHairLength(text)} value={hairLength} style={styles.textInputStyle} />
          <Text style={styles.commonText}>Is your hair naturally coloured?</Text>
          <TextInput placeholder="Yes" onChangeText={text => setHairColor(text)} value={hairColor} style={styles.textInputStyle} />
          <Pressable style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 20.59
          }} onPress={() => _onSave()}>
            <Text style={styles.logoutText}>Save</Text>
          </Pressable>
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