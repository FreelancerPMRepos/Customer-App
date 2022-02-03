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
  FlatList,
  Image
} from 'react-native';

import Header from '../../../Components/Header';
import { useDispatch } from 'react-redux';
import { resetAuth } from '../../../Actions/AuthActions';
import axios from 'axios';
import { BASE_URL } from '../../../Config';
import Loader from '../../../Components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {
  LoginManager, AccessToken,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk'
import SelectDropdown from 'react-native-select-dropdown'

const sex_dropdown = ["MALE", "FEMALE"]
const hair_length = ["SHORT", "MEDIUM", "LONG",]
const color = ["YES", "NO",]

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


  const getService = () => {
    setLoading(true)
    axios.get(`${BASE_URL}/service/all/list`)
      .then(res => {
        for (var i in res.data) {
          res.data[i].isChecked = false;
        }
        setList(res.data)
        setLoading(false)
        getData(res.data)
      })
      .catch(e => {
        console.log('err', e)
        setLoading(false)
      })
  }

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

  const getData = async (data) => {
    setLoading(true)
    console.log("yaha aaya")
    try {
      const jsonValue = await AsyncStorage.getItem('@user_details')
      const parData = jsonValue != null ? JSON.parse(jsonValue) : null;
      axios.get(`${BASE_URL}/customer/detail/${parData.id}`)
        .then(res => {
          setUserData(res.data.user_detail)
          setName(res.data.user_detail.name)
          setEmail(res.data.user_detail.email)
          setLocation(res.data.user_detail.address)
          setSex(res.data.user_detail.gender)
          setHairLength(res.data.user_detail.hair_length)
          setHairColor(res.data.user_detail.hair_colour_is_natural)
          setSex(res.data.user_detail.gender)
          setLoading(false)
          console.log("new list", data)

          var temp = []
          //  data.map((res, i) => {
          //     console.log("reskjnj",i)
          //     res?.data?.user_interest?.map((res, j) => {
          //       if (res?.data.user_interest[j].service_id == data[i].id) {
          //         data[i].isChecked = true;
          //       }
          //     })
          //     temp.push(data[i])
          //     if (i == 0) {
          //  //     alert(temp)
          //       setList(temp)
          //     }
          //   })


          for (var i in data) {
            if (res.data.user_interest) {
              for (var j in res.data.user_interest) {
                if (res.data.user_interest[j].service_id == data[i].id) {
                  data[i].isChecked = true;
                }
              }

            }

            temp.push(data[i])
            if (i == 0) {
              setList(temp)
            }
          }

        })
        .catch(e => {
          console.log('er', e)
          setLoading(false)
        })
    } catch (e) {
      // error reading value
      setLoading(false)
    }
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
          console.log("signout", googleLogOut)
          // this.setState({ user: null }); // Remember to remove the user from your app's state as well
          fbLogout();
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

  const fbLogout = async () => {
    let remove_google = await AsyncStorage.removeItem('@google_email')
    const jsonValue = await AsyncStorage.getItem('facebook_token')
    const parData = jsonValue != null ? JSON.parse(jsonValue) : null;
    // let logout = LoginManager.logOut();
    // // const token = await AccessToken.getCurrentAccessToken();
    // console.log("facebook logout token",logout)
    if (parData == null) {

    } else {
      let logout =
        new GraphRequest(
          "me/permissions/",
          {
            accessToken: parData,
            httpMethod: 'DELETE'
          },
          (error, result) => {
            if (error) {
              console.log('Error fetching data: ' + error.toString());
            } else {
              LoginManager.logOut();
              remove_token();
            }
          });
      new GraphRequestManager().addRequest(logout).start();
    }
  }

  const remove_token = async () => {
    let token = await AsyncStorage.removeItem('facebook_token')
    console.log("remove_token", token)
  }

  const _onSave = async () => {
    const jsonValue = await AsyncStorage.getItem('@user_details')
    const parData = jsonValue != null ? JSON.parse(jsonValue) : null;
    var temp = [];
    // for (var i = 0; i < list.length; i++) {
    //    alert(i)
    //   // if (list[i].isChecked == true) {
    //   //   // temp[list[i].id]
    //   // }
    // }
    toggleCheckBox.map((res, index) => {
      if (res.isChecked == true) {
        //    alert(res.id)
        temp.push(res.id)
      }
      // temp[toggleCheckBox[index].id]
    })
    //  alert("got")
    console.log("temp", temp)
    axios.put(`${BASE_URL}/customer`, {
      id: parData.id,
      name: name,
      email: email,
      address: location,
      gender: sex,
      hair_length: hairLength,
      hair_colour_is_natural: hairColor,
      interest: temp
    })
      .then(res => {
        console.log('res update', res.data)
        alert(res.data.message)
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
          {/* <TextInput placeholder="Male" onChangeText={text => setSex(text)} value={sex} style={styles.textInputStyle} /> */}
          <SelectDropdown
            data={sex_dropdown}
            renderDropdownIcon={() => {
              return (
                <Image
                  style={{ marginLeft: 36, marginRight: 6.36 }}
                  source={require('../../../Images/Triangle.png')}
                />
              )
            }}
            dropdownIconPosition={"right"}
            rowTextStyle={styles.dropdown1RowTxtStyle}
            buttonTextStyle={{ textAlign: 'left', marginLeft: 10.5, fontSize: 12 }}
            buttonStyle={{ height: 35, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#979797', marginTop: 7.5, width: 336 }}
            defaultValue={sex}
            onSelect={(selectedItem, index) => {
              setSex(selectedItem)
              console.log(selectedItem, index)
            }}
          />
          <Text style={styles.commonText}>Hair Length</Text>
          {/* <TextInput placeholder="Short" onChangeText={text => setHairLength(text)} value={hairLength} style={styles.textInputStyle} /> */}
          <SelectDropdown
            data={hair_length}
            renderDropdownIcon={() => {
              return (
                <Image
                  style={{ marginLeft: 36, marginRight: 6.36 }}
                  source={require('../../../Images/Triangle.png')}
                />
              )
            }}
            dropdownIconPosition={"right"}
            rowTextStyle={styles.dropdown1RowTxtStyle}
            buttonTextStyle={{ textAlign: 'left', marginLeft: 10.5, fontSize: 12 }}
            buttonStyle={{ height: 35, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#979797', marginTop: 7.5, width: 336 }}
            defaultValue={hairLength}
            onSelect={(selectedItem, index) => {
              setHairLength(selectedItem)
              console.log(selectedItem, index)
            }}
          />
          <Text style={styles.commonText}>Is your hair naturally coloured?</Text>
          {/* <TextInput placeholder="Yes" onChangeText={text => setHairColor(text)} value={hairColor} style={styles.textInputStyle} /> */}
          <SelectDropdown
            data={color}
            renderDropdownIcon={() => {
              return (
                <Image
                  style={{ marginLeft: 36, marginRight: 6.36 }}
                  source={require('../../../Images/Triangle.png')}
                />
              )
            }}
            dropdownIconPosition={"right"}
            rowTextStyle={styles.dropdown1RowTxtStyle}
            buttonTextStyle={{ textAlign: 'left', marginLeft: 10.5, fontSize: 12 }}
            buttonStyle={{ height: 35, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#979797', marginTop: 7.5, width: 336 }}
            defaultValue={hairColor}
            onSelect={(selectedItem, index) => {
              setHairColor(selectedItem)
              console.log(selectedItem, index)
            }}
          />
          <Pressable style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 20.59
          }} onPress={() => _onSave()}>
            <Text style={styles.logoutText}>Save</Text>
          </Pressable>
          <View style={styles.bottomButtonView}>
            <Pressable onPress={() => props.navigation.navigate('PrivacyPolicy', { name: 'privacy'})}>
            <Text style={styles.privacyPolicyText}>Privacy Policy</Text>
            </Pressable>
            <Pressable onPress={() => props.navigation.navigate('PrivacyPolicy', { name: 'terms'})}>
            <Text style={styles.termsServiceText}>Terms Of Service</Text>
            </Pressable>
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
  },
  dropdown1RowTxtStyle: {
    color: "#444",
    textAlign: "left"
  },
})