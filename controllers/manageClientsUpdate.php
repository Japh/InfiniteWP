<?php
/************************************************************
 * InfiniteWP Admin panel									*
 * Copyright (c) 2012 Revmakx								*
 * www.revmakx.com											*
 *															*
 ************************************************************/

class manageClientsUpdate {
	
	public static function updateAllProcessor($siteIDs, $allParams){
		
		if(empty($allParams)) return false;
			
		$requestAction = 'do_upgrade';
		$type = 'PTC';
		$action = 'update';
		
		$sitesStats = DB::getFields("?:site_stats", "stats, siteID", "siteID IN (".implode(',', array_keys($allParams)).")", "siteID");
		
		foreach($sitesStats as $siteID => $sitesStat){	
			$sitesStats[$siteID] = unserialize(base64_decode($sitesStat));
		}
		
		$sitesData = getSitesData(array_keys($allParams));
		
		foreach($allParams as $siteID => $siteParams){
			$siteIDs = array($siteID);
			$events = 0;
			$requestParams = $historyAdditionalData = array();
			$timeout = DEFAULT_MAX_CLIENT_REQUEST_TIMEOUT;
			
			foreach($siteParams as $PTC => $PTCParams){				
				
				if($PTC == 'plugins'){
					
					if(!empty($sitesStats[$siteID]['premium_updates']))
					{
						foreach($sitesStats[$siteID]['premium_updates'] as $item){						
							if(in_array($item['slug'], $PTCParams)){
								$uniqueName = $item['Name'];
								$requestParams['upgrade_plugins'][] = array_change_key_case($item, CASE_LOWER);
								$historyAdditionalData[] = array('uniqueName' => $uniqueName, 'detailedAction' => 'plugin');
								$timeout += 20;
								$events++;
							}
						}
					}
					
					if(!empty($sitesStats[$siteID]['upgradable_plugins']))
					{
						foreach($sitesStats[$siteID]['upgradable_plugins'] as $item){
							if(in_array($item->file, $PTCParams)){
								 $uniqueName = $item->file ;
								 $requestParams['upgrade_plugins'][] = $item;
								 $historyAdditionalData[] = array('uniqueName' => $uniqueName, 'detailedAction' => 'plugin');
								 $timeout += 20;
								 $events++;
							}
						}
					}
				}
				
				elseif($PTC == 'themes'){
					foreach($sitesStats[$siteID]['upgradable_themes'] as $item){
						if(in_array($item['theme_tmp'], $PTCParams) || in_array($item['name'], $PTCParams)){
							$requestParams['upgrade_themes'][] = $item;
							$uniqueName = $item['theme_tmp'] ? $item['theme_tmp'] : $item['name'];
							$historyAdditionalData[] = array('uniqueName' => $uniqueName, 'detailedAction' => 'theme');
							$timeout += 20;
							$events++;
						}
					}
				}
				elseif($PTC == 'core'){
					if($sitesStats[$siteID]['core_updates']->current == $PTCParams){
						$requestParams['wp_upgrade'] = $sitesStats[$siteID]['core_updates'];
						$historyAdditionalData[] = array('uniqueName' => 'core', 'detailedAction' => 'core');
						$timeout += 120;
						$events++;
					}
				}
			}
			
			$siteData = $sitesData[$siteID];
			
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
	
	public static function updateAllResponseProcessor($historyID, $responseData){
		
		responseDirectErrorHandler($historyID, $responseData);
		if(empty($responseData['success'])){
			return false;
		}
		
		if(!empty($responseData['success']['error']) || !empty($responseData['success']['failed'])){
			
			$errorMsg = !empty($responseData['success']['error']) ? $responseData['success']['error'] : $responseData['success']['failed'];
			DB::update("?:history_additional_data", array('status' => 'error', 'errorMsg' => $errorMsg), "historyID=".$historyID."");	
		}		  
		else{
			foreach($responseData['success'] as $PTC => $PTCResponse){
				if(!empty($PTCResponse['error'])){
						$historyAdditionalUpdateData['status'] = 'error';
						$historyAdditionalUpdateData['errorMsg'] = $PTCResponse['error'];
						
						DB::update("?:history_additional_data", $historyAdditionalUpdateData, "historyID=".$historyID);
					}
					
				if($PTC == 'core'){
					$historyAdditionalUpdateData = array();
					$historyAdditionalUpdateData['status']= 'error';
					
					if(trim($PTCResponse['upgraded']) == 'updated'){
						$historyAdditionalUpdateData['status'] = 'success';
					}
					/*elseif(!empty($PTCResponse['error'])){
						$historyAdditionalUpdateData['status'] = 'error';
						$historyAdditionalUpdateData['errorMsg'] = $PTCResponse['error'];
					}*/
					
					DB::update("?:history_additional_data", $historyAdditionalUpdateData, "historyID=".$historyID." AND uniqueName = 'core'");
				}
				elseif($PTC == 'plugins' || $PTC == 'themes'){
					foreach($PTCResponse['upgraded'] as $name => $success){
						
						
		
						if($success == 1){
							$status = 'success';
							DB::update("?:history_additional_data", array('status' => $status), "historyID=".$historyID);
						}
						elseif(!empty($success)){
							$status = 'error';
							DB::update("?:history_additional_data", array('status' => $status, 'errorMsg' => $success), "historyID=".$historyID);
						}
						else{
							$status = 'error';
							DB::update("?:history_additional_data", array('status' => $status, 'error' => 'unknown', 'errorMsg' => 'An Unknow error occured.'), "historyID=".$historyID);
						}
					}
				}
			}
		}
	
		//---------------------------callback process------------------------>
		
		$siteID = DB::getField("?:history", "siteID", "historyID=".$historyID);
		
		$allParams = array('action' => 'getStats', 'args' => array('siteIDs' => array($siteID), 'extras' => array('exitOnComplete' => false, 'doNotShowUser' => true)));
		
		panelRequestManager::handler($allParams);

	}
	
	public static function updateClientProcessor($siteIDs, $params){
		
		
		$requestAction = 'update_client';
		$type = 'clientPlugin';
		$action = 'update';
		$events = 1;
		
		$historyAdditionalData = array();
		$historyAdditionalData[] = array('detailedAction' => 'update', 'uniqueName' => 'clientPlugin');	
		
		
		foreach($siteIDs as $siteID){
			
			if(!empty($_SESSION['clientUpdates']['sitesUpdate'][$siteID])){
				
				$siteData = getSiteData($siteID);
				$requestParams = array('download_url' => $_SESSION['clientUpdates']['sitesUpdate'][$siteID]);
						
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
	}
	
	public static function updateClientResponseProcessor($historyID, $responseData){
		
		responseDirectErrorHandler($historyID, $responseData);
		if(empty($responseData['success'])){
			return false;
		}
		foreach($responseData['success'] as $key => $value){
			
			DB::update("?:history_additional_data", array('status' => $key), "historyID=".$historyID." AND uniqueName = 'clientPlugin'");
			if($key == 'success'){
				unset($_SESSION['clientUpdates']['sitesUpdate'][$siteID]);
				//---------------------------callback process------------------------>
	
				$siteID = DB::getField("?:history", "siteID", "historyID=".$historyID);
				
				$allParams = array('action' => 'getStats', 'args' => array('siteIDs' => array($siteID), 'extras' => array('exitOnComplete' => false, 'doNotShowUser' => true)));
				
				panelRequestManager::handler($allParams);
			}
		}
	}
}

manageClients::addClass('manageClientsUpdate');



?>
