/* PRINCIPLES ############################################ */
// 1. API'S URL:
// 1a.Parts of the url:
wd = "http://www.wikidata.org/w/api.php?";
wp = "http://en.wikipedia.org/w/api.php?"; // list of iso-code = ? ----------------<
aw = "action=wbgetentities" ; // rather wdpoint
aq = "action=query" ; // ?rather wppage
ts = "&sites=enwiki" ; // wd only&required. // list of wiki-code = ? --------------<
t = "&titles=" // target, wd|wp
i = "Dragon"; //item, wd|wp

l  = "&languages=zh|zh-classical|zh-cn|zh-hans|zh-hant|zh-hk|zh-min-nan|zh-mo|zh-my|zh-sg|zh-tw|fr" ; // wdpoint only
ps = "&props=sitelinks|labels|aliases|descriptions" ; // wdpoint only
  //sitelinks: all interwikis
  //labels: title without _(tag), for l (languages) only
  //aliases: label of redirect page
p = "&prop=extracts&exintro&explaintext&exsentences=10" ; // wppage only
r = "&redirects&converttitles" ; // wppage only
c = "&callback=?" ;// wd|wp
f = "&format=json" ;// wd|wp

//1b. Compose your url:
  urlwd = wd+aw+ts+t+i+l+ps    +c+f; // typical wd query
  url   = wp+aq   +t+i     +p+r+c+f; // typical wp query
// Examples print in console:
console.log("1. WD: "+urlwd);
console.log("2. WP: "+url);

/* translate *********************************************** */
var wikidata_translate = function (item,isolang) {
    var url = wd+aw+ts+t+item+l+ps    +c+f, // typical wd query
        iso = isolang+"wiki",
        trad="";
    console.log(url);
    $.getJSON(url, function (json) {
        trad =  json.entities[ Object.keys(json.entities)[0] ].sitelinks[iso].title;
			console.log("1  "+trad);
    })
return trad;
};
console.log(wikidata_translate("Dragon", "hi") /**/)


// 2a. Single query :
function WD(item) {
    url   = wd+aq+"&sites=hiwiki"+t+ wikidata_translate(item) +p+r+c+f;  console.log(url);
    $.getJSON(url, function (json) {
        var item_id = Object.keys(json.query.pages)[0]; // THIS DO THE TRICK !
        var extract = json.query.pages[item_id].extract;
        var result = "<b>En :</b> <t>" + item + "</t> <b>⇒</b> " + extract;
        $('#anchor1').append("<div>"+result+"</div>"); // append
    });
}; 
WD("Dragon");

// 2b. Single query (alternative code):
function WD_i(item) {
        //var be = item
        url_tpl = wp+aq+t+ item +p+r+c+f;
        $.getJSON(url_tpl, function (data) {
            $.each(data.query.pages, function (i, json) { // THIS DO THE TRICK !
                sent = json.extract.toString();
                result = "<b>En:</b> <t>" + item + "</t> <b>⇒</b> " + sent;
                $('#anchor2').append("<div>"+result+"</div>");// append
            });
        });
}
WD_i("unicorn");

/* LOOP ************************************************** */
// 2c. LOOP on a list of existing articles
function WD_list(list) {
    $.each(list, function (a, item) {
        WD_i(item);
    });
}

var List = [ "Mushroom","Laptop","Sea lion"];
WD_list(List);