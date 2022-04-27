import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Image, ScrollView } from 'react-native';
import { BASE_URL, Colors, height, width } from '../../../Config';
import Header from '../../../Components/EmployeeHeader';
import axios from 'axios';
import Loader from '../../../Components/Loader';

const StylesDescription = ({ navigation, route, props }) => {
    const [isLoading, setLoading] = useState(false)
    const [styleData, setStyleData] = useState([]);
    const { id } = route.params

    const _onBack = () => navigation.goBack()

    useEffect(() => {
        getStyleDetails()
    }, [])

    const getStyleDetails = () => {
        setLoading(true)
        axios.get(`${BASE_URL}/style/detail/${id}`)
            .then(res => {
                console.log("res", res.data)
                if (res.data.keyword) {
                    res.data.keywords = res.data.keyword.split(",");
                } else {
                    res.data.keywords = [];
                }
                setStyleData(res.data)
                setLoading(false)
            })
            .catch(e => {
                console.log('e', e)
                setLoading(false)
            })
    }

    return (
        <View style={styles.container}>
            {
                <Header leftIcon="back" onLeftIconPress={() => _onBack()} title={"Styles"} {...props} />
            }
            {
                isLoading && <Loader />
            }
            {
                <ScrollView>
                    <ScrollView style={{ flexDirection: 'row', marginBottom: 10, marginTop: 10, marginLeft: 20, marginRight: 20, }} horizontal={true}>
                        {
                            styleData.upload_front_photo === null ? null :
                                <Image
                                    style={{ height: 280, width: width * 0.42 }}
                                    source={{ uri: styleData.upload_front_photo }}
                                />
                        }
                        {
                            styleData.upload_back_photo === null ? null :
                                <Image
                                    style={{ height: 280, width: width * 0.42, marginLeft: 20 }}
                                    source={{ uri: styleData.upload_back_photo }}
                                />

                        }
                        {
                            styleData.upload_right_photo === null ? null :
                                <Image
                                    style={{ height: 280, width: width * 0.42, marginLeft: 20 }}
                                    source={{ uri: styleData.upload_right_photo }}
                                />
                        }
                        {
                            styleData.upload_left_photo === null ? null :
                                <Image
                                    style={{ height: 280, width: width * 0.42, marginLeft: 20 }}
                                    source={{ uri: styleData.upload_left_photo }}
                                />
                        }
                        {
                            styleData.upload_top_photo === null ? null :
                                <Image
                                    style={{ height: 280, width: width * 0.42, marginLeft: 20 }}
                                    source={{ uri: styleData.upload_top_photo }}
                                />
                        }
                    </ScrollView>
                    <View style={{ flexDirection: 'row', marginLeft: 16, justifyContent: 'space-between', marginRight: 68, width: '100%' }}>
                        <View style={{width: '50%'}}>
                            <Text style={{ fontSize: 16, fontFamily: 'Avenir-Heavy', color: '#141313', lineHeight: 22 }}>Name of Style</Text>
                            <Text style={{ fontFamily: 'Avenir-Medium', lineHeight: 19, color: '#141313', marginRight: 10 }}>{styleData.name}</Text>
                        </View>
                        <View style={{width: '50%'}}>
                            <Text style={{ fontSize: 16, fontFamily: 'Avenir-Heavy', color: '#141313', lineHeight: 22 }}>Stylist Level</Text>
                            <Text style={{ fontFamily: 'Avenir-Medium', lineHeight: 19, color: '#141313' }}>{styleData.stylist_level}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', marginLeft: 16, justifyContent: 'space-between', marginRight: 90, marginTop: 14 }}>
                        <View>
                            <Text style={{ fontSize: 16, fontFamily: 'Avenir-Heavy', color: '#141313', lineHeight: 22 }}>Sex</Text>
                            <Text style={{ fontFamily: 'Avenir-Medium', lineHeight: 19, color: '#141313' }}>{styleData.gender}</Text>
                        </View>
                    </View>
                    <View style={{ marginLeft: 16, }}>
                        {
                            styleData?.style_tags?.map((res) => {
                                var str = ''
                                var arr = res.values.split('|')
                                for (var i = 0; i < arr.length; i++) {
                                    if (i == 0) {
                                        str = arr[i];
                                    } else {
                                        str = str + ', ' + arr[i];
                                    }
                                }
                                return (
                                    <View style={{ marginTop: 14 }}>
                                        <Text style={{ fontSize: 16, fontFamily: 'Avenir-Heavy', color: '#141313', lineHeight: 22 }}>{res.name}</Text>
                                        <Text style={{ fontFamily: 'Avenir-Medium', lineHeight: 19, color: '#141313' }}>{str}</Text>
                                    </View>
                                )
                            })
                        }
                    </View>
                    <Text style={{ fontSize: 16, fontFamily: 'Avenir-Heavy', color: '#141313', marginLeft: 16, marginTop: 14 }}>Name Of The Service</Text>
                    <Text style={{ fontFamily: 'Avenir-Medium', lineHeight: 19, marginLeft: 16, color: '#141313', marginTop: 6 }}>{styleData?.service?.name}</Text>
                    <Text style={{ fontSize: 16, fontFamily: 'Avenir-Heavy', color: '#141313', marginLeft: 16, marginTop: 14 }}>Description</Text>
                    <Text style={{ fontFamily: 'Avenir-Medium', lineHeight: 19, marginLeft: 17, marginTop: 8, color: '#141313', marginRight: 24 }}>{styleData.description}</Text>
                    <Text style={{ fontFamily: 'Avenir-Heavy', fontSize: 16, lineHeight: 22, color: '#141313', marginLeft: 16, marginTop: 30.67 }}>Materials</Text>
                    <Text style={{ fontFamily: 'Avenir-Medium', lineHeight: 19, color: '#141313', marginLeft: 16, marginTop: 8, marginRight: 24 }}>{styleData.materials}</Text>
                    <Text style={{ fontFamily: 'Avenir-Heavy', fontSize: 16, color: '#141313', marginLeft: 16, marginTop: 20 }}>Keywords</Text>
                    <View style={{ borderWidth: 1, marginLeft: 16.5, marginRight: 14.5, marginTop: 13.5, marginBottom: 27.5, flexDirection: 'row', flexWrap: 'wrap' }}>
                        {
                            styleData?.keywords?.map((res) => {
                                return (
                                    <View style={{ backgroundColor: '#D8D8D8', marginLeft: 7.5, marginTop: 6.5, marginBottom: 5.5 }}>
                                        <Text style={{ fontSize: 16, fontFamily: 'Avenir-Heavy', color: '#1A1919', lineHeight: 22, marginLeft: 8, marginTop: 6, marginRight: 16, marginBottom: 5 }}>{res}</Text>
                                    </View>
                                )
                            })
                        }

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