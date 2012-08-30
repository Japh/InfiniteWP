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
			foreach($siteParams as $PTC => $PTCParams){
				if($PTC == 'plugins'){
					foreach($sitesStats[$siteID]['upgradable_plugins'] as $item){
						if(in_array($item->file, $PTCParams)){
							$requestParams['upgrade_plugins'][] = $item;
							$historyAdditionalData[] = array('uniqueName' => $item->file, 'detailedAction' => 'plugin');
							$events++;
						}
					}
				}
				elseif($PTC == 'themes'){
					foreach($sitesStats[$siteID]['upgradable_themes'] as $item){
						if(in_array($item['theme_tmp'], $PTCParams)){
							$requestParams['upgrade_themes'][] = $item;
							$historyAdditionalData[] = array('uniqueName' => $item['theme_tmp'], 'detailedAction' => 'theme');
							$events++;
						}
					}
				}
				elseif($PTC == 'core'){
					if($sitesStats[$siteID]['core_updates']->current == $PTCParams){
						$requestParams['wp_upgrade'] = $sitesStats[$siteID]['core_updates'];
						$historyAdditionalData[] = array('uniqueName' => 'core', 'detailedAction' => 'core');
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
				if($PTC == 'core'){
					
					$historyAdditionalUpdateData = array();
					$historyAdditionalUpdateData['status']= 'error';
					
					if(trim($PTCResponse['upgraded']) == 'updated'){
						$historyAdditionalUpdateData['status'] = 'success';
					}
					elseif(!empty($PTCResponse['error'])){
						$historyAdditionalUpdateData['status'] = 'error';
						$historyAdditionalUpdateData['errorMsg'] = $PTCResponse['error'];
					}
					
					DB::update("?:history_additional_data", $historyAdditionalUpdateData, "historyID=".$historyID." AND uniqueName = 'core'");
				}
				elseif($PTC == 'plugins' || $PTC == 'themes'){
					foreach($PTCResponse['upgraded'] as $name => $success){
						if($success){
							$status = 'success';
							DB::update("?:history_additional_data", array('status' => $status), "historyID=".$historyID." AND uniqueName = '".$name."'");
						}
						else{
							$status = 'error';
							DB::update("?:history_additional_data", array('status' => $status, 'error' => 'unknown', 'errorMsg' => 'An unknown error occured.'), "historyID=".$historyID." AND uniqueName = '".$name."'");
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
