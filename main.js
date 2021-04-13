var drawThings = function(canvas){
    var width = canvas.width;
    var height = canvas.height;
    var ctx = canvas.getContext("2d");
    
    var points = [];
    var edges = [];
    var rectEdges = [];
    var min = -20;
    var max = 20;
    
    this.generateRandomPoints = function(n){
        points = [];
        edges = [];
        rectEdges = [];
        var cnt = 0;
        var pointsX = {};//sparse array
        while(true){
            if(cnt >= n)break;
            var x = Math.floor(Math.random()*41)-20;//41 integers including 0
            var y = Math.floor(Math.random()*41)-20;
            if(!(x in pointsX))pointsX[x] = {};
            if(y in pointsX[x])continue;
            pointsX[x][y] = 1;//any value
            cnt++;
        }
        console.log(pointsX);
        for(x in pointsX){
            for(y in pointsX[x]){
                x = parseInt(x);
                y = parseInt(y);
                points.push([x,y]);
            }
        }
        console.log(points.length);
    };
    
    this.findRects = function(){
        var mat = {};
        for(var i = 0; i < points.length; i++){
            var p = points[i];
            var x = p[0];
            var y = p[1];
            if(!(x in mat))mat[x] = {};
            mat[x][y] = i;//pointer to the array
        }
        
        var x1s = {};
        for(var x1 in mat){
            x1s[x1] = 1;
            var col1 = mat[x1];
            var y1s = {};
            for(var y1 in col1){
                y1s[y1] = 1;
                for(var y2 in col1){
                    if(y2 in y1s)continue;
                    //now we have (x1,y1), (x1,y2)
                    //now search for (x2,y1), (x2,y2)
                    for(var x2 in mat){
                        if(x2 in x1s)continue;
                        var col2 = mat[x2];
                        if((y1 in col2) && (y2 in col2)){
                            //console.log(x1,y1,x2,y2);
                            edges.push([mat[x1][y1], mat[x2][y1]]);
                            edges.push([mat[x2][y1], mat[x2][y2]]);
                            edges.push([mat[x2][y2], mat[x1][y2]]);
                            edges.push([mat[x1][y2], mat[x1][y1]]);
                        }
                    }
                }
            }
        }
        console.log(edges);
        /*
        for(var x1 = 0; x1 < mat.length; x1++){
            if(!(x1 in mat))continue;
            var col1 = mat[x1];
            for(var y1 = 0; y1 < col1.length; y1++){
                if(!(y1 in col1))continue;
                for(var y2 = y1; y2 < col1.length; y2++){
                    if(!(y2 in col1))continue;
                    if(y2 === y1)continue;
                    //now we have (x1,y1), (x1,y2)
                    //now search for (x2,y1), (x2,y2)
                    for(var x2 = x1; x2 < mat.length; x2++){
                        if(!(x2 in mat))continue;
                        if(x2 === x1)continue;
                        var col2 = mat[x2];
                        if(y1 in col2 && y2 in col2){
                            
                        }
                    }
                }
            }
        }
        */
    };
    
    
    this.plot = function(minx,miny,maxx,maxy){
        ctx.clearRect(0,0,width,height);
        ctx.fillStyle = "#fff";
        ctx.fillRect(0,0,width,height);
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
        
        
        
        
        
        //now for the main part, plotting the points and edges
        for(var i = 0; i < points.length; i++){
            ctx.beginPath();
            var x = axisWidth+points[i][0]*gridWidth;
            var y = axisHeight-points[i][1]*gridHeight;
            ctx.arc(x,y,3,0,6.28);
            ctx.closePath();
            ctx.fillStyle = "#000";
            ctx.fill();
        }
        
        
        //and the edges
        for(var i = 0; i < edges.length; i++){
            var e = edges[i];
            console.log(e);
            var [x1,y1] = points[e[0]];
            var [x2,y2] = points[e[1]];
            ctx.beginPath();
            ctx.moveTo(axisWidth+x1*gridWidth,axisHeight-y1*gridHeight);
            ctx.lineTo(axisWidth+x2*gridWidth,axisHeight-y2*gridHeight);
            ctx.strokeStyle = "#0f0";
            ctx.stroke();
        }
    }
};



var canvas = document.getElementById("canvas");
console.log(canvas);
canvas.width = 500;
canvas.height = 500;


var dt = new drawThings(canvas);
dt.generateRandomPoints(100);
dt.findRects();
dt.plot(-20.5,-20.5,20.5,20.5);