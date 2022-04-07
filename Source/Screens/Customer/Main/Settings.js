import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
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
import { BASE_URL, width } from '../../../Config';
import Loader from '../../../Components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';
import {
  GoogleSignin,
} from '@react-native-google-signin/google-signin';

import {
  LoginManager,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk'
import SelectDropdown from 'react-native-select-dropdown';
import { showMessageAlert } from '../../../Utils/Utility';

const sex_dropdown = ["MALE", "FEMALE"]
const hair_length = ["SHORT", "MEDIUM", "LONG",]
const color = ["YES", "NO",]

const Settings = ({navigation,props}) => {
  const [isLoading, setLoading] = useState(false)
  const [id, setId] = useState('')
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
    const unsubscribe = navigation.addListener('focus', () => {
      getService()
    });

    return unsubscribe;
  }, [navigation])


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
    try {
      const jsonValue = await AsyncStorage.getItem('@user_details')
      const parData = jsonValue != null ? JSON.parse(jsonValue) : null;
      setId(parData.id)
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

          var temp = []
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
    toggleCheckBox.map((res, index) => {
      if (res.isChecked == true) {
        temp.push(res.id)
      }
    })
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
        showMessageAlert(res.data.message)
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
          <Pressable style={styles.loactionpasswordButton} onPress={() => navigation.navigate('ProfileResetPassword')}>
            <Text style={styles.resetPasswordText}>Reset Password</Text>
          </Pressable>
          <Text style={styles.commonText}>Location</Text>
          <TextInput placeholder="Auto Location Enabled" onChangeText={text => setLocation(text)} value={location} style={styles.textInputStyle} />
          <Pressable style={styles.loactionpasswordButton} onPress={() => navigation.navigate('ChangeLocation', { id: id })}>
            <Text style={styles.changeLocationText}>Change Location</Text>
          </Pressable>
          <Text style={styles.servicesText}>Which services are you interested in?</Text>
          <View style={{ flexWrap: 'wrap' }}>
            <FlatList
              data={list}
              renderItem={({ item, index }) => {
                return (
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: width * 0.28 }} key={index}>
                    <CheckBox
                      key={index}
                      disabled={false}
                      value={item.isChecked}
                      onValueChange={() => handleClick(index)}
                      style={{ marginTop: 8 }}
                    />
                    <Text style={{ fontFamily: 'Avenir-Medium', lineHeight: 19, marginTop: 15 }}>{item.name}</Text>
                  </View>
                )
              }
              }
              numColumns={3}
              columnWrapperStyle={{ flexWrap: 'wrap' }}
            />
          </View>
          <Text style={styles.commonText}>Sex</Text>
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
            buttonStyle={{ height: 35, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#979797', marginTop: 7.5, width: width * 0.87 }}
            defaultValue={sex}
            onSelect={(selectedItem, index) => {
              setSex(selectedItem)
              console.log(selectedItem, index)
            }}
          />
          <Text style={styles.commonText}>Hair Length</Text>
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
            buttonStyle={{ height: 35, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#979797', marginTop: 7.5, width: width * 0.87 }}
            defaultValue={hairLength}
            onSelect={(selectedItem, index) => {
              setHairLength(selectedItem)
              console.log(selectedItem, index)
            }}
          />
          <Text style={styles.commonText}>Is your hair naturally coloured?</Text>
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
            buttonStyle={{ height: 35, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#979797', marginTop: 7.5, width: width * 0.87 }}
            defaultValue={hairColor}
            onSelect={(selectedItem, index) => {
              setHairColor(selectedItem)
              console.log(selectedItem, index)
            }}
          />
          <Pressable style={styles.saveButton} onPress={() => _onSave()}>
            <Text style={styles.saveButtonText}>Save</Text>
          </Pressable>
          <View style={styles.bottomButtonView}>
            <Pressable onPress={() => navigation.navigate('PrivacyPolicy', { name: 'privacy' })}>
              <Text style={styles.privacyPolicyText}>Privacy Policy</Text>
            </Pressable>
            <Pressable onPress={() => navigation.navigate('PrivacyPolicy', { name: 'terms' })}>
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
  saveButtonText: {
    borderWidth: 1,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
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
  saveButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20.59
  }
})