import { Component, OnInit, Input } from '@angular/core';
import { PresetService } from 'src/app/services/preset.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
@Component({
  selector: 'app-keypad',
  templateUrl: './keypad.component.html',
  styleUrls: ['./keypad.component.scss'],
})
export class KeypadComponent implements OnInit {
  @Input() pressedKey: string;
  isMobile: boolean = false;
  buttons: string[] = [
    'NumLock',
    '/',
    '*',
    '-',
    '7',
    '8',
    '9',
    '+',
    '4',
    '5',
    '6',
    '1',
    '2',
    '3',
    'Enter',
    '0',
    '.',
  ];
  mobileInvisible: string[] = ['NumLock', 'Enter', '+'];
  constructor(
    public presetService: PresetService,
    private breakpointObserver: BreakpointObserver
  ) {}
  ngOnInit(): void {
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe((result) => {
        this.isMobile = result.matches;
      });
  }

  keyBindingCheck(key: string) {
    const row = this.presetService.currentPreset?.rows.find((row) => {
      return row.key == key;
    });
    return row ? row.cell : '';
  }
}
