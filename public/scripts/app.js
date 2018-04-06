// $(() => {
//   $.ajax({
//     method: "POST",
//     url: "/game/new"
//   }).done(() => {
//     $('#deal').click(function() {
//       dealCard(randomCard());
//     });
  
//     var cardsInDeck = [];
//     var numberOfCardsInDeck = 5;
//     cardsInDeck[0] = 'AceHearts';
//     cardsInDeck[1] = 'Clubs2';
//     cardsInDeck[2] = 'ClubsAce';
//     cardsInDeck[3] = 'DiamondKing';
//     cardsInDeck[4] = 'SpadesJack';
  
//     console.log(cardsInDeck);

//     function dealCard(i) {
//       if (numberOfCardsInDeck == 0) return
//       false;
//       var img = document.createElement('img');
//       img.src = "http://cop4813eaglin.pbworks.com/f/" + cardsInDeck[i] + ".png";
  
//       document.body.appendChild(img);
//       removeCard(i);
//     }
  
//     function removeCard(c) {
//       for (j=c; j <= numberOfCardsInDeck - 2; j++) {
//         cardsInDeck[j] = cardsInDeck[j+1];
//       }
//       numberOfCardsInDeck--;
//     }
  
//     function randomCard() {
//       return Math.floor(Math.random * numberOfCardsInDeck);
//     }
//   });
// });
