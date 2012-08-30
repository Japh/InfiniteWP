<?php
/************************************************************
 * InfiniteWP Admin panel									*
 * Copyright (c) 2012 Revmakx								*
 * www.revmakx.com											*
 *															*
 ************************************************************/
                                         
class manageClients{
	
	private static $clientMethods = array();
	private static $inbuiltMethods = array('__construct', '__destruct', '__call', '__callStatic', '__get', '__set', '__isset', '__unset', '__sleep', '__wakeup', '__toString', '__invoke', '__set_state', '__clone');
	
	public static function addClass($className){
		$methods = (array)get_class_methods($className);
		foreach($methods as $method){
			if(in_array($method, self::$inbuiltMethods)){
				continue;
			}
			if(!isset($clientMethods[$method])){
				self::$clientMethods[$method] = $className;
			}
			else{
				trigger_error("Method already exists in class ".$clientMethods[$method], E_USER_ERROR);	
			}
		}
	
	}
	
	public static function execute($action, $args){
		
		@extract($args);
		$method = $action.'Processor';
		if(isset(self::$clientMethods[$method])){
			call_user_func_array(array(self::$clientMethods[$method], $method), array($siteIDs, $params, $extras));
		}
		else{
			trigger_error("Undefined action ".$action, E_USER_ERROR);		
		}
	}
	
	public static function executeResponse($action, $historyID, $responseData){
		$method = $action.'ResponseProcessor';
		if(isset(self::$clientMethods[$method])){
			call_user_func_array(array(self::$clientMethods[$method], $method), array($historyID, $responseData));
		}
		else{
			trigger_error("Undefined action ".$action, E_USER_ERROR);		
		}
	}
	
	public static function methodExists($action){
		$method = $action.'Processor';
		return isset(self::$clientMethods[$method]);
	}
	
	public static function methodResponseExists($action){
		$method = $action.'ResponseProcessor';
		return isset(self::$clientMethods[$method]);
	}
	
}

include('manageClientsSites.php');
include('manageClientsPluginsThemes.php');
include('manageClientsFetch.php');
include('manageClientsUpdate.php');
include('manageClientsBackup.php');


?>