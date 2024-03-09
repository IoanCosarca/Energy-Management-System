import { Component, OnInit, ViewChild } from '@angular/core';
import { IDModel } from 'src/app/model/id-response.model';
import { DeviceService } from 'src/app/service/device.service';
import { MeasurementModel } from 'src/app/model/measurement.model';
import { ConsumerService } from 'src/app/service/consumer.service';
import {
	ChartComponent,
	ApexAxisChartSeries,
	ApexChart,
	ApexXAxis,
	ApexDataLabels,
	ApexTitleSubtitle,
	ApexStroke,
	ApexGrid
} from "ng-apexcharts";

export type ChartOptions = {
	series: ApexAxisChartSeries;
	chart: ApexChart;
	xaxis: ApexXAxis;
	dataLabels: ApexDataLabels;
	grid: ApexGrid;
	stroke: ApexStroke;
	title: ApexTitleSubtitle;
};

@Component({
	selector: 'app-history',
	templateUrl: './history.component.html',
	styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
	consumptionMessages: MeasurementModel[] = [];

	selected!: Date | null;

	@ViewChild("chart") chart: ChartComponent | undefined;

	public chartOptions: Partial<ChartOptions>;

	constructor(private deviceService: DeviceService, private consumerService: ConsumerService) {
		this.chartOptions = {
			series: [
				{
					name: "Consumption",
					data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
				}
			],
			chart: {
				height: 500,
				type: "line",
				zoom: {
					enabled: false
				}
			},
			dataLabels: {
				enabled: false
			},
			stroke: {
				curve: "straight"
			},
			grid: {
				row: {
					colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
					opacity: 0.5
				}
			},
			xaxis: {
				categories: [
					"0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"
				]
			}
		};
	}

	ngOnInit(): void {
		this.deviceService.getUserDevicesIDs(JSON.parse(sessionStorage.getItem('jwt') as string).id).subscribe(
			(ids: IDModel[]) => {
				for (let idresponse of ids) {
					this.consumerService.getDeviceMessages(idresponse.id).subscribe(
						(messages: MeasurementModel[]) => {
							for (let message of messages) {
								this.consumptionMessages.push(message);
							}
						},
						(error) => {
							console.error('Error fetching messages', error);
						}
					)
				}
			},
			(error) => {
				console.error('Error fetching device ids', error);
			}
		);
	}

	updateChart(): void {
		if (this.selected) {
			const selectedDate = this.selected.toLocaleDateString();

			// Create a map to store the sum of measurements for each hour
			const hourlySumMap = new Map<number, number>();

			// Filter messages for the selected date
			const filteredMessages = this.consumptionMessages.filter(message => {
				const messageDate = new Date(message.timestamp);

				// Format the date in GMT+0
				const messageDateStr = messageDate.toLocaleString('en-US', { timeZone: 'UTC' }).split(',')[0];

				return messageDateStr === selectedDate;
			});

			// Calculate the sum of measurements for each hour
			filteredMessages.forEach(message => {
				const messageDate = new Date(message.timestamp);
				const hour = messageDate.getUTCHours();

				// Initialize the sum for the hour if not already present
				if (!hourlySumMap.has(hour)) {
					hourlySumMap.set(hour, 0);
				}

				// Add the measurement to the sum
				hourlySumMap.set(hour, hourlySumMap.get(hour)! + message.measurement);
			});

			const chartData = Array(24).fill(0);

			// Convert the map values to an array
			Array.from(hourlySumMap.entries()).forEach(([hour, sum]) => {
				chartData[hour] = sum;
			});

			// Create a new series with the updated data
			const newSeries = [
				{
					name: 'Consumption',
					data: chartData
				}
			];

			// Assign the new series to chartOptions
			this.chartOptions = {
				...this.chartOptions,
				series: newSeries
			};

			// Trigger chart update
			this.chart?.updateOptions(this.chartOptions);
		}
	}
}
