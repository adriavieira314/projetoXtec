import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { InterfaceCalc } from './interfaceCalc'

@Injectable({ providedIn: 'root' })
export class InterfaceService {

  constructor(private http: HttpClient) { }

  getCepApi(cep: string) {
    return this.http.get<any>("https://viacep.com.br/ws/" + cep + "/json/?callback");
  }
}
