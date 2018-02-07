import { Component } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { NavController, MenuController } from 'ionic-angular';
import { Tick } from '../../interfaces/tick.interface';
import {COLORS} from '../../data/constants';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


export class HomePage {

  public lineChartData:Array<any> = [
    {data: [], label: 'last'},
    {data: [], label: 'ask'},
    {data: [], label: 'bid'},
    {data: [], label: 'vwap'}
  ];
  public lineChartLabels:Array<any> = [];
  public lineChartOptions:any = {
    responsive: true,
    legend: {
      labels: {
        usePointStyle: true
      }
    },
    scales: {
      xAxes: [{
        type: "time",
        time: {
          unit: 'hour',
          unitStepSize: 1,
          tooltipFormat: "DD/MM/YYYY, h:mm a",
          displayFormats: {
            hour: 'H:mm'
          }
        }
      }]
    },
    tooltips: {
      mode: "index",
      intersect: false
    },
    hover: {
      mode: "index",
      intersect: false
    }
  };
  public lineChartColors:Array<any> = [
    { // last
      backgroundColor: 'transparent',
      borderColor: '#6495ED',
      pointBackgroundColor: '#6495ED',
      pointBorderColor: '#6495ED',
      pointHoverBackgroundColor: '#00BFFF',
      pointHoverBorderColor: '#6495ED)',
      borderWidth: 1,
      pointRadius: 1,
      pointStyle: 'circle'
    },
    { // ask
      backgroundColor: 'transparent',
      borderColor: '#FA4141',
      pointBackgroundColor: '#FA4141',
      pointBorderColor: '#FA4141',
      pointHoverBackgroundColor: '#F67575',
      pointHoverBorderColor: '#FA4141',
      borderWidth: 1,
      pointRadius: 1,
      pointStyle: 'rect'
    },
    { // bid
      backgroundColor: 'transparent',
      borderColor: '#56C78B',
      pointBackgroundColor: '#56C78B',
      pointBorderColor: '#56C78B',
      pointHoverBackgroundColor: '#69E1A1',
      pointHoverBorderColor: '#56C78B',
      borderWidth: 1,
      pointRadius: 1,
      pointStyle: 'triangle'
    },
    { // vwap
      backgroundColor: 'transparent',
      borderColor: '#753396',
      pointBackgroundColor: '#753396',
      pointBorderColor: '#753396',
      pointHoverBackgroundColor: '#9d55c1',
      pointHoverBorderColor: '#753396',
      borderWidth: 1,
      pointRadius: 1,
      pointStyle: 'rectRot'
    }
  ];
  public lineChartLegend:boolean = true;
  public lineChartType:string = 'line';

  private tick:Tick = {
    id_tick: 0,
    book: '',
    last: 0,
    volume: 0,
    ask: 0,
    bid: 0,
    vwap: 0,
    status: 0,
    tick_date: ''
  };

  public colors = COLORS;

  // events
  public chartClicked(e:any):void {
    console.log(e);
  }

  public chartHovered(e:any):void {
    console.log(e);
  }

  public getTick(book:any) {
    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json' );
    let options = new RequestOptions({ headers: headers });
    let params = {
      book: book
    }
    this.http.get("http://digitable.mx/cripto/api/getTick.php?book="+params.book, options)
      .subscribe(response => {
        var data = response.json();
        this.tick = {
          id_tick: data[0].id_tick,
          book: data[0].bitso_book,
          last: data[0].bitso_last,
          volume: data[0].bitso_volume,
          ask: data[0].bitso_ask,
          bid: data[0].bitso_bid,
          vwap: data[0].bitso_vwap,
          status: data[0].status,
          tick_date: data[0].created_at
        };
       }, error => {
        alert("Error: " + error);// Error getting the data
      });


  }

  public getData(book:any): void {
    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json' );
    let options = new RequestOptions({ headers: headers });
    let params = {
      book: book,
      interval: '12 HOUR'
    }
    this.http.get("http://digitable.mx/cripto/api/getData.php?book="+params.book+"&interval="+params.interval, options)
      .subscribe(response => {
        var data = response.json();
        var length = Object.keys(data).length;
        // var length = 5;
        let _lineChartData:Array<any> = new Array(4);

        _lineChartData[0] = {data: new Array(length), label: 'last'};
        _lineChartData[1] = {data: new Array(length), label: 'ask'};
        _lineChartData[2] = {data: new Array(length), label: 'bid'};
        _lineChartData[3] = {data: new Array(length), label: 'vwap'};

        this.lineChartLabels.length = 0;
        for (let i = 0; i < length; i++) {
          let date = data[i].tick_date;
          _lineChartData[0].data[i] = data[i].status == 1 ? data[i].bitso_last : NaN;
          _lineChartData[1].data[i] = data[i].status == 1 ? data[i].bitso_ask : NaN;
          _lineChartData[2].data[i] = data[i].status == 1 ? data[i].bitso_bid : NaN;
          _lineChartData[3].data[i] = data[i].status == 1 ? data[i].bitso_vwap : NaN;
          this.lineChartLabels.push(date);
        }
        this.lineChartData = _lineChartData;


       }, error => {
        alert("Error: " + error);// Error getting the data
      });

  }

  constructor(public navCtrl: NavController, public http: Http, private menuController: MenuController) {
    this.getTick('btc_mxn');
    this.getData('btc_mxn');
  }

  toggleMenu() {
    this.menuController.toggle();
  }

}
