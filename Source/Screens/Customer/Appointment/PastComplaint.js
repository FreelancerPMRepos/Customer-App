import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, TextInput } from 'react-native';
import Header from '../../../Components/Header';
import { BASE_URL, Colors, width } from '../../../Config';
import moment from 'moment';
import Loader from '../../../Components/Loader';


const PastComplaint = ({ navigation, route, props }) => {
    const [isLoading, setLoading] = useState(false)
    const [complainData, setComplainData] = useState([]);
    const [repliesData, setRepliesData] = useState([]);
    const [message, setMessage] = useState('')
    const { data } = route.params

    const _onBack = () => navigation.goBack()

    useEffect(() => {
        getComplainList()
    }, [])

    const getComplainList = () => {
        setLoading(true)
        axios.get(`${BASE_URL}/customer/complaint/list/${data.id}`)
            .then(res => {
                var list = []
                if (res.data.length >= 0) {
                    for (var i in res.data) {
                        res.data[i].isShown = false;
                        list.push(res.data[i])
                        if (i == res.data.length - 1) {
                            setComplainData(list)
                        }
                    }

                }
                setLoading(false)
            })
            .catch(e => {
                console.log('e rrr', e)
                setLoading(false)
            })
    }

    const getReplies = (id, index) => {
        setMessage('')
        setLoading(true)
        var list = []
        for (var i in complainData) {
            complainData[i].isShown = false;
            list.push(complainData[i])
            if (i == complainData.length - 1) {
                setComplainData(list)
            }
        }
        axios.get(`${BASE_URL}/comment/list/${id}`)
            .then(res => {
                setRepliesData(res.data)
                var temp = [];
                for (var i in complainData) {
                    if (index == i) {
                        complainData[index].isShown = !complainData[index].isShown;
                    }
                    temp.push(complainData[i]);
                }
                setComplainData(temp);
                setLoading(false)
            })
            .catch(e => {
                console.log('e', e)
                setLoading(false)
            })
    }

    const _onReply = (id) => {
        if (message == '') {
            alert('Please eneter the message')
        } else {
            console.log("sd")
            setLoading(true)
            axios.post(`${BASE_URL}/comment`, {
                comment: message,
                complaint_id: id
            })
                .then(res => {
                    getComplainList()
                    setMessage('')
                    setLoading(false)
                })
                .catch(e => {
                    console.log('e rrr', e)
                    setLoading(false)
                })
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
                complainData.length === 0 ?
                    <View style={styles.noComplainView}>
                        <Text>No Past Complaints</Text>
                    </View> :
                    <ScrollView style={styles.mainView} showsVerticalScrollIndicator={false}>
                        {
                            complainData.map((res, i) => {
                                return (
                                    <View key={i}>
                                        <Text style={styles.dateTime}>{moment(res.created_at).format("D MMM YYYY h:m A")}</Text>
                                        <Text style={styles.complaint}>{res.complaint}</Text>
                                        <Pressable onPress={() => getReplies(res.id, i)}>
                                            {
                                                res.isShown === true ?
                                                    <Text style={styles.repliesText}>Replies</Text>
                                                    :
                                                    <Text style={styles.replies}>{res.commentsCount} Replies</Text>
                                            }
                                        </Pressable>
                                        {
                                            res.isShown === true ?
                                                <View>
                                                    {
                                                        repliesData.length == 0 ?
                                                            <Text>No replies</Text>
                                                            :
                                                            repliesData.map((val, j) => {
                                                                return (
                                                                    <View key={j}>
                                                                        <Text style={styles.name}>{val.name}</Text>
                                                                        <Text style={styles.comment}>{val.comment}</Text>
                                                                        <Text style={styles.date}>{moment(res.created_at).format("D MMM YYYY h:m A")}</Text>
                                                                        {
                                                                            repliesData.length > 1 ?
                                                                                <View style={styles.horizontalLine} />
                                                                                :
                                                                                null
                                                                        }

                                                                    </View>
                                                                )
                                                            })
                                                    }
                                                    <View style={styles.messageBox}>
                                                        <TextInput style={styles.messageInput} placeholder={"Type Message.."} onChangeText={text => setMessage(text)} value={message} />
                                                        <Pressable style={styles.sendButton} onPress={() => _onReply(res.id)}>
                                                            <Text style={styles.sendButtonText}>Send</Text>
                                                        </Pressable>
                                                    </View>
                                                </View> : null
                                        }
                                        <View style={styles.horizontalLine} />
                                    </View>
                                )
                            })
                        }

                    </ScrollView>
            }
        </View>
    )
}
export default PastComplaint;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white
    },
    mainView: {
        marginLeft: 27,
        marginRight: 27,
    },
    dateTime: {
        fontSize: 12,
        fontFamily: 'Avenir-Medium',
        lineHeight: 16,
        color: Colors.spanishGrey,
        marginTop: 16
    },
    complaint: {
        fontFamily: 'Avenir-Medium',
        lineHeight: 19,
        marginTop: 10
    },
    replies: {
        fontFamily: 'Avenir-Medium',
        lineHeight: 19,
        marginTop: 12,
        color: Colors.blueGreen,
        borderBottomWidth: 1,
        borderBottomColor: Colors.blueGreen,
        width: 60
    },
    horizontalLine: {
        borderBottomWidth: 1,
        marginTop: 10,
        borderBottomColor: Colors.spanishGreyLight
    },
    noComplainView: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    repliesText: {
        fontFamily: 'Avenir-Black',
        lineHeight: 19,
        marginTop: 12,
    },
    name: {
        fontFamily: 'Avenir-Heavy',
        marginTop: 4.5
    },
    comment: {
        fontFamily: 'Avenir-Book',
        marginTop: 1.5
    },
    date: {
        fontSize: 12,
        fontFamily: 'Avenir-Medium',
        color: '#9E9E9E',
        marginTop: 9
    },
    messageBox: {
        marginTop: 17,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    messageInput: {
        borderWidth: 1,
        borderColor: '#979797',
        width: width * 0.63
    },
    sendButton: {
        borderWidth: 1,
    },
    sendButtonText: {
        textAlign: 'center',
        paddingTop: 12,
        paddingLeft: width * 0.04,
        paddingRight: width * 0.04,
        lineHeight: 19
    }
})