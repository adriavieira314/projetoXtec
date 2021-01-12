import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { InterfaceCalc } from './interfaceCalc'

@Injectable({ providedIn: 'root' })
export class InterfaceService {

  constructor(private http: HttpClient) { }

<<<<<<< HEAD:src/app/pages/interface-calculadora/interface.service.ts
    getCepApi(cep: string) {
        return this.http.get<InterfaceCalc>("https://viacep.com.br/ws/" + cep + "/json/?callback");
    }
}
=======
  getCepApi(cep: string) {
    return this.http.get<any>("https://viacep.com.br/ws/" + cep + "/json/?callback");
  }
}
>>>>>>> e12464d9472c2e17eb30d1011a8fb2ec31153b4c:app/src/app/pages/interface-calculadora/interface.service.ts
