/* === Generic Helper Stuff (can be reused) === */

var GameHelperClass = function () {
     this.getRandomNumber = function (min, max) {
          return Math.floor(Math.random() * (max - min + 1) + min);
     }
};
window.gameHelper = new GameHelperClass();


/* === Conspiracy Clicker Game === */

var CCGameClass = function () {
     this.isLooping = false;
     this.loopTimer = 0;
     this.loopIteration = 0;
     this.lastTime = 0;
     // Constants
     this.loopDelay = 10;
     // 1000 = 1 second
     // 100 = 1/10th of a second
     // 10 = 1/100th of a second (better than 60 fps)
     this.secondsPerLoop = (this.loopDelay / 1000);
     // Update certain things once every X iterations
     // 10 ==> once per second
     this.loopModulus = 10;
     this.totalPopulation = 314000000;

     // Static Data
     this.data = {	// Get from JSON data
          "upgrades": {}
          , "groups": {}
     };
     // Game Data
     this.owned = {
          "upgrades": {
               //"tier01" : [], "tier02" : [], "tier03" : []
          }
     };

     // Constants, Lookups
     this.sectorArray = ["tier01", "tier02", "tier03"];
     this.valueTypes = ["tier01Money", "tier02Money", "tier03Money"];
     this.shortDisplayValueTypes = {
          "tier01Money": "$"
          , "tier02Money": "$"
          , "tier03Money": "$"
     };
     this.displayValueTypes = {
          "tier01Money": "tier01 $"
          , "tier02Money": "tier02 $"
          , "tier03Money": "tier03 $"
     };
     // Game Data
     this.total = {
          tier01Money: 0
          , tier02Money: 0
          , tier03Money: 0
     };
     this.perSecond = {
          //tier01Money	: 0
          //,tier02Money	: 0
          //,tier03Money	: 0
     };
     this.perClick = {
          //tier01Money	: 1
          //,tier02Money	: 1
          //,tier03Money	: 1
     };
     this.flow = {
          "from": ""
          , "to": ""
          , "baseSpeed": 1
          , "percentSpeed": 0.005
          , "efficiency": 0.75
     };


     //=============================================== MAIN LOOP

     this.loop = function () {
          var o = this;
          console.log("loop");

          o.total.tier01Money += (o.perSecond.tier01Money * o.secondsPerLoop);
          //o.total.tier02Money += ((o.perSecond.tier02Money) * o.secondsPerLoop);
          //o.total.tier03Money += ((o.perSecond.tier03Money) * o.secondsPerLoop);

          if (o.total.tier01Money < 0) o.total.tier01Money = 0;
          //if (o.total.tier02Money < 0) o.total.tier02Money = 0;
          //if (o.total.tier03Money < 0) o.total.tier03Money = 0;

          o.displayNumber(o.total.tier01Money, o.$tier01MoneyVal);
          //o.displayNumber(o.total.tier02Money, o.$tier02MoneyVal);
          //o.displayNumber(o.total.tier03Money, o.$tier03MoneyVal);

          // Update these only every second or so...
          if ((o.loopIteration % o.loopModulus) == 0) {
               o.calculateCoreValues();
               o.displayPerSecondNumbers();
               // Per click...
               o.displayNumber(o.perClick.tier01Money, o.$tier01MoneyPerClickVal);
               //o.displayNumber(o.perClick.tier02Money, o.$tier02MoneyPerClickVal);
               //o.displayNumber(o.perClick.tier03Money, o.$tier03MoneyPerClickVal);
          } else if (((o.loopIteration + 1) % o.loopModulus) == 0) {
               //o.displayProgress();
               o.updateUpgradeAfford();
          } else if (((o.loopIteration + 2) % o.loopModulus) == 0) {
               if (o.flow.from != "" && o.flow.to != "") {
                    var flowSpeed = o.flow.baseSpeed + (o.flow.percentSpeed * o.total[o.flow.from]);
                    if (o.total[o.flow.from] >= flowSpeed) {
                         o.total[o.flow.from] -= flowSpeed;
                         o.total[o.flow.to] += (flowSpeed * o.flow.efficiency);
                    }
               }
          }


          if (o.isLooping) {
               o.loopIteration++;
               if (o.loopIteration < 15000000) {
                    o.loopTimer = window.setTimeout(function () {
                         o.loop();
                    }, o.loopDelay);

               }
          }
     };

     this.startLoop = function () {
          this.loopIteration = 0;
          this.isLooping = true;
          this.loop();
     };

     this.stopLoop = function () {
          this.loopIteration = 0;
          this.isLooping = false;
          clearTimeout(this.loopTimer);
     };


     //=============================================== OUTPUT DISPLAY

     this.displayPerSecondNumbers = function () {
          // Per second...
          this.displayNumber(this.perSecond.tier01Money, this.$tier01MoneyPerSecondVal);
          //this.displayNumber(this.perSecond.tier02Money, this.$tier02MoneyPerSecondVal);
          //this.displayNumber(this.perSecond.tier03Money, this.$tier03MoneyPerSecondVal);
     };

     this.displayPerClickNumbers = function () {

     };

     this.displayNumber = function (n, $elt) {
          //console.log($elt);
          $elt.html(this.getDisplayNumber(n));
     };

     this.getDisplayNumber = function (n) {
          if (n >= 5) n = parseInt(n);
          else n = Math.round(n * 10) / 10;
          return n.toLocaleString('en');
     };

     this.writeUpgrades = function () {
          for (var sector in this.owned.upgrades) {
               this.writeUpgradesForSector(sector);
          }
     };

     this.writeUpgradesForSector = function (sector) {
          var h = "";
          var sectorUpgrades = this.owned.upgrades[sector];
          for (var ugi in sectorUpgrades) {
               var upgradeCount = sectorUpgrades[ugi];
               var upgrade = this.data.upgrades[sector][ugi];
               var canAfford = this.canAffordUpgrade(sector, ugi);

               h += '<li class="upgrade clearfix flip ug-' + ugi;
               if (canAfford) {
                    h += ' afford ';
               } else {
                    h += ' cannotAfford ';
               }
               if (upgradeCount > 0) {
                    h += ' owned ';
               } else {
                    h += ' notOwned ';
               }
               h += '" '
                    + ' data-ugi="' + ugi + '" '
                    + ' data-sector="' + sector + '" '
                    + '>'
                    + '<div class="front">'
                    + '<div class="name">' + upgrade.name + '</div>'

                    + '<button type="button" class="buy"><div class="buyText">Buy</div>'
               ;
               for (var valueType in upgrade.baseCost) {
                    var finalCost = this.calcCost(upgrade, upgradeCount, valueType);
                    h += '<div class="cost val">'
                         + this.getDisplayNumber(finalCost)
                         + ' ' + this.shortDisplayValueTypes[valueType]
                         + '</div>'
                    ;
               }
               h += '</button>'
                    + '<div class="count">' + upgradeCount + '</div>'
                    + '</div>' // endof front
                    + '<div class="back">'
               ;
               if (typeof upgrade.details === 'string') {
                    h += '<div class="details">' + upgrade.details + '</div>';
               }
               if (typeof upgrade.perSecond === 'object') {
                    h += '<ul class="">';
                    for (var valueType in upgrade.perSecond) {
                         h += '<li>'
                              + ((upgrade.perSecond[valueType] > 0) ? "+" : "")
                              + this.getDisplayNumber(upgrade.perSecond[valueType])
                              + ' ' + this.displayValueTypes[valueType]
                              + '/sec'
                              + '</li>'
                         ;
                    }
                    h += '</ul>';
               }
               h += '</div>' // endof back
                    + '</li>'
               ;
          }
          if (typeof this.$upgradeLists[sector] !== 'undefined') {
               this.$upgradeLists[sector].html(h);
               this.addFlipCardEvents(this.$upgradeLists[sector]);
          }
     };

     this.updateUpgradeAfford = function () {
          for (var sector in this.owned.upgrades) {
               var sectorUpgrades = this.owned.upgrades[sector];
               for (var ugi in sectorUpgrades) {
                    var $upgrade = $('section.' + sector + ' .ug-' + ugi);
                    var upgradeCount = sectorUpgrades[ugi];
                    if (upgradeCount > 0) {
                         $upgrade.addClass("owned").removeClass("notOwned");
                    } else {
                         $upgrade.addClass("notOwned").removeClass("owned");
                    }
                    var canAfford = this.canAffordUpgrade(sector, ugi);
                    if (canAfford) {
                         $upgrade.addClass("afford").removeClass("cannotAfford");
                    } else {
                         $upgrade.addClass("cannotAfford").removeClass("afford");
                    }
               }
          }
     };


     //=============================================== Numbers

     this.tier01Click = function () {
          this.total.tier01Money += this.perClick.tier01Money;
     };

     this.tier02Click = function () {
          this.total.tier02Money += this.perClick.tier02Money;
          //this.total.votes += this.perClick.votes;
     };

     this.tier03Click = function () {
          this.total.tier03Money += this.perClick.tier03Money;
          //this.total.minds += this.perClick.votes;
     };


     this.setDefaults = function () {
          this.perSecond = {
               tier01Money: 0
               , tier02Money: 0
               , tier03Money: 0
          };
          // Count the number of upgrades
          var totalUpgradeCount = 0;
          var upgradeCounts = {"tier01": 0, "tier02": 0, "tier03": 0};
          for (var s in this.sectorArray) {
               var sector = this.sectorArray[s];
               var sectorUpgrades = this.owned.upgrades[sector];
               for (var ugi in sectorUpgrades) {
                    upgradeCounts[sector] += sectorUpgrades[ugi];
                    totalUpgradeCount += sectorUpgrades[ugi];
               }
          }
          this.perClick = {
               tier01Money: (1.0 + (upgradeCounts.tier01 / 5))
               //, tier02Money: (1.0 + (upgradeCounts.tier02 / 5))
               //, tier03Money: (1.0 + (upgradeCounts.tier03 / 5))
          };
          this.flow.baseSpeed = 1.0 + (totalUpgradeCount / 20);
          return true;
     };


     this.calculateCoreValues = function () {
          this.setDefaults();


          for (var sector in this.owned.upgrades) {
               var sectorUpgrades = this.owned.upgrades[sector];
               for (var ug in sectorUpgrades) {
                    var upgradeQuantity = sectorUpgrades[ug];
                    if (upgradeQuantity > 0) {
                         var upgrade = this.data.upgrades[sector][ug];
                         if (typeof upgrade.perSecond === 'object') {
                              // Loop through all types and see if the upgrade has values
                              for (var vti in this.valueTypes) {
                                   var valueType = this.valueTypes[vti];
                                   if (typeof upgrade.perSecond[valueType] === 'number') {
                                        this.perSecond[valueType] += (upgradeQuantity * upgrade.perSecond[valueType]);
                                   }
                              }
                         }
                         if (typeof upgrade.perClick === 'object') {
                              // Loop through all types and see if the upgrade has values
                              for (var vti in this.valueTypes) {
                                   var valueType = this.valueTypes[vti];
                                   if (typeof upgrade.perClick[valueType] === 'number') {
                                        this.perSecond[valueType] += (upgradeQuantity * upgrade.perClick[valueType]);
                                   }
                              }
                         }
                    }
               }
          }

     };

     this.buyUpgrade = function (sector, upgradeIndex, doWriteUpgrades) {
          console.log("buyUpgrade " + sector + ", " + upgradeIndex);
          var upgrade = this.data.upgrades[sector][upgradeIndex];
          if (this.canAffordUpgrade(sector, upgradeIndex)) {
               // The amount before the purchase
               var upgradeQuantity = this.owned.upgrades[sector][upgradeIndex];
               // Remove the cost from the totals...
               for (var valueType in upgrade.baseCost) {
                    this.total[valueType] -= this.calcCost(upgrade, upgradeQuantity, valueType);
               }
               // Add the upgrade to owned things
               this.owned.upgrades[sector][upgradeIndex] += 1;

               if (typeof doWriteUpgrades !== 'boolean') doWriteUpgrades = true;
               if (doWriteUpgrades) this.writeUpgrades();
               return true;
          } else {
               //this.notify("Cannot afford this upgrade.");
               return false;
          }
     };

     this.calcCost = function (upgrade, upgradeQuantity, valueType) {
          var finalCost = upgrade.baseCost[valueType];
          finalCost = (finalCost * Math.pow(upgrade.costMultiplier, upgradeQuantity));
          return finalCost;
     };

     this.canAffordUpgrade = function (sector, upgradeIndex) {
          var upgrade = this.data.upgrades[sector][upgradeIndex];
          var upgradeQuantity = this.owned.upgrades[sector][upgradeIndex];
          // Loop over all value types and compare to current totals
          if (typeof upgrade.baseCost === 'object' &&
               typeof upgrade.costMultiplier === 'number') {
               for (var vti in this.valueTypes) {
                    var valueType = this.valueTypes[vti];
                    if (typeof upgrade.baseCost[valueType] === 'number') {
                         var finalCost = this.calcCost(upgrade, upgradeQuantity, valueType);
                         if (this.total[valueType] < finalCost) {
                              return false;
                         }
                    }

               }
          } else {
               console.error("Upgrade (" + sector + ", " + upgrade + ") is missing baseCost or costMultiplier");
               return false;
          }
          return true;
     };


     //=============================================== SETUP & LAUNCH

     this.notify = function (t) {
          console.warn(t);
          //alert(t);
     };

     this.addFlipCardEvents = function ($elt) {
          console.log("Adding flipcard events");
          if (typeof $elt === 'undefined') {
               var $base = $('.flip');
          } else {
               var $base = $elt.find('.flip');
          }
          $base.off("click").click(function () {
               var $flipcard = $(this);
               if ($flipcard.hasClass("flipped")) {
                    $flipcard.removeClass('flipped');
               } else {
                    $flipcard.addClass('flipped');
               }
          });
     };

     this.setup = function () {
          var o = this;
          var ajaxGetData = {};


          $.ajax({
               type: "get"
               , url: "js/clicker.json"
               , dataType: "json"
               , complete: function (x, t) {
               }
               , success: function (responseObj) {
                    try {
                         //var responseObj = $.parseJSON(response);
                         o.data.upgrades = responseObj.upgrades;
                         o.data.groups = responseObj.groups;
                         console.log("Ajax Success loading data");
                    } catch (err) {
                         o.notify("ERROR IN JSON DATA");
                         console.log(responseObj);
                    }
                    // Loop through upgrade data and setup default ownership
                    for (sector in o.data.upgrades) {
                         o.owned.upgrades[sector] = [];
                         for (ug in o.data.upgrades[sector]) {
                              o.owned.upgrades[sector][ug] = 0;
                         }
                    }

               }
               , failure: function (msg) {
                    console.log("Fail\n" + msg);
               }
               , error: function (x, textStatus, errorThrown) {
                    console.log("Error\n" + x.responseText + "\nText Status: " + textStatus + "\nError Thrown: " + errorThrown);
               }
          });


          //=========== Setup UI

          var tier01Clicker = $('.tier01 .js-click-button');
          //var tier02Clicker = $('section.tier02 .clicker');
          //var tier03Clicker = $('section.tier03 .clicker');
          o.$tier01MoneyVal = $('.tier01 .money .val');
          o.$tier01MoneyPerClickVal = $('section.tier01 .profitPerClick .val');
          o.$tier01MoneyPerSecondVal = $('section.tier01 .profitPerSecond .val');

          //o.$tier02MoneyVal = $('section.tier02 .money .val');
          //o.$tier02MoneyPerClickVal = $('section.tier02 .profitPerClick .val');
          //o.$tier02MoneyPerSecondVal = $('section.tier02 .profitPerSecond .val');

          //o.$tier03MoneyVal = $('section.tier03 .money .val');
          //o.$tier03MoneyPerClickVal = $('section.tier03 .profitPerClick .val');
          //o.$tier03MoneyPerSecondVal = $('section.tier03 .profitPerSecond .val');

          tier01Clicker.click(function (e) {
               o.tier01Click();
          });

          /*
          tier02Clicker.click(function (e) {
               o.tier02Click();
          });
          tier03Clicker.click(function (e) {
               o.tier03Click();
          });
          */

          $('.save').click(function (e) {
               o.saveGame(true);
          });
          $('.load').click(function (e) {
               o.loadGame();
          });
          $('.delete').click(function (e) {
               o.deleteGame(true);
               if (confirm("Reload page to start a new game?")) {
                    window.location.reload(true);
               }
          });
          $('.toggleSound').click(function (e) {
               var x = o.toggleSound();
               o.notify("Sound turned " + ((x) ? "ON" : "OFF"));
          });

          /* Intro */
          $('.openGame').click(function (e) {
               $(this).fadeOut(200);
               $('section.walkthru').fadeOut(1000, function () {
                    o.saveGame();
                    o.loadGame(true);
               });
          });

          o.$upgradeLists = {};

          $('.metrics').click(function (e) {
               $(this).find('.perClick').toggle(300);
          });

          for (var s in o.sectorArray) {
               (function (sector) {
                    o.$upgradeLists[sector] = $('section.' + sector + ' ul.upgradeList');
                    //console.log("Adding click event to List for sector: " + sector);
                    //console.log(o.$upgradeLists[sector]);

                    o.$upgradeLists[sector].on("click", function (e) {

                         var $target = $(e.target);
                         var $ugli = $target.closest('li.upgrade');
                         //console.log("List Clicked - sector: " + sector);
                         //console.log($ugli);

                         if ($target.hasClass("buy") || $target.parent().hasClass("buy")) {
                              var upgradeIndex = $ugli.data("ugi");
                              o.buyUpgrade(sector, upgradeIndex);
                         } else {
                              //$ugli.find('.details').toggle();
                         }
                         e.stopPropagation();
                    });
               }(o.sectorArray[s]));
          }

          // Scroll Event
          var $win = $(window);
          var $3cols = $('.threeCols');
          $win.scroll(function () {
               var height = $win.scrollTop();
               console.log(height);
               if (height > 550) {
                    $3cols.addClass("fixed");
               } else {
                    $3cols.removeClass("fixed");
               }
          });


          $('.stopLoop').click(function (e) {
               o.stopLoop();
          });
          $('.startLoop').click(function (e) {
               o.startLoop();
          });

          //$('.upgradeList > li').click(function(e){	o.buyUpgrade(1); });


          //=========== Launch!
          var launchTimer = window.setTimeout(function () {
               o.launch(0);
          }, 250);
     };

     this.launch = function (iteration) {
          var o = this;
          iteration++;
          if (Object.keys(o.data.upgrades).length > 0) {
               console.log("Launching Game!");
               o.loadGame(true);
          } else if (iteration < 40) {
               console.log("Launch... Cannot start yet. " + iteration);
               var launchTimer = window.setTimeout(function () {
                    o.launch(iteration);
               }, 250);
          } else {
               o.notify("Cannot launch game.");
          }
     };

     this.saveGame = function (showNotice) {
          localStorage.setItem("owned", JSON.stringify(this.owned));
          localStorage.setItem("total", JSON.stringify(this.total));
          localStorage.setItem("isSoundOn", JSON.stringify(this.isSoundOn));

          if (typeof showNotice === 'boolean') {
               if (showNotice) this.notify("Game has been saved to this browser. Your game will be automatically loaded when you return.");
          }
     };

     this.deleteGame = function () {
          localStorage.removeItem("owned");
          localStorage.removeItem("total");
          this.notify("Saved game deleted!");
     };

     this.loadGame = function (isStartLoop) {
          var o = this;
          var isLoaded = false;
          // Load game data (two objects)
          var loadedOwned = localStorage.getItem("owned");
          if (loadedOwned !== null) {
               o.owned = JSON.parse(loadedOwned);
               isLoaded = true;
          }
          var loadedTotal = localStorage.getItem("total");
          if (loadedTotal !== null) {
               o.total = JSON.parse(loadedTotal);
               isLoaded = true;
          }
          var loadedSound = localStorage.getItem("isSoundOn");
          if (loadedSound !== null) {
               o.isSoundOn = JSON.parse(loadedSound);
          }

          $('body > header').fadeIn(5000);
          if (!isLoaded) {
               $('.intro').fadeIn(1000);
          } else {
               o.calculateCoreValues();
               o.writeUpgrades();
               //o.addFlipCardEvents();
               $('.metrics').slideDown(1000);
               $('footer').slideDown(3000);
               $('.progress').show(2000);
               $('.threeCols').fadeIn(2000, function () {
                    if (isStartLoop) {
                         o.startLoop();
                    }
               });
          }
     };


     //========================================= Construction
     if (!window.localStorage) {
          alert("This browser does not support localStorage, so this app will not run properly. Please try another browser, such as the most current version of Google Chrome.");
     }
     if (!window.jQuery) {
          alert("ERROR - jQuery is not loaded!");
     }
}
