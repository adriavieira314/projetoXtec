import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CEP } from './calculadora'

@Injectable({ providedIn: 'root' })
export class CalculadoraService {

    constructor(private http: HttpClient) { }
  
    getCepApi(cep: string) {
        return this.http.get<CEP>("https://viacep.com.br/ws/" + cep + "/json/?callback");
    }

    getJSON() {
      return this.http.get<any>("http://localhost:3000/dados");
    }
}
