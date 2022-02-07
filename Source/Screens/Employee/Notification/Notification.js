import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../../Config';
import Header from '../../../Components/EmployeeHeader';

const Notification = (props) => {

    const _onMenuPress = () => {
        props.navigation.goBack()
    }

    return (
        <View style={styles.container}>
            {
                <Header leftIcon="back" onLeftIconPress={() => _onMenuPress()} title={"Notification"} {...props} />
            }
            {
                <View>
                    <View style={{ borderWidth: 0.5, borderColor: '#FFD026', marginTop: 15.75, marginLeft: 15.75, marginRight: 15.75 }}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text style={{fontSize: 16, fontFamily: 'Avenir-Medium', lineHeight: 22, color: Colors.black, marginTop: 5.25, marginLeft: 13.25}}>Samantha S.</Text>
                            <Text style={{fontSize: 12, fontFamily: 'Avenir-Medium', lineHeight: 16, marginTop: 8.25, marginRight: 4.25, color: Colors.black}}>11:20 AM, 17 Aug 2021</Text>
                        </View>
                        <Text style={{fontFamily: 'Avenir-Book', lineHeight: 18, color: Colors.black, marginLeft: 14.25, marginTop: 4, marginRight: 50.25, marginBottom: 12.25}}>Samantha S. rescheduled her appointment for nails.</Text>
                    </View>

                    <View style={{ borderWidth: 0.5, borderColor: '#FF2626', marginTop: 11.5, marginLeft: 15.75, marginRight: 15.75 }}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text style={{fontSize: 16, fontFamily: 'Avenir-Medium', lineHeight: 22, color: Colors.black, marginTop: 5.25, marginLeft: 13.25}}>Andrew M.</Text>
                            <Text style={{fontSize: 12, fontFamily: 'Avenir-Medium', lineHeight: 16, marginTop: 8.25, marginRight: 4.25, color: Colors.black}}>11:25 AM, 18 Aug 2021</Text>
                        </View>
                        <Text style={{fontFamily: 'Avenir-Book', lineHeight: 18, color: Colors.black, marginLeft: 14.25, marginTop: 4, marginRight: 40.25, marginBottom: 12.25}}>Andrew M. cancelled hir appointment for beard cut.</Text>
                    </View>
                </View>
            }
        </View>
    )
}
export default Notification;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white
    }
})