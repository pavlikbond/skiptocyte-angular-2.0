import { Component, OnInit } from '@angular/core';
import * as data from './presets.json';

@Component({
  selector: 'app-differential',
  templateUrl: './differential.component.html',
  styleUrls: ['./differential.component.scss'],
})
export class DifferentialComponent implements OnInit {
  presets = data;
  constructor() {}

  ngOnInit(): void {}
}
