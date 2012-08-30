<?php
/************************************************************
 * InfiniteWP Admin panel									*
 * Copyright (c) 2012 Revmakx								*
 * www.revmakx.com											*
 *															*
 ************************************************************/
?>
<?php  $sitesData = Reg::tplGet('sitesData'); ?>
<div class="dialog_cont view_backup">
  <div class="th rep_sprite">
    <div class="title droid700">BACKUPS - <?php echo $sitesData[$d['siteID']]['name'] ?></div>
    <a class="cancel rep_sprite_backup">cancel</a></div>
  <?php 
  if(!empty($d['siteBackups'])){
  foreach($d['siteBackups'] as $siteBackup){ ?>
  <div class="item_ind float-left topBackup">
  	<div class="backup_name stats"><?php echo $siteBackup['backupName']; ?></div>
    <div class="rep_sprite_backup stats files delConfHide"><?php if($siteBackup['what'] == 'full'){ ?>Files + DB<?php } elseif($siteBackup['what'] == 'db'){ ?>DB<?php }?></div>
    <div class="rep_sprite_backup stats size delConfHide"><?php echo $siteBackup['size']; ?></div>
    <div class="rep_sprite_backup stats time delConfHide"><?php echo @date(Reg::get('dateFormatLong'), $siteBackup['time']); ?></div>
    <div class="row_backup_action rep_sprite" style="float:right;"><a class="trash rep_sprite_backup removeBackup" sid="<?php echo $siteBackup['siteID']; ?>" referencekey="<?php echo $siteBackup['referenceKey']; ?>"></a><div class="del_conf" style="display:none;"><div class="label">Sure?</div><div class="yes deleteBackup">Yes</div><div class="no deleteBackup">No</div></div></div>
    <div class="row_backup_action rep_sprite delConfHide" style="float:right;"><a class="download rep_sprite_backup" href="<?php echo $siteBackup['downloadURL']; ?>"></a></div>
    <div class="row_action float-left delConfHide"><a class="restoreBackup" sid="<?php echo $siteBackup['siteID']; ?>" referencekey="<?php echo $siteBackup['referenceKey']; ?>">Restore</a></div>
  </div>
  <?php }
  }
  else{ ?><div class="empty_data_set"><div class="line2">Looks like there are <span class="droid700">no backups here</span>. Create a <a sid="<?php echo $d['siteID']; ?>" id="singleBackupNow">Backup Now</a>.</div></div><?php }
  ?>
  <div class="clear-both"></div>
</div>
