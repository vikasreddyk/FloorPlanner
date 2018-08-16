import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { WindowRefService } from '../../services/window-ref/window-ref.service';
import * as interact from 'interactjs';
import { element } from 'protractor';
import { RectDataService } from '../../services/Rect-data/rect-data.service';

@Component({
    selector: 'floor-editor',
    templateUrl: './floor-editor.component.html',
    styleUrls: ['./floor-editor.component.css']
})

export class FloorEditorComponent implements AfterViewInit {
    title = 'FloorPlanner';
    rectData:RectData;
    floorPlanBg:String;
    @ViewChild('parent') parentEle: ElementRef;
    constructor(private winRef: WindowRefService, private rectDataservice: RectDataService) {
        this.floorPlanBg="url('../../assets/img/floor-plan.jpg')";
        this.rectData=rectDataservice.data;
        winRef.nativeWindow.dragMoveListener = this.dragMoveListener;
        interact('.resize-drag')
            .draggable({
                // enable inertial throwing
                inertia: true,
                // keep the element within the area of it's parent
                restrict: {
                    restriction: "parent",
                    endOnly: true,
                    elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
                },
                // enable autoScroll
                autoScroll: true,

                // call this function on every dragmove event
                onmove: this.dragMoveListener,
                // call this function on every dragend event
                onend: (event) => {
                    var textEl = event.target.querySelector('p');

                    textEl && (textEl.textContent =
                        'moved a distance of '
                        + (Math.sqrt(Math.pow(event.pageX - event.x0, 2) +
                            Math.pow(event.pageY - event.y0, 2) | 0))
                            .toFixed(2) + 'px');
                    var target = event.target,
                        x = (parseFloat(target.getAttribute('data-x')) || 0),
                        y = (parseFloat(target.getAttribute('data-y')) || 0);
                    var rectData = {
                        x: x,
                        y: y,
                        width: target.style.width,
                        height: target.style.height
                    }
                    this.setLocalRect(event.target.id, rectData);
                }
            })
            .resizable({
                // resize from all edges and corners
                edges: { left: true, right: true, bottom: true, top: true },
                restrict: {
                    restriction: "parent",
                    endOnly: true
                    // elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
                },
                onmove: this.resizeListener,
                onend: (event) => {
                    var target = event.target,
                        x = (parseFloat(target.getAttribute('data-x')) || 0),
                        y = (parseFloat(target.getAttribute('data-y')) || 0);
                    var rectData = {
                        x: x,
                        y: y,
                        width: target.style.width,
                        height: target.style.height
                    }
                    this.setLocalRect(event.target.id, rectData);
                },
                inertia: true
            });
        this.rectDataservice.rectEvent.on('add',()=>{
            this.addRect();
        })
        this.rectDataservice.rectEvent.on('save',()=>{
            this.saveRects();
        });
        this.rectDataservice.rectEvent.on('reset',()=>{
            this.resetRects();
        });
        this.loadLocalRects();
    }
    ngAfterViewInit() {
        if (this.rectData.rects.length) {
            this.loadLocalRectPositions();
        }
    }
    resizeListener = (event) => {
        var target = event.target,
            x = (parseFloat(target.getAttribute('data-x')) || 0),
            y = (parseFloat(target.getAttribute('data-y')) || 0);

        // update the element's style
        target.style.width = event.rect.width + 'px';
        target.style.height = event.rect.height + 'px';

        // translate when resizing from top or left edges
        x += event.deltaRect.left;
        y += event.deltaRect.top;

        target.style.webkitTransform = target.style.transform =
            'translate(' + x + 'px,' + y + 'px)';

        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
        // target.textContent = Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height);

    }
    dragMoveListener = (event) => {
        var target = event.target,
            // keep the dragged position in the data-x/data-y attributes
            x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
            y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

        // translate the element
        target.style.webkitTransform =
            target.style.transform =
            'translate(' + x + 'px, ' + y + 'px)';
        // update the posiion attributes
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
    }
    setLocalRect(id, data) {
        for (var i = 0; i < this.rectData.rects.length; i++) {
            var rect = this.rectData.rects[i];
            if (rect.id == id) {
                if (data.x != null && data.x != "" && data.x != undefined) {
                    rect.datax = data.x;
                }
                if (data.y != null && data.y != "" && data.y != undefined) {
                    rect.datay = data.y;
                }
                if (data.width != null && data.width != "" && data.width != undefined) {
                    rect.width = data.width;
                }
                if (data.height != null && data.height != "" && data.height != undefined) {
                    rect.height = data.height;
                }
                this.rectData.rects[i] = rect;
                break;
            }
        }
    }
    loadLocalRects() {
        var localRects = JSON.parse(localStorage.getItem("rects"));
        if (localRects != undefined) {
            this.rectData.rects = localRects;
            this.rectData.count = Number.parseInt(localStorage.getItem("idCount"));
        }
    }
    loadLocalRectPositions() {
        // setTimeout(()=>{
        for (var i = 0; i < this.rectData.rects.length; i++) {
            var pos = i;
            this.parentEle.nativeElement.children[pos].id = this.rectData.rects[pos].id;
            var child = this.parentEle.nativeElement.children[pos];
            var rect = this.rectData.rects[pos];
            var datax = 0;
            var datay = 0;
            if (rect.datax != null && rect.datax != "" && rect.datax != undefined) {
                datax = rect.datax;
            }
            if (rect.datay != null && rect.datay != "" && rect.datay != undefined) {
                datay = rect.datay;
            }
            if (rect.width != null && rect.width != "" && rect.width != undefined) {
                this.parentEle.nativeElement.children[pos].style.width = rect.width;
            }
            if (rect.height != null && rect.height != "", rect.height != undefined) {
                this.parentEle.nativeElement.children[pos].style.height = rect.height;
            }
            this.parentEle.nativeElement.children[pos].style.webkitTransform = this.parentEle.nativeElement.children[pos].style.transform =
                'translate(' + datax + 'px,' + datay + 'px)';
            this.parentEle.nativeElement.children[pos].setAttribute('data-x', datax);
            this.parentEle.nativeElement.children[pos].setAttribute('data-y', datay);
        }
    }
    addRect() {
        console.log(this.parentEle);
        var rect = {
            "id": this.rectData.count,
            "datax": null,
            "datay": null,
            "width": null,
            "height": null
        }
        this.rectData.rects.push(rect);
        setTimeout(() => {
            this.parentEle.nativeElement.children[this.parentEle.nativeElement.childElementCount - 1].id = this.rectData.count.toString();
            this.rectData.count++;
        }, 100);
    }
    deleteRect(rectId){
        for(var i=0;i<this.rectData.rects.length;i++)
        {
            if(this.rectData.rects[i].id==rectId)
            {
                this.rectData.rects.splice(i,1);
            }
        }
    }
    saveRects(){
        localStorage.setItem("idCount", this.rectData.count.toString());
        localStorage.setItem("rects", JSON.stringify(this.rectData.rects));
    }
    resetRects(){
        this.rectData.rects=[];
        this.loadLocalRects();
        setTimeout(()=>{
            this.loadLocalRectPositions();
        },10);
    }
}

interface RectData{
    count:any,
    rects:Array<any>
}