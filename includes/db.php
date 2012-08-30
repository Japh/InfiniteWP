<?php

/************************************************************
 * InfiniteWP Admin panel									*
 * Copyright (c) 2012 Revmakx								*
 * www.revmakx.com											*
 *															*
 ************************************************************/

#class providing access to the mysql database

class DB{
	
	private static $queryString;
	private static $printQuery;
	private static $printAllQuery;
	private static $showError;
	private static $DBDriver;
	private static $showSQL;
	private static $DBResultClass;
	
	public static function connect(){
		if(!defined('SQL_DRIVER') || !in_array(SQL_DRIVER, array('mysql', 'mysqli'))){
			die('SQL_DRIVER not defined');
		}
		require_once(APP_ROOT.'/includes/dbDrivers/'.SQL_DRIVER.'.php');
		
		$DBClass = 'DB'.ucfirst(SQL_DRIVER);
		self::$DBResultClass = $DBClass.'Result';
		
		self::$DBDriver = new $DBClass(Reg::get('config.SQL_HOST'), Reg::get('config.SQL_USERNAME'), Reg::get('config.SQL_PASSWORD'), Reg::get('config.SQL_DATABASE'), Reg::get('config.SQL_PORT'));
		self::$showSQL = false;
		self::$showError = $GLOBALS['mysqlShowManualError'];
	}
	
	private static function get($params, $type){
		if(empty($params)) return false;
		
		$result = array();		
		$query = self::prepareQ('select', $params);
		
		$query_result = self::doQuery($query);	
		if(!$query_result) return $query_result;	
		$_result = new self::$DBResultClass($query_result);	
		
		
		if($_result){
			if($type == 'array'){
				while($row = $_result->nextRow()){
					if(!empty($params[3])){//array key hash
						$result[ $row[$params[3]] ] = $row;
					}
					else{
					$result[] = $row;
				}
			}
			}
			elseif($type == 'row'){
				$result = $_result->nextRow();
			}
			elseif($type == 'exists'){
				$result = $_result->rowExists();
			}
			elseif($type == 'field'){
				$row = $_result->nextRow();
				$result = ($row && is_array($row)) ? reset($row) : NULL;
			}
			elseif($type == 'fields'){
				while($row = $_result->nextRow()){
					if(!empty($params[3])){//array key hash
						$result[ $row[$params[3]] ] = reset($row);
					}
					else{
					$result[] = reset($row);
					}
				}
			}
			$_result->free();
		}
		return $result;
	}
	
	public static function getArray(){//table, select, conditions
		return self::get(func_get_args(), 'array');
	}
	public static function getRow(){//table, select, conditions
		return self::get(func_get_args(), 'row');
	}
	
	public static function getExists(){//table, select, conditions
		return self::get(func_get_args(), 'exists');
	}
	
	public static function getField(){//table, select, conditions
		return self::get(func_get_args(), 'field');
	}
	
	public static function getFields(){//table, select, conditions
		return self::get(func_get_args(), 'fields');
	}
	
	private static function prepareQ($type, $params){
		
		if(!empty($params) && count($params) == 1){
			return $params[0];
		}
		
		if($type == 'select'){
			if(empty($conditions)){ $conditions = 'true'; }
			return "SELECT ".$params[1]." FROM ".$params[0]." WHERE ".$params[2];
		}
		elseif($type == 'insert' || $type == 'replace'){
			if(is_array($params[1])) $params[1] = self::array2MysqlSet($params[1]);
			return ($type == 'insert' ? "INSERT" : "REPLACE")." INTO ".$params[0]." SET ".$params[1];
		}
		elseif($type == 'update'){
			if(is_array($params[1])) $params[1] = self::array2MysqlSet($params[1]);
			return "UPDATE ".$params[0]." SET ".$params[1]." WHERE ".$params[2];
		}
		elseif($type == 'delete'){
			return "DELETE FROM ".$params[0]." WHERE ".$params[1];
		}
	}
	
	public static function insert(){//table, setCommand
		$args=func_get_args();
		$query = self::prepareQ('insert', $args);
		return self::insertReplace($query);
	}
	
	
	public static function replace(){//table, setCommand
		$args=func_get_args();
		$query = self::prepareQ('replace', $args);
		return self::insertReplace($query);
	}
	
	private static function insertReplace($query){
		
		if(self::doQuery($query))
			return self::lastInsertID();
		return false;
	}
	
	public static function update(){//table, setCommand, conditions
		$args=func_get_args();
		$query = self::prepareQ('update', $args);
		return self::doQuery($query);
	}
	
	public static function delete(){//table, conditions
		$args=func_get_args();
		$query = self::prepareQ('delete', $args);
		return self::doQuery($query);
	}

	public static function doQuery($queryString){	
	
		$queryString = str_replace('?:', Reg::get('config.SQL_TABLE_NAME_PREFIX'), $queryString);
		
		self::$queryString = $queryString;
		
		if(self::$printAllQuery || self::$printQuery)
			echo '<br>'.self::$queryString.'<br>';

		$query = self::$DBDriver->query(self::$queryString);

		if($query)
			 return $query;
		else
		{
			self::printError(debug_backtrace());
			echo "\n".self::$queryString."\n<br>";
			return false;
		}
	}
	
	public static function getLastQuery(){//avoid using this function, it should be called as soon as query is executed
		return self::$queryString;		
	}
	
	private static function lastInsertID(){
		return self::$DBDriver->insertID();
	}
	
	public static function errorNo(){
		return self::$DBDriver->errorNo();
	}
	
	public static function affectedRows(){
		return self::$DBDriver->affectedRows();
	}
	
	public static function realEscapeString($val){
		return self::$DBDriver->realEscapeString($val);
	}
	
	public static function escapse($val){ //same as public static function realEscapeString($val) 
		return self::$DBDriver->realEscapeString($val);
	}
	
	private static function printError($traceback_detail){
		echo "<b>Manual SQL Error</b>: [". self::$DBDriver->errorNo()."] " . self::$DBDriver->error() . "<br />\n
		 in file <b>" . $_SERVER['PHP_SELF'] ."</b> On line <b>" . $traceback_detail[count($traceback_detail) - 1]['line'] . "</b><br> ";
	}
	
	private static function array2MysqlSet($array){
		$mysqlSet='';
		$isPrev=false;
		foreach($array as $key => $value)
		{
			if($isPrev) $mysqlSet .= ', ';
			if(isset($value) && is_array($value))
				$mysqlSet .= $key." = ".self::realEscapeString($value).""; //without quotes
			else
				$mysqlSet .= $key." = '".self::realEscapeString($value)."'";
			$isPrev = true;
		}
		return $mysqlSet;
	}
	
	private static function array2MysqlSelect($array){
		$mysqlSet='';
		$isPrev=false;
		foreach($array as $key => $value)
		{
			if($isPrev) $mysqlSet .= ', ';
			$mysqlSet .= $value;
			$isPrev = true;
		}
		return $mysqlSet;
	}
	
	public static function setPrintQuery($var){
		self::$printQuery = $var;
	}
}

//-------------------------------------------------------------------------------------------------------------------->

# stores a mysql result
class DBResult{
	var $DBResult;
	function __construct($newResult)
	{
		$this->DBResult = $newResult;
	}
	function numRows()
	{
		return $this->DBResult->num_rows;
	}
	function nextRow()
	{
		return $this->DBResult->fetch_assoc();
	}
	function rowExists()
	{
		if (!$this->numRows())
			return false;
		return true;
	}
	function free(){
		$this->DBResult->free();
	}
	
}
?>
