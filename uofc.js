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
        var p = Math.pow(this.ancestral,.3333)*Math.pow(this.central,3)*Math.pow(this.dining[0],3)*Math.pow(this.library,2)*Math.pow(this.metra[0],1);
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

function minmax(strfx){
    var b = 0;
    var a = 10e30;
    for(var i=0; i<OPARR.length; i++){
        for(var j=0; j<OPARR[0].length; j++){
            if(eval("OPARR[i][j]"+strfx)<a){
                a=eval("OPARR[i][j]"+strfx);
            }
            if(eval("OPARR[i][j]"+strfx)>b){
                b=eval("OPARR[i][j]"+strfx);
            }
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
    for(var i=0; i<OPARR.length; i++){
        for(var j=0; j<OPARR[0].length; j++){
                $("body").append("<div style='background-color:"+redness(OPARR[i][j].score)+"' data-score='"+OPARR[i][j].score+"'>"
                    +"<span><b>Score: </b><em style='color:"+redness(OPARR[i][j].score)+"'>"+Math.floor(max*93175.39171766826-OPARR[i][j].score*93175.39171766826)+"</em><hr/>"
                    +"<b>Campus Center: </b>"+Math.floor(OPARR[i][j].central*93175.39171766826)+"m<br/>"
                    +"<b>Dining: </b>"+Math.floor(OPARR[i][j].dining[0]*93175.39171766826)+"m<br/><i>"+OPARR[i][j].dining[1]+"</i><br/>"
                    +"<b>Regenstein: </b>"+Math.floor(OPARR[i][j].library*93175.39171766826)+"m<br/>"
                    +"<b>Metra: </b>"+Math.floor(OPARR[i][j].metra[0]*93175.39171766826)+"m<br/><i>"+OPARR[i][j].metra[1]+"</i><br/>"
                    +"<strong>"+(Math.floor(OPARR[i][j].lat*100000)/100000)+"&deg;N, "+(Math.floor(-OPARR[i][j].long*100000)/100000)+"&deg;W</strong>"+
                    "</div>");

        }
    }
    $("body").append("<button id='m'>Metra</button><button id='c'>Campus Center</button><button id='d'>Dining</button><button id='r'>Regenstein</button><button id='s'>Score</button>");
    $("div").css({"width" : w,
                  "height": h});
    $("div").hover(function(){
        $(this).prev().toggleClass("prev");
        $(this).next().toggleClass("prev");
        $(this).nextAll().slice(OPARR[0].length-1,OPARR[0].length).toggleClass("prev");
        $(this).prevAll().slice(OPARR[0].length-1,OPARR[0].length).toggleClass("prev");
        $(this).nextAll().slice(OPARR[0].length-2,OPARR[0].length-1).toggleClass("prev2");
        $(this).prevAll().slice(OPARR[0].length-2,OPARR[0].length-1).toggleClass("prev2");
        $(this).nextAll().slice(OPARR[0].length,OPARR[0].length+1).toggleClass("prev2");
        $(this).prevAll().slice(OPARR[0].length,OPARR[0].length+1).toggleClass("prev2");
    });
    $("button").click(function(e){
        e.stopPropagation();
        btPress($(this).attr("id"));
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