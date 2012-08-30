// Loading contents
function loadItemManage()
{
	content=' <div class="site_nav_sub"> <ul> <li><a class="manage optionSelect">MANAGE</a></li> <li><a class="install optionSelect">INSTALL</a></li> <div class="clear-both"></div> </ul> </div> <ul class="btn_rounded_gloss"> <li><a class="rep_sprite active typeSelector optionSelect typePlugin" utype="plugins">Plugins</a></li> <li><a class="rep_sprite typeSelector optionSelect typeThemes" utype="themes">Themes</a></li> </ul><div class="steps_hdr">Select websites to <span id="processType">Manage</span> <span class="itemUpper">Plugins</span></div><div class="siteSelectorContainer">'+siteSelectorVar+'</div><div class="advancedInstallOptions" style="display:none"><div class="steps_hdr">INSTALLATION OPTIONS</div> <div style="width:200px;"> <div class="checkbox generalSelect activateItem">Activate  <span class="itemNameLower">'+activeItem+'</span> after install</div> <div class="checkbox generalSelect overwriteItem">Overwrite existing <span class="itemNameLower">'+activeItem+'</span></div> </div></div> <div class="result_block shadow_stroke_box siteSearch itemPanel" style="border:0;box-shadow: 0 0 0  rgba(0, 0, 0, 0)"><div class="optionsContent "></div>';
	$("#pageContent").html(content);
	$(".manage").click();
}
  
  function loadFavourites()
  {
	  content='';
	  if(favourites!=null && favourites[activeItem]!=undefined && getPropertyCount(favourites[activeItem])>0)
	  {
	  $.each(favourites[activeItem], function(property,value){
		  content=content+'<div class="ind_site favItems searchable"><a dlink="'+value.URL+'" utype="'+activeItem+'" iname="'+value.name+'">'+value.name+'</a><div class="rep_sprite remove_bg"><span class="rep_sprite_backup del delFavourites "></span></div></div>';
	 });
	  }
	 else
	 content='<div class="empty_data_set"><div class="line1">You have no favorites :(</div><div class="line2">You can add favorites by <a id="searchRepository">searching through the WP Repository.</a></div></div>';
	 finalcontent='<div class="fav_rows_cont favSearch">'+content+'<div class="no_match hiddenCont" style="display:none">Bummer, there are no favorites that match.<br />Try typing lesser characters.</div><div class="clear-both"></div></div>';
      $(".installSubPanel").html(finalcontent);
        
  }
   function loadManagePanel(data)
 {
	 $(".fetchInstall").text($(".fetchInstall").attr('tempname')).removeClass('disabled');
	$(".btn_loadingDiv").remove();
	manage=data;
	 content='';
	 content=' <div class="th rep_sprite"> <div class="title"><span class="droid700">Show by</span></div> <ul class="btn_radio_slelect"> <li><a class="active rep_sprite manage_'+activeItem+'_view itemName optionSelect">'+activeItem.toTitleCase()+'</a></li> <li><a class="rep_sprite manage_websites_view optionSelect">Websites</a></li> </ul> <div class="type_filter "> <input name="" id="manageFilter" type="text" class="input_type_filter searchItems manageFilter " value="type to filter" /> <div class="clear_input rep_sprite_backup"></div></div> <div class="btn_action float-right"><a class="rep_sprite status_applyChangesCheck js_changes disabled">Apply Changes</a></div> </div> <div id="view_content" ></div>';
	$(".actionContent").html(content).show();
	pluginsListPanel(activeItem,activeItem);
	text=$(".fetchInstallTxt").val();
	if(text!='')
	$("#manageFilter.input_type_filter").val(text).keyup();
	if(activeItem=="themes")
	$(".manage_websites_view").click();
	
	
 }
 function loadInstallPanel(loadClass)
 {
	 content='';
	  content='<div class="th rep_sprite siteSearch"> <div class="title"><span class="droid700">Upload from</span></div> <ul class="btn_radio_slelect"> <li><a class="rep_sprite active installOptions optionSelect" function="loadFavourites">My Favorites</a></li> <li><a class="rep_sprite installOptions optionSelect" function="loadRepository">WP Repository</a></li> <li><a class="rep_sprite installOptions optionSelect" function="loadComputer">My Computer</a></li> <li><a class="rep_sprite installOptions optionSelect" function="loadURL">URL</a></li> </ul> <div class="type_filter"> <input name="" type="text" class="input_type_filter favSearch favOption" value="type to filter" /><div class="clear_input rep_sprite_backup"></div> </div> <div class="btn_action float-right"><a class="rep_sprite status_favItems installFavourites favOption itemName disabled">Install '+activeItem.toTitleCase()+'</a></div> </div><div class="content"><span class="installSubPanel"> </span><div class="clear-both"></div></div>';
	  
	  

	  $("."+loadClass).html(content);
	  loadFavourites();
 }
 
  function loadRepository()
 {
	 itemCont='';
	 if(activeItem=='plugins')
	 helpTxt="eg. seo, google";
	 else
	 helpTxt="eg. black, two columns";
	 content='<div class="th_sub rep_sprite"> <ul class="th_sub_nav"> <li><a class="rep_sprite active searchVar optionSelect" dval="search">SEARCH</a></li> <li><a class="rep_sprite searchVar optionSelect" dval="featured">FEATURED</a></li> <li><a class="rep_sprite searchVar optionSelect" dval="popular">POPULAR</a></li> <li><a class="rep_sprite searchVar optionSelect" dval="new">NEWEST</a></li> <li><a class="rep_sprite searchVar optionSelect" dval="updated">RECENTLY UPDATED</a></li> </ul> </div> <div class="rows_cont"> <div class="content searchCont"> <div class="form_cont float-left" style="padding:0; border:0;width: 500px;"> <div class="tr"> <div class="tl two_liner" style="width: 19%;">Search <span class="itemName">'+activeItem.toTitleCase()+'</span><br /> by Keyword</div> <div class="td"> <input name="" type="text" class="searchText txtHelp onEnter" onenterbtn=".searchItem" helpTxt="'+helpTxt+'" value="'+helpTxt+'" style="color:#AAAAAA" /> </div> <div class="clear-both"></div> </div> </div> <div class="btn_action float-left" style="margin: 7px 0 0 -54px;"><a class="rep_sprite searchItem">Search <span class="itemName">'+activeItem.toTitleCase()+'</span></a></div> <div class="clear-both"></div> </div> <div class="wp_repository_cont"></div> </div>';

    return content;
 }
 function pluginsListPanel(view,type)
 {
	 $(".status_applyChangesCheck").addClass('disabled');
	 content='';
	 if(view=='sites')
	 json=manage.data.getSearchedPluginsThemes.siteView;
	 else
	  json=manage.data.getSearchedPluginsThemes.typeView;
	 $.each(json, function(i, object) {
		 //alert(i);
		 if(view!='sites')
		 firstKey=getFirstKey(object,2);
		 else
		 firstKey=site[i];
		
		 content=content+'<div class="ind_row_cont "> <div class="row_summary" style="display:none"> <div class="row_arrow"></div>  <div class="row_name searchable">'+firstKey.name+'</div> <div class="clear-both"></div> </div>';
	     content=content+'<div class="row_detailed"> <div class="rh"> <div class="row_arrow"></div><div class="row_name">'+firstKey.name+'</div> <div class="clear-both"></div> </div><div class="rd">';
		  $.each(object, function(status, value) {
			  
			if(status=='notInstalled')
			{
			statusVar='Not Installed';
			actionLi='<li><a class="rep_sprite">Install</a><a class="rep_sprite">Install & Activate</a></li> ';
			}
			else if(status=='active')
		  	{
			statusVar='Active';
			actionVar='Deactivate';
			
			 }
			else if(status=='inactive')
			{
			statusVar='Inactive';
			actionVar='Activate';
			actionLi='<li><a class="rep_sprite">Activate</a></li><li><a class="rep_sprite">Delete</a></li> ';
			}
		 content=content+'<div class="row_updatee"> <div class="row_updatee_ind"> <div class="label_updatee  float-left"> <div class="label droid700 float-left"><span class="'+status+'">'+statusVar+'</span></div> <div class="count float-left"><span>'+getPropertyCount(value)+'</span></div> <div class="clear-both"></div> </div><div class="items_cont float-left">';
		  $.each(value, function(id, array) {
			  if(view=='sites')
			  {
				  siteID=i;
				  dID=id;
				  contName=array.name;
			  }
			  else
			  {
				  siteID=id;
				  dID=i;
				  
				contName=site[id].name;
			  }
			  if(status!='notInstalled')
			  {
				 
			if(status=='inactive')
			delCont='<li><a class="rep_sprite actionButton applyChangesCheck optionSelect" sid="'+siteID+'" did="'+dID+'"  itemName="'+array.name+'" utype="'+type+'" action="delete">Delete</a></li>';
			else
			delCont='';
			if(status=='active')
			extraDeactivateClass='actionButtonRounded';
			else
			extraDeactivateClass='';
			
			if(activeItem=="themes" && status=="active")
				  actionLi='';
				  else
				  {
				if(activeItem=="themes")
				styleSheetTmp="stylesheet="+array.stylesheet;
				else
				styleSheetTmp='';
			  actionLi='<ul class="btn_radio_slelect small"><li><a class="rep_sprite actionButton applyChangesCheck '+extraDeactivateClass+' optionSelect site'+siteID+'" itemName="'+array.name+'" '+styleSheetTmp+' sid="'+siteID+'" did="'+dID+'" utype="'+type+'" action='+actionVar.toLowerCase()+'>'+actionVar+'</a></li>'+delCont+'</ul>';
				  }
			  
		
			  }
			  else
			  {
			if(activeItem=="themes")
			dLink='http://wordpress.org/extend/themes/download/'+array.slug+'.zip';
			else
			dLink='http://downloads.wordpress.org/plugin/'+array.slug+'.zip';
			
			  actionLi='<a class="installSinglePlugin installItem" action="install"  sid="'+siteID+'" did="'+dID+'" dLink="'+dLink+'"  itemName="'+array.name+'" utype="'+type+'" >Install</a> ';
			  }
			  
			  content=content+' <div class="item_ind float-left"> <div class="item float-left">'+contName+'</div> <div class="select_operation"> '+actionLi+' </div></div>  ';
		  });
		  content=content+' </div><div class="clear-both"></div></div> </div>';
		 
		  });
		
		 content=content+'</div></div></div>';
		  });
		content='<div class="no_match hiddenCont" style="display:none">Bummer, there are no '+activeItem+' that match.<br />Try typing lesser characters.</div>'+content;
		 $("#view_content").html(content);
	 
 }
 
 /// Load for updates
 function loadUpdateContent()
 {
	 content='';
 content='  <div class="result_block shadow_stroke_box siteSearch" id="mainUpdateCont"><div class="th rep_sprite"> <div class="title"><span class="droid700">Show by</span></div> <ul class="btn_radio_slelect"> <li><a class="rep_sprite websites_view optionSelect active">Websites</a></li> <li><a class=" rep_sprite optionSelect plugins_view">Plugins</a></li> <li><a class="rep_sprite themes_view optionSelect">Themes</a></li> <li><a class="rep_sprite wp_view optionSelect">WP</a></li> </ul> <div class="type_filter"> <input name="filter" type="text" class="input_type_filter searchSiteUpdate" value="type to filter" /><div class="clear_input rep_sprite_backup"></div></div><div class="hidden_updates"><a class="float-left rep_sprite user_select_no" id="viewHidden">Hidden Updates</a></div>  <div class="btn_action float-right"><a class="rep_sprite status_ind_row_cont update_group" parent="item_ind" selector="item_ind">Update All</a></div> <div class="select_cont float-right"><span>Select: </span><a class="all" selector="ind_row_cont">All</a><a class="invert" selector="ind_row_cont">Invert</a><a class="none" selector="ind_row_cont">None</a></div> </div><div id="siteViewUpdateContent" class="updateTabs" style="display:none"></div><div id="WPViewUpdateContent"  class="updateTabs" style="display:none"></div><div id="themeViewUpdateContent" style="display:none"  class="updateTabs"></div><div id="pluginViewUpdateContent" style="display:none"  class="updateTabs"></div> ';
 content=content+"</div></div>";
  $("#pageContent").html(content);
 if(toolTipData.viewHidden!="true")
 $("#viewHidden").qtip({events: { hide: function(event, api) { tempArray={}; tempArray['requiredData']={}; valArray={}; valArray['viewHidden']=true; tempArray['requiredData']['updateUserhelp']= valArray; tempArray['requiredData']['getUserHelp']= 1;  doCall(ajaxCallPath,tempArray,'setTooltipData'); } }, id: 'viewHiddenQtip', content: { text: ' ', title: { text: 'View your hidden updates here.', button: true } }, position: { my: 'top center', at: 'bottom center' }, show: { event: false, ready: true }, hide: false, style: { classes: 'ui-tooltip-shadow ui-tooltip-dark',tip: {  corner: true, width: 8, height:5} } });
 }
 function displayUpdateContent(view)
{
	
	content='';
if(view=="sites")
{
content=content+'<div class="th_sub rep_sprite"> <div class="select_box_cont float-left group_container"> </div> <div class="label float-right"><span style="margin-right:132px;">THEMES</span></div> <div class="label float-right"><span style="margin-right:21px;">PLUGINS</span></div> <div class="label float-right"><span style="margin-right:31px;">WP</span></div> </div><div class="empty_data_set hiddenCheck" style="display:none"> <div class="line2">Hurray! Everything is up-to-date.</div></div>';
emptyStatusType="Websites";
}
else
{
	if(view=="wp")
		emptyStatusType="Wordpress installations";
		else
		emptyStatusType=view.toTitleCase();
}
content=content+'<div class="rows_cont"><div class="no_match hiddenCont" style="display:none">Bummer, there are no matches.<br />Try typing lesser characters.</div>';
json=eval(view+"json");
pFlag=0;

objKey=0;


if(json!=null &&  json!=undefined && getPropertyCount(json)>0)
{
$.each(json, function(i, object) {
	
	childFlag=0;
	if(view=='sites')
  	{
	if(json[i].core!=undefined)
	WPCount=getPropertyCount(json[i].core);
	else
	WPCount=0;
	if(json[i].plugins!=undefined)
	pluginsCount=getPropertyCount(json[i].plugins);
	else
	pluginsCount=0;
	if(json[i].themes!=undefined)
	themesCount=getPropertyCount(json[i].themes);
	else
	themesCount=0;
	totalCount = WPCount+pluginsCount+themesCount;
	displayName=site[i].name;
	updateCount=site[i].updateCount;
	pFlag=0;
	
	}
	else 
	{
		
	firstKey=getFirstKey(object);
	if(view=="wp")
	displayName=i;
	else
    displayName=object[firstKey].name;
	totalCount = getPropertyCount(object);
	pFlag=1;
	}
	if(pFlag==0)
	content = content+'<div class="ind_row_cont js_sites active visible parent_'+parentFlag+'" selector="parent_'+parentFlag+'" siteid="'+i+'">';
	else
	content = content+'<div class="ind_row_cont active row_parent_'+parentFlag+' parent_'+parentFlag+'" selector="'+view+'" did="'+i+'" >';
	content = content+'<div class="row_summary" style="display:none"> <div class="row_arrow"></div> <div class="row_checkbox main_checkbox"></div> <div class="row_name searchable">'+displayName+'</div>';
	if(view=='sites')
	content=content+'<div class="row_update_count updateCount_wp_parent_'+parentFlag+'"><span>'+mainJson.siteViewCount[i].core+'</span></div> <div class="row_update_count updateCount_plugins_parent_'+parentFlag+'"><span>'+mainJson.siteViewCount[i].plugins+'</span></div> <div class="row_update_count updateCount_themes_parent_'+parentFlag+'"><span>'+mainJson.siteViewCount[i].themes+'</span></div>';
	content=content+'<div class="row_action float-left"><a class="update_group" selector="parent_'+parentFlag+'" parent="parent_'+parentFlag+'"><span class="status_parent_'+parentFlag+' statusSpan">Update All</span></a></div> <div class="clear-both"></div></div><div class="row_detailed" ><div class="rh"><div class="row_arrow"></div><div class="row_checkbox main_checkbox"></div><div class="row_name">'+displayName+'</div><div class="row_action float-right"><a class="update_group" selector="parent_'+parentFlag+'" parent="parent_'+parentFlag+'"><span class="status_parent_'+parentFlag+' statusSpan">Update All</span></a></div><div class="clear-both"></div></div><div class="rd">';
	//if(objKey>1)
	if(pFlag==1)
	{
		if(view=='plugins')
{
typeVar='Plugins';
}
else if(view=='themes')
{
	typeVar='Themes';
}
else if(view=='WP')
{
typeVar='Wordpress';
}
if( getPropertyCount(object)>1)
content=content+'<div class="select_action_long select_parent_'+parentFlag+'"><div class="select_cont float-left"><span>Select: </span><a class="all" selector="parent_'+parentFlag+'">All</a><a class="invert"  selector="parent_'+parentFlag+'">Invert</a><a class="none" selector="parent_'+parentFlag+'">None</a></div><a class="action float-right update_group" selector="parent_'+parentFlag+'" parent="parent_'+parentFlag+'"><span class="status_parent_'+parentFlag+' statusSpan">Update All </span><span class="typeVar typeVar_parent_'+parentFlag+' ">'+typeVar+'</span></a><div class="clear-both"></div></div>';
		
	}
		
	
	
	$.each(object, function(property, value) {
if(pFlag==0)
extraClass='row_child_'+childFlag+parentFlag;
else
extraClass='row_parent_'+parentFlag;
content = content+'<div class="row_updatee '+extraClass+'"><div class="row_updatee_ind">';
if(pFlag==1)
content=content+'<div class="items_cont_long float-left">';

if(pFlag==0)
{
	
	if(property=="core")
	typeName="WP";
	else
	typeName=property;
	typeVar=property;
content = content+'<div class="label_updatee"><div class="label droid700 float-left">'+typeName+'</div><div class="count float-left"><span selector="child_'+childFlag+parentFlag+'">'+getPropertyCount(value)+'</span></div><div class="clear-both"></div></div>';
content=content+'<div class="items_cont float-left">';
if(getPropertyCount(value)>1)
	content=content+'<div class="select_action select_child_'+childFlag+parentFlag+'"><div class="select_cont float-left"><span>Select: </span><a class="all" selector="child_'+childFlag+parentFlag+'" parent="parent_'+parentFlag+'">All</a><a class="invert" parent="parent_'+parentFlag+'"  selector="child_'+childFlag+parentFlag+'">Invert</a><a class="none" parent="parent_'+parentFlag+'" selector="child_'+childFlag+parentFlag+'">None</a></div><a class="action float-right update_group" parent="parent_'+parentFlag+'"  selector="child_'+childFlag+parentFlag+'"><span class="status_child_'+childFlag+parentFlag+' statusSpan">Update All </span><span class="typeVar typeVar_child_'+childFlag+parentFlag+'">'+typeVar+'</span></a><div class="clear-both"></div></div>';
}

if(view!='sites')
{
	
	if(view=='wp')
	{
	uType='WP';
	versionContent='<a href="http://codex.wordpress.org/Changelog/'+i+'" target="_blank">'+i+'</a>';
	}
	else
	{
	if(view=="plugins")
	versionContent='<a href="http://wordpress.org/extend/plugins/'+value.slug+'/changelog/" target="_blank" >'+value.new_version+'</a>';
	else
	versionContent='<a class="cutClass">'+value.new_version+'</a>';
	uType=view.toLowerCase();
	}
itemClasses='active';
checkBoxClass='';
	hiddenButton="Hide";
if(value.hiddenItem==true)
{
	itemClasses="hidden";
	checkBoxClass="style='display:none'";
	hiddenButton="Show";
	updateCheckArray['parent_'+parentFlag]=1;
	
}
content=content+'<div class="item_ind '+itemClasses+'  float-left parent_'+parentFlag+'  selectOption" iname="'+value.name+'" parent="parent_'+parentFlag+'" selector="parent_'+parentFlag+'" did="'+i+'" sid="'+property+'" utype="'+uType+'"><div class="row_checkbox"'+checkBoxClass+'></div>';
if(view!="sites")
content=content+'<div class="item" style="width:750px">';
else
content=content+'<div class="item">';
content=content+site[property].name+' <span class="version">'+versionContent+'</span></div><div class="actions"><a class="float-left update_single" parent="parent_'+parentFlag+'" selector="parent_'+parentFlag+'" >Update</a> <a class="float-left hideItem" parent="parent_'+parentFlag+'" selector="parent_'+parentFlag+'">'+hiddenButton+'</a></div></div>';
}

else
{

$.each(value, function(items, itemsval) {
			if(property=='core')
		{
			iversionContent='<a href="http://codex.wordpress.org/Changelog/'+items+'" target="_blank">'+items+'</a>';
		uType=property.toLowerCase();
		itemName='';
		}
		else
		{
				itemName=itemsval.name;
		if(property=="plugins")
		iversionContent='<a href="http://wordpress.org/extend/plugins/'+itemsval.slug+'/changelog/" target="_blank">'+itemsval.new_version+'</a>';
		else
		iversionContent='<a class="cutClass">'+itemsval.new_version+'</a>';
		uType=property;
		}
		
		itemClasses='active';
checkBoxClass='';
hiddenButton="Hide";
if(itemsval.hiddenItem==true)
{
	itemClasses="hidden";
	checkBoxClass="style='display:none'";
	hiddenButton="Show";
	updateCheckArray['parent_'+parentFlag]=1;
	updateCheckArray['child_'+childFlag+parentFlag]=1;
	
}
		content=content+'<div class="item_ind   '+itemClasses+'   float-left parent_'+parentFlag+' child_'+childFlag+parentFlag+' selectOption hasParent" iname="'+itemName+'" selector="child_'+childFlag+parentFlag+'" parent="parent_'+parentFlag+'" did="'+items+'" sid="'+i+'" utype="'+uType+'"><div class="row_checkbox" '+checkBoxClass+'></div><div class="item">'+itemName+' <span class="version">'+iversionContent+'</span></div><div class="actions"><a class="float-left update_single" parent="parent_'+parentFlag+'" selector="child_'+childFlag+parentFlag+'">Update</a> <a class="float-left hideItem" parent="parent_'+parentFlag+'" selector="child_'+childFlag+parentFlag+'">'+hiddenButton+'</a></div></div>';
	});
}
	content=content+'</div><div class="clear-both"></div></div></div>';
	childFlag++;
    });
	 if(view!="sites")
		 content=content+"<div class='clear-both'></div>";
	content=content+"</div></div></div>";
	
	parentFlag++;
});
//$("#updateContent").html(content);
}
else
content='<div class="empty_data_set"> <div class="line2">Hurray! All '+emptyStatusType+' are up-to-date.</div></div>';
return content;


}

function loadAddSite()
{
	 
	content='';
	extra='';
	if(group!=null && group!=undefined && group.length!=0)
	{
	extra='<div class="tr assignGroupItem" id="addSiteGroupsPanel"><div class="tl">Existing Groups</div><div class="td"><div class="addSiteGroups">'+groupGenerate(2)+'</div></div><div class="clear-both"></div> </div>';
	}
 	content=content+'<div class="dialog_cont add_site"> <div class="th rep_sprite " id="addSiteSprite"> <div class="title droid700">ADD A WORDPRESS SITE TO IWP</div> <a class="cancel rep_sprite_backup">cancel</a></div> <div class="add_site form_cont " style="border:0;"> <div class="tr"> <div class="tl">Website URL</div> <div class="td"> <input name="" type="text" id="websiteURL" /> </div> <div class="clear-both"></div> </div> <div class="tr"> <div class="tl ">Admin Username</div> <div class="td"> <input name="" type="text" id="username" value="admin" /> </div> <div class="clear-both"></div> </div> <div class="tr"> <div class="tl ">Activation Key</div> <div class="td"> <input name="" type="text" id="activationKey" /><div style="color: #737987;line-height: 16px;">The Activation Key will be displayed every time you activate the IWP Client Plugin on your website.</div> </div> <div class="clear-both"></div> </div><div class="tr"> <div class="tl" id="assignToggleAction"><span>Assign to groups </span><span id="assignToggle">+</span></div> <div class="td"></div> <div class="clear-both"></div> </div> <div class="tr assignGroupItem"> <div class="tl two_liner">New Group<br /> <span style="text-transform:none; font-size:12px;">(separate by comma)</span></div> <div class="td"> <input name="" type="text" class="input_type_filter" value="eg. group1, group2" id="groupText" style="color:#AAAAAA"/> </div> <div class="clear-both"></div> </div>'+extra+'</div><div class="th_sub rep_sprite"><span class="rep_sprite_backup info float-left">The IWP Client Plugin should be installed on the sites before adding them.</span><div class="btn_action float-right "><a class="rep_sprite addSiteButton">Add Site</a></div></div><div class="clear-both"></div>  </div>';
	$("#modalDiv").dialog("close");
	$("#modalDiv").dialog("destroy");
	$('#modalDiv').html(content).dialog({width:'auto', modal:true,position: 'center' });
	$(".assignGroupItem").hide();
	
}
function loadActivityPopup(data)
{
	$("#activityPopup").html(data.data.getHistoryPanelHTML);
}
function callActivityPopup()
{
	tempArray={}
	tempArray['requiredData']={};
	tempArray['requiredData']['getHistoryPanelHTML']=1;
	doCall(ajaxCallPath,tempArray,'loadActivityPopup','json');
	
}

function loadComputer()
{
	content='<div class="itempanel_ind"><div id="uploaderContent"></div><div class="btn_action float-left" style="margin:-5px 0 0 -31px"><a class="rep_sprite installFromComputer">Install '+activeItem+'</a></div><div class="clear-both"></div></div>';
	return content;
}
function loadURL()
{
	content=' <div class="itempanel_ind"> <div class="float-left" style="text-align:right; color:#737987; padding-top: 15px;"><span class="droid700" style="font-size:11px;">ENTER URL</span><br /></div><div class="float-left"> <input name="" type="text" id="installFromURLTxt" class="txt onEnter" style="width: 300px; height: 17px; margin: 5px;" onenterbtn="#installFromURL" /><br><span>eg. <span class="droid700">http://</span>www.wordpress.org</span> </div>  <div class="btn_action float-left"><a class="rep_sprite disabled" id="installFromURL" style="margin-left:20px">Install '+activeItem+'</a></div><div class="clear-both"></div> </div></div>';
	return content;
}
function loadBackup(multiple,siteID)
{
	if(multiple==1)
	{
	extra=' <div class="th_sub rep_sprite"><ul class="two_steps"><li><a class="current rep_sprite_backup" id="selectWebsitesTab">SELECT WEBSITES</a></li> <li class="line"></li> <li><a id="enterDetailsTab" class="clickNone">ENTER DETAILS</a></li></ul> </div><div class="siteSelectorContainer">'+siteSelectorVar+'</div> <div id="backupOptions" style="display:none">';
	siteName='';
	bkBtn='<div class="btn_next_step float-right rep_sprite disabled" id="enterBackupDetails">Enter Details<div class="taper"></div></div><div class="btn_action float-right"><a class="rep_sprite" id="backupNow" style="display:none">Backup Now</a></div></div>';
	}
	else 
	{
	extra=' <div id="siteIDForBackup" style="display:none">'+siteID+'</div> <div id="backupOptions" class="singleBackup">';
	siteName=' - '+site[siteID].name;
	bkBtn='<div class="btn_action float-right"><a class="rep_sprite" id="backupNow">Backup Now</a></div></div> ';
	}
	
	content='<div class="dialog_cont create_backup create_backup_sitewise"> <div class="th rep_sprite"> <div class="title droid700">CREATE A NEW BACKUP'+siteName+'</div> <a class="cancel rep_sprite_backup">cancel</a></div>  '+extra+'  <div class="float-left" style="padding:20px; width:45%;"> <div class="label">BACKUP NAME</div> <input name="" type="text" id="backupName" /> <div class="checkbox active generalSelect" id="compression">No compression</div> <div class="checkbox generalSelect" id="databaseOptimize">Optimize database tables before backup</div> </div> <div class="float-left" style="padding:20px; width:45%;"> <div class="backup_what float-left" style="padding:0;"> <div class="label">WHAT?</div> <ul class="btn_radio_slelect" style="margin-bottom:20px"> <li><a class="rep_sprite active optionSelect backupType" id="full">Files & DB</a></li> <li><a class="rep_sprite optionSelect backupType" id="db">DB only</a></li> </ul> <div class="clear-both"></div> <div id="backupDB"><div class="label_sub">Exclude files & folders</div> <input name="" class="txtHelp" id="excludeFiles" type="text" value="eg., old-backup.zip, wp-content/old-backups" helpTxt="eg., old-backup.zip, wp-content/old-backups" style="color:#AAAAAA"> <div class="label_sub">Include folders</div> <input name="" type="text" id="includeFolders" > <div style="font-size:11px; color:#666; margin-top: -12px;">in addition to the default <span class="droid700">wp-admin, wp-content and wp-includes</span> folders.</div></div> </div> </div></div><div class="clear-both"></div> <div class="th rep_sprite" style="border-top:1px solid #c6c9ca; height: 35px;">'+bkBtn+'</div>';
	$("#modalDiv").dialog("close");
	$("#modalDiv").dialog("destroy");
	$('#modalDiv').html(content).dialog({width:'auto',modal:true,position: 'center'});
  
}
function loadBackupPage(data)
{
	data=data.data.getSitesBackupsHTML;
	content='<div class="result_block backup backup_sitewise shadow_stroke_box siteSearch" id="backupPageMainCont"><div class="th rep_sprite"><div class="type_filter "><input name="" type="text" class="input_type_filter searchItems" value="type to filter"><div class="clear_input rep_sprite_backup"></div></div><div class="btn_action float-right"><a class="rep_sprite multiBackup">Create New Backup</a></div></div><div class="no_match hiddenCont" style="display:none">Bummer, there are no backups that match.<br />Try typing lesser characters.</div>'+data+'</div>';
	$("#pageContent").html(content);
 $(".removeBackup").qtip({content: { text: 'Delete Backup' }, position: { my: 'left center', at: 'right center' }, show: { event: 'mouseenter' }, hide: { event: 'mouseleave' }, style: { classes: 'ui-tooltip-shadow ui-tooltip-dark',  tip: {  corner: true, width: 5, height:8} } });
  $(".download").qtip({content: { text: 'Download Backup' }, position: { my: 'right center', at: 'left center' }, show: { event: 'mouseenter' }, hide: { event: 'mouseleave' }, style: { classes: 'ui-tooltip-shadow ui-tooltip-dark',  tip: {  corner: true, width: 5, height:8} } });
}
function loadHistoryPage(data)
{
content='<div class="result_block shadow_stroke_box history"> <div class="th rep_sprite"> <div class="title"><span class="droid700">Filter by period</span></div><div><div id="widget"> <div id="widgetField"> <span id="dateContainer">Select Date Range<div class="cal_arrow"></div></span> </div> <div id="widgetCalendar" style="height:0"> </div> </div><span class="refreshData rep_sprite"><span class="rep_sprite_backup"></span></span></div><div id="historyPagination"> <a id="historyPagination_m_left" class="jPaginatorMax"></a><div id="historyPagination_o_left" class="jPaginatorOver"></div> <div class="paginator_p_wrap"> <div class="paginator_p_bloc"> </div> </div> <div id="historyPagination_o_right" class="jPaginatorOver"></div><a id="historyPagination_m_right" class="jPaginatorMax"></a> <div class="paginator_slider" class="ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all"> <a class="ui-slider-handle ui-state-default ui-corner-all" href="#"></a> </div> </div></div>';
content=content+'';
content=content+'<div id="historyPageContent">'+data+'</div> </div>';
$("#pageContent").html(content);
	var now3 = new Date();
		now3.addDays(-4);
		var now4 = new Date();
	$('#widgetCalendar').DatePicker({
			flat: true,
			format: 'b d, Y',
			date: [new Date(now3), new Date(now4)],
			calendars:1,
			mode: 'range',
			starts: 1,
			onChange: function(formated) {
					$('#widgetField #dateContainer').get(0).innerHTML = formated.join(' - ');
					$("#widgetField #dateContainer").append('<div class="cal_arrow"></div>');
			}
		});
		loadHistoryPageContent(data);
		  $(".history .refreshData").qtip({content: { text: 'Reload Data' }, position: { my: 'left center', at: 'right center' }, show: { event: 'mouseenter' }, hide: { event: 'mouseleave' }, style: { classes: 'ui-tooltip-shadow ui-tooltip-dark' } });
}
function loadHistoryPageContent(data)
{
	data=data.data.getHistoryPageHTML;
	$("#historyPageContent").html(data);
	
}
function loadBottomToolbarOptions(siteID)
{
	content='<div class="ind_sites_nav" id="bottomToolbarOptions"><span id="hiddenhref" style="display:none"></span> <div class="left"> <div class="nav_admin"><a class="link openHere"  sid="'+siteID+'">Open admin here</a><a class="link adminPopout"  sid="'+siteID+'">Open admin <img src="images/open_admin_new.gif" width="10px" height="10px"></a></div> <div class="nav_backup"><a class="link"  sid="'+siteID+'" id="singleBackupNow">Backup Now</a><a class="link"  id="viewBackups" sid="'+siteID+'">View Backups</a></div> </div> <div class="right"> <div class="nav_view_site"><a class="link closeBottomToolBar" href="'+site[siteID].URL+'" target="_blank">View Site</a><a class="link newPost" sid="'+siteID+'">Write new post</a></div> <div class="nav_options"><a class="link_long remove rep_sprite_backup removeSite" sid="'+siteID+'">Remove</a></div> </div> </div>';
	$("#bottomToolBarSelector").append(content);
	
}
function loadBackupPopup(data)
{

	content=data.data.getSiteBackupsHTML;
	$("#modalDiv").dialog("close");
	$("#modalDiv").dialog("destroy");
	$('#modalDiv').html(content).dialog({width:'auto',modal:true,position: 'center'});
}
function loadAdminPopout(object,sid,extra)
{
	
	where='';
	if(extra==1)
	where='post-new';
	processLink=ajaxCallPath+'?action=loadSite&args[siteIDs][]='+sid+'&args[params][where]='+where;
	
	$(object).attr('href',processLink);
	$(object).attr('target','_blank');
	$(object).attr('clicked','1');
	//$(object).click();
	resetBottomToolbar();
	
}
function loadPreview(url)
{
		$("#modalDiv").dialog("close");
	$("#modalDiv").dialog("destroy");
	 heightVal=($(window).height())-140;
	widthVal=$(window).width()-100;
	$("#loadingDiv").show();
	setTimeout(function () {	$("#loadingDiv").hide();},1000);
	content = '<div class="preview_box"><iframe src="'+url+'" height="'+heightVal+'px" width="'+widthVal+'px" ></iframe><div class="preview_close cancel">close</div></div>';
	$('#modalDiv').html(content).dialog({width:'auto', modal:true,position: 'center',create: function(event, ui) {$("html").css({ overflow: 'hidden' })  },close: function(event, ui) { $("html").css({ overflow: 'auto' }) } });

}
function loadAdminHere(sid)
{
	 $("#pageContent").hide();
	 heightVal=($(window).height())-33;
	widthVal=$(window).width();
		processLink=ajaxCallPath+'?action=loadSite&args[siteIDs][]='+sid+'&args[params][where]=';
	content = '<iframe src="'+processLink+'" height="'+heightVal+'px" width="'+widthVal+'px" ></iframe>';
	$("#modalDiv").dialog("close");
	$("#modalDiv").dialog("destroy");
	$('#modalDiv').dialog({width:'auto',modal:true,dialogClass: 'padding_fix',position: 'center',create: function(event, ui) {
		$("#modalDiv").html(content);
		$("#toolbar_sites_cont").remove();
	tContent='<div id="toolbar_sites_cont" style="display:none"><div class="sep"></div> <div class="site rep_sprite"><div class="favicon_cont"><img src="https://getfavicon.appspot.com/'+site[sid].URL+'?defaulticon=http://s.wordpress.org/favicon.ico"></div><div class="site_name">'+site[sid].name+'</div><div class="close rep_sprite_backup closePopup"></div></div> </div>';
	$("#addWebsiteContainer").after(tContent);
	$("#toolbar_sites_cont").show("slide", { direction: "left" }, 500);
$("html").css({ overflow: 'hidden' })

 },
 close: function(event, ui) {
 $("#pageContent").show();
 $("html").css({ overflow: 'auto' })
 $("#toolbar_sites_cont").hide("slide", { direction: "left" }, 500);
// $("#toolbar_sites_cont").remove();
 }});

 $(".nano").nanoScroller();
 if(toolTipData.adminPopup!="true")
 $('.showFooterSelector').qtip('show');
 
}
function loadRemoveSite(sid)
{
	content='<div class="dialog_cont remove_site"> <div class="th rep_sprite"> <div class="title droid700">REMOVE WEBSITE FROM IWP</div> <a class="cancel rep_sprite_backup">cancel</a></div> <div style="padding:20px;"><div style="text-align:center;" id="removeSiteCont">Are you sure you want to remove this website?<div class="site">'+site[sid].URL+'</div><span>IWP Plugin will be deactivated.</span></div></div> <div class="clear-both"></div> <div class="th_sub rep_sprite" style="border-top:1px solid #c6c9ca;" id="removeSiteButtons"><div class="warning rep_sprite_backup">This action cannot be undone.</div> <div class="btn_action float-right"><a class="rep_sprite" id="removeSiteConfirm">Remove</a></div> <span class="float-right cancel" id="dontRemoveSite">Don\'t remove</span> </div> </div>';
	$("#modalDiv").dialog("close");
	$("#modalDiv").dialog("destroy");
	$('#modalDiv').html(content).dialog({width:'auto',modal:true,position: 'center'});
	$("#removeSiteConfirm").attr('sid',sid);
	
}

function loadSettingsPage(data)
{
	
	iContent='';
	data= data.data.getSettingsAll;
	$("#amount01").val(data.settings.general.MAX_SIMULTANEOUS_REQUEST_PER_IP);
	$("#amount02").val(data.settings.general.MAX_SIMULTANEOUS_REQUEST);
	$("#amount03").val(data.settings.general.TIME_DELAY_BETWEEN_REQUEST_PER_IP);
	$( "#slider-range01" ).slider( "value",data.settings.general.MAX_SIMULTANEOUS_REQUEST_PER_IP);
	$( "#slider-range02" ).slider( "value", data.settings.general.MAX_SIMULTANEOUS_REQUEST);
	$( "#slider-range03" ).slider( "value", data.settings.general.TIME_DELAY_BETWEEN_REQUEST_PER_IP);
	if(data.settings.general.sendAnonymous!='' && data.settings.general.sendAnonymous!=0)
	$("#sendAnonymous").addClass('active');
	else
	$("#sendAnonymous").removeClass('active');

	if( getPropertyCount(data.settings.allowedLoginIPs)>0)
	{
		$.each(data.settings.allowedLoginIPs, function (IP)
	{
			iContent=iContent+'<div class="ip_cont"><span class="droid700 IPData">'+IP+'</span><span class="remove removeIP ">remove</span></div>';
	});
	}
	else iContent = "<div id='noIP'>No IPs added.</div>";
	$("#noIP").remove();
	$(".ip_cont").remove();
	$("#currentPassword").text('Current Password');
	$("#newPassword").text('New Password');
	$("#newPasswordCheck").text('New Password Again');
	$(".change_pass_cont").hide();
	$("#IPContent .label").after(iContent);
	$("#email").val(data.accountSettings.email);
}