import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyCstuIsKV33r55UdrU-zR2OED5WpX80mtw",
    authDomain: "wework-test-5280e.firebaseapp.com",
    databaseURL: "https://wework-test-5280e.firebaseio.com",
    projectId: "wework-test-5280e",
    storageBucket: "wework-test-5280e.appspot.com",
    messagingSenderId: "419527216736",
    appId: "1:419527216736:web:c9e15537c5a960ae933d05",
    measurementId: "G-EEF7E299F2"
};

    firebase.initializeApp(firebaseConfig);
    firebase.firestore().settings({ experimentalForceLongPolling: true });
    
export default firebase;