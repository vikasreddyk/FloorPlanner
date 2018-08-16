import { Injectable, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { EventEmitter } from 'events';
import { Output } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class RectDataService {
    data:RectData={
        count:0,
        rects:[]
    };
    @Output() rectEvent: EventEmitter = new EventEmitter();
    constructor(){
    }
    addRect() {
        this.rectEvent.emit("add");
    }
    reset(){
        this.rectEvent.emit("reset");
    }
    save(){
        this.rectEvent.emit("save");
    }
}

interface RectData{
    count:any,
    rects:Array<any>
}