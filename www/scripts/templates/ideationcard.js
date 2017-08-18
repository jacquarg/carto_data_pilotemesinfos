function pug_attr(t,e,n,f){return e!==!1&&null!=e&&(e||"class"!==t&&"style"!==t)?e===!0?" "+(f?t:t+'="'+t+'"'):("function"==typeof e.toJSON&&(e=e.toJSON()),"string"==typeof e||(e=JSON.stringify(e),n||e.indexOf('"')===-1)?(n&&(e=pug_escape(e))," "+t+'="'+e+'"'):" "+t+"='"+e.replace(/'/g,"&#39;")+"'"):""}
function pug_escape(e){var a=""+e,t=pug_match_html.exec(a);if(!t)return e;var r,c,n,s="";for(r=t.index,c=0;r<a.length;r++){switch(a.charCodeAt(r)){case 34:n="&quot;";break;case 38:n="&amp;";break;case 60:n="&lt;";break;case 62:n="&gt;";break;default:continue}c!==r&&(s+=a.substring(c,r)),c=r+1,s+=n}return c!==r?s+a.substring(c,r):s}
var pug_has_own_property=Object.prototype.hasOwnProperty;
var pug_match_html=/["&<>]/;
function pug_style(r){if(!r)return"";if("object"==typeof r){var t="";for(var e in r)pug_has_own_property.call(r,e)&&(t=t+e+":"+r[e]+";");return t}return r+="",";"!==r[r.length-1]?r+";":r}function ideationcardTemplate(locals) {var pug_html = "", pug_mixins = {}, pug_interp;;var locals_for_with = (locals || {});(function (description, index, label, sourceDataController, spirceDataController, typology, typologyColor, updateFrequency) {pug_html = pug_html + "\u003Cdiv class=\"ideationcard\"\u003E\u003Cdiv" + (" class=\"typology\""+pug_attr("style", pug_style("background-color: rgb(" + typologyColor.r + "," + typologyColor.g + "," + typologyColor.b + ");"), true, false)) + "\u003E" + (pug_escape(null == (pug_interp = typology) ? "" : pug_interp)) + "\u003C\u002Fdiv\u003E\u003Cdiv class=\"name\"\u003E\u003Cspan\u003E" + (pug_escape(null == (pug_interp = label) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003C\u002Fdiv\u003E\u003Cimg" + (" class=\"holder\""+pug_attr("src", "img/creationcard/logo_" + sourceDataController.toLowerCase() + ".png", true, false)+pug_attr("title", spirceDataController, true, false)) + "\u002F\u003E\u003Cdiv class=\"description\"\u003E" + (pug_escape(null == (pug_interp = description) ? "" : pug_interp)) + "\u003C\u002Fdiv\u003E\u003Cdiv class=\"frequency\"\u003E\u003Cimg src=\"img\u002Fcreationcard\u002Ffrequency_gauge.svg\"\u002F\u003E\u003Cspan\u003E" + (pug_escape(null == (pug_interp = updateFrequency) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003C\u002Fdiv\u003E";
if (index) {
}
pug_html = pug_html + "\u003Cdiv class=\"index\"\u003E" + (pug_escape(null == (pug_interp = index) ? "" : pug_interp)) + "\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";}.call(this,"description" in locals_for_with?locals_for_with.description:typeof description!=="undefined"?description:undefined,"index" in locals_for_with?locals_for_with.index:typeof index!=="undefined"?index:undefined,"label" in locals_for_with?locals_for_with.label:typeof label!=="undefined"?label:undefined,"sourceDataController" in locals_for_with?locals_for_with.sourceDataController:typeof sourceDataController!=="undefined"?sourceDataController:undefined,"spirceDataController" in locals_for_with?locals_for_with.spirceDataController:typeof spirceDataController!=="undefined"?spirceDataController:undefined,"typology" in locals_for_with?locals_for_with.typology:typeof typology!=="undefined"?typology:undefined,"typologyColor" in locals_for_with?locals_for_with.typologyColor:typeof typologyColor!=="undefined"?typologyColor:undefined,"updateFrequency" in locals_for_with?locals_for_with.updateFrequency:typeof updateFrequency!=="undefined"?updateFrequency:undefined));;return pug_html;}