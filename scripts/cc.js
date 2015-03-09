/*jslint browser:true*/
/*global $, jQuery, alert*/
var cc = (function () {
  "use strict";

  if (!window.jQuery) {
    alert('jQuery is not defined - you need to do that first!');
  }
  var electionStyleLoaded = false,
    baseURL = "http://api.canyonco.org";

  /* Helper functions */
  function capitalizeFirstLetter(word) {
    var first = word[0] || "",
      rest = word.substring(1);

    return first.toUpperCase() + rest;
  }

  function partyTabName(word) {
    word = word.toLowerCase() || "results";
    return capitalizeFirstLetter(word.split(' ')[0]);
  }

  function partyLinkName(word) {
    word = word.toLowerCase() || "results";
    return word.substring(0, 3);
  }

  function loadElectionStyle() {
    if (!electionStyleLoaded) {
      // Load up the stylesheet
      $('<link/>', {rel: 'stylesheet', href: 'stylesheets/electionStyle.css'}).appendTo('head');
      electionStyleLoaded = true;
    }
  }

  function drawChoices(data, div) {
    $.each(data.Choices, function (index, row) {
      //if (!isNaN(parseInt(row.VoteCount))) {
      var name = row.Name,
        voteCount = parseInt(row.VoteCount, 10) || 0,
        percentage = row.Percentage || 0.00,
        col1 = $('<div/>', {'text': row.Name}),
        col2 = $('<div/>', {'text': voteCount.toLocaleString()}),
        col3 = $('<div/>', {'text': percentage}),
        sub = $("<div>", {attr: {'class': 'detail-row'}});

      col1.addClass('detail choice');
      col2.addClass('detail votecount');
      col3.addClass('detail percentage');

      col1.appendTo(sub);
      col2.appendTo(sub);
      col3.appendTo(sub);
      sub.appendTo(div);
      //}
    });
  }

  function drawContests(data) {
    var partyTab = "#" + partyLinkName(data.PartyName);
    $.each(data.Contests, function (index, row) {
      var h2 = $('<h2/>', {'text': row.Name}),
        div = $("<div>", {"html": h2}).attr('class', 'contest clearfix');
      h2.addClass('contest');
      drawChoices(row, div);
      div.appendTo(partyTab);
    });
  }

  function drawParty(data, index) {
    if (data) {
      var cls = (index === 0) ? "active" : "",
        link = $("<a>", {'href': "#" + partyLinkName(data.PartyName), 'text': partyTabName(data.PartyName)});

      $("<li>", {'html': link}).addClass(cls).appendTo("#election-party-tabs");

      // content...
      $("<div>").attr('id', partyLinkName(data.PartyName)).addClass("tab " + cls).appendTo("#election-party-content");
    }
  }

  function drawResults(data) {
    $.each(data.Results, function (index, row) {
      drawParty(row, index);
      drawContests(row);
    });
  }

  function getElectionResultSummary(div) {
    var container = $(div);
    if (container !== undefined) {
      $.ajax(baseURL + "/Election/ElectionResultSummary", {
        success: function (data) {
          if (!data.Error) {
            // We're good to go, start creating things
            var idiv = $('<div>', {
              id: 'electionTitle'
            }).appendTo(container);

            $('<h2>', {
              text: "Election Results"
            }).appendTo(idiv);
            $(idiv).append('<h3>Last Update <br /><span id="updated">0</span></h3>');

            idiv = $('<div>', {
              id: 'electionSummary'
            }).appendTo(container);

            $(idiv).append('<div class="electionLabels" id="label1">Precincts<br />Completed <span id="complete">0 of 0</span></div>');
            $(idiv).append('<div class="electionLabels" id="label2">Ballots<br />Counted <span id="counted">0</span></div>');

            // update the data
            $("#election").text(data.ElectionName + ' - ' + data.ElectionDate);
            $("#updated").text(data.LastUpdated);
            $("#voting").text(data.TotalVoters);
            $("#counted").text(data.BallotsCounted);
            $("#turnout").text(data.VoterTurnout);
            $("#complete").html('<span id="totalcounted">' + data.PrecinctsComplete.replace(' ', '</span> '));

            loadElectionStyle();
          } else {
            alert("Result Summary Error: " + JSON.stringify(data.Error));
            // Don't need to hide anymore, nothing there
            //$(div).hide();
          }
        },
        error: function (err) {
          alert("Error: " + err.responseText);
        }
      });

    } else {
      alert("could not find element " + div);
    }
  }

  function getElectionResultDetails(div) {
    var container = $(div);
    if (container !== undefined) {
      $.ajax(baseURL + "/Election/ElectionResultDetails", {
        success: function (data) {
          if (!data.Error) {
            // We're good to go, start creating things
            var idiv = $('<div>', {
              id: 'div-tabs'
            }).addClass('electionTabs').appendTo(container);

            $(idiv).append('<ul id="election-party-tabs" class="electionTab-links"></ul>');

            $('<div>', {
              id: 'election-party-content'
            }).addClass('electionTab-content').appendTo(container);

            drawResults(data);

            // Add our click event handler
            $(".electionTabs .electionTab-links a").on("click", function (e) {
              var t = $(this).attr("href");
              $(t).fadeIn(400).siblings().hide();
              $(this).parent("li").addClass("active").siblings().removeClass("active");
              e.preventDefault();
            });

            loadElectionStyle();

          } else {
            alert("Result Details Error: " + JSON.stringify(data.Error));
          }
        },
        error: function (err) {
          alert("Error: " + err.responseText);
        }
      });

    } else {
      alert("could not find element " + div);
    }
  }

  return {
    getElectionResultSummary: getElectionResultSummary,
    getElectionResultDetails: getElectionResultDetails
  };

}());
