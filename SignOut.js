import React from "react";
import { View } from "react-native";
import firebase from "firebase";


export default class LogOut extends React.Component{

    componentDidMount(){
        this.props.navigation.replace('Login')
        firebase.auth().signOut();
        alert('voce foi jogar no vasco')
    }

    render(){
        return(
            <View>
                
            </View>
        )
    }

}