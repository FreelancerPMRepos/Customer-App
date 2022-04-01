import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Header from '../../../Components/Header'
import { Rating, AirbnbRating } from 'react-native-ratings';
import axios from 'axios';
import { BASE_URL } from '../../../Config';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { showMessageAlert } from '../../../Utils/Utility';

const ReviewScreen = ({ navigation, route, props }) => {
    const [salonFeedback, setSalonFeedback] = useState('')
    const [stylistFeedback, setStylistFeedback] = useState('')
    const [salonRating, setSalonRating] = useState('0')
    const [stylistRating, setStylistRating] = useState('0')
    const { storeDetails } = route.params


    const _onBack = () => navigation.goBack()

    const ratingCompleted = (rating) => {
        console.log("Rating is: " + rating)
        setSalonRating(rating)
    }


    const StylistratingCompleted = (rating) => {
        console.log("Rating is: " + rating)
        setStylistRating(rating)
    }

    const _onSend = () => {
        if (salonFeedback == '' || stylistFeedback == '') {
            alert('Please enter feedback')
        } else {
            axios.post(`${BASE_URL}/review`, {
                booking_id: storeDetails.id,
                salon: {
                    type: "STORE",
                    review: salonFeedback,
                    rating: salonRating
                },
                stylist: {
                    type: "SERVICE",
                    review: stylistFeedback,
                    rating: stylistRating
                }
            })
                .then(res => {
                    showMessageAlert(res.data.message)
                    setSalonFeedback('')
                    setStylistFeedback('')
                    _onBack()
                })
                .catch(e => {
                    console.log('e rrr', e)
                    showMessageAlert(e.response.data.message)
                    setSalonFeedback('')
                    setStylistFeedback('')
                })
        }
    }

    return (
        <View style={styles.container}>
            {
                <Header leftIcon='back' onLeftIconPress={_onBack} {...props} />
            }
            {
                <KeyboardAwareScrollView>
                    <Text style={styles.salonText}>Salon</Text>
                    <Text style={styles.ratingText}>Rating</Text>
                    <View style={styles.ratingView}>
                        <Rating
                            type='custom'
                            ratingCount={5}
                            ratingColor='#1F1E1E'
                            ratingBackgroundColor='#c8c7c8'
                            tintColor="#FFFFFF"
                            startingValue={0}
                            imageSize={28}
                            onFinishRating={ratingCompleted}
                        />
                    </View>
                    <TextInput
                        placeholder='Type your feedback'
                        style={styles.input}
                        onChangeText={text => setSalonFeedback(text)} value={salonFeedback}
                        multiline={true}
                        numberOfLines={5}
                    />
                    <Text style={[styles.salonText, { marginTop: 28.5 }]}>Stylist</Text>
                    <Text style={styles.ratingText}>Rating</Text>
                    <View style={styles.ratingView}>
                        <Rating
                            type='custom'
                            ratingCount={5}
                            ratingColor='#1F1E1E'
                            ratingBackgroundColor='#c8c7c8'
                            tintColor="#FFFFFF"
                            startingValue={0}
                            imageSize={28}
                            onFinishRating={StylistratingCompleted}
                        />
                    </View>
                    <TextInput
                        placeholder='Type your feedback'
                        style={styles.input}
                        onChangeText={text => setStylistFeedback(text)} value={stylistFeedback}
                        multiline={true}
                        numberOfLines={5}
                    />
                    <Pressable style={styles.sendButton}>
                        <Text style={styles.sendButtonText} onPress={() => _onSend()}>Send</Text>
                    </Pressable>
                </KeyboardAwareScrollView>
            }
        </View>
    )
}
export default ReviewScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF"
    },
    salonText: {
        fontSize: 18,
        fontFamily: 'Avenir-Black',
        lineHeight: 25,
        marginLeft: 30
    },
    ratingText: {
        fontSize: 16,
        fontFamily: 'Avenir-Heavy',
        lineHeight: 22,
        marginLeft: 30,
        marginTop: 8
    },
    ratingView: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginLeft: 27,
        marginTop: 8
    },
    input: {
        borderWidth: 1,
        marginLeft: 30,
        marginTop: 17.5,
        marginRight: 26.5,
        height: 75,
        textAlignVertical: 'top'
    },
    sendButton: {
        borderWidth: 1,
        marginLeft: 114.5,
        marginTop: 28,
        marginRight: 130.5,
        marginBottom: 10
    },
    sendButtonText: {
        textAlign: 'center',
        marginTop: 8.5,
        marginBottom: 7.5,
        fontFamily: 'Avenir-Medium',
    }
})