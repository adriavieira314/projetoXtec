// cada novo componente devo declarar no app.module.ts
import { AfterViewInit, Component, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { InterfaceComponent } from '../interface-calculadora/interface.component';

@Component({
    selector: 'app-calculadora',
    templateUrl: './calculadora.component.html',
    styleUrls: ['./calculadora.component.css']
})
export class CalculadoraComponent implements AfterViewInit, OnChanges {
    
    @ViewChild(InterfaceComponent) child;
    
    teste: boolean;

    ngAfterViewInit(): void {
        this.teste = this.child.teste;
        console.log(this.teste);
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.teste = this.child.teste;
    }
}