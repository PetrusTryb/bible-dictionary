var firebaseConfig = {
    apiKey: "AIzaSyAFv00TDFUUE9vuSZhuMtOVsSbKz8n-PYg",
    authDomain: "bible-dict.firebaseapp.com",
    databaseURL: "https://bible-dict.firebaseio.com",
    projectId: "bible-dict",
    storageBucket: "bible-dict.appspot.com",
    messagingSenderId: "86591108690",
    appId: "1:86591108690:web:aa9039e63fff9aae90518b"
  };
  firebase.initializeApp(firebaseConfig);
  var db = firebase.firestore();
  function makeCard(data){
  	let template = `
      <div class="card deep-purple darken-1">
        <div class="card-content white-text">
          <span class="card-title">${data.name}</span>
          <p>${data.content}</p>
        </div>
      </div>`;
$("#container-main").append(template);
  }
  db.collection("definitions").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        console.log(doc.id);
        console.log(doc.data())
        makeCard(doc.data());
    });
    M.AutoInit();

});
$("#addButton").on("click",function(){
let name = $("#name_input").val();
    let content = $("#content_input").val();
    let keywords = $("#keywords_input").val().split(';');
    db.collection("definitions").doc(name).set({
      name:name,
      content:content,
      keywords:keywords
    }).then(function(){
      location.reload();
    });
})