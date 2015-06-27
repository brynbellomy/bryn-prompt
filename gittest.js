var nodegit = require("nodegit"),
    path = require("path");

// This code shows working directory changes similar to git status
var resolved = path.resolve(process.cwd(), process.argv[2])
console.log('resolved', resolved)
nodegit.Repository.open(resolved)
  .then(function(repo) {
    console.log(repo)
    // console.log('opened', repo)
    return repo.getStatus().then(function(statuses) {
      // console.log('statuses', statuses)
      function statusToText(status) {
        var words = [];
        if (status.isNew()) { words.push("NEW"); }
        if (status.isModified()) { words.push("MODIFIED"); }
        if (status.isTypechange()) { words.push("TYPECHANGE"); }
        if (status.isRenamed()) { words.push("RENAMED"); }
        if (status.isIgnored()) { words.push("IGNORED"); }

        return words.join(" ");
      }

      statuses.forEach(function(file) {
        console.log(file.path() + " " + statusToText(file));
      });
    });
});