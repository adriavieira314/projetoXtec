import { Component, OnInit } from "@angular/core";
import { InterfaceService } from './interface.service';
import { IrradiacaoSolar } from "./irradiacao";
declare var $:any;

@Component({
  selector: 'app-interface',
  templateUrl: './interface.component.html',
  styleUrls: ['./interface.component.css']
})
export class InterfaceComponent implements OnInit {
  today = new Date();
  monName = new Array ("JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC");
  cdInput: string = 'cep';
  selectedValor: string = 'reais';
  local: string = 'UF';
  mascara: string = "00000-000"
  cepInformado = false;
  grupo = 'Grupo';

  inputCEP: string;
  inputValor: number;
  energia: number;
  potPico: number;
  selectedPainel: any = '410';
  selectedEstrutura: any = 'METALICA';
  potPainel: any;
  paineis: number;
  area: number;
  investimento: number;
  result: IrradiacaoSolar[] = [];
  irradiacaoSolar: number;

  energiaText: any;
  potPicoText: any;
  paineisText: any;
  areaText: any;

  constructor(private interfaceService: InterfaceService) { }

  ngOnInit(): void {
    this.painel();
    this.convertCSV();
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
      // $scope.mascara = "0000-000";
      this.cdInput = "cep";
    }
  }

  encontraCEP() {
    if (this.inputCEP !== "") {
      //Expressão regular para validar o CEP.
      var validacep = /^[0-9]{8}$/;
      if (validacep.test(this.inputCEP)) {
        this.interfaceService.getCepApi(this.inputCEP).subscribe(
          dados => {
            this.local = dados.uf + " - " + dados.localidade;
            this.buscaIrradiacao(dados.localidade);
            this.cepInformado = true;
            this.cdInput = "reais";
            this.inputValor = 0;
            this.mascara = "R$";
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
        alert('Grupo A')
      } else {
        // this.carregando = true;
        this.cdInput = "carregando";
        this.grupo = "Grupo B";
        // getXML();
      }
    }

    valorInvestimento = function() {
      var number = 0;
      if (this.potPico > 0 && this.potPico < 20) {
        number = 2.000 + 4.346 + this.precoKit;
        this.investimento = parseFloat(number.toFixed(3));
        console.log(this.investimento);

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
      // this.topTres = [];
      // this.preco = [];
      // this.carregando = true;
      // this.precoKit = 0;

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

          // console.log(this.dados);
          // return JSON.stringify(result); //JSON
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
          console.log(this.irradiacaoSolar);
        }
      }
    }
  }
