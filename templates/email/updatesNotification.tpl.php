<?php

/************************************************************
 * InfiniteWP Admin panel									*
 * Copyright (c) 2012 Revmakx								*
 * www.revmakx.com											*
 *															*
 ************************************************************/

$showUpdate = $d['updatesNotificationMail']; 
$siteView = $d['sitesUpdates']['siteView'];
$updateNotificationDynamicContent = $d['updateNotificationDynamicContent'];

//subject starts here
if(empty($siteView)){ ?>InfiniteWP | Everything is up to date.<?php } else { ?>InfiniteWP | New updates available.<?php }

//subject ends here
echo '+-+-+-+-+-+-+-+-+-+-+-+-+-updatesNotificationsMail+-+-+-+-+-+-+-+-+-+-+-';

//message starts here

?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title></title>
<style></style>
</head>

<body bgcolor="#dce1e3" style="padding:0; margin:0; font-family:Arial, Helvetica, sans-serif; font-size:12px; color:#555;">
<div style="background:#dce1e3;">
  <table bgcolor="#FFFFFF" background="http://infinitewp.com/<?php echo APP_URL; ?>images/email/mail/bg.gif" width="600" border="0" cellspacing="0" cellpadding="0" style="border-collapse:collapse; margin:auto; border-bottom:2px solid #1d292c;">
    <tr style="width:600px; height:35px; background:#1d292c;">
      <td><div style="width:90px; height:13px; float:left; margin:10px; color:#fff; border:1px solid #1d292c; font-family:Arial, Helvetica, sans-serif; font-size:12px; font-weight:bold;">INFINITE<span style="color:#f2583e;">WP</span></div></td>
      <td><div style="font-family:Arial, Helvetica, sans-serif; font-size:11px; text-transform:uppercase; float:right; padding:10px; color:#fff; font-weight:bold; letter-spacing:0.5px;">MULTIPLE WORDPRESS MANAGEMENT</div></td>
    </tr>
    
    <tr>
      <td colspan="2"><table width="100%" border="0" cellpadding="0" cellspacing="0">
        <tr>
          <td width="11%" align="center" valign="top"><div style="background:url(<?php echo APP_URL; ?>images/email/emailer_weekly_ribbon.png) no-repeat; width:49px; height:72px; margin-top: -1px; margin-left: 10px;"><div style="color:#956e05; font-size:28px; font-weight:bold; letter-spacing:-2px; text-align:center; padding-right: 4px; padding-top: 7px; text-shadow: 0 1px 1px #ffd461;"><?php echo @date("j", time()); ?></div><div style="color:#956e05; font-size:14px; text-align:center; text-transform:uppercase; margin-top: -6px; text-shadow: 0 1px 1px #ffd461;"><?php echo @date("M", time()); ?></div></div></td>
          <td width="89%" style="padding-left:10px; padding-right:20px;"><div style="padding: 16px 0 16px;"><span style="color: #414A4E; font-size: 16px; font-weight: bold; letter-spacing: 2px; text-rendering: optimizelegibility; float:left; padding-top: 6px;">UPDATES NOTIFICATION</span> <a href="<?php echo APP_URL; ?>"> <img src="<?php echo APP_URL; ?>images/email/btn_open_admin.png" alt="OPEN ADMIN PANEL" style="width:137px; height:29px; display:inline-block; float:right; border:0;" /></a> <div style="clear:both;"></div></div>
          
  <?php 
 
 
 if(empty($siteView)){ ?>
      <table width="100%" border="0" cellspacing="50" style="border-top:1px solid #cdcdcd;">
      <tr>
      <td align="center"><img src="<?php echo APP_URL; ?>images/email/up_to_date.png" width="215" height="200" alt="Everything is up to date." /></td>
      </tr>
     </table>
<?php  }
else{
	
	$siteIDs = array_keys($siteView);
  	$sitesName = DB::getFields("?:sites", "name, siteID", "siteID IN (".implode(",",$siteIDs).")", "siteID");
	
    foreach($siteView as $siteID => $updateData){
		?> 
        
         <table width="100%" border="0" cellspacing="10" style="border-top:1px solid #cdcdcd;margin-bottom:10px;">
		<?php
?>
  <tr>
    <td colspan="2"><div style="padding-bottom: 10px; margin-left: -10px;"><a href="<?php echo $sitesName[$siteID]; ?>" style="color:#465053; font-size:13px; font-weight:bold; text-decoration:none;"><?php echo $sitesName[$siteID]; ?></a></div></td>
    </tr>
    
    <?php if(!empty($showUpdate['coreUpdates']) && !empty($updateData['core'])){
		foreach($updateData['core'] as $type => $update){
		 ?>
   <tr>
    <td width="130" align="right" valign="top"><img src="<?php echo APP_URL; ?>images/email/tag_wp.png" width="77" height="17" alt="wordpress" /></td>
    <td width="340"><?php echo $update['current']; ?></td>
  </tr>
  <?php } }
  ?>
  
   <?php if(!empty($showUpdate['pluginUpdates']) && !empty($updateData['plugins'])){ 
      $i = 0;
    foreach($updateData['plugins'] as $type => $update){ ?>

   <?php if($i == 0){ ?>
     <tr>
    <td width="130" align="right" valign="top" style="padding-top:10px;"><img src="<?php echo APP_URL; ?>images/email/tag_plugins.png" width="62" height="17" alt="plugins" /></td>
    <td width="340" style="padding-top:10px;"><?php echo $update['name']; ?></td>
  </tr>
 <?php $i = 1; } 
   else{ ?>
  <tr>
    <td align="right" valign="top">&nbsp;</td>
    <td><?php echo $update['name']; ?></td>
  </tr><?php }
    } 
  } ?>
  
  
   <?php if(!empty($showUpdate['themeUpdates']) && !empty($updateData['themes'])){
   $i = 0;
    foreach($updateData['themes'] as $type => $update){ ?>
 
  <?php if($i == 0){ ?>
   <tr>
    <td width="130" align="right" valign="top" style="padding-top:10px;"><img src="<?php echo APP_URL; ?>images/email/tag_themes.png" width="62" height="17" alt="themes" /></td>
    <td width="340" style="padding-top:10px;"> <?php echo $update['name'];  ?></td>
  </tr>
  <?php $i = 1; } 
   else{ ?>
  <tr>  
    <td align="right" valign="top">&nbsp;</td>
    <td><?php echo $update['name']; ?></td>
  </tr>
  <?php }
     } 
	} ?>
     </table>
 <?php }
 
} ?>         
       </td>
        </tr>
      </table></td>
    </tr>
    <tr>
      <td colspan="2">
      	<table border="0">
          <tr>
            <td><?php if(!empty($updateNotificationDynamicContent)){ echo $updateNotificationDynamicContent; }else{ ?>&nbsp;<?php } ?></td>
          </tr>
        </table>
	  </td>
    </tr>
  </table>  
</div>
</body>
</html>