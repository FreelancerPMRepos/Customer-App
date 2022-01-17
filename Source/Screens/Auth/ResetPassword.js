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
import Loader from '../../Components/Loader';

const ResetPassword = ({ navigation, route, props }) => {
    const [isLoading, setLoading] = useState(false)
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { email } = route.params
    const { token } = route.params

    const _onBack = () => navigation.goBack()

    const _onReset = () => {
        if (newPassword == '') {
            alert('Please enter new password.')
        } else if (!/^(?=.*[a-z])(?=.*[0-9])(?=.{8,})/.test(newPassword)) {
            alert('Password should be minimum 8 characters and at least one number.')
            return false
        } else if (confirmPassword == '') {
            alert('Please enter confirm password.')
        } else if (newPassword !== confirmPassword) {
            alert('New password is not same as confirm password.')
        } else {
            if (token) {
                setLoading(true)
                axios.put(`${BASE_URL}/set/password`, {
                    email: email,
                    token: token,
                    password: newPassword
                })
                    .then(res => {
                        console.log("res password", res.data)
                        alert(`${res.data.message}.`)
                        navigation.navigate('Login')
                        setNewPassword('')
                        setConfirmPassword('')
                        setLoading(false)
                    })
                    .catch(e => {
                        console.log('e', e)
                        setLoading(false)
                        alert(`${e.response.data.message}.`)
                    })
            } else {
                setLoading(true)
                axios.put(`${BASE_URL}/reset/password`, {
                    old_password: oldPassword,
                    new_password: newPassword
                })
                    .then(res => {
                        console.log("res reset password", res.data)
                        alert(`${res.data.message}.`)
                        setOldPassword('')
                        setNewPassword('')
                        setConfirmPassword('')
                        setLoading(false)
                    })
                    .catch(e => {
                        console.log('e', e)
                        alert(`${e.response.data.message}.`)
                        setLoading(false)
                    })
            }
        }
    }

    return (
        <View style={styles.container}>
            {
                <Header leftIcon='back' onLeftIconPress={_onBack} {...props} />
            }
            {
                isLoading && <Loader />
            }
            {
                <View style={{ flex: 1 }}>
                    <Text style={styles.resetPasswordText}>Reset Password</Text>
                    <Image
                        style={styles.tinyLogo}
                        source={require('../../Images/reset.png')}
                    />
                    <Text style={styles.titleText}>Please enter new password.</Text>
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