<?php

/************************************************************
 * InfiniteWP Admin panel									*
 * Copyright (c) 2012 Revmakx								*
 * www.revmakx.com											*
 *															*
 ************************************************************/

class DBMysqli{
	
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
		$this->DBLink = new mysqli($this->DBHost, $this->DBUsername, $this->DBPassword, $this->DBName, $this->DBPort);
		if ($this->DBLink->connect_errno) {
			die('Mysql connect error: (' . $this->DBLink->connect_errno.') '.$this->DBLink->connect_error);
		}	
		return true;	
	}
	
	function query($SQL){
		$result = $this->DBLink->query($SQL);
		
		if(empty($result)){			
			$errno = $this->errorNo();
			if ($errno == 2013 || $errno == 2006){
				$this->connect();
				return $this->DBLink->query($SQL);
			}
		}
		
		return $result;
	}
	
	function insertID(){
		return $this->DBLink->insert_id;
	}
	
	function affectedRows(){
		return $this->DBLink->affected_rows;
	}	
	
	function realEscapeString($val){
		return $this->DBLink->real_escape_string($val);
	}
	
	function ping(){
		return $this->DBLink->ping();	
	}
	
	function errorNo(){
		return $this->DBLink->errno;
	}
	
	function error(){
		return $this->DBLink->error;
	}
}

class DBMysqliResult{
	
	private $DBResult;
	
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