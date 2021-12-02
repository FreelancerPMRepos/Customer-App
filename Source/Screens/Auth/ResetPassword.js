import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    TextInput,
    Pressable
} from 'react-native';
import Header from '../../Components/Header'

const ResetPassword = (props) => {

    const _onBack = () => props.navigation.goBack()

    return (
        <View style={styles.container}>
            {
                <Header leftIcon='back' onLeftIconPress={_onBack} {...props} />
            }
            {
                <View style={{flex: 1}}>
                    <Text style={styles.resetPasswordText}>Reset Password</Text>
                    <Image
                        style={styles.tinyLogo}
                        source={require('../../Images/reset.png')}
                    />
                    <Text style={styles.titleText}>Please enter new password.</Text>
                    <TextInput placeholder="New Password" style={styles.textinputStyle}/>
                    <TextInput placeholder="Confirm New Password" style={styles.textinputStyle}/>
                    <Pressable style={styles.resetButton}>
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
        position: 'absolute', 
        bottom: 89.5, 
        borderWidth: 1, 
        borderColor: '#504E4E', 
        marginLeft: 22.5
    },
    buttonText: {
        fontSize: 16, 
        fontFamily: 'Avenir-Medium', 
        marginLeft: 145.5, 
        marginRight: 144.5, 
        marginTop: 11.5, 
        marginBottom: 11.5
    }
})