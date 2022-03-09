import { Component, OnInit } from '@angular/core';
import { Game } from '../models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
// import { TOUCH_BUFFER_MS } from '@angular/cdk/a11y/input-modality/input-modality-detector';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';




@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  pickCardAnimation = false;
 game: any = Game;
 currentCard: string = '';
 gameId:any;

  constructor ( private Router: ActivatedRoute, private firestore: AngularFirestore, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.newGame();
    this.Router.params.subscribe((params:any) =>{
      console.log(params.id);
      this.gameId = params.id;


      this.firestore
      .collection('games')
      .doc(this.gameId)
      .valueChanges()
      .subscribe((game:any) => {
        console.log('game update',game);
        //  this.firestore.collection('games').add(this.game.toJson());
      console.log(this.game);
      this.game.currentPlayer = game.currentPlayer;
      this.game.playedCards = game.playedCards;
      this.game.players = game.players;
      this.game.stack = game.stack;

      });

    });

  
  
  }

  newGame(){
    this.game = new Game;
    // this.firestore.collection('games').add(this.game.toJson());
    // console.log(this.game);
  }


  takeCard(){
    if(!this.pickCardAnimation){
      this.currentCard = this.game.stack.pop(); // durch pop wird immer die letzte Karte gezogen 
      this.pickCardAnimation =true; this.saveGame();

     this.game.currentPlayer++;
     this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
       setTimeout(() => {
         this.game.playedCards.push(this.currentCard); 
         this.pickCardAnimation = false;
         this.saveGame();
       }, 1000);

    }

  
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);
  

    dialogRef.afterClosed().subscribe(name => {
      if(name && name.length > 0){
        this.game.players.push(name);
        this.saveGame();
        console.log('The dialog was closed', name);
      }  
    });
}

saveGame(){

  this.firestore
  .collection('games')
  .doc(this.gameId)
  .update(this.game.toJson());
}
}