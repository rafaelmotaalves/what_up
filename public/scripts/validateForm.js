function validateForm(){
  var password1 = document.querySelector("#psw1");
  var password2 = document.querySelector("#psw2");
  var error = document.querySelector("#error");

  if(password1.value !== password2.value){
    error.innerText = "Passwords dont match";
    error.style.display = "block";
    return false;   
  }else if(password1.value.length < 3) {
    error.innerText = "Password needs to be at least 3 caracters long";
    error.style.display = "block";
    return false;
  }
  return true;
}
