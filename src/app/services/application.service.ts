import { Injectable } from '@angular/core';
import { Person } from '../models/person';
import { Transaction } from '../models/transaction';
import { Representation } from '../../app/app.component';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { FormGroup } from '@angular/forms';

@Injectable()
export class ApplicationService {

    private personsUrl = "../../../src/api/persons.json";
    private transactionsUrl = "../../../src/api/transactions.json";
    private representationsUrl = "../../../src/api/representations.json";

    constructor(private http: Http) { }

    getPersons(): Observable<Person[]> {
        return this.http.get(this.personsUrl)
            .map((response: Response) => {
                return response.json()
            });
    }

    getTransactions(): Observable<Transaction[]> {
        return this.http.get(this.transactionsUrl)
            .map((response: Response) => {
                return response.json()
            });
    }

    postRepresentations(form: FormGroup): Observable<Response> {
        let header = new Headers({ 'Content-Type': 'applications/json' });
        let options = new RequestOptions({ headers: header });
        return this.http.post(this.representationsUrl, JSON.stringify(form.value.representations), options)
            .map(this.extractData);
    }

    private extractData(response: Response) {
        let body = response.json();
        return body.value || body;
    }
}