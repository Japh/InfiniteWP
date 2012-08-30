<?php 
#Show Error
define('APP_SHOW_ERROR', true);

ini_set('display_errors', (APP_SHOW_ERROR) ? 'On' : 'Off');
error_reporting(E_ALL & ~E_NOTICE & ~E_STRICT);
define('SHOW_SQL_ERROR', APP_SHOW_ERROR);

define('APP_VERSION', '');
define('APP_INSTALL_HASH', '');

define('APP_ROOT', '');
define('APP_DOMAIN_PATH', '');
define('APP_HTTPS', 0);//1 => HTTPS on, 0 => HTTPS off

$APP_URL = 'http'.(APP_HTTPS == 1 ? 's' : '').'://'.APP_DOMAIN_PATH;
define('APP_URL', $APP_URL);


define('EXECUTE_FILE', 'execute.php');
define('DEFAULT_MAX_CLIENT_REQUEST_TIMEOUT', 180);//Request to client wp

$config = array();
$config['SQL_DATABASE'] = '';
$config['SQL_HOST'] = 'localhost';
$config['SQL_USERNAME'] = '';
$config['SQL_PASSWORD'] = '';
$config['SQL_PORT'] = '3306';
$config['SQL_TABLE_NAME_PREFIX'] = '';

define('SQL_DRIVER', 'mysqli');

session_name ('adminPanel');

$timezone = ini_get('date.timezone');
if ( empty($timezone) && function_exists( 'date_default_timezone_set' ) ){
	@date_default_timezone_set( @date_default_timezone_get() );
}

?>