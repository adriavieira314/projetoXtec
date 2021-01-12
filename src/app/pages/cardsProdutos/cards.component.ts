import { Component, OnInit } from '@angular/core';
import * as xml2js from 'xml2js';
import * as fs from 'fs';
declare var $:any;

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit {
    xml: any;

    ngOnInit(): void {
        // this.convertCSV();

        // var parser = new xml2js.Parser();
        // fs.readFile(__dirname + '/produtos.xml', function(err, data) {
        //     parser.parseString(data, function (err, result) {
        //         console.dir(result);
        //         console.dir(err);
        //         console.log('Done');
        //     });
        // });
        
    }

    convertCSV() {
        var jqxhr = $.ajax({
            type: "GET",
            url: "assets/produtos.xml",
            preserveWhitespace: true,
            success: function(csv) {
                var teste = csv;
                console.log(teste);
            }
        })

        
    }
}
