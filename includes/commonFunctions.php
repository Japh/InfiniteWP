<?php

/************************************************************
 * InfiniteWP Admin panel									*
 * Copyright (c) 2012 Revmakx								*
 * www.revmakx.com											*
 *															*
 ************************************************************/

function paginate($page, $total, $itemsPerPage, $paginationName='pagination'){
	
	if(empty($page) || !is_numeric($page)) $page = 1;
	
	$totalPage = ceil($total / $itemsPerPage);
	
	$prevPage = $page > 1 ? ($page - 1) : '';
	$nextPage = $page < $totalPage ? ($page + 1) : '';
	
	$pagination = array('page'		=> $page,
						'prevPage'	=> $prevPage,
						'nextPage'	=> $nextPage,
						'total'		=> $total,
						'itemPerPage'	=> $itemsPerPage,
						'totalPage'	=> $totalPage,						
						);
					
	Reg::tplSet($paginationName, $pagination);
						
	return 'LIMIT '.(($page - 1)  * $itemsPerPage).', '.$itemsPerPage;
}

function repoDoCall($URL, $data){
	
	$ch = curl_init($URL);
	curl_setopt($ch, CURLOPT_URL, $URL);
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	//curl_setopt($ch, CURLOPT_HTTPHEADER,array('Content-Type: text/plain')); 
	curl_setopt($ch, CURLOPT_USERAGENT,'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13');
	curl_setopt($ch, CURLOPT_POST, true);
	curl_setopt($ch, CURLOPT_POSTFIELDS,$data);
	$return=curl_exec($ch);
	
	return $return;
}


function doCall($URL, $data, $timeout=DEFAULT_MAX_CLIENT_REQUEST_TIMEOUT, $options=array()) //Needs a timeout handler
{	
	$SSLVerify = false;
	$URL = trim($URL);
	if(stripos($URL, 'https://') !== false){ $SSLVerify = true; }
	
	$ch = curl_init($URL);
	curl_setopt($ch, CURLOPT_URL, $URL);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_MAXREDIRS, 2);
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: text/plain')); 
	curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13');
	curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, ($SSLVerify === true) ? 2 : false );
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, $SSLVerify);
	curl_setopt($ch, CURLOPT_TIMEOUT, $timeout);
	
	if (!ini_get('safe_mode') && !ini_get('open_basedir')){
		@curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
	}
	
	if($options['file'] == 'download' && !empty($options['filePath'])){
		$fp = fopen($options['filePath'], "w");
    	curl_setopt($ch, CURLOPT_FILE, $fp);	
	}
	
	if(!empty($data)){
		curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt($ch, CURLOPT_POSTFIELDS, base64_encode(serialize($data)));
	}
	
	
	$microtimeStarted 	= microtime(true);
	$response 			= curl_exec($ch);
	$microtimeEnded 	= microtime(true);
	
	$curlInfo = array();
	$curlInfo['info'] = curl_getinfo($ch);
	if(curl_errno($ch)){
		$curlInfo['errorNo'] = curl_errno($ch);
		$curlInfo['error'] = curl_error($ch);
	}
	
	curl_close($ch);
	
	if($options['file'] == 'download' && !empty($options['filePath'])){
		fclose($fp);
	}
	
	return array($response, $microtimeStarted, $microtimeEnded, $curlInfo);
}

function unserializeArray($strBetArray){
	if(empty($strBetArray) || !is_array($strBetArray)){ return false; }
	$newArray = array();
	foreach($strBetArray as $key => $value){
		$newArray[$key] = unserialize($value);
	}
	return $newArray;
}

function getStrBetAll($string, $startString, $endString)
{
	$betArray = array();
	while($string){
		list($strBet, $string) = getStrBet($string, $startString, $endString);
		if(!$strBet) break;
		$betArray[] = $strBet;
	}
	return $betArray;
}

function getStrBet($string, $startString, $endString)//note endstring must be after the start string
{
	if(!$startString) { $startPos = 0; }
	else{
		$startPos = strpos($string, $startString);
		if($startPos === false) { return false; }
		$startPos = $startPos + strlen($startString);
	}
	
	if(!$endString)
	{
		$strBet = substr($string, $startPos);
		return array($strBet, substr($string, strpos($string, $strBet)));
	}
	
	$endPos = strpos($string, $endString, $startPos);
	if(!$endPos) return false;
	
	$strBet = substr($string, $startPos, ($endPos - $startPos));
	return array($strBet, substr($string, $endPos+strlen($endString)));
}


function fixObject (&$object){
  if (!is_object ($object) && gettype ($object) == 'object')
	return ($object = unserialize (serialize ($object)));
  return $object;
}

function objectToArray($o) {
	if (is_object($o)) {
			$o = get_object_vars($o);
	}
	if (is_array($o)) {
		return array_map(__FUNCTION__, $o);
	}
	else {
		// Return array
		return $o;
	}
}


function callURLAsync($url, $params=array()){
	
    $post_params = array();
	foreach ($params as $key => &$val) {
      if (is_array($val)) $val = implode(',', $val);
        $post_params[] = $key.'='.urlencode($val);
    }
    $post_string = implode('&', $post_params);

    $parts = parse_url($url);
	$host = $parts['host'];

	if (($parts['scheme'] == 'ssl' || $parts['scheme'] == 'https') && extension_loaded('openssl')){
		$parts['host'] = "ssl://".$parts['host'];
		$parts['port'] = 443;
		error_reporting(0);
	}
	else{
		$parts['port'] = 80;
	}	
	  
    $fp = @fsockopen($parts['host'], $parts['port'], $errno, $errstr, 30);
	if(!$fp) return array('status' => false, 'resource' => !empty($fp) ? true : false, 'errorNo' => 'unable_to_intiate_fsock', 'error' => 'Unable to initiate FsockOpen');
	if($errno > 0) return array('status' => false, 'errorNo' => $errno, 'error' => $errno. ':' .$errstr);

    $out = "POST ".$parts['path']." HTTP/1.0\r\n";
    $out.= "Host: ".$host."\r\n";
	$out.= "User-agent: " . "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13". "\r\n";
    $out.= "Content-Type: application/x-www-form-urlencoded\r\n";
    $out.= "Content-Length: ".strlen($post_string)."\r\n";
    $out.= "Connection: Close\r\n\r\n";
    if (isset($post_string)) $out.= $post_string;

    $is_written = fwrite($fp, $out);
	if(!$is_written){
		return array('status' => false, 'writable' => false);
	}

    fclose($fp);
	return array('status' => true);
}

function fsockSameURLConnectCheck($url){
	
	$params=array('check' =>  'sameURL');	
	
	$post_params = array();
	foreach ($params as $key => &$val) {
      if (is_array($val)) $val = implode(',', $val);
        $post_params[] = $key.'='.urlencode($val);
    }
    $post_string = implode('&', $post_params);
	
	$parts = parse_url($url);
	$host = $parts['host'];

	if (($parts['scheme'] == 'ssl' || $parts['scheme'] == 'https') && extension_loaded('openssl')){
		$parts['host'] = "ssl://".$parts['host'];
		$parts['port'] = 443;
		error_reporting(0);
	}
	else{
		$parts['port'] = 80;
	}	
	  
    $fp = @fsockopen($parts['host'], $parts['port'], $errno, $errstr, 30);
	if(!$fp) return array('status' => false, 'resource' => !empty($fp) ? true : false, 'errorNo' => 'unable_to_intiate_fsock', 'error' => 'Unable to initiate FsockOpen');
	if($errno > 0) return array('status' => false, 'errorNo' => $errno, 'error' => $errno. ':' .$errstr);

    $out = "POST ".$parts['path']." HTTP/1.0\r\n";
    $out.= "Host: ".$host."\r\n";
	$out.= "User-agent: " . "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13". "\r\n";
    $out.= "Content-Type: application/x-www-form-urlencoded\r\n";
    $out.= "Content-Length: ".strlen($post_string)."\r\n";
    $out.= "Connection: Close\r\n\r\n";
	
    if (isset($post_string)) $out.= $post_string;
	
    $is_written = fwrite($fp, $out);
	if(!$is_written){
		return array('status' => false, 'writable' => false, 'errorNo' => 'unable_to_write_request', 'error' => 'Unable to write request');
	}
	
	$temp = '';
	 while (!feof($fp)) {
        $temp .= fgets($fp, 128);
    }
	
	if(strpos($temp, 'same_url_connection') !== false){
		return array('status' => true);
	}
	else{
		return array('status' => false, 'errorNo' => 'unable_to_verify', 'error' => 'Unable to verify content');
	}
	
    fclose($fp);
}

function filterParameters($array) {
  
	  // Check if the parameter is an array
	  if(is_array($array)) {
		  // Loop through the initial dimension
		  foreach($array as $key => $value) {
			  // Check if any nodes are arrays themselves
			  if(is_array($array[$key]))
				  // If they are, let the function call itself over that particular node
				  $array[$key] = filterParameters($array[$key]);
		  
			  // Check if the nodes are strings
			  if(is_string($array[$key]))
				  // If they are, perform the real escape function over the selected node
				  $array[$key] = DB::realEscapeString($array[$key]);
		  }            
	  }
	  // Check if the parameter is a string
	  if(is_string($array))
		  // If it is, perform a  mysql_real_escape_string on the parameter
		  $array = DB::realEscapeString($array);
	  
	  // Return the filtered result
	  return $array;
}

function IPInRange($IP, $range) {

	if (strpos($range, '*') !==false) { // a.b.*.* format
	  // Just convert to A-B format by setting * to 0 for A and 255 for B
	  $lower = str_replace('*', '0', $range);
	  $upper = str_replace('*', '255', $range);
	  $range = "$lower-$upper";
	}
	
	if (strpos($range, '-')!==false) { // A-B format
	  list($lower, $upper) = explode('-', $range, 2);
	  $lowerDec = (float)sprintf("%u", ip2long($lower));
	  $upperDec = (float)sprintf("%u", ip2long($upper));
	  $IPDec = (float)sprintf("%u", ip2long($IP));
	  return ( ($IPDec>=$lowerDec) && ($IPDec<=$upperDec) );
	}
	if($IP == $range) return true;
	return false;
}

function ksortTree( &$array, $sortMaxLevel=-1, $currentLevel=0 )
{
  if((int)$sortMaxLevel > -1 && $sortMaxLevel <= $currentLevel){ return false;}
  
  if (!is_array($array)) {
    return false;
  }
 
  ksort($array);
  foreach ($array as $k=>$v) {
	$currentLevel++;
    ksortTree($array[$k], $sortMaxLevel, $currentLevel);
  }
  return true;
}

function trimValue(&$v){
	$v = trim($v);
}

function arrayMergeRecursiveNumericKeyHackFix(&$array){
	if(!is_array($array)){ return; }

	foreach($array as $key => $value){
		$finalKey = $key;
		$numKey = preg_replace("/[^0-9]/", '', $key);
		if($key == '_'.$numKey){
			unset($array[$key]);
			$array[$numKey] = $value;
			$finalKey = $numKey;
		}
		arrayMergeRecursiveNumericKeyHackFix($array[$finalKey]);
	}
	return;

}

function appErrorHandler($errno, $errstr,  $errfile, $errline, $errcontext )
{
   
    $mess = "errno:$errno ($errstr) file:$errfile, line:$errline, context:$context\n";
	
	
	$fd = @fopen('appErrorLogs.txt', 'a');
    if(!$fd)
    {
        echo "<pre>$mess</pre>";
    }
    else
    {
        if(!fwrite($fd, @date('Y-m-d H:i:s')." ERR : \n$mess\n\n"))
        {
            echo "<pre>$mess</pre>";
        }
        fclose($fd);
    }
	
	
	return false;
}

set_error_handler('appErrorHandler', E_ERROR|E_WARNING|E_PARSE|E_CORE_ERROR|E_COMPILE_ERROR|E_COMPILE_WARNING);


if (!function_exists('json_encode'))
{
  function json_encode($a=false)
  {
    if (is_null($a)) return 'null';
    if ($a === false) return 'false';
    if ($a === true) return 'true';
    if (is_scalar($a))
    {
      if (is_float($a))
      {
        // Always use "." for floats.
        return floatval(str_replace(",", ".", strval($a)));
      }

      if (is_string($a))
      {
        static $jsonReplaces = array(array("\\", "/", "\n", "\t", "\r", "\b", "\f", '"'), array('\\\\', '\\/', '\\n', '\\t', '\\r', '\\b', '\\f', '\"'));
        return '"' . str_replace($jsonReplaces[0], $jsonReplaces[1], $a) . '"';
      }
      else
        return $a;
    }
    $isList = true;
    for ($i = 0, reset($a); $i < count($a); $i++, next($a))
    {
      if (key($a) !== $i)
      {
        $isList = false;
        break;
      }
    }
    $result = array();
    if ($isList)
    {
      foreach ($a as $v) $result[] = json_encode($v);
      return '[' . join(',', $result) . ']';
    }
    else
    {
      foreach ($a as $k => $v) $result[] = json_encode($k).':'.json_encode($v);
      return '{' . join(',', $result) . '}';
    }
  }
}


function downloadURL($URL, $filePath){
	
	return (fopenDownloadURL($URL, $filePath) || curlDownloadURL($URL, $filePath));

}

function curlDownloadURL($URL, $filePath){
	
	$options = array('file' => 'download', 'filePath' => $filePath);
	$callResponse = doCall($URL, '', 60, $options);
	if($callResponse[0] == 1){
		return true;
	}
	return false;
	
}

function fopenDownloadURL($URL, $filePath){
	
	 if (function_exists('ini_get') && ini_get('allow_url_fopen') == 1) {
		 $src = @fopen($URL, "r");
		 $dest = @fopen($filePath, 'wb');
		 if($src && $dest){
			 while ($content = @fread($src, 1024 * 1024)) {
				@fwrite($dest, $content);
			 }
    
			@fclose($src);
			@fclose($dest);
			return true;
		 }		
	 }
	 return false;
}



function unzip($file, $dest){

	return (zipArchiveUnZip($file, $dest) || pclZipUnZip($file, $dest));
}

function zipArchiveUnZip($file, $dest){
	if(class_exists('ZipArchive')){
		$zip = new ZipArchive;
		$result = $zip->open($file);
		 if ($result === true) {
			 $isDone = $zip->extractTo($dest);
			 $zip->close();
			 return $isDone;
		 } else {
			 return false;
		 }
	}
	return false;
}

function pclZipUnZip($file, $dest){
	
	define('PCLZIP_TEMPORARY_DIR',  APP_ROOT. '/updates');
	include_once(APP_ROOT.'/includes/pclzip.php');
	$zip = new PclZip($file);
	$result = $zip->extract(PCLZIP_OPT_PATH, $dest, PCLZIP_OPT_REPLACE_NEWER);
	if($result == 0){ return false; }
	else{ return true; }
}

function getZipFilesList($file){
	$files = getZipArchiveFilesList($file);
	return !empty($files) ? $files : getPclZipFilesList($file);
}

function getZipArchiveFilesList($file){
	$files = array();
	if(class_exists('ZipArchive')){
		$zip = new ZipArchive;
		$result = $zip->open($file);	
		if ($result === true) {	
			for ($i = 0; $i < $zip->numFiles; $i++) {
				$files[] = $zip->getNameIndex($i);		
			}
		}
	}
	return $files;
}

function getPclZipFilesList($file){
	$files = array();
	define('PCLZIP_TEMPORARY_DIR',  APP_ROOT. '/updates');
	include_once(APP_ROOT.'/includes/pclzip.php');
	$zip = new PclZip($file);
	$detailedFileList = $zip->listContent();
	foreach($detailedFileList as $fileDetails){
		$files[] = $fileDetails['filename'];
	}
	return $files;
} 


function checkFilesWritable($files){//used only for update
	$total = $writable = $nonWritable = 0;
	if(!empty($files) && is_array($files)){
		$total = count($files);
		foreach($files as $file){
			$absFilePath = APP_ROOT.'/'.$file;
			if(isWritableTry($absFilePath, true)){
				$writable++;
			}
			else{
				$nonWritable++;
				echo 'File/Folder <br>"'.$absFilePath.'" is not writable..';
			}				
		}
		if($total > 0 && $total == $writable){
			return true;
		}
	}
	return false;
}


function copyDir( $source, $target, $ignoreDirList) {
	if ( is_dir( $source ) ) {
		@mkdir( $target );
		$d = dir( $source );
		while ( FALSE !== ( $entry = $d->read() ) ) {
			if ( $entry == '.' || $entry == '..' ) {
				continue;
			}
			$item = $source . '/' . $entry; 
			if ( is_dir( $item ) ) {
				if(!in_array($item, $ignoreDirList)){
					copyDir( $item, $target . '/' . $entry, $ignoreDirList );					
				}
				continue;
			}
			copy( $item, $target . '/' . $entry );
		}
 
		$d->close();
	}else {
		copy( $source, $target );
	}
}

function protocolRedirect(){

	if(APP_HTTPS == 1 && $_SERVER['HTTPS'] != 'on'){
		header('Location: '.APP_URL);	
	}
	elseif(APP_HTTPS == 0 && $_SERVER['HTTPS'] == 'on'){
		header('Location: '.APP_URL);
	}
}

function checkOpenSSL(){
			
	if(!function_exists('openssl_verify')){
		return false;
	}
	else{
		$key = @openssl_pkey_new();
		@openssl_pkey_export($key, $privateKey);
		$privateKey	= base64_encode($privateKey);
		$publicKey = @openssl_pkey_get_details($key);
		$publicKey 	= $publicKey["key"];
		
		if(empty($publicKey) || empty($privateKey)){
			return false;
		}
	}
	return true;
}

function getFilePerms($file){
	return @substr(@sprintf('%o', @fileperms($file)), -4);
}

function setFilePerms($file, $chmod){
	return @chmod($file, $chmod);
}

function getFileExt($file){
	$pos = strrpos($file, '.');
	if($pos !== false){
		return substr($filem, $pos+1);
	}
	return '';
}

function isWritableTry($file, $restorePrems=false){
	if(!is_writable($file)){
		if($restorePrems){
			isset($_SESSION['restorePrems']) ? '' : $_SESSION['restorePrems'] = array();
			$_SESSION['restorePrems'][$file] = getFilePerms($file);
		}
		if(is_file($file)){
			$prems = 0666;
			if(getFileExt($file) == 'php'){ $prems = 0644; }
			setFilePerms($file, $prems);
		}
		elseif(is_dir($file)){
			$prems = 0777;
			setFilePerms($file, $prems);
		}
		else{
			//it might be new dir, so check perms for parent directory
			unset($_SESSION['restorePrems'][$file]);		
			
			$dir = $file;
			do{
				$dir = dirname($dir);
			}while(!is_dir($dir) && strlen($dir) >= strlen(APP_ROOT));
			
			if(strlen($dir) < strlen(APP_ROOT)){
				//this case shouldnt come	
				return true;
			}
			$file = $dir;		
		}
		return is_writable($file);
	}
	return true;	
}

function restorePerms(){
	
	if(empty($_SESSION['restorePrems']) || !is_array($_SESSION['restorePrems'])){ return false; }
	
	foreach($_SESSION['restorePrems'] as $file => $perms){
		setFilePerms($file, intval($perms, 8));
		unset($_SESSION['restorePrems'][$file]);
	}
	
}
   
?>