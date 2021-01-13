import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: 'app-botoes-alternativos',
    templateUrl: './botoesAlternativos.component.html',
    styleUrls: ['./botoesAlternativos.component.css']
})
export class BotoesAlternativosComponent { 
    @Input() cepInformado: boolean;
    @Output() onClick: EventEmitter<any> = new EventEmitter();

    onClickTeste(valor:string) {
        this.onClick.emit(valor);
    }
}