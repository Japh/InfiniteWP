<?php

/************************************************************
 * InfiniteWP Admin panel									*
 * Copyright (c) 2012 Revmakx								*
 * www.revmakx.com											*
 *															*
 ************************************************************/

define('UPDATE_PAGE', true);
include('includes/app.php');


if( $_GET['action'] == 'appUpdate' && !empty($_GET['newVersion']) ){
	if($_GET['newVersion'] == $_SESSION['updateAvailable']['newVersion']){
		echo str_pad(' ', 400);
		?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Updating</title>
</head>
<body style="font-family: 'Droid Sans', sans-serif; font-size:12px; color: #555; line-height:24px;">
<div style="margin-top:-30px;"><?php processAppUpdate(); ?></div>
</body>
</html>
<?php
	}
}

?>