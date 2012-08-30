<?php
/************************************************************
 * InfiniteWP Admin panel									*
 * Copyright (c) 2012 Revmakx								*
 * www.revmakx.com											*
 *															*
 ************************************************************/

$settings = Reg::get('settings');
define('MAX_SIMULTANEOUS_REQUEST_PER_IP', $settings['MAX_SIMULTANEOUS_REQUEST_PER_IP'] > 0 ? $settings['MAX_SIMULTANEOUS_REQUEST_PER_IP'] : 1 );

define('MAX_SIMULTANEOUS_REQUEST', $settings['MAX_SIMULTANEOUS_REQUEST'] > 0 ? $settings['MAX_SIMULTANEOUS_REQUEST'] : 10 );
//define('MAX_SIMULTANEOUS_REQUEST_PER_SERVERGROUP', $settings['MAX_SIMULTANEOUS_REQUEST_PER_SERVERGROUP']);

define('TIME_DELAY_BETWEEN_REQUEST_PER_IP', $settings['TIME_DELAY_BETWEEN_REQUEST_PER_IP'] >= 0 ? $settings['TIME_DELAY_BETWEEN_REQUEST_PER_IP'] : 0 );

function executeJobs(){
			
	  $noRequestRunning = true;
	  $requestInitiated = 0;
	  $requestPending 	= 0;
	  $isExecuteRequest = false;
	  $lastIPRequestInitiated = '';
	  
	  $totalCurrentRunningRequest = DB::getField("?:history H LEFT JOIN ?:sites S ON H.siteID = S.siteID", "COUNT(H.historyID)", "H.status IN ('initiated', 'running')");
	  
	  if($totalCurrentRunningRequest >= MAX_SIMULTANEOUS_REQUEST){ echo 'MAX_SIMULTANEOUS_REQUEST'; return false; }//dont execute any request
			  
	  $runningRequestByIP = DB::getFields("?:history H LEFT JOIN ?:sites S ON H.siteID = S.siteID", "COUNT(H.historyID), S.IP", "H.status IN ('initiated', 'running') GROUP BY S.IP", "IP");
	  
	  if(!empty($runningRequestByIP)){ //some request(s) are running
		  $noRequestRunning = false;
		  $runningRequestByServer = DB::getFields("?:history H LEFT JOIN ?:sites S ON H.siteID = S.siteID", "COUNT(H.historyID), S.serverGroup", "H.status IN ('initiated', 'running') GROUP BY S.serverGroup", "serverGroup");			
	  }
	  
	  //get pending request 
	  $pendingRequests = DB::getArray("?:history H LEFT JOIN ?:sites S ON H.siteID = S.siteID", "H.historyID, S.IP, S.serverGroup, H.actionID", "(H.status = 'pending' OR (H.status = 'scheduled' AND H.timescheduled <= ".time().")) ORDER BY H.historyID");
	  
	  if($noRequestRunning){		
		  $runningRequestByIP 	= array();
		  $runningRequestByServer = array();				
	  }
	  
	
	  foreach($pendingRequests as $request){
		  
		  if(!isset($runningRequestByIP[ $request['IP'] ])) $runningRequestByIP[ $request['IP'] ] = 0;
		 // if(!isset($runningRequestByServer[ $request['serverGroup'] ])) $runningRequestByServer[ $request['serverGroup'] ] = 0;
		  
		  if($totalCurrentRunningRequest >= MAX_SIMULTANEOUS_REQUEST){ echo 'MAX_SIMULTANEOUS_REQUEST'; return false; }
		  
		  //check already request are running in allowed level 
		  if($runningRequestByIP[ $request['IP'] ] >= MAX_SIMULTANEOUS_REQUEST_PER_IP /*|| $runningRequestByServer[ $request['serverGroup'] ] >=  MAX_SIMULTANEOUS_REQUEST_PER_SERVERGROUP*/){
			 
			  
			  if($runningRequestByIP[ $request['IP'] ] >= MAX_SIMULTANEOUS_REQUEST_PER_IP)
			  echo 'MAX_SIMULTANEOUS_REQUEST_PER_IP<br>';
			 /* if($runningRequestByServer[ $request['serverGroup'] ] >=  MAX_SIMULTANEOUS_REQUEST_PER_SERVERGROUP)
			  echo 'MAX_SIMULTANEOUS_REQUEST_PER_SERVERGROUP<br>';*/
			  continue; //already request are running on the limits
		  }
		  
		  $updateRequest = array('H.status' => 'initiated', 'H.microtimeInitiated' => microtime(true));
		  
		  $isUpdated = DB::update("?:history H", $updateRequest, "(H.status = 'pending' OR (H.status = 'scheduled' AND H.timescheduled <= ".time().")) AND H.historyID = ".$request['historyID']);
		  
		  $isUpdated = DB::affectedRows();
		  
		  if($isUpdated){
			  //ready to run a child php to run the request
			  
			  if($lastIPRequestInitiated == $request['IP']){
				  usleep((TIME_DELAY_BETWEEN_REQUEST_PER_IP * 1000));
			  }
			  
			 // echo '<br>executing child process';
			  if(defined('IS_EXECUTE_FILE')){
				  //echo '<br>executing_directly';
				  executeRequest($request['historyID']);
				  $isExecuteRequest = true;
				  $requestPending++;
			  }
			  else{
				 // echo '<br>executing_async';
				 $callAsyncInfo = callURLAsync(APP_URL.EXECUTE_FILE, array('historyID' =>  $request['historyID'], 'actionID' => $request['actionID']));					 
				 onAsyncFailUpdate($request['historyID'], $callAsyncInfo);
				 // echo '<pre>callExecuted:'; var_dump($callAsyncInfo); echo'</pre>';
			  }
			 			 	
			  $requestInitiated++; 
			  
			  $runningRequestByIP[ $request['IP'] ]++;
			 // $runningRequestByServer[ $request['serverGroup'] ] ++;
			  $totalCurrentRunningRequest++;
			  
			  
			  $lastIPRequestInitiated = $request['IP'];
			  
			  if($isExecuteRequest){ break; }//breaking here once executeRequest runs(direct call) next forloop job might be executed by other instance because that job loaded in array which already loaded from DB, still only the job inititated here will run  $isUpdated = DB::affectedRows();
		  }
		  else{
			echo 'update error, this request might be executed by someother instance.';  
		  }
	  }
	  return array('requestInitiated' => $requestInitiated, 'requestPending' => $requestPending);
}

?>
