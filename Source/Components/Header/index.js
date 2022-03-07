import React from 'react';
import { Pressable, View, Image, StyleSheet, StatusBar } from 'react-native';
import { width } from '../../Config';

const Header = ({ leftIcon, onLeftIconPress, ...props }) => {
    return (
        <>
            <View style={styles.header}>
            <StatusBar barStyle="dark-content" backgroundColor={"white"} />
                <View style={styles.column}>
                    <Pressable onPress={onLeftIconPress}>
                        {
                            leftIcon == 'back' && <Image style={styles.tinyLogo} source={require('../../Images/back-arrow.png')} />
                        }
                    </Pressable>
                </View>
                <View style={ leftIcon == 'back' ? [styles.titleView,{alignItems: 'center'}] : [styles.titleView,{justifyContent: 'center', alignItems: 'center'}]}>
                    <Image source={require('../../Images/hairkut.png')} style={{resizeMode :'contain'}}/>
                </View>
            </View>
        </>
    )
}

export default Header;

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 70,
        flexDirection: 'row',
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        height: 68,
    },
    column: {
    },
    titleView: {
        flex: 1,
        
    },
    tinyLogo: {
        left: width * 0.06
    }
})