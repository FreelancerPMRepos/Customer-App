import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TextInput, Image, ScrollView, Pressable, Dimensions } from 'react-native';
import { BASE_URL, Colors } from '../../../Config';
import Header from '../../../Components/EmployeeHeader';
import CheckBox from '@react-native-community/checkbox';
import TagInput from 'react-native-tags-input';
import axios from 'axios';

const mainColor = '#3ca897';

const AddStyle = ({ navigation, route, props }) => {
    const [toggleCheckBox, setToggleCheckBox] = useState(false)
    const [tags, setTags] = useState('')
    const [tagsArray, setTagsArray] = useState([])
    const [serviceTagData, setServiceTagData] = useState([])
    const { service_name } = route.params
    const { service_id } = route.params

    const _onBack = () => navigation.goBack()

    useEffect(() => {
        getServiceTag()
    }, [])

    const getServiceTag = () => {
        axios.get(`${BASE_URL}/service-tag/list/${service_id}`)
            .then(res => {
            //    console.log("response tag list", res.data)
                setServiceTagData(res.data)
                for (var i in res.data) {
                    var temp = res.data[i].value.split('|');
                    console.log("temp", temp)
                }
            })
            .catch(e => {
                console.log('e', e)
            })
    }

    const updateTagState = (state) => {
        setTags(state)
    };

    return (
        <View style={styles.container}>
            {
                <Header leftIcon="back" onLeftIconPress={() => _onBack()} title={`Add ${service_name}`} {...props} />
            }
            {
                <ScrollView>
                    <View style={{ flexDirection: 'row', marginLeft: 13, marginTop: 14 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <CheckBox
                                disabled={false}
                                value={toggleCheckBox}
                                onValueChange={(newValue) => setToggleCheckBox(newValue)}
                            />
                            <Text style={{ fontSize: 16, fontFamily: 'Avenir-Heavy', lineHeight: 22, color: '#1A1919', marginTop: 6 }}>Men</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginLeft: 54 }}>
                            <CheckBox
                                disabled={false}
                                value={toggleCheckBox}
                                onValueChange={(newValue) => setToggleCheckBox(newValue)}
                            />
                            <Text style={{ fontSize: 16, fontFamily: 'Avenir-Heavy', lineHeight: 22, color: '#1A1919', marginTop: 6 }}>Women</Text>
                        </View>
                    </View>
                    <View
                        style={{
                            borderBottomColor: '#979797',
                            borderBottomWidth: 1,
                            marginLeft: 16,
                            marginRight: 15,
                            marginTop: 13
                        }}
                    />
                    <Text style={{ fontSize: 16, fontFamily: 'Avenir-Black', color: '#1A1919', marginLeft: 16, marginTop: 9, lineHeight: 22 }}>Stylist Level</Text>
                    <View style={{ flexDirection: 'row', marginLeft: 13, marginTop: 14 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <CheckBox
                                disabled={false}
                                value={toggleCheckBox}
                                onValueChange={(newValue) => setToggleCheckBox(newValue)}
                            />
                            <Text style={{ fontSize: 16, fontFamily: 'Avenir-Heavy', lineHeight: 22, color: '#1A1919', marginTop: 6 }}>Junior</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginLeft: 15 }}>
                            <CheckBox
                                disabled={false}
                                value={toggleCheckBox}
                                onValueChange={(newValue) => setToggleCheckBox(newValue)}
                            />
                            <Text style={{ fontSize: 16, fontFamily: 'Avenir-Heavy', lineHeight: 22, color: '#1A1919', marginTop: 6 }}>Experienced</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginLeft: 15 }}>
                            <CheckBox
                                disabled={false}
                                value={toggleCheckBox}
                                onValueChange={(newValue) => setToggleCheckBox(newValue)}
                            />
                            <Text style={{ fontSize: 16, fontFamily: 'Avenir-Heavy', lineHeight: 22, color: '#1A1919', marginTop: 6 }}>Senior</Text>
                        </View>
                    </View>
                    <View
                        style={{
                            borderBottomColor: '#979797',
                            borderBottomWidth: 1,
                            marginLeft: 16,
                            marginRight: 15,
                            marginTop: 13
                        }}
                    />
                    {
                        serviceTagData.map((res) => {
                            var temp = res.value.split('|');
                            return (
                                <View>
                                    <Text style={{ fontSize: 16, fontFamily: 'Avenir-Black', color: '#1A1919', marginLeft: 16, marginTop: 9, lineHeight: 22 }}>{res.name}</Text>
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                        {
                                            temp.map((val, j) => {
                                                return (
                                                    <View style={{ flexDirection: 'row', marginLeft: 15 }}>
                                                        <CheckBox
                                                            key={j}
                                                            disabled={false}
                                                            value={toggleCheckBox}
                                                            onValueChange={(newValue) => setToggleCheckBox(newValue)}
                                                        />
                                                        <Text style={{ fontSize: 16, fontFamily: 'Avenir-Heavy', lineHeight: 22, color: '#1A1919', marginTop: 6 }}>{val}</Text>
                                                    </View>
                                                )
                                            })
                                        }
                                    </View>
                                </View>
                            )
                        })
                    }
                    <Text style={{ fontSize: 16, fontFamily: 'Avenir-Heavy', lineHeight: 22, color: '#1A1919', marginLeft: 16, marginTop: 10 }}>Name of Service</Text>
                    <TextInput
                        placeholder='Enter Name Of Haircut'
                        style={{ borderWidth: 1, marginLeft: 15.5, marginTop: 6.5, marginRight: 16.5, paddingLeft: 15 }}
                    />
                    <Text style={{ fontSize: 16, fontFamily: 'Avenir-Heavy', lineHeight: 22, marginLeft: 16, marginTop: 9.5, color: '#1A1919' }}>Service Photos</Text>
                    <Text style={{ fontFamily: 'Avenir-Heavy', lineHeight: 19, color: '#1A1919', marginLeft: 16, }}>(Min 2)</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ borderWidth: 1, borderStyle: 'dashed', marginLeft: 16.5, marginTop: 17.5 }}>
                            <Image
                                style={{ marginLeft: 60.5, marginTop: 21.5, marginRight: 65.82 }}
                                source={require('../../../Images/upload_front_photo.png')}
                            />
                            <Text style={{ textAlign: 'center', marginTop: 10, color: '#1A1919', marginBottom: 10, fontSize: 16, fontFamily: 'Avenir-Medium' }}>Upload Front Photo</Text>
                        </View>
                        <View style={{ borderWidth: 1, borderStyle: 'dashed', marginLeft: 11, marginTop: 17.5 }}>
                            <Image
                                style={{ marginLeft: 58.5, marginTop: 21.5, marginRight: 63.82 }}
                                source={require('../../../Images/upload_back_photo.png')}
                            />
                            <Text style={{ textAlign: 'center', marginTop: 10, color: '#1A1919', marginBottom: 10, fontSize: 16, fontFamily: 'Avenir-Medium' }}>Upload Back Photo</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ borderWidth: 1, borderStyle: 'dashed', marginLeft: 16.5, marginTop: 17.5 }}>
                            <Image
                                style={{ marginLeft: 60.5, marginTop: 21.5, marginRight: 65.82 }}
                                source={require('../../../Images/upload_right_photo.png')}
                            />
                            <Text style={{ textAlign: 'center', marginTop: 10, color: '#1A1919', marginBottom: 10, fontSize: 16, fontFamily: 'Avenir-Medium' }}>Upload Right Photo</Text>
                        </View>
                        <View style={{ borderWidth: 1, borderStyle: 'dashed', marginLeft: 11, marginTop: 17.5 }}>
                            <Image
                                style={{ marginLeft: 58.5, marginTop: 21.5, marginRight: 63.82 }}
                                source={require('../../../Images/upload_left_photo.png')}
                            />
                            <Text style={{ textAlign: 'center', marginTop: 10, color: '#1A1919', marginBottom: 10, fontSize: 16, fontFamily: 'Avenir-Medium' }}>Upload Left Photo</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ borderWidth: 1, borderStyle: 'dashed', marginLeft: 16.5, marginTop: 17.5 }}>
                            <Image
                                style={{ marginLeft: 60.5, marginTop: 21.5, marginRight: 65.82 }}
                                source={require('../../../Images/upload_top_photo.png')}
                            />
                            <Text style={{ textAlign: 'center', marginTop: 10, color: '#1A1919', marginBottom: 10, fontSize: 16, fontFamily: 'Avenir-Medium' }}>Upload Top Photo</Text>
                        </View>
                    </View>
                    <Text style={{ fontSize: 16, fontFamily: 'Avenir-Heavy', lineHeight: 22, color: '#1A1919', marginLeft: 17, marginTop: 15.5 }}>Description</Text>
                    <TextInput
                        multiline={true}
                        numberOfLines={5}
                        placeholder='Instructions for professionals'
                        style={{ borderWidth: 1, marginLeft: 16.5, marginTop: 6.5, marginRight: 14.5, color: '#3B3A3A' }}
                    />
                    <Text style={{ fontSize: 16, fontFamily: 'Avenir-Heavy', lineHeight: 22, color: '#1A1919', marginLeft: 17, marginTop: 15.5 }}>Material</Text>
                    <TextInput
                        multiline={true}
                        numberOfLines={5}
                        //  placeholder='Instructions for professionals'
                        style={{ borderWidth: 1, marginLeft: 16.5, marginTop: 6.5, marginRight: 14.5, color: '#3B3A3A', }}
                    />
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontSize: 16, fontFamily: 'Avenir-Heavy', lineHeight: 22, color: '#1A1919', marginLeft: 17, marginTop: 15.5 }}>Keywords</Text>
                        <Text style={{ fontSize: 13, fontFamily: 'Avenir-Heavy', lineHeight: 22, color: '#1A1919', marginTop: 15.5 }}> (These will be used for customer search)</Text>
                    </View>
                    {/* <TagInput
                        updateState={() => updateTagState()}
                        tags={tags}
                        placeholder="Tags..."
                        label='Press comma & space to add a tag'
                        labelStyle={{ color: '#fff' }}
                      //  leftElement={<Icon name={'tag-multiple'} type={'material-community'} color={this.state.tagsText} />}
                        leftElementContainerStyle={{ marginLeft: 3 }}
                        containerStyle={{ width: (Dimensions.get('window').width - 40) }}
                       inputContainerStyle={[styles.textInput, { backgroundColor: 'red' }]}
                    //    inputStyle={{ color: this.state.tagsText }}
                     //   onFocus={() => this.setState({ tagsColor: '#fff', tagsText: mainColor })}
                     //   onBlur={() => this.setState({ tagsColor: mainColor, tagsText: '#fff' })}
                        autoCorrect={false}
                        tagStyle={styles.tag}
                        tagTextStyle={styles.tagText}
                        keysForTag={', '} /> */}
                    <Text style={{ color: '#1A1919', fontSize: 16, fontFamily: 'Avenir-Medium', lineHeight: 22, marginLeft: 16, marginTop: 15.67 }}>Enter comma after each tag</Text>
                    <Pressable style={{ backgroundColor: '#141313', marginLeft: 16, marginRight: 16, marginBottom: 33, marginTop: 19 }}>
                        <Text style={{ textAlign: 'center', color: '#FFFFFF', fontFamily: 'Avenir-Medium', fontSize: 16, lineHeight: 22, marginTop: 11, marginBottom: 11 }}>Confirm</Text>
                    </Pressable>
                </ScrollView>
            }
        </View>
    )
}
export default AddStyle;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white
    }
})