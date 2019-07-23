import {Component, Input, ViewChild, ElementRef, OnInit} from '@angular/core';
import {ChatService} from '../shared/services/chat.service';

@Component({
    selector: 'chess-diagram',
    template: `<canvas  #chessCanvas></canvas>`,
    styles: ['canvas { border: 1px solid #000; }']
})
export class ChessDiagram {
    @Input() width: number;
    @Input() height: number;
   private context: CanvasRenderingContext2D;  
   private datapoints : Buffer;
   private id : NodeJS.Timer;
   private message = {
		author : 'from canvas author',
		message: 'SendChunk'
	};

    // get the element with the #chessCanvas on it
    @ViewChild("chessCanvas") chessCanvas: ElementRef; 

    constructor(private chatService: ChatService){
    }

    ngAfterViewInit() { // wait for the view to init before using the element

        const canvas: HTMLCanvasElement = this.chessCanvas.nativeElement;
        this.context = canvas.getContext("2d");
        
        var clientHeight=canvas.parentNode.parentElement.clientHeight;
        var clientWidth=canvas.parentNode.parentElement.clientWidth;

        console.log("clientWidth%5: ", clientWidth%5);
        if (clientWidth%5 > 0)
            clientWidth = Math.floor(clientWidth/5) * 5;

        if (clientHeight%5 > 0)
            clientHeight = Math.floor(clientHeight/5) * 5;

        //no longer adjust to parent, but use Width attribute on component
        canvas.width = this.width;//clientWidth;
        canvas.height = clientHeight;
    
                    
        // happy drawing from here on
        //  this.context.fillStyle = 'blue';
        //  this.context.fillRect(10, 10, 150, 150);
        console.log(canvas.parentNode.parentNode);
        console.log("canvas constructor: width: ", canvas.width, ", height: ", canvas.height, ' this.canvas: ', canvas);
    
        var start = 0;
        var elapse = 8;
        var ratio = 1;
        var numVertCells = (elapse * ratio) * 5;
        var baseWidth =  canvas.width + (canvas.width % numVertCells)
        var vertCellWidth = Math.round(baseWidth / numVertCells);
        //var baseHeight = self.canvas.height;
        var sessionCanvasHeight = canvas.height;// - self._heartbeatsAreaHeight;
        var baseHeight = sessionCanvasHeight + (sessionCanvasHeight % Math.round(sessionCanvasHeight / vertCellWidth));
        var numHorCells = Math.round(baseHeight / vertCellWidth);
        var numSubVertCells = numVertCells * 5;
        var vertSubCellWidth = baseWidth / numSubVertCells;
        var vertSubCellWidth = baseWidth / numSubVertCells;
        var startAt = 0;
        this.context.save();
        for (var i = 0; i < numVertCells; i++) {

            this.context.beginPath();
            this.context.lineWidth = 1;
            this.context.strokeStyle = '#333';
            var to = startAt + i * vertCellWidth;
            this.context.moveTo(to, 0);
            this.context.lineTo(to, baseHeight);
            this.context.stroke();
            // sublines
            {
                this.context.save();
                for (var s = 0; s < 5; s++) {
                        var sTo = to + (s * Math.round(vertCellWidth / 5));
                    this.context.beginPath();
                    this.context.lineWidth = 0.25;
                    this.context.strokeStyle = '#333'; // '#666';
    //                              var to = startAt + i * vertSubCellWidth;
                    this.context.moveTo(sTo, 0);
                    this.context.lineTo(sTo, baseHeight);
                    this.context.stroke();
                }
                this.context.restore();
            }
            
        }
        this.context.restore();
        //********end of vertical line drawing */

        var mid = baseHeight / 2;

                    // Upper half
        this.context.save();
        for (var i = mid; i > 0; i -= vertCellWidth) {
            var to = i - vertCellWidth;
            this.context.beginPath();
            this.context.lineWidth = 0.5;
            this.context.strokeStyle = '#333';
            this.context.moveTo(0, to);
            this.context.lineTo(baseWidth, to);
            this.context.stroke();
            // sublines
            {
                this.context.save();
                for (var s = 0; s < 5; s++) {
                    var sTo = to + (s * Math.round(vertCellWidth / 5));
                    this.context.beginPath();
                    this.context.lineWidth = 0.25;
                    this.context.strokeStyle = '#666';
                    this.context.moveTo(0, sTo);
                    this.context.lineTo(baseWidth, sTo);
                    this.context.stroke();
                }
                this.context.restore();
            }
        }
        this.context.restore();

        // Lower half
        this.context.save();
        for (var i = mid; i < baseHeight - vertCellWidth; i += vertCellWidth) {
            var to = i + vertCellWidth;
            this.context.beginPath();
            this.context.lineWidth = 0.5;
            this.context.strokeStyle = '#333';
            this.context.moveTo(0, to);
            this.context.lineTo(baseWidth, to);
            this.context.stroke();
            // sublines
            {
                this.context.save();
                for (var s = 0; s < 5; s++) {
                    var sTo = to - (s * Math.round(vertCellWidth / 5));
                    this.context.beginPath();
                    this.context.lineWidth = 0.25;
                    this.context.strokeStyle = '#666';
                    this.context.moveTo(0, sTo);
                    this.context.lineTo(baseWidth, sTo);
                    this.context.stroke();
                }
                this.context.restore();
            }
        }
        this.context.restore();


        // Draw mid and bottom horizontal lines
        {
            this.context.save();
            this.context.beginPath();
            this.context.lineWidth = 1;
            this.context.strokeStyle = '#000';
            this.context.moveTo(0, baseHeight / 2);
            this.context.lineTo(baseWidth, baseHeight / 2);
            this.context.stroke();

            this.context.beginPath();
            this.context.lineWidth = 1;
            this.context.strokeStyle = '#000000';
            this.context.moveTo(0, baseHeight);
            this.context.lineTo(baseWidth, baseHeight);
            this.context.stroke();
            this.context.restore();
        }


            //draw signal
         /*   this.context.save();
            var yv = baseHeight /2;
            var dirUp = true;
           for (var xv = 0; xv < baseWidth; xv++) {
            this.context.beginPath();
            this.context.lineWidth = 1;
            this.context.strokeStyle = '#000000';
            this.context.moveTo(xv, yv);
            if (dirUp)
                yv-=10;
            else    
                yv+=10;
            if (yv<=0) yv = 0;
            this.context.lineTo(xv+1, yv);
            this.context.stroke();
            if (dirUp && yv==0) {
                dirUp=false;
            }
            if (!dirUp && (yv >= baseHeight /2)) {
                dirUp=true;
                yv = baseHeight /2;
            }
           }
            this.context.restore();
        */    
       
        console.log("GetInstance chunkrequest starting");
        this.chatService.GetInstanceStatus().subscribe((result) => {
            console.log("returned chunkrequest result : ", result);
            console.log("returned chunkrequest result.data : ", result.data);
            var dv = new DataView(result.data);
            console.log("returned chunkrequest dataview : ", dv);
			this.datapoints= result.data;
            var pData = new Uint8Array(result.data);
            console.log("returned chunkrequest Array length : ", pData.byteLength); 
            console.log("returned chunkrequest Array[0] : ", (pData[0]*256) + pData[1],  (pData[2]*256) + pData[3],  (pData[4]*256) + pData[5]);

            var length = dv.buffer.byteLength;
                length= pData.byteLength;

            var mheartRate = dv.getUint16(0);
            var mheartRateDatapointIndex = dv.getUint16(2);
//            var pointsCount = dv.getUint16(4);
            console.log("returned chunkrequest dataview length : ", length, "count:", dv.getUint16(0)," dp1:",dv.getUint16(2)," dp2:",dv.getUint16(4));


            this.context.save();
            var yv = baseHeight /2;
            var xv=0;
            var hbyte=0;

            //1st=startbh, 2nd=hb, 3rd=endhb
            //TODO add pull of heartbeats from server
            var hblbl=[];
            hblbl.push(0);
            hblbl.push(676);
            hblbl.push(1045);

            hblbl.push(1048);
            hblbl.push(1420);
            hblbl.push(1789);

            hblbl.push(1792);
            hblbl.push(2164);
            hblbl.push(2532);

            hblbl.push(2534);
            hblbl.push(2904);
            hblbl.push(3273);

            hblbl.push(3278);
            hblbl.push(3652);
            hblbl.push(3989);
            

            for (var lblPos = 0; lblPos < hblbl.length; lblPos+=3) {

            this.context.font = '10px Arial';
            this.context.fillStyle = '#000';
            var shbWidth = this.context.measureText("[");
            console.log("shbWidth : ", shbWidth.width);
            this.context.fillText("[", (hblbl[lblPos]/8.0), 8);

            this.context.font = '10px Arial';
            this.context.fillStyle = '#000';
            var hbWidth = this.context.measureText("60");
            this.context.fillText("60", (hblbl[lblPos+1]/8.0)-(hbWidth.width/2), 8);

            this.context.font = '10px Arial';
            this.context.fillStyle = '#F00';
            this.context.fillText("]", (hblbl[lblPos+2]/8), 8);
            }

            //seek past point and heart rate
            for (var databufPos = 2; databufPos < length; databufPos+=2) {

                this.context.beginPath();
                this.context.lineWidth = 1;
                this.context.strokeStyle = '#000000';
                this.context.moveTo(xv, yv);
                console.log("moveto: yv : ", yv, "xv:", xv);
                //yv=dv.getUint16(databufPos);
                if (pData[databufPos]==255)
                    yv= (256-pData[databufPos+1]) * -1;
                else
                    yv= (pData[databufPos]*256) + pData[databufPos+1];
                /*
                if (yv===0) {
                    databufPos-=2;
                    yv=(pData[databufPos+1]*256) + pData[databufPos];
                }*/
                console.log("databufPos:", databufPos," yv : ", yv, "xv:", xv);
                xv+=1;

                //new_value = ( (old_value - old_min) / (old_max - old_min) ) * (new_max - new_min) + new_min
                yv  = Math.floor(( ( yv - (-212) ) / (871 - (-212)) ) * ((baseHeight /2)-8.0) + (0.0))
               // if (yv<0) yv=0;
               // if (yv>baseHeight /2) yv = baseHeight /2;
                yv = (baseHeight /2)-yv;
                console.log("lineto yv : ", yv, "xv:", xv);
                this.context.lineTo(xv, yv);
                this.context.stroke();
            }
            this.context.lineTo(xv, 0);
            this.context.stroke();
       this.context.restore();
		});
        this.id = setInterval(() => {
            this.send(); 
        }, 100);

    }

    public send() {
        console.log("sending to chunkrequest service : ", this.message);
        if (this.chatService.isOpened) clearInterval(this.id);
        
		this.chatService.sendMessage(this.message);
    }

}