import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CalculadoraService } from '../calculadora/calculadora.service';


@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent{
  produtos = [];
  @Input() selectedPainel: any;
  @Input() selectedEstrutura: any;
  @Input() potPico: number;
  @Input() pronto: boolean;
  @Output() arrayPronta: EventEmitter<any> = new EventEmitter();
  @Output() precoGerador: EventEmitter<any> = new EventEmitter();

  constructor(private calculadoraService: CalculadoraService) { }

  arrayProntaCards(valor: any) {
    this.arrayPronta.emit(valor);
  }

  precoGeradorCards(valor: any) {
    this.precoGerador.emit(valor);
  }

  pegaJSON() {
    this.produtos = [];
    var preco = [];
    var menosUm = this.potPico;
    var maisUm = this.potPico;
    menosUm--;
    maisUm++    

    this.calculadoraService.getJSON().subscribe(dados => {
      for (let i = 0; i < dados.produtos.produto.length; i++) {
        if (dados.produtos.produto[i].atributos) { //verificando se possui a tag atributo
          if (dados.produtos.produto[i].atributos[0].MARCA_PAINEL) { //verificando se possui a tag marca_painel dentro da tag atributo
            var string = dados.produtos.produto[i].atributos[0].MARCA_PAINEL[0]; //se sim, pegando a marca
            var painel = string.split(" ");//transformando a string em array
            
            if (painel.includes(this.selectedPainel)) { //verificando se o array possui tal painel
              //pegando o tipo de estrutura dos produtos com o painel selecionado
              var tipo = dados.produtos.produto[i].atributos[0].TIPO_ESTRUTURA[0];
              var estrutura = tipo.split(" ");
              
              if (estrutura.includes(this.selectedEstrutura)) {
                //potencia pico do produto ON GRID
                var potenciaW = dados.produtos.produto[i].atributos[0].POTENCIA_W;
                var stringToNumber = parseFloat(potenciaW);
                var potenciaWAsNumber = parseFloat(stringToNumber.toFixed(2));
                //potencia pico do produto OFF GRID
                var potenciaKVA = dados.produtos.produto[i].atributos[0].POTENCIA_KVA;
                var stringToNumber = parseFloat(potenciaKVA);
                var potenciaKVAasNumber = parseFloat(stringToNumber.toFixed(2));

                if (potenciaWAsNumber >= menosUm && potenciaWAsNumber <= maisUm || potenciaKVAasNumber >= menosUm && potenciaKVAasNumber <= maisUm) {
                  preco.push(dados.produtos.produto[i].precoeup[0]);
                
                  // verificando se valor tem mais de 12 caracteres e retirando-o do array
                  for (let i = 0; i < preco.length; i++) {
                    if (preco[i].length === 12) {
                      var elemento = preco.indexOf(preco[i]);
                      preco.splice(elemento, 1);
                    }
                  }

                  var sorting = preco.sort();                  

                  //adiciona aos array, os tres produtos com preços baixos
                  if (dados.produtos.produto[i].precoeup[0] === sorting[0]) {
                    this.produtos.push({
                      categoria: dados.produtos.produto[i].categoria[0],
                      descricao: dados.produtos.produto[i].descricao[0],
                      precoeup: dados.produtos.produto[i].precoeup[0],
                      foto: dados.produtos.produto[i].foto[0],
                      marca: dados.produtos.produto[i].marca[0],
                      codigo: dados.produtos.produto[i].codigo[0]
                    })
                  }
                  if (dados.produtos.produto[i].precoeup[0] === sorting[1]) {
                    this.produtos.push({
                      categoria: dados.produtos.produto[i].categoria[0],
                      descricao: dados.produtos.produto[i].descricao[0],
                      precoeup: dados.produtos.produto[i].precoeup[0],
                      foto: dados.produtos.produto[i].foto[0],
                      marca: dados.produtos.produto[i].marca[0],
                      codigo: dados.produtos.produto[i].codigo[0]
                    })
                  }
                  if (dados.produtos.produto[i].precoeup[0] === sorting[2]) {
                    this.produtos.push({
                      categoria: dados.produtos.produto[i].categoria[0],
                      descricao: dados.produtos.produto[i].descricao[0],
                      precoeup: dados.produtos.produto[i].precoeup[0],
                      foto: dados.produtos.produto[i].foto[0],
                      marca: dados.produtos.produto[i].marca[0],
                      codigo: dados.produtos.produto[i].codigo[0]
                    })
                  }
                  
                  //há casos com mais de um produto com o mesmo preco e isso causa um bug, esse código previne de ocorrer bug
                  this.produtos = this.produtos.filter(function (a) {
                      return !this[JSON.stringify(a)] && (this[JSON.stringify(a)] = true);
                  }, Object.create(null));

                  //limita o tamanho do array a 3
                  this.produtos = this.produtos.slice(0,3);
                  
                  this.produtos = this.produtos.sort((a, b) => a.precoeup < b.precoeup ? -1 : a.precoeup > b.precoeup ? 1 : 0);
                  this.arrayProntaCards(this.produtos[0].precoeup);
                }
              }
            }
          } //aqui
        }
      }
    })
  }
}