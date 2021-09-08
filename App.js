import React, { useEffect, useState } from 'react';
import 'react-native-gesture-handler';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  PermissionsAndroid,
  SafeAreaView
} from 'react-native';

import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
import { AccessToken, LoginManager } from 'react-native-fbsdk';
//change FB LoginBehavior via LoginManager
import { getUserData } from './background'
import { addLinks } from './addLinks'
import * as RNFS from 'react-native-fs'

LoginManager.setLoginBehavior('WEB_VIEW_ONLY');

const App = () => {
  const [googleData, setGoogleData] = useState()
  const [fbData, setfbData] = useState()
  const [userData, setUserData] = useState()
  const [loading, setLoading] = useState(false)


  const GsignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setGoogleData(userInfo)
      console.log('signed in')
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        console.log('login cancelled', error)
        alert('login cancelled', error)
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
        console.log('sign in already in progress', error)
        alert('sign in already in progress', error)
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        console.log('play services not available or outdated', error)
        alert('play services not available or outdated', error)
      } else {
        // some other error happened
        console.log('error', error, error.code)
        alert('Google error', error, error.code)
      }
    }
  }

  const GsignOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      setGoogleData(null)
      setUserData(null)
      console.log('signed out')
    } catch (error) {
      console.error('signout error', error);
      alert('Google signout error', error);
    }
  };

  useEffect(() => {
    GoogleSignin.configure({})
    async () => {
      try {

        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "FFBE Data Exporter Permission",
            message:
              "FFBE Data Exporter requires write permission to save files to device.",
            buttonNegative: "Cancel",
            buttonPositive: "Accept"
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          alert("Save permission granted.")
        }
      } catch (err) {
        console.warn(err);
      }
    }
  }, [])

  useEffect(() => {
    if (googleData) {
      const getGoogleUserData = async () => {
        console.log('getting ffbe data')
        setLoading(true)
        const GoogleTokens = await GoogleSignin.getTokens()
        const ffbeUserData = await getUserData(googleData.user.id, GoogleTokens.accessToken, true)
        setUserData(ffbeUserData)
        setLoading(false)
        if (ffbeUserData.err) alert(ffbeUserData.err)
        console.log('ffbe data acquired')
      }
      getGoogleUserData();
    }
  }, [googleData])

  useEffect(() => {
    if (fbData) {
      const getFBUserData = async () => {
        console.log('getting ffbe data')
        setLoading(true)
        const ffbeUserData = await getUserData(fbData.userID, fbData.accessToken, false)
        setUserData(ffbeUserData)
        setLoading(false)
        if (ffbeUserData.err) alert(ffbeUserData.err)
        console.log('ffbe data acquired')
      }
      getFBUserData()
    }
  }, [fbData])

  const fbAuth = async () => {
    if (!fbData) {
      LoginManager.logInWithPermissions(['public_profile']).then(function (result) {
        if (result.isCancelled) {
          console.log('loging cancelled')
        }
        else {
          AccessToken.getCurrentAccessToken().then(data => {
            setfbData(data)
          })
        }
      }, function (error) {
        console.log('An error occured: ' + error)
        alert('An error occurred logging into Facebook: ' + error)
      })
    } else {
      LoginManager.logOut(),
        setfbData(null)
    }
  }

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text >FFBE Data Exporter (Facebook/Google)</Text>
        <View id="GoogleSigninContainer" style={{ flexDirection: 'row' }}>
          <TouchableOpacity style={styles.googleSignInButton} onPress={!googleData ? GsignIn : GsignOut}>
            <Image
              style={{ width: 48, height: 48 }}
              source={require('./google_signin_buttons/android/xxxhdpi/btn_google_light_normal_xxxhdpi.9.png')}>
            </Image>
            <Text style={{ color: 'white', padding: 8, fontWeight: 'bold' }}>{!googleData ? 'Sign in with Google' : 'Sign out of Google'}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.FBLoginButton} onPress={() => fbAuth()}>
          <Image style={{ height: 30, width: 30 }} source={require("./icons/iconfinder_facebook.png")}></Image>
          <Text style={styles.FBText}>{!fbData ? "Log in with Facebook" : "Log out of Facebook"}</Text>
        </TouchableOpacity>
        <View id="how-to-use">
          <Text id="how-to-header" style={{ fontWeight: 'bold', color: 'black', fontSize: 20 }}>How to use this</Text>
          <Text>Log in to the Facebook or Google account bound to the Final Fantasy Brave Exvius you would like to get data files for (units, inventory, espers, and consumables). After loading is finished, you can download each file type to use with ffbeequip.com. Files should be saved to your device's Download folder. This works like the FFBEsync browser extension.</Text>
        </View>
        {loading ? loadingIndicator(loading) : userData && userData.err ? <Text>{userData.err}</Text> : userData && userData.userData3 ? downloadButtons(userData) : <></>}
      </View>
    </SafeAreaView>
  )
};

const loadingIndicator = (isLoading) => {
  return (
    <View style={styles.loadingcontainer}>
      <Image style={{ height: 100, width: "100%" }} source={require('./icons/the_squad_ffbe.gif')}></Image>
      <Text style={{ color: "black", textAlign: 'center' }}>Loading</Text>
      <ActivityIndicator animating={isLoading} size="large" color='#999999' />
    </View>
  )
}


const downloadButtons = (data) => {
  const downloadJSONfile = async (info_type, data) => {
    const { href, download } = addLinks(info_type, data)
    try {
      const readGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
      const writeGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
      if (writeGranted) {
        var path = RNFS.ExternalStorageDirectoryPath + `/Download/${download}`;
        // console.log('path', path)
        RNFS.writeFile(path, href, 'utf8')
          .then((success) => {
            console.log('Success')
            alert(`Downloaded ${download}`);
          })
          .catch((err) => {
            console.log('error', err.message);
          });
      }
    } catch (error) {
      console.log('read/write error', error)
    }
  }

  return (
    <View id="download-button-container" style={styles.downloadButtonContainer}>
      <TouchableOpacity style={styles.downloadButton} onPress={() => downloadJSONfile('inventory', data)}><Text>Inventory</Text></TouchableOpacity>
      <TouchableOpacity style={styles.downloadButton} onPress={() => downloadJSONfile('units', data)}><Text>Units</Text></TouchableOpacity>
      <TouchableOpacity style={styles.downloadButton} onPress={() => downloadJSONfile('espers', data)}><Text>Espers</Text></TouchableOpacity>
      <TouchableOpacity style={styles.downloadButton} onPress={() => downloadJSONfile('consumables', data)}><Text>Consumables</Text></TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: "100%"
  },
  downloadButton: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  downloadButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  googleSignInButton: {
    marginTop: 5,
    marginBottom: 5,
    width: 190,
    height: 45,
    backgroundColor: '#4285f4',
    borderRadius: 2,
    flexDirection: 'row',
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  FBText: {
    color: "white",
    fontSize: 14,
  },
  FBLoginButton: {
    marginTop: 5,
    marginBottom: 5,
    width: 190,
    height: 45,
    backgroundColor: '#3A5A97',
    borderRadius: 2,
    flexDirection: 'row',
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  loadingcontainer: {
    flex: 1,
    justifyContent: "center"
  },
});

export default App;

