import * as CryptoJS from 'crypto-js'
import axios from 'axios'

export const getUserData = async (accountId, authToken, isGoogle) => {

  let loginUrlSymbol = 'fSG1eXI9';
  let loginKey = "rVG09Xnt\0\0\0\0\0\0\0\0";

  let userInfo1UrlSymbol = 'u7sHDCg4';
  let userInfo1Key = "rcsq2eG7\0\0\0\0\0\0\0\0";
  let userInfo1PayloadKey = 'X07iYtp5';

  let userInfo2UrlSymbol = '7KZ4Wvuw';
  let userInfo2Key = "7VNRi6Dk\0\0\0\0\0\0\0\0";
  let userInfo2PayloadKey = '2eK5Vkr8';

  let userInfo3UrlSymbol = 'lZXr14iy';
  let userInfo3Key = "0Dn4hbWC\0\0\0\0\0\0\0\0"
  let userInfo3PayloadKey = '4rjw5pnv';

  let dataBySymbol = {};
  dataBySymbol[loginUrlSymbol] = 'ffbeConnect';
  dataBySymbol[userInfo1UrlSymbol] = 'ffbeUserData';
  dataBySymbol[userInfo2UrlSymbol] = 'ffbeUserData3';
  dataBySymbol[userInfo3UrlSymbol] = 'ffbeUserData3';

  try {
    const getInitialAuthentication = async () => {
      const data = await getAuthenticationPayload(accountId, authToken, isGoogle, loginKey);
      const data_1 = await callActionSymbol(loginUrlSymbol, loginKey, data);
      const data_2 = await getLoginToken(accountId, authToken, isGoogle, data_1);
      return await wait1s(data_2);
    }
    const initialAuthentication = await getInitialAuthentication()

    const getUserData1 = async (initial_data) => {
      console.log('1')
      const data_1 = await getUserInfoRequestPayload(userInfo1Key, userInfo1PayloadKey, initial_data);
      const data_2 = await callActionSymbol(userInfo1UrlSymbol, userInfo1Key, data_1);
      const data_3 = await saveResponseAs('userData', data_2);
      return await wait1s(data_3);
    }
    const userData1 = await getUserData1(initialAuthentication)

    const getUserData2 = async (userData) => {
      console.log('2')
      const data_1 = await getUserInfoRequestPayload(userInfo2Key, userInfo2PayloadKey, userData);
      const data_2 = await callActionSymbol(userInfo2UrlSymbol, userInfo2Key, data_1);
      const data_3 = await saveResponseAs('userData2', data_2);
      return await wait1s(data_3);
    }
    const userData2 = await getUserData2(userData1)

    const getUserData3 = async (userData) => {
      console.log('3')
      const data_1 = await getUserInfoRequestPayload(userInfo3Key, userInfo3PayloadKey, userData);
      const data_2 = await callActionSymbol(userInfo3UrlSymbol, userInfo3Key, data_1);
      const data_3 = await saveResponseAs('userData3', data_2);
      return await wait1s(data_3);
    }
    const userData3 = await getUserData3(userData2)
    return { userData: userData3.userData, userData2: userData3.userData2, userData3: userData3.userData3 }
  } catch (errorData) {
    console.log('error', errorData)
  }
  // try{
  //   return {userData: data.userData, userData2: data.userData2, userData3: data.userData3}
  // } catch (errorData){
  //   console.log({ type: "error", data: dataBySymbol[errorData.actionSymbol], message: `${errorData.status} - ${errorData.error}` })
  // }
}

function wait1s(data) {
  return new Promise(resolve => setTimeout(() => resolve(data), 1000));
}

function saveResponseAs(name, data) {
  return new Promise(resolve => {
    data[name] = data.jsonResult;
    resolve(data);
  });
}


function getAuthenticationPayload(accountId, authToken, isGoogle, actionKey) {
  return new Promise((resolve => {
    if (isGoogle) {
      var testPayload = "{\"LhVz6aD2\":[{\"6Nf5risL\":\"0\",\"40w6brpQ\":\"0\",\"jHstiL12\":\"0\",\"io30YcLA\":\"Nexus 6P_android6.0\",\"K1G4fBjF\":\"2\",\"e8Si6TGh\":\"\",\"1WKh6Xqe\":\"ver.2.7.0.1\",\"64anJRhx\":\"2019-02-08 11:15:15\",\"Y76dKryw\":null,\"6e4ik6kA\":\"\",\"NggnPgQC\":\"\",\"e5zgvyv7\":\"" + authToken + "\",\"GwtMEDfU\":\"" + accountId + "\"}],\"Euv8cncS\":[{\"K2jzG6bp\":\"1\"}],\"c402FmRD\":[{\"kZdGGshD\":\"2\"}],\"c1qYg84Q\":[{\"a4hXTIm0\":\"F_APP_VERSION_AND\",\"wM9AfX6I\":\"10000\"},{\"a4hXTIm0\":\"F_RSC_VERSION\",\"wM9AfX6I\":\"0\"},{\"a4hXTIm0\":\"F_MST_VERSION\",\"wM9AfX6I\":\"2047\"}]}";
    } else {
      var testPayload = "{\"LhVz6aD2\":[{\"9Tbns0eI\":null,\"9qh17ZUf\":null,\"6Nf5risL\":\"0\",\"io30YcLA\":\"Nexus 6P_android6.0\",\"K1G4fBjF\":\"2\",\"e8Si6TGh\":\"\",\"U7CPaH9B\":null,\"1WKh6Xqe\":\"ver.2.7.0.1\",\"64anJRhx\":\"2019-02-08 11:15:15\",\"Y76dKryw\":null,\"6e4ik6kA\":\"\",\"NggnPgQC\":\"\",\"X6jT6zrQ\":null,\"DOFV3qRF\":null,\"P_FB_TOKEN\":\"" + authToken + "\",\"P_FB_ID\":\"" + accountId + "\"}],\"Euv8cncS\":[{\"K2jzG6bp\":\"0\"}],\"c1qYg84Q\":[{\"a4hXTIm0\":\"F_APP_VERSION_IOS\",\"wM9AfX6I\":\"10000\"},{\"a4hXTIm0\":\"F_RSC_VERSION\",\"wM9AfX6I\":\"0\"},{\"a4hXTIm0\":\"F_MST_VERSION\",\"wM9AfX6I\":\"377\"}]}";
    }
    var encrypted = CryptoJS.AES.encrypt(testPayload, CryptoJS.enc.Utf8.parse(actionKey), { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
    resolve({
      payload: "{\"TEAYk6R1\":{\"ytHoz4E2\":\"75527\",\"z5hB3P01\":\"75fYdNxq\"},\"t7n6cVWf\":{\"qrVcDe48\":\"" + encrypted.ciphertext.toString(CryptoJS.enc.Base64) + "\"}}"
    });
  }));
}

function getLoginToken(accountId, authToken, isGoogle, data) {
  return new Promise(resolve => {
    if (isGoogle) {
      data.loginToken = "{\"LhVz6aD2\":[{" +
        "\"9qh17ZUf\":\"" + data.jsonResult["LhVz6aD2"][0]["9qh17ZUf"] + "\"," +
        "\"JC61TPqS\":\"" + data.jsonResult["LhVz6aD2"][0]["JC61TPqS"] + "\"," +
        "\"6Nf5risL\":\"" + data.jsonResult["LhVz6aD2"][0]["6Nf5risL"] + "\"," +
        "\"40w6brpQ\":\"0\"," +
        "\"jHstiL12\":\"0\"," +
        "\"io30YcLA\":\"Nexus 6P_android6.0\"," +
        "\"K1G4fBjF\":\"2\"," +
        "\"e8Si6TGh\":\"" + data.jsonResult["LhVz6aD2"][0]["e8Si6TGh"] + "\"," +
        "\"1WKh6Xqe\":\"ver.2.7.0.1\"," +
        "\"64anJRhx\":\"2019-02-08 11:15:15\"," +
        "\"m3Wghr1j\":\"" + data.jsonResult["LhVz6aD2"][0]["m3Wghr1j"] + "\"," +
        "\"ma6Ac53v\":\"0\"," +
        "\"D2I1Vtog\":\"0\"," +
        "\"9K0Pzcpd\":\"10000\"," +
        "\"mESKDlqL\":\"" + data.jsonResult["LhVz6aD2"][0]["mESKDlqL"] + "\"," +
        "\"iVN1HD3p\":\"" + data.jsonResult["LhVz6aD2"][0]["iVN1HD3p"] + "\"," +
        "\"Y76dKryw\":null," +
        "\"6e4ik6kA\":\"\"," +
        "\"NggnPgQC\":\"" + data.jsonResult["LhVz6aD2"][0]["NggnPgQC"] + "\"," +
        "\"GwtMEDfU\":\"" + accountId + "\"," +
        "\"e5zgvyv7\":\"" + authToken + "\"," +
        "\"9Tbns0eI\":\"" + data.jsonResult["LhVz6aD2"][0]["9Tbns0eI"] + "\"" +
        "}],\"QCcFB3h9\":[{\"qrVcDe48\":\"" + data.jsonResult["QCcFB3h9"][0]["qrVcDe48"] +
        "\"}],\"c1qYg84Q\":[{\"a4hXTIm0\":\"F_APP_VERSION_AND\",\"wM9AfX6I\":\"10000\"},{\"a4hXTIm0\":\"F_RSC_VERSION\",\"wM9AfX6I\":\"0\"},{\"a4hXTIm0\":\"F_MST_VERSION\",\"wM9AfX6I\":\"10000\"}]}";
    } else {
      data.loginToken = "{\"LhVz6aD2\":[{\"JC61TPqS\":\"" + data.jsonResult["LhVz6aD2"][0]["JC61TPqS"] + "\",\"m3Wghr1j\":\"" + data.jsonResult["LhVz6aD2"][0]["m3Wghr1j"] + "\",\"mESKDlqL\":\"" + data.jsonResult["LhVz6aD2"][0]["mESKDlqL"] + "\",\"iVN1HD3p\":\"" + data.jsonResult["LhVz6aD2"][0]["iVN1HD3p"] + "\",\"9K0Pzcpd\":\"10000\",\"X6jT6zrQ\":\"10101870574910143\",\"9Tbns0eI\":\"" + data.jsonResult["LhVz6aD2"][0]["9Tbns0eI"] + "\",\"9qh17ZUf\":\"" + data.jsonResult["LhVz6aD2"][0]["9qh17ZUf"] + "\",\"6Nf5risL\":\"" + data.jsonResult["LhVz6aD2"][0]["6Nf5risL"] + "\",\"io30YcLA\":\"Nexus 6P_android6.0\",\"K1G4fBjF\":\"2\",\"e8Si6TGh\":\"" + data.jsonResult["LhVz6aD2"][0]["e8Si6TGh"] + "\",\"U7CPaH9B\":\"" + data.jsonResult["LhVz6aD2"][0]["U7CPaH9B"] + "\",\"1WKh6Xqe\":\"ver.2.7.0.1\",\"64anJRhx\":\"2019-02-08 11:15:15\",\"Y76dKryw\":null,\"6e4ik6kA\":\"\",\"NggnPgQC\":\"\",\"DOFV3qRF\":null,\"P_FB_TOKEN\":null,\"P_FB_ID\":null}],\"QCcFB3h9\":[{\"qrVcDe48\":\"" + data.jsonResult["QCcFB3h9"][0]["qrVcDe48"] + "\"}],\"Euv8cncS\":[{\"K2jzG6bp\":\"0\"}],\"c1qYg84Q\":[{\"a4hXTIm0\":\"F_APP_VERSION_IOS\",\"wM9AfX6I\":\"10000\"},{\"a4hXTIm0\":\"F_RSC_VERSION\",\"wM9AfX6I\":\"0\"},{\"a4hXTIm0\":\"F_MST_VERSION\",\"wM9AfX6I\":\"10000\"}]}";
    }
    resolve(data);
  });
}

function getUserInfoRequestPayload(actionKey, payloadKey, data) {
  return new Promise(resolve => {
    var secondEncrypted = CryptoJS.AES.encrypt(data.loginToken, CryptoJS.enc.Utf8.parse(actionKey), { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
    data.payload = `{"TEAYk6R1":{"ytHoz4E2":"75528","z5hB3P01":"${payloadKey}"},"t7n6cVWf":{"qrVcDe48":"${secondEncrypted.ciphertext.toString(CryptoJS.enc.Base64)}"}}`;
    resolve(data);
  });
}

//change this to axios.post
function callActionSymbol(actionSymbol, actionKey, data) {
  return new Promise((resolve, reject) => {
    // axios({
    //   method: "POST",
    //   url: `https://lapis340v-gndgr.gumi.sg/lapisProd/app/php/gme/actionSymbol/${actionSymbol}.php`,
    //   data: data.payload,
    //   contentType: "application/json; charset=utf-8",
    //   responseType: "json"
    // })
    axios.post(`https://lapis340v-gndgr.gumi.sg/lapisProd/app/php/gme/actionSymbol/${actionSymbol}.php`, data.payload)
      .then(response => {
        try {
          var encryptedPayload = response.data['t7n6cVWf']['qrVcDe48'];
          var decrypted = CryptoJS.AES.decrypt({
            ciphertext: CryptoJS.enc.Base64.parse(encryptedPayload.toString())
          }, CryptoJS.enc.Utf8.parse(actionKey), { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });

          data.jsonResult = JSON.parse(CryptoJS.enc.Utf8.stringify(decrypted));
          resolve(data);
        } catch (e) {
          reject({
            actionSymbol: actionSymbol,
            status: e.name,
            error: e.message
          });
        }
      })
  });
}