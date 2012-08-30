<?php

/************************************************************
 * InfiniteWP Admin panel									*
 * Copyright (c) 2012 Revmakx								*
 * www.revmakx.com											*
 *															*
 ************************************************************/

class DBMysql{
	
	protected $DBLink;
	protected $DBHost;
	protected $DBUsername;
	protected $DBPassword;
	protected $DBName;
	protected $DBPort;
	
	function __construct($DBHost, $DBUsername, $DBPassword, $DBName, $DBPort){
		$this->DBHost = $DBHost;
		$this->DBUsername = $DBUsername;
		$this->DBPassword = $DBPassword;
		$this->DBName = $DBName;
		$this->DBPort = $DBPort;
		$this->connect();
	}
	
	function connect(){
		$this->DBLink = mysql_connect($this->DBHost.':'.$this->DBPort, $this->DBUsername, $this->DBPassword);
		if (!$this->DBLink) {
			die('Mysql connect error: (' . $this->errorNo().') '.$this->error());
		}
		if (!mysql_select_db($this->DBName, $this->DBLink)){
			die('Mysql connect error: (' . $this->errorNo().') '.$this->error());
		}
	}
	
	function query($SQL){
		
		$result = mysql_query($SQL, $this->DBLink);
		
		if(empty($result)){			
			$errno = $this->errorNo();
			if ($errno == 2013 || $errno == 2006){
				$this->connect();
				return mysql_query($SQL, $this->DBLink);
			}
		}
		
		return $result;
	}
	
	function insertID(){
		return mysql_insert_id($this->DBLink);
	}
	
	function affectedRows(){
		return mysql_affected_rows($this->DBLink);
	}	
	
	function realEscapeString($val){
		return mysql_real_escape_string($val, $this->DBLink);
	}
	
	function ping(){
		return mysql_ping($this->DBLink);	
	}
	
	function errorNo(){
		return mysql_error($this->DBLink);
	}
	
	function error(){
		return mysql_errno($this->DBLink);
	}
}

class DBMysqlResult{
	
	private $DBResult;
	
	function __construct($newResult)
	{
		$this->DBResult = $newResult;
	}
	function numRows()
	{
		return mysql_num_rows($this->DBResult);
	}
	function nextRow()
	{
		return mysql_fetch_assoc($this->DBResult);
	}
	function rowExists()
	{
		if (!$this->numRows())
			return false;
		return true;
	}
	function free(){
		return mysql_free_result($this->DBResult);
	}
}
?>