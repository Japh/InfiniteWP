<?php
/************************************************************
 * InfiniteWP Admin panel									*
 * Copyright (c) 2012 Revmakx								*
 * www.revmakx.com											*
 *															*
 ************************************************************/
 
// This page is for both plugin and themes

class manageClientsPluginsThemes {
	public static function installPluginsProcessor($siteIDs, $params){
		$type = 'plugins';
		return self::installPluginsThemesProcessor($siteIDs, $params, $type);
	}
	
	public static function installThemesProcessor($siteIDs, $params){
		$type = 'themes';
		return self::installPluginsThemesProcessor($siteIDs, $params, $type);
	}
	
	public static function installPluginsThemesProcessor($siteIDs, $params, $type){
		$historyAdditionalData = $package = array();
		$events = 0;
		foreach($params[$type] as $key => $path){
			$package[] = $path;
			$uniqueName = end(explode('/',$path));
			$historyAdditionalData[] = array('uniqueName' => $uniqueName, 'detailedAction' => 'install');
			$events++;
		}
		$requestParams = array('package' => $package, 'activate' => $params['activate'], 'clear_destination' => $params['clearDestination'], 'type' => $type);
		foreach($siteIDs as $siteID){
			self::installPluginsThemesSite($siteID, $requestParams, $type, $historyAdditionalData, $events);	
		}
	}
	
	public static function installPluginsThemesSite($siteID, $requestParams, $type, $historyAdditionalData, $events){	
		$siteData = getSiteData($siteID);	
		$requestAction = "install_addon";
		$action = 'install';	
		$events = count($requestParams['package']);
		
		$PRP = array();
		$PRP['requestAction'] 	= $requestAction;
		$PRP['requestParams'] 	= $requestParams;
		$PRP['siteData'] 		= $siteData;
		$PRP['type'] 			= $type;
		$PRP['action'] 			= $action;
		$PRP['events'] 			= $events;
		$PRP['historyAdditionalData'] 	= $historyAdditionalData;
	
		return prepareRequestAndAddHistory($PRP);
	}

	public static function installPluginsThemesResponseProcessor($historyID, $responseData){
		
		$errorDetail = array();
		$errorDetail['download_failed'] = 'Download failed: ';
		$errorDetail['folder_exists'] 	= 'Folder exists: ';
		$errorDetail['mkdir_failed'] 	= 'Create directory failed: ';
		$errorDetail['incompatible_archive'] = 'Incompatible archive: ';
		$errorDetail['copy_failed'] = 'Copy failed: ';
		
		responseDirectErrorHandler($historyID, $responseData);
		
		if(empty($responseData['success'])){
			return false;
		}
		
		$successUniqueName = array();
		
		if(!empty($responseData['success']['error'])){
			DB::update("?:history_additional_data", array('status' => 'error', 'errorMsg' => $responseData['success']['error']), "historyID=".$historyID."");	
			return false;
		}		
	
		$pluginsThemes = $responseData['success'];
		$successUniqueName = array();
		
		foreach($pluginsThemes as $name => $nameResponse){
	
		if(gettype($nameResponse) == 'object' && !is_object($nameResponse)){
			$nameResponse = fixObject($nameResponse);
		}
		
			if(gettype($nameResponse) == 'object'){
				$nameResponse = get_object_vars($nameResponse);
				$errors = $nameResponse['errors'];
				$errorData = $nameResponse['error_data'];
				
				DB::update("?:history_additional_data", array('status' => 'error', 'error' => key($errorData), 'errorMsg' => $errorDetail[key($errorData)].reset($errorData) ), "historyID=".$historyID." AND uniqueName = '".$name."'");
				
			}		
			elseif(!empty($pluginsThemes[$name]['source'])){
				$successUniqueName[] = $name;			
			}
		}
		if(!empty($successUniqueName)){
			
			DB::update("?:history_additional_data", array('status' => 'success'), "historyID=".$historyID." AND uniqueName IN ('".  implode("', '", $successUniqueName) ."')");	
			
		}
	}
	
	//===================================== activate, deactivate, delete plugins and themes ====================================>
	
	public static function managePluginsProcessor($siteIDs, $params)
	{
		$type = 'plugins';
		$action = 'manage';
		return self::managePluginsThemesProcessor($siteIDs, $params, $type);
	}
	
	public static function manageThemesProcessor($siteIDs, $params)
	{
		$type = 'themes';
		$action = 'manage';
		return self::managePluginsThemesProcessor($siteIDs, $params, $type);
	}
	
	public static function managePluginsThemesProcessor($siteIDs, $params, $type)
	{		
	
		foreach($params as $siteID => $param){
			$siteIDs = array($siteID);
			$historyAdditionalData = array();
			$events = 0;
			$items = array();
			
			foreach($param[$type] as $key => $value){
				$items[] = array('name' => $value['name'], 'path' => $value['path'], 'stylesheet' => $value['stylesheet'], 'action' => $value['action']);	
				
				$historyAdditionalData[] = array('uniqueName' => $value['name'], 'detailedAction' => $value['action']);
				$events++;
			}
			$requestParams = array('items' => $items, 'type' => $type);
			self::managePluginsThemesSite($siteID, $requestParams, $type, $events, $historyAdditionalData);	
		}
	}
		
	public static function managePluginsThemesSite($siteID, $requestParams, $type, $events, $historyAdditionalData){
		
		$action = 'manage';
		$siteData = getSiteData($siteID);
		$requestAction = "edit_plugins_themes";
		
		$PRP = array();
		$PRP['requestAction'] 	= $requestAction;
		$PRP['requestParams'] 	= $requestParams;
		$PRP['siteData'] 		= $siteData;
		$PRP['type'] 			= $type;
		$PRP['action'] 			= $action;
		$PRP['events'] 			= $events;
		$PRP['historyAdditionalData'] 	= $historyAdditionalData;
		
		return prepareRequestAndAddHistory($PRP);
	}
	
	public static function managePluginsThemesResponseProcessor($historyID, $responseData){
		
		responseDirectErrorHandler($historyID, $responseData);
		
	   	if( empty($responseData['success']) ){
			return false;
		}
		
		$type = DB::getField("?:history", "type", "historyID=".$historyID);
		$successUniqueName = array();
				
		$pluginsThemes = $responseData['success'][$type];
		if(!empty($pluginsThemes)){
			foreach($pluginsThemes as $name => $status){
				if($status == 'OK'){
					$successUniqueName[] = $name;
				}
				else{
					if(!empty($status['error'])){
						DB::update("?:history_additional_data", array('status' => 'error', 'errorMsg' => $status['error']), "historyID=".$historyID." AND uniqueName = '".$name."'");
					}					
				}
			}
			DB::update("?:history_additional_data", array('status' => 'success'), "historyID=".$historyID." AND uniqueName IN ('".  implode("', '", $successUniqueName) ."')");					
		}	
	}
}
manageClients::addClass('manageClientsPluginsThemes'); 
?>