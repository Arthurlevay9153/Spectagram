import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { RFValue } from "react-native-responsive-fontsize";
import * as Font from "expo-font";
import * as SplashScreen from 'expo-splash-screen';
import firebase from "firebase";

SplashScreen.preventAutoHideAsync();

let customFonts = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf")
};

export default class StoryCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      light_theme: true,
      is_liked: false,
      likes: this.props.story.value.likes,
      story_id: this.props.story.key,
      story_data: this.props.story.value,
    };
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
    this.fetchUser();
  }

  async fetchUser() {
    let theme;
    await firebase
      .database()
      .ref("/users/" + firebase.auth().currentUser.uid)
      .on("value", (snapshot) => {
        theme = snapshot.val().current_theme;
        this.setState({
          light_theme: theme === "light" ? true : false,
          isEnabled: theme === "light" ? true : false
        });
      });
  }

  likeAction = () => {
    if (this.state.is_liked) {
      firebase
        .database()
        .ref("posts")
        .child(this.state.story_id)
        .child("likes")
        .set(firebase.database.ServerValue.increment(-1));
      this.setState({ likes: (this.state.likes -= 1), is_liked: false });
    } else {
      firebase
        .database()
        .ref("posts")
        .child(this.state.story_id)
        .child("likes")
        .set(firebase.database.ServerValue.increment(1));
      this.setState({ likes: (this.state.likes += 1), is_liked: true });
    }
  };
  
  render() {
    if (this.state.fontsLoaded) {
      SplashScreen.hideAsync();

      let story = this.state.story_data;

      let images = {
        image1: require("../assets/image_1.jpg"),
        image2: require("../assets/image_2.jpg"),
        image3: require("../assets/image_3.jpg"),
        image4: require("../assets/image_4.jpg"),
        image5: require("../assets/image_5.jpg"),
        image6: require("../assets/image_6.jpg"),
        image7: require("../assets/image_7.jpg"),
      };
      
      return (
        <TouchableOpacity style={styles.container} onPress = {() => {this.props.navigation.navigate ('StoryScreen',{story:story,story_id:this.state.story_id})}}> {/*renderizar o post/card & e navegar entre as telas*/}
          <View style={this.state.light_theme?styles.cardContainerLight:styles.cardContainer}> {/*renderizar o style 'cardContainer' no post/card*/}

            <Image
              source={images[story.preview_image]} 
              style={styles.storyImage} 
            ></Image> {/*renderizar o style 'storyImage' no post/card || renderizar a imagem do card/post*/} 

            <View style={styles.titleContainer}> {/*renderizar o style 'titleContainer' no post/card*/}
              <Text style={this.state.light_theme?styles.storyTitleTextLight:styles.storyTitleText}> {/*renderizar o style 'storyTitleText' no post/card*/}
                {story.title} {/*renderizar o texto presente na aba 'temp.json' no post/card*/}
              </Text>
              <Text style={this.state.light_theme?styles.storyAuthorTextLight:styles.storyAuthorText}> {/*renderizar o style 'storyAuthorText' no post/card*/}
                {story.author} {/*renderizar o texto presente na aba 'temp.json' no post/card*/}
              </Text>
              <Text style={this.state.light_theme?styles.descriptionTextLight:styles.descriptionText}> {/*renderizar o style 'descriptionText' no post/card*/}
                {story.description} {/*renderizar o texto presente na aba 'temp.json' no post/card*/} 
              </Text>
            </View>
            <View style={styles.actionContainer}> {/*renderizar o style 'actionContainer' no post/card*/}
            <TouchableOpacity
                style={
                  this.state.is_liked
                    ? styles.likeButtonLiked
                    : styles.likeButtonDisliked
                }
                onPress={() => this.likeAction()}
              >
                <Ionicons
                  name={"heart"}
                  size={RFValue(30)}
                  color={this.state.light_theme ? "black" : "white"}
                />

                <Text
                  style={
                    this.state.light_theme
                      ? styles.likeTextLight
                      : styles.likeText
                  }
                >
                  {this.state.likes}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  //estilo do card/post da historia
  cardContainer: {
    margin: RFValue(13),
    backgroundColor: "#2f345d",
    borderColor: "#2f345d",
    borderWidth: RFValue(1.5),
    borderRadius: RFValue(20) // tamanho da curvatura do card
  },

  cardContainerLight: { ////////////
    margin: RFValue(13),
    backgroundColor: "white",
    borderColor: "#E8E8E8",
    borderWidth: RFValue(1.5),
    borderRadius: RFValue(20) // tamanho da curvatura do card
  },
  //estilo da imagem do post da historia
  storyImage: {
    resizeMode: "contain",
    width: "95%",
    alignSelf: "center",
    height: RFValue(250)
  },
  //deixar o texto inteiro no canto esquerdo do post (texte e depois entendera)
  titleContainer: {
    paddingLeft: RFValue(20),
    justifyContent: "center"
  },
  //estilo do texto do titulo da história
  storyTitleText: {
    fontSize: RFValue(25),
    fontFamily: "Bubblegum-Sans",
    color: "white"
  },

  storyTitleTextLight: {
    fontSize: RFValue(25),
    fontFamily: "Bubblegum-Sans", //////////
    color: "#15193c"
  },
  // estilo do texto do author da história
  storyAuthorText: {
    fontSize: RFValue(18),
    fontFamily: "Bubblegum-Sans",
    color: "white"
  },

  storyAuthorTextLight: {
    fontSize: RFValue(18),
    fontFamily: "Bubblegum-Sans", //////////
    color: "#15193c"
  },
  // estilo do texto da descricao da historia
  descriptionText: {
    fontFamily: "Bubblegum-Sans",
    fontSize: 13,
    color: "white",
    paddingTop: RFValue(10)
  },

  descriptionTextLight: {
    fontFamily: "Bubblegum-Sans",
    fontSize: 13,
    color: "#15193c",
    paddingTop: RFValue(10) //////////
  },
  // distancia entre o botao de like e a descricao da historia
  actionContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: RFValue(10)
  },
  // estilo do botao de like
  likeButton: {
    width: RFValue(160),
    height: RFValue(40),
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#eb3948",
    borderRadius: RFValue(30)
  },
  // estilo do texto do botao de like
  likeText: {
    color: "white",
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(25),
    marginLeft: RFValue(5)
  },

  likeTextLight: {
    color: "#15193c",
    fontFamily: "Bubblegum-Sans", ////////////
    fontSize: RFValue(25),
    marginLeft: RFValue(5)
  },

  likeButtonLiked: {
    width: RFValue(160),
    height: RFValue(40),
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#eb3948",
    borderRadius: RFValue(30)
  },
  likeButtonDisliked: {
    width: RFValue(160),
    height: RFValue(40),
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderColor: "#eb3948",
    borderWidth: 2,
    borderRadius: RFValue(30)
  },
  likeText: {
    color: "white",
    fontFamily: "Bubblegum-Sans",
    fontSize: 25,
    marginLeft: 25,
    marginTop: 6
  },
  likeTextLight: {
    fontFamily: "Bubblegum-Sans",
    fontSize: 25,
    marginLeft: 25,
    marginTop: 6
  },
});