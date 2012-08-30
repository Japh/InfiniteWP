<?php
/************************************************************
 * InfiniteWP Admin panel									*
 * Copyright (c) 2012 Revmakx								*
 * www.revmakx.com											*
 *															*
 ************************************************************/

function TPLPrepareHistoryBriefTitle($actionHistory){
	$str = '';
	$count = 0;

	$itemSearchArray = array('<#detailedAction#>', '<#detailedActionCount#>', '<#type#>', '<#typePlural#>', '<#sitesCount#>', '<#sitesCountPlural#>', '<#action#>');
	$template = array();
	$template[''][''][''] 		= "<#detailedAction#> <#detailedActionCount#> <#type#><#typePlural#> in <#sitesCount#> site<#sitesCountPlural#>";
	
	$template['PTC']['']['core'] = "<#action#> WordPress in <#sitesCount#> site<#sitesCountPlural#>";
    
	$template['PTC'][''][''] 	= "<#action#> <#detailedActionCount#> <#detailedAction#><#typePlural#> in <#sitesCount#> site<#sitesCountPlural#>";
	
	$template['site'][''][''] 	= "<#detailedAction#> <#detailedActionCount#> <#type#><#typePlural#>";
	$template['site']['load'][''] 	= "logged in as admin";
	
	$template['themes']['']['get'] = $template['plugins']['']['get'] = "load <#type#>s from <#sitesCount#> site<#sitesCountPlural#>";

	$template['stats']['']['get'] = "reload data from <#sitesCount#> site<#sitesCountPlural#>";
	
	$template['themes']['']['install'] = $template['plugins']['']['install'] = $template[''][''][''];
	
	$template['']['']['backup']	= "<#detailedAction#> <#sitesCount#> site<#sitesCountPlural#>";	
	
	$template['clientPlugin'][''][''] = "<#detailedAction#> IWP Client Plugin<#typePlural#> in <#sitesCount#> site<#sitesCountPlural#>";
	
	$templateModifiedType = $actionHistory['type'];
	if(in_array($actionHistory['type'], array('plugins', 'themes', 'stats'))){
		$templateModifiedType = substr($actionHistory['type'], 0, -1);
	}
	
	foreach($actionHistory['detailedActions'] as $detailedAction => $detailedActionStat){		
		
		$itemReplaceArray = array($detailedAction, $detailedActionStat['detailedActionCount'], $templateModifiedType, ($detailedActionStat['detailedActionCount'] > 1 ? 's' : ''), $detailedActionStat['sitesCount'], ($detailedActionStat['sitesCount'] > 1 ? 's' : ''), $actionHistory['action']);
		
		if($count){ $str .= ', '; }
		
		for($i=7;$i>=0;$i--){
			
			$bin = decbin($i);
			$bin = str_pad ( $bin , 3,  '0', STR_PAD_LEFT);
			$templateType = !empty($bin{0}) ? $actionHistory['type'] : '';
			$templateAction = !empty($bin{1}) ? $actionHistory['action'] : '';
			$templateDetailedAction = !empty($bin{2}) ? $detailedAction : '';
			if(isset($template[$templateType][$templateAction][$templateDetailedAction])){
				$templateString = $template[$templateType][$templateAction][$templateDetailedAction];
				break;
			}
		}
		
		$str .= ucfirst(str_replace($itemSearchArray, $itemReplaceArray, $templateString));

		$count++;
	}
	return $str;
}

function TPLAddErrorHelp($actionData){
	if(stripos($actionData['errorMsg'], 'please add FTP details') !== false){
		$actionData['errorMsg'] .= ' <a href="http://infinitewp.com/knowledge-base/adding-ftp-details-for-auto-update/?utm_source=application&utm_medium=userapp&utm_campaign=kb" target="_blank">How?</a>';
	}
	
	if($actionData['error'] == 'fsock_error'){		
		$actionData['errorMsg'] .= ' Kindly contact your host.';
	}	
	if($actionData['error'] == 'timeoutClear'){
		
		if(empty($GLOBALS['fsockSameURLConnectCheckCache'])){
			$GLOBALS['fsockSameURLConnectCheckCache'] = fsockSameURLConnectCheck(APP_URL.'execute.php');
		 }
		
		if(empty($GLOBALS['fsockSameURLConnectCheck']['status'])){
			$actionData['errorMsg'] .= 'Fsock Error:'.$GLOBALS['fsockSameURLConnectCheck']['error'].' Kindly contact your host.';
		}
	}
	return $actionData['errorMsg'];
}

?>