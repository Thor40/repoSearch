var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");
// button div with id selector so we dont make one for each button
var languageButtonsEl = document.querySelector("#language-buttons");

var getUserRepos = function(user) {
    //format the gitbuh api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    // make a request to the url
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
        response.json().then(function(data) {
            displayRepos(data, user);
        });
        } else {
            alert("Error: " + response.statusText);
        }
    })
    .catch(function(error) {
        //Notice this `.catch()` getting chained onto the end of the `.then()` method
        alert("Unable to connect to GitHub");
    });
};

var displayRepos = function(repos, searchTerm) {
    //check if api retuned any repos
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found.";
        return;
    }

    // clear old content
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;

    console.log(repos);
    console.log(searchTerm);

    // loop over repos
    for (var i = 0; i < repos.length; i++) {
        //format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        //create a container for each repo
        var repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);

        //create a span element to hold repository name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        //append to container
        repoEl.appendChild(titleEl);

        //create status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        //check if current repo has issues or not
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML = "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }  
    // append to container
    repoEl.appendChild(statusEl);

    //append container to the dom
    repoContainerEl.appendChild(repoEl);
    }
};

var formSubmitHandler = function(event) {
    event.preventDefault();

    // get value from input element
    var username = nameInputEl.value.trim();

    if(username) {
        getUserRepos(username);
        nameInputEl = "";
    } else {
        alert("Please enter a GitHub username");
    }
    console.log(event);
};

var getFeaturedRepos = function(language) {
    var apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";
  // fetch response from URL
    fetch(apiUrl).then(function(response) {
        //if response is ok, return HTTP
        if(response.ok) {
            // extract JSON from response
            response.json().then(function(data) {
                displayRepos(data.items, language);
            });
        } // error handling if bad response
        else {
            alert("Error: " + response.statusText);
        }
    });
};

// event click handler for buttons
var buttonClickHandler = function(event) {
    //get the attribute of each button
    var language = event.target.getAttribute("data-language");

    if(language) {
        //push language into get repo function
        getFeaturedRepos(language);

        //clear old content
        repoContainerEl.textContent = "";
    }
    console.log(language);
}

userFormEl.addEventListener("submit", formSubmitHandler);
//even listener for language button
languageButtonsEl.addEventListener("click", buttonClickHandler);