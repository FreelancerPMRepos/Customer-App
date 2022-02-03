import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Header from '../../../Components/Header'
import { Rating, AirbnbRating } from 'react-native-ratings';

const ReviewScreen = (props) => {

    const _onBack = () => props.navigation.goBack()

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
                            readonly={true}
                            startingValue={3}
                            imageSize={28}
                        //   onFinishRating={this.ratingCompleted}
                        />
                    </View>
                    <TextInput
                        placeholder='Type your feedback'
                        style={{borderWidth: 1, marginLeft: 26.5, marginTop: 17.5, marginRight: 26.5, height: 75,}}
                    />
                    <Text style={{fontSize: 18, fontFamily: 'Avenir-Black', lineHeight: 25, marginLeft: 27, marginTop: 28.5}}>Stylist</Text>
                    <Text style={{fontSize: 16, fontFamily: 'Avenir-Heavy', lineHeight: 22, marginLeft: 27, marginTop: 8}}>Rating</Text>
                    <View style={{ justifyContent: 'flex-start', alignItems: 'flex-start', marginLeft: 27, marginTop: 8 }}>
                        <Rating
                            type='custom'
                            ratingCount={5}
                            ratingColor='#1F1E1E'
                            ratingBackgroundColor='#c8c7c8'
                            tintColor="#FFFFFF"
                            readonly={true}
                            startingValue={3}
                            imageSize={28}
                        //   onFinishRating={this.ratingCompleted}
                        />
                    </View>
                    <TextInput
                        placeholder='Type your feedback'
                        style={{borderWidth: 1, marginLeft: 26.5, marginTop: 17.5, marginRight: 26.5, height: 75,}}
                    />
                    <Pressable style={{borderWidth: 1, marginLeft: 114.5, marginTop: 28, marginRight: 130.5}}>
                        <Text style={{textAlign: 'center', marginTop: 8.5, marginBottom: 7.5, fontFamily: 'Avenir-Medium', lineHeight: 19}}>Send</Text>
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