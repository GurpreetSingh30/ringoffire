import { Component, OnInit } from '@angular/core';
import { Game } from '../models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
// import { TOUCH_BUFFER_MS } from '@angular/cdk/a11y/input-modality/input-modality-detector';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { EditPlayerComponent } from '../edit-player/edit-player.component';




@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

 
 game: any = Game;
 gameId:any;
 gameOver = false;
 addPlayerHint: boolean = false;


  constructor ( private Router: ActivatedRoute, private firestore: AngularFirestore, public dialog: MatDialog) { }


  playAgain(){
    this.newGame();
    this.Router.params.subscribe((params:any) =>{
      console.log(params.id);
      this.gameId = params.id;
      this.firestoreCollection(); 
      this.saveGame();  
    });
    this.gameOver = false;


  }
  ngOnInit(): void {
    this.newGame();
    this.Router.params.subscribe((params:any) =>{
      console.log(params.id);
      this.gameId = params.id;
      this.firestoreCollection();   
    });
  }


  firestoreCollection(){
    this.firestore.collection('games').doc(this.gameId).valueChanges().subscribe((game:any) => {
        console.log('game update',game);
      console.log(this.game);
      this.game.currentPlayer = game.currentPlayer;
      this.game.playedCards = game.playedCards;
      this.game.player_images = game.player_images;
      this.game.players = game.players;
      this.game.stack = game.stack;
      this.game.pickCardAnimation = game.pickCardAnimation;
      this.game.currentCard = game.currentCard;
      });
  }

  newGame(){
    this.game = new Game;

  }


  takeCard(){
    if(this.game.players.length  == 0 ){
      alert('Please choose a Player');
    }else if( this.game.players.length == 1){
    alert('Please chose one more Player');
    }else if(this.game.stack == 0){
      this.gameOver = true;
    }else{
     if(!this.game.pickCardAnimation){
        this.game.currentCard = this.game.stack.pop(); // durch pop wird immer die letzte Karte gezogen 
        this.game.pickCardAnimation =true; 
        this.game.currentPlayer++;
       this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
       this.saveGame();
       this.setTimeOut();    
    }
  }
  }


setTimeOut(){
  setTimeout(() => {
    this.game.playedCards.push(this.game.currentCard); 
    this.game.pickCardAnimation = false;
    this.saveGame();
  }, 1000);
}

  editPlayer(playerId: number){
    console.log('edit player', playerId);
    const dialogRef = this.dialog.open(EditPlayerComponent);
    dialogRef.afterClosed().subscribe(newPicture => {
      console.log('Received', newPicture);
      if(newPicture){
        if(newPicture == 'DELETE'){
        this.game.players.splice(playerId, 1);
        this.game.player_images.splice(playerId, 1);
        }else{
          this.game.player_images[playerId] = newPicture;
        }
         this.saveGame();
      }
      });
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);
    dialogRef.afterClosed().subscribe(name => {
      if(name && name.length > 0){
        this.game.players.push(name);
        this.game.player_images.push('1.webp');
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