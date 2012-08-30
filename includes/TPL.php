<?php 

/************************************************************
 * InfiniteWP Admin panel									*
 * Copyright (c) 2012 Revmakx								*
 * www.revmakx.com											*
 *															*
 ************************************************************/
 
class TPL{
	
	private static $capture=array();

	public static function setTPL(){//before executing templates excute mysql_close and session_write_close
		$controller = Reg::get('controller');
		$action = Reg::get('action');
		include_once("controllers/".$controller.".php");
		if($action == 'add') $action = 'update';
		
		$tplFile = APP_ROOT.'/templates/'.$controller.'/'.$action.'.tpl.php';
		
		if(file_exists($tplFile)){
			return file_get_contents($tplFile);
		}
		else{
			$error = 404;	
			return  file_get_contents(APP_ROOT.'/templates/common/exception.tpl.php');
		}		
	}
	
	public static function get($file, $d=array()){
	
		$tplFile = APP_ROOT.'/templates/'.$file;
		
		if(file_exists($tplFile)){
			ob_start();
			include($tplFile);
			$HTML = ob_get_clean();
			$HTML = preg_replace('/>\s+</', "><", $HTML);  
			return $HTML;
		}
		else{
			echo '<br><strong>TPL Error:</strong> File not found	('.$tplFile.')<br>';
		}	
	}
	
	public static function captureStart($name){
		ob_start();
	}
	
	public static function captureStop($name){
		self::$capture[$name] = ob_get_clean();
	}
	
	public static function captureGet($name){
		return self::$capture[$name];
	}
}

?>