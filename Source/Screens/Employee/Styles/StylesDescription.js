import React from 'react';
import { Text, View, StyleSheet, Image, ScrollView } from 'react-native';
import { Colors, height } from '../../../Config';
import Header from '../../../Components/EmployeeHeader';

const StylesDescription = (props) => {

    const _onBack = () => props.navigation.goBack()

    return (
        <View style={styles.container}>
            {
                <Header leftIcon="back" onLeftIconPress={() => _onBack()} title={"Styles"} {...props} />
            }
            {
                <ScrollView>
                    <View style={{ flexDirection: 'row' }}>
                        <Image
                            style={{ height: 300, width: 164, marginLeft: 25 }}
                            source={require('../../../Images/cut1.png')}
                        />
                        <Image
                            style={{ height: 300, width: 164, marginLeft: 14.67 }}
                            source={require('../../../Images/cut1.png')}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', marginLeft: 16, justifyContent: 'space-between', marginRight: 68 }}>
                        <View>
                            <Text style={{ fontSize: 16, fontFamily: 'Avenir-Heavy', color: '#141313', lineHeight: 22 }}>Service Type</Text>
                            <Text style={{ fontFamily: 'Avenir-Medium', lineHeight: 19, color: '#141313' }}>Cuts</Text>
                        </View>
                        <View>
                            <Text style={{ fontSize: 16, fontFamily: 'Avenir-Heavy', color: '#141313', lineHeight: 22 }}>Stylist Level</Text>
                            <Text style={{ fontFamily: 'Avenir-Medium', lineHeight: 19, color: '#141313' }}>Junior</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', marginLeft: 16, justifyContent: 'space-between', marginRight: 90, marginTop: 14 }}>
                        <View>
                            <Text style={{ fontSize: 16, fontFamily: 'Avenir-Heavy', color: '#141313', lineHeight: 22 }}>Sex</Text>
                            <Text style={{ fontFamily: 'Avenir-Medium', lineHeight: 19, color: '#141313' }}>Male</Text>
                        </View>
                        <View>
                            <Text style={{ fontSize: 16, fontFamily: 'Avenir-Heavy', color: '#141313', lineHeight: 22 }}>Design</Text>
                            <Text style={{ fontFamily: 'Avenir-Medium', lineHeight: 19, color: '#141313' }}>Short Side</Text>
                        </View>
                    </View>
                    <Text style={{ fontSize: 16, fontFamily: 'Avenir-Heavy', color: '#141313', marginLeft: 16, marginTop: 14 }}>Name Of The Service</Text>
                    <Text style={{ fontFamily: 'Avenir-Medium', lineHeight: 19, marginLeft: 16, color: '#141313', marginTop: 6 }}>Haircut</Text>
                    <Text style={{ fontSize: 16, fontFamily: 'Avenir-Heavy', color: '#141313', marginLeft: 16, marginTop: 14 }}>Description</Text>
                    <Text style={{ fontFamily: 'Avenir-Medium', lineHeight: 19, marginLeft: 17, marginTop: 8, color: '#141313' }}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard </Text>
                    <Text style={{ fontFamily: 'Avenir-Heavy', fontSize: 16, lineHeight: 22, color: '#141313', marginLeft: 16, marginTop: 30.67 }}>Materials</Text>
                    <Text style={{ fontFamily: 'Avenir-Medium', lineHeight: 19, color: '#141313', marginLeft: 16, marginTop: 8 }}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard </Text>
                    <Text style={{ fontFamily: 'Avenir-Heavy', fontSize: 16, color: '#141313', marginLeft: 16, marginTop: 20 }}>Keywords</Text>
                    <View style={{ borderWidth: 1, marginLeft: 16.5, marginRight: 14.5, marginTop: 13.5, marginBottom: 27.5, flexDirection: 'row' }}>
                        <View style={{backgroundColor: '#D8D8D8', marginLeft: 7.5, marginTop: 6.5, marginBottom: 5.5}}>
                            <Text style={{fontSize: 16, fontFamily: 'Avenir-Heavy', color: '#1A1919', lineHeight: 22, marginLeft: 8, marginTop: 6, marginRight: 16, marginBottom: 5}}>Bangs</Text>
                        </View>
                        <View style={{backgroundColor: '#D8D8D8', marginLeft: 19, marginTop: 6.5, marginBottom: 5.5}}>
                            <Text style={{fontSize: 16, fontFamily: 'Avenir-Heavy', color: '#1A1919', lineHeight: 22, marginLeft: 8, marginTop: 6, marginRight: 16, marginBottom: 5}}>Crew</Text>
                        </View>
                        <View style={{backgroundColor: '#D8D8D8', marginLeft: 19, marginTop: 6.5, marginBottom: 5.5}}>
                            <Text style={{fontSize: 16, fontFamily: 'Avenir-Heavy', color: '#1A1919', lineHeight: 22, marginLeft: 8, marginTop: 6, marginRight: 16, marginBottom: 5}}>Bob</Text>
                        </View>
                        <View style={{backgroundColor: '#D8D8D8', marginLeft: 19, marginTop: 6.5, marginBottom: 5.5}}>
                            <Text style={{fontSize: 16, fontFamily: 'Avenir-Heavy', color: '#1A1919', lineHeight: 22, marginLeft: 8, marginTop: 6, marginRight: 16, marginBottom: 5}}>Bald</Text>
                        </View>
                    </View>
                </ScrollView>
            }
        </View>
    )
}
export default StylesDescription;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white
    }
})