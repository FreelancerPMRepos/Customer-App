import axios from 'axios';
import React, { useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    TextInput,
    Pressable
} from 'react-native';
import Header from '../../Components/Header';
import { BASE_URL, width } from '../../Config/index'

const ResetPassword = (props) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const _onBack = () => props.navigation.goBack()

    const _onReset = () => {
        if (oldPassword == '') {
            alert('Please Enter Old Password')
        } else if (newPassword == '') {
            alert('Please Enter New Password')
        } else if (confirmPassword == '') {
            alert('Please Enter Confirm Password')
        } else if (newPassword !== confirmPassword) {
            alert('New password is not same as confirm password')
        } else {
            axios.put(`${BASE_URL}/reset/password`, {
                old_password: oldPassword,
                new_password: newPassword
            })
                .then(res => {
                    console.log("res reset password", res.data)
                    alert(res.data.message)
                    setOldPassword('')
                    setNewPassword('')
                    setConfirmPassword('')
                })
                .catch(e => {
                    console.log('e', e)
                    alert(e)
                })
        }
    }

    return (
        <View style={styles.container}>
            {
                <Header leftIcon='back' onLeftIconPress={_onBack} {...props} />
            }
            {
                <View style={{ flex: 1 }}>
                    <Text style={styles.resetPasswordText}>Reset Password</Text>
                    <Image
                        style={styles.tinyLogo}
                        source={require('../../Images/reset.png')}
                    />
                    <Text style={styles.titleText}>Please enter new password.</Text>
                    <TextInput placeholder="Old Password" onChangeText={text => setOldPassword(text)} value={oldPassword} style={styles.textinputStyle} />
                    <TextInput placeholder="New Password" onChangeText={text => setNewPassword(text)} value={newPassword} style={styles.textinputStyle} />
                    <TextInput placeholder="Confirm New Password" onChangeText={text => setConfirmPassword(text)} value={confirmPassword} style={styles.textinputStyle} />
                    <Pressable style={styles.resetButton} onPress={() => _onReset()}>
                        <Text style={styles.buttonText}>Reset</Text>
                    </Pressable>
                </View>
            }
        </View>
    )
}
export default ResetPassword;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    tinyLogo: {
        marginLeft: 150,
        marginTop: 17
    },
    resetPasswordText: {
        fontSize: 16,
        fontFamily: 'Avenir-Heavy',
        marginLeft: 129,
        marginTop: 60
    },
    titleText: {
        fontSize: 16,
        fontFamily: 'Avenir-Medium',
        marginLeft: 86,
        marginTop: 33
    },
    textinputStyle: {
        borderWidth: 1,
        marginLeft: 15.5,
        marginRight: 15.5,
        marginTop: 11.5,
        paddingLeft: 10.5
    },
    resetButton: {
        position: 'relative',
        top: 80,
      //  bottom: 89.5,
        borderWidth: 1,
        borderColor: '#504E4E',
        marginLeft: 23.5,
        width: width * 0.88
    },
    buttonText: {
        fontSize: 16,
        fontFamily: 'Avenir-Medium',
        textAlign: 'center',
        //   marginLeft: 145.5, 
        //   marginRight: 144.5, 
        marginTop: 11.5,
        marginBottom: 11.5
    }
})