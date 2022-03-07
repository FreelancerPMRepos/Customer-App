import React from 'react';
import { Pressable, StyleSheet, View, Text, StatusBar } from 'react-native';
import { Colors, width } from '../../Config';
import FastImage from 'react-native-fast-image'

const Header = ({ leftIcon, onLeftIconPress, rightIcon, onRightIconPress, title, ...props }) => {
    return (
        <>
        <View style={styles.header}>
                <StatusBar barStyle="dark-content" backgroundColor={Colors.black} />
                <View style={styles.column}>
                    <Pressable onPress={onLeftIconPress}>
                        {
                            leftIcon === 'menu' && <FastImage resizeMode={FastImage.resizeMode.contain} source={require('../../Images/menu.png')} style={styles.tinyLogo} />
                        }
                        {
                            leftIcon === 'back' && <FastImage resizeMode={FastImage.resizeMode.contain} style={styles.tinyLogo} source={require('../../Images/back-arrow_white.png')} />
                        }
                    </Pressable>
                </View>
                <View style={styles.titleView}>
                    <Text numberOfLines={1} style={styles.title}>{title ?? ''}</Text>
                </View>
                <View style={styles.rightView}>
                    <Pressable onPress={onRightIconPress}>
                        {
                            rightIcon === 'notification' &&  <FastImage resizeMode={FastImage.resizeMode.contain} source={require('../../Images/bell.png')} style={styles.bellLogo} />
                        }
                    </Pressable>
                </View>
            </View>
        </>
    )
}

export default Header;

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 70,
        backgroundColor: Colors.black,
        flexDirection: 'row',
     //   borderBottomLeftRadius: 12,
     //   borderBottomRightRadius: 12,
        height: 68,
    },
    column: {
        marginRight: 15
    },
    title: {
        fontSize: 18,
        color: Colors.white,
        fontWeight: 'bold',
        marginRight: 30
    },
    titleView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tinyLogo: {
        width: 32,
        height: 32,
        marginLeft: 18
    },
    bellLogo: {
        width: 27,
        height: 28,
        marginRight: 18
    },
    rightView: {
        marginRight: 12
    }
})