import { Component, OnInit, HostListener, ViewChild } from "@angular/core";
import { ModalDirective } from "ngx-bootstrap/modal";
import { InterfaceService } from './interface.service';
import { IrradiacaoSolar } from "./irradiacao";
declare var $:any;

@Component({
  selector: 'app-interface',
  templateUrl: './interface.component.html',
  styleUrls: ['./interface.component.css']
})
export class InterfaceComponent implements OnInit {
  public maskCEP = [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];
  screenWidth: number;
  isDevice: boolean = false;
  produtos = [];
  today = new Date();
  monName = new Array ("JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC");
  cdInput: string = 'cep';
  selectedValor: string = 'reais';
  local: string = 'UF';
  mascara: string = "00000-000"
  cepInformado = false;
  grupo = 'Grupo';
  pronto: boolean = false;

  inputCEP: string;
  inputValor: number;
  energia: number;
  potPico: number;
  selectedPainel: any = '410W';
  selectedEstrutura: any = 'METALICA';
  potPainel: any;
  paineis: number;
  area: number;
  investimento: number;
  result: IrradiacaoSolar[] = [];
  irradiacaoSolar: number;
  precoKit: number;

  energiaText: any;
  potPicoText: any;
  paineisText: any;
  areaText: any;

  constructor(private interfaceService: InterfaceService) { }

  //funcoes modal
  @ViewChild('autoShownModal') autoShownModal: ModalDirective;
  isModalShown = false;
 
  showModal(): void {
    this.isModalShown = true;
  }
 
  hideModal(): void {
    this.autoShownModal.hide();
  }
 
  onHidden(): void {
    this.isModalShown = false;
  }
  //fim 

  ngOnInit(): void {
    this.painel();
    this.convertCSV();
    this.getScreenSize();
  }

  onClick(id:string) {
    if (id === "consumo") {
      this.selectedValor = "consumo";
      this.cdInput = "kwh";
      this.mascara = "Consumo(kWh)";
      this.inputValor = 0;

    } else if (id === "reais") {
      this.selectedValor = "reais";
      this.cdInput = "reais";
      this.mascara = "R$";
      this.inputValor = 0;
    } else {
      this.mascara = "0000-000";
      this.cdInput = "cep";
    }
  }

  encontraCEP() {
    if (this.inputCEP !== "") {
      //Expressão regular para validar o CEP.
      var cep = this.inputCEP.replace("-", "");
      var validacep = /^[0-9]{8}$/;
      if (validacep.test(cep)) {
        this.interfaceService.getCepApi(cep).subscribe(
          dados => {
            if (dados.localidade) {
              this.local = dados.uf + " - " + dados.localidade;
              this.buscaIrradiacao(dados.localidade);
              this.cepInformado = true;
              this.cdInput = "reais";
              this.inputValor = 0;
              this.mascara = "R$";
            } else {
              console.log(dados);
              this.cepInformado = false;
              this.apagar();
              alert('CEP não encontrado.');
            }
          },
          erro => {
            console.log(erro);
            this.cepInformado = false;
            this.apagar();
            alert('CEP não encontrado.');
        })
      } else {
        alert('Fomarto de CEP inválido');
      }
    }
  }

  calculoEnergia() {
    if (this.selectedValor === "consumo") {
      this.energia = this.inputValor;
      this.energiaText = this.energia;
    } else {
      var energiaCalc = this.inputValor/0.92;
      this.energia = Math.floor(energiaCalc);
      this.energiaText = this.energia;
    }
  }

  calculoPotenciaPico() {
    var potPicoCalc = this.energia/(30 * this.irradiacaoSolar * 0.80);
    this.potPico = parseFloat(potPicoCalc.toFixed(2));
    this.potPicoText = this.potPico;
  }

  painel(event:any = '410') {
    if (event === '335') {
      this.potPainel = 335/1000;

    } else if (event === '410') {
      this.potPainel = 410/1000;

    } else {
      this.potPainel = 440/1000;
    }

  }

  calculoQtdPaineis() {
    var painel = this.potPico/this.potPainel;

    this.paineis = Math.floor(painel);
    if (this.paineis %  2 === 1) {
      this.paineis++;
      this.paineisText = this.paineis;

    } else {
      this.paineisText = this.paineis;
    }
  }

  calculoArea() {
    var areaCalc = 2.03 * this.paineis;
    this.area = parseFloat(areaCalc.toFixed(2));
    this.areaText = this.area;
  }

  tipoGrupo() {
    if (this.potPico >= 104) {
      this.grupo = "Grupo A";
      this.showModal();

    } else {
      this.cdInput = "carregando";
      this.grupo = "Grupo B";
      this.pegaJSON();
    }
  }

  valorInvestimento = function() {
    var number = 0;
    if (this.potPico > 0 && this.potPico < 20) {
      number = 2.000 + 4.346 + this.precoKit;
      this.investimento = parseFloat(number.toFixed(3));

    }
    if (this.potPico >= 20 && this.potPico < 25) {
      number = 2.000 + 8.406 + this.precoKit;
      this.investimento = parseFloat(number.toFixed(3));

    }
    if (this.potPico >= 25 && this.potPico < 35) {
      number = 2.500 + 10.098 + this.precoKit;
      this.investimento = parseFloat(number.toFixed(3));

    }
    if (this.potPico >= 35 && this.potPico < 46) {
      number = 2.500 + 12.337 + this.precoKit;
      this.investimento = parseFloat(number.toFixed(3));

    }
    if (this.potPico >= 46 && this.potPico < 57) {
      number = 3.500 + 14.670 + this.precoKit;
      this.investimento = parseFloat(number.toFixed(3));

    }
    if (this.potPico >= 57 && this.potPico < 88) {
      number = 4.000 + 18.090 + this.precoKit;
      this.investimento = parseFloat(number.toFixed(3));

    }
    if (this.potPico >= 88 && this.potPico < 104) {
      number = 4.500 + 23.588 + this.precoKit;
      this.investimento = parseFloat(number.toFixed(3));
    }
  }

  resultado() {
    this.calculoEnergia();
    this.calculoPotenciaPico();
    this.calculoQtdPaineis();
    this.calculoArea();
    this.tipoGrupo();
  }

  apagar() {
    this.produtos = [];
    this.pronto = false;
    this.precoKit = 0;

    this.cdInput = "cep";
    this.mascara = "0000-000";
    this.inputCEP = "";

    this.local = 'UF';
    this.energia = 0;
    this.potPico = 0;
    this.paineis = 0;
    this.area = 0;
    this.inputValor = 0;
    this.investimento = 0;
    this.energiaText = "";
    this.potPicoText = "";
    this.paineisText = "";
    this.areaText = "";

    this.grupo = "Grupo";
    this.cepInformado = false;
    this.selectedPainel = '410W';
    this.selectedEstrutura = 'METALICA';
  
  }

  convertCSV() {
    var dados = [];
    $.ajax({
      type: "GET",
      url: "assets/irradiacao/irradiacaoSolar.csv",
      dataType: "text",
      success: function(csv:any) {
        var lines = csv.split("\n");

        for(let i = 0; i < lines.length; i++){
          lines[i] = lines[i].replace(/\s/,'')//delete all blanks
        }

        var headers = lines[0].split(";");

        for(var i = 1; i < lines.length; i++){
          var obj = {};
          var currentline = lines[i].split(";");

          for(var j = 0; j < headers.length; j++){
            obj[headers[j]] = currentline[j];
          }

          dados.push(obj);
        }
      }
    })
    this.result = dados;
    return this.result; //JavaScript object
  }

  //formata o numero para um numero real colocando um ponto
  formatarValor(valor:any) {
    return valor.toLocaleString('pt-BR');
  }

  buscaIrradiacao(localidade:string) {
    //pegando o mes em que o usuario entrou
    var mes = this.monName[this.today.getMonth()];

    for (let index = 0; index < this.result.length; index++) {
      if (this.result[index].NAME === localidade) {
        //pegando a irradiacao solar do mes
        var valorIrradiacao = this.result[index][mes];
        //convertendo para numero
        var stringParaNumero = parseFloat(valorIrradiacao);

        var valorFormatado = parseFloat(this.formatarValor(stringParaNumero));
        this.irradiacaoSolar = parseFloat(valorFormatado.toFixed(2));
      }
    }
  }

  pegaJSON() {
    this.produtos = [];
    var preco = [];
    this.interfaceService.getJSON().subscribe(dados => {
      for (let i = 0; i < dados.produtos.produto.length; i++) {
        if (dados.produtos.produto[i].atributos) { //verificando se possui a tag atributo
          if (dados.produtos.produto[i].atributos[0].MARCA_PAINEL[0]) { //verificando se possui a tag marca_painel dentro da tag atributo
            var string = dados.produtos.produto[i].atributos[0].MARCA_PAINEL[0]; //se sim, pegando a marca
            var painel = string.split(" ");//transformando a string em array
            
            if (painel.includes(this.selectedPainel)) { //verificando se o array possui tal painel
              //pegando o tipo de estrutura dos produtos com o painel selecionado
              var tipo = dados.produtos.produto[i].atributos[0].TIPO_ESTRUTURA[0];
              var estrutura = tipo.split(" ");
              
              if (estrutura.includes(this.selectedEstrutura)) {
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
                // this.produtos = this.produtos.filter(function (a) {
                //     return !this[JSON.stringify(a)] && (this[JSON.stringify(a)] = true);
                // }, Object.create(null));

                //limita o tamanho do array a 3
                this.produtos = this.produtos.slice(0,3);
                
                this.produtos = this.produtos.sort((a, b) => a.precoeup < b.precoeup ? -1 : a.precoeup > b.precoeup ? 1 : 0);
                this.arrayPronta();
              }
            }
          }
        }
      }
    })
  }

  arrayPronta() {
    this.pronto = true;
    this.cdInput = "grupo";
    this.precoKit = parseFloat(this.produtos[0].precoeup);
    this.valorInvestimento();
  }

  precoGerador(preco) {
    $('html, body').animate({scrollTop: $("#marca-calc").offset().top}, 500);
    this.precoKit = parseFloat(preco);
    this.valorInvestimento();
  }

  //Para dispostivos moveis
  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 770){
      this.isDevice = true;

      $("#btn-apagar").removeClass("col-3");
      $("#btn-apagar").addClass("col-4");
    }
  }
}

  
