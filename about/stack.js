String.prototype.format = function () {
    var i = 0, args = arguments;
    return this.replace(/{}/g, function () {
        return typeof args[i] != 'undefined' ? args[i++] : '';
    });
};
function getStackInfo() {
    var info = JSON.parse($.ajax({
                                type: "GET",
                                url: "https://api.stackexchange.com/2.2/users/8743494?order=desc&sort=reputation&site=stackoverflow",
                                async: false
                                }).responseText)
    var ret = {
        "link": info["items"][0]["link"],
        "reputation": info["items"][0]["reputation"],
        "gold": info["items"][0]["badge_counts"]["gold"],
        "silver": info["items"][0]["badge_counts"]["silver"],
        "bronze": info["items"][0]["badge_counts"]["bronze"],
    }
    return ret;
}


