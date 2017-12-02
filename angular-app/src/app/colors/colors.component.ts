import { Component, OnInit } from '@angular/core';
import { ColorsService } from '../colors.service';

@Component({
  selector: 'app-colors',
  templateUrl: './colors.component.html',
  styleUrls: ['./colors.component.css']
})
export class ColorsComponent implements OnInit {
  public colors;

  constructor(private colorsService: ColorsService) { }

  ngOnInit() {
    this.colorsService.getColors().subscribe(
        data => {
          console.log('DATA --->', data);
          this.colors = data[0];
          console.log('this.colors --->', this.colors);
      },
        err => console.log(err),
        () =>  console.log('Carga de colores completa')
    )
  }

}
