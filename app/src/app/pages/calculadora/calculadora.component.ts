import { Component, OnInit, HostListener, ViewChild } from "@angular/core";
import { CalculadoraService } from './calculadora.service';
import { IrradiacaoSolar } from "./irradiacao";
import { CardsComponent } from '../cardsProdutos/cards.component'
import { ModalComponent } from '../modal/modal.component';
declare var $:any;

@Component({
  selector: 'app-calculadora',
  templateUrl: './calculadora.component.html',
  styleUrls: ['./calculadora.component.css']
})
export class CalculadoraComponent implements OnInit {
  public maskCEP = [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];
  screenWidth: number;
  isDevice: boolean = false;
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
  potPico: number = 5.85;
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

  constructor(private calculadoraService: CalculadoraService) { }
  @ViewChild(CardsComponent) private cards: CardsComponent;
  @ViewChild(ModalComponent) private modal: ModalComponent;

  pegaJSONCards() {
    this.cards.pegaJSON();
  }

  showModalComponent() {
    this.modal.showModal();
  }

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
        this.calculadoraService.getCepApi(cep).subscribe(
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
      this.showModalComponent();

    } else {
      this.cdInput = "carregando";
      this.grupo = "Grupo B";
      this.pegaJSONCards();
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

  arrayPronta(preco) {
    this.pronto = true;
    this.cdInput = "grupo";
    this.precoKit = parseFloat(preco);
    this.valorInvestimento();
  }

  precoGerador(preco) {
    $('html, body').animate({scrollTop: $("#marca-calc").offset().top}, 500);
    this.precoKit = parseFloat(preco);
    this.valorInvestimento();
  }

  //Para dispostivos moveis
  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 770){
      this.isDevice = true;

      $("#btn-apagar").removeClass("col-3");
      $("#btn-apagar").addClass("col-4");
    }
  }
}

  
