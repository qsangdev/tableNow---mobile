import {Dimensions, ImageBackground, StyleSheet, View} from 'react-native';
import React from 'react';
import Video from 'react-native-video';

const Hello = ({navigation}) => {
  setTimeout(() => {
    navigation.navigate('Welcome');
  }, 2000);

  return (
    // <ImageBackground
    //   style={styles.container}
    //   source={require('../assets/welcome.png')}>
    //   <View style={styles.background} />
    // </ImageBackground>

    <Video
      source={require('../assets/hello.mp4')}
      resizeMode={"cover"}
      onBuffer={this.onBuffer}
      onError={this.videoError}
      style={styles.backgroundVideo}
    />
  );
};

export default Hello;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    backgroundColor: 'black',
    opacity: 0.2,
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    alignItems: 'stretch',
  },
});
