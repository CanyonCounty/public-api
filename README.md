Canyon County Public API
========================

Demo code of our soon to be released public api.


Usage
-----
Just add the cc.js to your project
```
 <script src="scripts/cc.js"></script>
```

Then call the methods. The only parameter is the container you would like the results appended to.

```
  <script>
    cc.getElectionResultSummary("#elecionSummaryContainer");
    cc.getElectionResultDetails("#electionDetails");
  </script>
```


Currently Supported
-------------------
 - cc.getElectionResultSummary - Returns a summary of election result information (last updated, precinct complete count, ballot count, etc).
 - cc.getElectionResultDetails - Returns the actuall results. Party, Contest, Contest Choices, Counts, Percentages, etc).
