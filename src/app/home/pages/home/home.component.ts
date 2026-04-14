import { Component, DestroyRef, OnInit } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';
import { ApexChart, ApexNonAxisChartSeries, ApexResponsive, ApexAxisChartSeries, ApexXAxis, ApexYAxis, ApexDataLabels, ApexStroke, ApexLegend, ApexTheme, ApexTooltip } from 'ng-apexcharts';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IBillDashboard } from '../../../core/models';
import { BillStatisticsService } from '../../../bill/services/bill-statistics.service';
import { ThemeService } from '../../../core/services/theme.service';

export type PieChartOptions = {
	series: ApexNonAxisChartSeries;
	chart: ApexChart;
	labels: string[];
	responsive: ApexResponsive[];
	legend: ApexLegend;
	theme: ApexTheme;
	tooltip: ApexTooltip;
};

export type LineChartOptions = {
	series: ApexAxisChartSeries;
	chart: ApexChart;
	xaxis: ApexXAxis;
	yaxis: ApexYAxis;
	dataLabels: ApexDataLabels;
	stroke: ApexStroke;
	legend: ApexLegend;
	theme: ApexTheme;
	tooltip: ApexTooltip;
};

@Component({
	selector: 'app-home',
	imports: [NgApexchartsModule],
	templateUrl: './home.component.html',
	styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
	dashboardData: IBillDashboard[] = [];
	isLoading = false;
	error: string | null = null;
	currentTheme: 'light' | 'dark' = 'light';

	currentMonthChartOptions: Partial<PieChartOptions> | null = null;
	lastMonthChartOptions: Partial<PieChartOptions> | null = null;
	yearlyComparisonChartOptions: Partial<LineChartOptions> | null = null;

	constructor(
		private billStatisticsService: BillStatisticsService,
		private themeService: ThemeService,
		private destroyRef: DestroyRef
	) { }

	ngOnInit(): void {
		this.subscribeToThemeChanges();
		this.loadDashboardData();
	}

	private subscribeToThemeChanges(): void {
		this.themeService.theme$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(theme => {
			this.currentTheme = theme as 'light' | 'dark';
			if (this.dashboardData.length > 0) {
				this.prepareCharts();
			}
		});
	}

	private loadDashboardData(): void {
		this.isLoading = true;
		this.error = null;

		this.billStatisticsService.getDashboardData().subscribe({
			next: (data) => {
				this.dashboardData = data.sort((a, b) =>
					b.paymentMonth.getTime() - a.paymentMonth.getTime()
				);
				this.isLoading = false;

				this.prepareCharts();
			},
			error: (err) => {
				this.error = 'Failed to load dashboard data';
				this.isLoading = false;
				console.error('Dashboard data error:', err);
			}
		});
	}

	private prepareCharts(): void {
		this.prepareCurrentMonthChart();
		this.prepareLastMonthChart();
		this.prepareYearlyComparisonChart();
	}

	private prepareCurrentMonthChart(): void {
		const now = new Date();
		const currentMonth = now.getMonth() + 1;
		const currentYear = now.getFullYear();

		const currentMonthData = this.dashboardData.find(
			d => d.paymentMonth.getMonth() + 1 === currentMonth && d.paymentMonth.getFullYear() === currentYear
		);

		if (!currentMonthData || currentMonthData.billItems.length === 0) {
			this.currentMonthChartOptions = null;
			return;
		}

		const { labels, values } = this.aggregateBillItemsBySubCategory(currentMonthData);

		this.currentMonthChartOptions = {
			series: values,
			chart: {
				type: 'pie',
				height: 350
			},
			labels: labels,
			responsive: [{
				breakpoint: 480,
				options: {
					chart: {
						width: 200
					},
					legend: {
						position: 'bottom'
					}
				}
			}],
			legend: {
				position: 'bottom',
				labels: {
					colors: this.currentTheme === 'dark' ? '#ffffff' : '#374151'
				}
			},
			tooltip: {
				y: {
					formatter: (value: number) => value.toFixed(2)
				}
			},
			theme: {
				mode: this.currentTheme
			}
		};
	}

	private prepareLastMonthChart(): void {
		const now = new Date();
		const lastMonth = new Date(now.getFullYear(), (now.getMonth() - 1), 1);
		const lastMonthNumber = lastMonth.getMonth();
		const lastMonthYear = lastMonth.getFullYear();

		const lastMonthData = this.dashboardData.find(
			d => d.paymentMonth.getMonth() === lastMonthNumber && d.paymentMonth.getFullYear() === lastMonthYear
		);

		if (!lastMonthData || lastMonthData.billItems.length === 0) {
			this.lastMonthChartOptions = null;
			return;
		}

		const { labels, values } = this.aggregateBillItemsBySubCategory(lastMonthData);

		this.lastMonthChartOptions = {
			series: values,
			chart: {
				type: 'pie',
				height: 350
			},
			labels: labels,
			responsive: [{
				breakpoint: 480,
				options: {
					chart: {
						width: 200
					},
					legend: {
						position: 'bottom'
					}
				}
			}],
			legend: {
				position: 'bottom',
				labels: {
					colors: this.currentTheme === 'dark' ? '#ffffff' : '#374151'
				}
			},
			tooltip: {
				y: {
					formatter: (value: number) => value.toFixed(2)
				}
			},
			theme: {
				mode: this.currentTheme
			}
		};
	}

	private prepareYearlyComparisonChart(): void {
		const years = this.getAllYearsFromData();

		if (years.length === 0) {
			this.yearlyComparisonChartOptions = null;
			return;
		}

		const series = years.map(year => ({
			name: year.toString(),
			data: this.getMonthlySpendingByYear(year)
		}));

		this.yearlyComparisonChartOptions = {
			series: series,
			chart: {
				type: 'line',
				height: 350,
				zoom: {
					enabled: false
				}
			},
			dataLabels: {
				enabled: false
			},
			stroke: {
				curve: 'smooth',
				width: 3
			},
			xaxis: {
				categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
				labels: {
					style: {
						colors: this.currentTheme === 'dark' ? '#ffffff' : '#374151'
					}
				}
			},
			yaxis: {
				labels: {
					formatter: (data: number) => data.toFixed(2),
				},
			},
			tooltip: {
				y: {
					formatter: (data: number) => data.toFixed(2)
				}
			},
			legend: {
				position: 'top',
				labels: {
					colors: this.currentTheme === 'dark' ? '#ffffff' : '#374151'
				}
			},
			theme: {
				mode: this.currentTheme
			}
		};
	}

	private aggregateBillItemsBySubCategory(billData: IBillDashboard): { labels: string[], values: number[] } {
		const aggregated = new Map<string, number>();

		billData.billItems.forEach(item => {
			const label = `${item.subCategory.name} (${item.subCategory.category?.name || 'No Category'})`;
			const currentValue = aggregated.get(label) || 0;
			aggregated.set(label, currentValue + item.value);
		});

		return {
			labels: Array.from(aggregated.keys()),
			values: Array.from(aggregated.values())
		};
	}

	private getAllYearsFromData(): number[] {
		if (this.dashboardData.length === 0) {
			return [];
		}

		const years = new Set<number>();
		this.dashboardData.forEach(billData => {
			years.add(billData.paymentMonth.getFullYear());
		});

		return Array.from(years).sort((a, b) => a - b);
	}

	private getMonthlySpendingByYear(year: number): number[] {
		const monthlyTotals = new Array(12).fill(0);

		const yearData = this.dashboardData.filter(d => d.paymentMonth.getFullYear() === year);

		yearData.forEach(billData => {
			const month = billData.paymentMonth.getMonth();
			const totalSpent = billData.billItems.reduce((sum, item) => sum + item.value, 0);
			monthlyTotals[month] += totalSpent;
		});

		return monthlyTotals;
	}
}
