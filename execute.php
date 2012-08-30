<?php
/************************************************************
 * InfiniteWP Admin panel									*
 * Copyright (c) 2012 Revmakx								*
 * www.revmakx.com											*
 *															*
 ************************************************************/

define('IS_EXECUTE_FILE', true);

if(@$_REQUEST['check'] == 'sameURL'){
	echo 'same_url_connection';
	exit;
}

require_once('includes/app.php');
set_time_limit(3600);//3600 = 1hr, this is only for safety, we are controlling timeout in CURL 

if($_REQUEST['runOffBrowserLoad'] == 'true'){
	runOffBrowserLoad();
}
else{

	$historyID = $_POST['historyID'];
	$actionID = $_POST['actionID'];
	
	if(empty($historyID) || empty($actionID)){ echo 'invalidRequest'; exit; }
	//fix: add some security 
	
	$isValid = DB::getExists("?:history", "historyID", "historyID = ".$historyID." AND actionID = '".$actionID."'");
	if($isValid){
		
		if(empty($_SESSION['userID'])){
			//setting userID of the task to session, because when this file running by fsock, it will not have the same session IWP Admin Panel
			$userID = DB::getField("?:history", "userID", "historyID = ".$historyID." AND actionID = '".$actionID."'");
			$_SESSION['userID'] = $userID;
		}
		echo 'executingRequest';
		executeRequest($historyID);
		do{
			$status = executeJobs();
		}
		while($status['requestInitiated'] > 0 && $status['requestPending'] > 0);
		
		exit;
	}
	echo '<br>Invalid';
}


	
?>