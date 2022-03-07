import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Header from '../../../Components/Header'
import { Rating, AirbnbRating } from 'react-native-ratings';
import axios from 'axios';
import { BASE_URL } from '../../../Config';

const ReviewScreen = ({ navigation, route, props }) => {
    const [salonFeedback, setSalonFeedback] = useState('')
    const [stylistFeedback, setStylistFeedback] = useState('')
    const [salonRating, setSalonRating] = useState('3')
    const [stylistRating, setStylistRating] = useState('3')
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
        console.log("As", {
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
            console.log("ASDf",res.data)
            alert(res.data.message)
            setSalonFeedback('')
            setStylistFeedback('')
       //     setLoading(false)
          })
          .catch(e => {
            console.log('e rrr', e)
       //     setLoading(false)
          })
    }

    return (
        <View style={styles.container}>
            {
                <Header leftIcon='back' onLeftIconPress={_onBack} {...props} />
            }
            {
                <View>
                    <Text style={{ fontSize: 18, fontFamily: 'Avenir-Black', lineHeight: 25, marginLeft: 27 }}>Salon</Text>
                    <Text style={{ fontSize: 16, fontFamily: 'Avenir-Heavy', lineHeight: 22, marginLeft: 27, marginTop: 8 }}>Rating</Text>
                    <View style={{ justifyContent: 'flex-start', alignItems: 'flex-start', marginLeft: 27, marginTop: 8 }}>
                        <Rating
                            type='custom'
                            ratingCount={5}
                            ratingColor='#1F1E1E'
                            ratingBackgroundColor='#c8c7c8'
                            tintColor="#FFFFFF"
                            //    readonly={true}
                            startingValue={3}
                            imageSize={28}
                            onFinishRating={ratingCompleted}
                        />
                    </View>
                    <TextInput
                        placeholder='Type your feedback'
                        style={{ borderWidth: 1, marginLeft: 26.5, marginTop: 17.5, marginRight: 26.5, height: 75, }}
                        onChangeText={text => setSalonFeedback(text)} value={salonFeedback}
                    />
                    <Text style={{ fontSize: 18, fontFamily: 'Avenir-Black', lineHeight: 25, marginLeft: 27, marginTop: 28.5 }}>Stylist</Text>
                    <Text style={{ fontSize: 16, fontFamily: 'Avenir-Heavy', lineHeight: 22, marginLeft: 27, marginTop: 8 }}>Rating</Text>
                    <View style={{ justifyContent: 'flex-start', alignItems: 'flex-start', marginLeft: 27, marginTop: 8 }}>
                        <Rating
                            type='custom'
                            ratingCount={5}
                            ratingColor='#1F1E1E'
                            ratingBackgroundColor='#c8c7c8'
                            tintColor="#FFFFFF"
                            //    readonly={true}
                            startingValue={3}
                            imageSize={28}
                            onFinishRating={StylistratingCompleted}
                        />
                    </View>
                    <TextInput
                        placeholder='Type your feedback'
                        style={{ borderWidth: 1, marginLeft: 26.5, marginTop: 17.5, marginRight: 26.5, height: 75, }}
                        onChangeText={text => setStylistFeedback(text)} value={stylistFeedback}
                    />
                    <Pressable style={{ borderWidth: 1, marginLeft: 114.5, marginTop: 28, marginRight: 130.5 }}>
                        <Text style={{ textAlign: 'center', marginTop: 8.5, marginBottom: 7.5, fontFamily: 'Avenir-Medium', lineHeight: 19 }} onPress={() => _onSend()}>Send</Text>
                    </Pressable>
                </View>
            }
        </View>
    )
}
export default ReviewScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF"
    }
})