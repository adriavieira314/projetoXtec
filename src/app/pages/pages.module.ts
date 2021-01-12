// feature module
import { HttpClientModule } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { CalculadoraComponent } from "./calculadora/calculadora.component";
import { InterfaceComponent } from "./interface-calculadora/interface.component";
import { CardsComponent } from "./cardsProdutos/cards.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
    ],
    // devo declarar no declarations para o PagesModule enxergar o componente
    declarations: [
        CalculadoraComponent,
        InterfaceComponent,
        CardsComponent
    ],
    // devo declarar no exports para quem for importar PagesModule enxergar o componente
    exports: [
        CalculadoraComponent,
        InterfaceComponent,
        CardsComponent
    ],
})
export class PagesModule { }