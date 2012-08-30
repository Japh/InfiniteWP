<?php

/************************************************************
 * InfiniteWP Admin panel									*
 * Copyright (c) 2012 Revmakx								*
 * www.revmakx.com											*
 *															*
 ************************************************************/

class Reg{
	
	private static $storeData = array();
	
	public static function set($var, $value){
		$varArray = explode('.', $var);
	
		$_storeData = & self::$storeData;
		while($_key = array_shift($varArray)){
			
			if(!isset($_storeData[$_key])){
				$_storeData[$_key] = array();
			}
			$_storeData = & $_storeData[$_key];
		}
		$_storeData = $value;
	}
	
	public static function get($var){
		$varArray = explode('.', $var);
	
		$_storeData = & self::$storeData;
		while($_key = array_shift($varArray)){
			$_storeData = & $_storeData[$_key];
		}
		return $_storeData;
	}
	
	public static function tplSet($var, $value){
		$var = 'tpl'.$var;
		return self::set($var, $value);
	}
	
	public static function tplGet($var){
		$var = 'tpl'.$var;
		return self::get($var);
	}
	
	
	
	public static function print_t(){
		echo '<pre>'.print_r(self::$storeData, true).'</pre>';
	}
	
	public static function setRaw($key, $value){
		self::$storeData[$key] = $value;
	}
}

?>