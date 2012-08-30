<?php
/************************************************************
 * InfiniteWP Admin panel									*
 * Copyright (c) 2012 Revmakx								*
 * www.revmakx.com											*
 *															*
 ************************************************************/
 
$timeStart = microtime(true);
define('IS_AJAX_FILE', true);
require('includes/app.php');

panelRequestManager::handler($_REQUEST);


?>