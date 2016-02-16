var tweetImpressions = require('tweetImpressions');

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
