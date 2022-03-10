import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-player',
  templateUrl: './edit-player.component.html',
  styleUrls: ['./edit-player.component.scss']
})
export class EditPlayerComponent implements OnInit {
allProfilPicture = ['1.webp', '2.jpg', '3.avif', '4.png', '5.png', '6.jpg', '7.jpg', '8.png'];
  constructor( public dialogRef : MatDialogRef <EditPlayerComponent>) { }

  ngOnInit(): void {
  }

}
