//forced to inject here as require/almond does not support dynamic load
var impressionScript = document.createElement("script");
impressionScript.setAttribute("src", "//platform.twitter.com/impressions.js");
document.getElementsByTagName("head")[0].appendChild(impressionScript);

/**
 * Recording of Tweet impressions
 */
function recordTwitterImpression(content) {
    twttr.impressions.ready(function (t) {
        t.impressions.logTweets([content.tweetId], {'partner': 'livefyre'});

        /**
         * Ensure if signal is received by twitter.
         */
        //t.impressions.attachDebugger(function myDebugger(tweetResponse) {
        //    console.log(tweetResponse);
        //});
    });
}

module.exports = {
    recordImpression: function (content) {
        switch (content.source) {
            case 'twitter':
                recordTwitterImpression(content);
                break;
            default:
        }
    }
};
