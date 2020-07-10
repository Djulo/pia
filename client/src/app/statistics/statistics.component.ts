import { Component, OnInit } from '@angular/core';
import { OrderService } from '@app/_services/order.service';
import { first } from 'rxjs/operators';
import { Order, Company } from '@app/_models';
import * as moment from 'moment';
import { CompanyService, AuthenticationService } from '@app/_services';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
})
export class StatisticsComponent implements OnInit {
  company: Company;
  constructor(
    private companyService: CompanyService,
    private authService: AuthenticationService
  ) {}

  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
  };

  public barChartType = 'bar';
  public barChartLegend = false;
  public barChartLabels = [];
  public barChartData = [];

  ngOnInit(): void {
    this.companyService
      .getById(this.authService.currentUserValue.id)
      .pipe(first())
      .subscribe((company) => {
        this.company = company;

        const dayCounts = company.orders.reduce(function (result, order) {
          var day = moment(order.date).format('YYYY-MM-DD');
          if (!result[day]) {
            result[day] = 0;
          }
          result[day]++;
          return result;
        }, {});

        const data = [];
        for (const [key, value] of Object.entries(dayCounts)) {
          this.barChartLabels.push(key);
          data.push(value);
        }

        this.barChartData = [{ data: data }];

        console.log(this.barChartData);
      });
  }
}
