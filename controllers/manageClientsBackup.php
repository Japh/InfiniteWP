<?php
/************************************************************
 * InfiniteWP Admin panel									*
 * Copyright (c) 2012 Revmakx								*
 * www.revmakx.com											*
 *															*
 ************************************************************/
 
class manageClientsBackup{
	
	public static function backupProcessor($siteIDs, $params){
		$accountInfo = $params['accountInfo'];
		$action = $params['action'];
		$config = $params['config'];
		$timeout = (20 * 60);//20 mins
		$type = "backup";
		$requestAction = "scheduled_backup";
		
		if(empty($config['taskName'])){
			$config['taskName'] = 'Backup Now';
		}
		
		foreach($siteIDs as $siteID){
			$siteData = getSiteData($siteID);
			
			if(!empty($accountInfo)){
			   $secure_data = serialize($accountInfo);		 
			   $secure_data_array = str_split($secure_data, 96);	//max length 117
				   
			   $secure_data_encrypt = array();
			   
			   foreach($secure_data_array as $secure_data_part){				 			  
				  openssl_private_encrypt($secure_data_part, $secure_data_encrypt_part, base64_decode($siteData['privateKey']));
				  $secure_data_encrypt[] = $secure_data_encrypt_part;
			   }
			}
			  
			 $requestParams = array('task_name' => $config['taskName'], 'args' => array('what' => $config['what'], 'optimize_tables' => $config['optimizeDB'], 'exclude' =>explode(',',$config['exclude']), 'include' => explode(',',$config['include']), 'del_host_file' => $config['delHostFile'], 'disable_comp' => $config['disableCompression'], 'limit' => $config['limit'], 'backup_name' => $config['backupName']), 'secure' => $secure_data_encrypt);
			 
			 if($action == 'schedule'){
					 $requestParams['args']['type'] = $config['type'];
					 $requestParams['args']['schedule'] = $config['schedule'];
					 $requestParams['args']['url'] = 'http://localhost/iwp/notification.php';
					 $requestParams['args']['site_key'] = $siteID;
					 $requestParams['args']['task_id'] = $siteID;
			 }
			  
			  $historyAdditionalData = array();
			  $historyAdditionalData[] = array('uniqueName' => $config['taskName'], 'detailedAction' => $type);
			  		
			$events=1;
			$PRP = array();
			$PRP['requestAction'] 	= $requestAction;
			$PRP['requestParams'] 	= $requestParams;
			$PRP['siteData'] 		= $siteData;
			$PRP['type'] 			= $type;
			$PRP['action'] 			= $action;
			$PRP['events'] 			= $events;
			$PRP['historyAdditionalData'] 	= $historyAdditionalData;
			$PRP['timeout'] 		= $timeout;
		   
		   prepareRequestAndAddHistory($PRP);
		  }
	}
	
	public static function backupResponseProcessor($historyID, $responseData){
		
		responseDirectErrorHandler($historyID, $responseData);
		
		if(empty($responseData['success'])){
			return false;
		}
		
		if(!empty($responseData['success']['error'])){
			DB::update("?:history_additional_data", array('status' => 'error', 'errorMsg' => $responseData['success']['error']), "historyID=".$historyID);	
			return false;
		}
		
		$historyData = DB::getRow("?:history", "*", "historyID=".$historyID);
		
		if(!empty($responseData['success']['task_results']) && $historyData['action'] == 'now'){
			DB::update("?:history_additional_data", array('status' => 'success'), "historyID=".$historyID);
		}
		
		//---------------------------post process------------------------>
		$siteID = DB::getField("?:history", "siteID", "historyID=".$historyID);
	
		$allParams = array('action' => 'getStats', 'args' => array('siteIDs' => array($siteID), 'extras' => array('exitOnComplete' => false, 'doNotShowUser' => true)));
		
		panelRequestManager::handler($allParams);
	}
	
	public static function restoreBackupProcessor($siteIDs, $params){
		
		$type = "backup";
		$action = "restore";
		$requestAction = "restore";
		$timeout = (20 * 60);//20 mins
		
		$requestParams = array('task_name' => $params['taskName'], 'result_id' => $params['resultID']);
		
		$historyAdditionalData = array();
		$historyAdditionalData[] = array('uniqueName' => $params['taskName'], 'detailedAction' => $action);
		
		foreach($siteIDs as $siteID){
			$siteData = getSiteData($siteID);		
			
			$events=1;
			
			$PRP = array();
			$PRP['requestAction'] 	= $requestAction;
			$PRP['requestParams'] 	= $requestParams;
			$PRP['siteData'] 		= $siteData;
			$PRP['type'] 			= $type;
			$PRP['action'] 			= $action;
			$PRP['events'] 			= $events;
			$PRP['historyAdditionalData'] 	= $historyAdditionalData;
			$PRP['timeout'] 		= $timeout;
			
			prepareRequestAndAddHistory($PRP);
		}	
	}
	
	public static function restoreBackupResponseProcessor($historyID, $responseData){
		
		responseDirectErrorHandler($historyID, $responseData);
		
		if(empty($responseData['success'])){
			return false;
		}
		
		if(!empty($responseData['success'])){
			DB::update("?:history_additional_data", array('status' => 'success'), "historyID=".$historyID."");
		}
		
		//---------------------------post process------------------------>
		$siteID = DB::getField("?:history", "siteID", "historyID=".$historyID);
	
		$allParams = array('action' => 'getStats', 'args' => array('siteIDs' => array($siteID), 'extras' => array('exitOnComplete' => false, 'doNotShowUser' => true)));
		
		panelRequestManager::handler($allParams);
		
	}
	
	public static function removeBackupProcessor($siteIDs, $params){
		
		$type = "backup";
		$action = "remove";
		$requestAction = "delete_backup";
		
		$requestParams = array('task_name' => $params['taskName'], 'result_id' => $params['resultID']);
		
		$historyAdditionalData = array();
		$historyAdditionalData[] = array('uniqueName' => $params['taskName'], 'detailedAction' => $action);
		
		foreach($siteIDs as $siteID){
			$siteData = getSiteData($siteID);	
			$events=1;	
			
			$PRP = array();
			$PRP['requestAction'] 	= $requestAction;
			$PRP['requestParams'] 	= $requestParams;
			$PRP['siteData'] 		= $siteData;
			$PRP['type'] 			= $type;
			$PRP['action'] 			= $action;
			$PRP['events'] 			= $events;
			$PRP['historyAdditionalData'] 	= $historyAdditionalData;
			
			prepareRequestAndAddHistory($PRP);
		}	
	}
	
	public static function removeBackupResponseProcessor($historyID, $responseData){
		
		responseDirectErrorHandler($historyID, $responseData);
		if(empty($responseData['success'])){
			return false;
		}
		
		if(!empty($responseData['success'])){
			DB::update("?:history_additional_data", array('status' => 'success'), "historyID=".$historyID."");
		}
		
		//---------------------------post process------------------------>
		$siteID = DB::getField("?:history", "siteID", "historyID=".$historyID);
	
		$allParams = array('action' => 'getStats', 'args' => array('siteIDs' => array($siteID), 'extras' => array('exitOnComplete' => false, 'doNotShowUser' => true)));
		
		panelRequestManager::handler($allParams);	
	}
}
manageClients::addClass('manageClientsBackup');

?>