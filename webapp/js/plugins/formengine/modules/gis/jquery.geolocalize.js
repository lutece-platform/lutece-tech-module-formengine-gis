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
		
	},
	
	addGisEventListeners : function( ) 
	{				
		var updateInputField = function(event) {	
			var assertZero = function (data) { return !Number(data)>0 };
			if( assertZero(event.lonLat.lat) && 
				assertZero(event.lonLat.lon) &&
				event.address.length == 0
			){
				GeolocUtils.setLatInputField( "" );	
				GeolocUtils.setLonInputField( "" );
				GeolocUtils.setAddressInputField( "" );
			}else{
				GeolocUtils.setLatInputField( event.lonLat.lat );	
				GeolocUtils.setLonInputField( event.lonLat.lon );			
				if( event.namespace != 'dragComplete' && event.address.length != 0 ){
					GeolocUtils.setAddressInputField( event.address );
				}
			}
		};
		$("body").bind( 'GisLocalization.done', updateInputField);
		$("body").bind( 'GisLocalization.dragComplete', updateInputField);

		$(GeolocUtils.params.thisOject).bind(GeolocUtils.params.onEvent, 
				$.proxy(function (event){
					if (  event.type != 'keypress' || event.keyCode == 13 ){
						GeolocUtils.placeChangedEvent(event);
					}
				},
				this)		
		);
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
	
	setLonInputField: function ( data ) 
	{
		$("input[name='" + GeolocUtils.params.inputLngName + "']").val(data);
	},
	
	setLatInputField: function (data ) 
	{
		$("input[name='" + GeolocUtils.params.inputLatName + "']").val(data);
	},
	
	placeChangedEvent : function() 
	{
		var input = document.getElementById($(GeolocUtils.params.thisOject).attr('id'));
		$('body').trigger(
				jQuery.Event('GisLocalization.send', { 
					address: $(input).val() 
				})
		);
	}
};

jQuery.fn.geolocalize = function(params) {
	params = $.extend({
		inputLngName : "lng",
		inputLatName : "lat",
		onEvent :  "change",
		idMapDiv : "carte",
		mapHeight : "400px",
		mapWidth : "100%"
	}, params);
	
	params.thisOject = this;
	
	$(this).keypress(function(event) {
		return event.keyCode != 13;
	});
	
	$(document).ready(function(){
		GeolocUtils.initGeolocalization(params);
		GeolocUtils.initAutocomplete( );
		GeolocUtils.addGisEventListeners( ); 
		GeolocUtils.showMap( );
	});
	return this;
};