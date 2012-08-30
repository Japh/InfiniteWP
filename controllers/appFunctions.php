<?php
/************************************************************
 * InfiniteWP Admin panel									*
 * Copyright (c) 2012 Revmakx								*
 * www.revmakx.com											*
 *															*
 ************************************************************/
 
 
function processCallReturn($Array)
{
	//if(isset($Array['success']))
		return $Array;
	//else
		//return false;
}

function isPluginResponse($data){ // Checking if we got the rite data / it didn't time out
 
	if(stripos($data,'IWPHEADER') === false){
		return false;
	}
	return true;
}
function signData($data, $isOpenSSLActive, $privateKey, $randomSignature){
	if( function_exists('openssl_verify') && $isOpenSSLActive ){
		openssl_sign($data, $signature, base64_decode($privateKey));
	}
	elseif(!$isOpenSSLActive){
		$signature =  md5($data . $randomSignature);
	}
	else{
		return false;	
	}
	return $signature;
}

function addHistory($historyData, $historyAdditionalData=''){
	$historyData['userID'] = $_SESSION['userID'];
	$historyData['microtimeAdded']=microtime(true);
	$historyID =  DB::insert('?:history', $historyData);
	if(!empty($historyAdditionalData)){
		foreach($historyAdditionalData as $row){			
			$row['historyID'] = $historyID;
			DB::insert("?:history_additional_data", $row);
			
		}
	}
	
	return $historyID;
}

function updateHistory($historyData, $historyID, $historyAdditionalData=false){
	DB::update('?:history', $historyData, 'historyID='.$historyID);
	
	if(!empty($historyAdditionalData)){
		DB::update('?:history_additional_data', $historyAdditionalData, 'historyID='.$historyID);
	}
}

function getHistory($historyID, $getAdditional=false){
	$historyData = DB::getRow('?:history', '*', 'historyID='.$historyID);
	if($getAdditional){
		$historyData['additionalData'] = DB::getArray('?:history_additional_data', '*', 'historyID='.$historyID);
	}
	return $historyData;
}

function getSiteData($siteID){
	return DB::getRow("?:sites","*","siteID=".$siteID."");
}

function getSitesData($siteIDs=false, $where='1'){//for current user
	if(!empty($siteIDs)){
		$where = "siteID IN (". implode(', ', $siteIDs) .")";
	}
	
	return DB::getArray("?:sites", "*", $where, "siteID");
}

function prepareRequestAndAddHistory($PRP){	
	$defaultPRP = array('doNotExecute' 		=> false,
						'exitOnComplete' 	=> false,
						'doNotShowUser' 	=> false,//hide in history
						'directExecute' 	=> false,
						'signature' 		=> false,
						'timeout' 			=> DEFAULT_MAX_CLIENT_REQUEST_TIMEOUT,
						);
						
	$PRP = array_merge($defaultPRP, $PRP);
	@extract($PRP);
	
	if(empty($historyAdditionalData)){
		echo 'noHistoryAdditionalData';
		return false;	
	}
	
	
	$historyData = array('siteID' => $siteData['siteID'], 
						 'actionID' => Reg::get('currentRequest.actionID'),
						 'userID' => $_SESSION['userID'],
						 'type' => $type,
						 'action' => $action,
						 'events' => $events,
						 'URL' => $siteData['URL'],
						 'timeout' => $timeout);	
	if($doNotShowUser){
		$historyData['showUser'] = 'N';
	}
	
	$historyID = addHistory($historyData, $historyAdditionalData);
		
	if($signature === false){
		$signature = signData($requestAction.$historyID, $siteData['isOpenSSLActive'], $siteData['privateKey'], $siteData['randomSignature']);
	}
	
	$requestParams['username'] =  $siteData['adminUsername'];
	
	$requestData = array('iwp_action' => $requestAction, 'params' => $requestParams, 'id' => $historyID, 'signature' => $signature);
		
	$updateHistoryData = array('status' => 'pending');
	
	updateHistory($updateHistoryData, $historyID);
	
	DB::insert("?:history_raw_details", array('historyID' => $historyID, 'request' => base64_encode(serialize($requestData)), 'panelRequest' => serialize($_REQUEST) ) );
	
	if($directExecute){
		echo 'direct_execute';
		executeRequest($historyID, $type, $action, $siteData['URL'], $requestData, $timeout);
	}
	else{
		echo 'async_call_it_should_be';
		if($exitOnComplete){ Reg::set('currentRequest.exitOnComplete', true); }
	}
}

function executeRequest($historyID, $type='', $action='', $URL='', $requestData='', $timeout='', $isPluginResponse=true){
	
	
	if(empty($type) || empty($action) || empty($URL) || empty($requestData)){
		$historyData = getHistory($historyID);
		$historyRawDetails = DB::getRow("?:history_raw_details", "*", "historyID=".$historyID);
		$type = $historyData['type'];
		$action = $historyData['action'];
		$URL = $historyData['URL'];
		$timeout =  $historyData['timeout'];
		$requestData = unserialize(base64_decode($historyRawDetails['request']));
	}
	updateHistory(array('microtimeInitiated' => microtime(true), 'status' => 'running'), $historyID);

	$updateHistoryData = array();
	list($rawResponseData, $updateHistoryData['microtimeStarted'], $updateHistoryData['microtimeEnded'], $curlInfo)  = doCall($URL, $requestData, $timeout);
	
	DB::update("?:history_raw_details", array('response' => addslashes($rawResponseData), 'callInfo' => serialize($curlInfo)), "historyID = ".$historyID);
		
	//checking request http executed
	if($curlInfo['info']['http_code'] != 200 || !empty($curlInfo['errorNo'])){
		$updateHistoryAdditionalData = array();
		$updateHistoryAdditionalData['status'] = $updateHistoryData['status'] = 'netError';
		
		if($curlInfo['info']['http_code'] != 0 && $curlInfo['info']['http_code'] != 200){
			$updateHistoryAdditionalData['error'] = $updateHistoryData['error'] = $curlInfo['info']['http_code'];
			$updateHistoryAdditionalData['errorMsg'] = 'HTTP Error '.$curlInfo['info']['http_code'].': '.$GLOBALS['httpErrorCodes'][ $curlInfo['info']['http_code'] ].'.';
		}
		elseif($curlInfo['errorNo']){
			$updateHistoryAdditionalData['error'] = $updateHistoryData['error'] = $curlInfo['errorNo'];
			$updateHistoryAdditionalData['errorMsg'] = htmlspecialchars($curlInfo['error']);
		}
				
		return updateHistory($updateHistoryData, $historyID, $updateHistoryAdditionalData);
	}
	
	if($isPluginResponse){//$isPluginResponse is set to true then expecting result should be pluginResponse
		
		//checking response is the plugin data
		if(!isPluginResponse($rawResponseData)){ //Checking the timeout		
			$updateHistoryAdditionalData = array();
			$updateHistoryAdditionalData['status'] = $updateHistoryData['status'] = 'error';	
			$updateHistoryAdditionalData['error'] = $updateHistoryData['error'] = 'main_plugin_connection_error';
			$updateHistoryAdditionalData['errorMsg'] = 'IWP Client plugin connection error.';
			return updateHistory($updateHistoryData, $historyID, $updateHistoryAdditionalData);		
		}		
		
		removeResponseJunk($rawResponseData);
		$responseData = processCallReturn( unserialize(base64_decode($rawResponseData)) );
	}
	else{
		$responseData = $rawResponseData;	
	}
	
	$updateHistoryData['status'] = 'processingResponse';
	updateHistory($updateHistoryData, $historyID);
	
	//handling reponseData below
	
		$responseProcessor = array();
		$responseProcessor['plugins']['install'] = $responseProcessor['themes']['install'] = 'installPluginsThemes';
		$responseProcessor['plugins']['manage'] = $responseProcessor['themes']['manage'] = 'managePluginsThemes';	
		$responseProcessor['stats']['getStats'] = 'getStats';
		$responseProcessor['PTC']['update'] = 'updateAll';
		$responseProcessor['plugins']['get'] = $responseProcessor['themes']['get'] = 'getPluginsThemes';
		$responseProcessor['backup']['now'] = 'backup';
		$responseProcessor['backup']['restore'] = 'restoreBackup';
		$responseProcessor['backup']['remove'] = 'removeBackup';
		$responseProcessor['site']['add'] = 'addSite';
		$responseProcessor['site']['remove'] = 'removeSite';
		$responseProcessor['clientPlugin']['update'] = 'updateClient';


	    $actionResponse = $responseProcessor[$type][$action];
		
	if(manageClients::methodResponseExists($actionResponse)){ 
		manageClients::executeResponse($actionResponse, $historyID, $responseData);
		//call_user_func('manageClients::'.$funcName, $historyID, $responseData);
		updateHistory(array('status' => 'completed'), $historyID);
		return true;
	}
	else{
		updateHistory(array('status' => 'completed'), $historyID);
		echo '<br>no_response_processor';
		return 'no_response_processor';
	}	
}

function onAsyncFailUpdate($historyID, $info){
	
	if($info['status'] == true){ return false; }
	
	$errorMsg = 'Fsock error: ';
	if(!empty($info['error'])){
		$errorMsg .= $info['error'];
	}
	
	if($info['writable'] === false){
		$errorMsg .= 'Unable to write request';
	}	
	
	$updateHistoryAdditionalData = array();
	$updateHistoryAdditionalData['status'] = $updateHistoryData['status'] = 'error';	
	$updateHistoryAdditionalData['error'] = $updateHistoryData['error'] = 'fsock_error';
	$updateHistoryAdditionalData['errorMsg'] = $errorMsg;
	updateHistory($updateHistoryData, $historyID, $updateHistoryAdditionalData);
	return true;
	
}

function removeResponseJunk(&$response){
	$headerPos = stripos($response, '<IWPHEADER');
	if($headerPos !== false){
		$response = substr($response, $headerPos);
		$response = substr($response, strlen('<IWPHEADER>'), stripos($response, '<ENDIWPHEADER'));
	}
}

function responseDirectErrorHandler($historyID, $responseData){
	
	if(!empty($responseData['error']) && is_string($responseData['error'])){
		
		DB::update("?:history_additional_data", array('status' => 'error', 'errorMsg' => $responseData['error']), "historyID=".$historyID."");
		return true;
	}
	return false;
	
}

function exitOnComplete(){
	$maxTimeoutSeconds = 60;
	$maxTimeoutTime = time() + $maxTimeoutSeconds;
	while(DB::getExists("?:history", "historyID", "actionID = '".Reg::get('currentRequest.actionID')."' AND status NOT IN('completed', 'error', 'netError')") && $maxTimeoutTime > time()){
		usleep(100000);//1000000 = 1 sec
	}
}

function clearUncompletedTask(){
	$addtionalTime = 30;//seconds
	$time = time();
	$updateData = array( 'H.status' => 'netError',
						 'H.error' => 'timeoutClear',
						 'HAD.status' => 'netError',
						 'HAD.error' => 'timeoutClear',
						 'HAD.errorMsg' => 'Timeout'
						);
	$where = "H.historyID = HAD.historyID";
	$where .= " AND H.status IN('initiated', 'running')";
	$where .= " AND (H.microtimeInitiated + H.timeout + ".$addtionalTime.") < ".$time."";
	$where .= " AND H.microtimeInitiated > 0";//this will prevent un-initiated task from clearing
	DB::update("?:history H, ?:history_additional_data HAD", $updateData, $where);
	//echo DB::getLastQuery();
}
//Login .
function userLogin($params){
	$userName = DB::getRow("?:users", "userID", "email = '".trim($params["email"])."' AND password = '".sha1($params["password"])."'" );
	$isUserExists = !empty($userName["userID"]) ? true : false;	
	
	$allowedLoginIPs = DB::getFields("?:allowed_login_ips", "IP", "1", "IP");
	$allowedLoginIPsClear = 1;
	if($isUserExists && !empty($allowedLoginIPs)){
		$allowedLoginIPsClear = 0;
		foreach($allowedLoginIPs as $IP){
			if(IPInRange($_SERVER['REMOTE_ADDR'], $IP)){
				$allowedLoginIPsClear = 1;
				break;
			}
		}
	}
	
	if($isUserExists && $allowedLoginIPsClear == 1){
		//session_start();
		$_SESSION["userID"] = $userName['userID'];
		header('Location: '.APP_URL);//'Location: ' => index.php
		exit;
	}
	else{
		$_SESSION = array();
		$_SESSION['errorMsg'] = 'Invalid credentials.';
		header('Location: login.php');
		exit;
	}
}

function userLogout($userRequest=false){
	$_SESSION = array();
	if($userRequest){
		$_SESSION['successMsg'] = 'You have successfully logged out.';
	}
	else{
		//$_SESSION['errorMsg'] = 'Please login to access Admin panel.';
	}
	if(!defined('IS_AJAX_FILE')){
		header('Location: login.php');
		exit;
	}
}

function checkUserLoggedIn(){
	
	$return = false;
	if(!empty($_SESSION['userID'])){
		$return = DB::getExists("?:users", "userID", "userID = ".$_SESSION['userID']);
	}

	if($return == false){
		userLogout();
	}
	return $return;
}

function checkUserLoggedInAndRedirect(){
	//check session, if not logged in redirect to login page
	if(!defined('USER_SESSION_NOT_REQUIRED') && !defined('IS_EXECUTE_FILE')){
		if(!checkUserLoggedIn()){
			echo json_encode(array('logout' => true));
			exit;
		}
	}
}

function anonymousDataRunCheck(){

	if(!Reg::get('settings.sendAnonymous')){ return false; }
	
	$currentTime = time();	
	$nextSchedule = getOption('anonymousDataNextSchedule');
	
	if($currentTime > $nextSchedule){		
		//execute
		$fromTime = getOption('anonymousDataLastSent');
		$isSent = anonymousDataSend($fromTime, $currentTime);
		if(!$isSent){
			return false;	
		}
		//if sent execute below code
		updateOption('anonymousDataLastSent', $currentTime);
		
		$installedTime = getOption('installedTime');
		
		$weekDay = @date('w', $installedTime);
		$currWeekDay = @date('w', $currentTime);
	    $nextNoOfDays = 7 - $currWeekDay + $weekDay;		
		$nextSchedule = mktime(@date('H', $installedTime), @date('i', $installedTime), @date('s', $installedTime), @date('m', $currentTime), @date('d', $currentTime)+$nextNoOfDays, @date('Y', $currentTime));
		updateOption('anonymousDataNextSchedule', $nextSchedule);
		
	}
}

function anonymousDataSend($fromTime, $toTime){

	$fromTime = (int)$fromTime;
	
	$anonymousData = array();
	$anonymousData['sites'] 			= DB::getField("?:sites", "count(siteID)", "1");
	$anonymousData['groups']			= DB::getField("?:groups", "count(groupID)", "1");
	$anonymousData['groupMaxSites']		= DB::getField("?:groups_sites", "count(siteID) as maxSiteCount", "1 GROUP BY groupID ORDER BY maxSiteCount DESC LIMIT 1", "maxSiteCount");
	$anonymousData['hiddenCount']		= DB::getField("?:hide_list", "count(ID)", "1");
	$anonymousData['favourites']		= DB::getField("?:favourites", "count(ID)", "1");
	$anonymousData['settings']			= DB::getArray("?:settings", "*", "1");
	$anonymousData['users']				= DB::getField("?:users", "count(userID)", "1");
	$anonymousData['allowedLoginIps']	= DB::getField("?:allowed_login_ips", "count(IP)", "1");
		
	$anonymousData['siteNameMaxLength']	= DB::getField("?:sites", "length(name) as siteNameLength", "1 ORDER BY siteNameLength DESC LIMIT 1");	
	$anonymousData['groupNameMaxLength']= DB::getField("?:groups", "length(name) as groupNameLength", "1 ORDER BY groupNameLength DESC LIMIT 1");
	
	//$anonymousData['appVersion'] 				= APP_VERSION;
	$anonymousData['appInstalledTime'] 			= getOption('installedTime');
	$anonymousData['lastHistoryActivityTime'] 	= DB::getField("?:history", "microtimeAdded", "1 ORDER BY historyID DESC");	
	$anonymousData['updatesNotificationMailLastSent'] = getOption('updatesNotificationMailLastSent');
	
	
	//to find hostType
	$anonymousData['hostType'] = 'unknown';
	
	if(!empty($_SERVER['SERVER_ADDR'])){
		$SERVER_ADDR = $_SERVER['SERVER_ADDR'];
	}
	else{
		$SERVER_ADDR = gethostbyname($_SERVER['HTTP_HOST']);
	}
	
	if(!empty($SERVER_ADDR)){
		if(IPInRange($SERVER_ADDR, '127.0.0.0-127.255.255.255')){
			$anonymousData['hostType'] = 'local';
		}
		elseif(IPInRange($SERVER_ADDR, '10.0.0.0-10.255.255.255') || IPInRange($SERVER_ADDR, '172.16.0.0-172.31.255.255') || IPInRange($SERVER_ADDR, '192.168.0.0-192.168.255.255')){
			$anonymousData['hostType'] = 'private';
		}
		else{
			$anonymousData['hostType'] = 'public';
		}
	}
	
	//history stats
	$anonymousData['historyStatusStats']= DB::getFields("?:history", "count(status) as statusCount, status", "microtimeAdded > '".$fromTime."' AND microtimeAdded <= '".$toTime."' GROUP BY status", "status");
	$tempHistoryData					= DB::getRow("?:history", "count(historyID) as historyCount, count(DISTINCT actionID) as historyActions", "microtimeAdded > '".$fromTime."' AND microtimeAdded <= '".$toTime."'");
	$anonymousData['historyCount']		= $tempHistoryData['historyCount'];
	$anonymousData['historyActions']	= $tempHistoryData['historyActions'];
	
	$anonymousData['historyAdditionalStatusStats']	= DB::getFields("?:history H, ?:history_additional_data HAD", "count(HAD.status) as statusCount, HAD.status", "H.historyID = HAD.historyID AND H.microtimeAdded > '".$fromTime."' AND H.microtimeAdded <= '".$toTime."' GROUP BY HAD.status", "status");
	$anonymousData['historyAdditionalCount']		= DB::getField("?:history H, ?:history_additional_data HAD", "count(HAD.historyID) as historyCount", "H.historyID = HAD.historyID AND H.microtimeAdded > '".$fromTime."' AND H.microtimeAdded <= '".$toTime."'");
	
	$historyEventStatusStatsArray	= DB::getArray("?:history H, ?:history_additional_data HAD", "H.type, H.action, HAD.detailedAction, HAD.status, COUNT(H.historyID) as events", "H.historyID = HAD.historyID GROUP BY H.type, H.action, HAD.detailedAction ORDER BY H.type, H.action, HAD.detailedAction, HAD.status");

	$historyEventStatusStats= array();
	if(!empty($historyEventStatusStatsArray)){
		foreach($historyEventStatusStatsArray as $v){
			
			if(!isset($historyEventStatusStats[$v['type']][$v['action']][$v['detailedAction']][$v['status']])){
				$historyEventStatusStats[$v['type']][$v['action']][$v['detailedAction']]['total'] = 0;
			}
			$historyEventStatusStats[$v['type']][$v['action']][$v['detailedAction']][$v['status']] = $v['events'];			
			$historyEventStatusStats[$v['type']][$v['action']][$v['detailedAction']]['total'] += $v['events'];
		}
	}	
	
	$anonymousData['historyEventStatusStats'] = $historyEventStatusStats;
		
	$anonymousData['siteStats']					= DB::getArray("?:sites", "WPVersion, pluginVersion, isOpenSSLActive", "1");	
	
	$anonymousData['server']['PHP_VERSION'] 	= phpversion();
	$anonymousData['server']['PHP_CURL_VERSION']= curl_version();
	$anonymousData['server']['MYSQL_VERSION'] 	= DB::getField("select version() as V");
	$anonymousData['server']['OS'] =  php_uname('s');
	$anonymousData['server']['OSVersion'] =  php_uname('v');
	$anonymousData['server']['Machine'] =  php_uname('m');
	
	$requestData = array('anonymousData' => serialize($anonymousData), 'appInstallHash' => APP_INSTALL_HASH, 'appVersion' => APP_VERSION);
		
	list($result) = doCall(getOption('serviceURL').'anonymous.php', $requestData);
	if(trim($result) == 'true'){
		return true;	
	}
	return false;
	
}

function getReportIssueData($actionID){
	
	$reportIssue = array();
	
	//collecting data about the action
	$reportIssue['history'] = DB::getArray("?:history H", "*", "H.actionID ='".$actionID."'");
	
	$siteIDs = DB::getFields("?:history H", "H.siteID, H.actionID", "H.actionID ='".$actionID."'");
				
	if(empty($reportIssue['history'])){
		return false;
	}
	
	$reportIssue['historyAdditional'] = DB::getArray("?:history_additional_data HAD, ?:history H", "HAD.*", "H.actionID = '".$actionID."' AND HAD.historyID = H.historyID");
	$reportIssue['historyRaw'] = DB::getArray("?:history_raw_details HRD, ?:history H", "HRD.*", "H.actionID = '".$actionID."' AND HRD.historyID = H.historyID");
	$reportIssue['siteDetails'] = DB::getArray("?:sites", "URL, WPVersion, pluginVersion, network, parent", "siteID IN (".implode(',',$siteIDs).")", "URL");
	$reportIssue['settings'] = DB::getRow("?:settings", "general", "1");
	
	$reportIssue['fsockSameURLConnectCheck'] = fsockSameURLConnectCheck(APP_URL.'execute.php');
	//$siteID = DB::getArray("?:");
		
	$reportIssue['server']['PHP_VERSION'] 	= phpversion();
	$reportIssue['server']['PHP_CURL_VERSION']= function_exists('curl_exec');
	$reportIssue['server']['PHP_WITH_OPEN_SSL'] = function_exists('openssl_verify');
	$reportIssue['server']['PHP_MAX_EXECUTION_TIME'] =  ini_get('max_execution_time');
	$reportIssue['server']['MYSQL_VERSION'] 	= DB::getField("select version() as V");
	$reportIssue['server']['OS'] =  php_uname('s');
	$reportIssue['server']['OSVersion'] =  php_uname('v');
	$reportIssue['server']['Machine'] =  php_uname('m');
	
	//removing unwanted data
	foreach($reportIssue['historyRaw'] as $key => $value){
		$datas = unserialize(base64_decode($value['request']));
		unset($datas['signature']);
		$reportIssue['historyRaw'][$key]['request'] = base64_encode(serialize($datas));
	}
	
	$_SESSION['reportIssueTemp'][$actionID] = $reportIssue;
	
	return array('actionID' =>$actionID, 'report' => $reportIssue);
}

function sendReportIssue($params){
	if(!empty($params)){
		
		
		if(!empty($params['report'])){
			$actionID = $params['actionID'];	
			$params['reportBase64'] = base64_encode(serialize($_SESSION['reportIssueTemp'][$actionID]));
			unset($params['report']);
			unset($_SESSION['reportIssueTemp'][$actionID]);
		}		
		
		$data = array('reportData' => $params);
		if(function_exists('gzcompress')){
			$data['reportDataCompressed'] = gzcompress(serialize($data['reportData']));
			unset($data['reportData']);
		}
		
		$temp = doCall(getOption('serviceURL').'report.php', $data);
		list($response) = $temp;
		if(trim($response) == 'true'){
			return true;
		}
	}
	return false;
}

function addOption($optionName, $optionValue){
	return DB::insert("?:options", array('optionName' => $optionName, 'optionValue' => $optionValue));
}

function updateOption($optionName, $optionValue){
	return DB::update("?:options", array('optionName' => $optionName, 'optionValue' => $optionValue), "optionName = '".$optionName."'");
}

function getOption($optionName){
	return DB::getField("?:options", "optionValue", "optionName = '".$optionName."'");
}

function deleteOption($optionName){
	return DB::delete("?:options", "optionName = '".$optionName."'");
}

function sendMail($from, $fromName, $to, $toName, $subject, $message, $options=array()){
	
	
	require_once(APP_ROOT.'/includes/phpmailer.php');

	$mail = new PHPMailer(); // defaults to using php "mail()"
	
	$body = $message;
	
	$mail->SetFrom($from, $fromName);
	
	$mail->AddAddress($to, $toName);
	
	$mail->Subject = $subject;
	
	$mail->MsgHTML($body);
		
	if(!$mail->Send()) {
	  addNotification($type='E', $title='Mail Error', $message=$mail->ErrorInfo, $state='U');	  
	  return false;
	} else {
	  //echo "Message sent!";
	  return true;
	}
}

function sendAppMail($params, $contentTPL, $options=array()){
	
	$content = TPL::get($contentTPL, $params);
		
	$content = explode("+-+-+-+-+-+-+-+-+-+-+-+-+-updatesNotificationsMail+-+-+-+-+-+-+-+-+-+-+-", $content);
	
	$subject = $content[0];
	$message = $content[1];
		
	$user = DB::getRow("?:users", "email, name", "1 ORDER BY userID ASC LIMIT 1");
	
	return sendMail($user['email'], $user['name'], $user['email'], $user['name'], $subject, $message, $options);	
	
}


function cronRun(){
	
	$userID = DB::getField("?:users", "userID", "1 ORDER BY userID ASC LIMIT 1");
	if(empty($userID)){
		return false;
	}
	
	$_SESSION['userID'] = $userID;
	
	$time = time();
	updatesNotificationMailRunCheck();
	updateOption('cronLastRun', $time);
	//anonymousDataRunCheck();
	
	$_SESSION = array();
}

function updatesNotificationMailRunCheck(){
	
	$settings = panelRequestManager::getSettings();
	$updatesNotificationMail = $settings['notifications']['updatesNotificationMail'];
	
	//check setting
	if($updatesNotificationMail['frequency'] == 'never' || (empty($updatesNotificationMail['coreUpdates']) && empty($updatesNotificationMail['pluginUpdates']) && empty($updatesNotificationMail['themeUpdates'])) ){
		return false;//	updatesNotificationMail is disabled in the settings
	}
	
	//get updates Notification Mail Last Sent
	$updatesNotificationMailLastSent = getOption('updatesNotificationMailLastSent');
	
	//check last run falls within the frequency
	if($updatesNotificationMailLastSent > 0){
		if($updatesNotificationMail['frequency'] == 'daily'){
			$frequencyStartTime = mktime(0,0,0, @date('m'), @date('d'), @date('Y'));
		}
		elseif($updatesNotificationMail['frequency'] == 'weekly'){//mon to sun week
			$day = @date('w', $now);
			$frequencyStartTime = mktime(0, 0, 1, @date('m'), @date('d') - ($day > 0? $day: 7) + 1, @date('Y'));
		}
		else{
			return false;	
		}
		if($updatesNotificationMailLastSent > $frequencyStartTime){
			return false;//already sent
		}
	}
	return updatesNotificationMailSend();	
	
}

function updatesNotificationMailSend($force=false){
	
	$settings = panelRequestManager::getSettings();
	$updatesNotificationMail = $settings['notifications']['updatesNotificationMail'];
	
	//check setting
	if($force == false){
		if($updatesNotificationMail['frequency'] == 'never' || (empty($updatesNotificationMail['coreUpdates']) && empty($updatesNotificationMail['pluginUpdates']) && empty($updatesNotificationMail['themeUpdates'])) ){
			return false;//	updatesNotificationMail is disabled in the settings
		}
	}
	
	//reloading stats from all the sites
	$requestData = array();
	$requestData['action'] = 'getStats';
	$requestData['args']['siteIDs'] = '';
	$requestData['args']['params'] = '';
	$requestData['args']['extras'] = array('doNotShowUser' => true);
	
	panelRequestManager::handler($requestData);
	
	//getting updateInformation
	$sitesUpdates = panelRequestManager::getSitesUpdates();
	
	$params = array('sitesUpdates' => $sitesUpdates,  'updatesNotificationMail' => $updatesNotificationMail, 'updateNotificationDynamicContent' => getOption('updateNotificationDynamicContent'));
	$isSent = sendAppMail($params, 'email/updatesNotification.tpl.php');
	
	if($isSent){
		if(!$force){
			updateOption('updatesNotificationMailLastSent', time());
		}
		return true;
	}
	return false;
	
}

function checkUpdate($force=false, $checkForUpdate=true){
	
	$currentTime = time();
	if(!$force){
		if( ($currentTime - getOption('updateLastCheck')) < 86400 ){ //86400 => 1 day in seconds
			if(empty($_SESSION['updateAvailable'])){
				$updateAvailable = getOption('updateAvailable');
				if(!empty($updateAvailable)){
					$updateAvailable = @unserialize($updateAvailable);
					if($updateAvailable == 'noUpdate'){
						return false;
					}
					$_SESSION['updateAvailable'] = $updateAvailable;
					return $updateAvailable;
				}
			}
			else{
				return $_SESSION['updateAvailable'];
			}
			return false;
		}
	}
	
	if(!$checkForUpdate){
		return false;
	}	

	$URL = getOption('serviceURL').'checkUpdate.php';	
	$URL .= '?appVersion='.APP_VERSION.'&appInstallHash='.APP_INSTALL_HASH;
	if($force){
		$URL .= '&force=1';
	}

	$temp = doCall($URL, '');
	list($result, , , $curlInfo) = $temp;
	$result = base64_decode($result);
	$result = @unserialize($result);
	
	if($curlInfo['info']['http_code'] != 200 || empty($result)){
		//response error
		return false;	
	}
	
	if(!empty($result['updateNotificationDynamicContent'])){
		updateOption('updateNotificationDynamicContent', $result['updateNotificationDynamicContent']);
	}
	
	updateOption('updateLastCheck', $currentTime);
	if($result['checkUpdate'] == 'noUpdate'){
		return false;
	}
	else{
		updateOption('updateAvailable', serialize($result['checkUpdate']));
		$_SESSION['updateAvailable'] = $result['checkUpdate'];		
		return $result['checkUpdate'];
	}
}

function processAppUpdate(){//download and install update
	if(empty($_SESSION['updateAvailable'])){
		return false;	
	}
	
	$updateAvailable = $_SESSION['updateAvailable'];
	
	$newVersion = $updateAvailable['newVersion'];
	if(version_compare(APP_VERSION, $newVersion) !== -1){
		return false;
	}
	
	$updateDetails = $updateAvailable['updateDetails'][$newVersion];
	
	if(!empty($updateDetails['downloadLink']) && !empty($updateDetails['fileMD5'])){
		
		$updateZip = APP_ROOT.'/updates/update.zip';
		@unlink($updateZip);
		
		isWritableTry(APP_ROOT.'/updates', true);
		
		$isDone = downloadURL($updateDetails['downloadLink'], $updateZip);
		
		appUpdateMsg('Downloading package..');	
		if(!$isDone){ //download failed
			appUpdateMsg('Download Failed.', true);
			restorePerms();
			return false;
		}
		
		if(md5_file($updateZip) != $updateDetails['fileMD5']){
			appUpdateMsg('File MD5 mismatch(damaged package).', true);
			restorePerms();
			return false;	
		}
		
		$files = getZipFilesList($updateZip);
		if(empty($files)){
			appUpdateMsg('Unable to read files content in the zip.', true);
			restorePerms();
			return false;
		}
		
		if(!checkFilesWritable($files)){
			appUpdateMsg('Please fix the file premission and try again.', true);
			restorePerms();
			return false;
		}
		
		appUpdateMsg('Unzipping package..');	
		$isDone = unzip($updateZip, APP_ROOT);
		if(!$isDone){ // unzip failed
			appUpdateMsg('Unable to extract the zip.', true);
			restorePerms();
			return false;	
		}
		
		appUpdateMsg('Finalizing update..');	
		if(file_exists(APP_ROOT.'/updateFinalize_v'.$newVersion.'.php')){
			//$updateAvailable variable should be live inside the following file
			include(APP_ROOT.'/updateFinalize_v'.$newVersion.'.php');//run the update file
			
			if($updateFinalizeStatus == true){
				
				unset($_SESSION['updateAvailable']);
				@unlink($updateZip);
				updateOption('updateAvailable', '');
				
				appUpdateMsg('Updated successfully.', false);	
				restorePerms();
				return true;
			}
			else{
				appUpdateMsg('Update failed.', true);
			}
		}
		else{
			//updateFinalize file not found	
			appUpdateMsg('Update finalizing file missing.', true);
		}
		restorePerms();
		return false;	
	}	
}

function appUpdateMsg($msg, $isError=0){
	echo '<br>'.$msg;
	if($isError === true){
		?>
        <br />Try again by refreshing the panel or contact <a href="mailto:help@infinitewp.com">help@infinitewp.com</a>
         <script>
		window.parent.$("#updates_centre_cont .btn_loadingDiv").remove();
		</script>
		<?php
	}
	elseif($isError === false){
		?>
        <script>
		window.parent.$("#updates_centre_cont .btn_loadingDiv").remove();
		window.parent.$("#updateActionBtn").attr({'btnaction':'reload','target':'_parent', 'href':''}).text('Reload App').removeClass('disabled');
		</script>
		<?php
	}
	?>
	<script>
	window.scrollTo(0, document.body.scrollHeight);
	</script>
    <?php
	ob_flush();
	flush();
}

function runOffBrowserLoad(){
	checkUpdate();
	anonymousDataRunCheck();	
}

function getResponseMoreInfo($historyID){
	
	$return = DB::getField("?:history_raw_details", "response", "historyID = '".$historyID."'");
	
	$startStr = '<IWPHEADER>';
    $endStr = '<ENDIWPHEADER';

	$response_start = stripos($return, $startStr);	
	$str = substr($return, 0, $response_start);
	
	$response_End = stripos($return, $endStr);
	$Estr = substr($return, $response_End + strlen($endStr));
	$Estr = (substr($Estr, 0, 1) == '>') ? substr($Estr, 1) : $Estr;
	return $str.$Estr;
}

/*
$type = 'N' -> notice, 'W' -> Warning, 'E' -> Error
$state = 'T' -> Timer, 'U' -> user should close it
*/
function addNotification($type, $title, $message, $state='T', $callbackOnClose='', $callbackReference=''){	

	if(!empty($_SESSION['userID'])){//if user logged session
		if(!isset($_SESSION['notifications'])){ $_SESSION['notifications'] = array(); }
		$notifications = &$_SESSION['notifications'];
	}
	else{//offline may be run by a cronjob
		$offlineNotifications = getOption('offlineNotifications');
		$offlineNotifications = (!empty($offlineNotifications)) ? @unserialize($offlineNotifications) : array();
		$notifications = &$offlineNotifications;
	}
	
	$key =  md5($type.$title.$message);
	if(empty($notifications[$key])){
		$notifications[$key] = array('key' => $key,
									 'type' => $type,
									 'title' => $title, 
									 'message' => $message, 
									 'state' => empty($callbackOnClose) ? $state : 'U', 
									 'callbackOnClose' => $callbackOnClose, 
									 'callbackReference' => $callbackReference, 
									 'counter' => 1,
									 'time' => time(),
									 'notified' => false);
	}
	else{
		$notifications[$key]['counter']++;
	}
	
	if(!empty($offlineNotifications)){
		//save in db
		updateOption('offlineNotifications', $offlineNotifications);
	}
}

function getNotifications($reloaded=false){
	
	if(empty($_SESSION['userID'])){ return false; }//No session, dont send any notifications
	
	$notifications = array();
	
	if(!isset($_SESSION['notifications'])){ $_SESSION['notifications'] = array(); }
	
	$offlineNotifications = getOption('offlineNotifications');
	
	if(!empty($offlineNotifications)){		
		$offlineNotifications = @unserialize($offlineNotifications);	
		$_SESSION['notifications'] = @array_merge($_SESSION['notifications'], (array)$offlineNotifications);
	}	
	
	foreach($_SESSION['notifications'] as $key => $_notification){
		if(!empty($_notification['callbackOnClose'])){
			if($reloaded || !$_notification['notified']){
				$_SESSION['notifications'][$key]['notified'] = true;
				$notifications[] = $_notification;
			}
		}
		else{
			unset($_SESSION['notifications'][$key]);
			$notifications[] = $_notification;
		}		
	}
	
	//Null the offlineNotifications option
	updateOption('offlineNotifications', NULL);
	
	return $notifications;	
}

function closeNotification($key){
	//only happens when user logged in
	if(!empty($_SESSION['notifications'][$key])){
		if(function_exists($_SESSION['notifications'][$key]['callbackOnClose'])){
			@call_user_func($_SESSION['notifications'][$key]['callbackOnClose'], $_SESSION['notifications'][$key]['callbackReference']);
		}
		unset($_SESSION['notifications'][$key]);
	}
}

function installFolderAlert(){
	if(is_dir(APP_ROOT.'/install')){
		addNotification($type='E', $title='Security Warning!', $message='Please remove or rename the install folder.', $state='U', $callbackOnClose='', $callbackReference='');
	}
}

?>