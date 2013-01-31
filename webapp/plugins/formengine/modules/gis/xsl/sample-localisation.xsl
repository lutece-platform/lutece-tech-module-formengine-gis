<?xml version="1.0"  encoding="UTF-8"  ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

	<xsl:include href="../../../xsl/formelements.xsl" />

	<xsl:param name="keyMaps" />
	<xsl:param name="breadCrumb" />
	<xsl:param name="colonneInfo" />
	<xsl:template match="formElements">
		<div class="formulaire">
		<!-- <xsl:call-template name="mandatory-notice" /> -->
		<img class="top_first_step" src="images/top_first_step.png" />
		<xsl:value-of select="$breadCrumb" disable-output-escaping="yes" />
		<div class="formengine-steps" style="height:auto;">
		    <link rel="stylesheet" type="text/css" href="css/plugins/gis/gis.css" media="screen, projection, print"/>
			<link rel="stylesheet" type="text/css" href="js/plugins/gis/openlayers/Legend.css" />
			<link rel="stylesheet" type="text/css" href="js/plugins/gis/openlayers/GeolocalizationPanel.css" />
			<link rel="stylesheet" type="text/css" href="js/plugins/gis/openlayers/LayerSearchPanel.css" />
			<link rel="stylesheet" type="text/css" href="js/plugins/gis/openlayers/default/style.css" />
			<script src="js/plugins/formengine/modules/gis/jquery.geolocalize.js" type="text/javascript"></script>
			<script src="js/plugins/gis/LABjs-1.0.2rc1/LAB.js" type="text/javascript"></script>
			<script src="js/plugins/gis/gis.js" type="text/javascript"></script>
			<script type="text/javascript">
				// Initialize GIS map
				$(document).ready(function() {
				$("#adresse").geolocalizeSuggestPOI({
					mapHeight: "400px",
					mapWidth: "99.25%",
					inputLngName : "lng",
					inputLatName : "lat",
					gisCode : "TEST", 
					sourceSRID : "EPSG:27561",
					destSRID : "EPSG:4326"
				}).focus();
				});
				</script>
			<div style="width:100%">
				<div class="address">
					<xsl:apply-templates select="fields/field[@name='adresse']" />
				</div>
			</div>
			<div style="width:100%">
				<div class="coordinates">
					<xsl:apply-templates select="fields/field[@name='lng']" />
					<xsl:apply-templates select="fields/field[@name='lat']" />
				</div>
			</div>
			<div id="carte" class="map" style="display:none;"></div>
			<div style="width:100%">
				<xsl:call-template name="button-list" />
			</div>
		</div>
		</div>
		<div class="colonneInfo">
			<xsl:value-of select="$colonneInfo"
				disable-output-escaping="yes" />
		</div>
	</xsl:template>

</xsl:stylesheet>