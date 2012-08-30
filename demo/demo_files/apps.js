var manage = {};
var activeItem='plugins';
var g1 = 'w1,w2,w3,w4'; // the groups with site id seperated.
var timeOut='';
selectedGroup = {}; // Array for grouping sites
var groupEditFlag = 0;
var incrementRand=0;
var siteSelectorVar='';
var bottomToolbarVar='';
var updateCheckArray = {};
var currentPage='';
var ajaxCallPath='ajax.php';
var groupCounter=0;
var groupCreateArray={};
var groupChangeArray={};
var groupNameArray={}
var groupDeleteArray={}

var currentPage='updates';
var state ;
var currentUpdatePage;
var parentFlag=0;
updateCheckArray={};
viewHiddenFlag=0;
var toobarAddsite='';
var toobarHiddenUpdates='';
var historyRefreshFlagCheck = 0;
function echeck(str) {

	var at="@"
	var dot="."
	var lat=str.indexOf(at)
	var lstr=str.length
	var ldot=str.indexOf(dot)
	if (str.indexOf(at)==-1){
			   return false
	}

	if (str.indexOf(at)==-1 || str.indexOf(at)==0 || str.indexOf(at)==lstr){
	   return false
	}

	if (str.indexOf(dot)==-1 || str.indexOf(dot)==0 || str.indexOf(dot)==lstr){
		
		return false
	}

	 if (str.indexOf(at,(lat+1))!=-1){
		return false
	 }

	 if (str.substring(lat-1,lat)==dot || str.substring(lat+1,lat+2)==dot){
		return false
	 }

	 if (str.indexOf(dot,(lat+2))==-1){
		return false
	 }
	
	 if (str.indexOf(" ")!=-1){
		return false
	 }

	 return true					
}
/* 
 * To Title Case 2.0.1 – http://individed.com/code/to-title-case/
 * Copyright © 2008–2012 David Gouch. Licensed under the MIT License. 
 */

String.prototype.toTitleCase = function () {
  var smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|of|on|or|the|to|vs?\.?|via)$/i;

  return this.replace(/([^\W_]+[^\s-]*) */g, function (match, p1, index, title) {
    if (index > 0 && index + p1.length !== title.length &&
      p1.search(smallWords) > -1 && title.charAt(index - 2) !== ":" && 
      title.charAt(index - 1).search(/[^\s-]/) < 0) {
      return match.toLowerCase();
    }

    if (p1.substr(1).search(/[A-Z]|\../) > -1) {
      return match;
    }

    return match.charAt(0).toUpperCase() + match.substr(1);
  });
}
function getPropertyCount(obj) {
    var count = 0,
        key;

    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            count++;
        }
    }

    return count;
}
function checkUpdateEmpty()
{
if($("#siteViewUpdateContent .ind_row_cont").not(".hide,.hideVar").length<1 && !$("#siteViewUpdateContent .empty_data_set").not('hiddenCheck').is(":visible"))
$("#siteViewUpdateContent .hiddenCheck").show();
if($("#themeViewUpdateContent .ind_row_cont").not(".hide,.hideVar").length<1 && !$("#themeViewUpdateContent .empty_data_set").not('hiddenCheck').is(":visible"))
$("#themeViewUpdateContent .hiddenCheck").show();
if($("#pluginViewUpdateContent .ind_row_cont").not(".hide,.hideVar").length<1 && !$("#pluginViewUpdateContent .empty_data_set").not('hiddenCheck').is(":visible"))
$("#pluginViewUpdateContent .hiddenCheck").show();
if($("#WPViewUpdateContent .ind_row_cont").not(".hide,.hideVar").length<1 && !$("#WPViewUpdateContent .empty_data_set").not('hiddenCheck').is(":visible"))
$("#WPViewUpdateContent .hiddenCheck").show();
}
function applyChangesCheck()
{
	if($(".actionButton").hasClass('active'))
	$(".status_applyChangesCheck").removeClass('disabled');
	else
	$(".status_applyChangesCheck").addClass('disabled');
}
function historyRefresh()
{
	tempArray={};
		  tempArray['requiredData']={};
		   tempArray['requiredData']['getHistoryPanelHTML']=1;
		   doCall(ajaxCallPath,tempArray,'reloadHistory','json',"noProgress",1);
		 
}
function setTooltipData(data)
{
	toolTipData=data.data.getUserHelp;
}
function processRepository(data)
{
	data=data.data.getWPRepositoryHTML;
	content=content+data;
	   if(activeItem=='plugins')
	     content=content+'</div>';
		 else
		 content=content+'<div class="clear-both"></div></div></div>';
	  $(".wp_repository_cont").html(content);
}
function getTotalUpdates(mnjson)
{
gpluginsjson = mnjson.pluginsView.plugins;
gthemesjson = mnjson.themesView.themes;
gwpjson = mainJson.coreView.core;
	if(gwpjson!=undefined)
	WPCount= getPropertyCount(gwpjson);
	else
	WPCount=0;
	if(gpluginsjson!=undefined)
	pluginsCount=getPropertyCount(gpluginsjson);
	else
	pluginsCount=0;
	if(gthemesjson!=undefined)
	themesCount=getPropertyCount(gthemesjson);
	else
	themesCount=0;
	totalCount = WPCount+pluginsCount+themesCount;
	return totalCount;
}
function resetBottomToolbar()
{
	$(".showFooterSelector").removeClass('pressed');
	$("#bottom_sites_cont").hide();
	$("#bottomToolbarOptions").remove();
	
}
function processRemoveSite(data)
{
	
	errdata=data.actionResult.detailedStatus[0];
	$(".btn_loadingDiv").remove();

	if(errdata.status!='success')
	{
		
			errorMsg='Site removed from the panel.<br>However following error occured:<span class="error_txt"> '+errdata.errorMsg+'</span>';
			errContent='<span class="successMsg"><span class="success_icon"></span>'+errorMsg+'</span>';
			$("#removeSiteCont").html(errContent);
			$("#removeSiteButtons").hide();
		
	}
	else
setTimeout(function () {	$("#modalDiv").dialog("close");},1000);
	resetVars(data);
	refreshStats(data);
}
function processAddSite(data)
{
	$(".addSiteButton").removeClass('disabled');
	$(".btn_loadingDiv").remove();
	errdata=data.actionResult.detailedStatus[0];
	if(errdata.status!='success')
	{
		if(errdata.error=='main_plugin_connection_error')
		{
		plink=$("#websiteURL").val()+'/wp-admin/plugin-install.php?tab=search&type=term&s=iwp-client&plugin-search-input=Search+Plugins';
		errorMsg='Yikes! It appears IWP plugin has not been installed in this site. Click here to <a href="'+plink+'">Install</a> it.<br>OR<br>If you have already installed IWP Plugin, deactivate and activate it now.';
		}
		else
		errorMsg=errdata.errorMsg;
		errContent='<span id="addSiteErrorMsg"><span class="fail_icon"></span>'+errorMsg+'</span>';
	$("#addSiteSprite").after(errContent);
	}
	else
	{
	$(".add_site.form_cont").html('<span id="addSiteSuccessMsg"><span class="success_icon"></span>Voila! Your site has been added successfully.</span>');
	$(".addSiteButton").hide();
	setTimeout(function () {	$("#modalDiv").dialog("close");},1000);
	resetVars(data);
	refreshStats(data);
	}
}
function updateCountRefresh()
{
	$("#totalUpdateCount").text(mainJson.totalUpdateCount);
}
function refreshStats(data)
{
	$("#reloadStats").removeClass('disabled');
	$("#reloadStats").closest('div').removeClass('disabled');
	$(".btn_loadingDiv ").remove();
	mainJson=data.data.getSitesUpdates;
 	sitesjson = mainJson.siteView;
	pluginsjson = mainJson.pluginsView.plugins;
	themesjson = mainJson.themesView.themes;
	wpjson = mainJson.coreView.core;
	updateCountRefresh();
	processPage(currentPage,1);
		
}
function validateZipURL(url)
{
	
	var pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
	if(url.match(pattern))
	return true;
	else
	return false;
}
function reloadHistory(data)
{
	checkHistoryVar=0;
	   if(!$("#historyQueue").is(":visible"))
	 checkHistoryVar=1;
	 (document.getElementById("activityPopup")).innerHTML = "";
	$("#activityPopup").html(data.data.getHistoryPanelHTML);
	if(checkHistoryVar==1)
	   $("#historyQueue").hide();
	     $(".nano").nanoScroller();
		$("#historyQueue .queue_detailed").nanoScroller(); 
  
}
function reloadFavourites(data)
{
	favourites=data.data.getFavourites;
}
function createUploader(){            
            var uploader = new qq.FileUploader({
                element: document.getElementById('uploaderContent'),
                action: systemURL+'uploadScript.php',
                debug: true
            });           
        }
function showBackupOptions(object)
{
	if(!isSiteSelected(object))
	$("#enterBackupDetails").addClass('disabled clickNone');
	else
	$("#enterBackupDetails").removeClass('disabled clickNone');
$("#modalDiv").dialog( "option", "position", 'center' );
}
function showItemOptions(object)
{
	
	
	$(".optionsContent").show();// For manage / install panel
	$(".actionContent").html('');


	$(".numSiteSelected").text($(".website_cont.active").length);
}
function removeDeleteConf()
{
	 $(".del_conf").hide();
	   $(".ind_groups","#bottom_sites_cont").removeClass('error');
}
function resetSelectors()
{
siteSelector();
	$("#bottomToolBarSelector").html(bottomToolbarVar);
	$(".siteSelectorContainer").html(siteSelectorVar);
	$('.select_group_toolbar').dropkick({
width: 148,
footer: true,
  change: function (value, label) {
   filterByGroup(this,value);
  }
  
});
 $(".toggle_manage_groups").qtip({id:"toggleGroupQtip",content: { text: 'Manage Groups' }, position: { my: 'bottom center', at: 'top center',  adjust:{ y: -6} }, show: { event: 'mouseenter' }, hide: { event: 'mouseleave' }, style: { classes: 'ui-tooltip-shadow ui-tooltip-dark',  tip: {  corner: true, width: 10, height:5} } });
	resetGroup();
}
// From plugin theme manage / install panel
function resetVars(data)
{
	data=data.data;
	site=data.getSites;
	group=data.getGroupsSites;
	totalSites = getPropertyCount(site);
	totalGroups = getPropertyCount(group);
	totalUpdates =  getPropertyCount(mainJson)
	resetSelectors();
}
function processSaveChange(data)
{
	if($("#toolbar_sites_cont","#bottomToolBarSelector").length>0 && $("#toolbar_sites_cont","#bottomToolBarSelector").is(":visible"))
	tempToolCont="<div id='toolbar_sites_cont'>"+$("#toolbar_sites_cont").html()+"</div>";
	else
	tempToolCont='';
	 resetVars(data);
	var groupCreateArray={};
	var groupChangeArray={};
	var groupNameArray={}
	var groupDeleteArray={}
	$("#addWebsiteContainer","#bottomToolBarSelector").after(tempToolCont);
}

function processPage(page,reloadPage)
{
	currentPage=page;
	$(".WTPages").hide();
	if(page=="updates")
	{
		$("#demoUpdateCont").show();
		
	}
	else if(page=="items")
	{
		$("#pluginManageCont").show();
	
	}
	
		else if (page=="backups")
	{
		$("#backupCont").show();
		
	}
	
	else if(page=="history")
	{
		$("#activityCont").show();
		
	}
	

	
}

function groupSelected() // For add site
{
	arrayCounter=0;
	selectedGroup = {};
	$(".group_selector.active",".addSiteGroups").each(function () {
	selectedGroup[arrayCounter]=$(this).attr("gid");
	});
	return selectedGroup;
}
function testAlert(request)
{
	
}
  function getSelectedSites()
  { 
  selectedSites= {} ;
	  arrayCounter=0;
	  $('.website_cont.active',".siteSelectorContainer").each( function () { 
	  selectedSites[arrayCounter]= $(this).attr('sid');
	  arrayCounter++;
	  });
	  return selectedSites;
  }
  function installItems(object,dlink,multiple)
  {
	
	 
	 if(dlink==undefined || dlink=='')
	 dLink=$(object).attr('dlink');
	 else
	 dLink=dlink;
		  /*  if(mainArray['args']['sites']==undefined)
		  mainArray['args']['sites']={};
		  mainArray['args']['sites']=selectedSites;*/
	  tempArray={};
	  tempArray['args']={};
	    tempArray['args']['params']={};
		tempArray['args']['siteIDs']={};
	  params={};
	  tempArray['action']="install"+activeItem.toTitleCase();

params[activeItem]={};
if(multiple>0)
{
tempArray['args']['siteIDs']=getSelectedSites();
if(multiple==2)
params[activeItem]=dLink;
else
params[activeItem][0]=dLink;
}
else
{
	tempArray['args']['siteIDs'][0]=$(object).attr('sid');
	params[activeItem][0]=dLink;
}

if($('.activateItem').hasClass('active'))
params['activate'] = true;
if($('.overwriteItem').hasClass('active'))
params['clearDestination'] = true;
tempArray['args']['params'] = params;
doHistoryCall(ajaxCallPath,tempArray);

	
  }
function processAppSettings(data)
{
	$("#saveSettingsBtn").removeClass('disabled');
			$(".btn_loadingDiv").remove();
		$("#saveSuccess").show();
		setTimeout(function () {	$("#settings_cont").hide(); $("#saveSuccess").hide();},1000);
		$("#settings_btn").removeClass('active');
		loadSettingsPage(data);
			
}
 function ajaxRepositoryCall(data)
 {
	
	 content='';
	 	 if(activeItem=='plugins')
	 {
	 content='<div class="th_sub rep_sprite" style="border-top:1px solid #D2D5D7;"> <div class="label" style="float:left;"><span style="margin-right:193px;">PLUGIN NAME</span></div> <div class="label" style="float:left;"><span style="margin-right:26px;">VERSION</span></div> <div class="label" style="float:left;"><span style="margin-right:28px;">RATING</span></div> <div class="label" style="float:left;"><span style="">DESCRIPTION</span></div> </div><div class="wp_repository_search_results">';
	 }
	 else
	 content='<div class="wp_repository_search_results" style="border-top:1px solid #D2D5D7;"><div class="tr_theme">';
	 
	   content=content+data.data.getWPRepositoryHTML;
	   if(activeItem=='plugins')
	     content=content+'</div>';
		 else
		 content=content+'<div class="clear-both"></div></div></div>';
	  $(".wp_repository_cont").html(content);
	  $(".searchItem").removeClass('disabled');
	  $(".btn_loadingDiv").remove();
  if($(".searchCont").is(":visible") && $(".searchVar.active").attr('dval')!="search")
  $(".searchCont").hide();
 }

function installFavourites()
{installArray={};
arrayCounter=0;
	$(".favItems.active a").each(function () {
		dlink=$(this).attr('dlink');
		type=$(this).attr('utype');
		installArray[arrayCounter]=dlink;
		
		arrayCounter++;
	});
installItems('',installArray,2);
}
function removeActiveElements() // Used for items management
{
	$("#view_content .applyChangesCheck").each(function () {
		if($(this).hasClass('active'))
		$(this).closest("ul").before('<div class="queued_single">Queued..</div>').hide();
	});
}
function applyChanges(object)
{
	changeArray={};
	arrayCounter=0;
	closestVar=$(object).closest('.siteSearch');
	$(".applyChangesCheck.active").each(function () {
		
		if(!$(this).closest('.ind_row_cont').hasClass('hide'))
		{
		siteID=$(this).attr('sid');
		dID=$(this).attr('did');
		type=$(this).attr('utype');
		action=$(this).attr('action');
		name=$(this).attr('itemName');
		if(changeArray[siteID]==undefined)
		changeArray[siteID]={};
		if(changeArray[siteID][type]==undefined)
		changeArray[siteID][type]={};
		valArray={};
		valArray['name']=name;
		valArray['path']=dID;
		valArray['action']=action;
		if(activeItem=="themes")
		valArray['stylesheet']=$(this).attr('stylesheet');
		changeArray[siteID][type][arrayCounter]=valArray;
		arrayCounter++;
		}
		
	});
	tempArray={};
	tempArray['args']={};
	tempArray['args']['params']={};
	tempArray['action']='manage'+activeItem.toTitleCase();
	tempArray['args']['params'] = changeArray;
	doHistoryCall(ajaxCallPath,tempArray,'');
}
function isSiteSelected(object) // Used for managepanel 
{
	
	closestVar=$(object).closest('.siteSearch');
	
	if($(".website_cont",closestVar).hasClass('active'))
	{
		
	return true;
	}
	else
	return false;
	
}
function triggerSettingsButton()
{
	$("#saveSettingsBtn").removeClass('disabled');
}
function processSettingsForm(data)
{
	mainData=data;
	data=data.data.updateAccountSettings;
	$("#saveSettingsBtn").removeClass('disabled');
	$(".btn_loadingDiv").remove();
	if(data.status=='error' && data.error=='invalid_password')
	{
	  closestVar=$("#currentPassword").closest(".valid_cont");
			  $(".valid_error",closestVar).show();
            $(".valid_error div",closestVar).text('Invalid password. Kindly Check again.');
	}
	else
{
	$("#saveSuccess").show();
		setTimeout(function () {	$("#settings_cont").hide(); $("#saveSuccess").hide();},1000);
			$("#settings_btn").removeClass('active');
			loadSettingsPage(mainData);
		
}
}
function validateSettingsForm()
{
		
	var hasError = false;
	    var passwordVal = $("#newPassword").val();
        var checkVal = $("#newPasswordCheck").val();
		   var currentPassword = $("#currentPassword").val();
		   if(currentPassword == '' || currentPassword=='Current Password')
		   {
			   
			   closestVar=$("#currentPassword").closest(".valid_cont");
			  $(".valid_error",closestVar).show();
            $(".valid_error div",closestVar).text('Please enter a password.');
		   }
        if (passwordVal == '' || passwordVal == 'New Password' ) {
	
			closestVar=$("#newPassword").closest(".valid_cont");
			
			$(".valid_error",closestVar).show();
            $(".valid_error div",closestVar).text('Please enter a password.');
            hasError = true;
        } else if (checkVal == '' || checkVal == 'New Password Again') {
			
			closestVar=$("#newPasswordCheck").closest(".valid_cont");
				$(".valid_error",closestVar).show();
            $(".valid_error div",closestVar).text('Please re-enter your password.');
            hasError = true;
        } else if (passwordVal != checkVal ) {
		
		
			closestVar=$("#newPasswordCheck").closest(".valid_cont");
					$(".valid_error",closestVar).show();
			$(".valid_error div",closestVar).text('Passwords do not match.');
            //$("#password-check").after('<span class="error">Passwords do not match.</span>');
            hasError = true;
        }
		$("#saveSettingsBtn").removeClass('disabled');
	$(".btn_loadingDiv").remove();
		return hasError;
		
	    
}
function doCall(url,data,callback,dataType,animationLoad,historyRefreshCheck)
{
	
	/*if(historyRefresh==1 && historyRefreshCheckFlag==0 )
	historyRefreshCheckFlag=1
	else if(historyRefresh==1 && historyRefreshCheckFlag==1)
	return false;
	if(animationLoad!="noProgress")
	$("#process_queue").addClass('in_progress');
	if(animationLoad==undefined)
{
	animationLoad="normal";
	loaderDiv="#loadingDiv";
}
	if(animationLoad=="normal")
 $(loaderDiv).show();
	if(dataType==undefined)
	dataType='json';
	
$.ajax({    
 traditional: true,
 type: 'post',
 url: url,
 dataType: dataType,
   data: $.param(data),
 success: function(request) {
	  //console.log(request);
	if(animationLoad=="normal")
 $(loaderDiv).hide();

	historyRefreshCheckFlag=0;
	
	  if(request.logout!=undefined && request.logout==true)
	  {
		  window.location.href = "login.php";
	  }
	  if(callback!=undefined)
   eval(callback+"(request)");
   

 
 }  // End success
});*/
}
function doHistoryCall(url,data,callback,dataType)
{
	if(data['requiredData']==undefined)
	data['requiredData']={};
	data['requiredData']['getHistoryPanelHTML']=1;
	$("#process_queue").addClass('in_progress');
	$("#historyQueue").show();
	$(".queue_ind_item_cont .content").prepend('<div class="queue_ind_item historyItem">Adding to queue ...<div class="clear-both"></div></div>');
	/*
	if(dataType==undefined)
	dataType='json';
	$.ajax({    
 traditional: true,
 type: 'post',
 url: url,
 dataType: dataType,
   data: $.param(data),
 success: function(request) {
	   if(request.logout!=undefined && request.logout==true)
	  {
		  window.location.href = "login.php";
	  }
   //$("#historyQueue").html(request);
   if(dataType=="json")
   {
   $("#activityPopup").html(request.data.getHistoryPanelHTML);
      $(".nano").nanoScroller();
   }
//     console.log(request.data.getHistoryPanelHTML);
   if(callback!=undefined)
   eval(callback+"(request)");
  // $("#activityPopup").html(request.data.getHistoryPanelHTML);
 }  // End success
});*/
}
function cancelEvent(e)

{

  e = e ? e : window.event;

  if(e.stopPropagation)

    e.stopPropagation();

  if(e.preventDefault)

    e.preventDefault();

  e.cancelBubble = true;

  e.cancel = true;

  e.returnValue = false;

  return false;

}


//Code for search fixing case sensitive in search.
jQuery.expr[':'].contains = function(a,i,m){
    return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase())>=0;
};
             
			 function getFirstKey(object,count)
{
	$.each(object, function(key, value) {
		if(count==2)
		{
		$.each(value, function(key1, value1) {
			tempVal=value1;
		return false;
		});
		}
		else
		{
		tempVal=key;
		return false;
		}
		
	});
	return tempVal;
}
function makeHistorySelection(object,parentClass)
{
	if(parentClass==undefined)
	parentClass="parent";
	$(".queue_detailed","."+parentClass).hide();
	if(!$(object).hasClass('active'))
	{
		$(".historyItem","."+parentClass).removeClass('active');
	$(object).addClass('active');
	$("#"+$(object).attr('did')).show();
	$("#"+$(object).attr('did')).nanoScroller();
	}
	else
	{
		$(object).removeClass('active');
	$("#"+$(object).attr('did')).hide();
	}

	
}
function siteSelector()
{
	scontent='';
	sgcontent='';
	sscontent='';
	bcontent='';
	bgcontent='';
	bscontent='';
	 if(group!=null && group!=undefined &&  getPropertyCount(group)>0)
	 {
	$.each(group, function(key,value) {
		if(value.siteIDs!=undefined)
		totalSiteCount=value.siteIDs.length;
		else
		totalSiteCount=0;
		sgcontent=sgcontent+'<div class="group_cont rep_sprite" id="g'+key+'" gid="'+key+'"><a title="'+value.name+'">'+value.name+'</a></div>';
		bgcontent=bgcontent+'<div class="ind_groups" id="g'+key+'" gid="'+key+'"><a title="'+value.name+'"><span class="count_cont">'+totalSiteCount+'</span><input name="" type="text" value="'+value.name+'" class="groupEditText" /></a>   <div class="del_conf"><div class="label">Sure?</div><div class="yes deleteGroup">Yes</div><div class="no deleteGroup">No</div></div><div class="edit_del_cont"> <div class=" rep_sprite bg "><span class="rep_sprite_backup edit editGroup"></span></div> <div class=" rep_sprite bg"><span class=" rep_sprite_backup del deleteConf"></span></div> </div></div>';
		});
	 }
	 else
	 {
		 sgcontent='';
		 bgcontent='<div class="empty_data_set websites"> <div class="line1" style="margin-top:200px;">Organize your wordpress sites into groups for easy managing.</div> <div class="line2">Go ahead. Create a group now.</div> <div class="arrow2"></div> </div>';
	 }
	 //var site = eval('([])');
	 if(site!=null && site!=undefined &&  getPropertyCount(site)>0)
	 {
	$.each(site, function(key,value) {
		sscontent=sscontent+'<div class="website_cont searchable deselectGroups" id="s'+key+'"  sid="'+key+'"><a title="'+value.name+'">'+value.name+'</a></div>';
		bscontent=bscontent+'<div class="ind_sites searchable js_sites bottomSites"  id="s'+key+'" sid="'+key+'"><a title="'+value.name+'" class="site_selector_name"><span><img src="https://getfavicon.appspot.com/'+value.URL+'?defaulticon=http://s.wordpress.org/favicon.ico"></span>'+value.name+'</a></div>';
		});
	 }
	 else
	 {
		 sscontent='';
		 bscontent='<div class="empty_data_set websites"> <div class="line1">No websites added yet..</div> <div class="line2">That makes us sad. Come on.<br /> Lets add one of your wordpress sites.</div> <div class="add_site_arrow"></div> </div>';
	 }
			scontent='<div class="site_selector1 shadow_stroke_box siteSearch"> <div class="bygroup"><div class="th rep_sprite"><div class="title">by <span class="droid700">Groups</span></div><div class="clear-both"></div></div>';
	scontent=scontent+'<div class="group_items_cont"><div class="group_cont rep_sprite" id="g0"><a>All Wedbsites</a></div>';
		scontent=scontent+sgcontent+'</div></div>'; // class bygroup ends here
	scontent=scontent+'<div class="bywebsites"> <div class="th rep_sprite"> <div class="title">by <span class="droid700">Websites</span></div> <div class="type_filter"> <input name="" value="type to filter" type="text" class="input_type_filter search_site" ><div class="clear_input rep_sprite_backup"></div> </div> <div class="select_cont"><span>Select: </span><a class="siteSelectorSelect">All</a><a class="siteSelectorSelect">Invert</a><a class="siteSelectorSelect">None</a></div> <div class="clear-both"></div> </div> <div class="website_items_cont">';
		scontent=scontent+sscontent+'<div class="no_match hiddenCont" style="display:none">Bummer, there are no websites that match.<br />Try typing lesser characters.</div> </div></div> <div class="clear-both"></div> </div>';
		bcontent='<div id="bottom_sites_cont" style="display:none"><div id="bottom_left" class="float-left"><div class="list_cont nano"><div class="content"><div class="no_match hiddenCont" style="display:none">Bummer, there are no websites that match.<br />Try typing lesser characters.</div>';
		bcontent=bcontent+bscontent+' </div> </div> <div class="bottom_bar rep_sprite"> <div class="select_box_cont float-left" >'+groupGenerate(1,"bottom")+'</div> <div class="rep_sprite toggle_manage_groups float-right"><div id="manage_groups_tool_tip">Manage Groups<div id="arrow_tip"></div></div><a class="rep_sprite_backup"></a></div> </div> <div class="bottom_subbar rep_sprite"><div style="position:relative;"><input name="" type="text" class="input_type_filter search_site" value="type to filter" ><div class="clear_input rep_sprite_backup"></div></div> </div> </div> <div id="bottom_right" class="float-left"> <div class="list_cont nano"> <div class="content">';
		bcontent=bcontent+bgcontent+' </div> </div> <div class="bottom_bar rep_sprite"><div class="btn_action float-right "><a class="rep_sprite save_changes">Save Changes</a></div></div> <div class="bottom_subbar rep_sprite" id="createGroupCont"> <input name="" type="text" class="input_type_filter  float-left onEnter groupClear" onenterbtn=".btn_create_group" id="newgroup" value="new group" > <div class="btn_create_group rep_sprite float-left user_select_no" >Create</div> </div> </div> </div> <div id="btn" class="showFooterSelector">   </div><div class="site_bar_btn add_site rep_sprite float-left" style="margin-left: 54px;" id="addWebsiteContainer"><div class="btn_add_site rep_sprite_backup" id="addWebsite">Add Website</div></div>';
		bottomToolbarVar=bcontent;
	siteSelectorVar = scontent;
	
	  
}
function updateSites(object,group)
{
	
	arrayCounter=0;
	var updateArray={};
	var tempArray={};
	
	$('span.statusSpan',object).text('Queued..'); 
	$('span.statusSpan',object).addClass('updating');
	$('span.typeVar',object).hide();
	
	if(group==1)
	{
	topParent="#"+currentUpdatePage;
		theSelector=$(object).attr('selector');
	  
		$(".item_ind."+theSelector+".active",topParent).not(".hide").not(".hidden").not('.updating').each(function () {
		if(!$(this).closest('.ind_row_cont').hasClass('hide') && !$(this).closest('.ind_row_cont').hasClass('hidden') )
		{
	
	$('.update_single',this).text('Queued..');
	$('.hideItem',this).hide();
		$(this).addClass('updating');
		$(this).removeClass('active');
		$(".row_checkbox",this).hide();
		siteID=$(this).attr('sid');
		dID=$(this).attr('did');
		type=$(this).attr('utype');
		if(updateArray[siteID]==undefined)
		updateArray[siteID]={};
		if(updateArray[siteID][type]==undefined)
		updateArray[siteID][type]={};
		if(type=="core")
		{
		if(siteID!=undefined && type!=undefined && dID!=undefined)
		updateArray[siteID][type]=dID;
		}
		else
		{
		if(siteID!=undefined && type!=undefined && dID!=undefined)
		updateArray[siteID][type][arrayCounter]=dID;
		}
	arrayCounter++;
		}
	});
/*$.each(updateCheckArray, function(property, value) { 
checkSelection(property);
});
*/
//$(object).
//	jQuery.ajaxSettings.traditional = true;

	}
	else
	{
			topDiv=$(object).closest('.item_ind');
		$(topDiv).addClass('updating');
	$('.update_single',topDiv).text('Queued..');
	$('.hideItem',topDiv).hide();
		$(topDiv).removeClass('active');
	$(".row_checkbox",topDiv).hide();
		siteID=$(topDiv).attr('sid');
		dID=$(topDiv).attr('did');
		type=$(topDiv).attr('utype');
		if(updateArray[siteID]==undefined)
		updateArray[siteID]={};
		if(updateArray[siteID][type]==undefined)
		updateArray[siteID][type]={};
		if(type=="core")
		{
		if(siteID!=undefined && type!=undefined && dID!=undefined)
		updateArray[siteID][type]=dID;
		
		}
		else
		{
		if(siteID!=undefined && type!=undefined && dID!=undefined)
		updateArray[siteID][type][0]=dID;
		}
		
	
	}
 // check the root level update option

topClosestVar=$(object).closest('.ind_row_cont');
if($(".item_ind",topClosestVar).not('.hidden').not('.hide').length==$(".item_ind.updating",topClosestVar).not('.hidden').not('.hide').length)
{
$(topClosestVar).addClass('updating');
$(".select_action,.select_action_long",topClosestVar).hide();
}
 checkUpdateSelect(object);
$('span.statusSpan',object).removeClass('updating');	
tempArray['action']='updateAll';
tempArray['args']={};
tempArray['args']['params']=updateArray;
//checkSelection($(object).attr('selector'));
doHistoryCall(ajaxCallPath,tempArray,'');

}

function filterByGroup(object,val,type)
{
		if(object=='' || object==undefined)
		closestVar=$("#bottomToolBarSelector");
		else
		closestVar=$(object).closest('.siteSearch');
		
	$(".input_type_filter",closestVar).val('');
	if(val==0)
	$('.js_sites',closestVar).removeClass('hide');
	else
	{	
	$('.js_sites',closestVar).addClass('hide');
	$('[gid="'+val+'"]').removeClass('hide');
	$.each(group[val].siteIDs, function(i,siteID) {

		$('[sid="'+siteID+'"]',"#bottomToolBarSelector").removeClass('hide');
	
	});
	}
	if(type==1) //for updates page to validate the extreme TOP update option
	checkGeneralSelect('ind_row_cont');
	
}
function groupGenerate(type,randVal)
{
	content='';
	
	if(type==2) gcontent='';
	if(type==1) // Type toolbar
	{
	toolVar='_toolbar';
	}
	else
	toolVar='';
	if(randVal==undefined)
	randVal=incrementRand;
	  content='<select name="rand_'+randVal+'" class="select_group'+toolVar+'" tabindex="2"><option value="0">All Websites</option>';
   
	$.each(group, function(i, object) {
		
		if(type==2)
		gcontent=gcontent+'<div class="ind_group js_addSite" gid="g'+i+'"><a>'+object.name+'</a></div>';
		
	    content=content+'<option value="'+i+'">'+object.name+'</option>';
		
	});
	content=content+'</select>';
	incrementRand++;
	if(type==2)
	{
		gcontent='<div class="group_selector">'+gcontent+'<div class="clear-both"></div> </div>';
		return gcontent;
	}
	else
	return content;
}
function selectorBind(object,className)
{
if($(object).attr('selector')!='ind_row_cont')
selection(className,$(object).attr('selector'),object);
else
{

mainUpdateSelection(className,object);
}


}
function showOrHide(object,className,IDToProcess,extra)
{
	IDToProcess="#"+IDToProcess;
	if(extra==1) // Reset Group for the bottom tool bar
	resetGroup();
	if($(IDToProcess).is(':visible'))
	{
	$(IDToProcess).hide();
	$(object).removeClass(className);
	}
	else
	{
	$(IDToProcess).show();
	$(object).addClass(className);
	}
}
function checkGroupName(name)
{
	checkVar=true;
	$.each(group, function(gid, array) {
		if(name.toLowerCase()==array.name.toLowerCase())
		{
		checkVar=false;
		return false;
		}
		
	});
	if(groupCreateArray!=undefined)
	{
		$.each(groupCreateArray, function(groupID, groupName) {
		if(groupName.toLowerCase()==groupName.toLowerCase())
		{
		checkVar=false;
		return false;
		}
		
	});
	}
	return checkVar;
}
function createGroup()
{
	
	generalGroupVal=$("#newgroup").val();
	if(checkGroupName(generalGroupVal) && generalGroupVal!='new group')
	{
	 $("#bottom_right > .list_cont > .content").animate({ scrollTop: $("#bottom_right").height() }, "slow");
	 groupVal=generalGroupVal;
	 content='<div class="ind_groups" id="gnew-'+groupCounter+'" gid="new-'+groupCounter+'" newgroup="1" ><a><span class="count_cont">0</span><input name="" type="text" value="'+groupVal+'" class="groupEditText" /></a><div class="del_conf" style="display: none; "><div class="label">Sure?</div><div class="yes deleteGroup">Yes</div><div class="no deleteGroup">No</div></div><div class="edit_del_cont"> <div class=" rep_sprite bg "><span class="rep_sprite_backup edit editGroup"></span></div> <div class=" rep_sprite bg"><span class=" rep_sprite_backup del deleteConf"></span></div> </div></div>';
	 if($(".ind_groups","#bottomToolBarSelector").length==0)
	 {
	 $("#bottom_right > .list_cont > .content").html(content);
	 showGroupSelectBox();
	 }
	 else
	  $("#bottom_right > .list_cont > .content").append(content);
	 $('#gnew-'+groupCounter).click();

	  groupCreateArray['new-'+groupCounter]=groupVal;
	  	  groupCounter++;
		  $(".save_changes").show();
	}
	else if(generalGroupVal=='new group' || generalGroupVal=='')
	$("#createGroupCont").append("<div id='duplicateGroup'>Enter a group name.</div>");
	else
	{
	
	$("#createGroupCont").append("<div id='duplicateGroup'>Group already exists. Try somethin' else.</div>");
	}

	
	
	
}

//  for footer selector updates_footer_updated
	function resetGroup(refreshData)
	{
		if(refreshData==undefined)
		refreshData=0;
		$("#bottom_toolbar #bottom_sites_cont .list_cont .ind_sites a").css({'background-position': '-25px 0', 'padding': '11px 0 9px 5px','width': '255px'});
		$("#bottom_right").hide();
		$(".save_changes").hide();
		$("#bottom_toolbar #bottom_sites_cont .list_cont .ind_sites").removeClass('active');
		$(".ind_groups").removeClass('active');
		$("#dk_container_rand_bottom").removeClass('disabled');
		$(".toggle_manage_groups").removeClass('active');
	    if(refreshData==1)
		{
			
		filterByGroup("",$("#dk_container_rand_bottom .dk_options_inner .dk_option_current a").attr("data-dk-dropdown-value"));
		}
		groupEditFlag = 0;
		
	}
	function showGroupSelectBox()
	{
				$('#bottom_toolbar #bottom_sites_cont .list_cont .ind_sites a').animate({
    backgroundPosition: '0 0',
	
    paddingLeft: '30px',
	width: '230px'
  }, 300);
	}
	function groupEdit(object)
	{
	groupEditFlag = 1;
		if($("#bottom_right").is(':visible'))
		{
			resetGroup(1);
			$(object).removeClass('active');
		}
			else
	{
		
			$("#bottom_right").show();
			$(object).addClass('active');
			
			 if($(".ind_groups","#bottomToolBarSelector").length>0)
			 {
			showGroupSelectBox();
			$("#dk_container_rand_bottom").addClass('disabled');
	$('.js_sites',"#bottomToolBarSelector").removeClass('hide');
  $(".ind_groups:first","#bottomToolBarSelector").click();
			 }
 
	}
	

	}

function expandThis(object,className)
{
	/*mainDiv = $(object).closest('.ind_row_cont');
	if(className=='summary')
	{
		$('.row_summary',mainDiv).hide();
		$('.row_detailed',mainDiv).show();
	}
	else
	{
		$('.row_summary',mainDiv).show();
		$('.row_detailed',mainDiv).hide();
	}*/
	
}

// For updates.html page
function optionSelect(object,type)
{
	sFlag=0;
	if(type==1 && $(object).hasClass('active')) // For plugins / theme page to give the functionality of unselecting the optional select
	{
		$(object).removeClass('active');
	}
	else
	{
	ulClass=$(object).closest('ul');
	$(".optionSelect",ulClass).removeClass('active');
	if(type==1)
	{
		if($(object).attr('action')=='activate' && activeItem=='themes')
		$(".site"+$(object).attr('sid')).removeClass('active');
	}
	$(object).addClass('active');
	
	}
	
	
}

function checkFavItems()
{

	className="favItems";
	totalLength = $('.'+className,".favSearch").length;
	cFlag=$('.'+className+'.active',".favSearch").length;
	if(cFlag==0)
	$(".status_"+className).addClass('disabled');
	else
	$(".status_"+className).removeClass('disabled');


}
function checkUpdateSelect(object,group)
{
	
	parent=$(object).attr('parent');
		selector=$(object).attr('selector');
		 if(selector=='item_ind')
		 {
	 topParent="#"+currentUpdatePage;
		 $(object).addClass('disabled');
		 
	 $(".ind_row_cont.active:not(.hide, .hidden, .hideVar) .row_checkbox",topParent).hide();
	$(".ind_row_cont.active:not(.hide, .hidden, .hideVar) .row_action .update_group",topParent).hide();
		$(".ind_row_cont.active:not(.hide, .hidden, .hideVar) .select_action,.select_action_long",topParent).hide();
			 $('.ind_row_cont.active:not(.hide, .hidden, .hideVar)',topParent).not(".hide").removeClass('active').addClass('updating');
	
		 }
		 else {
			 topParent=$(object).closest('.updateTabs');
	
		
		if($(".item_ind."+selector,topParent).not('.hide').not('.hidden').not('.updating').length<1)
		{
		if(parent==selector)
		$(".ind_row_cont."+selector+" .select_action",topParent).hide();
		else
		$(".select_"+selector,topParent).hide();
		
		if(parent!=undefined && $(".item_ind."+parent,topParent).not('.hide').not('.hidden').not('.updating').length<1)
		{
		$(".ind_row_cont."+parent+" .row_checkbox",topParent).hide();
		$(".ind_row_cont."+parent,topParent).removeClass('active');
		$(".status_"+parent,topParent).text('Update All').hide();
		}
		}
	if(parent!=undefined && parent!=selector)
	checkGeneralSelect(parent,topParent);
	checkGeneralSelect(selector,topParent);
	checkGeneralSelect("ind_row_cont",topParent);
		 }
	
}
function showHidden()
{
		topParent="#"+currentUpdatePage;
		 $.each(updateCheckArray, function(property, value) { 
	tLength=$(".item_ind."+property,topParent).not('.hide').not('.updating').length;
	//alert(tLength);
	if(tLength>0)
	{
		//alert(".row_"+property);
	$(".row_"+property).show();
	
	 if(!$(".row_"+property,topParent).closest(".ind_row_cont").is(":visible"))
 	$(".row_"+property,topParent).closest(".ind_row_cont'").show();
	}
	

});
}
function checkGeneralSelect(className,topParent,noTopParent)
{
	
	if(topParent==undefined || topParent=='')
	topParent="#"+currentUpdatePage;
	//alert(topParent);
	 if(noTopParent==1)
	{
		totalLength=$(".item_ind."+className).not('.hide').not('.hidden').not('.updating').length;
	cLength=$(".item_ind.active."+className).not('.hide').not('.hidden').not('.updating').length;

	}
	else {
	if(className!='ind_row_cont')
	{
	totalLength=$(".item_ind."+className,topParent).not('.hide').not('.hidden').not('.updating').length;
	cLength=$(".item_ind.active."+className,topParent).not('.hide').not('.hidden').not('.updating').length;

	}

	else
	{
	totalLength=$("."+className,topParent).not('.hide').not('.hidden').not('.updating').length;
	cLength=$(".active."+className,topParent).not('.hide').not('.hidden').not('.updating').length;
	}
	}
	
if(totalLength==0 && noTopParent==1)
{
	
 $(".row_"+className).addClass("hideVar");
 if(viewHiddenFlag==0)
  $(".row_"+className).hide();
  tClosestVar=$(".row_"+className);
    topClosestVar=$(".row_"+className).closest('.ind_row_cont');
	
  if($(".item_ind",tClosestVar).not('.updating').not('.hidden').not('.hide').length<2)
  $(".select_"+className).slideUp();
   if($(".item_ind",topClosestVar).not('.updating').not('.hidden').not('.hide').length<1)
	{
	  if(viewHiddenFlag==0)
 	$(".row_"+className).closest(".ind_row_cont'").hide();
	$(".row_"+className).closest(".ind_row_cont'").addClass("hideVar").removeClass('active');
	}
  
}
else if(totalLength!=0 && noTopParent==1)
{
	
		//$(".select_"+className).show();
	$(".row_"+className).removeClass("hideVar");
  $(".row_"+className).show();
  tClosestVar=$(".row_"+className);
  topClosestVar=$(".row_"+className).closest('.ind_row_cont');
  if($(".item_ind",tClosestVar).not('.updating').not('.hidden').not('.hide').length>1)
	$(".select_"+className).slideDown();
	else
	$(".select_"+className).hide();
    if($(".item_ind",topClosestVar).not('.updating').not('.hidden').not('.hide').length>1)
	{
  	$(".row_"+className).closest(".ind_row_cont'").show();
	$(".row_"+className).closest(".ind_row_cont'").removeClass("hideVar");
	}
  
}
else	if(totalLength==cLength)
	{
		if(noTopParent==1)
		$(".select_"+className).show();
		$(".status_"+className).text('Update All ');
		if(className!='ind_row_cont')
		{
		//$(".status_"+className).closest(".select_action").show();
			$(".status_"+className).closest(".update_group").show();
		}
		else {
			$(".status_"+className).removeClass('disabled');
		}
	}
	else if(cLength==0)
	{
		$(".status_"+className).text('Update All ');
		if(className!='ind_row_cont')
		{
		//$(".status_"+className).closest(".select_action").hide();
			$(".status_"+className).closest(".update_group").hide();
		}
		else
		$(".status_"+className).addClass('disabled');
	}
	else
	{
		if(noTopParent==1)
		{
		
		$(".select_"+className).show();
		}
		$(".status_"+className).text('Update Selected ');
			if(className!='ind_row_cont')
		{
			$(".status_"+className).closest(".select_action").show();
				$(".status_"+className).closest(".update_group").show();
		}
		else
			$(".status_"+className).removeClass('disabled');
	}
	
}
function generalSelect(object, className,updateCheck)
{
	activeFlag=0;
	topParent=$(object).closest('.updateTabs');
	closestVar=$(object,topParent).closest('.ind_row_cont');
	if($(object).hasClass('active'))
	{
	$(object).not('.hidden').not('.hide').not('.updating').removeClass('active')
	activeFlag=0;
	}
	else
	{
	$(object).not('.hidden').not('.hide').not('.updating').addClass('active');
	activeFlag=1;
	}
	
	
if(className=="ind_row_cont")
	{
	if(activeFlag==0)		
	{
	$(".item_ind",object).not(".hide").not(".hidden").not(".updating").removeClass('active');
//	$(".status_"+parent).text('Update All');
	//$(".status_"+parent).addClass('disabled');
	}
	else
	$(".item_ind",object).not(".hide").not(".hidden").not(".updating").addClass('active');
	//$(".status_"+parent).removeClass('disabled');
	}
	else {
	if($(".item_ind.selectOption.active",closestVar).not(".hide").not(".hidden").not(".updating").length<1)
	{
	$(object).closest(".ind_row_cont").removeClass('active');
	}
	else if($(".item_ind.selectOption.active",closestVar).not(".hide").not(".hidden").not(".updating").length==$(".item_ind.selectOption",closestVar).not(".hide").not(".hidden").not(".updating").length)
	$(object).closest(".ind_row_cont").addClass('active');
	
	}
	
	parent=$(object).attr('parent');
	selector=$(object).attr('selector');
	//alert(parent);
	if(parent!=undefined)
	checkGeneralSelect(parent,topParent);
	checkGeneralSelect(selector,topParent);
	checkGeneralSelect("ind_row_cont",topParent);
	
	
}



// For SiteSelector.html page
gFlag=0;
gAll=0;
currentGroup=0;
function selectedGroupSelection()
{
	closestVar=".siteSelectorContainer";
	$(".group_cont.active",closestVar).each(function () { 
	if($(this).attr('gid')!=undefined && $(this).attr('gid')!='')
	{
	
	temp=group[$(this).attr('gid')].siteIDs;
		$.each(temp, function(key, value) {
   		 $("#s"+value,closestVar).addClass('active');
	});
	}
	});
}
function makeSelection(object,groupFlag,toolbar) // For selector
{
	tempArray={};
	tempCount=0;
	closestVar=$(object).closest('.siteSearch');
	if($(object).hasClass('deselectGroups')) // For site selectors to deselect groups when a site is modified
	$(".group_cont",".siteSelectorContainer").removeClass('active');
	if($(object).hasClass('active'))
	{
	$(object).removeClass('active');
	gFlag=1; // Deactivate  the selected sites
	}
	else
	{
	$(object).addClass('active');
	gFlag=2; // Activate  the selected sites
	}
	
	if(toolbar==1 && groupFlag!=1)
	{
		checkGroups=$(".ind_groups","#bottomToolBarSelector").length; // When 0 groups don't edit
		if(groupEditFlag==0 || checkGroups==0) // Not allow the sites to be selected when they are not in the edit mode.
		{
		
		$(object).removeClass('active');
		}
	arrayCounter=0;
	groupListCountDiv="#bottom_left > .list_cont > .content > .active";
	if($(groupListCountDiv,closestVar).length>0)
	{
				$(groupListCountDiv,closestVar).each(function () {
					tempArray[arrayCounter]=$(this).attr('sid')
				//tempVar = tempVar+$(this).attr('sid')+',';
				tempCount++;
				arrayCounter++;
						
	});
	}
	else
	tempArray[0]='empty';

	//tempVar=tempVar.charAt(tempVar.length-1);
	
 groupChangeArray[currentGroup]=tempArray;
	$(".save_changes").show();
	

	$("#g"+currentGroup+" > a > .count_cont").html(tempCount);
	}
	
	if(groupFlag==1) // Selecting a group code.
	{
		//if(gFlag==1)
		
		if(gAll==1)
		{
		$(".group_items_cont > #g0",closestVar).removeClass('active'); // Remove all websites check mark by using the id g0
		 $(".website_items_cont > .website_cont",closestVar).removeClass('active');
		 gAll=0;
		}
		if(toolbar==1) // Just for toolbar group selection
		{
			currentGroup =$(object).attr('gid');
		removeDeleteConf();
			 if(gFlag==2)
			 {
			$(".ind_groups",closestVar).removeClass('active');
			$(".ind_sites",closestVar).removeClass('active');
			 }
			id=$(object).addClass('active');
		}
		id=$(object).attr('gid');
		if(groupEditFlag==1 && (groupChangeArray[id]!=undefined))
		{
		temp=groupChangeArray[id];
		
		}
		else
		{
		if($(object).attr('newgroup')!=1)
		temp=group[id].siteIDs;
		else
		{
		temp='';
	
		}
		
	    
		}
		if(temp!=undefined)
		{
		
	$.each(temp, function(key, value) {
   		 if(gFlag==2)
		 $("#s"+value,closestVar).addClass('active');
		 else if(gFlag==1 && toolbar!=1)
		  $("#s"+value,closestVar).removeClass('active');
		});
		}
		selectedGroupSelection();
	}
	else if(groupFlag=='all')
	{
		$(".group_items_cont > .group_cont",closestVar).removeClass('active');
		 if(gFlag==2)
		 {
		$(".website_items_cont > .website_cont",closestVar).addClass('active');
		 $(object).addClass('active');
		 gAll=1
		 }
		 else if(gFlag==1)
		 {
		 $(".website_items_cont > .website_cont",closestVar).removeClass('active');
		 gAll=0;
		 }
	

		
	}
}
function mainUpdateSelection(type,object)
{
	className="ind_row_cont";
	topVar="#"+currentUpdatePage;
	if(type=='all')
   {
	   $("."+className,topVar).not('.hide,.hidden,.updating').each(function () { 
	   $(this).addClass('active');
	   $(".item_ind",this).not('.hide,.hidden,.updating').addClass('active');
	   });
   }
else if(type=='none')
   {
	   $("."+className,topVar).not('.hide,.hidden,.updating').each(function () { 
	$(this).removeClass('active');

	   $(".item_ind",this).not('.hide,.hidden,.updating').removeClass('active');
	   });
   }
	   
	else if(type=='invert')
   {
	 $("."+className,topVar).not('.hide,.hidden,.updating').each(function() {
   if($(this).hasClass('active'))
   {

   $(this).removeClass('active');
     $(".item_ind",this).not('.hide,.hidden,.updating').removeClass('active');
   }
   else
   {
   $(this).addClass('active');
     $(".item_ind",this).not('.hide,.hidden,.updating').addClass('active');
   }
});
   }
	   checkGeneralSelect(className);
	   
}
function selection(type,className,object,page)
{	if(type=='all')
   {
	$("."+className).not('.hide,.updating,.hidden').addClass('active');
	
   }
	else if(type=='none')
	$("."+className).not('.hide,.updating,.hidden').removeClass('active');
	else if(type=='invert')
	{
		$("."+className).each(function() {
   if($(this).hasClass('active'))
   $(this).not('.hide,.updating,.hidden').removeClass('active');
   else
   $(this).not('.hide,.updating,.hidden').addClass('active');
});
	}
	checkGeneralSelect(className); // Updated from updates.html page
	if(object) // For update Page
	{
		var tempVar = $(object).attr('parent');
		if(tempVar)
		checkGeneralSelect(tempVar);
	}
	
}
function checkSearchedList(className,closestVar,type)
{
	
	if(type==2) //Updates page
	{
		if(closestVar=='')
		topParent="#"+currentUpdatePage;
		else
		topParent=closestVar;
		//topParent=$(closestVar,topParent);
	if(viewHiddenFlag==1)
	return $(".ind_row_cont",topParent).not('.hide').length;
	else
	return $(".ind_row_cont",topParent).not('.hide').not('.hideVar').length;
	}
	else
	{
	return $(className,closestVar).not('.hide').length;
	}
}
function searchSites(object,type){
	clearTimeout(timeOut);
	className=".searchable";
	if($(object).val().length>0)
	$(object).next().show();
	else
	$(object).next().hide();
	if(type==3) // For Favourites
	closestVar='.favSearch';
	else if(type==2 || type==4)
	{
		//topParent="#"+currentUpdatePage;
	closestVar=$(object).closest('.siteSearch');
	
	}
	else
	closestVar=$(object).closest('.siteSearch');
	timeOut = setTimeout( function () {
	if($(object).val().length>2 && $(object).val()!="type to filter" )
	{
	if(type==2 || type==4) // For updates and plugins search which has expandables
	{
	$(className,closestVar).closest('.ind_row_cont').removeClass('hide');
	$(className+":not(:contains("+$(object).val()+"))",closestVar).closest('.ind_row_cont').addClass('hide');
	checkGeneralSelect('ind_row_cont');
	if(type==2)
checkSearchListVar=checkSearchedList(className,'',2);
else
checkSearchListVar=checkSearchedList(className,closestVar,2);

		if(checkSearchListVar<1)
	
	$(".hiddenCont",closestVar).show();
	else
	$(".hiddenCont",closestVar).hide();
	
	}
	else
	{
	
	
	
		$(className,closestVar).removeClass('hide');
		$(className+":not(:contains("+$(object).val()+"))",closestVar).addClass('hide');
	
	if(checkSearchedList(className,closestVar)<1)
	$(".hiddenCont",closestVar).show();
	else
	$(".hiddenCont",closestVar).hide();
	}
	}
	else
	{
	$(".hiddenCont",closestVar).hide();
	if(type==2 || type==4)
	{
	$(className,closestVar).closest('.ind_row_cont').removeClass('hide');
	checkGeneralSelect('ind_row_cont');
	}
	else
	{
	$(className,closestVar).removeClass('hide');
	
	}
	}
	},300);
}