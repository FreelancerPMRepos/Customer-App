import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, Pressable } from 'react-native';
import Header from '../../../Components/Header';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import axios from 'axios';
import { BASE_URL } from '../../../Config';


const ComplaintScreen = ({ navigation, route, props }) => {
    const [radioButton, setRadioButton] = useState('HairKut');
    const [complaint, setComplaint] = useState('');
    const { id } = route.params

    console.log("id",id)

    const _onBack = () => navigation.goBack()


    const _onSubmit = () => {
        if (complaint == '') {
            alert('Please Enter Complaint')
        } else {
            axios.post(`${BASE_URL}/complaint`, {
                store_id: id,
                complaint: complaint,
                type: radioButton
            })
            .then(res => {
                setComplaint('')
                alert(res.data.message)
                console.log('res complaint', res.data)
              })
              .catch(e => {
                console.log('e', e)
              })  
        }  
    }

    return (
        <View style={styles.container}>
            {
                <Header leftIcon='back' onLeftIconPress={_onBack} {...props} />
            }
            {
                <View>
                    <View style={{ marginLeft: 27, flexDirection: 'row', marginTop: 25 }}>
                        <Pressable onPress={() => setRadioButton('HairKut')} style={{ flexDirection: 'row' }}>
                            {
                                radioButton == 'HairKut' ?
                                    <Image
                                        style={{}}
                                        source={require('../../../Images/button_fill.png')}
                                    />
                                    :
                                    <Image
                                        style={{}}
                                        source={require('../../../Images/button_unfill.png')}
                                    />
                            }
                            <Text style={{ fontSize: 16, fontFamily: 'Avenir-Heavy', marginLeft: 6, lineHeight: 22 }}>Hairkut</Text>
                        </Pressable>
                        <Pressable onPress={() => setRadioButton('Store')} style={{ flexDirection: 'row' }}>
                            {
                                radioButton == 'Store' ?
                                <Image
                                style={{ marginLeft: 38 }}
                                source={require('../../../Images/button_fill.png')}
                            />
                            :
                            <Image
                                style={{ marginLeft: 38 }}
                                source={require('../../../Images/button_unfill.png')}
                            />
                            }
                            {/* <Image
                                style={{  }}
                                source={require('../../Images/button_unfill.png')}
                            /> */}
                            <Text style={{ fontSize: 16, fontFamily: 'Avenir-Heavy', marginLeft: 6, lineHeight: 22 }}>Salon</Text>
                        </Pressable>
                    </View>
                    <Text style={{ fontSize: 18, fontFamily: 'Avenir-Heavy', lineHeight: 25, marginLeft: 25, marginTop: 24 }}>Complaint</Text>
                    <TextInput
                        placeholder='Type your Complaint'
                        style={{ borderWidth: 1, borderColor: '#979797', marginLeft: 28.5, marginRight: 24.5, marginTop: 6.5, height: 122 }}
                        onChangeText={text => setComplaint(text)} value={complaint}
                    />
                    <Pressable style={{ justifyContent: 'center', alignSelf: 'center', borderWidth: 1, marginTop: 23 }} onPress={() => _onSubmit()}>
                        <Text style={{ fontFamily: 'Avenir-Medium', paddingTop: 8.5, paddingBottom: 7.5, paddingLeft: 49.5, paddingRight: 48.5, lineHeight: 19 }}>Submit</Text>
                    </Pressable>
                    <Pressable style={{ justifyContent: 'center', alignSelf: 'center', borderBottomWidth: 1, marginTop: 19 }}>
                        <Text style={{ fontFamily: 'Avenir-Medium', lineHeight: 19 }}>See Pass Complaints</Text>
                    </Pressable>
                </View>
            }
        </View>
    )
}
export default ComplaintScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    }
})