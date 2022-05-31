import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TextInput, Image, ScrollView, Pressable, Dimensions, PermissionsAndroid } from 'react-native';
import { BASE_URL, Colors, width } from '../../../Config';
import Header from '../../../Components/EmployeeHeader';
import CheckBox from '@react-native-community/checkbox';
import axios from 'axios';
import {
    launchCamera,
    launchImageLibrary
} from 'react-native-image-picker';
import { showMessageAlert } from '../../../Utils/Utility';
import Dialog, { DialogContent } from 'react-native-popup-dialog';
import TagInput from 'react-native-tags-input';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

const mainColor = '#3ca897';

const AddStyle = ({ navigation, route, props }) => {
    const auth = useSelector(state => state.auth)
    const [toggleCheckBox, setToggleCheckBox] = useState({ men: false, women: false, junior: false, experienced: false, senior: false })
    const [images, setImages] = useState({ front: {}, back: {}, right: {}, left: {}, top: {} })
    const [uploadingImage, setUploadingImage] = useState([]);
    const [serviceTagData, setServiceTagData] = useState([])
    const [serviceName, setServiceName] = useState('')
    const [description, setDescription] = useState('')
    const [material, setMaterial] = useState('')
    const [modalVisible, setModalVisible] = useState(false);
    const [imageType, setImageType] = useState('')
    const [userData, setUserData] = useState()
    const [tags, setTags] = useState({ tag: '', tagsArray: [] })
    const { service_name } = route.params
    const { service_id } = route.params
    const { page } = route.params
    const { userId } = route.params

    const _onBack = () => navigation.goBack()

    useEffect(() => {
        getServiceTag()
        getData()
    }, [])

    const getData = async () => {
        console.log("in user data")
        try {
            const jsonValue = await AsyncStorage.getItem('@user_details')
            const new_value = jsonValue != null ? JSON.parse(jsonValue) : null;
            setUserData(new_value)
        } catch (e) {
            // error reading value
        }
    }

    const getServiceTag = () => {
        axios.get(`${BASE_URL}/service-tag/list/${service_id}`)
            .then(res => {
                var serviceTags = [];
                for (var i in res.data) {
                    var temp = res.data[i].value.split('|');
                    res.data[i].styles = [];
                    for (var j in temp) {
                        var isCheck = false;
                        if (temp[j]) {
                            res.data[i].styles.push({ name: temp[j], isChecked: isCheck });
                        }
                    }
                    serviceTags.push(res.data[i]);

                }
                setServiceTagData(serviceTags)
            })
            .catch(e => {
                console.log('e', e)
            })
    }

    const _onCheck = (name, index) => {
        var temp = []
        for (var i in serviceTagData) {
            if (serviceTagData[i].name == name) {
                for (var j in serviceTagData[i].styles) {
                    if (j == index) {
                        serviceTagData[i].styles[j].isChecked = !serviceTagData[i].styles[j].isChecked;
                    }
                }
            }

            temp.push(serviceTagData[i])
        }
        setServiceTagData(temp)
    }

    const ChooseImage = () => {
        return (
            <Dialog
                visible={modalVisible}
                onTouchOutside={() => {
                    setModalVisible(!modalVisible);
                }}
                dialogStyle={{ bottom: 60 }}
            >
                <DialogContent>
                    <View style={{ width: 320 }}>
                        <Pressable style={{ borderWidth: 1, marginTop: 15, width: 310 }} onPress={() => { launchGallery(), setModalVisible(!modalVisible) }}>
                            <Text style={{ fontSize: 16, fontFamily: 'Avenir-Heavy', lineHeight: 22, textAlign: 'center', paddingTop: 10, paddingBottom: 10 }}>Choose file from gallery</Text>
                        </Pressable>
                        <Pressable style={{ borderWidth: 1, marginTop: 15, width: 310 }} onPress={() => { captureImage(), setModalVisible(!modalVisible) }}>
                            <Text style={{ fontSize: 16, fontFamily: 'Avenir-Heavy', lineHeight: 22, textAlign: 'center', paddingTop: 10, paddingBottom: 10 }}>Capture Image</Text>
                        </Pressable>
                    </View>
                </DialogContent>
            </Dialog>
        )
    }

    const selectImage = (type) => {
        setModalVisible(!modalVisible)
        setImageType(type)
    }

    const launchGallery = () => {
        let options = {
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        launchImageLibrary(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
                alert(response.customButton);
            } else {
                const source = { uri: response.uri };
                console.log('response', JSON.stringify(response));
                if (imageType == 'front') {
                    setImages({ ...images, front: response })
                } else if (imageType == 'back') {
                    setImages({ ...images, back: response })
                } else if (imageType == 'right') {
                    setImages({ ...images, right: response })
                } else if (imageType == 'left') {
                    setImages({ ...images, left: response })
                } else {
                    setImages({ ...images, top: response })
                }
            }
        });

    }

    const captureImage = async () => {
        let options = {
            // mediaType: type,
            maxWidth: 300,
            maxHeight: 550,
            quality: 1,
            videoQuality: 'low',
            durationLimit: 30, //Video max duration in seconds
            saveToPhotos: true,
        };
        let isCameraPermitted = await requestCameraPermission();
        let isStoragePermitted = await requestExternalWritePermission();
        if (isCameraPermitted && isStoragePermitted) {
            launchCamera(options, (response) => {
                console.log('Response = ', response);

                if (response.didCancel) {
                    alert('User cancelled camera picker');
                    return;
                } else if (response.errorCode == 'camera_unavailable') {
                    alert('Camera not available on device');
                    return;
                } else if (response.errorCode == 'permission') {
                    alert('Permission not satisfied');
                    return;
                } else if (response.errorCode == 'others') {
                    alert(response.errorMessage);
                    return;
                }
                console.log('base64 -> ', response.base64);
                console.log('uri -> ', response.uri);
                console.log('width -> ', response.width);
                console.log('height -> ', response.height);
                console.log('fileSize -> ', response.fileSize);
                console.log('type -> ', response.type);
                console.log('fileName -> ', response.fileName);
                if (imageType == 'front') {
                    setImages({ ...images, front: response })
                } else if (imageType == 'back') {
                    setImages({ ...images, back: response })
                } else if (imageType == 'right') {
                    setImages({ ...images, right: response })
                } else if (imageType == 'left') {
                    setImages({ ...images, left: response })
                } else {
                    setImages({ ...images, top: response })
                }
                // setFilePath(response);
            });
        }
    };

    const requestCameraPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: 'Camera Permission',
                        message: 'App needs camera permission',
                    },
                );
                // If CAMERA Permission is granted
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                return false;
            }
        } else return true;
    };

    const requestExternalWritePermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'External Storage Write Permission',
                        message: 'App needs write permission',
                    },
                );
                // If WRITE_EXTERNAL_STORAGE Permission is granted
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                alert('Write permission err', err);
            }
            return false;
        } else return true;
    };

    const _onConfirm = () => {
        console.log("df", userData.store_id)
        var count = 0;
        if (images.front.assets) {
            count++;
            uploadingImage.push({ key: 'FRONT', value: images.front.assets[0] })
        }
        if (images.back.assets) {
            count++;
            uploadingImage.push({ key: 'BACK', value: images.back.assets[0] })
        }
        if (images.right.assets) {
            count++;
            uploadingImage.push({ key: 'RIGHT', value: images.right.assets[0] })
        }
        if (images.left.assets) {
            count++;
            uploadingImage.push({ key: 'LEFT', value: images.left.assets[0] })
        }
        if (images.top.assets) {
            count++;
            uploadingImage.push({ key: 'TOP', value: images.top.assets[0] })
        }

        if (toggleCheckBox.men == false && toggleCheckBox.women == false) {
            showMessageAlert('Please select gender')
            return false
        } else if (toggleCheckBox.junior == false && toggleCheckBox.experienced == false && toggleCheckBox.senior == false) {
            showMessageAlert('Please select stylist level')
            return false
        } else if (serviceName == '') {
            showMessageAlert('Please enter service name')
            return false
        } else if (count < 2) {
            console.log("count", count)
            showMessageAlert('Please select atleast two images')
            return false
        } else if (description == '') {
            showMessageAlert('Please enter description')
            return false
        } else if (material == '') {
            showMessageAlert('Please enter material')
            return false
        } else {
            var gender = '';
            if (toggleCheckBox.men) {
                gender = 'MEN';
            }

            if (toggleCheckBox.women) {
                if (gender) {
                    gender += ',WOMEN'
                } else {
                    gender = 'WOMEN'
                }
            }

            var level = '';
            if (toggleCheckBox.junior) {
                level = 'JUNIOR';
            }

            if (toggleCheckBox.experienced) {
                if (level) {
                    level += ',EXPERIENCED'
                } else {
                    level = 'EXPERIENCED'
                }
            }

            if (toggleCheckBox.senior) {
                if (level) {
                    level += ',SENIOR'
                } else {
                    level = 'SENIOR'
                }
            }
            var services = [];
            for (var i in serviceTagData) {
                var values = '';
                for (var j in serviceTagData[i].styles) {

                    if (serviceTagData[i].styles[j].isChecked) {
                        console.log("values", serviceTagData[i].styles[j].isChecked)
                        if (values) {
                            values = values + "|" + serviceTagData[i].styles[j].name;
                        } else {
                            values = serviceTagData[i].styles[j].name;
                        }
                    }
                }
                if (values) {
                    services.push({
                        name: serviceTagData[i].name,
                        service_tag_id: serviceTagData[i].id,
                        values: values,
                    })
                }
            }
            if (services.length == 0) {
                showMessageAlert('Please select service')
            } else {
                axios.post(`${BASE_URL}/style`, {
                    is_custom: page === 'Detail' ? '1' : '0',
                    user_id: page === 'Detail' ? userId : '',
                    store_id: userData.store_id,
                    service_id: service_id,
                    name: serviceName,
                    description: description,
                    materials: material,
                    gender: gender,
                    keyword: tags.tagsArray.toString(),
                    stylist_level: level,
                    service_tags: services
                })
                    .then(res => {
                        console.log("res", res.data)
                        showMessageAlert(res.data.message)
                        uploadImage(0, res.data.id);
                        _onBack()
                    })
                    .catch(e => {
                        console.log('e', e.response.data.message)
                        showMessageAlert(e.response.data.message)
                    })
            }
        }
    }

    const uploadImage = (index, id) => {
        if (uploadingImage.length > index) {
            let data = uploadingImage[index];
            let formData = new FormData();
            formData.append('id', id);
            formData.append('image', {
                name: data.value.fileName,
                type: data.value.type,
                uri: data.value.uri,
            });

            formData.append('type', data.key);
            console.log("sad", formData)
            fetch(`${BASE_URL}/style/photo`,
                {
                    body: formData,
                    method: "post",
                    headers: {
                        'Authorization': `Bearer ${auth.access_token}`
                    },
                })
                .then(response => { return Promise.all([response.status, response.json()]) })
                .then(res => {
                    let statusCode = res[0]
                    let data = res[1]
                    if (statusCode === 200) {
                        console.log("image respones", data)
                    }

                    else {
                        console.log("error", data)
                    }

                    uploadImage(++index, id)
                })
                .catch(e => {
                    uploadImage(++index, id)
                    console.log('e', e)
                    // showMessageAlert(e.response.data.message)
                })
        }
    }

    const renderService = () => {
        return (
            <View>
                <Text style={styles.nameOfServiceText}>Name of Service</Text>
                <TextInput placeholder='Name of Service' style={styles.enterNameInput} onChangeText={text => setServiceName(text)} value={serviceName} />
            </View>
        )
    }

    const renderServicePhotoHeading = () => {
        return (
            <View>
                <Text style={{ fontSize: 16, fontFamily: 'Avenir-Heavy', lineHeight: 22, marginLeft: 16, marginTop: 9.5, color: '#1A1919' }}>Service Photos</Text>
                <Text style={{ fontFamily: 'Avenir-Heavy', lineHeight: 19, color: '#1A1919', marginLeft: 16, }}>(Min 2)</Text>
            </View>
        )
    }

    const renderFirstRowImages = () => {
        return (
            <View style={styles.row}>
                <Pressable style={styles.imageView} onPress={() => selectImage('front')} >
                    <Image
                        style={images.front.assets ? styles.captureImage : styles.firstImage}
                        source={images.front.assets ? { uri: images.front.assets[0].uri, isStatic: true } : require('../../../Images/upload_front_photo.png')}
                    />
                    {images.front.assets ? null : <Text style={styles.uploadImageText}>Upload Front Photo</Text>}
                </Pressable>
                <Pressable style={styles.imageView} onPress={() => selectImage('back')}>
                    <Image
                        style={images.back.assets ? styles.captureImage : styles.secondImage}
                        source={images.back.assets ? { uri: images.back.assets[0].uri, isStatic: true } : require('../../../Images/upload_back_photo.png')}
                    />
                    {images.back.assets ? null : <Text style={styles.uploadImageText}>Upload Back Photo</Text>}
                </Pressable>
            </View>
        )
    }

    const renderSecondRowImages = () => {
        return (
            <View style={styles.row}>
                <Pressable style={styles.imageView} onPress={() => selectImage('right')}>
                    <Image
                        style={images.right.assets ? styles.captureImage : styles.firstImage}
                        source={images.right.assets ? { uri: images.right.assets[0].uri, isStatic: true } : require('../../../Images/upload_right_photo.png')}
                    />
                    {images.right.assets ? null : <Text style={styles.uploadImageText}>Upload Right Photo</Text>}
                </Pressable>
                <Pressable style={styles.imageView} onPress={() => selectImage('left')}>
                    <Image
                        style={images.left.assets ? styles.captureImage : styles.secondImage}
                        source={images.left.assets ? { uri: images.left.assets[0].uri, isStatic: true } : require('../../../Images/upload_left_photo.png')}
                    />
                    {images.left.assets ? null : <Text style={styles.uploadImageText}>Upload Left Photo</Text>}
                </Pressable>
            </View>
        )
    }

    const renderThirdRowImages = () => {
        return (
            <View style={{ marginLeft: 27}}>
                <Pressable style={styles.imageView} onPress={() => selectImage('top')}>
                    <Image
                        style={images.top.assets ? styles.captureImage : styles.firstImage}
                        source={images.top.assets ? { uri: images.top.assets[0].uri, isStatic: true } : require('../../../Images/upload_top_photo.png')}
                    />
                    {images.top.assets ? null : <Text style={styles.uploadImageText}>Upload Top Photo</Text>}
                </Pressable>
            </View>
        )
    }

    const renderDescription = () => {
        return (
            <View>
                <Text style={{ fontSize: 16, fontFamily: 'Avenir-Heavy', lineHeight: 22, color: '#1A1919', marginLeft: 17, marginTop: 15.5 }}>Description</Text>
                <TextInput
                    multiline={true}
                    numberOfLines={5}
                    placeholder='Instructions for professionals'
                    style={{ borderWidth: 1, marginLeft: 16.5, marginTop: 6.5, marginRight: 14.5, color: '#3B3A3A', textAlignVertical: 'top' }}
                    onChangeText={text => setDescription(text)}
                    value={description}
                />
            </View>
        )
    }

    const renderMaterial = () => {
        return (
            <View>
                <Text style={{ fontSize: 16, fontFamily: 'Avenir-Heavy', lineHeight: 22, color: '#1A1919', marginLeft: 17, marginTop: 15.5 }}>Material</Text>
                <TextInput
                    multiline={true}
                    numberOfLines={5}
                    //  placeholder='Instructions for professionals'
                    style={{ borderWidth: 1, marginLeft: 16.5, marginTop: 6.5, marginRight: 14.5, color: '#3B3A3A', textAlignVertical: 'top' }}
                    onChangeText={text => setMaterial(text)}
                    value={material}
                />
            </View>
        )
    }


    const updateTagState = (state) => {
        setTags(state)
    };

    const renderKeywords = () => {
        return (
            <View>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontSize: 16, fontFamily: 'Avenir-Heavy', lineHeight: 22, color: '#1A1919', marginLeft: 17, marginTop: 15.5 }}>Keywords</Text>
                    <Text style={{ fontSize: 13, fontFamily: 'Avenir-Heavy', lineHeight: 22, color: '#1A1919', marginTop: 15.5 }}> (These will be used for customer search)</Text>
                </View>
                <TagInput
                    updateState={updateTagState}
                    tags={tags}
                    inputContainerStyle={{ borderWidth: 1, marginLeft: 5, marginRight: 5, marginTop: 6.5 }}
                    tagStyle={{ backgroundColor: '#D8D8D8', height: 32 }}
                    keysForTag={','}
                />
                <Text style={{ color: '#1A1919', fontSize: 16, fontFamily: 'Avenir-Medium', lineHeight: 22, marginLeft: 16, marginTop: 15.67 }}>Enter comma after each tag</Text>
            </View>
        )
    }

    const renderConfirmButton = () => {
        return (
            <View>
                <Pressable style={styles.confirmButton} onPress={() => _onConfirm()}>
                    <Text style={styles.confirmButtonText}>Confirm</Text>
                </Pressable>
            </View>
        )
    }



    return (
        <View style={styles.container}>
            {
                <Header leftIcon="back" onLeftIconPress={() => _onBack()} title={`Add ${service_name}`} {...props} />
            }
            {
                <ScrollView>
                    <View style={{ flexDirection: 'row', marginLeft: 13, marginTop: 14, width: '100%' }}>
                        <View style={{ flexDirection: 'row', width: '31%' }}>
                            <CheckBox
                                disabled={false}
                                value={toggleCheckBox.men}
                                onValueChange={() => setToggleCheckBox({ ...toggleCheckBox, men: !toggleCheckBox.men })}
                            />
                            <Text style={{ fontSize: 16, fontFamily: 'Avenir-Heavy', lineHeight: 22, color: '#1A1919', marginTop: 6 }}>Men</Text>
                        </View>
                        <View style={{ flexDirection: 'row', width: '30%' }}>
                            <CheckBox
                                disabled={false}
                                value={toggleCheckBox.women}
                                onValueChange={() => setToggleCheckBox({ ...toggleCheckBox, women: !toggleCheckBox.women })}
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
                    <View style={{ flexDirection: 'row', marginLeft: 13, marginTop: 14, justifyContent: 'space-between', marginRight: 20 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <CheckBox
                                disabled={false}
                                value={toggleCheckBox.junior}
                                onValueChange={() => setToggleCheckBox({ ...toggleCheckBox, junior: !toggleCheckBox.junior })}
                            />
                            <Text style={{ fontSize: 16, fontFamily: 'Avenir-Heavy', lineHeight: 22, color: '#1A1919', marginTop: 6 }}>Junior</Text>
                        </View>
                        <View style={{ flexDirection: 'row', }}>
                            <CheckBox
                                disabled={false}
                                value={toggleCheckBox.experienced}
                                onValueChange={() => setToggleCheckBox({ ...toggleCheckBox, experienced: !toggleCheckBox.experienced })}
                            />
                            <Text style={{ fontSize: 16, fontFamily: 'Avenir-Heavy', lineHeight: 22, color: '#1A1919', marginTop: 6 }}>Experienced</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <CheckBox
                                disabled={false}
                                value={toggleCheckBox.senior}
                                onValueChange={() => setToggleCheckBox({ ...toggleCheckBox, senior: !toggleCheckBox.senior })}
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
                        serviceTagData.map((res, i) => {
                            return (
                                <View key={i}>
                                    <Text style={{ fontSize: 16, fontFamily: 'Avenir-Black', color: '#1A1919', marginLeft: 16, marginTop: 9, lineHeight: 22 }}>{res.name}</Text>
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginLeft: 13, marginRight: 10}}>
                                        {
                                            res.styles.map((val, j) => {
                                                return (
                                                    <View key={j} style={{ flexDirection: 'row'}}>
                                                        <CheckBox
                                                            // key={j}
                                                            disabled={false}
                                                            value={val.isChecked}
                                                            onValueChange={(newValue) => _onCheck(res.name, j)}
                                                        />
                                                        <Text style={{ fontSize: 16, fontFamily: 'Avenir-Heavy', lineHeight: 22, color: '#1A1919', marginTop: 6}}>{val.name}</Text>
                                                    </View>
                                                )
                                            })
                                        }
                                    </View>
                                </View>
                            )
                        })
                    }
                    {renderService()}
                    {renderServicePhotoHeading()}
                    {renderFirstRowImages()}
                    {renderSecondRowImages()}
                    {renderThirdRowImages()}
                    {renderDescription()}
                    {renderMaterial()}
                    {page === 'Detail' ? null : renderKeywords()}
                    {renderConfirmButton()}
                    {ChooseImage()}
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
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    nameOfServiceText: {
        fontSize: 16,
        fontFamily: 'Avenir-Heavy',
        lineHeight: 22,
        color: '#1A1919',
        marginLeft: 16,
        marginTop: 10
    },
    enterNameInput: {
        borderWidth: 1,
        marginLeft: 15.5,
        marginTop: 6.5,
        marginRight: 16.5,
        paddingLeft: 15
    },
    imageView: {
        borderWidth: 1,
        borderStyle: 'dashed',
        marginTop: 17.5,
        width: 165
    },
    captureImage: {
        height: 150
    },
    firstImage: {
        marginLeft: width * 0.16,
        marginTop: 21.5,
        marginRight: width * 0.16
    },
    secondImage: {
        marginLeft: width * 0.16,
        marginTop: 21.5,
        marginRight: width * 0.16
    },
    uploadImageText: {
        textAlign: 'center',
        marginTop: 10,
        color: '#1A1919',
        marginBottom: 10,
        fontSize: 16,
        fontFamily: 'Avenir-Medium'
    },
    confirmButton: {
        backgroundColor: '#141313',
        marginLeft: 16,
        marginRight: 16,
        marginBottom: 33,
        marginTop: 19
    },
    confirmButtonText: {
        textAlign: 'center',
        color: '#FFFFFF',
        fontFamily: 'Avenir-Medium',
        fontSize: 16,
        lineHeight: 22,
        marginTop: 11,
        marginBottom: 11
    }
})