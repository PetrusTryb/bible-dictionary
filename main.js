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
  var ui = new firebaseui.auth.AuthUI(firebase.auth());
  ui.start('#loginFrame', {
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ],
  'credentialHelper': firebaseui.auth.CredentialHelper.NONE
});
  firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    $("#loginButton").text("Wyloguj się");
    $(".fixed-action-btn").removeClass("hide");
    M.AutoInit();
  } else {
    $("#loginButton").text("Logowanie administracyjne");
    $(".fixed-action-btn").addClass("hide");
  }
});
  function makeCard(data){
  	let template = `
      <div class="card" style="background-color:rgb(${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)})">
        <div class="card-content">
          <span class="card-title">${data.name}</span>
          <p>${data.content}</p>
          <hr/>
          <p class="left-align">Kategorie: <span class='badge btn btn-flat red lighten-1'>
          ${data.keywords.toString().replace(/\,/g,"</span><span class='badge btn btn-flat red lighten-1'>")}</span></p>
        </div>
      </div>`;
$("#container-main").append(template);
  }
  db.collection("definitions").get().then((querySnapshot) => {
    let searchQuery = location.href.split("?search=")[1];
    querySnapshot.forEach((doc) => {
        if(doc.data().keywords.includes(searchQuery)||searchQuery==undefined)
        makeCard(doc.data());
    });
    $("#container-loader").hide();
    $("#container-main").removeClass("hide");
    M.AutoInit();
    $(".badge").on("click",function(event){
      location.href="?query="+event.target.innerText;
    })
});
  $("#loginButton").on("click",function(){
    if(firebase.auth().currentUser==null)
      $("#loginModal")[0].M_Modal.open();
    else
      firebase.auth().signOut().then(function(){
        M.toast({html:"Zostałeś wylogowany."});
      })
  })
$("#addButton").on("click",function(){
let name = $("#name_input").val();
    let content = $("#content_input").val();
    let keywords = $("#keywords_input").val().split(';');
    try{
    db.collection("definitions").doc(name).set({
      name:name,
      content:content,
      keywords:keywords
    }).then(function() {
    location.reload()
}).catch(function(error) {
    M.toast({html:error.message});
});
}catch(error){
  M.toast({html:error.message});
}
})