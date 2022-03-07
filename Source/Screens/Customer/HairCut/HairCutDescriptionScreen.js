import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import Header from '../../../Components/Header'
import { BASE_URL, Colors, height, width } from '../../../Config';
import { useDispatch, useSelector } from 'react-redux'
import { addSalon } from '../../../Actions/PickSalon'


const HairCutDescriptionScreen = ({ navigation, route, props }) => {
  const { id } = route.params
  const [modalVisible, setModalVisible] = useState(false);
  const [list, setList] = useState([]);
  const [noteData, setNoteData] = useState([]);
  const [note, setNote] = useState('');
  const dispatch = useDispatch()

  const _onBack = () => navigation.goBack()

  useEffect(() => {
    getDetails()
    getNote()
  }, [])

  const getDetails = () => {
    console.log("Asd",id)
    axios.get(`${BASE_URL}/style/detail/${id}`)
      .then(res => {
        setList(res.data)
      })
      .catch(e => {
        console.log('e', e)
      })
  }

  const getNote = () => {
    axios.get(`${BASE_URL}/note/style/list/${id}`)
      .then(res => {
        setNoteData(res.data)
      })
      .catch(e => {
        console.log('e', e)
      })
  }

  const _onNoteSave = () => {
    if (note == '') {
      alert('Please enter note')
    } else {
      axios.post(`${BASE_URL}/note/style`, {
        style_id: id,
        note: note,
      })
        .then(res => {
          alert(res.data.message)
          getNote()
          setNote('')
          setModalVisible(!modalVisible)
        })
        .catch(e => {
          console.log('e', e)
        })
    }
  }

  const _onPick = () => {
    const user = list
    dispatch(addSalon(user))
    alert('Salon Picked')
    navigation.navigate('HomeTabs', {
      screen: 'Home'
    })
  }

  const renderAddNoteModal = () => {
    return (
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
            <Pressable style={{ justifyContent: 'flex-end', alignSelf: 'flex-end' }} onPress={() => setModalVisible(!modalVisible)}>
              <Image
                style={{ marginRight: 14.49, marginTop: 18.5 }}
                source={require('../../../Images/cross.png')}
              />
            </Pressable>
            <Text style={{ color: '#1A1919', fontSize: 18, fontFamily: 'Avenir-Heavy', marginLeft: 14.5 }}>Add Note</Text>
            <View style={{ borderWidth: 1, borderColor: '#979797', marginLeft: 13, marginTop: 13.5, marginRight: 12, height: 120 }}>
              <TextInput placeholder="Type your note" style={{}} multiline={true} onChangeText={text => setNote(text)} value={note} />
            </View>
            <Pressable style={{ borderWidth: 1, borderColor: '#171717', marginLeft: 96, marginRight: 96, marginTop: 21, marginBottom: 26 }} onPress={() => _onNoteSave()}>
              <Text style={{ color: '#1A1919', fontSize: 14, fontFamily: 'Avenir-Medium', textAlign: 'center', marginTop: 8.5, marginBottom: 7.5 }} >SAVE</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    )
  }

  return (
    <View style={styles.container}>
      {
        <Header leftIcon='back' onLeftIconPress={_onBack} {...props} />
      }
      {
        <ScrollView>
          {renderAddNoteModal()}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.afroHairTextStyle}>{list.name}</Text>
            <Image
              style={{ marginTop: 5, marginRight: 29 }}
              source={require('../../../Images/black_heart.png')}
            />
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {
              list.upload_front_photo == null ?
                null
                :
                <Image
                  style={{ marginLeft: 26, marginTop: 15, height: height * 0.16, width: width * 0.26, }}
                  source={{
                    uri: list.upload_front_photo,
                  }}
                />
            }
            {
              list.upload_back_photo == null ?
                null
                :
                <Image
                  style={{ marginLeft: 12, marginTop: 15, height: height * 0.16, width: width * 0.26, }}
                  source={{
                    uri: list.upload_back_photo,
                  }}
                />
            }
            {
              list.upload_right_photo == null ?
                null
                :
                <Image
                  style={{ marginLeft: 12, marginTop: 15, height: height * 0.16, width: width * 0.26, marginRight: 26 }}
                  source={{
                    uri: list.upload_right_photo,
                  }}
                />
            }
            {
              list.upload_left_photo == null ?
                null
                :
                <Image
                  style={{ marginLeft: 26, marginTop: 14, height: height * 0.16, width: width * 0.26, }}
                  source={{
                    uri: list.upload_left_photo,
                  }}
                />
            }
            {
              list.upload_top_photo === null ?
                null
                :
                <Image
                  style={{ marginLeft: 12, marginTop: 14, height: height * 0.16, width: width * 0.26, }}
                  source={{
                    uri: list.upload_top_photo,
                  }}
                />
            }
          </View>


          <Text style={[styles.title, { marginTop: 25 }]}>DESCRIPTION</Text>
          <Text style={styles.subTitle}>{list.description}</Text>
          <Text style={[styles.title, { marginTop: 15 }]}>NOTES</Text>
          {
            noteData.map((res) => {
              return (
                <Text style={styles.subTitle}>{res.note}</Text>
              )
            })
          }
          <Pressable onPress={() => setModalVisible(true)}>
            <Image
              style={{ marginLeft: 27, marginTop: 14 }}
              source={require('../../../Images/plus.png')}
            />
          </Pressable>
          <Pressable style={styles.button} onPress={() => _onPick()}>
            <Text style={styles.buttonText}>PICK SALON</Text>
          </Pressable>
        </ScrollView>
      }
    </View>
  )
}
export default HairCutDescriptionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  afroHairTextStyle: {
    color: Colors.black,
    fontSize: 16,
    fontFamily: 'Avenir-Medium',
    marginLeft: 27,
    //  marginTop: 25
  },
  title: {
    color: Colors.black,
    fontSize: 14,
    fontFamily: 'Avenir-Heavy',
    marginLeft: 27
  },
  subTitle: {
    color: Colors.black,
    fontSize: 14,
    fontFamily: 'Avenir-Medium',
    marginLeft: 27,
    marginTop: 3,
    marginRight: 30
  },
  GridViewBlockStyle: {
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
    marginRight: 20
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: Colors.white,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderWidth: 1,
    borderColor: Colors.greyLight,
    marginLeft: 122.5,
    marginRight: 122.5,
    marginTop: 26.5,
    marginBottom: 15
  },
  buttonText: {
    color: Colors.black,
    fontSize: 14,
    fontFamily: 'Avenir-Medium',
    // marginLeft: 29.5,
    marginTop: 9.5,
    marginBottom: 6.5,
    textAlign: 'center'
    //   marginRight: 28.5
  }
})