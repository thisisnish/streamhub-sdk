var impressionScriptLoaded = false;

/**
 * Recording of Tweet impressions
 */
function recordTwitterImpression(content) {
    if (!impressionScriptLoaded) {
        window.twttr = (function () {
            var tw = window.twttr || {}, imp = tw.impressions || {};
            imp._e = imp._e || [];
            imp.ready = imp.ready || function (callback) {
                imp._e.push(callback);
            };
            tw.impressions = imp;
            return tw;
        })();
        var impressionScript = document.createElement("script");
        impressionScript.setAttribute("src", "https://platform.twitter.com/impressions.js");
        impressionScript.setAttribute('async', true);
        document.getElementsByTagName("head")[0].appendChild(impressionScript);
        impressionScriptLoaded = true;
    }

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
