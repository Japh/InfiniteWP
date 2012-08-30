  $(function () {
	  $.fn.qtip.zindex = 900;
	 $(".noClick").live('click',function(e) {
e.stopImmediatePropagation();
return false;
});
	
	  siteSelector();
 $("#bottom_toolbar").prepend('<div id="bottomToolBarSelector">'+bottomToolbarVar+'</div>');
	  $(".managePanel").prepend('<div class="siteSelectorContainer">'+siteSelectorVar+'</div>');
	  resetGroup();
	    
	    $(".toggle_manage_groups").qtip({id:"toggleGroupQtip",content: { text: 'Manage Groups' }, position: { my: 'bottom center', at: 'top center',  adjust:{ y: -6} }, show: { event: false, ready: true }, hide: false,  style: { classes: 'ui-tooltip-shadow ui-tooltip-dark',  tip: {  corner: true, width: 10, height:5} } });
		if(toolTipData.addSite!="true")
		$("#addWebsite").qtip({events: { hide: function(event, api) { tempArray={}; tempArray['requiredData']={}; valArray={}; valArray['addSite']=true; tempArray['requiredData']['updateUserhelp']= valArray; tempArray['requiredData']['getUserHelp']= 1;  doCall(ajaxCallPath,tempArray,'setTooltipData'); } }, id: 'addWebsiteQtip', content: { text: ' ', title: { text: 'Add your Wordpress sites here', button: true } }, position: { my: 'bottom center', at: 'top center', adjust:{ y: -7} }, show: { event: false, ready: true }, hide: false, style: { classes: 'ui-tooltip-shadow ui-tooltip-dark',  tip: {  corner: true, width: 10, height:5} } });
		if(toolTipData.adminPopup!="true")
		$(".showFooterSelector").qtip({id:"adminPopupQtip",events: { hide: function(event, api) { tempArray={}; tempArray['requiredData']={}; valArray={}; valArray['adminPopup']=true; tempArray['requiredData']['updateUserhelp']= valArray; tempArray['requiredData']['getUserHelp']= 1;  doCall(ajaxCallPath,tempArray,'setTooltipData'); } },  content: { text: ' ', title: { text: 'You can still access your other sites from here', button: true } }, position: { my: 'bottom left', at: 'top left', adjust:{ y: -7, x: 20} }, show: { event: false}, hide: true, style: { classes: 'ui-tooltip-shadow ui-tooltip-dark',  tip: {  corner: true, width: 10, height:5} } });
	
		
	
			if(toolTipData.reloadStats!="true")
			{
			
		$("#reloadStats").qtip({ events: { hide: function(event, api) { tempArray={}; tempArray['requiredData']={}; valArray={}; valArray['reloadStats']=true; tempArray['requiredData']['updateUserhelp']= valArray; tempArray['requiredData']['getUserHelp']= 1;  doCall(ajaxCallPath,tempArray,'setTooltipData'); } }, id: 'reloadStatsQtip', content: { text: ' ', title: {text: 'Fetch real time data from all websites', button: true } }, position: { my: 'right center', at: 'left center', adjust:{ x: -6} }, show: { event: false, ready: true }, hide: false, style: { classes: 'ui-tooltip-shadow ui-tooltip-dark',  tip: {  corner: true, width: 5, height:8} } });
			}
		
		$(".valid_error").hide();
updateCountRefresh();




$(".disabled").live('click',function() {
     return false;
    });
	$(".optionSelect").live('click',function() {
      if($(this).hasClass('active') && !$(this).hasClass('applyChangesCheck') )
	 return false;
    });
	
	$(".btn_action a").live('mousedown',function() {
     if(!$(this).hasClass('disabled'))	  
   $(this).addClass('pressed');
    }).live('mouseup',function() {
     if(!$(this).hasClass('disabled'))	  
   $(this).removeClass('pressed');
    });

	 /* $("body").delegate(".disabled", "click", function(){
     return false;
    });
	
	 $("body").delegate(".optionSelect", "click", function(){
     if($(this).hasClass('active') && !$(this).hasClass('applyChangesCheck') )
	 return false;
    });
	
	  $("body").delegate(".btn_action a", "mousedown", function(){
	if(!$(this).hasClass('disabled'))	  
   $(this).addClass('pressed');
    });
	$("body").delegate(".btn_action a", "mouseup", function(){
	if(!$(this).hasClass('disabled'))	
   $(this).removeClass('pressed');
    });*/

	

	
  
/* -------------	   -------------	   -------------	   -------------	   -------------	   -------------	   -------------	   -------------	   -------------	   -------------	   -------------	  */
	// Updates page
	
$(".all").live('click',function() {
selectorBind(this,'all');
});
$(".invert").live('click',function() {
selectorBind(this,'invert');

});
$(".none").live('click',function() {
selectorBind(this,'none');
});
$(".selectOption").live('click',function() {
	if(!$(this).hasClass('updating') && !$(this).hasClass('hidden') )
generalSelect(this,'',1);
});
$(".row_detailed").live('click',function() {
	return false;
});
$(".row_summary").live('click',function() {
	
//expandThis(this,'summary');
});
$(".rh").live('click',function() {
expandThis(this,'detailed');
});
$(".main_checkbox").live('click',function() {
	object=$(this).closest(".ind_row_cont");
generalSelect(object,'ind_row_cont',1);
return false;
});
$(".websites_view").live('click',function() {
optionSelect(this);
$(".updateTabs").hide();
$("#siteViewUpdateContent").show();
currentUpdatePage="siteViewUpdateContent";
if($("#siteViewUpdateContent .ind_row_cont").not(".hide,.hideVar").length<1 && !$("#siteViewUpdateContent .empty_data_set").not('hiddenCheck').is(":visible") && viewHiddenFlag==0)
{
$("#siteViewUpdateContent .hiddenCheck").show();
$(".status_ind_row_cont").addClass('disabled');
}
$(".hiddenCont","#siteViewUpdateContent").hide();
if($(".searchSiteUpdate").val()!='' && $(".searchSiteUpdate").val()!='type to filter') 
$(".searchSiteUpdate").keyup();
checkGeneralSelect('ind_row_cont');
});
$(".themes_view").live('click',function() {
optionSelect(this);
$(".updateTabs").hide();
$("#themeViewUpdateContent").show();
currentUpdatePage="themeViewUpdateContent";
if($("#themeViewUpdateContent .ind_row_cont").not(".hide,.hideVar").length<1 && !$("#themeViewUpdateContent .empty_data_set").not('hiddenCheck').is(":visible") && viewHiddenFlag==0)
{
$("#themeViewUpdateContent .hiddenCheck").show();
$(".status_ind_row_cont").addClass('disabled');
}
$(".hiddenCont","#themeViewUpdateContent").hide();

if($(".searchSiteUpdate").val()!='' && $(".searchSiteUpdate").val()!='type to filter') 
$(".searchSiteUpdate").keyup();
});
$(".plugins_view").live('click',function() {
optionSelect(this);
$(".updateTabs").hide();
$("#pluginViewUpdateContent").show();
currentUpdatePage="pluginViewUpdateContent";
$(".hiddenCont","#pluginViewUpdateContent").hide();
if($("#pluginViewUpdateContent .ind_row_cont").not(".hide,.hideVar").length<1 && !$("#pluginViewUpdateContent .empty_data_set").not('hiddenCheck').is(":visible") && viewHiddenFlag==0)
{
$("#pluginViewUpdateContent .hiddenCheck").show();
$(".status_ind_row_cont").addClass('disabled');
}
if($(".searchSiteUpdate").val()!='' && $(".searchSiteUpdate").val()!='type to filter') 
$(".searchSiteUpdate").keyup();
});
$(".wp_view").live('click',function() {
optionSelect(this);
$(".updateTabs").hide();
$("#WPViewUpdateContent").show();

currentUpdatePage="WPViewUpdateContent";
$(".hiddenCont","#WPViewUpdateContent").hide();
if($("#WPViewUpdateContent .ind_row_cont").not(".hide,.hideVar").length<1 && !$("#WPViewUpdateContent .empty_data_set").not('hiddenCheck').is(":visible") && viewHiddenFlag==0)
{
$("#WPViewUpdateContent .hiddenCheck").show();
$(".status_ind_row_cont").addClass('disabled');
}
if($(".searchSiteUpdate").val()!='' && $(".searchSiteUpdate").val()!='type to filter') 
$(".searchSiteUpdate").keyup();
});
$(".search_site").live('keyup',function() {
	
searchSites(this);
});
$(".searchSiteUpdate").live('keyup',function() {
	
searchSites(this,2);
});

$(".searchItems").live('keyup',function() {
	
searchSites(this,4);
});

// Generate Group

$('.select_group').dropkick({
  change: function (value, label) {
   filterByGroup(value,1);
  }
});

// Control the content via Group


/* -------------	   -------------	   -------------	   -------------	   -------------	   -------------	   -------------	   -------------	   -------------	   -------------	   -------------	  */
// Siteselector and bottom footer

	
	$(".nano").live('mousewheel',function(e, delta) {
object=this;
if($('.slider',object).css("top")=="0px" && delta>0)
cancelEvent(e);
bottomval=$(this).height()-$('.slider',object).height();
bottomval=bottomval+"px";
if($('.slider',object).css("top")==bottomval && delta<0)
cancelEvent(e);

});


	$(".input_type_filter").live('focus',function() {
		if(this.value=='type to filter' || this.value=='new group' || this.value=='eg. group1, group2'){this.value=''; this.style.color='#676C70';}  else { this.style.color='#676C70'; this.select(); };
	});
	$(".input_type_filter").live('blur',function() {
		if(this.value==''){ if($(this).attr('id')=='newgroup') this.value='new group';  else if ($(this).attr('id')=='groupText') this.value='eg. group1, group2'; else this.value='type to filter'; this.style.color='#AAAAAA'; };
	});


	
	
	
$(".ind_groups","#bottom_sites_cont").live('click',function() {
	if(!$(this).hasClass('error'))
	makeSelection(this,1,1);
});
$(".ind_sites").live('click',function() {
makeSelection(this,0,1);
});
$(".siteSelectorSelect").live('click',function() {
selection($(this).html().toLowerCase(),'website_cont');
});

$('.select_group').dropkick({
  change: function (value, label) {
   filterByGroup(value,1);
  }
});

$(".toggle_manage_groups").live('click',function() {
groupEdit(this);
});
$(".icon_close").live('click',function() {
resetGroup();
});
$(".btn_create_group").live('click',function() {
createGroup();
});
$(".showFooterSelector").live('click',function() {
showOrHide(this,'pressed','bottom_sites_cont','1');
return false;
});
/* -------------	   -------------	   -------------	   -------------	   -------------	   -------------	   -------------	   -------------	   -------------	   -------------	   -------------	  */

// Plugins/Themes install and manage page.

	  // Main page
	
	  $(".navLinks").live('click',function(e) {
if(!$("#joyRidePopup2").is(":visible"))
{

optionSelect(this);
processPage($(this).attr('page'));
}
});
  

	  
	  
	  // History page
	  $(".historyToolbar").live('click',function() {
showOrHide(this,'','historyQueue','');
});
	$(".historyItem").live('click',function() {
makeHistorySelection(this,"queue_cont");
return false;
});
	  
	  $(".fetchInstall").live('click',function() {
		//titleItem=activeItem.toTitleCase();
		//alert(titleItem);
return false;
});


	//pluginsListPanel('plugins','plugins');
	//loadInstallPanel();
	
	
$(".rh").live('click',function() {
expandThis(this,'detailed');
});
$(".actionButton").live('click',function() {
optionSelect(this,1);
applyChangesCheck('applyChangesCheck',2); // For Apply changes (shouldn't change the button content like update page)

});
$(".typeSelector").live('click',function() {
if(!$(this).hasClass('active'))
{
optionSelect(this);
activeItem=$(this).attr('utype');
$('.itemName').text(activeItem.toTitleCase());
$('.itemNameLower').text(activeItem.toLowerCase());
$('.itemUpper').text(activeItem.toUpperCase());
if($(".manage").hasClass('active'))
{
$(".manage").removeClass('active')
$(".manage").click();
}
if($(".install").hasClass('active'))
{
$(".install").removeClass('active')
$(".install").click();
}



}
});

$(".js_changes").live('click',function() {

applyChanges(this);
$(this).addClass('disabled');
removeActiveElements();
return false;
});

$(".favItems").live('click',function() {
	
makeSelection(this);
checkFavItems();
});

$(".favSearch").live('keyup',function() {

searchSites(this,'3');
});




$(".manage_websites_view").live('click',function() {
optionSelect(this);
pluginsListPanel('sites',activeItem);

});
$(".manage_themes_view").live('click',function() {
optionSelect(this);
pluginsListPanel('themes',activeItem);
});
$(".installFavourites").live('click',function() {
installFavourites();
});

$(".manage_plugins_view").live('click',function() {
optionSelect(this);
pluginsListPanel('plugins',activeItem);
  });
  $(".searchItem").live('click',function() {
	  $(this).addClass('disabled');
	  $(this).prepend('<div class="btn_loadingDiv"></div>');
	  tempArray={};
	  tempArray['requiredData']={};
	  valArray={};
	  valArray['type']=activeItem;
	  valArray['searchVar']=1;
	  valArray['searchItem']=$(".searchText").val();
	    tempArray['requiredData']['getWPRepositoryHTML']=valArray;
	  doCall(ajaxCallPath,tempArray,"ajaxRepositoryCall","json","none");

  });
  $(".searchVar").live('click',function() {
optionSelect(this);


if($(this).attr('dval')=='search')
{
	$(".wp_repository_cont").html('');
	$(".searchCont").show();
}
else
{
tempArray={};
	  tempArray['requiredData']={};
	  valArray={};
	  valArray['type']=activeItem;
	  valArray['searchVar']=0;
	  valArray['searchItem']=$(this).attr('dval');
	    tempArray['requiredData']['getWPRepositoryHTML']=valArray;

	  doCall(ajaxCallPath,tempArray,"ajaxRepositoryCall");

}

  });
 
 $(".installOptions").live('click',function() {
	 optionSelect(this);
	loadFunction=$(this).attr('function');
	if(loadFunction=='loadFavourites')
	$(".favOption").show();
	else
	$(".favOption").hide();
	returnVar=eval(loadFunction+"()");
	$(".installSubPanel").html(returnVar);
	if(loadFunction=="loadComputer")
	createUploader();
});
 $(".website_cont").live('click',function() {
	makeSelection(this);
	if(currentPage=="items")
	showItemOptions(this);
	else if(currentPage=="backups")
	showBackupOptions(this);
});

 $(".installItem").live('click',function() {
	 $(this).addClass('disabled');
	 $(this).text("Queued..");
	 if($(this).hasClass('multiple'))
	 {
		 installItems(this,'',1);
	 }
	 else
	installItems(this);
 return false;
  });
   
  
	  
	  $(".manage").live('click',function() {
		  $("#processType").text('MANAGE');
	
optionSelect(this);

$(".optionsContent").html('<div style="padding:10px 0;"> <div class="float-left" style="padding: 10px;"><span class="numSiteSelected">'+$(".website_cont.active",'.siteSelectorContainer').length+'</span> websites selected.</div> <div class="btn_action float-right fetchInstallCont"><a class="rep_sprite fetchInstall">Load <span class="itemName">'+activeItem.toTitleCase()+' </span></a></div> <div class="float-right"> <input name="" type="text" onenterbtn=".fetchInstall" class="fetchInstallTxt txt onEnter" style="width: 300px; height: 17px; margin: 5px;" /> </div> <div class="float-right" style="text-align:right; color:#737987; padding-top: 10px;"><span class="droid700" style="font-size:11px;">SEARCH <span class="itemName itemUpper">'+activeItem.toUpperCase()+'</span><br /> Leave blank to load all <span class="itemName">'+activeItem+'</span></div> <div class="clear-both"></div><div class="actionContent siteSearch" style="display:none;margin-top:10px "></div> </div>');
$(".optionsContent").addClass('result_block_noborder');
$(".advancedInstallOptions").hide();
});

$(".generalSelect").live('click',function() {
	makeSelection(this);
});
$(".update_single, .update_group").live('click',function() {
	return false;
});
  // Bottom toolbar
     $(".groupEditText").live('focus',function(e) {
		 if(!$(this).hasClass('focus'))
		$(this).blur();
   });
    $(".groupEditText.focus").live('blur',function(e) {
	
		groupNameArray[$(this).closest('.ind_groups').attr('gid')]=$(this).val();
		
		
		 $(this).removeClass('focus');
   });
   $(".editGroup").live('click',function() {
	   $(".save_changes").show();
	   closestVar=$(this).closest('.ind_groups');
	   $(".groupEditText",closestVar).addClass('focus').focus();
	   removeDeleteConf();
	   return false;
	   
   });
   $(".deleteConf").live('click',function() {
	   closestVar=$(this).closest('.ind_groups');
	   $(".del_conf").hide();
	   $(".ind_groups","#bottom_sites_cont").removeClass('error');
	   $(".del_conf",closestVar).show();
	   $(closestVar).addClass('error');
	   return false;
   });
   $(".deleteGroup").live('click',function() {
	     closestVar=$(this).closest('.ind_groups');
	   if($(this).hasClass('yes'))
	   {
	 
	   groupDeleteArray[$(closestVar).attr('gid')]=$(closestVar).attr('gid');
	   $(".js_sites","#bottom_sites_cont").removeClass('active');
	   groupChangeArray[$(closestVar).attr('gid')]= groupNameArray[$(closestVar).attr('gid')] = groupCreateArray[$(closestVar).attr('gid')] = '' ;
	    $(closestVar).fadeOut();
		$(".save_changes").show();
		if($(".ind_groups","#bottomToolBarSelector").length==0)
		$("#bottom_toolbar #bottom_sites_cont .list_cont .ind_sites a").css({'background-position': '-25px 0', 'padding': '11px 0 9px 5px','width': '255px'});
	   }
	   else
	   {
		     $(".del_conf",closestVar).hide();
			 $(closestVar).removeClass('error');
	   }
	return false;
   });
   // Add site
   

   $(".addSiteButton").live('click',function() {
	$("#addSiteErrorMsg").remove();
	   tempArray={};
	    tempArray['args']={};
	   tempArray['args']['params']={};
	   website=$("#websiteURL",".add_site.form_cont").val();
	 
	   username=$("#username",".add_site.form_cont").val();
	   groupText =$("#groupText",".add_site.form_cont").val();
	      activationKey =$("#activationKey",".add_site.form_cont").val();
	   
	   if(groupText=='eg. group1, group2')
	   groupText='';
	
	   groupIDs=groupSelected();
	   tempArray['action']='addSite';
	    tempArray['args']['params']['username']=username;
	    tempArray['args']['params']['URL']=website;
	    tempArray['args']['params']['groupsPlainText']=groupText;
	    tempArray['args']['params']['groupIDs']=groupIDs;
		tempArray['args']['params']['activationKey']=activationKey;
		tempArray['requiredData']={};
		tempArray['requiredData']['getGroupsSites']=1;
		tempArray['requiredData']['getSites']=1;
		tempArray['requiredData']['getSitesUpdates']=1;
		$(this).addClass('disabled');
		$(this).prepend('<div class="btn_loadingDiv left"></div>');
		
		doCall(ajaxCallPath,tempArray,"processAddSite","json","none");
	   
   });
   
     $(".js_addSite").live('click',function() {
		 makeSelection(this);
	 });
	 $('.select_group_toolbar').dropkick({
width: 148,
footer: true,
  change: function (value, label) {
   filterByGroup(this,value);
  }
  
});
$(".installFromComputer").live('click',function() {
	arrayCounter=0;
	URL={};
	testURL='';
	$(".installFileNames").each(function () {
	testURL=systemURL+"uploads/"+$(this).html();
	URL[arrayCounter]=testURL; arrayCounter++;
	});
	installItems('',URL,1);
	return false;
});
$("#installFromURLTxt").live('keyup',function () {
	if(validateZipURL($(this).val()))
	$("#installFromURL").removeClass('disabled');
	else
	$("#installFromURL").addClass('disabled');
});
$("#installFromURL").live('click',function() {
	URL=$("#installFromURLTxt").val();
	installItems('',URL);
	return false;
});


// Favorites 
$(".addToFavorites").live('click',function() {
   $(this).addClass('disabled');
   $(this).text('Favorite');
	tempArray={};
	tempArray['requiredData']={};
	valArray={};
	valArray['name']=$(this).attr('iname');
	valArray['URL']=$(this).attr('dlink');
	valArray['type']=$(this).attr('utype');
	tempArray['requiredData']['addFavourites']={};
	tempArray['requiredData']['addFavourites']=valArray;
	tempArray['requiredData']['getFavourites']=1;
	doCall(ajaxCallPath,tempArray,'reloadFavourites','json');
	
});
$(".hideItem").live('click',function() {
  return false;
	
});
//  Backup
$("#backupNow").live('click',function() {
	closestVar="#backupOptions";
	tempArray={};
	tempArray["args"]={};
	tempArray["args"]["params"]={};
	valArray={};
	parentClass='.create_backup';
	includeFolders=$("#includeFolders",parentClass).val();
	if($("#compression",parentClass).hasClass('active'))
	compression=1;
	else
	compression='';
	if($("#databaseOptimize",parentClass).hasClass('active'))
	databaseOptimize=1;
	else
	databaseOptimize='';
	excludeFiles=$("#excludeFiles",parentClass).val();
	if(excludeFiles=='eg., old-backup.zip, wp-content/old-backups')
	excludeFiles='';
	if($("#full",parentClass).hasClass('active'))
	what="full";
	else
	what="db";
	backupName=$("#backupName",parentClass).val();
	valArray['limit']=5;
	valArray['include']=includeFolders;
	valArray['disableCompression']=compression;
	valArray['optimizeDB']=databaseOptimize;
	valArray['exclude']=excludeFiles;
	valArray['what']=what;
	valArray['backupName']=backupName;
	tempArray["args"]["params"]["config"]=valArray;
	tempArray["args"]["params"]["action"]='now';
	if($(closestVar).hasClass('singleBackup'))
	{
	tempArray["args"]["siteIDs"]={};
	tempArray["args"]["siteIDs"][0]=$("#siteIDForBackup").html();
	}
	else
	tempArray["args"]["siteIDs"]=getSelectedSites();
	tempArray['action']='backup';
	doHistoryCall(ajaxCallPath,tempArray,"");
	$("#modalDiv").dialog("close");
	$("#modalDiv").html('');
	return false;
	
	
});
$(".backupType").live('click',function() {
	optionSelect(this);
	if($(this).attr('id')=="db")
	$("#backupDB").hide();
	else
	$("#backupDB").show();
});
btCheckFlag='';
btActiveCheck='';
$(".bottomSites").live('mouseenter',function() {
	var position = $(this).position();
	btCheckFlag=0;
	btActiveCheck=1;
	if(groupEditFlag==0)
	{
	if($('#bottomToolbarOptions').length != 0)
	$('#bottomToolbarOptions').remove();
	loadBottomToolbarOptions($(this).attr('sid'));
	topval=position.top-392;
	
	$("#bottomToolbarOptions").css("top",topval);
	}
	//alert(dump(position));
}).live('mouseleave',function() {
	btActiveCheck=0;
	setTimeout(function() {  if(btCheckFlag==0 && btActiveCheck==0  ) $("#bottomToolbarOptions").remove();  }, 50);
	
});
$("#bottomToolbarOptions").live('mouseenter',function() {
	btCheckFlag=1;
	return false;
}).live('mouseleave',function() {
$(this).remove();
});
$("#singleBackupNow").live('click',function() {
loadBackup('',$(this).attr('sid'));
});
$("#viewBackups").live('click',function() {
	tempArray={};
	tempArray['requiredData']={};
	tempArray['requiredData']['getSiteBackupsHTML']=$(this).attr('sid');
	doCall(ajaxCallPath,tempArray,"loadBackupPopup","json");
});
$(".removeBackup").live('click',function() {
	
	closestVar=$(this).closest('.item_ind');
	topVar=$(closestVar).closest('.topBackup')
	
	$(".delConfHide",closestVar).hide();
	
	$(topVar).addClass('del');
/*tempArray={};
tempArray['args']={};
	tempArray['action']='removeBackup';
	tempArray['args']['params']={};
	tempArray['args']['params']['taskName']='Backup Now';
		tempArray['args']['params']['resultID']=$(this).attr('referencekey');
	tempArray['args']['siteIDs']=[$(this).attr('sid')];
	
	doHistoryCall(ajaxCallPath,tempArray,"");*/
	
	
});
$(".restoreBackup").live('click',function() {
tempArray={};
tempArray['args']={};
	tempArray['action']='restoreBackup';
	tempArray['args']['params']={};
	tempArray['args']['params']['taskName']='Backup Now';
		tempArray['args']['params']['resultID']=$(this).attr('referencekey');
	tempArray['args']['siteIDs']=[$(this).attr('sid')];
	$(this).addClass('disabled');
	$(this).text('Queued..');
	doHistoryCall(ajaxCallPath,tempArray,"");
	return false;
	
	
});
$(".cancel").live('click',function() {
	$("#modalDiv").dialog('close');
});
$(".multiBackup").live('click',function() {
	//loadBackup(1);
});
$(".refreshData").live('click',function() {
	tempArray={};
	tempArray['requiredData']={};
	tempArray['requiredData']['getHistoryPageHTML']={};
	tempArray['requiredData']['getHistoryPageHTML']['dates']=$("#dateContainer").text();
	tempArray['requiredData']['getHistoryPageHTML']['page']=1;
	$("#dateContainer").attr('exactdate',$("#dateContainer").text());
	$("#widgetCalendar").height(0);
	state = !state;
	//alert(dump(tempArray));
	doCall(ajaxCallPath,tempArray,'loadHistoryPageContent');
	
});
 
$("#addWebsite").live('click',function() {
	//loadAddSite();
}).live('mousedown',function () { 
 $(this).addClass('pressed');
}).live('mouseup',function () { 
$(this).removeClass('pressed');
});
$(".row_backup_action,.checkbox,.site_selector1 .bygroup .group_items_cont .group_cont a,.site_selector1 .bywebsites .website_items_cont .website_cont a,.site_selector1 .bygroup .group_items_cont .group_cont.active a,.site_selector1 .bywebsites .website_items_cont .website_cont.active a,#bottom_toolbar #bottom_sites_cont .list_cont .ind_groups .edit_del_cont .bg,.fav_rows_cont .ind_site a,.fav_rows_cont .ind_site.active a,.fav_rows_cont .ind_site .remove_bg,.dialog_cont .th .cancel,#toolbar_sites_cont .site .close,#enterBackupDetails, .signin_cont .btn a").live('mousedown',function () { 
 $(this).addClass('pressed');
}).live('mouseup',function () { 
$(this).removeClass('pressed');
});


$(".del_conf").live('mousedown',function () { 
return false;
}).live('mouseup',function () { 
return false;
});
$(".delFavourites").live('click',function() {
	closestVar=$(this).closest('.favItems');
	closestVar=$("a",closestVar);
	tempArray={};
	tempArray['requiredData']={};
	valArray={};
	valArray['name']=$(closestVar).attr('iname');
	valArray['URL']=$(closestVar).attr('dlink');
	valArray['type']=$(closestVar).attr('utype');
	tempArray['requiredData']['removeFavourites']={};
	tempArray['requiredData']['removeFavourites']=valArray;
	tempArray['requiredData']['getFavourites']=1;
	doCall(ajaxCallPath,tempArray,'reloadFavourites','json');
	$(this).closest('.favItems').fadeOut();
	return false;
}).live('mouseenter',function() { $(this).closest(".favItems").addClass('delWarn')}).live('mouseout',function() { $(this).closest(".favItems").removeClass('delWarn')});
$("#reloadStats").live('click',function() {
	$(this).addClass('disabled');
	$(this).closest('div').addClass('disabled');
	$(this).prepend('<div class="btn_loadingDiv left"><div>');
	tempArray={};
	tempArray['action']='getStats';
	tempArray['requiredData']={};
	tempArray['requiredData']['getSitesUpdates']=1;
	doCall(ajaxCallPath,tempArray,"refreshStats","json","none");
	
});
$("#reloadStats").live('mousedown',function() {
	if(!$(this).hasClass('disabled'))
	$(this).closest('div').addClass('pressed');
});
$("#reloadStats").live('mouseup',function() {
	if(!$(this).hasClass('disabled'))
	$(this).closest('div').removeClass('pressed');
});

// Slider code
	$( "#slider-range01" ).slider({
			range: "min",
			min: 1,
			max: 30,
			step: 1,
			values: 10,
			slide: function( event, ui ) {
	$( "#amount01" ).val( ui.value );
				triggerSettingsButton();
			}
		});
		
		
	
	$( "#slider-range02" ).slider({
			range: "min",
			min: 10,
			max: 100,
			step: 10,
			values: 50,
			slide: function( event, ui ) {
				
				$( "#amount02" ).val( ui.value );
					triggerSettingsButton();
			}
		});
		
	
	$( "#slider-range03" ).slider({
			range: "min",
			min: 0,
			max: 1000,
			step: 10,
			values:0,
			slide: function( event, ui ) {
				$( "#amount03" ).val( ui.value );
									triggerSettingsButton();
				
			}
		});
		$( "#amount01" ).val( $( "#slider-range01" ).slider( "values", 1 ) );
		$( "#amount02" ).val( $( "#slider-range02" ).slider( "values", 1 ) );
		$( "#amount03" ).val( $( "#slider-range03" ).slider( "values", 1 ) );
			
$(".settingsButtons").live('click',function() {
	$(".settingsItem").hide();
	$("#saveSettingsBtn").attr("page",$(this).attr('item'));
	$("#"+$(this).attr('item')).show();
	optionSelect(this);
});
$("#settings_btn").live('click',function() { 
showOrHide(this,"active","settings_cont");
});

$("#saveSettingsBtn").live('click',function(){
	$(this).addClass('disabled');
	$(this).prepend('<div class="btn_loadingDiv left"></div>');
        $(".valid_error").hide();
		page=$(this).attr('page');
		//closestVar=$(".valid_cont",this);
		if(page=="settingsTab")
		{
			email=$("#email").val();
		if(!echeck(email))
		{
			closestVar=$("#email").closest('.valid_cont');
			$(".valid_error div",closestVar).text("Invalid email. Kindly retry");
			$(".valid_error",closestVar).show();
			$("#saveSettingsBtn").addClass('disabled');
		}
		else if($(".change_pass_cont").is(":visible") && validateSettingsForm()==true )
		{	return false;
		
		}
		else
		{
			tempArray={};
			valArray={};
			tempArray['requiredData']={};
			if($(".change_pass_cont").is(":visible"))
			{
				
				valArray['newPassword']=$("#newPassword").val();
				valArray['currentPassword']=$("#currentPassword").val();
			}
			valArray['email']=$("#email").val();
				tempArray['requiredData']['updateAccountSettings']=valArray;
				tempArray['requiredData']['getSettingsAll']=1;
				doCall(ajaxCallPath,tempArray,"processSettingsForm","json","none");
		}
		}
		
		else if(page=="appSettingsTab")
		{
			tempArray={};
			tempArray['requiredData']={};
			tempArray['requiredData']['updateSettings']={};
			tempArray['requiredData']['getSettingsAll']=1;
				tempArray['requiredData']['updateSettings']['general']={};
			IPArray={};
			arrayCounter=0;
			$(".ip_cont","#IPContent").each(function () { 
			IPArray[arrayCounter]=$(".IPData",this).text();
			arrayCounter++;
			
			});
			
			if($("#sendAnonymous").hasClass('active'))
			anonymous=1;
			else
			anonymous=0;
			
			tempArray['requiredData']['updateSettings']['general']['MAX_SIMULTANEOUS_REQUEST_PER_IP']=$("#amount01").val();
			tempArray['requiredData']['updateSettings']['general']['MAX_SIMULTANEOUS_REQUEST']=$("#amount02").val();
			tempArray['requiredData']['updateSettings']['general']['TIME_DELAY_BETWEEN_REQUEST_PER_IP']=$("#amount03").val();
			tempArray['requiredData']['updateSettings']['allowedLoginIPs'] = IPArray;
			tempArray['requiredData']['updateSettings']['general']['sendAnonymous'] = anonymous;
			tempArray['requiredData']['getSettingsAll']=1;
			doCall(ajaxCallPath,tempArray,"processAppSettings","json","none");
			
			
		}
    
    });
	$(".triggerSettingsButton").live('keyup',function(){
		closestVar=$(this).closest('.valid_cont');
		$('.valid_error',closestVar).hide();
        $("#saveSettingsBtn").removeClass('disabled');
    });

$("#addIP").live('click',function() {
	$("#noIP").remove();
	ipVal=$("#tempIP").val();
	if(ipVal!='')
	$("#IPContent").append('<div class="ip_cont"><span class="droid700 IPData">'+ipVal+'</span><span class="remove removeIP">remove</span></div>');
		triggerSettingsButton();
});
$(".removeIP").live('click',function() {
	$(this).closest('.ip_cont').remove();
	triggerSettingsButton();
});
$("#sendAnonymous").live('click',function() { 
makeSelection(this);
});
$("#change_pass_btn").live('click',function () {
	
	showOrHide(this,'',"changePassContent")

});
$(".deleteBackup").live('click',function () {
	closestVar=$(this).closest('.item_ind');
	topVar=$(closestVar).closest('.topBackup');
	closestUpdatee=$(closestVar).closest('.row_updatee');
	mainClosestVar=$(this).closest('.row_backup_action');
	
	

		   if($(this).hasClass('yes'))
	   {
	 tempArray={};
tempArray['args']={};
	tempArray['action']='removeBackup';
	tempArray['args']['params']={};
	tempArray['args']['params']['taskName']='Backup Now';
		tempArray['args']['params']['resultID']=$('.trash.removeBackup',mainClosestVar).attr('referencekey');
	tempArray['args']['siteIDs']=[$('.trash.removeBackup',mainClosestVar).attr('sid')];
	
	
	
	  $(topVar).remove();
	if($(".row_updatee_ind",closestUpdatee).length==0)
	$($(closestUpdatee).closest('.ind_row_cont').remove());
	doHistoryCall(ajaxCallPath,tempArray,"");
	return false;
	   }
	   else
	   {
		   $(topVar).removeClass('del');
			$(".delConfHide",closestVar).show();
	   }
});
$(".openHere").live('click',function() {
	
	loadAdminHere($(this).attr('sid'));


});
$(".link").live("click",function() { 
	resetBottomToolbar();
});
$(".adminPopout").live('click',function() {
	if($(this).attr('clicked')!=1)
	{
	loadAdminPopout(this,$(this).attr('sid'));
	$(this).attr('clicked')=0;
	}
	
	

});
$(".removeSite").live('click',function() {
	loadRemoveSite($(this).attr('sid'));
	resetBottomToolbar();

});
$(".newPost").live('click',function() {
		if($(this).attr('clicked')!=1)
		{
		loadAdminPopout(this,$(this).attr('sid'),1);
		$(this).attr('clicked')=0;
		}
		
	

});

	
$(".editEmail").live('click',function() {
	closestVar=$(this).closest('.td');
	
	   $(".emailEdit",closestVar).addClass('focus').focus();
});
   $(".emailEdit").live('focus',function(e) {
		 if(!$(this).hasClass('focus'))
		$(this).blur();
   });
$(".closePopup").live('click',function(e) {
if(toolTipData.adminPopup!="true")
 $('.showFooterSelector').qtip('hide');
	$("#modalDiv").dialog("close");
});
$("#removeSiteConfirm").live('click',function(e) {
	tempArray={};
	tempArray['requiredData']={};
	tempArray['args']={};
	tempArray['args']['params']={};
	tempArray['args']['siteIDs']={};
	tempArray['action']='removeSite';
	tempArray['args']['params']['iwpPluginDeactivate']=1;
	tempArray['args']['siteIDs'][0]=$(this).attr('sid');
tempArray['requiredData']['getGroupsSites']=1;
tempArray['requiredData']['getSites']=1;
tempArray['requiredData']['getSitesUpdates']=1;
	$(this).addClass('disabled');
		$(this).prepend('<div class="btn_loadingDiv left"></div>');
		$("#dontRemoveSite","#modalDiv").hide();
doHistoryCall(ajaxCallPath,tempArray,'processRemoveSite');
return false;

	
	
});
$("#assignToggleAction").live('click',function(e) {
	assignToggleCont=$("#assignToggle").text();
	if(assignToggleCont=='+')
	{
	$(".assignGroupItem").show();
	$("#assignToggle").text('-');
	}
	else
	{
	$(".assignGroupItem").hide();
	$("#assignToggle").text('+');
	}
});
// Update count

$(".panelInstall").live('click',function(e) {
	$(this).closest('.item_ind').addClass('updating');
});
$(".cutClass").live('click',function() {
	return false;
});
$("#viewHidden").live('click',function(e) {
	
	topParent="#"+currentUpdatePage;
	makeSelection(this);
	
	if($(this).hasClass('active'))
	{
	$("#mainUpdateCont .hiddenCheck").hide();
	viewHiddenFlag=1;

	$("#mainUpdateCont .hideVar").show();
		$("#mainUpdateCont .hidden").slideDown();
	
	}
	else
	{
	checkUpdateEmpty();
	viewHiddenFlag=0;
	$("#mainUpdateCont .hideVar").hide();
	$("#mainUpdateCont .hidden").slideUp();
	
	
	}

});

// Assign groups Hide

$(".thumb").live('click',function() {
	url=$(this).attr('preview');
	loadPreview(url);
});

	$("#activityPopup").live('click',function() {
		return false;
	});
$("#bottom_sites_cont").live('click',function() {
	return false;
});
$(".cancel_save").live('click',function() {
$("#settings_cont").hide();
$("#settings_btn").removeClass('active');
});
$("#enterBackupDetails").live('click',function() {
	
	$("#enterDetailsTab").removeClass('clickNone').click();
	$(".create_backup .completed").qtip({id: "backupToolTip",events: { show: function(event, api) { if(!$('#selectWebsitesTab').hasClass('completed')) return false; } },content: { text: 'Edit' }, position: { my: 'left center', at: 'right center' }, show: { event: 'mouseenter' }, hide: { event: 'mouseleave' }, style: { classes: 'ui-tooltip-shadow ui-tooltip-dark' } });	

	});
$("#enterDetailsTab").live('click',function() {
	
	if(!$(this).hasClass('clickNone'))
	{
		$(this).addClass('current').removeClass('completed');
	$("#selectWebsitesTab").removeClass('current').addClass('completed');
	$("#backupOptions,#backupNow").show();
	$(".siteSelectorContainer,#enterBackupDetails").hide();
	}
});
$("#selectWebsitesTab").live('click',function() {
	$(this).addClass('current').removeClass('completed');
	$("#enterDetailsTab").removeClass('current completed').addClass('clickNone');
	$(".siteSelectorContainer,#enterBackupDetails").show();
	$("#backupOptions,#backupNow").hide();
	
	
});

$(".clear_input").live('click',function() {
	$(this).prev().val('type to filter').keyup().css("color",'#AAAAAA');
	$(this).hide();
});
$(".input_type_filter").live('focus',function() {
		if(this.value=='type to filter' || this.value=='new group' ){this.value=''; this.style.color='#676C70';}  else { this.style.color='#676C70'; this.select(); };
	});
	$(".input_type_filter").live('blur',function() {
		if(this.value==''){ if($(this).attr('id')=='newgroup') this.value='new group';  else this.value='type to filter'; this.style.color='#AAAAAA'; };
	});
$(".txtHelp").live('focus',function() {
	if($(this).val()==$(this).attr('helpTxt'))
{

this.value=''; this.style.color='#676C70';
}
else { this.style.color='#676C70'; this.select(); }
}).live('blur',function() {
	if(this.value=='')
	{
 $(this).val($(this).attr('helpTxt'));
		this.style.color='#AAAAAA';
	}
});
$("#searchRepository").live('click',function() {
	$("[function='loadRepository']",$(this).closest('.optionsContent')).click();
});

$(".passwords").live('focus',function() {
	
	$(this).get(0).type = 'password';
	
}).live('blur',function() {
if($(this).val()=='Current Password' || $(this).val()=='New Password' || $(this).val()=='New Password Again' || $(this).val()=='')
$(this).get(0).type = 'text';
else
	$(this).get(0).type = 'password';
});
$(".onEnter").live('keypress',function(e) {
 var code = (e.keyCode ? e.keyCode : e.which);
	
 if(code == 13) { 
$($(this).attr("onenterbtn")).click();
 }
});
$(".closeBottomToolBar").live('click',function(e) {
	resetBottomToolbar();
});
$(".groupClear").live('keyup focus',function(e) {
	$("#duplicateGroup").remove();
});
 loadSettingsPage(settingsData);
   $(".nano").nanoScroller();
   $("#btn").click();
   $(".toggle_manage_groups").click();
  
			  $("#joyRidePopup4 .joyride-next-tip").live('click',function(e) {
	$(".navLinks[page='items']").removeClass('noClick').click().addClass('noClick');
		
				});
			
				$(this).joyride({
					'postRideCallback': onCloseJoyRide
					});
	$("#joyRidePopup0 .joyride-next-tip").live('click',function(e) {

		$("#activityPopup #historyQueue").show();
		   $("#btn").click();
	});
	$("#joyRidePopup1 .joyride-next-tip").live('click',function(e) {
		$("#activityPopup #historyQueue").hide();
				
	});
	$("#joyRidePopup6 .joyride-next-tip").live('click',function(e) {
		$(".install.optionSelect").click();
		
	});
	$("#joyRidePopup8 .joyride-next-tip").live('click',function(e) {
		
		$(".navLinks[page='backups']").removeClass('noClick').click().addClass('noClick');
		$("#activityPopup #historyQueue").hide();
		
		
	});
		$("#joyRidePopup9 .joyride-next-tip").live('click',function(e) {
		$(".navLinks[page='history']").removeClass('noClick').click().addClass('noClick');
			$("#activityPopup #historyQueue").hide();
		
	});
	$("#joyRidePopup11 .joyride-next-tip").live('click',function(e) {
		$("#joyRidePopup11 .joyride-close-tip").click();
		
	});
	
	//$("#joyRidePopup1").css("margin-top","10px");
	
	$("#pageContent").append(demoUpdateCont).append(pluginManageCont).append(backupCont).append(activityCont).append(themesInstallCont);
	processPage('updates');
	$(".install").live('click',function(e) {
		$(".WTPages").hide();
		$("#themesInstallCont").show();
	});
	
  /* -------------	   -------------	   -------------	   -------------	   -------------	   -------------	   -------------	   -------------	   -------------	   -------------	   -------------	  */
  });
  
  
  function onCloseJoyRide()
		{
			window.parent.$("#modalDiv").dialog('close');
		//$("body").html("<div class='load_app'>Loading the App...</div>");
		}