/**
This jquery plugin allows you to change a text input into a auto complexion field to find an address.

You can adjust the address precisely on a map afterwards.

How to use it :

<link rel="stylesheet" type="text/css" href="css/plugins/gis/gis.css" media="screen, projection, print"/>
<link rel="stylesheet" type="text/css" href="js/plugins/gis/openlayers/Legend.css" />
<link rel="stylesheet" type="text/css" href="js/plugins/gis/openlayers/GeolocalizationPanel.css" />
<link rel="stylesheet" type="text/css" href="js/plugins/gis/openlayers/LayerSearchPanel.css" />
<link rel="stylesheet" type="text/css" href="js/plugins/gis/openlayers/default/style.css" />
<script src="js/jquery.geolocalize.js" type="text/javascript"></script>
<script src="js/plugins/gis/LABjs-1.0.2rc1/LAB.js" type="text/javascript"></script>
<script src="js/plugins/gis/gis.js" type="text/javascript"></script>
<script type="text/javascript">
	$("#searchTextField").geolocalize( {gisCode: MAP_GIS_CODE });
</script>

You can change the default settings by overwriting them. Example :
$("#searchTextField").geolocalize({mapHeight : "400px", mapWidth : "100%"});
	
 */
var GeolocUtils = {
	params : null,

	initGeolocalization : function( params )
	{
		GeolocUtils.params = params;
	},

	initAutocomplete : function( ) 
	{
		var Csslink = document.createElement("link");
		Csslink.rel="STYLESHEET";
		Csslink.type="text/css";
		Csslink.href="js/jquery/plugins/ui/css/jquery-ui.css";
		document.getElementsByTagName('head')[0].appendChild(Csslink);
		
		$.getScript('js/jquery/plugins/ui/jquery.ui.custom-autocomplete.min.js');
		$.getScript('jsp/plugins/address/modules/autocomplete/autocomplete-js.jsp',function(data, textStatus, jqxhr) {
   			createAutocomplete(GeolocUtils.params.thisOject.selector);
		});
	},
	
	addGisEventListeners : function( ) 
	{				
		var updateInputField = function(event) {	
			var assertZero = function (data) { return !Number(data)>0 };
			if( assertZero(event.lonLat.lat) && 
				assertZero(event.lonLat.lon) &&
				event.address.length == 0
			){
				if( event.inverse ) {
					GeolocUtils.setAddressInputField( "" );
				}
				GeolocUtils.setLatInputField( "" );	GeolocUtils.setLonInputField( "" );
			}else{
				GeolocUtils.setLatInputField( event.lonLat.lat ); GeolocUtils.setLonInputField( event.lonLat.lon );			
				if( event.namespace != 'dragComplete' && event.address.length != 0 ){
					GeolocUtils.setAddressInputField( event.address );
				}
				
				if( GeolocUtils.params.addressValid == true )
				{
					$(GeolocUtils.params.thisOject).bind("change", 
							$.proxy(function (event){
								if( event.keyCode != 13 ) {
									GeolocUtils.cleanMapEvent( );
									GeolocUtils.setLatInputField( "" );	GeolocUtils.setLonInputField( "" );
								}
								$(GeolocUtils.params.thisOject).unbind("change");
							},
							this)
							
					);	
				}
			}		
		};
		$("body").bind( 'GisLocalization.done', updateInputField);
		$("body").bind( 'GisLocalization.dragComplete', updateInputField);
		
		var reloadAddress = function ( ) {
			var addressFieldValue = GeolocUtils.getAddressInputField( );
			if( addressFieldValue != ""){
					$('body').trigger(
							jQuery.Event( 'GisLocalization.send',  { 'address': addressFieldValue } )
					); 
			}
		};
		
		if( GeolocUtils.params.addressAutoReload ) {
			$("body").bind( 'GisMap.displayComplete', reloadAddress );
		}
		
		var onDisplayMap = GeolocUtils.params.onDisplayMap;
		if( onDisplayMap != undefined || onDisplayMap != null ) {
			$("body").bind( 'GisMap.displayComplete', onDisplayMap );
		}
		
		if( GeolocUtils.params.autoComplete != true) 
		{
			$(GeolocUtils.params.thisOject).bind(GeolocUtils.params.onEvent, 
				$.proxy(function (event){
						GeolocUtils.placeChangedEvent(event);
				},
				this)		
			);
		}
		$(GeolocUtils.params.thisOject).bind("keypress", 
			$.proxy(function (event){
				if ( event.keyCode == 13 ){
					GeolocUtils.placeChangedEvent(event);
				}
			},
			this)		
		);
		
		$( GeolocUtils.params.thisOject ).bind( "autocompleteselect", function(event, ui) {
			$('body').trigger(
				jQuery.Event('GisLocalization.send', { 
					address: ui.item.value
				})
			);
		});
	},
	
	showMap : function( ) 
	{
		var idMapDiv = GeolocUtils.params.idMapDiv;
		$( "#" +idMapDiv ).css("height", GeolocUtils.params.mapHeight);
		$( "#" +idMapDiv ).css("width", GeolocUtils.params.mapWidth);
		
		var optionalParameters = {};
	
		$( "#" +idMapDiv ).data('optionalParameters', optionalParameters);	
		$(document).ready(function() {
		var baseUrl = $('base').attr('href');
				$LAB
					.script(baseUrl +"js/plugins/gis/openlayers/OpenLayers.js").wait()
					.script(baseUrl +"js/plugins/gis/openlayers/CustomLayerSwitcher.js").wait()
					.script(baseUrl +"js/plugins/gis/openlayers/Legend.js").wait()
					.script(baseUrl +"js/plugins/gis/openlayers/LayerSearchPanel.js").wait()
					.script(baseUrl +"js/plugins/gis/openlayers/GeolocalizationPanel.js").wait()
					.script(baseUrl +"js/plugins/gis/gis.js").wait()
					.wait(function(){
						$.get(baseUrl +'/jsp/site/plugins/gis/DoDisplayMap.jsp?map_name='+idMapDiv+'&gis_code='+GeolocUtils.params.gisCode, 
								function(data){
									$("#"+idMapDiv).html(data);
									$("#"+idMapDiv).show();
								});
					});
		});
	},

	setAddressInputField: function ( data ) 
	{
		$(document.getElementById($(GeolocUtils.params.thisOject).attr('id'))).val(data);
	},
	
	getAddressInputField: function ( )
	{
		return $.trim( 
				$(document.getElementById($(GeolocUtils.params.thisOject).attr('id'))).val() 
		);
	},
	
	setLonInputField: function ( data ) 
	{
		$("input[name='" + GeolocUtils.params.inputLngName + "']").val(data);
	},
	
	setLatInputField: function (data ) 
	{
		$("input[name='" + GeolocUtils.params.inputLatName + "']").val(data);
	},
	
	cleanMapEvent : function ()
	{
		$('body').trigger( jQuery.Event('GisLocalization.clean') );
	},
	
	placeChangedEvent : function() 
	{
		$('body').trigger(
				jQuery.Event('GisLocalization.send', { 
					address: GeolocUtils.getAddressInputField( ) 
				})
		);
	}
};

jQuery.fn.geolocalize = function(params) {
	params = $.extend({
		inputLngName : "lng",	    // ID of the longitude input text field.
		inputLatName : "lat",		// ID of the latitude input text field.
		onEvent :  "change",    	// Exectute a geo-localization request after this event is triggered ( when autoComplete = false ).
		onDisplayMap : undefined,	// Function triggered after map is displayed.
		addressAutoReload : true,	// Execute geolocalization request when address input text field is not empty after the page is fully loaded.
		addressValid : true,		// Clean the map whether address input text field is modified after a geo-localization request.
		idMapDiv : "map_canvas",	// ID of the div that which contain the map.
		mapHeight : "400px",    	// Height of the displayed map.
		mapWidth : "100%",			// Width of the displayed map.
		autoComplete : true,		// Activate/deactivate auto-complete feature from the address input text field.
		
	}, params);
	
	params.thisOject = this;
	
	$(this).keypress(function(event) {
		return event.keyCode != 13;
	});
	
	$(document).ready(function(){
		GeolocUtils.initGeolocalization(params);
		if( GeolocUtils.params.autoComplete == true) 
		{
			GeolocUtils.initAutocomplete( );
		}
		GeolocUtils.addGisEventListeners( ); 
		GeolocUtils.showMap( );
		
	});
	return this;
};
