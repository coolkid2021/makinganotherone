
// Crazy8.js
/*
 * This file contains a JavaScript main program that plays the game
 * Crazy Eights.  It depends on functions Card and Cards, which should
 * be added to the end of the file.
 */

// Global variables

var IWin = false;  // true if computer has won the game
var UWin = false;  // true if user has won
var wildSuit;      // Suit named if 8 is played
var deck = Cards();  // The simulated deck of cards.  Acts as draw pile
// once hands are dealt.
var discardPile = Cards();  // Discard pile.
var myHand = Cards();       // Computer's cards
var yourHand = Cards();     // User's cards

var yourRemove = false;
var yourFirst = true;

var myRemove = false;
var myFirst = true;

var move;

var yourParent = document.getElementById("yourHand");
var myParent = document.getElementById("myHand");
var disPile = document.getElementById("table");

var card = document.createElement("img");
disPile.appendChild(card);
card.setAttribute("src", "../images/PlayingCards/back.png");
card.id="p";
card.alt="p";
card.style.position="absolute";
card.style.left="0px";
card.style.top="0px";
card.style.width="71px";
card.style.height="96px";
card.style.zIndex=1;
card.addEventListener("click",playerCard,false);

var card = document.createElement("img");
disPile.appendChild(card);
card.setAttribute("src", "../images/PlayingCards/back.png");
card.id="discard";
card.alt="hold";
card.style.position="absolute";
card.style.left="71px";
card.style.top="0px";
card.style.width="71px";
card.style.height="96px";
card.style.zIndex=2;
card.addEventListener("click",playerCard,false);

// Main Program

// Create the deck of 52 cards
  var suitOrder = { c:0, d:1, h:2, s:3 };
  var numberOrder = { 2:0, 3:1, 4:2, 5:3, 6:4, 7:5, 8:6, 9:7, 10:8,
    j:9, q:10, k:11, a:12 };
  for (var number in numberOrder) {
    for (var suit in suitOrder) {
      deck.push(new Card(suit, String(number),
                         suitOrder[suit]*13 + numberOrder[number]));
    }
  }
  
// Shuffle the deck
  deck.shuffle();
  
// Deal the hands (7 cards each)
  for (var i=1; i<=7; i++) {
    yourHand.push(deck.pop());
    myHand.push(deck.pop());
  }
  
// Create the discard pile with one card from the deck
  discardPile.push(deck.pop());
  if (discardPile.topCard().number == 8) {
    wildSuit = discardPile.topCard().suit;
  }
  yourHand.sortCards();
  updatePage();
  
// Keep playing until someone wins
// Get valid move from the user
  function finish(move) {
    yourHand.sortCards();
    updatePage();
    yourRemove = false;
    
    // Perform user's move: pick or discard
    if (move == "p") {
      yourRemove = false;
      if (deck.length == 0) {
        newDrawPile();
      }
      yourHand.push(deck.pop());
    }
    else if(!(canPlay(yourHand.findCard(move)))) {
      window.alert("Sorry, " + move + " is not a valid move!");
      doNothing();
    }
    else if (move != "q") {
      yourRemove = true;
      discardPile.push(yourHand.getCard(yourHand.indexOf(move)));
      
      // If the card played is an 8, the user should be allowed to name
      // the suit as well.
      if (discardPile.topCard().number == 8) {
        do {
          wildSuit = window.prompt("Choose a suit:\n&spades; &clubs;  &hearts; &diams;");
        } while (wildSuit != 'c' && wildSuit != 'd' && wildSuit != 'h' &&
                 wildSuit != 's');
      }
    }
    
    // If the game isn't over, play the computer's hand
    if (yourHand.length == 0) {
      UWin = true;
    }    
    else if (move != "q") {
      
      // Does the computer have a card to play?
      var moveOK = false;
      for (i=0; i<myHand.length && !moveOK; i++) {
        if (canPlay(myHand[i])) {
          moveOK = true;
          myRemove = true;
          card = i;
        }
      }
      
      // Play if possible, otherwise pick a card
      if (moveOK) {
        myRemove = false;
        discardPile.push(myHand.getCard(card));
        if (discardPile.topCard().number == 8) {
          wildSuit = discardPile.topCard().suit;
        }
      }
      else {
        if (deck.length == 0) {
          newDrawPile();
        }
        myHand.push(deck.pop());
      }
      if (myHand.length == 0) {
        IWin = true;
      }
    }
    yourHand.sortCards();
    updatePage();
    
// Report the results
    if (UWin) {
      window.alert("You win...");
    }
    else if (IWin) {
      window.alert("I win!!!");
    } 
  }
  
  
// Helper functions
  
  function updatePage() {
    disPile.removeChild(document.getElementById("discard"));
    
    var card2 = document.createElement("img");
    disPile.appendChild(card2);
    card2.setAttribute("src", "../images/PlayingCards/"+discardPile.topCard().toString()+".png");
    card2.id="discard";
    card2.alt=discardPile.topCard().toString();
    card2.style.position="absolute";
    card2.style.left="71px";
    card2.style.top="0px";
    card2.style.width="71px";
    card2.style.height="96px";
    card2.style.zIndex=2;
    
    if(yourFirst && yourRemove) {
      yourParent.removeChild(document.getElementById(yourHand.length));
      yourFirst = false;
    }
    
    else if(yourRemove) {
      for(var i = 0; i < yourHand.length; i++) {
        yourParent.removeChild(document.getElementById(i));
      }
    }
    
    for(var i = 0; i < yourHand.length; i++) {
      var card = document.createElement("img");
      yourParent.appendChild(card);
      card.setAttribute("src", "../images/PlayingCards/"+yourHand[i].toString()+".png");
      card.id=i;
      card.alt=yourHand[i].toString();
      card.style.position="absolute";
      card.style.left=(i*15)+"px";
      card.style.top="0px";
      card.style.width="71px";
      card.style.height="96px";
      card.style.zIndex=i;
      card.addEventListener("click",playerCard,false);
    }
    
    while(document.getElementById(yourHand.length) != null) {
      yourParent.removeChild(document.getElementById(yourHand.length));
      while(document.getElementById(yourHand.length+1) != null) {
        yourParent.removeChild(document.getElementById(yourHand.length+1));
      }
    }
    
    // Remove Dealer Cards.
    
    if(myFirst && myRemove) {
      myParent.removeChild(document.getElementById(myHand.length+50));
      myFirst = false;
    }
    
    else if(myRemove) {
      for(var i = 0; i <= myHand.length; i++) {
        myParent.removeChild(document.getElementById(i+50));
      }
    }
    
    while(document.getElementById(myHand.length+50) != null) {
      myParent.removeChild(document.getElementById(myHand.length+50));
      while(document.getElementById(myHand.length+51) != null) {
        myParent.removeChild(document.getElementById(myHand.length+51));
      }
    }
    
    for(var i = 0; i < myHand.length; i++) {
      var card = document.createElement("img");
      myParent.appendChild(card);
      card.setAttribute("src", "../images/PlayingCards/back.png");
      card.id=i+50;
      card.alt="Card back";
      card.style.position="absolute";
      card.style.left=(i*15)+"px";
      card.style.top="0px";
      card.style.width="71px";
      card.style.height="96px";
      card.style.zIndex=i;
    }
  }
  
  function playerCard(event) {
    var id = event.target.id;
    if(id == 'p' || id == "discard") {
      move = 'p';
      finish(move);
    }
    else if(id == null) {}
    else {
      move = (yourHand[id].toString());
      finish(move);
    }
  }
  
  function doNothing() {}
  
  /*
   * canPlay() returns true if the given Card can be played on the
   * current discard pile and false otherwise.
   */
  function canPlay(thisCard) {
    var success = false;
    var topCard = discardPile.topCard();
    
    if (thisCard != null) {
      // If top card is 8, can only play if match named suit or play an 8
      if (topCard.number == 8) {
          success = (thisCard.suit == wildSuit) ||
          (thisCard.number == 8);
      }
      else {
        success = (thisCard.suit == topCard.suit) ||
          (thisCard.number == topCard.number) ||
          (thisCard.number == 8);
      }
    }
    return success;
  }
  /*
   * newDrawPile() creates a new shuffled draw pile from the cards under the
   * top card of the discard pile.
   */
  function newDrawPile() {
    deck = discardPile;
    discardPile = Cards();
    discardPile.push(deck.pop());
    deck.shuffle();
    return;
  }
  
// ADD YOUR CODE AFTER THIS LINE
  
  /***** Card constructor ******/
  /* 
   *  Each instance of Card represents a single playing card.
   *  The constructor takes three arguments and stores them
   *     as the following properties:
   *        suit is 'c', 'd', 'h', or 's'
   *        number is 2 through 10, 'j', 'q', 'k', or 'a'
   *        order is a Number that is used to sort the cards in order
   *  Every instance of Card also has two methods:
   *    toString(): returns a String representing the card in
   *                human-readable form (number immediately followed by suit)
   *    valueOf(): returns a Number representing the sort order of
   *               the card.
   */
  
  /* Constructor */
  function Card(suit, number, order) {
    "use strict";
    this.suit = suit;
    this.number = number;
    this.order = order;
    /* 
     *  Method toString() returns a String representing the card in
     *  human-readable form
     */
    this.toString =
      function toString() {
      return this.number + this.suit;
    };
    /*
     * Method valueOf() returns a Number representing the sort order of
     * the card.
     */
    this.valueOf = 
      function valueOf() {
      return this.order;
    };
    
    // Freeze object before returning.
    Object.freeze(this);
  }
  
  /******** Cards factory **********/
  /* 
   Each instance created by Cards represents a collection of playing cards,
   stored as an array of Card objects.
   The factory takes no arguments and creates an object that inherits
   Array methods.
   It adds several additional methods:
   topCard() : returns a reference to the top Card (last element of 
   the array).  The array is unchanged.
   getCard(Number): removes the Card at the location specified from
   the array and returns it, or returns
   null if no Card is present at that location.
   Array is modified to "close" gap left by missing Card.
   indexOf(String): returns array index of Card matching given string, 
   or -1 if Card having this string value is not present.
   findCard(String): returns a reference to Card with toString() value 
   matching given string, or null if Card having this string value is 
   not present in array.  The array is unchanged.
   shuffle(): randomly shuffles the Card instances in the array.
   sortCards(): sorts the Card instances into ascending order based on
   sort order.
   */    
  function Cards() {
    "use strict";
    
    // Construct the object
    var cards = Object.create(Array.prototype,
                              { 
      // Return card at end of array (without changing array).
      topCard: {value:
        function () {
        return this[this.length-1];
      } 
      },
      
      // Remove and return card at given location.
      getCard: {value:
        function (cardLoc) {
        var theCard = null;  // Default value; indicates failure
        if (0 <= cardLoc && cardLoc < this.length) {
          
          // Note that splice() returns an array, even if there is
          // only one element in the array.  We want the element, not
          // the array, which is why the [0] appears.
          theCard = this.splice(cardLoc,1)[0];
        }
        return theCard;
      }
      },
      
      // Return index of card matching given string, or -1 if
      // not present.
      indexOf: {value: 
        function (move) {
        var loc = -1;
        for (var i=0; i<this.length && loc < 0; i++) {
          if (move == this[i].toString()) {
            loc = i;
          }
        }
        return loc;
      } 
      },
      
      // Return card matching given string, or null if not present.
      findCard: {value:
        function (move) {
        var loc = this.indexOf(move);
        return loc<0 ? null : this[loc];
      } 
      },
      
      // Randomly shuffle the cards.
      shuffle: {value:
        function () {
        for (var i=1; i<this.length; i++) {
          var nMinusi = this.length - i;
          var ri = Math.floor(Math.random()*(nMinusi+1));
          var tmp = this[ri];
          this[ri] = this[nMinusi];
          this[nMinusi] = tmp;
        }
        return;
      } 
      },
      
      // Sort the cards in ascending order according to the 
      // value (sort order) of Card.
      sortCards: {value:
        function () {
        var compareCards = 
          function (first, second) {
          return first.valueOf() - second.valueOf();
        };
        this.sort(compareCards);
        return;
      } 
      }
    });
    
    // return constructed object
    return cards;
  }
