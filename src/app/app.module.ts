import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { ApplicationService } from './services/application.service';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { Md2Module } from 'md2';

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		ReactiveFormsModule,
		HttpModule,
		MultiselectDropdownModule,
		Md2Module.forRoot()
	],
	providers: [ApplicationService],
	bootstrap: [AppComponent]
})

export class AppModule { }