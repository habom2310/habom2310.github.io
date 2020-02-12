
const showoff = document.getElementById('ShowoffConner');
const repo_icon = '<svg class="octicon octicon-repo mr-2 text-gray flex-shrink-0" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9H3V8h1v1zm0-3H3v1h1V6zm0-2H3v1h1V4zm0-2H3v1h1V2zm8-1v12c0 .55-.45 1-1 1H6v2l-1.5-1.5L3 16v-2H1c-.55 0-1-.45-1-1V1c0-.55.45-1 1-1h10c.55 0 1 .45 1 1zm-1 10H1v2h2v-1h3v1h5v-2zm0-10H2v9h9V1z"></path></svg>'
const fork_icon = '<svg aria-label="fork" class="octicon octicon-repo-forked" viewBox="0 0 10 16" version="1.1" width="10" height="16" role="img"><path fill-rule="evenodd" d="M8 1a1.993 1.993 0 00-1 3.72V6L5 8 3 6V4.72A1.993 1.993 0 002 1a1.993 1.993 0 00-1 3.72V6.5l3 3v1.78A1.993 1.993 0 005 15a1.993 1.993 0 001-3.72V9.5l3-3V4.72A1.993 1.993 0 008 1zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3 10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3-10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"></path></svg>'
const star_icon = '<svg aria-label="stars" class="octicon octicon-star" viewBox="0 0 14 16" version="1.1" width="14" height="16" role="img"><path fill-rule="evenodd" d="M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74L14 6z"></path></svg>'
var sorted_repos;

String.prototype.format = function () {
    var i = 0, args = arguments;
    return this.replace(/{}/g, function () {
        return typeof args[i] != 'undefined' ? args[i++] : '';
    });
};
function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    });
}

function getGitInfo() {
    $.get("https://api.github.com/users/habom2310/repos", function(data, status){
        sorted_repos = sortByKey(data, "stargazers_count");
      });
}

function templateRepo(name, url, desc, stargazers_url, stargazers_count, forks_url, fork_count, language) {
    var res = `
    <div class="Box d-flex p-3">
        <div class="pinned-item-list-item-content">
            <div class="d-flex flex-items-center position-relative">
                {}
            <div>
            <a href="{}" class="text-bold min-width-0 flex-auto">{}</a>
            <p class="pinned-item-desc text-gray text-small d-block mt-2 mb-3">{}</p>
            <p class="mb-0 f6 text-gray">
                <span class="d-inline-block mr-3">
                    <span class="repo-language-color" style="background-color: #3572A5"></span>
                    <span>{}</span>
                </span>
                <a href="{}" class="d-inline-block muted-link">
                    {} {}
                </a>
                <a href="{}" class="d-inline-block muted-link">
                    {} {}
                </a>
            </p>
        </div>
    </div>
    `.format(repo_icon, url, name, desc, language, stargazers_url, star_icon, stargazers_count, forks_url, fork_icon, fork_count);
    
    return res;
}

function fetchRepos() {
    getGitInfo();
    console.log(sorted_repos);
    var repos_html = "";
    for (var i in sorted_repos){
        var url = sorted_repos[i]["html_url"];
        console.log(url)
        var name = sorted_repos[i]["name"].replace("-", " ");
        var desc = sorted_repos[i]["description"];
        var language = sorted_repos[i]["language"];
        var stargazers_url = url + "/stargazers";
        var stargazers_count = sorted_repos[i]["stargazers_count"];
        var forks_url = url + "/fork";
        var forks_count = sorted_repos[i]["forks_count"];
        var repo_html = templateRepo(name, url, desc, stargazers_url, stargazers_count, forks_url, forks_count, language);
        var column_html = `<div class="row">
        {}
        </div>
        `.format(repo_html);
        repo_html = column_html;
        if (i % 2 == 0){
            var row_html = `<div class="row">
            {}
            </div>
            `.format(repo_html);
            repo_html = JSON.parse(JSON.stringify(row_html));
        }
        repos_html = repos_html + repo_html;
    };
    console.log(repos_html);
    var res = `
    <div class=repo-container>
    {}
    </div>
    `.format(repos_html);
    return res
}

$(document).ready(function(){
    showoff.innerHTML = fetchRepos();
});
