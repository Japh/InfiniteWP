<?php
/************************************************************
 * InfiniteWP Admin panel									*
 * Copyright (c) 2012 Revmakx								*
 * www.revmakx.com											*
 *															*
 ************************************************************/
 
class manageClientsSites{
	
	  public static function addSiteProcessor($dummy, $params){ // Add a site 	  
	  
		$requestAction = "add_site";
		$action = "add";
		$type = "site";
		$actionID = Reg::get('currentRequest.actionID');
		$timeout = DEFAULT_MAX_CLIENT_REQUEST_TIMEOUT;
		$params['URL'] = trim($params['URL']);
		$params['username'] = trim($params['username']);
		$params['activationKey'] = trim($params['activationKey']);
		
		$events = 1;
		
		if(!empty($params['URL'])){
			$params['URL'] = $params['URL'].(substr($params['URL'], -1) == '/' ? '' : '/');
		}
		
		$historyAdditionalData = array();
		$historyAdditionalData[] = array('uniqueName' => $params['URL'], 'detailedAction' => $action);
		
		$historyData = array('siteID' => '0', 'actionID' => $actionID, 'userID' => $_SESSION['userID'], 'type' => $type, 'action' => $action, 'events' => $events, 'URL' => $params['URL'], 'timeout' => $timeout);	
		$historyID = addHistory($historyData, $historyAdditionalData);
				
		if (checkOpenSSL()) {//use when remote WP has openssl installed or not installed
		
			$key = @openssl_pkey_new();
			@openssl_pkey_export($key, $privateKey);
			$privateKey	= base64_encode($privateKey);
			$publicKey 	= @openssl_pkey_get_details($key);
			$publicKey 	= $publicKey["key"];
			$publicKey 	= base64_encode($publicKey);
			openssl_sign($requestAction.$historyID ,$signData ,base64_decode($privateKey));
			$signData 	= base64_encode($signData);
			
			$_SESSION['storage']['newSite']['addSitePrivateKey'] = $privateKey;
		}
		else{//if HOST Manager doesnt have openssl installed
			if(!defined('USE_RANDOM_KEY_SIGNINIG')){
				define('USE_RANDOM_KEY_SIGNINIG', true);
			}

			srand();
			
			//some random text
			$publicKey = 'FMGJUKHFKJHKHEkjfcjkshdkhauiksdyeriaykfkzashbdiadugaisbdkbasdkh36482763872638478sdfkjsdhkfhskdhfkhsdfi323798435h453h4d59h4iu5ashd4ui5ah4sd5fih65fd958345454h65fkjsa4fhd5649dasf86953q565kb15ak1b';		  			
			$publicKey = sha1($publicKey).substr($publicKey, rand(0, 50), rand(50, strlen(rand(0, strlen($publicKey)))));
			
			$publicKey = md5(rand(0, getrandmax()) . base64_encode($publicKey) . rand(0, getrandmax()));;
			
			$signData = md5($requestAction.$historyID.$publicKey);
			
		}
		//using session on the assumption addSite is always direct call not async call
		$_SESSION['storage']['newSite']['addSiteAdminUsername'] = $params['username'];
		$_SESSION['storage']['newSite']['groupsPlainText'] =  $params['groupsPlainText'];
		$_SESSION['storage']['newSite']['groupIDs'] =  $params['groupIDs'];
		
	
		$requestParams = array('site_url' => $params['URL'], 'action' => $requestAction, 'public_key' => $publicKey, 'id' => $historyID, 'signature' => $signData, 'username' => $params['username'], 'activation_key' => $params['activationKey']);
		if(defined('USE_RANDOM_KEY_SIGNINIG')){			  
			$requestParams['user_random_key_signing'] = 1;
		}
		
		$requestData = array('iwp_action' => $requestAction, 'params' => $requestParams);
		
		$updateHistoryData = array('status' => 'pending');
		
		updateHistory($updateHistoryData, $historyID);
		
		DB::insert("?:history_raw_details", array('historyID' => $historyID, 'request' => base64_encode(serialize($requestData)), 'panelRequest' => serialize($_REQUEST) ) );
		
		return executeRequest($historyID, $type, $action, $params['URL'], $requestData, $timeout=10);
	  }
	  
	  public static function addSiteResponseProcessor($historyID,$responseData){
		  	  
		  responseDirectErrorHandler($historyID, $responseData);
		  
		  if( empty($responseData['success']) ){
			  return false;
		  }
	  
		  if(!empty($responseData['success']['error'])){
			  DB::update("?:history_additional_data", array('status' => 'error', 'errorMsg' => $responseData['error_data']), "historyID=".$historyID."");	
		  }
		  elseif(!empty($responseData['success'])){
			  DB::update("?:history_additional_data", array('status' => 'success'), "historyID=".$historyID."");
			  
			  $privateKey = $_SESSION['storage']['newSite']['addSitePrivateKey'];
			  $isOpenSSLActive = '1';
			  if($responseData['success']['no_openssl']){
				  $privateKey = NULL;
				  $isOpenSSLActive = '0';
			  }
			  
			  $URLParts = explode('/', $responseData['success']['site_home']);
			  			 			  
			  $siteData = array( "URL" 		=> $responseData['success']['site_home'].'/',
								 "adminURL" => $responseData['success']['admin_url'],
								 "name" 	=> str_replace(array('http://www.', 'https://www.', 'http://', 'https://'), '', $responseData['success']['site_home']),
								 "privateKey" 		=> $privateKey,
								 "adminUsername" 	=> $_SESSION['storage']['newSite']['addSiteAdminUsername'],
								 "isOpenSSLActive" 	=> $isOpenSSLActive,
								 "randomSignature" 	=> $responseData['success']['no_openssl'],
								 "WPVersion"		=> $responseData['success']['wordpress_version'],
								 "pluginVersion" 	=> $responseData['success']['worker_version'],
								 "IP" => gethostbyname($URLParts[2]),
								 "network" => ($responseData['success']['network_install'] == -1) ? 1 : 0,
								 "multisiteID" => empty($responseData['success']['wp_multisite']) ? 0 : $responseData['success']['wp_multisite'],
								 "parent" =>   ($responseData['success']['site_home'] == $responseData['success']['network_parent']) ? 1 : 0
							 	); // save data
								
			  $siteID = DB::insert('?:sites', $siteData); 
			  DB::replace("?:user_access", array('userID' => $_SESSION['userID'], 'siteID' => $siteID));			  
			  
			  $groupsPlainText = $_SESSION['storage']['newSite']['groupsPlainText'];
		  	  $groupIDs = $_SESSION['storage']['newSite']['groupIDs'];			  
			  panelRequestManager::addSiteSetGroups($siteID, $groupsPlainText, $groupIDs);			  
			  unset($_SESSION['storage']['newSite']);
			  
			  //---------------------------post process------------------------>
		  
			  $allParams = array('action' => 'getStats', 'args' => array('siteIDs' => array($siteID), 'extras' => array('directExecute' => true, 'doNotShowUser' => true)));
			  
			  panelRequestManager::handler($allParams);
			  
		  }	
	  }
	  
	  public static function removeSiteProcessor($siteIDs, $params){
		  
		  if(empty($siteIDs)){ return false; }
		  		 
		  $type = 'site';
		  $action = 'remove';
		  $requestAction = 'remove_site';
		  $events = 1;
		  
		  $requestParams = array('deactivate' => $params['iwpPluginDeactivate']);
		  
		  $historyAdditionalData = array();
	      $historyAdditionalData[] = array('uniqueName' => 'remove_site', 'detailedAction' => 'remove');
		  foreach($siteIDs as $siteID){
			
			$siteData = getSiteData($siteID);
						
			$PRP = array();
			$PRP['requestAction'] 	= $requestAction;
			$PRP['requestParams'] 	= $requestParams;
			$PRP['siteData'] 		= $siteData;
			$PRP['type'] 			= $type;
			$PRP['action'] 		= $action;
			$PRP['events'] 		= $events;
			$PRP['historyAdditionalData'] 	= $historyAdditionalData;
			$PRP['doNotExecute'] 			= false;
			$PRP['exitOnComplete'] = true;		
			  
			prepareRequestAndAddHistory($PRP);
			
			DB::delete("?:sites", "siteID = '".$siteID."'" );
			DB::delete("?:site_stats", "siteID = '".$siteID."'" );
			DB::delete("?:groups_sites", "siteID = '".$siteID."'" );
			DB::delete("?:hide_list", "siteID = '".$siteID."'" );
			DB::delete("?:user_access", "siteID = '".$siteID."'" );
			/* removing site from admin panel without getting confirmation from client plugin */
		 }
	  }
	  
	 public static function removeSiteResponseProcessor($historyID, $responseData){
		  
		  responseDirectErrorHandler($historyID, $responseData);		  	  
		  if(!empty($responseData['success']['error'])){
			  DB::update("?:history_additional_data", array('status' => 'error', 'errorMsg' => $responseData['error_data']), "historyID=".$historyID."");	
		  }
		  elseif(!empty($responseData['success'])){
			  DB::update("?:history_additional_data", array('status' => 'success'), "historyID=".$historyID."");
		  }
	 }	  
	 public static function loadSiteProcessor($siteIDs, $params){
		
		$timeout = DEFAULT_MAX_CLIENT_REQUEST_TIMEOUT;
		$siteID = reset($siteIDs);
		if(empty($siteID)){ echo 'Invalid Site ID'; }
		$where = $params['where'] ? $params['where'].".php?" : '?';
		

		$siteData = DB::getRow("?:sites", "*", "siteID=".$siteID);
		if(empty($siteData)){ echo 'Invalid Site ID'; }
		$type = 'site';
		$action = 'load';
		$events = 1;
		
		$historyData = array('siteID' => $siteData['siteID'], 'actionID' => Reg::get('currentRequest.actionID'), 'userID' => $_SESSION['userID'], 'type' => $type, 'action' => $action, 'events' => $events, 'URL' => $siteData['URL'], 'status' => 'completed', 'timeout' => $timeout);
		
		$historyAdditionalData[] = array('detailedAction' => 'loadSite', 'uniqueName' => 'loadSite', 'status' => 'success');
			
		$historyID = addHistory($historyData, $historyAdditionalData);
	
		$signature = signData($where.$historyID, $siteData['isOpenSSLActive'], $siteData['privateKey'], $siteData['randomSignature']);
		
		$URL = $siteData['adminURL'].$where."auto_login=1&iwp_goto=".$where."&signature=".urlencode(base64_encode($signature))."&message_id=".$historyID."&username=".$siteData['adminUsername'];
		
		
		$updateHistoryData = array('param3' => $URL);	
		updateHistory($updateHistoryData, $historyID);
		header("Location: ".$URL);
		exit;	

	}
}

manageClients::addClass('manageClientsSites'); 
?>