import React, { useState, useEffect } from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    Image, 
    Pressable 
} from 'react-native';

import Header from '../../../Components/EmployeeHeader';
import { BASE_URL, Colors } from '../../../Config';
import { Rating } from 'react-native-ratings';
import axios from 'axios';

const PerformanceScreen = (props) => {
    const [revenueListData, setRevenueListData] = useState([]);

    const _onBack = () => props.navigation.goBack()

    useEffect(() => {
        getRevenue();
    }, [])

    const getRevenue = () => {
        axios.get(`${BASE_URL}/revenue?employee_id=7`)
            .then(res => {
                console.log('res', res.data)
                setRevenueListData(res.data)
                // setLoading(false)
            })
            .catch(e => {
                console.log('e', e)
                //  setLoading(false)
            })
    }

    return (
        <View style={styles.container}>
            {
                <Header leftIcon="menu" onLeftIconPress={() => _onBack()} title={"My Performance"} {...props} />
            }
            {
                <View style={styles.mainView}>
                    <Text style={styles.title}>My Performance</Text>

                    {/* year box */}
                    <Pressable style={[styles.revenueButton, { marginTop: 10.75, }]} onPress={() => props.navigation.navigate('RevenueYear')}>
                        <Image
                            style={styles.imageStyle}
                            source={require('../../../Images/graph-icon.png')}
                        />
                        <Text style={[styles.revenueTextStyle,{  marginRight: 83 }]}>Revenue This Year</Text>
                        <View style={{ justifyContent: 'center', marginRight: 31.25 }}>
                            <Text style={styles.amountText}>${revenueListData.store_revenue_this_year}</Text>
                        </View>
                    </Pressable>

                    {/* month box */}
                    <Pressable style={[styles.revenueButton,{ marginTop: 15.75}]} onPress={() => props.navigation.navigate('RevenueMonth')}>
                        <Image
                            style={styles.imageStyle}
                            source={require('../../../Images/graph-icon.png')}
                        />
                        <Text style={[styles.revenueTextStyle,{ marginRight: 25 }]}>Revenue This Month (Aug)</Text>
                        <View style={{ justifyContent: 'center', marginRight: 31 }}>
                            <Text style={styles.amountText}>${revenueListData.store_revenue_this_month}</Text>
                        </View>
                    </Pressable>

                    {/* week box */}
                    <Pressable style={[styles.revenueButton,{ marginTop: 15.75}]} onPress={() => props.navigation.navigate('RevenueWeek')}>
                        <Image
                            style={styles.imageStyle}
                            source={require('../../../Images/graph-icon.png')}
                        />
                        <Text style={[styles.revenueTextStyle,{ marginRight: 67 }]}>Revenue This Week</Text>
                        <View style={{ justifyContent: 'center', marginRight: 31 }}>
                            <Text style={styles.amountText}>${revenueListData.store_revenue_this_week}</Text>
                        </View>
                    </Pressable>
                    <Text style={styles.reviewAndRatingText}>Reviews & Ratings</Text>


                    {/* Rating View */}
                    <View style={{ borderWidth: 0.5, marginTop: 10.75 }}>
                        <View style={{ flexDirection: 'row', }}>
                            <Text style={styles.averageRatingText}>Average Rating:</Text>
                            <View style={{ marginTop: 17.25, marginLeft: 15, }}>
                                <Rating
                                    type='custom'
                                    ratingCount={5}
                                    ratingColor='#50C2C6'
                                    ratingBackgroundColor='#c8c7c8'
                                    tintColor="#FFFFFF"
                                    readonly={true}
                                    startingValue={4}
                                    imageSize={20}
                                    style={{}}
                                //   onFinishRating={this.ratingCompleted}
                                />
                            </View>
                            <Text style={styles.overallRatingText}>(4.0)</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginLeft: 201 }}>
                            <Image
                                style={{ marginTop: 8 }}
                                source={require('../../../Images/Shape.png')}
                            />
                            <Text style={styles.totalUserText}> 20,235</Text>
                        </View>
                    </View>

                    {/* Review */}
                    <View style={{ borderWidth: 1, marginTop: 15.25 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Image
                                style={{ marginTop: 9, marginLeft: 10.5 }}
                                source={require('../../../Images/Oval.png')}
                            />
                            <View>
                                <Text style={styles.reviewName}>Alex Ross</Text>
                                <View style={styles.ratingView}>
                                    <Rating
                                        type='custom'
                                        ratingCount={5}
                                        ratingColor='#50C2C6'
                                        ratingBackgroundColor='#c8c7c8'
                                        tintColor="#FFFFFF"
                                        readonly={true}
                                        startingValue={4}
                                        imageSize={14}
                                    //   onFinishRating={this.ratingCompleted}
                                    />
                                </View>
                            </View>
                        </View>
                        <Text style={styles.reviewTextStyle}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</Text>
                    </View>
                </View>
            }
        </View>
    )
}
export default PerformanceScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white
    },
    mainView: {
        marginLeft: 16,
        marginTop: 16,
        marginRight: 15.75
    },
    title: {
        fontSize: 16,
        fontFamily: 'Avenir-Heavy',
        lineHeight: 22,
        color: Colors.black
    },
    reviewTextStyle: {
        color: Colors.black, 
        fontSize: 12, 
        fontFamily: 'Avenir-Medium', 
        lineHeight: 16, 
        marginLeft: 11.5, 
        marginBottom: 11.5
    },
    ratingView: {
        marginTop: 3, 
        marginLeft: 8.5,
    },
    reviewName: {
        fontFamily: 'Avenir-Heavy', 
        lineHeight: 19, 
        color: Colors.black, 
        marginLeft: 8.5, 
        marginTop: 11.5
    },
    revenueTextStyle: {
        fontSize: 16, 
        fontFamily: 'Avenir-Medium', 
        lineHeight: 22, 
        color: Colors.black, 
        marginTop: 21.25,
    },
    amountText: {
        fontSize: 18, 
        fontFamily: 'Avenir-Black', 
        color: '#50C2C6'
    },
    imageStyle: {
        marginTop: 17.25, 
        marginLeft: 9.25, 
        marginBottom: 17.25
    },
    revenueButton: {
        flexDirection: 'row', 
        borderWidth: 0.5,  
        justifyContent: 'space-between',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1
    },
    averageRatingText: {
        marginTop: 17.25, 
        marginLeft: 15, 
        color: Colors.black, 
        fontSize: 16, 
        fontFamily: 'Avenir-Heavy', 
        lineHeight: 22
    },
    reviewAndRatingText: {
        fontSize: 16, 
        fontFamily: 'Avenir-Heavy', 
        color: Colors.black, 
        marginTop: 17
    },
    overallRatingText: {
        fontSize: 16, 
        fontFamily: 'Avenir-Heavy', 
        lineHeight: 22, 
        marginTop: 17.25, 
        marginLeft: 40
    },
    totalUserText: {
        fontSize: 16, 
        fontFamily: 'Avenir-Medium', 
        lineHeight: 22, 
        color: Colors.black, 
        marginBottom: 7.25, 
        marginTop: 4
    }
})