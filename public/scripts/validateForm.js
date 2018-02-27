function validateForm(){
  var password1 = document.querySelector("#psw1");
  var password2 = document.querySelector("#psw2");
  var error = document.querySelector("#error");

  if(password1.value !== password2.value){
    error.innerText = "Passwords dont match";
    return false;   
  }else if(password1.value.length < 3) {
    error.innerText = "Password need to be at least 3 caracters long";
    return false;
  }
  return true;
}
