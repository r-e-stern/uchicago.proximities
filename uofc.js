var UPLEFT = new Place(41.79492, -87.60619);
var BOTRIGHT = new Place(41.78329, -87.58944);
var ANCESTRAL = new Place(41.80097, -87.58549);
var METRA = [[new Place(41.80089, -87.58715),"51st/53rd St. (Hyde Park)"],
             [new Place(41.79287, -87.58773),"55th - 56th - 57th St."],
             [new Place(41.78734, -87.58886),"Univ. of Chicago/59th St"],
             [new Place(41.77919, -87.59087),"63rd St."]];
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
        var c = [[this.to(METRA[0][0]),METRA[0][1]],
            [this.to(METRA[1][0]),METRA[1][1]],
            [this.to(METRA[2][0]),METRA[2][1]],
            [this.to(METRA[3][0]),METRA[3][1]]];
        c.sort(function(a,b){return a[0]-b[0]});
        return c[0];
    };
    this.dining = this.d();
    this.metra = this.m();
    this.s = function(){
        //var p = Math.pow(this.ancestral,.3333)*Math.pow(this.central,3)*Math.pow(this.dining[0],3)*Math.pow(this.library,2)*Math.pow(this.metra[0],1);
        //return Math.pow(p,1/9.3333);
        //var p = this.ancestral*.3333333+this.central*3+this.dining[0]*3+this.library*2+this.metra[0];
        //return p/9.3333;
        var OFFSET = 0.00107324475;
        var p = Math.pow(this.ancestral+OFFSET,.3333)*Math.pow(this.central+OFFSET,3)*Math.pow(this.dining[0]+OFFSET,3)*Math.pow(this.library+OFFSET,2)*Math.pow(this.metra[0]+OFFSET,1);
        return Math.pow(p,1/9.3333);
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
            +"<b>Metra: </b>"+Math.floor(curr.metra[0]*COORDTOMET)+"m<br/><i>"+curr.metra[1]+"</i><br/>"
            +"<strong>"+(Math.floor(curr.lat*100000)/100000)+"&deg;N, "+(Math.floor(-curr.long*100000)/100000)+"&deg;W</strong>"+
            "</div>");
    }
    $("body").append("<nav><button id='m'>Metra</button><button id='c'>Campus Center</button><button id='d'>Dining</button><button id='r'>Regenstein</button><button id='s'>Score</button></nav>");
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
            var hei = OPARR.length;
            var len = OPARR[0].length;
            for (var i=0, j=0; i<hei && j<len; j++, i=(j==len)?i+1:i,j=(j==len)?j=0:j) {
                var k = i*len + j;
                $("div").slice(k,k+1).attr("data-grouping",categorize(OPARR[i][j].score,min,max,20).toString());
            }
            for (var i=0, j=0; i<hei && j<len; j++, i=(j==len)?i+1:i,j=(j==len)?j=0:j) {
                var k = i*len + j;
                if((k-len) >= 0){
                    if($("div").slice(k,k+1).attr("data-grouping")==$("div").slice(k-len,k-len+1).attr("data-grouping")){
                        $("div").slice(k,k+1).css("border-top","none");
                    }
                }
                if((k+len) < hei*len){
                    if($("div").slice(k,k+1).attr("data-grouping")==$("div").slice(k+len,k+len+1).attr("data-grouping")){
                        $("div").slice(k,k+1).css("border-bottom","none");
                    }
                }
                if(((k+1)%len) != 0){
                    if($("div").slice(k,k+1).attr("data-grouping")==$("div").slice(k+1,k+2).attr("data-grouping")){
                        $("div").slice(k,k+1).css("border-right","none");
                    }
                }
                if((k%len) != 0){
                    if($("div").slice(k,k+1).attr("data-grouping")==$("div").slice(k-1,k).attr("data-grouping")){
                        $("div").slice(k,k+1).css("border-left","none");
                    }
                }
            }
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