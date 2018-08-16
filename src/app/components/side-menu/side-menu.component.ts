import { Component } from '@angular/core';

import { RectDataService } from '../../services/Rect-data/rect-data.service';

@Component({
    selector: 'side-menu',
    templateUrl: './side-menu.component.html',
    styleUrls: ['./side-menu.component.css']
})

export class SideMenuComponent {
    constructor(private rectDataService: RectDataService) {
    }
    addRect() {
        this.rectDataService.addRect();
    }
    reset(){
        this.rectDataService.reset();
    }
    save(){
        this.rectDataService.save();
    }
    downloadAPK(){
        window.location.href="../../assets/FloorPlanner.apk";
    }

}