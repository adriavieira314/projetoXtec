// feature module
import { HttpClientModule } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { TextMaskModule } from 'angular2-text-mask';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { ModalModule } from 'ngx-bootstrap/modal';


import { CalculadoraComponent } from "./calculadora/calculadora.component";
import { CardsComponent } from "./cardsProdutos/cards.component";
import { BotoesAlternativosComponent } from "./botoesAlternativos/botoesAlternativos.component";
import { ModalComponent } from './modal/modal.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        TextMaskModule,
        CurrencyMaskModule,
        ModalModule.forRoot()
    ],
    // devo declarar no declarations para o PagesModule enxergar o componente
    declarations: [
        CalculadoraComponent,
        CardsComponent,
        BotoesAlternativosComponent,
        ModalComponent
    ],
    // devo declarar no exports para quem for importar PagesModule enxergar o componente
    exports: [
        CalculadoraComponent,
        CardsComponent,
        BotoesAlternativosComponent,
        ModalComponent
    ],
})
export class PagesModule { }