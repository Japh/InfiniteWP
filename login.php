<?php
/************************************************************
 * InfiniteWP Admin panel									*
 * Copyright (c) 2012 Revmakx								*
 * www.revmakx.com											*
 *															*
 ************************************************************/
 
$isLoginPage = true; 
define('USER_SESSION_NOT_REQUIRED', true);
include("includes/app.php");

if(!empty($_POST['email']) && !empty($_POST['password'])){
	userLogin($_POST);
}
elseif(!empty($_GET['logout'])){
	userLogout(true);
}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>InfiniteWP</title>
<link href='https://fonts.googleapis.com/css?family=Droid+Sans:400,700' rel='stylesheet' type='text/css'>
<link rel="stylesheet" type="text/css" href="css/core.css" />
<link rel="stylesheet" href="css/dropkick.css" type="text/css" />
<script src="js/jquery.min.js" type="text/javascript" charset="utf-8"></script>
<script>
$(".loginOnEnter").live('keypress',function(e) {
 var code = (e.keyCode ? e.keyCode : e.which); 
 if(code == 13) { 
 if($("#email").val()!='' && $("#password").val()!='Password' )
	$('#loginSubmitBtn').click();
 }
});
$("#loginBtn").live('mousedown',function(){ 
	 $(this).addClass('pressed');
	}).live('mouseup',function () { 
	$(this).removeClass('pressed');
});
</script>
</head>
<body>
<div class="signin_cont">
<form action="login.php" method="post" name="loginForm">
<div id="logo_signin"></div>
<div class="copy">Sign In to manage your wordpress sites</div>
<?php if(!empty($_SESSION['errorMsg'])){ ?>
<div class="errorMsg"><?php echo $_SESSION['errorMsg'];  unset($_SESSION['errorMsg']); ?></div>
<?php } ?>
<?php if(!empty($_SESSION['successMsg'])){ ?>
<div class="successMsg"><?php echo $_SESSION['successMsg'];  unset($_SESSION['successMsg']); ?></div>
<?php } ?>
<input type="text" name="email" class="loginOnEnter" value="Email" id="email"  onfocus="if(this.value=='Email'){this.value=''; this.style.color='#676c70';}  else { this.style.color='#676c70'; };" onblur="if(this.value==''){ this.value='Email'; this.style.color='#adafb2';}" style="color: #adafb2; "/>
<input type="password" name="password" class="loginOnEnter" value="Password" id="password" onfocus="if(this.value=='Password'){this.value=''; this.style.color='#676c70';}  else { this.style.color='#676c70'; };" onblur="if(this.value==''){ this.value='Password'; this.style.color='#adafb2';}" style="color: #adafb2; "/>
<input type="submit" id="loginSubmitBtn" style="display:none;" name="loginSubmit" value="submit" />
<div class="btn"><a class="rep_sprite" id="loginBtn" onclick="$('#loginSubmitBtn').click();">Log in</a></div>
</form>
</div>
</body>
</html>