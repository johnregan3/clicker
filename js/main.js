(function($) {

     var autoClick;

     function addCommas(number) {
          return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
     }

     function businessClick(parent) {
          parent = $(parent);
          var bucks = $(".bucks");
          var currentBucks = bucks.text();
          currentBucks = parseFloat(currentBucks.replace(',', ''));
          var button = $(".js-click-button", parent);
          var clicks = button.attr("data-clicks");
          currentBucks = parseFloat(currentBucks + parseFloat(clicks)).toFixed(2);
          currentBucks = addCommas(currentBucks);
          bucks.text(currentBucks);
          checkLevelButton();
     }

     function checkLevelButton() {
          var currentBucks = $(".bucks").text();
          $('.business.purchased').each(function() {
               var levelCost = $('.level-cost', this).text();

               var targetButton = $('.buy-level-button', this);
               if( currentBucks < levelCost ){
                    targetButton.attr('disabled', 'disabled').removeClass('btn-primary').addClass('btn-default');
               } else {
                    targetButton.attr('disabled', false).removeClass('btn-default').addClass('btn-primary');
               }
          });
          checkPurchaseable();
     }

     function checkPurchaseable() {
          var currentBucks = $(".bucks").text();
          currentBucks = parseInt(currentBucks);
          console.log('currbux: ' + typeof currentBucks);
          $('.business.not-purchased.next-to-buy').each(function() {
               var business = $(this);
               var purchaseCost = $('.purchase-cost', business).text();
               purchaseCost = parseInt(purchaseCost);
               console.log('purchase: ' + typeof currentBucks);
               var targetButton = $('.btn.coming-soon', business);
               if( currentBucks < purchaseCost) {
                    targetButton.attr('disabled', 'disabled').removeClass('btn-success').addClass('btn-default');
               } else {
                    targetButton.attr('disabled', false).removeClass('btn-default').addClass('btn-success buy-it');
                    targetButton.click(function () {
                         buyBusiness(business, targetButton, currentBucks, purchaseCost);
                    });
               }
          });
     }

     function buyBusiness(business, targetButton, currentBucks, purchaseCost) {
          var nextTier = business.closest('.tier').next();
          business.removeClass('not-purchased').addClass('purchased');

          var newBucks = currentBucks - purchaseCost;
          console.log('newBucks: ' + typeof newBucks);
          newBucks = addCommas(newBucks);
          $(".bucks").text(newBucks);

          targetButton.hide();
          $('.interface', business).removeAttr('hidden');
          if (business.hasClass('last-business')) {
               nextTier.removeAttr('hidden');
               var nextBusiness = $('.business:first', nextTier);
               nextBusiness.addClass('next-to-buy').removeAttr('hidden');
          } else {
               business.next().removeAttr('hidden').addClass('next-to-buy');
          }

          //Update the autoClick with the new elements
          startNewAutoClick();
          calcTotalBps();
     }

     function levelUp(parent){

          var bucks = $(".bucks");
          var currentBucks = bucks.text();
          currentBucks = parseInt(currentBucks.replace(',',''), 10);

          var levels = $('.levels', parent);
          var levelCount = levels.text();
          levelCount = levelCount.replace(',','');

          var progressBar = $('.progress-bar', parent);
          var progressBarWidth = 0;

          var button = $(".js-click-button", parent);

          var levelCost = $('.level-cost', parent).text();
          levelCost = parseFloat(levelCost.replace(',','')).toFixed(2); //Don't mess with this

          if(currentBucks >= levelCost){                           //checks that the player can afford the level

               var baseCost = button.attr("data-base-cost");
               baseCost = parseFloat(baseCost).toFixed(2);

               var bonusLevel = button.attr("data-bonus-level");

               var clickCount = button.attr("data-clicks");
               clickCount = parseFloat(clickCount);

               //This ordering is important
               if ( bonusLevel == levelCount ) {
                    var bonusAmount = button.attr("data-bonus-amount");
                    var addBonus = clickCount + parseFloat(bonusAmount);
                    clickCount = parseFloat(addBonus).toFixed(2);
               }

               //This ordering is important
               levelCount = parseInt(levelCount) + 1;                       //increases number of levels
               levelCount = addCommas(levelCount);
               levels.text(levelCount);                           //updates the number of levels for the user


               if ( ( levelCount % 10 ) == 0 ) {
                    progressBarWidth = 0;
               } else if ( levelCount > 100 ) {
                    progressBarWidth = (levelCount.slice(-1) * 100);
               } else if ( levelCount < 10 ) {
                    progressBarWidth = levelCount * 10;
               } else {
                    progressBarWidth = 0;
               }
               console.log(progressBarWidth);
               progressBar.css({'width' : progressBarWidth + '%' });

               //This ordering is important
               if ( bonusLevel == levelCount ) {
                    $('.buy-level-button', parent).removeClass('btn-default').addClass('btn-warning');
               } else {
                    $('.buy-level-button', parent).removeClass('btn-warning').addClass('btn-default');
               }

               var newBucks = currentBucks - levelCost;  //removes the bucks spent
               newBucks = parseFloat(newBucks).toFixed(2); //This is important
               newBucks = addCommas(newBucks);
               bucks.text(newBucks);                             //updates the number of bucks for the user

               var multiplier = Math.pow(1.15, levelCount);
               var nextCost = baseCost * parseFloat(multiplier).toFixed(2);       //works out the cost of the next level

               nextCost = parseFloat(nextCost).toFixed(2);
               nextCost = addCommas(nextCost);
               $('.level-cost', parent).text(nextCost);                     //updates the level cost for the user

               var newClicks = parseFloat(clickCount * 1.33).toFixed(2);
               button.attr("data-clicks", newClicks);
               $('.bps', parent).text(parseFloat(newClicks).toFixed(2));

               checkLevelButton();  //This makes sure the level button gets disabled if necessary.
               startNewAutoClick();
               calcTotalBps();
           }
     }

     function startNewAutoClick() {
          clearInterval(autoClick);

          autoClick = setInterval(function(){
               $('.business').each(function() {
                    if ($(this).hasClass('purchased')) {
                         businessClick(this);
                    }
               });
          }, 1000);
     }

     function calcTotalBps() {
          var elems = $('body').find('.business.purchased');
          var elemCount = elems.length;
          var total = 0;

          elems.each(function (a, element) {
               var count = $('.bps', this).text();
               count = parseFloat(count);
               total = total + count;
               if ( !--elemCount ) {
                    $('.main-bps').text(parseFloat(total).toFixed(2));
               }
          });
     }


     $(document).ready(function() {

          /*
          var startColor = '.fff';
          var endColor = '.7285F3';

          var circle = new ProgressBar.Circle('.circle-container', {
               color: '.555',
               strokeWidth: 20,
               fill: '.fff',
               duration: 1200,
               text: {
                    value: '0'
               },
               // Set default step function for all animate calls
               step: function(state, circle) {
                    circle.path.setAttribute('stroke', state.color);
                    circle.setText((circle.value() * 100).toFixed(0));
               }
               /*
               step: function(state, bar) {
                    bar.setText((bar.value() * 100).toFixed(0));
               }

          });

          setInterval(
               function() {
                    circle.animate(1,
                         {
                              from: {color: startColor},
                              to: {color: endColor}
                         },
                         function() {
                              circle.set(0);
                         });
               }, 1400);
          */

          startNewAutoClick();

          $('.business').each(function() {
               $('.buy-level-button', this).on( 'click', function() {
                    var parent = $(this).closest('.business');
                    levelUp(parent);
               });
               $(".js-click-button", this).on( 'click', function() {
                    var parent = $(this).closest('.business');
                    businessClick(parent);
               });
          });


     });

})(jQuery);