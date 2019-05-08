var UPLEFT = new Place(41.79492, -87.60619);
var BOTRIGHT = new Place(41.78329, -87.58944);
var ANCESTRAL = new Place(41.80097, -87.58549);
var METRA = [[new Place(41.7955918, -87.590176),'[55] 55th Street & Blackstone'],
    [new Place(41.794872, -87.605782),'[55] 55th Street & Cottage Grove'],
    [new Place(41.7947371, -87.5918142),'[55] 55th Street & Dorchester'],
    [new Place(41.7950767, -87.6040402),'[55] 55th Street & Drexel'],
    [new Place(41.7949276, -87.6009732),'[55] 55th Street & Ellis'],
    [new Place(41.7950348, -87.5930176),'[55] 55th Street & Kenwood'],
    [new Place(41.795178, -87.5947959),'[55] 55th Street & Kimbark'],
    [new Place(41.795113, -87.587746),'[55] 55th Street & Lake Park'],
    [new Place(41.7949618, -87.5979088),'[55] 55th Street & University'],
    [new Place(41.795158, -87.596375),'[55] 55th Street & Woodlawn'],
    [new Place(41.78962, -87.586575),'[6] 5800 S Stony Island'],
    [new Place(41.786118, -87.587143),'[6/59] 60th Street & Stony Island'],
    [new Place(41.7840467, -87.6012646),'[59] 61st Street & Ellis'],
    [new Place(41.784176, -87.602615),'[59] 61st Street & Ingleside'],
    [new Place(41.7842573, -87.592937),'[59] 61st Street & Kenwood'],
    [new Place(41.7841183, -87.5959908),'[59] 61st Street & Woodlawn'],
    [new Place(41.7841369, -87.6061299),'[59] Cottage Grove & 61st Street'],
    [new Place(41.785969, -87.591408),'[59] Dorchester & 60th Street'],
    [new Place(41.784319, -87.5914962),'[59] Dorchester & 61st Street'],
    [new Place(41.7916058, -87.5837156),'[55] Museum of Science & Industry'],
    [new Place(41.795429, -87.583878),'[6] S Hyde Park & 55th Street'],
    [new Place(41.793316, -87.583801),'[6/55] S Hyde Park & 56th Street'],
    [new Place(41.79134, -87.58663),'[6] Stony Island & 57th Drive'],
    [new Place(41.788086, -87.586533),'[6] Stony Island & 59th Street'],
    [new Place(41.7839038, -87.5866339),'[6] Stony Island & 61st Street']];
var CENTRAL = new Place(41.78959, -87.59967);
var DINING = [[new Place(41.79465, -87.59866),"Campus North Residential Commons"],
              [new Place(41.79192, -87.59846),"Bartlett Dining Commons"],
              [new Place(41.78507, -87.60028),"Arley D. Cathey Dining Commons"]];
var RESIDENCES = [[new Place(41.79301, -87.59982),"Max Palevsky Residential Commons"],
                  [new Place(41.78544, -87.60028),"Burton-Judson Courts"],
                  [new Place(41.79107, -87.60054),"Snell-Hitchcock Hall"],
                  [new Place(41.78458, -87.60031),"Renee Granville-Grossman Residential Commons"],
                  [new Place(41.78822, -87.59088),"International House"],
                  [new Place(41.79465, -87.59866),"Campus North Residential Commons"]];
var THEREG = new Place(41.79227, -87.59995);
var IMGWIDTH = 783;
var IMGHEIGH = 728;
function Place(l,k){
    this.lat = l;
    this.long = k;
    this.to = function(p){
        return Math.sqrt(Math.pow((this.lat-p.lat),2)+Math.pow((this.long-p.long),2));
    };
}
function Fragment(l,k){
    Place.call(this,l,k);
    this.ancestral = this.to(ANCESTRAL);
    this.central = this.to(CENTRAL);
    this.library = this.to(THEREG);
    this.d = function(){
        var c = [[this.to(DINING[0][0]),DINING[0][1]],
            [this.to(DINING[1][0]),DINING[1][1]],
            [this.to(DINING[2][0]),DINING[2][1]]];
        c.sort(function(a,b){return a[0]-b[0]});
        return c[0];
    };
    this.m = function(){
        var c = [];
        for(i in METRA){
            c.push([this.to(METRA[i][0]),METRA[i][1]]);
        }
        c.sort(function(a,b){return a[0]-b[0]});
        return c[0];
    };
    this.dining = this.d();
    this.metra = this.m();
    this.s = function(){
        var OFFSET = 0.00107324475;
        var p = Math.pow(this.ancestral+OFFSET,.3333)*Math.pow(this.central+OFFSET,2)*Math.pow(this.dining[0]+OFFSET,3)*Math.pow(this.library+OFFSET,2)*Math.pow(this.metra[0]+OFFSET,1);
        return Math.pow(p,1/8.3333);
    };
    this.score = this.s();
}
function fracture(x,y,z,a){
    var b = [];
    for(var i=x.lat+(((y.lat-x.lat)/z)/2); i>y.lat+(((y.lat-x.lat)/z)/2);i+=((y.lat-x.lat)/z)){
        var c = [];
        for(var j=x.long+(((y.long-x.long)/a)/2); j<y.long+(((y.long-x.long)/a)/2); j+=((y.long-x.long)/a)){
            c.push(new Fragment(i,j));
        }
        b.push(c);
    }
    return b;
}
var OPARR = fracture(UPLEFT,BOTRIGHT,65,70);
console.log(OPARR);
var w  = (IMGWIDTH/OPARR[0].length-1)+"px";
var h = (IMGHEIGH/OPARR.length-1)+"px";
var COORDTOMET = 93175.39171766826;
function minmax(strfx){
    var b = 0;
    var a = 1e15;
    for (var i=0, j=0; i<OPARR.length && j<OPARR[0].length; j++, i=(j==OPARR[0].length)?i+1:i,j=(j==OPARR[0].length)?j=0:j) {
        if(eval("OPARR[i][j]"+strfx)<a){
            a=eval("OPARR[i][j]"+strfx);
        }
        if(eval("OPARR[i][j]"+strfx)>b){
            b=eval("OPARR[i][j]"+strfx);
        }
    }
    return [a,b]
}
var m = minmax(".score");
var min = m[0];
var max = m[1];
function redness(s){
    var range = max-min;
    var red = 100-((s-min)/range)*100;
    return perc2color(red);
}
console.log(min, max);
$(document).ready(function(){
    for (var i=0, j=0; i<OPARR.length && j<OPARR[0].length; j++, i=(j==OPARR[0].length)?i+1:i,j=(j==OPARR[0].length)?j=0:j) {
        var curr = OPARR[i][j];
        $("body").append("<div style='background-color:"+redness(curr.score)+"' data-score='"+curr.score+"'>"
            +"<span><b>Score: </b><em style='color:"+redness(curr.score)+"'>"+Math.floor(max*COORDTOMET-curr.score*COORDTOMET)+"</em><hr/>"
            +"<b>Campus Center: </b>"+Math.floor(curr.central*COORDTOMET)+"m<br/>"
            +"<b>Dining: </b>"+Math.floor(curr.dining[0]*COORDTOMET)+"m<br/><i>"+curr.dining[1]+"</i><br/>"
            +"<b>Regenstein: </b>"+Math.floor(curr.library*COORDTOMET)+"m<br/>"
            +"<b>CTA: </b>"+Math.floor(curr.metra[0]*COORDTOMET)+"m<br/><i>"+curr.metra[1]+"</i><br/>"
            +"<strong>"+(Math.floor(curr.lat*100000)/100000)+"&deg;N, "+(Math.floor(-curr.long*100000)/100000)+"&deg;W</strong></span>"+
            "</div>");
    }
    $("body").append("<nav><button id='m'>CTA</button><button id='c'>Campus Center</button><button id='d'>Dining</button><button id='r'>Regenstein</button><button id='s'>Score</button></nav>");
    $("div").css({"width" : w,
                  "height": h})
        .hover(function(){
        $(this).prev().toggleClass("prev");
        $(this).next().toggleClass("prev");
        $(this).nextAll().slice(OPARR[0].length-1,OPARR[0].length).toggleClass("prev");
        $(this).prevAll().slice(OPARR[0].length-1,OPARR[0].length).toggleClass("prev");
        $(this).nextAll().slice(OPARR[0].length-2,OPARR[0].length-1).toggleClass("prev2");
        $(this).prevAll().slice(OPARR[0].length-2,OPARR[0].length-1).toggleClass("prev2");
        $(this).nextAll().slice(OPARR[0].length,OPARR[0].length+1).toggleClass("prev2");
        $(this).prevAll().slice(OPARR[0].length,OPARR[0].length+1).toggleClass("prev2");
    });
    for(var i=0; i<RESIDENCES.length; i++){
        highlight(RESIDENCES[i][0],OPARR,RESIDENCES[i][1]);
    }
    highlight(DINING[1][0],OPARR,DINING[1][1]);
    highlight(DINING[2][0],OPARR,DINING[2][1]);
    highlight(THEREG,OPARR,"The Joseph Regenstein Library");
    $("button").click(function(e){
        e.stopPropagation();
        btPress($(this).attr("id"));
    });
    $(window).resize(function(){
        $("body").css("zoom",$(window).height()/IMGHEIGH);
    });
    $(window).resize();
    $(document).keypress(function(e){
        if(e.ctrlKey && e.which == 19){
            var segs = parseInt(prompt("Into how many segments?"),10);
            $("div").css("border-color","black");
            var hei = OPARR.length;
            var len = OPARR[0].length;
            for (var i=0, j=0; i<hei && j<len; j++, i=(j==len)?i+1:i,j=(j==len)?j=0:j) {
                var k = i*len + j;
                $("div").slice(k,k+1)
                    .attr("data-grouping",categorize(OPARR[i][j].score,min,max,segs).toString())
                    .find("span").html("<b>Class: </b><em style='color:"+redness(OPARR[i][j].score)+"'>"+categorize(OPARR[i][j].score,min,max,segs)+"</em>");
            }
            for (var i=0, j=0; i<hei && j<len; j++, i=(j==len)?i+1:i,j=(j==len)?j=0:j) {
                var k = i*len + j;
                if((k-len) >= 0){
                    if($("div").slice(k,k+1).attr("data-grouping")==$("div").slice(k-len,k-len+1).attr("data-grouping")){
                        $("div").slice(k,k+1).css("border-top",".5px solid transparent");
                    }
                }
                if((k+len) < hei*len){
                    if($("div").slice(k,k+1).attr("data-grouping")==$("div").slice(k+len,k+len+1).attr("data-grouping")){
                        $("div").slice(k,k+1).css("border-bottom",".5px solid transparent");
                    }
                }
                if(((k+1)%len) != 0){
                    if($("div").slice(k,k+1).attr("data-grouping")==$("div").slice(k+1,k+2).attr("data-grouping")){
                        $("div").slice(k,k+1).css("border-right",".5px solid transparent");
                    }
                }
                if((k%len) != 0){
                    if($("div").slice(k,k+1).attr("data-grouping")==$("div").slice(k-1,k).attr("data-grouping")){
                        $("div").slice(k,k+1).css("border-left",".5px solid transparent");
                    }
                }
            }
            $("div").off("hover").hover(function(){
                $("div[data-grouping='"+$(this).attr("data-grouping")+"']").each(function(){$(this).toggleClass("cohover")});
            });
            $("*").removeClass("cohover");
        }
    });
});
//from https://gist.github.com/mlocati/7210513
function perc2color(perc) {
    var r, g, b = 0;
    if(perc < 50) {
        r = 255;
        g = Math.round(5.1 * perc);
    }
    else {
        g = 255;
        r = Math.round(510 - 5.10 * perc);
    }
    var h = r * 0x10000 + g * 0x100 + b * 0x1;
    return '#' + ('000000' + h.toString(16)).slice(-6);
}
function blueGradient(min,max,val){
    var b = (1-((val-min)/(max-min)))*256;
    return "rgba(0,0,"+b+","+(1-((val-min)/(max-min)))+")";
}
function btPress(id){
    if(id=="m"){
        var m = minmax(".metra[0]");
    }else if(id=="c"){
        var m = minmax(".central");
    }else if(id=="d"){
        var m = minmax(".dining[0]");
    }else if(id=="r"){
        var m = minmax(".library");
    }else if(id=="s"){
        location.reload();
    }
    for(var i=0; i<OPARR.length; i++){
        for(var j=0; j<OPARR[0].length; j++){
            var curr = $("div").slice(i*OPARR[0].length+j,i*OPARR[0].length+j+1);
            if(id=="m"){
                curr.css("background-color",blueGradient(m[0],m[1],OPARR[i][j].metra[0]));
            }else if(id=="c"){
                curr.css("background-color",blueGradient(m[0],m[1],OPARR[i][j].central));
            }else if(id=="d"){
                curr.css("background-color",blueGradient(m[0],m[1],OPARR[i][j].dining[0]));
            }else if(id=="r"){
                curr.css("background-color",blueGradient(m[0],m[1],OPARR[i][j].library));
            }
        }
    }
}
function highlight(object, array, name){
    var min = new Place(40,-80).to(object);
    var coords = [];
    for (var i=0, j=0; i<array.length && j<array[0].length; j++, i=(j==array[0].length)?i+1:i,j=(j==array[0].length)?j=0:j) {
        if(array[i][j].to(object) < min){
            min = array[i][j].to(object);
            coords = [i,j];
        }
    }
    $("div:nth-child("+(coords[0]*array[0].length+coords[1]+1)+")").css("border-color","black");
    $("div:nth-child("+(coords[0]*array[0].length+coords[1]+1)+") span hr").before("<br/><i class='res'>"+name+"</i>");
}
function categorize(score,min,max,segs){
    return Math.floor(((score-min)/(max-min)*(segs-1)));
}