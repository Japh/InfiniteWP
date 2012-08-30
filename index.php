<?php

/************************************************************
 * InfiniteWP Admin panel									*
 * Copyright (c) 2012 Revmakx								*
 * www.revmakx.com											*
 *															*
 ************************************************************/

include("includes/app.php");
installFolderAlert();
?>
<?php
$mainJson = json_encode(panelRequestManager::getSitesUpdates());
$toolTipData = json_encode(panelRequestManager::getUserHelp());
$favourites =  json_encode(panelRequestManager::getFavourites());
$sitesData = json_encode(panelRequestManager::getSites());
$groupData = json_encode(panelRequestManager::getGroupsSites());
$updateAvailable = json_encode(checkUpdate(false, false));
$updateAvailableNotify = json_encode(panelRequestManager::isUpdateHideNotify());
$totalSettings =  json_encode(array("data"=>panelRequestManager::requiredData(array("getSettingsAll"=>1))));
$fixedNotifications = json_encode(getNotifications(true));

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="robots" content="noindex">
<title>InfiniteWP</title>
<link href='https://fonts.googleapis.com/css?family=Droid+Sans:400,700' rel='stylesheet' type='text/css'>
<link rel="stylesheet" href="css/core.css?<?php echo APP_VERSION; ?>" type="text/css" />
<link rel="stylesheet" href="css/dropkick.css?<?php echo APP_VERSION; ?>" type="text/css" />
<link rel="stylesheet" href="css/datepicker.css?<?php echo APP_VERSION; ?>" type="text/css" />
<link rel="stylesheet" href="css/nanoscroller.css?<?php echo APP_VERSION; ?>" type="text/css" />
<link rel="stylesheet" href="css/jPaginator.css?<?php echo APP_VERSION; ?>" type="text/css" media="screen"/>
<link rel="stylesheet" href="css/jquery-ui.css?<?php echo APP_VERSION; ?>" type="text/css" media="all" />
<link rel="stylesheet" href="css/jquery.qtip.css?<?php echo APP_VERSION; ?>" type="text/css" media="all" />
<link rel="shortcut icon" href="images/favicon.png" type="image/x-icon"/>
<!--[if lt IE 9]>
	<link rel="stylesheet" type="text/css" href="css/ie8nlr.css?<?php echo APP_VERSION; ?>" />
<![endif]-->
<script src="js/jquery.min.js?<?php echo APP_VERSION; ?>" type="text/javascript" charset="utf-8"></script>
<script src="js/jquery-ui.min.js?<?php echo APP_VERSION; ?>" type="text/javascript"></script>
<script src="js/jquery.dropkick-1.0.0.js?<?php echo APP_VERSION; ?>" type="text/javascript" charset="utf-8"></script>
<script src="js/fileuploader.js?<?php echo APP_VERSION; ?>" type="text/javascript"></script>
<script src="js/apps.js?<?php echo APP_VERSION; ?>" type="text/javascript" charset="utf-8"></script>
<script src="js/load.js?<?php echo APP_VERSION; ?>" type="text/javascript" charset="utf-8"></script>
<script src="js/jPaginator-min.js?<?php echo APP_VERSION; ?>" type="text/javascript"></script>
<script src="js/jquery.qtip.js?<?php echo APP_VERSION; ?>" type="text/javascript"></script>
<script src="js/jquery.mousewheel.js?<?php echo APP_VERSION; ?>" type="text/javascript"></script>
<script>
var systemURL = "<?php echo APP_URL;?>";
var serviceURL = "<?php echo getOption('serviceURL');?>";
var appVersion = "<?php echo APP_VERSION; ?>";
var appInstallHash = "<?php echo APP_INSTALL_HASH; ?>";
var mainJson = <?php echo $mainJson?>;
var sitesjson = mainJson.siteView;
var pluginsjson = mainJson.pluginsView.plugins;
var themesjson = mainJson.themesView.themes;
var wpjson = mainJson.coreView.core;
var toolTipData = <?php echo $toolTipData;?>;
var favourites = <?php echo $favourites; ?>;
var site = <?php echo  $sitesData;?>;
var group = <?php echo  $groupData;?>;
var totalSites = getPropertyCount(site);
var totalGroups = getPropertyCount(group);
var totalUpdates =  getPropertyCount(mainJson);
var updateAvailable   = <?php echo $updateAvailable;?>;
var updateAvailableNotify=<?php echo $updateAvailableNotify;?>;
var fixedNotifications = <?php echo $fixedNotifications;?>;
var settingsData = <?php echo $totalSettings;?>;
    // a workaround for a flaw in the demo system (http://dev.jqueryui.com/ticket/4375), ignore!
</script>
<script type="text/javascript" src="js/init.js?<?php echo APP_VERSION; ?>" charset="utf-8"></script>
<script type="text/javascript" src="js/jquery.nanoscroller.min.js?<?php echo APP_VERSION; ?>"></script>
<script type="text/javascript" src="js/ga.js?<?php echo APP_VERSION; ?>"></script>
<script type="text/javascript" src="js/datepicker.js?<?php echo APP_VERSION; ?>"></script>
<script type="text/javascript" src="js/eye.js?<?php echo APP_VERSION; ?>"></script>
<script type="text/javascript" src="js/utils.js?<?php echo APP_VERSION; ?>"></script>
<script type="text/javascript" src="js/layout.js?<?php echo APP_VERSION; ?>"></script>

</head>

<body>
<div class="notification_cont">
	
</div>
<div id="fb-root"></div>
<div id="updateOverLay" style='display:none;-ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=70)"; background-color:#000; opacity:0.7;position:fixed;top: 0;left: 0;width: 100%;height: 100%; z-index:1020'></div>
<div id="loadingDiv" style="display:none">Loading...</div>
<div id="modalDiv"></div>

<!--<div class="overlay_test"></div>-->
<div id="site_cont">
  <div id="header_bar"> <a href="" style="text-decoration:none;">
    <div id="logo"></div>
    <div id="admin_panel_label">Admin Panel v<?php echo APP_VERSION; ?></div>
    </a>
    <a class="float-left fb_icon_hdr" href="https://www.facebook.com/infinitewp" target="_blank"></a><a class="float-left twitter_icon_hdr" href="https://twitter.com/infinitewp" target="_blank"></a>
    <ul id="header_nav">
      <!--<li><a href="">Suggest an Idea</a></li>-->
      <li><a class="updates_centre" id="updateCentreBtn">IWP Update Centre<span id="updateCenterCount" style="display:none">1</span></a>
      	
        <div id="updates_centre_cont" style="display:none">
          
            
          <div class="th rep_sprite" style="border-top: 1px solid #C1C4C6; height: 38px; border-bottom: 0;">
            <div class="btn_action float-right"><a class="rep_sprite" id="updateActionBtn">Check Now</a></div>
            
          </div>
        </div>
      </li>
       <li><a href="http://www.google.com/moderator/#16/e=1f9ff1" target="_blank">Got an idea?</a></li>
      <li class="help"><a>Help <span style="font-size:7px;">▼</span></a>
      	<ul class="sub_menu_ul">
        	<li><a href="http://infinitewp.com/forum/" target="_blank">Discussion Forum</a></li>
            <li><a href="javascript:loadReport('',1)">Report Issue</a></li>
            <li><a class="takeTour">Take the tour</a></li>
        </ul>
      </li>
      <li><a href="login.php?logout=now" class="logout">Logout</a></li>
      <li class="settings" id="mainSettings">
        <div id="settings_btn"></div>
        <div id="settings_cont" style="display:none">
          <div class="th rep_sprite">
            <ul class="btn_radio_slelect float-right">
              <li><a class="active rep_sprite optionSelect settingsButtons" item='appSettingsTab'>App Settings</a></li>
              <li><a class="rep_sprite optionSelect settingsButtons"  item='settingsTab'>Account Settings</a></li>
            </ul>
          </div>
          <div class="form_cont settings settingsItem" id="settingsTab" style="border:0; display:none; padding:0;">
            <div style="padding:10px;">
              <div class="tr no_border">
                <div class="tl">EMAIL</div>
                <div class="td">
                  <div class="valid_cont">
                    <input name="" type="text" id="email"  class="hidedit rep_sprite_backup triggerSettingsButton emailEdit" value="samplemail@domain.com">
                    <div class="valid_error" style="top: 16px; height: 14px; right: 37px;">
                      <div class="padding"></div>
                    </div>
                  </div>
                  <div class="rep_sprite_backup edit editEmail"></div>
                </div>
                <div class="clear-both"></div>
              </div>
              <div class="tr no_border">
                <div class="tl"></div>
                <div class="td"> <a id="change_pass_btn">Change Password</a>
                  <div class="change_pass_cont" id="changePassContent" style="display:none">
                    <div class="clear-both"></div>
                    <div class="valid_cont">
                      <input name="" type="text" class="triggerSettingsButton passwords" id="currentPassword" value="Current Password" onfocus="if(this.value=='Current Password'){this.value=''; this.style.color='#676C70';}  else { this.style.color='#676C70'; this.select(); };" onblur="if(this.value==''){ this.value='Current Password'; this.style.color='#ccc'; }" style="color:#ccc;"  />
                      <div class="valid_error">
                        <div class="padding"></div>
                      </div>
                    </div>
                    <div class="valid_cont">
                      <input name="" type="text"  id="newPassword" class="triggerSettingsButton passwords" value="New Password" onfocus="if(this.value=='New Password'){this.value=''; this.style.color='#676C70';}  else { this.style.color='#676C70'; this.select(); };" onblur="if(this.value==''){ this.value='New Password'; this.style.color='#ccc'; }"  style="color:#ccc;"    />
                      <div class="valid_error">
                        <div class="padding"></div>
                      </div>
                    </div>
                    <div class="valid_cont">
                      <input name="" type="text"  id="newPasswordCheck"  class="triggerSettingsButton passwords" value="New Password Again" onfocus="if(this.value=='New Password Again'){this.value=''; this.style.color='#676C70';}  else { this.style.color='#676C70'; this.select(); };" onblur="if(this.value==''){ this.value='New Password Again'; this.style.color='#ccc'; }"  style="color:#ccc;"    />
                      <div class="valid_error">
                        <div class="padding"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="clear-both"></div>
              </div>
            </div>
            <div class="tr">
              <div class="padding">
                <div class="label" style="margin-bottom: 10px;">EMAIL NOTIFICATIONS<a class="test_mail rep_sprite_backup" id="sendTestEmail">Send test email</a></div>
                <div class="tl no_text_transform">Notify about <span>updates to</span></div>
                <div class="td">
                  <ul class="checkbox_cont">
                    <li><a class="checkbox generalSelect" id="notifyPlugins">Plugins</a></li>
                    <li><a class="checkbox generalSelect" id="notifyThemes">Themes</a></li>
                    <li><a class="checkbox generalSelect" id="notifyWordpress">Wordpress</a></li>
                  </ul>
                </div>
                <div class="clear-both"></div>
                <div class="tl no_text_transform">Email me every</div>
                <div class="td">
                  <ul class="btn_radio_slelect float-left" style="margin-left:10px;">
                    <li><a class="rep_sprite optionSelect emailFrequency" id="emailDaily" def="daily">Day</a></li>
                    <li><a class="rep_sprite optionSelect emailFrequency" id="emailWeekly" def="weekly">Week</a></li>
                    <li><a class="rep_sprite  optionSelect emailFrequency" id="emailNever" def="never">Never</a></li>
                  </ul>
                </div>
                <div class="clear-both"></div>
                <div class="tl no_text_transform" style="width:475px;"><div class="rep_sprite_backup info_icon">You have to set a cron job for this to work. (suggested timing: every 1 hr)</div><div class="clear-both"></div><div style="text-align:left; padding-left:50px;"><span class="droid700">php <?php echo APP_ROOT; ?>/cron.php</span></div></div>
                <div class="clear-both"></div>
              </div>
            </div>
          </div>
          <div class="app_settings settingsItem" id="appSettingsTab" >
            <div class="tr">
              <div class="padding ip">
                <div class="left" id="IPContent">
                  <div class="label">ALLOW ACCOUNT ACCESS FROM THESE IP<span>s</span> ONLY</div>
                </div>
                <div class="right"> Your current IP is <span class="droid700"><?php echo $_SERVER['REMOTE_ADDR']; ?></span>
                  <input name="" type="text" class="add_ip float-left" value="xxx.xxx.xxx.xxx"   id="tempIP" onfocus="if(this.value=='xxx.xxx.xxx.xxx'){this.value=''; this.style.color='#676C70';}  else { this.style.color='#676C70'; this.select(); };" onblur="if(this.value==''){ this.value='xxx.xxx.xxx.xxx'; this.style.color='#ccc'; }" style="color:#ccc;"  >
                  <div class="btn_add_ip rep_sprite float-left user_select_no" id="addIP">Add IP</div>
                </div>
                <div class="clear-both"></div>
              </div>
            </div>
            <div class="tr">
              <div class="padding">
                <div class="label">MAX SIMULTANEOUS READ / WRITE REQUESTS PER IP</div>
                <div class="slider_cont">
                  <input type="text" id="amount01" class="value_display" onfocus="this.blur();" />
                  <div class="slider_stroke">
                    <div id="slider-range01">
                      <div class="slider01_calib_cont">
                        <div class="calib">30</div>
                        <div class="calib">20</div>
                        <div class="calib" style="width: 140px;">10</div>
                        <div class="calib" style="width: 123px;">1</div>
                      </div>
                    </div>
                  </div>
                  <div class="clear-both"></div>
                </div>
              </div>
            </div>
            <div class="tr">
              <div class="padding">
                <div class="label">MAX SIMULTANEOUS REQUESTS FROM THIS SERVER <span>(IN WHICH IWP IS INSTALLED)</span></div>
                <div class="slider_cont">
                  <input type="text" id="amount02" class="value_display" onfocus="this.blur();" />
                  <div class="slider_stroke slider02">
                    <div id="slider-range02">
                      <div class="slider02_calib_cont">
                        <div class="calib">100</div>
                        <div class="calib">50</div>
                        <div class="calib" style="width: 175px;">10</div>
                      </div>
                    </div>
                  </div>
                  <div class="clear-both"></div>
                </div>
              </div>
            </div>
            <div class="tr">
              <div class="padding">
                <div class="label">TIME DELAY BETWEEN REQUESTS TO WEBSITES ON THE SAME IP <span>(milli-seconds)</span></div>
                <div class="slider_cont">
                  <input type="text" id="amount03" class="value_display" onfocus="this.blur();" />
                  <div class="slider_stroke slider02">
                    <div id="slider-range03">
                      <div class="slider03_calib_cont">
                        <div class="calib">1000</div>
                        <div class="calib">500</div>
                        <div class="calib" style="width: 196px;">0</div>
                      </div>
                    </div>
                  </div>
                  <div class="clear-both"></div>
                </div>
              </div>
            </div>
            <div class="tr">
              <div class="checkbox active" id="sendAnonymous">Send anonymous usage information to improve IWP.</div>
            </div>
          </div>
          <div class="th_sub rep_sprite" style="border-top:1px solid #c1c4c6;">
            <div class="success rep_sprite_backup float-left" id="saveSuccess" style="display:none">Saved successfully!</div>
            <div class="btn_action float-right"><a class="rep_sprite" id="saveSettingsBtn" page="appSettingsTab">Save Changes</a></div>
            <a class="cancel_save float-right">cancel</a> </div>
        </div>
      </li>
    </ul>
    <div class="clear-both"></div>
  </div>
  <div id="main_cont">
    <ul id="site_nav">
      <li><a class="navLinkUpdate navLinks optionSelect" page="updates"><span class="float-left">Updates</span><span class="update_count float-left droid700" id="totalUpdateCount">0</span></a></li>
      <li><a class="navLinks optionSelect" page="items">Plugins & Themes</a></li>
      <li><a class="navLinks optionSelect" page="backups">Backups</a></li>
      <li><a class="navLinks optionSelect" page="history">Activity Log</a></li>
    </ul>
    <div class="btn_reload rep_sprite"><a class="rep_sprite_backup user_select_no" id="reloadStats">Reload Data</a></div>
    <div class="clear-both"></div>
    <hr class="dotted" />
    <div id="pageContent">
      <div class="empty_data_set welcome">
        <div class="line1">Hey there. Welcome to InfiniteWP.</div>
        <div class="line2">Lets now manage Wordpress, the IWP way!</div>
        <div class="line3">
          <div class="welcome_arrow"></div>
          Add a Wordpress site to IWP.<br />
          <span style="font-size:12px">(Before adding the website please install and activate InfiniteWP Client Plugin in your wordpress site)</span> </div>
        <a href="http://www.youtube.com/watch?v=q94w5Vlpwog" target="_blank">See How</a>. </div>
    </div>
  </div>
</div>
<div id="bottom_toolbar" class="siteSearch">
  <div id="activityPopup"> </div>
</div>
<div class="social_love"><div style="margin-bottom:10px;"><a class="fb_share" target="_blank" href="https://www.facebook.com/sharer.php?u=http%3a%2f%2finfinitewp.com%3futm_source%3diwp%26utm_medium%3dfacebook%26utm_campaign%3dinapp"></a></div> 
<div class="clear-both"></div>
<div style="margin-bottom:10px;"><a href="https://twitter.com/intent/tweet?text=Manage%20multiple%20Wordpress%20sites%20from%20your%20own%20server.%20And%20its%20free!&url=http%3A%2F%2Finfinitewp.com%3Futm_source%3Diwp%26utm_medium%3Dtwitter%26utm_campaign%3Dinapp&via=infinitewp&related=infinitewp" class="twitter-share-button" data-related="infinitewp" data-lang="en" data-size="small" data-count="none">Tweet</a></div>
<div class="clear-both"></div>
<g:plusone size="tall" annotation="none" href="http://infinitewp.com?utm_source=iwp&utm_medium=gplus&utm_campaign=inapp"></g:plusone></div>
<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");

  (function() {
    var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
    po.src = 'https://apis.google.com/js/plusone.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
 
  })();

</script>
</body>
</html>
<?php 
callURLAsync(APP_URL.EXECUTE_FILE, array('runOffBrowserLoad' =>  'true'));	
?>