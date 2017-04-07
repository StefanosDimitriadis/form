import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { Http } from '@angular/http';

import { Person } from './models/person';
//import { Transaction } from './models/transaction';
import { ApplicationService } from './services/application.service';
import { IMultiSelectOption } from 'angular-2-dropdown-multiselect';
import { IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { IMultiSelectSettings } from 'angular-2-dropdown-multiselect';
import { Md2Toast } from 'md2/toast/toast';

@Component({
	moduleId: module.id,
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, IMultiSelectTexts, IMultiSelectSettings {

	private transactions: Transaction[] = [];
	private persons: Person[] = [];

	private optionsModel: Person[];
	private mySettings: IMultiSelectSettings;
	private myTexts: IMultiSelectTexts;
	private myOptions: IMultiSelectOption[] = [];
	private flag: boolean = false;

	private placeholder: any;

	private form: FormGroup;
	private representationsFormArray: FormArray = new FormArray([]);

	private newRepresentation: Representation = new Representation;

	private representations: Representation[] = [];

	private counterForId: number = 0;

	constructor(
		private applicationService: ApplicationService,
		private formBuilder: FormBuilder,
		private toast: Md2Toast
	) { }

	ngOnInit() {
		this.onFetchData();
		this.optionsModelInit();
		this.form = this.formBuilder.group({
			transactions: ['', Validators.required],
			representatives: [this.persons, Validators.required],
			representations: this.formBuilder.array([
				this.buildFormArray()
			])
		});
	}

	onFetchData() {
		Observable.forkJoin(
			this.applicationService.getPersons(),
			this.applicationService.getTransactions()
		).subscribe(
			value => {
				this.persons = value[0];
				this.transactions = value[1];
				this.persons.forEach(element => {
					if (!this.flag) {
						this.myOptions.push(element);
					}
				});
				this.flag = true;
			}
			);
	}

	optionsModelInit() {
		this.mySettings = {
			pullRight: false,
			enableSearch: false,
			checkedStyle: 'glyphicon',
			buttonClasses: 'btn btn-default',
			selectionLimit: 0,
			closeOnSelect: false,
			showCheckAll: true,
			showUncheckAll: true,
			dynamicTitleMaxItems: 2,
			maxHeight: '300px',
			displayAllSelectedText: false
		};

		this.myTexts = {
			checkAll: 'Επιλογή όλων',
			uncheckAll: 'Αφαίρεση όλων',
			checked: 'Επιλεγμένος',
			checkedPlural: 'Επιλεγμένοι',
			searchPlaceholder: 'Αναζήτηση...',
			defaultTitle: 'Επιλέξτε εκπροσώπους'
		};
	}

	buildFormArray(): FormArray {
		var formGroup: FormGroup = new FormGroup({});

		var transaction: FormControl = new FormControl({});
	  formGroup.addControl('transaction', transaction);

		var representatives: FormControl = new FormControl({});
		formGroup.addControl('representatives', representatives);

		this.representationsFormArray.push(formGroup);

		return this.representationsFormArray;
	}

	addRepresentation() {
		let x = "";
		for (let i = 0; i < this.persons.length; i++) {
			for (let j = 0; j < this.form.value.representatives.length; j++) {
				if (this.persons[i].id == this.form.value.representatives[j]) {
					x = x + this.persons[i].name + ", ";
					break;
				}
			}
		}

		x = x.slice(0, x.length - 2);

		let representation: Representation = new Representation;
		representation.id = this.counterForId++;
		representation.name = this.newRepresentation.name;
		representation.representatives = x;

		if (this.representations.length > 0) {
			for (var i = 0; i < this.representations.length; i++) {
				var element = this.representations[i];
				if (element.name == representation.name) {
					this.toast.show('Η συναλλαγή είναι ήδη καταχωρημένη...', 3000);
					break;
				} else {
					this.representations.push(representation);
				}
			}
		} else {
			this.representations.push(representation);
		}
	}

	newTransaction() {
		let newTransaction: Transaction = new Transaction();
		newTransaction.id = this.transactions.length + 1;
		newTransaction.name = "Συναλλαγή " + newTransaction.id;
		this.transactions.push(newTransaction);
	}

	deleteRepresentation(id: number) {
		this.representations.filter(representation => representation.id == id);
	}
}

export class Representation {
	public id: number;
	public name: string;
	public representatives: string;
}

//to be removed...
export class Transaction {
    id: number;
    name: string;
}