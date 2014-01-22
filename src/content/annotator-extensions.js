define([], function () {
    'use strict';

    var voteEnums = {};

    /** @enum {number} */
    voteEnums.vote = {
        UNSET: 0,
        UPVOTE: 1,
        DOWNVOTE: 2
    };

    /** @enum {number} */
    voteEnums.voteToCount = {
        0: 0,
        1: 1,
        2: -1
    };

    function _downVote (vote) {
        return vote.value === voteEnums.vote.DOWNVOTE ? 1 : 0;
    }

    function _upVote (vote) {
        return vote.value === voteEnums.vote.UPVOTE ? 1 : 0;
    }

    function _scoreVote (votesObj, vote, priorVote) {
        if (priorVote) {
            votesObj.upvotes -= _upVote(priorVote);
            votesObj.downvotes -= _downVote(priorVote);
        }
        if (vote) {
            votesObj.upvotes += _upVote(vote);
            votesObj.downvotes += _downVote(vote);
        }
        votesObj.helpfulness = votesObj.upvotes - votesObj.downvotes;
    }

    function _indexOfVote (votes, vote) {
        for (var i = 0, len = votes.length; i < len; i++) {
            if (votes[i].author === vote.author) {
                return i;
            }
        }
        return -1;
    }

    function _addVote (changeSet, annotation, content) {
        var vote;
        var votes = content.votes = content.votes || {};
        var list = content.votes.list = content.votes.list || [];
        votes.upvotes = votes.upvotes || 0;
        votes.downvotes = votes.downvotes || 0;
        votes.helpfulness = votes.helpfulness || 0;

        for (var i=0, len=annotation.length; i<len; i++) {
            vote = annotation[i];
            list.push(vote);
            _scoreVote(votes, vote);
        }

        changeSet.votes = votes;
    }

    function _updatedVote (changeSet, annotation, content) {
        var j;
        var vote;
        var updateVote;
        var votes = content.votes;
        var list = content.votes.list;

        for (var i=0, len=list.length; i<len; i++) {
            vote = list[i];
            j = _indexOfVote(annotation, vote);
            if (j !== -1) {
                updateVote = annotation[j];
                _scoreVote(votes, updateVote, vote);
                list[i] = updateVote;
            }

        }

        changeSet.votes = votes;
    }

    function _removedVote (changeSet, annotation, content) {
        var votes = content.votes;
        var list = content.votes.list;

        list = list.filter(function(vote) {
            if (_indexOfVote(annotation, vote) !== -1) {
                _scoreVote(votes, false, vote);
                return false;
            }
            return true;
        });

        content.votes.list = list;
        changeSet.votes = content.votes;
    }

    function withVotes (annotator) {
        annotator.added.vote = _addVote;
        annotator.updated.vote = _updatedVote;
        annotator.removed.vote = _removedVote;
    }

    return {
        withVotes: withVotes,
        voteEnums: voteEnums
    };
});
