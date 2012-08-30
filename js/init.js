/************************************************************
 * InfiniteWP Admin panel									*
 * Copyright (c) 2012 Revmakx								*
 * www.revmakx.com											*
 *															*
 ************************************************************/

 $(function () {
	  $.fn.qtip.zindex = 900;
	if ( $.browser.msie ) {
		if($.browser.version=='6.0' || $.browser.version=='7.0')
		{
			 window.location.href = "no_support.html";
			return false;
		}
	}
	// Resize and remove elements when the canvas size is small
	
	loadFixedNotifications();

	  if(totalSites>0)
	  {
	  processPage("updates");
	  $(".navLinkUpdate").addClass('active');
	  }
	  siteSelector();
	  siteSelector(1);
 $("#bottom_toolbar").prepend('<div id="bottomToolBarSelector">'+bottomToolbarVar+'</div>');
	  $(".managePanel").prepend('<div class="siteSelectorContainer">'+siteSelectorVar+'</div>');

	  resetGroup();
	  
if(toolTipData.manageGroups=="true")
	    $(".toggle_manage_groups").qtip({id:"toggleGroupQtip",content: { text: 'Manage Groups' }, position: { my: 'bottom center', at: 'top center',  adjust:{ y: -6} }, show: { event: 'mouseenter' }, hide: { event: 'mouseleave' }, style: { classes: 'ui-tooltip-shadow ui-tooltip-dark',  tip: {  corner: true, width: 10, height:5} } });
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
historyRefresh();



/*$("body .disabled").live('click',function() {
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
    });*/

	  $("body").delegate(".disabled", "click", function(){
     return false;
    });
	
	 $("body").delegate(".optionSelect", "click", function(){
     if($(this).hasClass('active') && !$(this).hasClass('applyChangesCheck') )
	 return false;
    });
	
	/*  $("body").delegate(".btn_action a", "mousedown", function(){
	if(!$(this).hasClass('disabled'))	  
   $(this).addClass('pressed');
    });
	$("body").delegate(".btn_action a", "mouseup", function(){
	if(!$(this).hasClass('disabled'))	
   $(this).removeClass('pressed');
    });*/
$(window).resize(function() {
	dynamicResize();
});
	$(document).bind('click', function(event) {
	
 //Hide the menus if visible
//alert( $(this).attr('class'));
closeDialogs();
 
 });

	  setInterval(function () {
		  if(!$(".queue_detailed").is(":visible"))
		  {
			  $("#historyQueueUpdateLoading").addClass('loading');
		  historyRefresh();
		   
		
		
		  }
        }, 5000);
  
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
$(".selectOption").live('click',function(e) {
	if(!$(this).hasClass('updating') && !$(this).hasClass('hidden') && ($(e.target).attr('href')=='' || $(e.target).attr('href')==undefined) ) 
generalSelect(this,'',1);
});
$(".row_summary").live('click',function() {
expandThis(this,'summary');
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
resetFilterText("#mainUpdateCont");
$(".updateTabs").hide();
$("#siteViewUpdateContent").show();
currentUpdatePage="siteViewUpdateContent";
$(".hiddenCont","#siteViewUpdateContent").hide();
checkGeneralSelect('ind_row_cont');
if($("#siteViewUpdateContent .ind_row_cont").not(".hide,.hideVar").length<1 && $("#siteViewUpdateContent .empty_data_set").not('.hiddenCheck').css('display')=='none' && viewHiddenFlag==0)
{
$("#siteViewUpdateContent .hiddenCheck").show();
$(".status_ind_row_cont").addClass('disabled');
}
});
$(".themes_view").live('click',function() {
	resetFilterText("#mainUpdateCont");
optionSelect(this);
$(".updateTabs").hide();
$("#themeViewUpdateContent").show();
currentUpdatePage="themeViewUpdateContent";
if($("#themeViewUpdateContent .ind_row_cont").not(".hide,.hideVar").length<1 && $("#themeViewUpdateContent .empty_data_set").not('.hiddenCheck').css('display')=='none' && viewHiddenFlag==0)
{
$("#themeViewUpdateContent .hiddenCheck").show();
$(".status_ind_row_cont").addClass('disabled');
}
$(".hiddenCont","#themeViewUpdateContent").hide();


});
$(".plugins_view").live('click',function() {
optionSelect(this);
resetFilterText("#mainUpdateCont");
$(".updateTabs").hide();
$("#pluginViewUpdateContent").show();
currentUpdatePage="pluginViewUpdateContent";
$(".hiddenCont","#pluginViewUpdateContent").hide();
if($("#pluginViewUpdateContent .ind_row_cont").not(".hide,.hideVar").length<1 && $("#pluginViewUpdateContent .empty_data_set").not('.hiddenCheck').css('display')=='none' && viewHiddenFlag==0)
{
$("#pluginViewUpdateContent .hiddenCheck").show();
$(".status_ind_row_cont").addClass('disabled');
}

});
$(".wp_view").live('click',function() {
optionSelect(this);
resetFilterText("#mainUpdateCont");
$(".updateTabs").hide();
$("#WPViewUpdateContent").show();

currentUpdatePage="WPViewUpdateContent";
$(".hiddenCont","#WPViewUpdateContent").hide();

if($("#WPViewUpdateContent .ind_row_cont").not(".hide,.hideVar").length<1 && $("#WPViewUpdateContent .empty_data_set").not('.hiddenCheck').css('display')=='none' && viewHiddenFlag==0)
{
$("#WPViewUpdateContent .hiddenCheck").show();
$(".status_ind_row_cont").addClass('disabled');
}

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
$(".update_group").live('click',function() {
updateSites(this,1);
return false;
});
$(".update_single").live('click',function() {
updateSites(this);
return false;
});

/* -------------	   -------------	   -------------	   -------------	   -------------	   -------------	   -------------	   -------------	   -------------	   -------------	   -------------	  */
// Siteselector and bottom footer

	
	$(".nano").live('mousewheel',function(e, delta) {
if ( !$.browser.msie && $.browser.version!='8.0') {

var object=this;
if($('.slider',object).css("top")=="0px" && delta>0)
cancelEvent(e);
var bottomval=$(this).height()-$('.slider',object).height();
var bottomval=bottomval+"px";

if($('.slider',object).css("top")==bottomval && delta<0)
cancelEvent(e);
}

});


	$(".input_type_filter").live('focus',function() {
		if(this.value=='type to filter' || this.value=='new group' || this.value=='eg. group1, group2'){this.value=''; this.style.color='#676C70';}  else { this.style.color='#676C70'; this.select(); };
	});
	$(".input_type_filter").live('blur',function() {
		if(this.value==''){ if($(this).attr('id')=='newgroup') this.value='new group';  else if ($(this).attr('id')=='groupText') this.value='eg. group1, group2'; else this.value='type to filter'; this.style.color='#AAAAAA'; };
	});


	
	
	$(".group_cont").live('click',function() {
	if($(this).attr('id')=='g0')
	makeSelection(this,'all');
	else
	makeSelection(this,1);
	if(currentPage=="items")
	showItemOptions();
	else if (currentPage=="backups")
	showBackupOptions();
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

if(currentPage=="items")
	showItemOptions();
	else if (currentPage=="backups")
	showBackupOptions();
});



$(".toggle_manage_groups").live('click',function() {
groupEdit(this);
 // $(".nano").nanoScroller();
});
$(".icon_close").live('click',function() {
resetGroup();
});
$(".save_changes").live('click',function() {
var doSave = true;
$("#bottomToolBarSelector .groupEditText:visible").each(function () {
	if($(this).val()=="")
	{
	$(this).addClass('error');
	doSave=false;
	}
});
if(doSave==true)
{
var tempDataArray={};
var tempArray={};
tempDataArray['requiredData']={};
tempArray['new']=groupCreateArray;
tempArray['updateSites']=groupChangeArray;
tempArray['updateNames']=groupNameArray;
tempArray['delete']=groupDeleteArray;
tempDataArray['requiredData']['manageGroups']=tempArray;
tempDataArray['requiredData']['getGroupsSites']=1;
tempDataArray['requiredData']['getSites']=1;

doCall(ajaxCallPath,tempDataArray,'processSaveChange','json');
}
else
{
	$(".emptyError").remove();
$(this).closest('.bottom_bar').prepend("<div class='emptyError'>Group name(s) is empty.</div>");

}

});


$(".btn_create_group").live('click',function() {
createGroup();
});
$(".showFooterSelector").live('click',function() {
	
if($("#bottom_sites_cont").is(":visible"))
{
	$("#dynamic_resize").css("margin-left","0");
	$(this).removeClass('pressed');
	$("#bottom_sites_cont").hide();
}
else
dynamicResize(1);
return false;
});
$("#spreadLove").live('click',function() {
	showOrHide(this,'pressed','spreadLoveItems','1');
});
/* -------------	   -------------	   -------------	   -------------	   -------------	   -------------	   -------------	   -------------	   -------------	   -------------	   -------------	  */

// Plugins/Themes install and manage page.

	  // Main page
	  $(".navLinks").live('click',function() {
optionSelect(this);
processPage($(this).attr('page'));
});
	  
	  
	  // History page
	  $(".historyToolbar").live('click',function() {
showOrHide(this,'','historyQueue','');
return false;
});
	$(".historyItem").live('click',function() {
makeHistorySelection(this,"queue_cont");
return false;
});
	  
	  $(".fetchInstall").live('click',function() {
		//titleItem=activeItem.toTitleCase();
		//alert(titleItem);
if(!$(this).hasClass('disabled'))
{
siteArray=getSelectedSites();
$(this).addClass('disabled');
$(this).attr('tempname',$(this).text());
$(this).append('<div class="btn_loadingDiv"></div>');
var tempArray={};
var requireDataArray={};
tempArray['args']={};
tempArray['action']="get"+activeItem.toTitleCase();
tempArray['args']['siteIDs']=siteArray;
requireDataArray['getSearchedPluginsThemes']=1;
tempArray['requiredData']= requireDataArray;
doCall(ajaxCallPath,tempArray,'loadManagePanel','json',"none");
}
});


	//pluginsListPanel('plugins','plugins');
	//loadInstallPanel();
	

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
resetFilterText('.actionContent');

});
$(".manage_themes_view").live('click',function() {
optionSelect(this);
pluginsListPanel('themes',activeItem);
resetFilterText('.actionContent');
});
$(".installFavourites").live('click',function() {
installFavourites();
return false;
});

$(".manage_plugins_view").live('click',function() {
optionSelect(this);
pluginsListPanel('plugins',activeItem);
resetFilterText('.actionContent');
  });
  $(".searchItem").live('click',function() {
	  $(this).addClass('disabled');
	  $(this).prepend('<div class="btn_loadingDiv"></div>');
	  var tempArray={};
	  tempArray['requiredData']={};
	  var valArray={};
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
	var loadFunction=$(this).attr('function');
	if(loadFunction=='loadFavourites')
	$(".favOption").show();
	else
	$(".favOption").hide();
	var returnVar=eval(loadFunction+"()");
	$(".installSubPanel").html(returnVar);
	if(loadFunction=="loadComputer")
	createUploader();
});
 $(".website_cont").live('click',function() {
	makeSelection(this);
	if(currentPage=="items")
	showItemOptions();
	else if(currentPage=="backups")
	showBackupOptions();
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

$(".optionsContent").html('<div style="padding:10px 0;"> <div class="btn_action float-right fetchInstallCont"><a class="rep_sprite fetchInstall">Load <span class="itemName">'+activeItem.toTitleCase()+' </span></a></div> <div class="float-right"> <input name="" type="text" onenterbtn=".fetchInstall" class="fetchInstallTxt txt onEnter" style="width: 300px; height: 17px; margin: 5px;" /> </div> <div class="float-right" style="text-align:right; color:#737987; padding-top: 10px;"><span class="droid700" style="font-size:11px;">SEARCH <span class="itemName itemUpper">'+activeItem.toUpperCase()+'</span><br /> Leave blank to load all <span class="itemName">'+activeItem+'</span></div> <div class="clear-both"></div><div class="actionContent siteSearch" style="display:none;margin-top:10px "></div> </div>');
$(".optionsContent").addClass('result_block_noborder').hide();
$(".advancedInstallOptions").hide();
$(".siteSelectorContainer").html(siteSelectorVar);

siteSelectorNanoReset();
});
  $(".install").live('click',function() {
	  $(".siteSelectorContainer").html(siteSelectorRestrictVar);
	  siteSelectorNanoReset();
	   $("#processType").text('INSTALL');
	   $(".optionsContent").removeClass('result_block_noborder');

optionSelect(this);
loadInstallPanel("optionsContent");
$(".optionsContent").hide();
/*if($(".website_cont.active").length>0)
$(".advancedInstallOptions").show();*/

});
$(".generalSelect").live('click',function() {
	makeSelection(this);
});


  // Bottom toolbar
     $(".groupEditText").live('focus',function(e) {
		 if(!$(this).hasClass('focus') && !$(this).hasClass('error'))
		$(this).blur();
	
   });
    $(".groupEditText.focus").live('blur',function(e) {
	
		groupNameArray[$(this).closest('.ind_groups').attr('gid')]=$(this).val();
		
		
		 $(this).removeClass('focus');
   });
    $(".groupEditText.error").live('blur',function(e) {
		groupNameArray[$(this).closest('.ind_groups').attr('gid')]=$(this).val();
		$(this).removeClass('error');
	});
   $(".editGroup").live('click',function() {
	   $(".save_changes").show();
	   closestVar=$(this).closest('.ind_groups');
	   $(".groupEditText",closestVar).addClass('focus').focus();
	   removeDeleteConf();
	   return false;
	   
   });
   $(".deleteConf").live('click',function() {
	  var closestVar=$(this).closest('.ind_groups');
	   $(".del_conf").hide();
	   $(".ind_groups","#bottom_sites_cont").removeClass('error');
	   $(".del_conf",closestVar).show();
	   $(closestVar).addClass('error');
	   return false;
   });
   $(".deleteGroup").live('click',function() {
	    var closestVar=$(this).closest('.ind_groups');
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
	   var editSite='';
	   if($(this).hasClass('editSite'))
	   editSite=1;
	$("#addSiteErrorMsg").remove();
	 var  tempArray={};
	    tempArray['args']={};
	   tempArray['args']['params']={};
	var addsiteWebsite=$("#websiteURL","#modalDiv").val();
	 
	var addsiteUsername=$("#username",".add_site.form_cont").val();
	var addsiteGroupText =$("#groupText",".add_site.form_cont").val();
	 var addsiteActivationKey =$("#activationKey",".add_site.form_cont").val();
	  if(addsiteGroupText=='eg. group1, group2')
	   {
			   addsiteGroupText='';
	   }
	
	   var groupIDs=groupSelected();
 		if(editSite!=1)
		{
	   tempArray['action']='addSite';
	   tempArray['args']['params']['URL']=addsiteWebsite;
	   tempArray['args']['params']['activationKey']=addsiteActivationKey;
	   tempArray['args']['params']['username']=addsiteUsername;
	   tempArray['args']['params']['groupsPlainText']=addsiteGroupText;
	   tempArray['args']['params']['groupIDs']=groupIDs;
	   if($("#addSiteAuthUsername").val()!="username")
	   {
	   tempArray['args']['params']['httpAuth']={};
	   tempArray['args']['params']['httpAuth']['username']=$("#addSiteAuthUsername").val()
	   tempArray['args']['params']['httpAuth']['password']=$("#addSiteAuthUserPassword").val()
	   }
	}
	   

	    
		
		tempArray['requiredData']={};
		
		if(editSite==1)
		{
		tempArray['requiredData']['updateSite']={};
		tempArray['requiredData']['updateSite']['siteID']=$(this).attr('sid');
		tempArray['requiredData']['updateSite']['adminURL']=$("#adminURL",".add_site.form_cont").val();
		tempArray['requiredData']['updateSite']['groupsPlainText']=addsiteGroupText;
		tempArray['requiredData']['updateSite']['groupIDs']=groupIDs;
		tempArray['requiredData']['updateSite']['adminUsername']=addsiteUsername;
		if($("#addSiteAuthUsername").val()!="username")
	   {
	   tempArray['requiredData']['updateSite']['httpAuth']={};
	   tempArray['requiredData']['updateSite']['httpAuth']['username']=$("#addSiteAuthUsername").val()
	   tempArray['requiredData']['updateSite']['httpAuth']['password']=$("#addSiteAuthUserPassword").val()
	   }
		
		}
		tempArray['requiredData']['getSitesUpdates']=1;
		tempArray['requiredData']['getGroupsSites']=1;
		tempArray['requiredData']['getSites']=1;
		$(this).addClass('disabled');
		$(this).prepend('<div class="btn_loadingDiv left"></div>');
	if(editSite==1)
	doCall(ajaxCallPath,tempArray,"processEditSite","json","none");
	else
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
	var arrayCounter=0;
	var URL={};
	var testURL='';
	var funcURL=systemURL;
	$(this).addClass('disabled');
	if(settingsData.data.getSettingsAll.settings.general.httpAuth!=undefined)
	{
		if(settingsData.data.getSettingsAll.settings.general.httpAuth.username!='')
		funcURL=funcURL.replace("://","://"+settingsData.data.getSettingsAll.settings.general.httpAuth.username+":"+settingsData.data.getSettingsAll.settings.general.httpAuth.password+"@");
	}
	$(".installFileNames").each(function () {
	
	testURL=funcURL+"uploads/"+$(this).html();
	URL[arrayCounter]=testURL; arrayCounter++;
	});
	installItems('',URL,2);
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
	installItems('',URL,1);
	return false;
});


// Favorites 
$(".addToFavorites").live('click',function() {
   $(this).addClass('disabled');
   $(this).text('Favorite');
	var tempArray={};
	tempArray['requiredData']={};
	var valArray={};
	valArray['name']=$(this).attr('iname');
	valArray['URL']=$(this).attr('dlink');
	valArray['type']=$(this).attr('utype');
	tempArray['requiredData']['addFavourites']={};
	tempArray['requiredData']['addFavourites']=valArray;
	tempArray['requiredData']['getFavourites']=1;
	doCall(ajaxCallPath,tempArray,'reloadFavourites','json');
	
});
$(".hideItem").live('click',function() {
  var closestVar=$(this).closest('.item_ind');
	var tempArray={};
	tempArray['requiredData']={};
	var valArray={};
	
	if(currentUpdatePage=='siteViewUpdateContent')
	typeText=$(".row_"+$(closestVar).attr('selector')+" .label").text();
	prevCount=parseInt($(".row_"+$(closestVar).attr('selector')+" .count span").text());
	if($(this).text()=="Hide")
	{
		
		$(closestVar).removeClass('active');
	$(closestVar).addClass('hidden').show();
		$(".row_checkbox",closestVar).hide();
		
	
		if(viewHiddenFlag==0 && !$("#viewHidden").hasClass('active'))
		{
		   $(closestVar).fadeOut(300);
		}
		
	$(".row_"+$(closestVar).attr('selector')+" .count span").text(prevCount-1);
	$("#totalUpdateCount").text(parseInt($("#totalUpdateCount").text())-1);
	if(currentUpdatePage=='siteViewUpdateContent')
	{
	$(".updateCount_"+typeText.toLowerCase()+"_"+$(this).attr('parent')+" span").text(prevCount-1);
	
	}
		$(this).text('Show');
		tempAction="addHide";
		
	}
	else{
		$("#totalUpdateCount").text(parseInt($("#totalUpdateCount").text())+1);
		$(".row_checkbox",closestVar).show();
		$(closestVar).removeClass('hidden');
		$(this).text('Hide');
		tempAction="removeHide";
			$(".row_"+$(closestVar).attr('selector')+" .count span").text(prevCount+1);
			if(currentUpdatePage=='siteViewUpdateContent')
			$(".updateCount_"+typeText.toLowerCase()+"_"+$(this).attr('parent')+" span").text(prevCount+1);
	}
		
		//checkSelection($(closestVar).attr("selector"));
	
		
	valArray['name']=$(closestVar).attr('iname');
	if(valArray['name']==undefined)
	valArray['name']='';
	valArray['path']=$(closestVar).attr('did');
	
	valArray['type']=$(closestVar).attr('utype');
		if(valArray['type']=="WP")
	valArray['type']="core";
	tempArray['requiredData'][tempAction]={};
	tempArray['requiredData'][tempAction][$(closestVar).attr('sid')]=valArray;
	tempArray['requiredData']['getSitesUpdates']=1;
//	tempArray['requiredData']['getHide']=1;
	doCall(ajaxCallPath,tempArray,'processHideUpdate','json');
	checkGeneralSelect($(this).attr('selector'),'',1);
	checkGeneralSelect($(this).attr('parent'),'',1);
	checkGeneralSelect('ind_row_cont','');
	return false;
	
});
//  Backup
$("#backupNow").live('click',function() {
	var closestVar="#backupOptions";
	var tempArray={};
	tempArray["args"]={};
	tempArray["args"]["params"]={};
	var valArray={};
	var backupParentClass='.create_backup';
	var backupIncludeFolders=$("#includeFolders",backupParentClass).val();
	if($("#compression",backupParentClass).hasClass('active'))
	var backupCompression=1;
	else
	var backupCompression='';
	if($("#databaseOptimize",backupParentClass).hasClass('active'))
	var backupDatabaseOptimize=1;
	else
	var backupDatabaseOptimize='';
	var backupExcludeFiles=$("#excludeFiles",backupParentClass).val();
	if(backupExcludeFiles=='eg., old-backup.zip, wp-content/old-backups')
	var backupExcludeFiles='';
	if($("#full",backupParentClass).hasClass('active'))
	var backupWhat="full";
	else
	var backupWhat="db";
	var backupTaskName=$("#backupName",backupParentClass).val();
	valArray['limit']=5;
	valArray['include']=backupIncludeFolders;
	valArray['disableCompression']=backupCompression;
	valArray['optimizeDB']=backupDatabaseOptimize;
	valArray['exclude']=backupExcludeFiles;
	valArray['what']=backupWhat;
	valArray['backupName']=backupTaskName;
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
var btCheckFlag='';
var btActiveCheck='';
$(".bottomSites").live('mouseenter',function() {
	var position = $(this).position();
	btCheckFlag=0;
	btActiveCheck=1;
	if(groupEditFlag==0)
	{
	if($('#bottomToolbarOptions').length != 0)
	$('#bottomToolbarOptions').remove();
	loadBottomToolbarOptions($(this).attr('sid'));
	if(bottomFullBar==1)
	var topval=position.top-($(window).height()-43);
	else
	var topval=position.top-392;
	
	$("#bottomToolbarOptions").css("top",topval);
	}
	//alert(dump(position));
}).live('mouseleave',function() {
	btActiveCheck=0;
	setTimeout(function() {  if(btCheckFlag==0 && btActiveCheck==0  ) $("#bottomToolbarOptions").remove();  }, 50);
	
});
$("#bottomToolbarOptions").live('mouseenter',function() {
	
	$("#s"+$(this).attr('btsiteid')).addClass('bg_yellow');
	btCheckFlag=1;
	return false;
}).live('mouseleave',function() {
	$("#s"+$(this).attr('btsiteid')).removeClass('bg_yellow');
$(this).remove();
});
$("#singleBackupNow").live('click',function() {
loadBackup('',$(this).attr('sid'));
});
$("#viewBackups").live('click',function() {
	var tempArray={};
	tempArray['requiredData']={};
	tempArray['requiredData']['getSiteBackupsHTML']=$(this).attr('sid');
	doCall(ajaxCallPath,tempArray,"loadBackupPopup","json");
});
$(".removeBackup").live('click',function() {
	
	var closestVar=$(this).closest('.item_ind');
	var topVar=$(closestVar).closest('.topBackup')
	
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
var tempArray={};
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
	loadBackup(1);
});
$(".refreshData").live('click',function() {
	var tempArray={};
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
	loadAddSite();
	
});/*.live('mousedown',function () { 
 $(this).addClass('pressed');
}).live('mouseup',function () { 
$(this).removeClass('pressed');
})*/;
/*$(".row_backup_action,.checkbox,.site_selector1 .bygroup .group_items_cont .group_cont a,.site_selector1 .bywebsites .website_items_cont .website_cont a,.site_selector1 .bygroup .group_items_cont .group_cont.active a,.site_selector1 .bywebsites .website_items_cont .website_cont.active a,#bottom_toolbar #bottom_sites_cont .list_cont .ind_groups .edit_del_cont .bg,.fav_rows_cont .ind_site a,.fav_rows_cont .ind_site.active a,.fav_rows_cont .ind_site .remove_bg,.dialog_cont .th .cancel,#toolbar_sites_cont .site .close,#enterBackupDetails, .signin_cont .btn a, .dk_toggle, .history #dateContainer").live('mousedown',function () { 
 $(this).addClass('pressed');
}).live('mouseup',function () { 
$(this).removeClass('pressed');
});*/


$(".del_conf").live('mousedown',function () { 
return false;
}).live('mouseup',function () { 
return false;
});
$(".delFavourites").live('click',function() {
	var closestVar=$(this).closest('.favItems');
	closestVar=$("a",closestVar);
	var tempArray={};
	tempArray['requiredData']={};
	var valArray={};
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
	var tempArray={};
	tempArray['action']='getStats';
	tempArray['requiredData']={};
	tempArray['requiredData']['getSitesUpdates']=1;
	if($("#clearPluginCache").hasClass('active'))
	{
		tempArray['args']={};
		tempArray['args']['params']={};
		tempArray['args']['params']['forceRefresh']=1;
	}
	tempArray['requiredData']['getClientUpdateAvailableSiteIDs']=1;
	
	doCall(ajaxCallPath,tempArray,"refreshStats","json","none");
	
});
/*$("#reloadStats").live('mousedown',function() {
	if(!$(this).hasClass('disabled'))
	$(this).closest('div').addClass('pressed');
});
$("#reloadStats").live('mouseup',function() {
	if(!$(this).hasClass('disabled'))
	$(this).closest('div').removeClass('pressed');
});
*/
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
closeDialogs(2);
return false;
});

$("#saveSettingsBtn").live('click',function(){
	$(this).addClass('disabled');
	$(this).prepend('<div class="btn_loadingDiv left"></div>');
        $(".valid_error").hide();
		var page=$(this).attr('page');
		//closestVar=$(".valid_cont",this);
		if(page=="settingsTab")
		{
			var accountEmail=$("#email").val();
		if(!echeck(accountEmail))
		{
			var closestVar=$("#email").closest('.valid_cont');
			$(".valid_error div",closestVar).text("Invalid email. Kindly retry");
			$(".valid_error",closestVar).show();
			$("#saveSettingsBtn").removeClass('disabled');
			$(".btn_loadingDiv").remove();
		}
		else if($(".change_pass_cont").is(":visible") && validateSettingsForm()==true )
		{
			$("#saveSettingsBtn").removeClass('disabled');
	$("#settings_cont .btn_loadingDiv").remove();	
		return false;
		
		}
		else
		{
			var tempArray={};
			var valArray={};
			tempArray['requiredData']={};
			if($(".change_pass_cont").is(":visible"))
			{
				
				valArray['newPassword']=$("#newPassword").val();
				valArray['currentPassword']=$("#currentPassword").val();
			}
			valArray['email']=$("#email").val();
				tempArray['requiredData']['updateAccountSettings']=valArray;
				tempArray['requiredData']['updateSettings']={};
				tempArray['requiredData']['updateSettings']['notifications']={};
				tempArray['requiredData']['updateSettings']['notifications']['updatesNotificationMail'] = {};
				tempArray['requiredData']['updateSettings']['notifications']['updatesNotificationMail']['frequency']=$(".emailFrequency.active").attr('def');
				if($("#notifyPlugins").hasClass('active'))
				notifyPlugins=1;
				else
				notifyPlugins=0;
				if($("#notifyThemes").hasClass('active'))
				notifyThemes=1;
				else
				notifyThemes=0;
				
				if($("#notifyWordpress").hasClass('active'))
				notifyWordpress=1;
				else
				notifyWordpress=0;
				
				tempArray['requiredData']['updateSettings']['notifications']['updatesNotificationMail']['coreUpdates']=notifyWordpress;
				tempArray['requiredData']['updateSettings']['notifications']['updatesNotificationMail']['pluginUpdates']=notifyPlugins;
				tempArray['requiredData']['updateSettings']['notifications']['updatesNotificationMail']['themeUpdates']=notifyThemes;
				tempArray['requiredData']['getSettingsAll']=1;
				
				doCall(ajaxCallPath,tempArray,"processSettingsForm","json","none");
		}
		}
		
		else if(page=="appSettingsTab")
		{
			var tempArray={};
			tempArray['requiredData']={};
			tempArray['requiredData']['updateSettings']={};
			tempArray['requiredData']['getSettingsAll']=1;
				tempArray['requiredData']['updateSettings']['general']={};
			var IPArray={};
			var arrayCounter=0;
			$(".ip_cont","#IPContent").each(function () { 
			IPArray[arrayCounter]=$(".IPData",this).text();
			arrayCounter++;
			
			});
			
			if($("#sendAnonymous").hasClass('active'))
			var anonymous=1;
			else
			var anonymous=0;
			if($("#enableFsockFget").hasClass('active'))
			var enableFsockFget=1;
			else
			var enableFsockFget=0;
			if($("#enableReloadDataPageLoad").hasClass('active'))
			var enableReloadDataPageLoad=1;
			else
			var enableReloadDataPageLoad=0;
			
			if($("#authUsername").val()!='username')
			{
			tempArray['requiredData']['updateSettings']['general']['httpAuth']={};
			tempArray['requiredData']['updateSettings']['general']['httpAuth']['username']=$("#authUsername").val();
			tempArray['requiredData']['updateSettings']['general']['httpAuth']['password']=$("#authPassword").val();
			}
			tempArray['requiredData']['updateSettings']['general']['MAX_SIMULTANEOUS_REQUEST_PER_IP']=$("#amount01").val();
			tempArray['requiredData']['updateSettings']['general']['MAX_SIMULTANEOUS_REQUEST_PER_IP']=$("#amount01").val();
			tempArray['requiredData']['updateSettings']['general']['MAX_SIMULTANEOUS_REQUEST']=$("#amount02").val();
			tempArray['requiredData']['updateSettings']['general']['TIME_DELAY_BETWEEN_REQUEST_PER_IP']=$("#amount03").val();
			tempArray['requiredData']['updateSettings']['allowedLoginIPs'] = IPArray;
			tempArray['requiredData']['updateSettings']['general']['sendAnonymous'] = anonymous;
			tempArray['requiredData']['updateSettings']['general']['enableFsockFget'] = enableFsockFget;
			tempArray['requiredData']['updateSettings']['general']['enableReloadDataPageLoad'] = enableReloadDataPageLoad;
			tempArray['requiredData']['getSettingsAll']=1;
			doCall(ajaxCallPath,tempArray,"processAppSettings","json","none");
			
			
		}
    
    });
	$(".triggerSettingsButton").live('keyup',function(){
		var closestVar=$(this).closest('.valid_cont');
		$('.valid_error',closestVar).hide();
        $("#saveSettingsBtn").removeClass('disabled');
    });

$("#addIP").live('click',function() {
	$("#noIP").remove();
	var ipVal=$("#tempIP").val();
	if(ipVal!='')
	$("#IPContent").append('<div class="ip_cont"><span class="droid700 IPData">'+ipVal+'</span><span class="remove removeIP" onclick="">remove</span></div>');
		triggerSettingsButton();
});
$(".removeIP").live('click',function() {
	$(this).closest('.ip_cont').remove();
	triggerSettingsButton();
});
$("#sendAnonymous, #enableFsockFget, #enableReloadDataPageLoad, #clearPluginCache").live('click',function() { 
makeSelection(this);
});
$("#change_pass_btn").live('click',function () {
	
	showOrHide(this,'',"changePassContent")

});
$(".deleteBackup").live('click',function () {
	var closestVar=$(this).closest('.item_ind');
	var topVar=$(closestVar).closest('.topBackup');
	var closestUpdatee=$(closestVar).closest('.row_updatee');
	var mainClosestVar=$(this).closest('.row_backup_action');
	
	

		   if($(this).hasClass('yes'))
	   {
	 var tempArray={};
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
$(".adminPopout").live('click',function(e) {
	if($(this).attr('clicked')!=1)
	{
	loadAdminPopout(this,$(this).attr('sid'));
	$(this).attr('clicked','0');
	}
	
e.stopImmediatePropagation();

});
$(".removeSite").live('click',function() {
	loadRemoveSite($(this).attr('sid'));
	resetBottomToolbar();

});
$(".newPost").live('click',function() {
		
		loadAdminHere($(this).attr('sid'),1);
	
		
	

});

	
$(".editEmail").live('click',function() {
	var closestVar=$(this).closest('.td');
	
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
	var tempArray={};
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
doCall(ajaxCallPath,tempArray,'processRemoveSite');
return false;

	
	
});
$(".addSiteToggleAction").live('click',function(e) {
	
	$(".addSiteToggleDiv").hide();
	if(!$(this).hasClass('active'))
	{
	if($(this).hasClass("assignToggleAction"))
	{
	$("#modalDiv .nano").nanoScroller({stop: true});
	$(".assignGroupItem").show();
		
	$("#modalDiv .group_selector").css('height',$("#modalDiv .group_selector").height()).addClass('nano');
	$("#modalDiv .nano").nanoScroller();
	}
	else if($(this).hasClass("folderToggleAction"))
	{
		$(".folderProtectionItem").show();
	}
	$(".addSiteToggleAction").removeClass('active');
	$(this).addClass('active');
	}
	else
	{
	if($(this).hasClass("assignToggleAction"))
	{
	$(".assignGroupItem").hide();
	}
	else if($(this).hasClass("folderToggleAction"))
	{
	$(".folderProtectionItem").hide();
	
	}
	$(this).removeClass('active');
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
	
	var topParent="#"+currentUpdatePage;
	makeSelection(this);
	
	if($(this).hasClass('active'))
	{
	$("#mainUpdateCont .hiddenCheck").hide();
	viewHiddenFlag=1;

	$("#mainUpdateCont .hideVar").show();
		$("#mainUpdateCont .hidden").show();
	
	}
	else
	{
	checkUpdateEmpty();
	viewHiddenFlag=0;
	$("#mainUpdateCont .hideVar").hide();
	$("#mainUpdateCont .hidden").hide();
	
	
	}

});

// Assign groups Hide

$(".thumb").live('click',function() {
	var url=$(this).attr('preview');
	loadPreview(url);
});

	
$("#bottom_sites_cont, #settings_cont, .updatePanelData, #activityPopup").live('click',function(e) {
	
	if(e.target.nodeName!='A' || ($(e.target).attr('href')==undefined || $(e.target).attr('href')==''))
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
		$(".th_btm_info").remove();
	$("#enterBackupDetails").before('<div class="th_btm_info rep_sprite_backup">A maximum of only 5 backups will be stored. Successive backups will over-write existing backups.</div>');
		$(this).addClass('current').removeClass('completed');
	$("#selectWebsitesTab").removeClass('current').addClass('completed');
	$("#backupOptions,#backupNow").show();
	$(".siteSelectorContainer,#enterBackupDetails").hide();
	}
});
$("#selectWebsitesTab").live('click',function() {
	$(".th_btm_info").remove();
	showBackupOptions();
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
 else
 {
	 if($(this).hasClass('groupClear'))
	 $("#duplicateGroup").remove();
 }

});
$(".closeBottomToolBar").live('click',function(e) {
	resetBottomToolbar();
});
$(".groupClear").live('focus',function(e) {
	
});
 loadSettingsPage(settingsData);

   if(totalSites>0 && (settingsData.data.getSettingsAll.settings.general.enableReloadDataPageLoad==undefined || settingsData.data.getSettingsAll.settings.general.enableReloadDataPageLoad==1) )
   $("#reloadStats").click();
  
   $("#currentVersionNumber").text('v'+appVersion);
   if(updateAvailable==false)
   loadPanelUpdateDefault();
   else
   loadPanelUpdate(updateAvailable);
  
 $(".sendReport").live('click',function() {
var tempDataArray={};
tempDataArray['requiredData']={};
tempDataArray['requiredData']['getReportIssueData']=$(this).attr('actionid');
doCall(ajaxCallPath,tempDataArray,'loadReport','json');
$("#historyQueue").hide();
return false;

});
$(".moreInfo").live('click',function() {
var tempDataArray={};
tempDataArray['requiredData']={};
tempDataArray['requiredData']['getResponseMoreInfo']=$(this).attr('historyid');
doCall(ajaxCallPath,tempDataArray,'loadMoreInfo','json');
$("#historyQueue").hide();
return false;

});
 $("#sendReportBtn").live('click',function() {
var tempDataArray={};
tempDataArray['requiredData']={};
tempDataArray['requiredData']['sendReportIssue']={};
tempDataArray['requiredData']['sendReportIssue']['email'] = $("#emailToReport").val(); 
if($(this).attr('actiontype')=='historyIssue'){
tempDataArray['requiredData']['sendReportIssue']['report'] = $("#panelHistoryContent").val(); 
tempDataArray['requiredData']['sendReportIssue']['actionID'] = $("#panelHistoryActionID").val();
}
tempDataArray['requiredData']['sendReportIssue']['comment'] = $("#customerComments").val(); 
tempDataArray['requiredData']['sendReportIssue']['appVersion'] = appVersion;
tempDataArray['requiredData']['sendReportIssue']['type'] = $(this).attr('actiontype');
tempDataArray['requiredData']['sendReportIssue']['appInstallHash'] = appInstallHash;
if($("#customerComments").val()!='')
{
	$("#customerComments").removeClass('error');
$(this).append('<div class="btn_loadingDiv left"></div>').addClass('disabled');
doCall(ajaxCallPath,tempDataArray,'processReport','json','noProgress');
}
else 
$("#customerComments").addClass('error');

});
$(".emailFrequency").live('click',function() {
	optionSelect(this);
	
	
});
$("#sendTestEmail").live('click',function() {
	var tempDataArray={};
	tempDataArray['requiredData']={};
tempDataArray['requiredData']['updatesNotificationMailTest']=1;
$(this).removeClass('failure').removeClass('success');
$(this).addClass('sending');
doCall(ajaxCallPath,tempDataArray,'processTestEmail','json','noprogress');
});
$("#updateNotifyClose").live('click',function() { 
var tempDataArray={};
tempDataArray['requiredData']={};
tempDataArray['requiredData']['updateHideNotify']=$(this).attr('version');
doCall(ajaxCallPath,tempDataArray,'','json');
$("#updates_centre_notif").remove();
});
$("#updateActionBtn").live('click',function() { 
$(this).prepend('<div class="btn_loadingDiv left"></div>').addClass('disabled');

if($(this).attr('btnAction')=="check")
{
var tempDataArray={};
tempDataArray['requiredData']={};
tempDataArray['requiredData']['forceCheckUpdate']=1;
doCall(ajaxCallPath,tempDataArray,'processCheckUpdate','json');
return false;
}
else if($(this).attr('btnAction')=="update")
{
	$("#updateOverLay").show();
	$("#updates_centre_cont").css({"z-index":"1021","box-shadow":"0 0 46px rgba(0,0,0,0.7)"});
	processUpdateNow($(this).attr('version'));
	stopAllAction=true;
	$("#updateCentreBtn").css({'position':'relative','z-index':'1020'}).die();
	return false;
}

});
$("#updateCentreBtn").live('click',function() { 
showOrHide(this,'active','updates_centre_cont','');
closeDialogs(1);
return false;
});
$("#updateClientConfirm").live('click',function() { 
var tempDataArray={};
tempDataArray['action']='updateClient';
tempDataArray['args']={};
tempDataArray['args']['siteIDs']=clientUpdateSites;
doHistoryCall(ajaxCallPath,tempDataArray,'','json');
$("#modalDiv").dialog("destroy");
clientUpdateSites=false;
return false;
});
$(".notNowUpdate").live('click',function() { 
notNowUpdate=true;
$("#modalDiv").dialog("destroy");
});
$(".closeTour").live('click',function() { 
 tempArray={}; tempArray['requiredData']={}; valArray={}; valArray['closeTour']=true; tempArray['requiredData']['updateUserhelp']= valArray; tempArray['requiredData']['getUserHelp']= 1;  doCall(ajaxCallPath,tempArray,'setTooltipData');
});
if(toolTipData.closeTour!="true")
loadFeatureTourPopup();
$(".takeTour").live('click',function() { 
loadFeatureTour();
});
	$(".nano").nanoScroller();
	$(".n_close").live('click',function() { 
$(this).closest('.notification').remove();
});
$(".editSiteBtn").live('click',function() { 
loadAddSite();
$(".dialog_cont .title").text("EDIT SITE DETAILS");
$(".dialog_cont .activationKeyDiv").hide();
$(".dialog_cont .adminURLDiv").show();

$(".dialog_cont .addSiteButton").text('Save Changes').addClass('editSite').attr('sid',$(this).attr('sid'));
$(".dialog_cont #websiteURL").attr("disabled","disabled").val(site[$(this).attr('sid')].URL).addClass("disabled");
$(".dialog_cont #adminURL").val(site[$(this).attr('sid')].adminURL);
$(".dialog_cont #username").val(site[$(this).attr('sid')].adminUsername).focus();
$("#clientPluginDescription").hide();
if(site[$(this).attr('sid')].httpAuth!=undefined && site[$(this).attr('sid')].httpAuth.username!=undefined)
$(".dialog_cont #addSiteAuthUsername").val(site[$(this).attr('sid')].httpAuth.username);
if(site[$(this).attr('sid')].httpAuth!=undefined && site[$(this).attr('sid')].httpAuth.password!=undefined)
$(".dialog_cont #addSiteAuthUserPassword").val(site[$(this).attr('sid')].httpAuth.password);
if(getPropertyCount(site[$(this).attr('sid')].groupIDs)>0)
{
$.each(site[$(this).attr('sid')].groupIDs, function(i, object) {
	$(".addSiteGroups .g"+object).addClass('active');
});
}

});
	dynamicResize();
	
  /* -------------	   -------------	   -------------	   -------------	   -------------	   -------------	   -------------	   -------------	   -------------	   -------------	   -------------	  */
  });
  
  
  