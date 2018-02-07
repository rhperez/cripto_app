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

  public colors = COLORS;
  private book = 'btc_mxn';
  private title = 'Mercado de Bitcoin';

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
      borderColor: this.colors.LAST_PRIMARY,
      pointBackgroundColor: this.colors.LAST_PRIMARY,
      pointBorderColor: this.colors.LAST_PRIMARY,
      pointHoverBackgroundColor: this.colors.LAST_SECONDARY,
      pointHoverBorderColor: this.colors.LAST_PRIMARY,
      borderWidth: 1,
      pointRadius: 1,
      pointStyle: 'circle'
    },
    { // ask
      backgroundColor: 'transparent',
      borderColor: this.colors.ASK_PRIMARY,
      pointBackgroundColor: this.colors.ASK_PRIMARY,
      pointBorderColor: this.colors.ASK_PRIMARY,
      pointHoverBackgroundColor: this.colors.ASK_SECONDARY,
      pointHoverBorderColor: this.colors.ASK_PRIMARY,
      borderWidth: 1,
      pointRadius: 1,
      pointStyle: 'rect'
    },
    { // bid
      backgroundColor: 'transparent',
      borderColor: this.colors.BID_PRIMARY,
      pointBackgroundColor: this.colors.BID_PRIMARY,
      pointBorderColor: this.colors.BID_PRIMARY,
      pointHoverBackgroundColor: this.colors.BID_SECONDARY,
      pointHoverBorderColor: this.colors.BID_PRIMARY,
      borderWidth: 1,
      pointRadius: 1,
      pointStyle: 'triangle'
    },
    { // vwap
      backgroundColor: 'transparent',
      borderColor: this.colors.VWAP_PRIMARY,
      pointBackgroundColor: this.colors.VWAP_PRIMARY,
      pointBorderColor: this.colors.VWAP_PRIMARY,
      pointHoverBackgroundColor: this.colors.VWAP_SECONDARY,
      pointHoverBorderColor: this.colors.VWAP_PRIMARY,
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

  // events
  public chartClicked(e:any):void {
    console.log(e);
  }

  public chartHovered(e:any):void {
    console.log(e);
  }

  public getTick() {
    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json' );
    let options = new RequestOptions({ headers: headers });
    let params = {
      book: this.book
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

  public getData(): void {
    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json' );
    let options = new RequestOptions({ headers: headers });
    let params = {
      book: this.book,
      interval: '12 HOUR'
    }
    this.http.get("http://digitable.mx/cripto/api/getData.php?book="+params.book+"&interval="+params.interval, options)
      .subscribe(response => {
        var data = response.json();
        var length = Object.keys(data).length;
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

  public refreshBook(): void {
    switch (this.book) {
      case 'btc_mxn':
        this.title = 'Mercado de Bitcoin';
        break;
      case 'eth_mxn':
        this.title = 'Mercado de Ethereum';
        break;
      case 'xrp_mxn':
        this.title = 'Mercado de Ripple';
        break;
      case 'ltc_mxn':
        this.title = 'Mercado de Litcoin';
        break;
    }
    this.getTick();
    this.getData();
  }

  constructor(public navCtrl: NavController, public http: Http, private menuController: MenuController) {
    this.refreshBook();
  }

  toggleMenu() {
    this.menuController.toggle();
  }

}
