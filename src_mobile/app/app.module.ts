import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import '../../node_modules/interactjs/dist/interact.min.js';
import {MatButtonModule} from '@angular/material/button';

import { AppComponent } from './app.component';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { FloorEditorComponent } from './components/floor-editor/floor-editor.component'

@NgModule({
  declarations: [
    AppComponent,
    SideMenuComponent,
    FloorEditorComponent
    
  ],
  imports: [
    BrowserModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
