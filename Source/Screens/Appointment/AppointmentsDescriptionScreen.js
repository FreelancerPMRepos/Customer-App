import axios from 'axios';
import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Pressable,
  Modal,
  TextInput
} from 'react-native';
import Header from '../../Components/Header'
import { BASE_URL, Colors, IMAGE_URL } from '../../Config';

const AppointmentsDescriptionScreen = ({ navigation, route, props }) => {
  const [isLoading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);
  const [note, setNote] = useState('');
  const { appointmentDetails } = route.params

  console.log("Asdf", appointmentDetails.style.upload_front_photo)

  const _onBack = () => navigation.goBack()

  const addNote = () => {
    if (note == '') {
      alert('Please Enter Note')
    } else {
      axios.post(`${BASE_URL}/note`, {
        booking_id: appointmentDetails.id,
        note: note,
      })
        .then(res => {
          console.log('res appointment', res.data)
          setModalVisible(!modalVisible);
          setNote('');
          setLoading(false)
        })
        .catch(e => {
          console.log('e', e)
          setLoading(false)
        })
    }
  }

  const onCancelYes = () => {
    setCancelModal(!cancelModal)
    _onBack()
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
                source={require('../../Images/cross.png')}
              />
            </Pressable>
            <Text style={{ color: '#1A1919', fontSize: 18, fontFamily: 'Avenir-Heavy', marginLeft: 14.5 }}>Add Note</Text>
            <TextInput placeholder="Type Your Note" style={{ borderWidth: 1, borderColor: '#979797', marginLeft: 13, marginTop: 13.5, marginRight: 12, height: 122 }} multiline={true} onChangeText={text => setNote(text)} value={note} />
            <Pressable style={{ borderWidth: 1, borderColor: '#171717', marginLeft: 96, marginRight: 96, marginTop: 21, marginBottom: 26 }} onPress={() => addNote()}>
              <Text style={{ color: '#1A1919', fontSize: 14, fontFamily: 'Avenir-Medium', marginLeft: 55.5, marginRight: 53.5, marginTop: 8.5, marginBottom: 7.5 }}>ADD</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    )
  }

  const renderCancelModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={cancelModal}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setCancelModal(!cancelModal);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Pressable style={{ justifyContent: 'flex-end', alignSelf: 'flex-end' }} onPress={() => setCancelModal(!cancelModal)}>
              <Image
                style={{ marginRight: 14.49, marginTop: 18.5 }}
                source={require('../../Images/cross.png')}
              />
            </Pressable>
            <Text style={{ color: '#1A1919', fontSize: 18, fontFamily: 'Avenir-Heavy', marginLeft: 55, marginRight: 55, textAlign: 'center' }}>Are you sure you want to cancel your booking?</Text>
            <View style={{flexDirection: 'row'}}>
              <Pressable style={{ borderWidth: 1, borderColor: '#171717', marginLeft: 26.5, marginTop: 21, marginBottom: 26 }} onPress={() => onCancelYes()}>
                <Text style={{ color: '#1A1919', fontSize: 14, fontFamily: 'Avenir-Medium', marginLeft: 55.5, marginRight: 53.5, marginTop: 8.5, marginBottom: 7.5 }}>Yes</Text>
              </Pressable>
              <Pressable style={{ borderWidth: 1, borderColor: '#171717', marginLeft: 20, marginTop: 21, marginBottom: 26}} onPress={() => setCancelModal(!cancelModal)}>
                <Text style={{ color: '#1A1919', fontSize: 14, fontFamily: 'Avenir-Medium', marginLeft: 55.5, marginRight: 53.5, marginTop: 8.5, marginBottom: 7.5}}>No</Text>
              </Pressable>
            </View>
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
        <View>
          {renderAddNoteModal()}
          {renderCancelModal()}
          <View style={{ flexDirection: 'row' }}>
            <Image
              style={{ marginLeft: 27, marginTop: 28, height: 118, width: 103, }}
              source={{
                uri: `${IMAGE_URL}/${appointmentDetails.style.upload_front_photo}`,
              }}
            />
            <View style={{ marginLeft: 32, marginTop: 28 }}>
              <Text style={{ color: '#1A1919', fontSize: 16, fontFamily: 'Avenir-Heavy' }}>{appointmentDetails.style.name}</Text>
              <Text style={{ color: '#1A1919', fontSize: 14, fontFamily: 'Avenir-Medium' }}>Tomorrow at 8:30 PM</Text>
              <Text style={{ color: '#1A1919', fontSize: 16, fontFamily: 'Avenir-Heavy', marginTop: 5 }}>Location</Text>
              <Text style={{ color: '#1A1919', fontSize: 14, fontFamily: 'Avenir-Medium' }}>{appointmentDetails.store.store_name}</Text>
            </View>
          </View>
          <Text style={{ color: '#1A1919', fontSize: 16, fontFamily: 'Avenir-Heavy', marginLeft: 27, marginTop: 28 }}>Description</Text>
          <Text style={{ color: '#1A1919', fontSize: 14, fontFamily: 'Avenir-Medium', marginLeft: 27, marginRight: 27, marginTop: 5.09 }}>{appointmentDetails.style.description}</Text>
          <Text style={{ color: '#1A1919', fontSize: 16, fontFamily: 'Avenir-Heavy', marginLeft: 27, marginTop: 13 }}>Notes</Text>
          <Text style={{ color: '#1A1919', fontSize: 14, fontFamily: 'Avenir-Medium', marginLeft: 27, marginRight: 27, marginTop: 5.09 }}>Use only lakme products.</Text>
          <Pressable style={[styles.button, { marginTop: 26.5 }]} onPress={() => setModalVisible(!modalVisible)}>
            <Text style={styles.buttonText}>Add Notes</Text>
          </Pressable>
          <Pressable style={[styles.button, { marginTop: 13 }]}>
            <Text style={styles.buttonText}>Reschedule</Text>
          </Pressable>
          <Pressable style={[styles.button, { marginTop: 13 }]} onPress={() => setCancelModal(!cancelModal)}>
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
})