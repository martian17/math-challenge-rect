var drawThings = function(canvas){
    var width = canvas.width;
    var height = canvas.height;
    var ctx = canvas.getContext("2d");
    
    var points = [];
    
    this.generateRandomPoints = function(n){
        points = [];
        var cnt = 0;
        var pointsX = {};//sparse array
        while(true){
            if(cnt >= n)break;
            var x = Math.floor(Math.random()*41)-20;//41 integers including 0
            var y = Math.floor(Math.random()*41)-20;
            if(!(x in pointsX))pointsX[x] = {};
            if(!(y in pointsX[x]))continue;
            pointsX[x][y] = 1;//any value
            cnt++;
        }
        for(x in pointsX){
            for(y in pointsX[x]){
                x = parseInt(x);
                y = parseInt(y);
                points.push(x,y);
            }
        }
    };
    
    this.plot = function(minx,miny,maxx,maxy){
        ctx.clearRect(0,0,width,height);
        var xscale = maxx - minx;
        var yscale = maxy - miny;
        var axisHeight = (maxy/yscale)*height;
        var axisWidth = (-minx/xscale)*width;
        
        var gridWidth = width/xscale;
        var gridHeight = height/yscale;
        
        ctx.strokeStyle = "#aaa";
        
        //drawing the grid
        for(var i = Math.floor(minx); i <= Math.ceil(maxx); i++){
            if(Math.abs(i)%10 === 0){
                ctx.strokeStyle = "#555";
            }else if(Math.abs(i)%5 === 0){
                ctx.strokeStyle = "#999";
            }else{
                ctx.strokeStyle = "#bbb";
            }
            var gx = gridWidth*i+axisWidth;
            ctx.beginPath();
            ctx.moveTo(gx,0);
            ctx.lineTo(gx,height);
            ctx.stroke();
        }
        for(var i = Math.floor(miny); i <= Math.ceil(maxy); i++){
            if(Math.abs(i)%10 === 0){
                ctx.strokeStyle = "#555";
            }else if(Math.abs(i)%5 === 0){
                ctx.strokeStyle = "#999";
            }else{
                ctx.strokeStyle = "#bbb";
            }
            var gy = -gridHeight*i+axisHeight;//negative because ocmputer coordinates are inverted
            ctx.beginPath();
            ctx.moveTo(0,gy);
            ctx.lineTo(width,gy);
            ctx.stroke();
        }
        
        //drawing the axis
        ctx.strokeStyle = "#f00";
        ctx.beginPath();
        ctx.moveTo(axisWidth,0);//x axis
        ctx.lineTo(axisWidth,height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0,axisHeight);
        ctx.lineTo(width,axisHeight);
        ctx.stroke();
        
    }
};



var canvas = document.getElementById("canvas");
console.log(canvas);
canvas.width = 500;
canvas.height = 500;


var dt = new drawThings(canvas);

dt.plot(-20.5,-20.5,20.5,20.5);