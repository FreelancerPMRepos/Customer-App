import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Header from '../../../Components/Header';
import { BASE_URL, Colors } from '../../../Config';
import moment from 'moment';
import Loader from '../../../Components/Loader';


const PastComplaint = ({ navigation, route, props }) => {
    const [isLoading, setLoading] = useState(false)
    const [complainData, setComplainData] = useState([]);
    const [repliesData, setRepliesData] = useState([]);
    const [repliesView, setRepliesView] = useState(false);
    const { data } = route.params

    const _onBack = () => navigation.goBack()

    useEffect(() => {
        getComplainList()
    }, [])

    const getComplainList = () => {
        setLoading(true)
        axios.get(`${BASE_URL}/customer/complaint/list/${data.id}`)
            .then(res => {
                console.log("s", res.data)
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
                console.log("replies", res.data)
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
                console.log('e rrr', e)
                setLoading(false)
            })
    }
    // console.log(':sd', complainData)

    return (
        <View style={styles.container}>
            {
                <Header leftIcon='back' onLeftIconPress={_onBack} {...props} />
            }
            {
                isLoading && <Loader />
            }
            {
                <ScrollView style={styles.mainView}>
                    {
                        complainData.map((res, i) => {
                            return (
                                <View key={i}>
                                    <Text style={styles.dateTime}>{moment(res.created_at).format("D MMM YYYY h:m")}</Text>
                                    <Text style={styles.complaint}>{res.complaint}</Text>
                                    <Pressable onPress={() => getReplies(res.id, i)}>
                                        {
                                            res.isShown === true ?
                                                <Text style={{ fontFamily: 'Avenir-Black', lineHeight: 19, marginTop: 12, }}>Replies</Text>
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
                                                                    <Text style={{ fontFamily: 'Avenir-Heavy', marginTop: 4.5 }}>{val.name}</Text>
                                                                    <Text style={{ fontFamily: 'Avenir-Book', marginTop: 1.5 }}>{val.comment}</Text>
                                                                    <Text style={{ fontSize: 12, fontFamily: 'Avenir-Medium', color: '#9E9E9E', marginTop: 9 }}>{moment(res.created_at).format("D MMM YYYY h:m")}</Text>
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
        width: 65
    },
    horizontalLine: {
        borderBottomWidth: 1,
        marginTop: 10,
        borderBottomColor: Colors.spanishGreyLight
    }
})