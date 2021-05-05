import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBq1K_Lkq6mx0_3n4Ec501uJEfRQuSGFrE',
  authDomain: 'fractal5.firebaseapp.com',
  databaseURL: 'https://fractal5.firebaseio.com',
  projectId: 'fractal5',
  storageBucket: 'fractal5.appspot.com',
  messagingSenderId: '12345-insert-yourse',
  appId: '1:130962317265:ios:87328a67722d0c73bccaf0',
};

firebase.initializeApp(firebaseConfig);

export { firebase };
